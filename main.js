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
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

purgeLegacyReferralCookies();
captureReferralFromURL({ keys: ['ref', 'r', 'referral'], cleanURL: true });

// Initialize Amplitude once
if (!window.amplitudeInitialized) {
  amplitude.add(sessionReplayPlugin({sampleRate: 1}));
  amplitude.init('6c7ac9a4cceb973e5068aed421b47352', {"autocapture":true});
  window.amplitudeInitialized = true;
}

const app = createApp(App)
app.use(router)
installSeo(router)
router.afterEach((to) => {
  // Call plausible('pageview') to track navigation within the SPA
  window.plausible?.('pageview', { u: location.origin + to.fullPath });
  
  // Track page views with Amplitude
  amplitude.track('Page View', {
    route: to.path,
    fullPath: to.fullPath
  });
});
app.mount('#app');
