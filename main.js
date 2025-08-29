import { createApp } from 'vue';
import App from './src/App.vue';
import router from './src/router/index.js';
import 'devices.css';
import './src/index.css';

console.log('env check:', import.meta.env.VITE_REF_DEFAULT);

createApp(App).use(router).mount('#app');
