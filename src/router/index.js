import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Article1View from '../views/Article1view.vue';
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  {
    path: '/article/cadena-vs-others',
    name: 'Article1',
    component: Article1View,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
