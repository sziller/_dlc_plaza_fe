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

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  {
    path: '/article/cadena-vs-others',
    name: 'Article1',
    component: Article1View,
  },
  { path: '/btcusd', name: 'BTCUSD', component: BTCUSD },
  { path: '/register', name: 'Register', component: Register},
   {path: '/article/cadena-improving-btc', name: 'Article2', component: Article2View},
   {path: '/contact', name: 'Contact', component: Contact},
   {path: '/faq', name: 'FAQ', component: FAQ},
   {path: '/cadena-paper', name: 'CadenaPaper', component: TechnicalOverview},
   {path: '/article/cadena-empowering-financial-freedom', name: 'Article3', component: Article3view},
   {path: '/article/cadena-loan-lifecycle', name: 'Article4', component: Article4view},
   {path: '/article/cadena-bitcoin-security', name: 'Article5', component: Article5view},
   {path : '/article/we-need-to-talk-about-kyc', name: 'Article6', component: Article6view},
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
