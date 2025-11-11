// Structured Data Generator for Cadena Bitcoin

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Cadena Bitcoin',
    'url': 'https://cadenabitcoin.com',
    'logo': 'https://cadenabitcoin.com/logo.png',
    'description': 'Decentralized Bitcoin lending and borrowing marketplace',
    'foundingDate': '2023',
    'founders': [{
      '@type': 'Person',
      'name': 'Cadena Bitcoin Team'
    }],
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'Customer Support',
      'email': 'support@cadenabitcoin.com'
    },
    'sameAs': [
      'https://twitter.com/CadenaBitcoin',
      'https://github.com/CadenaBitcoin'
    ]
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Cadena Bitcoin',
    'url': 'https://cadenabitcoin.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://cadenabitcoin.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'author': {
      '@type': 'Person',
      'name': article.author || 'Cadena Bitcoin Team'
    },
    'datePublished': article.publishDate,
    'dateModified': article.modifiedDate,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': article.url
    },
    'image': article.image
  };
}

export function installStructuredData(router) {
  router.afterEach((to) => {
    // Wait for the next tick to ensure DOM is ready
    setTimeout(() => {
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => script.remove());

      const m = to.meta || {};
      let schema;

      // Default to Organization schema for homepage
      if (to.path === '/') {
        schema = generateOrganizationSchema();
      } else if (to.path.includes('/article/')) {
        // Generate article-specific schema for article pages
        schema = generateArticleSchema({
          title: m.title || 'Cadena Bitcoin Article',
          description: m.description || 'Article by Cadena Bitcoin',
          author: 'Cadena Bitcoin Team',
          publishDate: new Date().toISOString(),
          url: `https://cadenabitcoin.com${to.path}`,
          image: '/og-image.png'
        });
      } else {
        // Fallback to website schema for other pages
        schema = generateWebsiteSchema();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      script.id = 'structured-data';
      document.head.appendChild(script);
    }, 0);
  });
}