// Structured Data Generator for Cadena Bitcoin

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://cadenabitcoin.com/#organization',
    'name': 'Cadena Bitcoin',
    'alternateName': 'Cadena',
    'url': 'https://cadenabitcoin.com',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://cadenabitcoin.com/logo.png',
      'width': 512,
      'height': 512
    },
    'description': 'Cadena Bitcoin is a non-custodial Bitcoin lending and borrowing marketplace. Your Keys, Your Coins — access BTC-backed loans and earn yield without banks or sidechains.',
    'slogan': 'Non-Custodial Bitcoin Lending — Your Keys, Your Coins',
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
      'https://x.com/CadenaBitcoin',
      'https://github.com/CadenaBitcoin'
    ],
    'knowsAbout': [
      'Bitcoin lending',
      'Bitcoin borrowing',
      'Discreet Log Contracts',
      'DLC',
      'Non-custodial lending',
      'Self-custody Bitcoin',
      'Bitcoin-backed loans',
      'Peer-to-peer lending',
      'Bitcoin DeFi',
      'Bitcoin-native finance',
      'Bitcoin collateral',
      'Cryptocurrency lending',
      'Bitcoin yield',
      'BTC loans'
    ],
    'areaServed': {
      '@type': 'Place',
      'name': 'Worldwide'
    },
    'serviceType': [
      'Bitcoin Lending',
      'Bitcoin Borrowing',
      'DLC-Secured Loans',
      'Non-Custodial Finance'
    ]
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://cadenabitcoin.com/#website',
    'name': 'Cadena Bitcoin',
    'alternateName': 'Cadena',
    'url': 'https://cadenabitcoin.com',
    'description': 'Non-custodial Bitcoin lending and borrowing marketplace. Your Keys, Your Coins.',
    'publisher': {
      '@id': 'https://cadenabitcoin.com/#organization'
    },
    'inLanguage': 'en-US',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://cadenabitcoin.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateFinancialServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': 'https://cadenabitcoin.com/#service',
    'name': 'Cadena Bitcoin Lending',
    'description': 'Non-custodial Bitcoin-backed loans using Discreet Log Contracts (DLCs). Borrow against your Bitcoin without selling, or earn fixed yields by lending.',
    'provider': {
      '@id': 'https://cadenabitcoin.com/#organization'
    },
    'serviceType': 'Cryptocurrency Lending',
    'areaServed': 'Worldwide',
    'availableChannel': {
      '@type': 'ServiceChannel',
      'serviceUrl': 'https://cadenabitcoin.com/register',
      'serviceSmsNumber': null
    },
    'termsOfService': 'https://cadenabitcoin.com/terms',
    'feesAndCommissionsSpecification': 'Loan terms: 50% or 80% LTV, 30-365 day terms. No monthly payments. Settlement at term end.'
  };
}

export function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a
      }
    }))
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
      const schemas = [];
      const site = 'https://cadenabitcoin.com';

      // Always include Organization schema for brand consistency
      schemas.push(generateOrganizationSchema());

      // Page-specific schemas
      if (to.path === '/' || to.path === '/for-llms') {
        // Homepage and LLM page get full schema set
        schemas.push(generateWebsiteSchema());
        schemas.push(generateFinancialServiceSchema());
      } else if (to.path.includes('/article/')) {
        // Generate article-specific schema for article pages
        const image = m.image ? `${site}${m.image}` : `${site}/og-image.png`;

        schemas.push(generateArticleSchema({
          title: m.title || 'Cadena Bitcoin Article',
          description: m.description || 'Article by Cadena Bitcoin',
          author: m.author || 'Cadena Bitcoin Team',
          publishDate: m.publishedTime || new Date().toISOString(),
          modifiedDate: m.modifiedTime || new Date().toISOString(),
          url: `${site}${to.path}`,
          image: image
        }));
      } else if (to.path === '/faq') {
        // FAQ page gets FAQPage schema (populated by the component)
        schemas.push(generateWebsiteSchema());
      } else {
        // Other pages get website schema
        schemas.push(generateWebsiteSchema());
      }

      // Add each schema as a separate script tag for better parsing
      schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        script.id = `structured-data-${index}`;
        document.head.appendChild(script);
      });
    }, 0);
  });
}