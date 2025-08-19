<template>
  <section class="min-h-screen bg-primary text-white px-6 pt-24 pb-16 flex flex-col justify-between">
    <!-- 🧾 Step 1: Registration Form -->
    <div v-if="step === 1" class="max-w-xl mx-auto w-full space-y-10">
      <h1 class="text-3xl font-bold text-center">Create Your Account</h1>
      <form class="space-y-6" @submit.prevent="submitForm">
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

        <!-- Confirm Password -->
        <label>
          <span class="block mb-1 font-semibold">Confirm Password</span>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            class="w-full px-4 py-2 rounded bg-white text-black"
            required
          />
        </label>

        <!-- Terms -->
        <div class="flex items-start gap-2 text-sm">
          <input type="checkbox" id="terms" v-model="accepted" class="mt-1" />
          <label for="terms" class="text-white leading-snug">
            By clicking <strong>Register</strong>, you agree to our
            <a href="/terms" class="text-secondary underline">Terms</a> and you have read our
            <a href="/privacy" class="text-secondary underline">Data Policy</a>, including our
            <a href="/cookies" class="text-secondary underline">Cookie Use</a>.
          </label>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          :disabled="!formValid || loading"
          class="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold transition disabled:opacity-40"
        >
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>

        <!-- Error Message -->
        <div v-if="error" class="text-center text-red-400 font-semibold">{{ error }}</div>

        <!-- Centered Login Link -->
        <div class="text-center text-sm pt-4">
          <router-link to="/login" class="text-secondary hover:underline font-medium">
            Already have an account? Log in
          </router-link>
        </div>
      </form>
    </div>

    <!-- 📬 Step 2: Email Sent Message -->
<div v-else-if="step === 2" class="max-w-xl mx-auto text-center space-y-6">
  <h1 class="text-3xl font-bold">Check Your Inbox</h1>
  <p class="text-lg">We've sent a confirmation link to:</p>
  <p class="text-xl text-secondary font-bold">{{ email }}</p>
  <p class="text-sm text-white/80">
    Please click the link in your email to confirm your account.
  </p>

  <!-- New: "Come back and log in" with button -->
  <div class="pt-4">
    <p class="text-base font-medium mb-3">Once confirmed, come back and log in:</p>
    <router-link
      to="/login"
      class="inline-block bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold transition"
    >
      Go to Login
    </router-link>
  </div>
</div>


    <!-- 🧭 Step 3: Scan QR -->
<div v-else-if="step === 3" class="max-w-xl mx-auto text-center space-y-6">
  <h1 class="text-3xl font-bold">Scan the QR Code</h1>
  <p class="text-lg">Scan the following QR code to complete your registration:</p>

  <div v-if="qrCode" class="mt-6">
    <div class="inline-block p-3 bg-white rounded">
      <img :src="qrCode" alt="QR" class="w-64 h-64" />
    </div>

    <!-- New: Button to login after scanning -->
    <div class="pt-6">
      <p class="text-base font-medium mb-3">Once you’ve scanned, log in to your account:</p>
      <router-link
        to="/login"
        class="inline-block bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold transition"
      >
        Go to Login
      </router-link>
    </div>
  </div>

  <p v-else class="text-sm text-white/80">Loading QR Code...</p>
</div>


    <!-- 🧭 Step Tracker -->
    <div class="mt-20 flex justify-center">
      <ol class="flex items-center gap-10 text-base font-semibold">
        <!-- Step 1 -->
        <li class="flex items-center gap-3">
          <div
            class="flex items-center justify-center size-10 rounded-full border-2 transition-all duration-300"
            :class="{
              'bg-green-600 text-white border-green-600': step > 1,
              'bg-secondary text-white border-secondary': step === 1,
              'bg-gray-200 text-gray-400 border-gray-300': step < 1
            }"
          >
            <svg
              v-if="step > 1"
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>1</span>
          </div>
          <span class="hidden sm:inline" :class="step === 1 ? 'text-white' : step > 1 ? 'text-green-500' : 'text-gray-400'">
            Register Email
          </span>
        </li>

        <!-- Step 2 -->
        <li class="flex items-center gap-3">
          <div
            class="flex items-center justify-center size-10 rounded-full border-2 transition-all duration-300"
            :class="{
              'bg-secondary text-white border-secondary': step === 2,
              'bg-gray-200 text-gray-400 border-gray-300': step < 2,
              'bg-green-600 text-white border-green-600': step > 2
            }"
          >
            <svg
              v-if="step > 1"
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else >2</span>
          </div>
          <span class="hidden sm:inline" :class="step === 2 ? 'text-white' : step < 2 ? 'text-gray-400' : 'text-green-500'">
            Confirm Email
          </span>
        </li>

        <!-- Step 3 -->
        <li class="flex items-center gap-3">
          <div
            class="flex items-center justify-center size-10 rounded-full border-2 transition-all duration-300"
            :class="{
              'bg-secondary text-white border-secondary': step === 3,
              'bg-gray-200 text-gray-400 border-gray-300': step < 3
            }"
          >
            <span>3</span>
          </div>
          <span class="hidden sm:inline" :class="step === 3 ? 'text-white' : 'text-gray-400'">Scan QR</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { registerUser } from '../api/user'
