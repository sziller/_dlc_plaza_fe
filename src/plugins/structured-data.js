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

// schema.org's LoanOrCredit — the correct type for a lending product (unlike
// generic Product, which implies price/reviews/stock for physical goods).
export function generateLoanSchema(loan) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LoanOrCredit',
    'name': loan.name,
    'description': loan.description,
    'provider': {
      '@id': 'https://cadenabitcoin.com/#organization'
    },
    'loanType': 'Bitcoin-backed loan',
    'loanTerm': {
      '@type': 'QuantitativeValue',
      'value': loan.termDays,
      'unitCode': 'DAY'
    },
    'interestRate': loan.aprPercent,
    'requiredCollateral': `Bitcoin (BTC) at ${loan.ltvPercent}% loan-to-value`,
    'recourseLoan': false,
    'url': loan.url
  };
}

// Creates or updates a script[type="application/ld+json"] tag by a stable id,
// so callers can upsert their own schema without clobbering ones owned by
// other callers (the router's base schemas vs. a page component's own).
export function setSchema(id, schema) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
}

export function removeSchema(id) {
  document.getElementById(id)?.remove();
}

export function installStructuredData(router) {
  router.afterEach((to) => {
    // Wait for the next tick to ensure DOM is ready
    setTimeout(() => {
      const m = to.meta || {};
      const site = 'https://cadenabitcoin.com';

      setSchema('structured-data-organization', generateOrganizationSchema());

      if (to.path === '/' || to.path === '/for-llms') {
        setSchema('structured-data-website', generateWebsiteSchema());
        setSchema('structured-data-financial-service', generateFinancialServiceSchema());
      } else {
        setSchema('structured-data-website', generateWebsiteSchema());
        removeSchema('structured-data-financial-service');
      }

      if (to.path.includes('/article/')) {
        const image = m.image
          ? (/^https?:\/\//.test(m.image) ? m.image : `${site}${m.image}`)
          : `${site}/og-image.png`;

        // Generic baseline from route meta — BlogPostPage.vue overwrites this
        // same id with the real post's data once it finishes loading.
        setSchema('structured-data-article', generateArticleSchema({
          title: m.title || 'Cadena Bitcoin Article',
          description: m.description || 'Article by Cadena Bitcoin',
          author: m.author || 'Cadena Bitcoin Team',
          publishDate: m.publishedTime || new Date().toISOString(),
          modifiedDate: m.modifiedTime || new Date().toISOString(),
          url: `${site}${to.path}`,
          image
        }));
      } else {
        removeSchema('structured-data-article');
      }

      // Page-owned schema (FAQPage, LoanOrCredit) is added by the page
      // component itself once mounted/loaded. Clear it here when navigating
      // away so it doesn't leak onto unrelated pages.
      if (to.path !== '/faq') removeSchema('structured-data-faq');
      if (to.path !== '/allocate_liquidity') removeSchema('structured-data-loan');
    }, 0);
  });
}
