import { createApp } from 'vue';
import App from './src/App.vue';
import router from './src/router/index.js';
import './src/index.css';
import { installSeo } from './src/plugins/seo.js'
import { installStructuredData } from './src/plugins/structured-data.js'
import './src/api/axiosSetup'
import {
  captureReferralFromURL,
  purgeLegacyReferralCookies,
} from './src/lib/referral.ts';
import {
  getCookieConsentSnapshot,
  onCookieConsentChange,
} from './src/composables/useCookieConsent.ts';

purgeLegacyReferralCookies();
captureReferralFromURL({ keys: ['ref', 'r', 'referral'], cleanURL: true });

const AMPLITUDE_KEY = '6c7ac9a4cceb973e5068aed421b47352';
let amplitudeBootstrapped = false;
let amplitudeAllowed = false;
let amp = null;

const bootstrapAmplitude = async () => {
  if (amplitudeBootstrapped) return;

  // Load base analytics immediately
  const ampModule = await import('@amplitude/analytics-browser');
  amp = ampModule;
  amp.init(AMPLITUDE_KEY, undefined, { autocapture: { elementInteractions: true } });
  amplitudeBootstrapped = true;

  // Session replay is 297KB of rrweb bundles — skip on mobile (high cost, low value)
  // and defer on desktop until the browser is idle
  const isMobile = navigator.maxTouchPoints > 1 || window.innerWidth < 768;
  if (!isMobile) {
    const defer = window.requestIdleCallback
      ? (cb) => window.requestIdleCallback(cb, { timeout: 5000 })
      : (cb) => setTimeout(cb, 3000);
    defer(async () => {
      const { sessionReplayPlugin } = await import('@amplitude/plugin-session-replay-browser');
      amp.add(sessionReplayPlugin({ sampleRate: 0.2 }));
    });
  }
};

const hasAmplitudeConsent = (state) =>
  !!(state?.preferences?.analytics || state?.preferences?.marketing);

const trackAmplitudePageView = (to) => {
  if (!amplitudeAllowed || !amp) return;
  amp.track('Page View', {
    route: to.path,
    fullPath: to.fullPath,
  });
};

const syncAmplitudeConsent = async (state) => {
  const allowed = hasAmplitudeConsent(state);
  if (allowed) {
    await bootstrapAmplitude();
    amplitudeAllowed = true;
    const currentRoute = router.currentRoute.value;
    if (currentRoute) {
      trackAmplitudePageView(currentRoute);
    }
  } else {
    amplitudeAllowed = false;
    if (amplitudeBootstrapped && amp && typeof amp.reset === 'function') {
      amp.reset();
      amplitudeBootstrapped = false;
      amp = null;
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