import { getUserQR } from '../api/qr'
import { getToken } from '../api/token'
import type { UserFace } from '../types/userFace'
import type { QRCodeUserResponse } from '../types/common/qrFace'
//import { useReferral } from '../composables/useReferral';
const route = useRoute()
const router = useRouter()

// UI state
const step = ref<number>(1)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const accepted = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
//const { track } = useReferral();
// QR display + meta
const qrCode = ref<string | null>(null)          // data URI for <img :src="qrCode" />
const qrJsonString = ref<string | null>(null)    // payload.string from API (raw JSON string)
const qrJson = ref<Record<string, any> | null>(null) // parsed version if you need it later

const formValid = computed(() => {
  return (
    !!email.value &&
    !!password.value &&
    confirmPassword.value === password.value &&
    accepted.value
  )
})

/**
 * Submit Step 1 (register)
 */
const submitForm = async () => {
  error.value = null
  loading.value = true
  try {
    await registerUser({
      email_address: email.value,
      password: password.value
    } as UserFace)
   // track('signup', { email: email.value });
    // Move to Step 2 (email sent) and reflect in URL
    step.value = 2
    await router.replace({ query: { ...route.query, step: '2' } })
  } catch (err: any) {
    error.value = err?.message || 'Registration failed.'
  } finally {
    loading.value = false
  }
}

/**
 * Build a valid <img src> for SVG coming from the API.
 * API returns SVG in payload.qr_code (either raw <svg ...> or percent-encoded %3Csvg ...).
 */
const buildSvgDataUri = (svgLike: string): string => {
  const val = svgLike.trim()

  // Already a correct data URI
  if (/^data:image\/svg\+xml[,;]/i.test(val)) return val

  // Raw inline SVG -> encodeURIComponent and prefix
  if (val.startsWith('<svg') || val.startsWith('<?xml')) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(val)
  }

  // Percent-encoded SVG (what you're seeing: starts with %3Csvg ...)
  if (val.startsWith('%3Csvg') || val.startsWith('%3C?xml')) {
    return 'data:image/svg+xml,' + val // already percent-encoded
  }

  // If it's a URL (unlikely per spec), just return it
  if (/^https?:\/\//i.test(val)) return val

  // Fallback: attempt to treat as raw SVG anyway
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(val)
}

/**
 * Load QR when on step 3
 */
const loadQrCode = async () => {
  error.value = null
  qrCode.value = null
  qrJsonString.value = null
  qrJson.value = null

  try {
    const token = getToken()
    if (!token) {
      // Must be logged in to fetch QR
      await router.push({
        path: '/login',
        query: { redirect: '/register', step: '3' }
      })
      return
    }

    const data: QRCodeUserResponse = await getUserQR()

    // According to spec:
    // payload:
    //   string: JSON object (as string)
    //   qr_code: SVG (raw or percent-encoded)
    const { payload } = data as any

    // Grab and display SVG
    if (!payload?.qr_code || typeof payload.qr_code !== 'string') {
      throw new Error('QR code not found in response payload.')
    }
    qrCode.value = buildSvgDataUri(payload.qr_code)

    // Keep the JSON fields accessible
    if (typeof payload.string === 'string') {
      qrJsonString.value = payload.string
      try {
        qrJson.value = JSON.parse(payload.string)
      } catch {
        // If server returns plain string (not strict JSON), ignore parse error
        qrJson.value = null
      }
    }
  } catch (err: any) {
    console.error('Error fetching QR code:', err)
    error.value = err?.message || 'Failed to load QR code.'
  }
}

/**
 * Sync local step with route query (?step=1|2|3)
 */
const syncStepFromRoute = () => {
  const stepParam = Array.isArray(route.query.step)
    ? route.query.step[0]
    : route.query.step

  if (stepParam === '3') step.value = 3
  else if (stepParam === '2') step.value = 2
  else step.value = 1
}

// Keep step in URL + trigger QR load when step 3
watch(step, async (val) => {
  const next = String(val)
  if (route.query.step !== next) {
    await router.replace({ query: { ...route.query, step: next } })
  }
  if (val === 3) await loadQrCode()
})

// React to URL changes (?step=...)
watch(
  () => route.query.step,
  () => {
    syncStepFromRoute()
  }
)

onMounted(async () => {
  syncStepFromRoute()
  if (step.value === 3) await loadQrCode()
})
</script>




