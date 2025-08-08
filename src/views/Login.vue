<template>
  <section class="min-h-screen bg-primary text-white px-6 pt-24 pb-16 flex flex-col justify-between">
    <div class="max-w-xl mx-auto w-full space-y-10">
      <h1 class="text-3xl font-bold text-center">Sign In</h1>

      <form class="space-y-6" @submit.prevent="submitLogin">
        <!-- Email -->
        <label>
          <span class="block mb-1 font-semibold">Email</span>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2 rounded bg-white text-black"
            required
          />
        </label>

        <!-- Password -->
        <label>
          <span class="block mb-1 font-semibold">Password</span>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 rounded bg-white text-black"
            required
          />
        </label>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="!formValid || loading"
          class="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold transition disabled:opacity-40"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>

        <!-- Error Message -->
        <div v-if="error" class="text-center text-red-400 font-semibold">{{ error }}</div>

        <!-- Centered Register Link -->
        <div class="text-center text-sm pt-4">
          <router-link to="/register" class="text-secondary hover:underline font-medium">
            Don't have an account? Register
          </router-link>
        </div>
      </form>
    </div>

    <div v-if="userProfile" class="text-center mt-10">
  <h2 class="text-2xl font-bold">Welcome, {{ userProfile.name || 'User' }}!</h2>
  <p>Email: {{ userProfile.email || 'N/A' }}</p>
  <p>Member since: {{ userProfile.created_at || 'Unknown' }}</p>
</div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAuthToken } from '../api/auth'
import { getUserProfile } from '../api/userProfile'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const auth = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const userProfile = ref<any>(null)

const formValid = computed(() => email.value && password.value)

const submitLogin = async () => {
  error.value = null
  loading.value = true
  try {
    const token = await getAuthToken(email.value, password.value)
    const profileData = await getUserProfile()
    userProfile.value = profileData.payload

    // ✅ update global reactive state so Navbar updates instantly
    auth.login(token, profileData.payload)

    console.log('Logged in successfully:', userProfile.value)
    window.dispatchEvent(new Event('auth-changed'))
    // Redirect based on auth_code
    const code = profileData.payload.auth_code
    if (code === 2) {
      router.push({ path: '/register', query: { step: '3' } })
    } else if (code === 6) {
      router.push('/btcusd')
    } else {
      router.push('/')
    }
  } catch (err: any) {
    error.value = err?.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}
</script>


