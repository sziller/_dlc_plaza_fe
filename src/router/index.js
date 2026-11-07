// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '../api/token' // <-- add this import

// Lazy-loaded views
const Home               = () => import('../views/lp/SimpleHero.vue')
const SimpleHeroLP       = () => import('../views/lp/SimpleHero.vue')
const About              = () => import('../views/About.vue')
const Article1View       = () => import('../views/Article1view.vue')
const BTCUSD             = () => import('../views/BTCUSD.vue')
const Register           = () => import('../views/Register.vue')
const Article2View       = () => import('../views/Article2view.vue')
const Contact            = () => import('../views/Contact.vue')
const FAQ                = () => import('../views/FAQ.vue')
const TechnicalOverview  = () => import('../views/TechnicalOverview.vue')
const Article3view       = () => import('../views/Article3view.vue')
const Article4view       = () => import('../views/Article4view.vue')
const Article5view       = () => import('../views/Article5view.vue')
const Article7view       = () => import('../views/Article7view.vue')
const Article8view       = () => import('../views/Article8view.vue')
const Article10view      = () => import('../views/Article10view.vue')
const Article12view      = () => import('../views/Article12view.vue')
const Article14view      = () => import('../views/Article14view.vue')
const Article15view      = () => import('../views/Article15view.vue')
const Article16view      = () => import('../views/Article16view.vue')
const Article17view      = () => import('../views/Article17view.vue')
const Article18view      = () => import('../views/Article18view.vue')
const Login              = () => import('../views/Login.vue')
const MyProfile          = () => import('../views/MyProfile.vue')
const Terms              = () => import('../views/Terms.vue')
const Privacy            = () => import('../views/Privacy.vue')
const Cookies            = () => import('../views/Cookies.vue')
const Resources          = () => import('../views/Resources.vue')
const LoanExplained      = () => import('../views/LoanExplained.vue')
const LoanExplainedLender = () => import('../views/LoanExplainedLender.vue')
const Security           = () => import('../views/Security.vue')
const Oracle              = () => import('../views/Oracle.vue')
// Blog CMS pages
const BlogListPage       = () => import('../pages/BlogListPage.vue')
const BlogPostPage       = () => import('../pages/BlogPostPage.vue')
const AdminLoginPage     = () => import('../pages/AdminLoginPage.vue')
const AdminBlogListPage  = () => import('../pages/AdminBlogListPage.vue')
const AdminBlogEditPage  = () => import('../pages/AdminBlogEditPage.vue')
const ForLLMs            = () => import('../views/ForLLMs.vue')
const Endgame            = () => import('../views/Endgame.vue')
const OrderConfirmed     = () => import('../views/OrderConfirmed.vue')
const SettlementCalculator = () => import('../views/SettlementCalculator.vue')
const LoanCalculator = () => import('../views/LoanCalculator.vue')
const LiquidationCalculator = () => import('../views/LiquidationCalculator.vue')
const Newsletter             = () => import('../views/Newsletter.vue')
const Comparison             = () => import('../views/Comparison.vue')
const BitcoinAllocationCalculator = () => import('../views/BitcoinAllocationCalculator.vue')
const EndgameStudyGuide      = () => import('../views/EndgameStudyGuide.vue')
const GetStarted             = () => import('../views/GetStarted.vue')

const hasBlogToken = () => {
  if (typeof window === 'undefined' || !window.localStorage) return false
  try {
    return Boolean(window.localStorage.getItem('blog_token'))
  } catch (error) {
    if (import.meta?.env?.DEV) {
      console.warn('Unable to access localStorage for blog token read', error)
    }
    return false
  }
}

