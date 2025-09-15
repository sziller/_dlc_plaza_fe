import { createApp } from 'vue';
import App from './src/App.vue';
import router from './src/router/index.js';
import 'devices.css';
import './src/index.css';
import { installSeo } from './src/plugins/seo.js'
import 'lite-youtube-embed';
import 'lite-youtube-embed/src/lite-yt-embed.css'
import './src/api/axiosSetup'
import {
  captureReferralFromURL,
  purgeLegacyReferralCookies,
} from './src/lib/referral.ts';

purgeLegacyReferralCookies();
captureReferralFromURL({ keys: ['ref', 'r', 'referral'], cleanURL: true });
const app = createApp(App)
app.use(router)
installSeo(router)
app.mount('#app');
