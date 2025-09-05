// src/plugins/seo.js
export function installSeo(router) {
  const site = 'https://cadenabitcoin.com';
  const defaults = {
    title: 'Cadena Bitcoin',
    description:
      'Cadena Bitcoin is a decentralized Bitcoin lending and borrowing marketplace. Keep your keys, access BTC-backed loans, and earn yield without banks or sidechains.',
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  };

  router.afterEach((to) => {
    const m = to.meta || {};
    const title = m.title || defaults.title;
    const desc  = m.description || defaults.description;
    const robots = m.robots || defaults.robots;
    const canonical = site + (to.path === '/' ? '/' : to.path);

    setMeta('description', desc);
    setMeta('robots', robots);
    setTitle(title);
    setLink('canonical', canonical);

    // (Optional) social cards
    setMeta('og:title', title, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', desc);
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
