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

// Guards against a real, previously-shipped bug: if something else is
// already listening on PORT, the readiness poll below would get a 200 from
// that instead of the freshly-built preview server and silently crawl the
// wrong site (e.g. a leftover `npm run dev` — its dev-only markup like
// @vite/client and an unbundled /main.js then gets baked into every
// prerendered page's index.html in place of the real hashed assets).
async function assertPortFree() {
  try {
    await fetch(BASE_URL + '/', { signal: AbortSignal.timeout(1000) })
  } catch {
    return // nothing responded — port is free, as expected
  }
  const err = new Error(
    `Port ${PORT} is already in use by something else. Prerendering must run against a freshly-built ` +
    `\`vite preview\` on this exact port, or it will silently snapshot whatever's already there instead. ` +
    `Stop whatever's running on port ${PORT} (e.g. \`npm run dev\`) and re-run the build.`
  )
  err.portConflict = true
  throw err
}

// Tracked at module scope, not inside main(), specifically so the hard-timeout
// handler at the bottom of this file can still kill them if main() itself
// gets abandoned mid-flight — a previous version of this left the spawned
// `vite preview` process orphaned on PORT after a timeout, permanently
// blocking every subsequent build until someone manually killed it.
let activePreviewProc = null
let activeBrowser = null

async function startPreviewServer() {
  await assertPortFree()
  const proc = spawn(resolve('node_modules/.bin/vite'), ['preview', '--port', String(PORT), '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  activePreviewProc = proc
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
  activePreviewProc = null
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
  activeBrowser = browser

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
    activeBrowser = null
    activePreviewProc = null
  }
}

// Prerendering is an SEO/performance layer on top of a fully-working SPA —
// vercel.json already rewrites unprerendered routes to index.html, so a
// failure OR a hang here (e.g. a headless browser that never finishes
// launching in this build environment) shouldn't block shipping the rest of
// the build. A rejected promise alone isn't enough of a guard — a hang never
// rejects — so this races main() against a hard deadline and force-exits
// either way rather than letting the build sit until Vercel's own max
// build-time limit eventually kills it.
const HARD_TIMEOUT_MS = 90_000
const timeout = new Promise((_, reject) => {
  setTimeout(() => reject(new Error(`Prerender timed out after ${HARD_TIMEOUT_MS / 1000}s`)), HARD_TIMEOUT_MS)
})

// If main() is still mid-flight when it loses the race (e.g. stuck inside
// prerenderRoute's 20s waitForSelector), abandoning its promise does NOT
// stop it from continuing to run in the background, and process.exit()
// does not kill child processes it spawned — so without this, the preview
// server survives the exit as an orphan, permanently squatting on PORT and
// failing every subsequent build's assertPortFree() check.
function killLeftoverProcesses() {
  try { activePreviewProc?.kill() } catch {}
  try { activeBrowser?.close() } catch {}
}

Promise.race([main(), timeout]).then(
  () => process.exit(0),
  (error) => {
    killLeftoverProcesses()
    if (error?.portConflict) {
      // Unlike other failures, this one shouldn't ship silently — it means
      // the prerendered output is actively wrong (dev-server markup baked
      // into shipped HTML), not just missing. Fail the build loudly.
      console.error(error.message)
      process.exit(1)
    }
    console.error('Prerender failed — shipping without prerendered HTML for this build:', error)
    process.exit(0)
  }
)
