import { createApp } from 'vue';
import App from './src/App.vue';
import router from './src/router/index.js';
import 'devices.css';
import './src/index.css';
import { installSeo } from './src/plugins/seo.js'
import { installStructuredData } from './src/plugins/structured-data.js'
import 'lite-youtube-embed';
import 'lite-youtube-embed/src/lite-yt-embed.css'
import './src/api/axiosSetup'
import {
  captureReferralFromURL,
  purgeLegacyReferralCookies,
} from './src/lib/referral.ts';
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';
import {
  getCookieConsentSnapshot,
  onCookieConsentChange,
} from './src/composables/useCookieConsent.ts';

purgeLegacyReferralCookies();
captureReferralFromURL({ keys: ['ref', 'r', 'referral'], cleanURL: true });

const AMPLITUDE_KEY = '6c7ac9a4cceb973e5068aed421b47352';
let amplitudeBootstrapped = false;
let amplitudeAllowed = false;

const bootstrapAmplitude = () => {
  if (amplitudeBootstrapped) return;
  amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
  amplitude.init(AMPLITUDE_KEY, undefined, {
    autocapture: {
      elementInteractions: true,
    },
  });
  amplitudeBootstrapped = true;
};

const hasAmplitudeConsent = (state) =>
  !!(state?.preferences?.analytics || state?.preferences?.marketing);

const trackAmplitudePageView = (to) => {
  if (!amplitudeAllowed) return;
  amplitude.track('Page View', {
    route: to.path,
    fullPath: to.fullPath,
  });
};

const syncAmplitudeConsent = (state) => {
  const allowed = hasAmplitudeConsent(state);
  if (allowed) {
    bootstrapAmplitude();
    amplitudeAllowed = true;
    const currentRoute = router.currentRoute.value;
    if (currentRoute) {
      trackAmplitudePageView(currentRoute);
    }
  } else {
    amplitudeAllowed = false;
    if (amplitudeBootstrapped && typeof amplitude.reset === 'function') {
      amplitude.reset();
      amplitudeBootstrapped = false;
    }
  }
};

syncAmplitudeConsent(getCookieConsentSnapshot());
onCookieConsentChange(syncAmplitudeConsent);

const app = createApp(App)
app.use(router)
installSeo(router)
installStructuredData(router)
router.afterEach((to) => {
  // Call plausible('pageview') to track navigation within the SPA
  window.plausible?.('pageview', { u: location.origin + to.fullPath });

  // Track page views with Amplitude (only after consent)
  trackAmplitudePageView(to);
});
app.mount('#app');
