import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE = process.env.SITE_BASE || 'https://cadenabitcoin.com'
const BLOG_SITEMAP_URL = process.env.BLOG_SITEMAP_URL || 'https://blog.cadenabitcoin.dev/api/blog/posts'
const NOINDEX = process.env.VITE_NOINDEX === '1'
const STAGING_SEO = process.env.VITE_STAGING_SEO === '1'

// Allow bots if we're prod (NOINDEX off) OR staging SEO is explicitly on
const allowBots = (!NOINDEX && /cadenabitcoin\.com$/.test(BASE)) || (STAGING_SEO && /staging\.purabitcoin\.com$/.test(BASE))

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/btcusd', priority: '0.9', changefreq: 'daily' },
  { path: '/faq', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/register', priority: '0.6', changefreq: 'monthly' },
  { path: '/cadena-paper', priority: '0.8', changefreq: 'monthly' },
  { path: '/signerapp', priority: '0.6', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/cookies', priority: '0.3', changefreq: 'yearly' },
  { path: '/knowledge-hub', priority: '0.9', changefreq: 'weekly' },
]

const distPublic = resolve('public')
mkdirSync(distPublic, { recursive: true })

const robots = allowBots
  ? `User-agent: *
Allow: /

# Block auth pages from crawling
Disallow: /login
Disallow: /loginpage
Disallow: /my-profile

# Canonical host
Host: https://cadenabitcoin.com

Sitemap: ${BASE}/sitemap.xml
`
  : `User-agent: *\nDisallow: /\n`
writeFileSync(resolve(distPublic, 'robots.txt'), robots)

const buildStaticUrls = () =>
  routes.map(route => {
    const priority = route.priority ? `<priority>${route.priority}</priority>` : ''
    const changefreq = route.changefreq ? `<changefreq>${route.changefreq}</changefreq>` : ''
    return `<url><loc>${BASE}${route.path}</loc>${priority}${changefreq}</url>`
  })

const buildBlogUrls = async () => {
  try {
    const res = await fetch(BLOG_SITEMAP_URL)
    if (!res.ok) throw new Error(`blog sitemap fetch failed: ${res.status}`)
    const data = await res.json()
    const posts = Array.isArray(data) ? data : []
    return posts
      .filter((post) => post?.slug)
      .map((post) => {
        const lastmod = post.updated_at ? `<lastmod>${post.updated_at}</lastmod>` : ''
        // Blog CMS slugs have occasionally contained raw spaces (e.g. a
        // title-cased slug that wasn't fully hyphenated), which produces an
        // invalid, unencoded URL in <loc>. Percent-encode each segment so
        // the sitemap URL stays well-formed and still resolves to the same
        // article — never alter the slug itself (e.g. space -> hyphen),
        // since the route match is on the exact stored slug.
        const safeSlug = String(post.slug).split('/').map(encodeURIComponent).join('/')
        return `<url><loc>${BASE}/article/${safeSlug}</loc>${lastmod}<changefreq>weekly</changefreq><priority>0.8</priority></url>`
      })
  } catch (error) {
    console.warn('Blog sitemap fetch failed, continuing without posts:', error?.message || error)
    return []
  }
}

if (allowBots) {
  const urls = [
    ...buildStaticUrls(),
    ...(await buildBlogUrls())
  ].join('')
  const sm = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  writeFileSync(resolve(distPublic, 'sitemap.xml'), sm)
} else {
  // empty sitemap to avoid leaking prod routes on noindex builds
  writeFileSync(resolve(distPublic, 'sitemap.xml'), '')
}

console.log(`robots.txt: ${allowBots ? 'Allow + sitemap' : 'Disallow all'} (NOINDEX=${NOINDEX}, STAGING_SEO=${STAGING_SEO})`)
