import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE = process.env.SITE_BASE || 'https://cadenabitcoin.com'
const NOINDEX = process.env.VITE_NOINDEX === '1'
const STAGING_SEO = process.env.VITE_STAGING_SEO === '1'

// Allow bots if we're prod (NOINDEX off) OR staging SEO is explicitly on
const allowBots = (!NOINDEX && /cadenabitcoin\.com$/.test(BASE)) || (STAGING_SEO && /staging\.purabitcoin\.com$/.test(BASE))

const routes = [
  '/', '/onboarding', '/how-it-works', '/faq', '/articles'
]

const distPublic = resolve('public')
mkdirSync(distPublic, { recursive: true })

const robots = allowBots
  ? `User-agent: *\nAllow: /\nSitemap: ${BASE}/sitemap.xml\n`
  : `User-agent: *\nDisallow: /\n`
writeFileSync(resolve(distPublic, 'robots.txt'), robots)

if (allowBots) {
  const urls = routes.map(p => `<url><loc>${BASE}${p}</loc></url>`).join('')
  const sm = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  writeFileSync(resolve(distPublic, 'sitemap.xml'), sm)
} else {
  // empty sitemap to avoid leaking prod routes on noindex builds
  writeFileSync(resolve(distPublic, 'sitemap.xml'), '')
}

console.log(`robots.txt: ${allowBots ? 'Allow + sitemap' : 'Disallow all'} (NOINDEX=${NOINDEX}, STAGING_SEO=${STAGING_SEO})`)
