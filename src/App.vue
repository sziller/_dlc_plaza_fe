<template>
  <div class="text-white min-h-screen">
    <!-- Fixed navbar includes the top info strip when logged in -->
    <Navbar
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
    <router-view class="px-4" :style="{ paddingTop: contentPad }" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useAuth } from './composables/useAuth'
import { getUserProfile } from './api/userProfile'

const router = useRouter()
const route = useRoute()
const { isLoggedIn, tokenHealth, logout } = useAuth()

function ensureOnLogin () {
  if (route.path !== '/login') {
    router.replace({ path: '/login', query: { next: route.fullPath } })
  }
}

function forceLogoutToLogin () {
  if (isLoggedIn.value) logout()
  ensureOnLogin()
}

// heartbeat path: token marked invalid -> logout + to /login
watch(() => tokenHealth.status, (s) => {
  if (s === 'invalid') forceLogoutToLogin()
})

// interceptor path: any 401 should flip isLoggedIn -> false
watch(isLoggedIn, (v) => {
  if (!v) ensureOnLogin()
})

// --- Data for the navbar info strip ---
const profile = ref(null)
const loading = ref(false)
const error = ref('')
const btcUsd = ref(null) // optional; wire your price feed if you want ≈fiat

async function load () {
  loading.value = true
  error.value = ''
  try {
    profile.value = await getUserProfile()
  } catch (e) {
    error.value = e && e.message ? e.message : String(e)
    profile.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isLoggedIn.value) load()
})
watch(isLoggedIn, (v) => {
  if (v) load()
})

// --- Layout math ---
// Base navbar row height (match your Navbar.vue main row height)
const NAV_BASE_H = 80 // px
// Top info strip height (h-10)
const INFO_H = 40 // px

const contentPad = computed(() =>
  isLoggedIn.value ? `${NAV_BASE_H + INFO_H}px` : `${NAV_BASE_H}px`
)
</script>
