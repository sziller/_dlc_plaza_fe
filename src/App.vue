<template>
  <div class="text-white min-h-screen">
    <ServerStatusBanner />

    <!-- Fixed navbar includes the top info strip when logged in -->
    <Navbar
      v-if="!hideChrome"
      :is-logged-in="isLoggedIn"
      :email="profile?.payload?.email || ''"
      :balance-derived-sats="profile?.payload?.balance_derived"
      :balance-onchain-sats="profile?.payload?.balance_onchain"
      :loading="loading"
      :error="error"
      :btc-usd="btcUsd"
      :show-fiat="true"
      @retry="load"
    />

    <!-- Page content: pad for navbar base + (optional) info strip -->
    <div :style="{ paddingTop: hideChrome ? '0' : contentPad }">
      <router-view />
    </div>
    <CookieBanner />
    <ChatBot v-if="!hideChrome" />
    <MailingListModal
      :open="showExitPopup"
      @close="dismissExitPopup"
      @submitted="markExitSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import CookieBanner from './components/CookieBanner.vue'
import ServerStatusBanner from './components/ServerStatusBanner.vue'

const ChatBot = defineAsyncComponent(() => import('./components/ChatBot.vue'))
const MailingListModal = defineAsyncComponent(() => import('./components/MailingListModal.vue'))
import { useAuth } from './composables/useAuth'
import { useExitIntent } from './composables/useExitIntent'

const router = useRouter()
const route = useRoute()

// Pull everything from the single auth source of truth
const {
  isLoggedIn,
  tokenHealth,
  logout,
  user,               // reactive: the cached/fetched profile payload (or null)
  setUserFromApi,     // fetch/refresh the profile + cache it
  loading: authLoading,
  error: authError,
} = useAuth()

const EXCLUDED_PATHS = new Set(['/login', '/loginpage', '/register', '/admin/login', '/signerapp'])

const hideChrome = computed(() => false)

const exitIntentEnabled = computed(() => {
  return !isLoggedIn.value && !EXCLUDED_PATHS.has(route.path)
})

const { showPopup: showExitPopup, dismiss: dismissExitPopup, markSubmitted: markExitSubmitted } =
  useExitIntent({ enabled: exitIntentEnabled })

// Keep your existing guards
function ensureOnLogin () {
  if (route.path !== '/login') {
    router.replace({ path: '/login', query: { next: route.fullPath } })
  }
}
function forceLogoutToLogin () {
  if (isLoggedIn.value) logout()
  if (route.meta?.requiresAuth) ensureOnLogin()
}

// Heartbeat → logout on invalid
watch(() => tokenHealth.status, (s) => {
  if (s === 'invalid') forceLogoutToLogin()
})

// Any path that flips logged-in false → ensure we’re on /login
watch(isLoggedIn, (v) => {
  if (!v && route.meta?.requiresAuth) ensureOnLogin()
})

// ----- Navbar data (from auth) -----
// Keep the same shape the template expects: profile?.payload.??
const profile = computed(() => {
  const u = user.value
  if (!u) return null
  // Support both shapes: either user is already the payload, or it's { payload: payload }
  const payload = u?.payload ?? u
  return { payload }
})

// Reflect `useAuth` loading/error so the info strip stays accurate
const loading = computed(() => !!authLoading.value)
const error   = computed(() => String(authError.value || ''))

// Optional BTCUSD (you can wire your feed later)
const btcUsd = ref(null)

// Retry handler for the Navbar info strip
async function load () {
  // Ask the composable to refresh the canonical instance
  await setUserFromApi()
}

// On mount: if we’re logged in but don’t have a cached profile yet, fetch once
onMounted(async () => {
  if (isLoggedIn.value && !user.value) {
    await setUserFromApi()
  }
})
watch(isLoggedIn, async (v) => {
  if (v && !user.value) {
    await setUserFromApi()
  }
})

// ----- Layout padding -----
// Read CSS variables from Navbar (with fallbacks) instead of hard-coding
const navH = ref(80)
const infoH = ref(0)

function syncPadFromCssVars () {
  const cs = getComputedStyle(document.documentElement)
  const nh = parseFloat(cs.getPropertyValue('--nav-h')) || 80
  const ih = parseFloat(cs.getPropertyValue('--info-h')) || 0
  navH.value = nh
  // Only add info strip when logged in (Navbar hides it otherwise)
  infoH.value = isLoggedIn.value ? ih : 0
}

// Recompute on mount, login changes, and on resize
onMounted(() => {
  syncPadFromCssVars()
  window.addEventListener('resize', syncPadFromCssVars, { passive: true })
})
watch(isLoggedIn, () => syncPadFromCssVars())

// Compute the pad-top the page needs beneath the fixed bars
// Remove top padding so sections sit flush under the fixed navbar
const contentPad = computed(() => {
  // still observe nav/info heights so reactivity stays in sync (even though we render without top padding)
  void navH.value; void infoH.value;
  return '0px'
})
</script>