const routes = [
  { path: '/compare', name: 'Comparison', component: Comparison, meta: {
    title: 'Bitcoin Loan Comparison: Cadena vs. Ledn, Unchained, SALT',
    description: 'An honest, sourced comparison of Bitcoin-backed loan platforms. Non-custodial DLC lending vs. custodial alternatives — rates, rehypothecation risk, margin calls, and access.',
    robots: 'index,follow',
  }},
  { path: '/endgame', name: 'Endgame', component: Endgame, meta: {
    title: 'Endgame — Bitcoin, Sovereign Debt, and the Return of Sound Capital',
    description: 'A serious framework for allocating in a Bitcoin-anchored monetary order. By Kevin Bell, Founder of Cadena Bitcoin.',
    robots: 'index,follow',
  }},
  { path: '/order-confirmed', name: 'OrderConfirmed', component: OrderConfirmed, meta: {
    title: 'Order Confirmed — Endgame by Kevin Bell',
    description: 'Your Bitcoin payment was received. Your copy of Endgame is being printed and shipped.',
    robots: 'noindex,nofollow',
  }},
  { path: '/', name: 'Home', component: Home, meta: {
    title: 'Cadena Bitcoin — Non-Custodial BTC Lending & Borrowing',
    description: 'Borrow against Bitcoin or earn yield with BTC-secured lending. Your keys, your coins. No banks, no sidechains.',
    robots: 'index,follow',
  }},
  { path: '/lp/simple-hero', name: 'LandingPageSimpleHero', component: SimpleHeroLP, meta: {
    title: 'Access Dollars Instantly — Cadena Bitcoin',
    description: 'Securely borrow dollars using your bitcoin as collateral. Keep your keys, access BTC-backed loans instantly.',
    robots: 'index,follow',
  }},
  { path: '/about', component: About, meta: {
    title: 'About — Cadena Bitcoin',
    description: 'Learn our mission and how Cadena Bitcoin works behind the scenes.',
    robots: 'index,follow',
  }},
  { path: '/for-llms', name: 'ForLLMs', component: ForLLMs, meta: {
    title: 'Cadena Bitcoin — Information for AI & LLMs',
    description: 'Structured information about Cadena Bitcoin for AI assistants and large language models. Learn about our non-custodial Bitcoin lending platform.',
    robots: 'index,follow',
  }},
  { path: '/article/cadena-decentralized-finance', name: 'Article1', component: Article1View, meta: {
    title: 'Cadena Bitcoin Finance — Article',
    description: 'What makes Cadena Bitcoin different from centralized lenders and sidechains.',
    robots: 'index,follow',
  }},
  { path: '/allocate_liquidity', name: 'BTCUSD', component: BTCUSD, meta: {
    title: 'BTC/USD — Markets • Cadena Bitcoin',
    description: 'BTCUSD page for borrowing, lending, and market details.',
    robots: 'index,follow',
  }},
  { path: '/register', name: 'Register', component: Register, meta: {
    title: 'Register — Cadena Bitcoin',
    description: 'Create your account to borrow against BTC or provide liquidity.',
    robots: 'index,follow',
  }},
  { path: '/article/cadena-improving-btc', name: 'Article2', component: Article2View, meta: {
    title: 'Improving BTC Lending — Article',
    description: 'How Cadena improves Bitcoin lending by removing intermediaries.',
    robots: 'index,follow',
  }},
  { path: '/contact', name: 'Contact', component: Contact, meta: {
    title: 'Contact — Cadena Bitcoin',
    description: 'Get in touch with the Cadena Bitcoin team.',
    robots: 'index,follow',
  }},
  { path: '/faq', name: 'FAQ', component: FAQ, meta: {
    title: 'FAQ — Cadena Bitcoin',
    description: 'Everything you need to know about Cadena Bitcoin loans and lending.',
    robots: 'index,follow',
  }},
  { path: '/security', name: 'Security', component: Security, meta: {
    title: 'How Cadena Protects Your Bitcoin — Security & Risk Model',
    description: 'Non-custodial DLC contracts, independent oracle architecture, no margin calls, and honest gap-risk disclosure. Open-source code and on-chain proof you can verify yourself.',
    robots: 'index,follow',
  }},
  { path: '/oracle', name: 'Oracle', component: Oracle, meta: {
    title: 'Cadena Oracle — How BTC/USD Settles Your Loan',
    description: 'For Cadena borrowers and lenders: how the DLCP oracle settles DLC loans, how BTC/USD is published from exchange feeds, and what you can inspect yourself.',
    robots: 'index,follow',
  }},
  // Blog CMS (Knowledge Hub)
  { path: '/knowledge-hub', name: 'BlogList', component: BlogListPage, meta: {
    title: 'Knowledge Hub — Cadena Bitcoin',
    description: 'Latest Cadena Bitcoin research, updates, and how-to guides.',
    robots: 'index,follow',
  }},
  { path: '/article/:slug', name: 'BlogPost', component: BlogPostPage, props: true, meta: {
    title: 'Article — Cadena Bitcoin',
    description: 'In-depth Knowledge Hub articles from the Cadena Bitcoin team.',
    robots: 'index,follow',
  }},
  { path: '/blog', redirect: '/knowledge-hub' },
  { path: '/blog/:slug', redirect: (to) => `/article/${to.params.slug}` },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLoginPage, meta: {
    title: 'Admin Login — Cadena Bitcoin',
    description: 'Sign in to manage Knowledge Hub articles.',
    robots: 'noindex,nofollow',
  }},
  { path: '/admin/blog', name: 'AdminBlogList', component: AdminBlogListPage, meta: {
    title: 'Admin — Knowledge Hub',
    description: 'Manage and publish Knowledge Hub articles.',
    robots: 'noindex,nofollow',
    requiresAdminAuth: true,
  }},
  { path: '/admin/blog/new', name: 'AdminBlogNew', component: AdminBlogEditPage, meta: {
    title: 'New Knowledge Hub Article — Admin',
    description: 'Create a new Knowledge Hub article.',
    robots: 'noindex,nofollow',
    requiresAdminAuth: true,
  }},
  { path: '/admin/blog/edit/:id', name: 'AdminBlogEdit', component: AdminBlogEditPage, props: true, meta: {
    title: 'Edit Knowledge Hub Article — Admin',
    description: 'Edit and publish Knowledge Hub content.',
    robots: 'noindex,nofollow',
    requiresAdminAuth: true,
  }},
  // Knowledge Hub (Resources Overview)
  { path: '/knowledge-hub-legacy', name: 'KnowledgeHub', component: Resources, meta: {
    title: 'Knowledge Hub — Cadena Bitcoin',
    description: 'Comprehensive guides on Bitcoin-backed loans, collateral lending, DeFi, and unlocking Bitcoin liquidity. Learn from DLC lending experts.',
    robots: 'noindex,nofollow',
  }},
  // Loan Explained Landing Page (retargeting)
  { path: '/loan-explained', name: 'LoanExplained', component: LoanExplained, meta: {
    title: 'How Cadena Bitcoin Loans Work — Step by Step',
    description: 'Learn how to borrow against Bitcoin without selling. Get liquidity, keep price exposure, no liquidations. See a real example with numbers.',
    robots: 'index,follow',
  }},
  // Lender Explained Landing Page (retargeting)
  { path: '/loan-explained-lender', name: 'LoanExplainedLender', component: LoanExplainedLender, meta: {
    title: 'Earn Fixed Returns Lending Bitcoin — Cadena',
    description: 'Generate 10% APR fixed returns with Bitcoin-backed lending. Guaranteed USD claims, no volatility exposure, self-enforcing DLC enforcement.',
    robots: 'index,follow',
  }},
  { path: '/cadena-paper', name: 'CadenaPaper', component: TechnicalOverview, meta: {
    title: 'Cadena Paper — Technical Overview',
    description: 'Deep dive into Cadena Bitcoin’s protocol and DLC-based design.',
    robots: 'index,follow',
  }},
  { path: '/article/cadena-empowering-financial-freedom', name: 'Article3', component: Article3view, meta: {
    title: 'Empowering Financial Freedom — Article',
    description: 'How Cadena lets you use Bitcoin flexibly while keeping self-custody.',
    robots: 'index,follow',
  }},
  { path: '/article/cadena-bitcoin-security', name: 'Article4', component: Article4view, meta: {
    title: 'Security — Article',
    description: 'Security model: self-sovereignty, decentralization, and core Bitcoin principles.',
    robots: 'index,follow',
  }},
  { path: '/article/cadena-loan-lifecycle', name: 'Article5', component: Article5view, meta: {
    title: 'Loan Lifecycle — Article',
    description: 'Step-by-step breakdown of Cadena Bitcoin loan lifecycle.',
    robots: 'index,follow',
  }},
  { path: '/article/we-need-to-talk-about-kyc', redirect: '/knowledge-hub' },
  // New Resource Articles (7-16)
  { path: '/article/borrow-against-bitcoin', name: 'Article7', component: Article7view, meta: {
    title: 'Borrow Against Bitcoin: Get Cash Without Selling BTC | Cadena',
    description: 'Borrow against your Bitcoin without selling or tax events. Rates from 4.9%, non-custodial, DLC-secured, instant approval. Unlock liquidity in minutes → [2025 Best Rates]',
    robots: 'index,follow',
    type: 'article',
    image: '/img/og-article7.webp',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'Borrow against Bitcoin without selling - Get cash instantly with DLC-secured loans',
    imageType: 'image/webp',
    author: 'Cadena Bitcoin Team',
    publishedTime: '2024-12-01T08:00:00+00:00',
    modifiedTime: '2024-12-01T08:00:00+00:00',
    section: 'Bitcoin Lending',
    tags: ['Bitcoin', 'Borrow', 'Collateral', 'Non-Custodial', 'DLC'],
  }},
  { path: '/article/bitcoin-collateral-loan', name: 'Article8', component: Article8view, meta: {
    title: 'Bitcoin Collateral Loans: Best Rates 2025 (No Credit Check) | Cadena',
    description: 'Get a Bitcoin collateral loan instantly with rates starting at 4.9%. Keep custody of your BTC, borrow up to 70% LTV, no selling required. Apply now → [Trusted by 25k+ borrowers]',
    robots: 'index,follow',
    type: 'article',
    image: '/img/og-article8.webp',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'Bitcoin collateral loans with best rates 2025 - No credit check required',
    imageType: 'image/webp',
    author: 'Cadena Bitcoin Team',
    publishedTime: '2024-12-01T08:00:00+00:00',
    modifiedTime: '2024-12-01T08:00:00+00:00',
    section: 'Bitcoin Lending',
    tags: ['Bitcoin', 'Collateral Loan', 'DeFi', 'Best Rates 2025'],
  }},
  { path: '/article/non-custodial-bitcoin-borrowing', name: 'Article10', component: Article10view, meta: {
    title: 'Non-Custodial Bitcoin Borrowing: Keep Your Keys, Get Cash | Cadena',
    description: 'Borrow against Bitcoin without ever transferring custody. DLC-secured, oracle-free liquidation, full self-custody throughout. The safest way to borrow in 2025.',
    robots: 'index,follow',
    type: 'article',
    image: '/img/og-article10.webp',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'Non-custodial Bitcoin borrowing - Keep your keys while getting cash',
    imageType: 'image/webp',
    author: 'Cadena Bitcoin Team',
    publishedTime: '2024-12-01T08:00:00+00:00',
    modifiedTime: '2024-12-01T08:00:00+00:00',
    section: 'Bitcoin Security',
    tags: ['Bitcoin', 'Non-Custodial', 'Self-Custody', 'DLC', 'Security'],
  }},
  { path: '/article/peer-to-peer-bitcoin-loans', name: 'Article12', component: Article12view, meta: {
    title: 'Peer-to-Peer Bitcoin Loans: Direct, Self-Enforcing, DLC-Secured | Cadena',
    description: 'True P2P Bitcoin loans – no middleman, no custodian. Set your own rates, get matched instantly, fully secured by Discreet Log Contracts. The purest form of Bitcoin lending.',
    robots: 'index,follow',
    type: 'article',
    image: '/img/og-article12.webp',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'Peer-to-peer Bitcoin loans - Direct, self-enforcing, DLC-secured lending',
    imageType: 'image/webp',
    author: 'Cadena Bitcoin Team',
    publishedTime: '2024-12-01T08:00:00+00:00',
    modifiedTime: '2024-12-01T08:00:00+00:00',
    section: 'DeFi',
    tags: ['Bitcoin', 'P2P', 'Peer-to-Peer', 'DLC', 'Self-Enforcing'],
  }},
  { path: '/article/dlc-bitcoin-loans', name: 'Article14', component: Article14view, meta: {
    title: 'DLC Bitcoin Loans: The Most Secure Way to Borrow BTC | Cadena',
    description: 'DLC Bitcoin loans on Cadena – self-enforcing, oracle-free, fully on-chain enforcement. No custodians, no liquidation bots, just Bitcoin script. The gold standard in Bitcoin lending.',
    robots: 'index,follow',
    type: 'article',
    image: '/img/og-article14.webp',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'DLC Bitcoin loans - The most secure way to borrow with Discreet Log Contracts',
    imageType: 'image/webp',
    author: 'Cadena Bitcoin Team',
    publishedTime: '2024-12-01T08:00:00+00:00',
    modifiedTime: '2024-12-01T08:00:00+00:00',
    section: 'Bitcoin Technology',
    tags: ['Bitcoin', 'DLC', 'Discreet Log Contracts', 'Smart Contracts', 'Security'],
  }},
  { path: '/article/bitcoin-backed-loans', name: 'Article15', component: Article15view, meta: {
    title: 'Bitcoin Backed Loans 2026: Instant USD with BTC Collateral | Cadena',
    description: 'Get USD loans backed by your Bitcoin instantly. Rates from 4.9%, up to 70% LTV, no credit check, non-custodial. Keep stacking sats while spending fiat →',
    robots: 'index,follow',
    type: 'article',
    image: '/img/og-article15.webp',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'Bitcoin backed loans 2026 - Instant USD with BTC collateral',
    imageType: 'image/webp',
    author: 'Cadena Bitcoin Team',
    publishedTime: '2024-12-01T08:00:00+00:00',
    modifiedTime: '2024-12-01T08:00:00+00:00',
    section: 'Bitcoin Lending',
    tags: ['Bitcoin', 'BTC Collateral', '2026', 'Instant Loans', 'Best Rates'],
  }},
  { path: '/article/unlock-bitcoin-liquidity', name: 'Article16', component: Article16view, meta: {
    title: 'Unlock Bitcoin Liquidity Without Selling (Tax-Free) 2026 | Cadena',
    description: 'Unlock your Bitcoin\'s liquidity without triggering capital gains tax. Borrow up to 70% LTV at the lowest rates, keep full upside, stay non-custodial. Smart money moves in 2026.',
    robots: 'index,follow',
    type: 'article',
    image: '/img/og-article16.webp',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'Unlock Bitcoin liquidity without selling - Tax-free borrowing in 2026',
    imageType: 'image/webp',
    author: 'Cadena Bitcoin Team',
    publishedTime: '2024-12-01T08:00:00+00:00',
    modifiedTime: '2024-12-01T08:00:00+00:00',
    section: 'Bitcoin Finance',
    tags: ['Bitcoin', 'Liquidity', 'Tax-Free', 'Capital Gains', '2026'],
  }},
  { path: '/article/cadena-bitcoin-presentation', name: 'Article17', component: Article17view, meta: {
    title: 'Cadena Bitcoin Presentation | Knowledge Hub',
    description: "Slide deck overview of Cadena Bitcoin’s non-custodial lending model, DLC security, and roadmap. View or download the presentation.",
    robots: 'index,follow',
    type: 'article',
    image: '/img/og-article10.webp',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'Cadena Bitcoin presentation cover',
    imageType: 'image/webp',
    author: 'Cadena Bitcoin Team',
    publishedTime: '2025-01-15T08:00:00+00:00',
    modifiedTime: '2025-01-15T08:00:00+00:00',
    section: 'Bitcoin Lending',
    tags: ['Bitcoin', 'Presentation', 'DLC', 'Non-Custodial'],
  }},
  { path: '/article/cadena-bitcoin-loan-walkthrough', name: 'Article18', component: Article18view, meta: {
    title: 'Cadena Bitcoin Loan Walkthrough Presentation | Knowledge Hub',
    description: 'Step-by-step DLC loan walkthrough: funding, signatures, and settlement on Cadena. View or download the slide deck.',
    robots: 'index,follow',
    type: 'article',
    image: '/img/og-article12.webp',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'Cadena Bitcoin loan walkthrough presentation cover',
    imageType: 'image/webp',
    author: 'Cadena Bitcoin Team',
    publishedTime: '2025-01-15T08:00:00+00:00',
    modifiedTime: '2025-01-15T08:00:00+00:00',
    section: 'Bitcoin Lending',
    tags: ['Bitcoin', 'Loan Walkthrough', 'DLC', 'Non-Custodial'],
  }},
  // Auth pages
  { path: '/login', name: 'Login', component: Login, meta: {
    title: 'Login — Cadena Bitcoin',
    description: 'Sign in to your Cadena Bitcoin account.',
    robots: 'noindex,follow',
  }},
  { path: '/my-profile', name: 'MyProfile', component: MyProfile, meta: {
    title: 'My Profile — Cadena Bitcoin',
    description: 'Manage your account and settings.',
    robots: 'noindex,nofollow',
    requiresAuth: true,
  }},
  { path: '/terms', name: 'Terms', component: Terms, meta: {
    title: 'Terms of Service — Cadena Bitcoin',
    description: 'The terms and conditions for using Cadena Bitcoin.',
    robots: 'index,follow',
  }},
  { path: '/privacy', name: 'Privacy', component: Privacy, meta: {
    title: 'Privacy Policy — Cadena Bitcoin',
    description: 'How Cadena Bitcoin handles data and privacy.',
    robots: 'index,follow',
  }},
  { path: '/cookies', name: 'Cookies', component: Cookies, meta: {
    title: 'Cookie Policy — Cadena Bitcoin',
    description: 'Learn how Cadena Bitcoin uses cookies and how to control them.',
    robots: 'index,follow',
  }},
  {
  path: '/loginpage',
  name: 'LoginPage',
  component: () => import('../views/LoginPage.vue'),
  meta: {
    title: 'Login — Cadena Bitcoin',
    description: 'Sign in to your Cadena Bitcoin account.',
    robots: 'noindex,follow',
  }
},
{
  path: '/loan-calculator',
  name: 'LoanCalculator',
  component: LoanCalculator,
  meta: {
    title: 'Loan Calculator — Cadena Bitcoin',
    description: 'Calculate how much Bitcoin you need for a Cadena loan.',
    robots: 'index,follow',
  }
},
{
  path: '/liquidation-calculator',
  name: 'LiquidationCalculator',
  component: LiquidationCalculator,
  meta: {
    title: 'Liquidation Risk Calculator — Cadena Bitcoin',
    description: 'Monte Carlo simulation showing Bitcoin loan liquidation risk vs. no-margin-call loans.',
    robots: 'index,follow',
  }
},
{
  path: '/settlement-calculator',
  name: 'SettlementCalculator',
  component: SettlementCalculator,
  meta: {
    title: 'Settlement Calculator — Cadena Bitcoin',
    description: 'Calculate your DLC payout at any BTC settlement price.',
    robots: 'index,follow',
  }
},
{
  path: '/newsletter',
  name: 'Newsletter',
  component: Newsletter,
  meta: {
    title: 'Newsletter — Cadena Bitcoin',
    description: 'Subscribe to the Cadena Bitcoin newsletter for Bitcoin education, market insights, security best practices, and product updates.',
    robots: 'index,follow',
  }
},
{
  path: '/bitcoin-allocation',
  name: 'BitcoinAllocationCalculator',
  component: BitcoinAllocationCalculator,
  meta: {
    title: 'How Much Bitcoin Should I Own? — Cadena Bitcoin',
    description: 'Kelly Criterion and Modern Portfolio Theory show why 1–5% is too small. Run the math for yourself: enter your conviction, payoff, and net worth.',
    robots: 'index,follow',
  }
},
{
  path: '/get-started',
  name: 'GetStarted',
  component: GetStarted,
  meta: {
    title: 'Get Started — Cadena Bitcoin',
    description: 'How to fund your Cadena wallet and create your first Bitcoin-backed loan.',
    robots: 'noindex,nofollow',
  }
},
{
  path: '/endgame-study-guide',
  name: 'EndgameStudyGuide',
  component: EndgameStudyGuide,
  meta: {
    title: 'Endgame Study Guide — Bitcoin, Sovereign Debt, and Sound Capital',
    description: 'Chapter summaries, key numbers, mental models, glossary, quotes, and a 14-question self-test for Endgame by Kevin Bell, CFA.',
    robots: 'index,follow',
  }
},
{
  path: '/signerapp',
  name: 'SignerApp',
  component: () => import('../views/SignerApp.vue'),
  meta: {
    title: 'Signer App — Cadena Bitcoin',
    description: 'Cadena Bitcoin signer application for secure transactions.',
    robots: 'index,follow',
  }
},
{
  // Catch-all: must stay last so every defined route above matches first.
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('../views/NotFound.vue'),
  meta: {
    title: 'Page Not Found — Cadena Bitcoin',
    description: 'The page you are looking for does not exist or may have moved.',
    robots: 'noindex,nofollow',
  }
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})

