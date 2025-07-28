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
   {path: '/technical-overview', name: 'TechnicalOverview', component: TechnicalOverview},
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
