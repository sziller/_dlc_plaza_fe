#!/usr/bin/env node
/**
 * RSS Feed Generator for Cadena Bitcoin
 * Generates an RSS/Atom feed from the router's article routes
 * 
 * Run: node scripts/gen-rss-feed.mjs
 * Output: dist/rss.xml and dist/feed.xml (Atom)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = process.env.SITE_BASE || 'https://cadenabitcoin.com';

// Article metadata (mirrors router/index.js article routes)
const articles = [
  {
    slug: 'borrow-against-bitcoin',
    title: 'Borrow Against Bitcoin: Get Cash Without Selling BTC',
    description: 'Borrow against your Bitcoin without selling or tax events. Rates from 4.9%, non-custodial, DLC-secured, instant approval.',
    publishedTime: '2024-12-01T08:00:00+00:00',
    tags: ['Bitcoin', 'Borrow', 'Collateral', 'Non-Custodial', 'DLC'],
  },
  {
    slug: 'bitcoin-collateral-loan',
    title: 'Bitcoin Collateral Loans: Best Rates 2025 (No Credit Check)',
    description: 'Get a Bitcoin collateral loan instantly with rates starting at 4.9%. Keep custody of your BTC, borrow up to 70% LTV.',
    publishedTime: '2024-12-01T08:00:00+00:00',
    tags: ['Bitcoin', 'Collateral Loan', 'DeFi', 'Best Rates 2025'],
  },
  {
    slug: 'non-custodial-bitcoin-borrowing',
    title: 'Non-Custodial Bitcoin Borrowing: Keep Your Keys, Get Cash',
    description: 'Borrow against Bitcoin without ever transferring custody. DLC-secured, oracle-free liquidation, full self-custody.',
    publishedTime: '2024-12-01T08:00:00+00:00',
    tags: ['Bitcoin', 'Non-Custodial', 'Self-Custody', 'DLC', 'Security'],
  },
  {
    slug: 'peer-to-peer-bitcoin-loans',
    title: 'Peer-to-Peer Bitcoin Loans: Direct, Trustless, DLC-Secured',
    description: 'True P2P Bitcoin loans – no middleman, no custodian. Set your own rates, get matched instantly.',
    publishedTime: '2024-12-01T08:00:00+00:00',
    tags: ['Bitcoin', 'P2P', 'Peer-to-Peer', 'DLC', 'Trustless'],
  },
  {
    slug: 'dlc-bitcoin-loans',
    title: 'DLC Bitcoin Loans: The Most Secure Way to Borrow BTC',
    description: 'DLC Bitcoin loans – trustless, oracle-free, fully on-chain enforcement. The gold standard in Bitcoin lending.',
    publishedTime: '2024-12-01T08:00:00+00:00',
    tags: ['Bitcoin', 'DLC', 'Discreet Log Contracts', 'Smart Contracts', 'Security'],
  },
  {
    slug: 'bitcoin-backed-loans',
    title: 'Bitcoin Backed Loans 2026: Instant USD with BTC Collateral',
    description: 'Get USD loans backed by your Bitcoin instantly. Rates from 4.9%, up to 70% LTV, no credit check.',
    publishedTime: '2024-12-01T08:00:00+00:00',
    tags: ['Bitcoin', 'BTC Collateral', '2026', 'Instant Loans', 'Best Rates'],
  },
  {
    slug: 'unlock-bitcoin-liquidity',
    title: 'Unlock Bitcoin Liquidity Without Selling (Tax-Free) 2026',
    description: 'Unlock your Bitcoin\'s liquidity without triggering capital gains tax. Borrow up to 70% LTV at the lowest rates.',
    publishedTime: '2024-12-01T08:00:00+00:00',
    tags: ['Bitcoin', 'Liquidity', 'Tax-Free', 'Capital Gains', '2026'],
  },
  {
    slug: 'cadena-bitcoin-presentation',
    title: 'Cadena Bitcoin Presentation',
    description: 'Slide deck overview of Cadena Bitcoin decentralized lending model, DLC security, and roadmap.',
    publishedTime: '2025-01-15T08:00:00+00:00',
    tags: ['Bitcoin', 'Presentation', 'DLC', 'Non-Custodial'],
  },
  {
    slug: 'cadena-bitcoin-loan-walkthrough',
    title: 'Cadena Bitcoin Loan Walkthrough Presentation',
    description: 'Step-by-step DLC loan walkthrough: funding, signatures, and settlement on Cadena.',
    publishedTime: '2025-01-15T08:00:00+00:00',
    tags: ['Bitcoin', 'Loan Walkthrough', 'DLC', 'Non-Custodial'],
  },
];

// Sort by date (newest first)
articles.sort((a, b) => new Date(b.publishedTime) - new Date(a.publishedTime));

const buildDate = new Date().toUTCString();
const buildDateISO = new Date().toISOString();

// Generate RSS 2.0 feed
function generateRSS() {
  const items = articles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${SITE_URL}/article/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/article/${article.slug}</guid>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${new Date(article.publishedTime).toUTCString()}</pubDate>
      <category>${article.tags.join(', ')}</category>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Cadena Bitcoin - Knowledge Hub</title>
    <link>${SITE_URL}</link>
    <description>Decentralized Bitcoin lending and borrowing. Your Keys, Your Coins. Latest articles, guides, and updates from Cadena Bitcoin.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>Cadena Bitcoin</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;
}

// Generate Atom feed
function generateAtom() {
  const entries = articles.map(article => `
  <entry>
    <title><![CDATA[${article.title}]]></title>
    <link href="${SITE_URL}/article/${article.slug}" rel="alternate" type="text/html"/>
    <id>${SITE_URL}/article/${article.slug}</id>
    <published>${article.publishedTime}</published>
    <updated>${article.publishedTime}</updated>
    <summary><![CDATA[${article.description}]]></summary>
    <author>
      <name>Cadena Bitcoin Team</name>
    </author>
    ${article.tags.map(tag => `<category term="${tag}"/>`).join('\n    ')}
  </entry>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Cadena Bitcoin - Knowledge Hub</title>
  <subtitle>Decentralized Bitcoin lending and borrowing. Your Keys, Your Coins.</subtitle>
  <link href="${SITE_URL}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <id>${SITE_URL}/</id>
  <updated>${buildDateISO}</updated>
  <author>
    <name>Cadena Bitcoin Team</name>
  </author>
  <icon>${SITE_URL}/favicon.ico</icon>
  <logo>${SITE_URL}/logo.png</logo>
  ${entries}
</feed>`;
}

// Write feeds to public directory (for dev) and dist (for build)
const publicDir = join(__dirname, '..', 'public');
const distDir = join(__dirname, '..', 'dist');

// Always write to public for dev server
writeFileSync(join(publicDir, 'rss.xml'), generateRSS());
writeFileSync(join(publicDir, 'feed.xml'), generateAtom());
console.log('✓ RSS and Atom feeds written to public/');

// Also write to dist if it exists (post-build)
try {
  mkdirSync(distDir, { recursive: true });
  writeFileSync(join(distDir, 'rss.xml'), generateRSS());
  writeFileSync(join(distDir, 'feed.xml'), generateAtom());
  console.log('✓ RSS and Atom feeds written to dist/');
} catch (e) {
  // dist may not exist during dev, that's fine
}

console.log(`✓ Generated feeds with ${articles.length} articles`);
