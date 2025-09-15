// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '../api/token' // <-- add this import

// Lazy-loaded views
const Home               = () => import('../views/Home.vue')
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
const Article6view       = () => import('../views/Article6view.vue')
const Login              = () => import('../views/Login.vue')
const MyProfile          = () => import('../views/MyProfile.vue')
const Terms              = () => import('../views/Terms.vue')
const Privacy            = () => import('../views/Privacy.vue')

const routes = [
  { path: '/', name: 'Home', component: Home, meta: {
    title: 'Cadena Bitcoin — Decentralized BTC Lending & Borrowing',
    description: 'Borrow against Bitcoin or earn yield with BTC-secured lending. Your keys, your coins. No banks, no sidechains.',
    robots: 'index,follow',
  }},
  { path: '/about', component: About, meta: {
    title: 'About — Cadena Bitcoin',
    description: 'Learn our mission and how Cadena Bitcoin works behind the scenes.',
    robots: 'index,follow',
  }},
  { path: '/article/cadena-vs-others', name: 'Article1', component: Article1View, meta: {
    title: 'Cadena vs Others — Article',
    description: 'What makes Cadena Bitcoin different from centralized lenders and sidechains.',
    robots: 'index,follow',
  }},
  { path: '/btcusd', name: 'BTCUSD', component: BTCUSD, meta: {
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
  { path: '/article/cadena-loan-lifecycle', name: 'Article4', component: Article4view, meta: {
    title: 'Loan Lifecycle — Article',
    description: 'Step-by-step breakdown of Cadena Bitcoin loan lifecycle.',
    robots: 'index,follow',
  }},
  { path: '/article/cadena-bitcoin-security', name: 'Article5', component: Article5view, meta: {
    title: 'Security — Article',
    description: 'Security model: self-sovereignty, decentralization, and core Bitcoin principles.',
    robots: 'index,follow',
  }},
  { path: '/article/we-need-to-talk-about-kyc', name: 'Article6', component: Article6view, meta: {
    title: 'We Need to Talk About KYC — Article',
    description: 'Why identification is becoming the default to access the internet.',
    robots: 'index,follow',
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

export default router
