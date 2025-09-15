<template>
  <div class="text-white min-h-screen">
    <Navbar />
    <router-view class="pt-20 px-4" />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useAuth } from './composables/useAuth'

const router = useRouter()
const { isLoggedIn, tokenHealth, logout } = useAuth()

function goLogin() {
  if (isLoggedIn.value) logout()
  router.push('/login')
}

// heartbeat path
watch(tokenHealth.status, (s) => {
  if (s === 'invalid') goLogin()
})
// interceptor path (any 401 → logout())
watch(isLoggedIn, (v) => {
  if (!v) router.push('/login')
})
</script>

