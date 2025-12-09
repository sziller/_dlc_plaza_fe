// src/plugins/seo.js
export function installSeo(router) {
  const site = 'https://cadenabitcoin.com';
  const defaults = {
    title: 'Cadena Bitcoin',
    description:
      'Cadena Bitcoin is a decentralized Bitcoin lending and borrowing marketplace. Keep your keys, access BTC-backed loans, and earn yield without banks or sidechains.',
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    image: '/og-homepage.png',
    locale: 'en_US',
    type: 'website',
  };

  // Predefined social media handles and additional metadata
  const socialHandles = {
    twitter: '@CadenaBitcoin',
    facebook: 'CadenaBitcoin',
  };

  router.afterEach((to) => {
    const m = to.meta || {};
    const title = m.title || defaults.title;
    const desc = m.description || defaults.description;
    const robots = m.robots || defaults.robots;
    const canonical = site + (to.path === '/' ? '/' : to.path);
    
    // Dynamic image selection
    const image = m.image || defaults.image;
    const pageType = m.type || defaults.type;
    const locale = m.locale || defaults.locale;

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
    setMeta('og:image', site + image, 'property');
    setMeta('og:locale', locale, 'property');

    // Twitter Card metadata
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', socialHandles.twitter);
    setMeta('twitter:creator', socialHandles.twitter);
    setMeta('twitter:title', title);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', site + image);

    // Additional SEO enhancements
    setMeta('theme-color', '#F7931A'); // Bitcoin orange
  });

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
}
