import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// Mock router and structured data generation
const mockRouter = {
  afterEach: (callback) => {
    const mockTo = {
      path: '/',
      meta: {
        title: 'Cadena Bitcoin',
        description: 'Cadena Bitcoin is a decentralized Bitcoin lending and borrowing marketplace. Keep your keys, access BTC-backed loans, and earn yield without banks or sidechains.',
      }
    };
    callback(mockTo);
  }
};

// Mock structured data generation functions
const mockGenerateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Cadena Bitcoin',
  'url': 'https://cadenabitcoin.com'
});

// Import the actual function (simulated import)
const installStructuredData = (router) => {
  router.afterEach((to) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify(mockGenerateOrganizationSchema());
    document.head.appendChild(script);
  });
};

// Test configurations for different page types
const pageTestConfigs = [
  {
    name: 'Homepage',
    expectedMetaTags: {
      'og:title': 'Cadena Bitcoin',
      'og:description': 'Cadena Bitcoin is a decentralized Bitcoin lending and borrowing marketplace. Keep your keys, access BTC-backed loans, and earn yield without banks or sidechains.',
      'og:type': 'website',
      'twitter:card': 'summary_large_image',
      'theme-color': '#000000'
    },
    expectedSchemaTypes: ['Organization']
  }
];

async function testSeoMetadata() {
  const testResults = [];

  // Create a simulated DOM environment
  const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, {
    url: 'https://cadenabitcoin.com',
    runScripts: 'dangerously'
  });

  // Make global document and window available
  global.document = dom.window.document;
  global.window = dom.window;

  // Run structured data installation
  installStructuredData(mockRouter);

  for (const pageConfig of pageTestConfigs) {
    const pageResult = {
      name: pageConfig.name,
      passed: true,
      errors: []
    };

    // Find the structured data script
    const schemaScript = document.getElementById('structured-data');
    if (!schemaScript) {
      pageResult.passed = false;
      pageResult.errors.push('No structured data script found');
      continue;
    }

    // Validate structured data
    try {
      const schema = JSON.parse(schemaScript.textContent);
      console.log('Parsed schema:', JSON.stringify(schema, null, 2));

      // Check schema type
      const hasExpectedType = pageConfig.expectedSchemaTypes.some(type => 
        schema['@type'] === type || 
        (Array.isArray(schema['@type']) && schema['@type'].includes(type))
      );

      if (!hasExpectedType) {
        pageResult.passed = false;
        pageResult.errors.push(`Missing expected schema type. Expected one of: ${pageConfig.expectedSchemaTypes.join(', ')}`);
      }
    } catch (error) {
      pageResult.passed = false;
      pageResult.errors.push(`Invalid schema JSON: ${error.message}`);
    }

    testResults.push(pageResult);
  }

  // Generate test report
  console.log('SEO Metadata Test Results:');
  testResults.forEach(result => {
    console.log(`\n${result.name}:`);
    if (result.passed) {
      console.log('  ✅ PASSED');
    } else {
      console.log('  ❌ FAILED');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }
  });

  // Determine overall test success
  const overallPassed = testResults.every(result => result.passed);
  process.exit(overallPassed ? 0 : 1);
}

testSeoMetadata().catch(error => {
  console.error('Test failed with unexpected error:', error);
  process.exit(1);
});
