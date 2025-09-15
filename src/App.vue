<template>
  <div class="text-white min-h-screen">
    <Navbar />
    <router-view class="pt-20 px-4" />
    <!-- Always-on bottom-left chat -->
    <ChatbotWidget />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import ChatbotWidget from './components/ChatbotWidget.vue'
import { useAuth } from './composables/useAuth'

const router = useRouter()
const route = useRoute()
const { isLoggedIn, tokenHealth, logout } = useAuth()

function ensureOnLogin() {
  if (route.path !== '/login') {
    router.replace({ path: '/login', query: { next: route.fullPath } })
  }
}

function forceLogoutToLogin() {
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
</script>
