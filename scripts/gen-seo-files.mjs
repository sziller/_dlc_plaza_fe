import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE = process.env.SITE_BASE || 'https://cadenabitcoin.com'
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
  // Articles
  { path: '/article/cadena-decentralized-finance', priority: '0.8', changefreq: 'monthly' },
  { path: '/article/cadena-improving-btc', priority: '0.8', changefreq: 'monthly' },
  { path: '/article/cadena-empowering-financial-freedom', priority: '0.8', changefreq: 'monthly' },
  { path: '/article/cadena-bitcoin-security', priority: '0.8', changefreq: 'monthly' },
  { path: '/article/cadena-loan-lifecycle', priority: '0.8', changefreq: 'monthly' },
  { path: '/article/we-need-to-talk-about-kyc', priority: '0.8', changefreq: 'monthly' },
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

if (allowBots) {
  const urls = routes.map(route => {
    const priority = route.priority ? `<priority>${route.priority}</priority>` : ''
    const changefreq = route.changefreq ? `<changefreq>${route.changefreq}</changefreq>` : ''
    return `<url><loc>${BASE}${route.path}</loc>${priority}${changefreq}</url>`
  }).join('')
  const sm = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  writeFileSync(resolve(distPublic, 'sitemap.xml'), sm)
} else {
  // empty sitemap to avoid leaking prod routes on noindex builds
  writeFileSync(resolve(distPublic, 'sitemap.xml'), '')
}

console.log(`robots.txt: ${allowBots ? 'Allow + sitemap' : 'Disallow all'} (NOINDEX=${NOINDEX}, STAGING_SEO=${STAGING_SEO})`)