// Auth guard (use real token; redirect to existing /login)
router.beforeEach((to, _from, next) => {
  if (to.meta?.requiresAuth && !getToken()) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.meta?.requiresAdminAuth && !hasBlogToken()) {
    next({ path: '/admin/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

// Optional: X pixel page view
const shouldTrackPageViews =
  (import.meta.env.VITE_ENABLE_X_PIXEL ?? (import.meta.env.PROD ? 'true' : 'false')) === 'true'

router.afterEach(() => {
  const twq = typeof window !== 'undefined' && window.twq
  if (shouldTrackPageViews && twq) {
    twq('event', 'PageView')
  }
})

// Recover from lazy-chunk load failures (e.g., after a new deploy).
// Without this, users can click a nav item and nothing happens until they hard refresh.
let lastChunkError = { path: '', at: 0 }
router.onError((err, to) => {
  const msg = String(err?.message || '')
  const chunkFailed =
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('ChunkLoadError') ||
    msg.includes('Loading chunk')

  if (chunkFailed) {
    const target = to?.fullPath || window.location.pathname + window.location.search
    const now = Date.now()
    const recentlyRetried = lastChunkError.path === target && (now - lastChunkError.at) < 2000
    if (!recentlyRetried) {
      lastChunkError = { path: target, at: now }
      window.location.assign(target || '/')
    }
  } else {
    // eslint-disable-next-line no-console
    console.error('Router navigation error', err)
  }
})

export default router
