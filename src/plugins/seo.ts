import type { Router } from 'vue-router'

export function installSeo(router: Router) {
  const ensureTag = (sel: string, props: Record<string, string>) => {
    let el = document.head.querySelector(sel) as HTMLElement | null
    if (!el) {
      el = document.createElement(sel.startsWith('meta') ? 'meta' : 'link')
      document.head.appendChild(el)
    }
    Object.entries(props).forEach(([k, v]) => (el as any).setAttribute(k, v))
    return el
  }

  const setTags = (fullPath: string) => {
    const rawHost = location.hostname
    const host = rawHost.replace(/^www\./, '')

    // Treat both prod hosts as "prod"
    const isProd = host === 'cadenabitcoin.com' || host === 'purabitcoin.com'

    const isStagingHost = host === 'staging.purabitcoin.com'
    const isVercelPreview = /\.vercel\.app$/.test(host)

    const forceNoindex = import.meta.env.VITE_NOINDEX === '1'
    const stagingSeoOn = import.meta.env.VITE_STAGING_SEO === '1' // allow indexing on staging when true

    // Robots policy
    const allowIndex =
      (isProd && !forceNoindex) ||
      (isStagingHost && stagingSeoOn && !forceNoindex)

    const robots = (allowIndex && !isVercelPreview) ? 'index, follow' : 'noindex, nofollow, noarchive'

    // Canonical
    // - Prod → canonical to apex prod
    // - Staging with SEO → canonical to staging
    // - Everything else → canonical to prod apex
    const canonicalHref =
      isProd
        ? `${location.protocol}//cadenabitcoin.com${fullPath}`
        : (isStagingHost && stagingSeoOn)
            ? `${location.protocol}//${host}${fullPath}`
            : `${location.protocol}//cadenabitcoin.com${fullPath}`

    ensureTag('link[rel="canonical"]', { rel: 'canonical', href: canonicalHref })
    ensureTag('meta[name="robots"]', { name: 'robots', content: robots })
    ensureTag('meta[property="og:url"]', { property: 'og:url', content: canonicalHref })
    ensureTag('meta[name="twitter:url"]', { name: 'twitter:url', content: canonicalHref })
  }
const token = import.meta.env.VITE_GSC_VERIFY
if (token) {
  ensureTag('meta[name="google-site-verification"]', {
    name: 'google-site-verification',
    content: token
  })
}
  router.afterEach((to) => setTags(to.fullPath))
  setTags(router.currentRoute.value.fullPath)
}
