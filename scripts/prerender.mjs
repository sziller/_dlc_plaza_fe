// Post-build step: snapshots every indexable route's fully-rendered HTML
// into dist/<route>/index.html, so crawlers get real per-page <title>,
// <meta>, and JSON-LD without executing JS. Vue still mounts on top of the
// snapshot for interactivity, same as it does over the plain SPA shell today.
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

// Port 3000 matches this project's dev-server port (vite.config.mjs) and is
// the one origin the blog API's CORS whitelist actually allows for local
// requests — production allows https://cadenabitcoin.com, nothing else.
const PORT = 3000
const BASE_URL = `http://localhost:${PORT}`
const DIST_DIR = resolve('dist')
const BLOG_SITEMAP_URL = process.env.BLOG_SITEMAP_URL || 'https://blog.cadenabitcoin.dev/api/blog/posts'

async function startPreviewServer() {
  const proc = spawn(resolve('node_modules/.bin/vite'), ['preview', '--port', String(PORT), '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  proc.stderr.on('data', (d) => process.stderr.write(d))

  const deadline = Date.now() + 20000
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE_URL + '/')
      if (res.ok) return proc
    } catch {
      // preview server not up yet
    }
    await new Promise((r) => setTimeout(r, 300))
  }
  proc.kill()
  throw new Error('Timed out waiting for `vite preview` to start')
}

async function fetchBlogSlugs() {
  try {
    const res = await fetch(BLOG_SITEMAP_URL)
    if (!res.ok) throw new Error(`status ${res.status}`)
    const data = await res.json()
    return (Array.isArray(data) ? data : []).map((post) => post?.slug).filter(Boolean)
  } catch (error) {
    console.warn('Prerender: blog slug fetch failed, skipping article pages:', error?.message || error)
    return []
  }
}

function outputFileFor(routePath) {
  if (routePath === '/') return resolve(DIST_DIR, 'index.html')
  const clean = routePath.replace(/\/$/, '')
  return resolve(DIST_DIR, `.${clean}`, 'index.html')
}

async function prerenderRoute(page, routePath) {
  await page.goto(BASE_URL + routePath, { waitUntil: 'load', timeout: 30000 })
  await page.evaluate(() => window.__router?.isReady())
  // Every indexable page should render a real <h1> — for statically-known
  // content this resolves almost immediately, but CMS-backed pages (e.g.
  // blog posts) fetch their content after mount, so this is a hard wait,
  // not a best-effort one: a page that never gets an h1 should fail loudly
  // rather than silently ship a loading-skeleton snapshot.
  await page.waitForSelector('#app h1', { timeout: 20000 })
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 })
  } catch {
    // some pages (e.g. live price polling) never go fully idle — best effort
  }
  const html = await page.content()
  const outFile = outputFileFor(routePath)
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, html)
  return outFile
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    throw new Error('dist/ not found — run the build before prerendering')
  }

  console.log('Prerender: starting preview server...')
  const previewProc = await startPreviewServer()
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage()
    await page.addInitScript(() => {
      window.__PRERENDER__ = true
    })
    await page.goto(BASE_URL + '/', { waitUntil: 'load', timeout: 30000 })
    await page.evaluate(() => window.__router?.isReady())

    const routeRecords = await page.evaluate(() =>
      window.__router.getRoutes().map((r) => ({ path: r.path, meta: r.meta, hasRedirect: !!r.redirect }))
    )

    const staticPaths = routeRecords
      .filter((r) => !r.hasRedirect)
      .filter((r) => !r.path.includes(':'))
      .filter((r) => !(r.meta?.robots || '').includes('noindex'))
      .map((r) => r.path)

    const blogSlugs = await fetchBlogSlugs()
    const blogPaths = blogSlugs.map((slug) => `/article/${slug}`)

    const paths = [...new Set([...staticPaths, ...blogPaths])]
    // Render '/' last so the SPA-fallback shell `vite preview` uses for
    // not-yet-rendered routes stays pristine until everything else is done.
    paths.sort((a, b) => (a === '/' ? 1 : b === '/' ? -1 : 0))

    console.log(`Prerender: snapshotting ${paths.length} routes...`)
    let ok = 0
    for (const routePath of paths) {
      try {
        const outFile = await prerenderRoute(page, routePath)
        ok++
        console.log(`  ✓ ${routePath} -> ${outFile.replace(DIST_DIR, 'dist')}`)
      } catch (error) {
        console.warn(`  ✗ ${routePath} failed:`, error?.message || error)
      }
    }

    console.log(`Prerender: ${ok}/${paths.length} routes snapshotted.`)
    if (ok === 0) {
      throw new Error('Prerendering produced zero pages — aborting so a broken build is not shipped')
    }
  } finally {
    await browser.close()
    previewProc.kill()
  }
}

main().catch((error) => {
  console.error('Prerender failed:', error)
  process.exit(1)
})
