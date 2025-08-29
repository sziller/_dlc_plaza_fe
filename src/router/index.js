// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Article1View from '../views/Article1view.vue';
import BTCUSD from '../views/BTCUSD.vue';
import Register from '../views/Register.vue';
import Article2View from '../views/Article2view.vue';
import Contact from '../views/Contact.vue';
import FAQ from '../views/FAQ.vue';
import TechnicalOverview from '../views/TechnicalOverview.vue';
import Article3view from '../views/Article3view.vue';
import Article4view from '../views/Article4view.vue';
import Article5view from '../views/Article5view.vue';
import Article6view from '../views/Article6view.vue';
import Login from '../views/Login.vue';
import MyProfile from '../views/MyProfile.vue';
import Terms from '../views/Terms.vue';
import Privacy from '../views/Privacy.vue';


import { maybeCaptureFromQuery } from '../lib/referral';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/article/cadena-vs-others', name: 'Article1', component: Article1View },
  { path: '/btcusd', name: 'BTCUSD', component: BTCUSD },
  { path: '/register', name: 'Register', component: Register },
  { path: '/article/cadena-improving-btc', name: 'Article2', component: Article2View },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/faq', name: 'FAQ', component: FAQ },
  { path: '/cadena-paper', name: 'CadenaPaper', component: TechnicalOverview },
  { path: '/article/cadena-empowering-financial-freedom', name: 'Article3', component: Article3view },
  { path: '/article/cadena-loan-lifecycle', name: 'Article4', component: Article4view },
  { path: '/article/cadena-bitcoin-security', name: 'Article5', component: Article5view },
  { path: '/article/we-need-to-talk-about-kyc', name: 'Article6', component: Article6view },
  { path: '/login', name: 'Login', component: Login },
  { path: '/my-profile', name: 'MyProfile', component: MyProfile },
  { path: '/terms', name: 'Terms', component: Terms },
  { path: '/privacy', name: 'Privacy', component: Privacy },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 }; },
});

// --- Referral guard (only when logged out) ---
function isLoggedIn() {
  return !!localStorage.getItem('auth_token'); // swap with your real check later
}

const referralsEnabled =
  (import.meta.env.VITE_REF_ENABLED ??
    (import.meta.env.PROD ? 'true' : 'true')) === 'true';

router.beforeEach((to, _from, next) => {
  if (referralsEnabled && !isLoggedIn()) {
    // Vue Router gives a plain object for "to.query"
    console.log('[referral] beforeEach fired', { path: to.fullPath, query: to.query });

    maybeCaptureFromQuery(to.query);
  }
  next();
});

// --- Your existing Pixel tracking (JS-safe) ---
const shouldTrackPageViews =
  (import.meta.env.VITE_ENABLE_X_PIXEL ??
    (import.meta.env.PROD ? 'true' : 'false')) === 'true';

router.afterEach(() => {
  const twq = window && window.twq;
  if (shouldTrackPageViews && twq) {
    twq('event', 'PageView');
  }
});

export default router;
