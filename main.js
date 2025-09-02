import { createApp } from 'vue';
import App from './src/App.vue';
import router from './src/router/index.js';
import 'devices.css';
import './src/index.css';
import { installSeo } from './src/plugins/seo'

const app = createApp(App)
app.use(router)
installSeo(router)
app.mount('#app');
