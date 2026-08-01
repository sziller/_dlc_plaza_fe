// src/plugins/seo.js
const SITE = 'https://cadenabitcoin.com';
const DEFAULTS = {
  title: 'Cadena Bitcoin',
  description:
    'Cadena Bitcoin is a non-custodial Bitcoin lending and borrowing marketplace. Keep your keys, access BTC-backed loans, and earn yield without banks or sidechains.',
  robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  image: '/cadena_og_image.png',
  locale: 'en_US',
  type: 'website',
};
const SOCIAL_HANDLES = {
  twitter: '@CadenaBitcoin',
  facebook: 'CadenaBitcoin',
};

function setTitle(t){ document.title = t; }
function setLink(rel, href){
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el){ el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}
function setMeta(name, content, attr = 'name'){
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el){ el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
// Resolves against SITE only for site-relative paths — CMS content (e.g.
// blog post hero images) supplies already-absolute CDN URLs.
function resolveUrl(u){ return /^https?:\/\//.test(u) ? u : SITE + u; }

// Applies a meta object (same shape as vue-router route.meta) to the DOM.
// Used both by the router's afterEach hook for static routes, and directly
// by CMS-backed pages (e.g. BlogPostPage) once their async data has loaded,
// since route meta alone can't know a dynamic page's real title/description.
export function applySeoMeta(path, meta) {
  const m = meta || {};
  const title = m.title || DEFAULTS.title;
  const desc = m.description || DEFAULTS.description;
  const robots = m.robots || DEFAULTS.robots;
  // Normalize: remove trailing slash except for root
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
  const canonical = SITE + normalizedPath;

  const image = m.image || DEFAULTS.image;
  const pageType = m.type || DEFAULTS.type;
  const locale = m.locale || DEFAULTS.locale;

  // Standard meta tags
  setMeta('description', desc);
  setMeta('robots', robots);
  setTitle(title);
  setLink('canonical', canonical);

  // Open Graph metadata
  setMeta('og:title', title, 'property');
  setMeta('og:description', desc, 'property');
  setMeta('og:url', canonical, 'property');
  setMeta('og:site_name', 'Cadena Bitcoin', 'property');
  setMeta('og:type', pageType, 'property');
  setMeta('og:image', resolveUrl(image), 'property');
  setMeta('og:image:secure_url', resolveUrl(image), 'property');
  setMeta('og:image:width', m.imageWidth || '1200', 'property');
  setMeta('og:image:height', m.imageHeight || '630', 'property');
  setMeta('og:image:alt', m.imageAlt || desc, 'property');
  setMeta('og:image:type', m.imageType || 'image/webp', 'property');
  setMeta('og:locale', locale, 'property');

  // Twitter Card metadata
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:site', SOCIAL_HANDLES.twitter);
  setMeta('twitter:creator', SOCIAL_HANDLES.twitter);
  setMeta('twitter:title', title);
  setMeta('twitter:description', desc);
  setMeta('twitter:image', resolveUrl(image));

  // Article-specific metadata (only for article type)
  if (pageType === 'article') {
    if (m.publishedTime) setMeta('article:published_time', m.publishedTime, 'property');
    if (m.modifiedTime) setMeta('article:modified_time', m.modifiedTime, 'property');
    if (m.author) setMeta('article:author', m.author, 'property');
    if (m.section) setMeta('article:section', m.section, 'property');
    if (m.tags && Array.isArray(m.tags)) {
      // Remove existing article:tag metas first
      document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
      // Add new tags
      m.tags.forEach(tag => {
        const el = document.createElement('meta');
        el.setAttribute('property', 'article:tag');
        el.setAttribute('content', tag);
        document.head.appendChild(el);
      });
    }
  }

  // Additional SEO enhancements
  setMeta('theme-color', '#000000'); // primary
}

export function installSeo(router) {
  router.afterEach((to) => {
    applySeoMeta(to.path, to.meta);
  });
}
