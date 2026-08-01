<template>
  <section class="min-h-screen text-white pt-8 pb-8 px-6 flex flex-col gap-8 bg-page-gradient">
    <!-- 🧾 Step 1: Registration Form -->
    <div v-if="step === 1" class="max-w-xl mx-auto w-full space-y-6">
      <h1 class="text-3xl font-bold text-center">Create Your Account</h1>
      <p class="text-sm text-white/70 text-center">
        You’re just a few steps away from your Bitcoin loan.
      </p>

      <!-- Signer App pre-warning -->
      <div class="flex items-start gap-4 p-4 rounded-2xl border border-secondary/30 bg-secondary/10">
        <svg class="w-6 h-6 text-secondary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
        </svg>
        <div class="space-y-2 min-w-0">
          <p class="text-sm font-semibold text-white">You’ll need the Cadena Signer App</p>
          <p class="text-xs text-white/70 leading-relaxed">
            Your Bitcoin keys stay on your phone — the free <strong class="text-white">Cadena Signer</strong> app holds them and signs every transaction so only you can authorize fund movement. You’ll use it to pair your self-custodial wallet with your Cadena account.
          </p>
          <div class="flex items-start justify-center gap-6 pt-1 flex-wrap">
            <!-- iOS -->
            <div class="flex flex-col items-center gap-1.5">
              <div class="p-1.5 bg-white rounded-lg">
                <img v-if="appStoreQR" :src="appStoreQR" alt="App Store QR code" class="w-20 h-20 block" />
                <div v-else class="w-20 h-20 bg-gray-100 animate-pulse rounded" />
              </div>
              <div style="height:52px;display:flex;align-items:center">
                <a href="https://apps.apple.com/us/app/cadena-bitcoin/id6753348211?itscg=30200&itsct=apps_box_badge&mttnsubad=6753348211" target="_blank" rel="noopener" aria-label="Download on the App Store" style="display:inline-block;line-height:0">
                  <img src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1760227200" alt="Download on the App Store" style="height:40px;width:auto;vertical-align:middle;object-fit:contain" />
                </a>
              </div>
            </div>
            <!-- Android -->
            <div class="flex flex-col items-center gap-1.5">
              <div class="p-1.5 bg-white rounded-lg">
                <img v-if="playStoreQR" :src="playStoreQR" alt="Google Play QR code" class="w-20 h-20 block" />
                <div v-else class="w-20 h-20 bg-gray-100 animate-pulse rounded" />
              </div>
              <a href="https://play.google.com/store/apps/details?id=com.cadenabitcoin.mobile.signer&pcampaignid=web_share" target="_blank" rel="noopener" aria-label="Get it on Google Play" style="display:inline-block;line-height:0">
                <img src="/img/google-play-badge.png" alt="Get it on Google Play" style="height:52px;width:auto;vertical-align:middle;object-fit:contain" />
              </a>
            </div>
          </div>
          <p class="text-xs text-white/40 text-center">Scan with your phone camera to download</p>
        </div>
      </div>

      <form class="space-y-6" @submit.prevent="submitForm" novalidate>
        <!-- Email -->
        <label>
          <span class="block mb-1 font-semibold">Email</span>
          <input
            v-model.trim="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            placeholder="you@example.com"
            class="w-full px-4 py-2 rounded bg-white text-black"
            :aria-invalid="!!emailError"
            aria-describedby="email-hint"
            required
          />
          <p id="email-hint" class="mt-1 text-sm text-red-300" v-if="emailError">{{ emailError }}</p>
        </label>

        <!-- Password -->
        <label class="block">
          <span class="block mb-1 font-semibold">Password</span>
          <div class="relative">
            <input
              :type="showPw ? 'text' : 'password'"
              v-model="password"
              autocomplete="new-password"
              placeholder="••••••••••••"
              class="w-full px-4 py-2 pr-12 rounded bg-white text-black"
              required
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded bg-secondary hover:bg-secondary/90"
              @click="showPw = !showPw"
              :aria-pressed="showPw ? 'true' : 'false'"
            >
              {{ showPw ? 'Hide' : 'Show' }}
            </button>
          </div>
        </label>

        <!-- Confirm Password -->
       <label>
  <span class="block mb-1 font-semibold">Confirm Password</span>
  <div class="relative">
    <input
      :type="showPw ? 'text' : 'password'"
      v-model="confirmPassword"
      autocomplete="new-password"
      placeholder="Re-enter your password"
      class="w-full px-4 py-2 pr-12 rounded bg-white text-black"
      :aria-invalid="!!confirmError"
      aria-describedby="confirm-hint"
      required
    />
    <button
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded bg-secondary hover:bg-secondary/90"
      @click="showPw = !showPw"
      :aria-pressed="showPw ? 'true' : 'false'"
    >
      {{ showPw ? 'Hide' : 'Show' }}
    </button>
  </div>
  <p id="confirm-hint" class="mt-1 text-sm text-red-300" v-if="confirmError">{{ confirmError }}</p>
</label>

        <!-- Terms -->
        <div class="flex items-start gap-2 text-sm">
          <input id="terms" type="checkbox" v-model="accepted" class="mt-1" />
          <label for="terms" class="text-white leading-snug">
            By clicking <strong>Register</strong>, you agree to our
            <router-link to="/terms" class="text-secondary underline">Terms</router-link> and you have read our
            <router-link to="/privacy" class="text-secondary underline">Data Policy</router-link>, including our
            <router-link to="/cookies" class="text-secondary underline">Cookie Use</router-link>.
          </label>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          :disabled="!formValid || loading"
          class="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold transition disabled:opacity-40"
          :aria-busy="loading ? 'true' : 'false'"
        >
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>

        <!-- Error Message -->
        <div v-if="error" class="text-center text-red-400 font-semibold" aria-live="polite">{{ error }}</div>

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
      <!-- Email Confirmation Image -->
      <div class="flex justify-center mb-4">
        <picture>
          <source
            type="image/avif"
            srcset="/img/email_confirmed_icon-640.avif 640w, /img/email_confirmed_icon-960.avif 960w, /img/email_confirmed_icon-1280.avif 1280w"
          />
          <source
            type="image/webp"
            srcset="/img/email_confirmed_icon-640.webp 640w, /img/email_confirmed_icon-960.webp 960w, /img/email_confirmed_icon-1280.webp 1280w"
          />
          <img
            src="/img/email_confirmed_icon-960.webp"
            srcset="/img/email_confirmed_icon-640.webp 640w, /img/email_confirmed_icon-960.webp 960w, /img/email_confirmed_icon-1280.webp 1280w"
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 350px"
            alt="Check your email for confirmation"
            class="w-[280px] md:w-[320px] lg:w-[350px] h-auto select-none"
            decoding="async"
            loading="eager"
          />
        </picture>
      </div>

      <h1 class="text-3xl font-bold">Check Your Inbox</h1>
      <p class="text-lg">We've sent a confirmation link to:</p>
      <p class="text-xl text-secondary font-bold break-all">{{ email }}</p>
      <p class="text-sm text-white/80">
        It may take a few minutes to arrive. If you don't see it, check your spam folder
        or search your inbox for "Cadena". After you've confirmed, log in.
      </p>

      <div class="pt-4 flex items-center justify-center">
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
      <h1 class="text-3xl font-bold">Scan with the <em>Signer</em> App</h1>
      <p class="text-lg">
        Open the <span class="font-semibold">Cadena Signer</span> app on your phone and use its built-in
        <span class="font-semibold">QR Scanner</span> to scan the code below.
        Do <span class="font-semibold">not</span> use the phone’s default camera — only the Signer app can complete registration.
      </p>

      <!-- Download prompt -->
      <div class="p-5 rounded-2xl border border-white/10 bg-white/[0.05] space-y-4">
        <p class="text-sm font-semibold text-white text-center">Don’t have the app yet? Scan to download:</p>
        <div class="flex items-start justify-center gap-8 flex-wrap">
          <!-- iOS -->
          <div class="flex flex-col items-center gap-2">
            <div class="p-2 bg-white rounded-xl shadow">
              <img v-if="appStoreQR" :src="appStoreQR" alt="App Store QR code" class="w-28 h-28 block" />
              <div v-else class="w-28 h-28 bg-gray-100 animate-pulse rounded" />
            </div>
            <div style="height:52px;display:flex;align-items:center">
              <a href="https://apps.apple.com/us/app/cadena-bitcoin/id6753348211?itscg=30200&itsct=apps_box_badge&mttnsubad=6753348211" target="_blank" rel="noopener" aria-label="Download on the App Store" style="display:inline-block;line-height:0">
                <img src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1760227200" alt="Download on the App Store" style="height:40px;width:auto;vertical-align:middle;object-fit:contain" />
              </a>
            </div>
          </div>
          <!-- Android -->
          <div class="flex flex-col items-center gap-2">
            <div class="p-2 bg-white rounded-xl shadow">
              <img v-if="playStoreQR" :src="playStoreQR" alt="Google Play QR code" class="w-28 h-28 block" />
              <div v-else class="w-28 h-28 bg-gray-100 animate-pulse rounded" />
            </div>
            <a href="https://play.google.com/store/apps/details?id=com.cadenabitcoin.mobile.signer&pcampaignid=web_share" target="_blank" rel="noopener" aria-label="Get it on Google Play" style="display:inline-block;line-height:0">
              <img src="/img/google-play-badge.png" alt="Get it on Google Play" style="height:52px;width:auto;vertical-align:middle;object-fit:contain" />
            </a>
          </div>
        </div>
        <p class="text-xs text-white/50 text-center">Once installed, open the app and tap <strong class="text-white/80">QR Scanner</strong> to scan the registration code below.</p>
      </div>

      <!-- In-app steps -->
      <div class="p-5 rounded-2xl border border-white/10 bg-white/[0.05] text-left space-y-3">
        <p class="text-sm font-semibold text-white text-center">In the Signer app:</p>
        <ol class="space-y-2 text-sm text-white/70">
          <li class="flex items-start gap-3">
            <span class="shrink-0 w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center mt-0.5">1</span>
            <span>Sign in to your account</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="shrink-0 w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center mt-0.5">2</span>
            <span>Create a new wallet or restore one with your 12-word seed phrase</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="shrink-0 w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center mt-0.5">3</span>
            <span>Tap <strong class="text-white">QR Scanner</strong> and scan the code below to pair</span>
          </li>
        </ol>
      </div>

      <div v-if="qrCode" class="mt-6">
        <div class="inline-block p-3 bg-white rounded">
          <img :src="qrCode" alt="Registration QR code (scan with Cadena Signer app)" class="w-64 h-64" />
        </div>

        <div class="pt-6">
          <p class="text-base font-medium mb-3">Once you’ve scanned, continue to create a loan:</p>
          <button
            @click="goToDashboard"
            class="inline-block bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold transition disabled:opacity-40"
            :disabled="loading"
            :aria-busy="loading ? 'true' : 'false'"
          >
            <span v-if="loading">Preparing dashboard…</span>
            <span v-else>Go to Dashboard</span>
          </button>
        </div>
      </div>

      <p v-else class="text-sm text-white/80">Loading QR Code...</p>
      <div v-if="error" class="text-center text-red-400 font-semibold" aria-live="polite">{{ error }}</div>
    </div>

    <!-- 🧭 Step Tracker (unchanged) -->
    <div class="mt-0 flex justify-center pb-4">
      <ol class="flex items-center gap-10 text-base font-semibold">
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
              v-if="step > 2"
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>2</span>
          </div>
          <span class="hidden sm:inline" :class="step === 2 ? 'text-white' : step < 2 ? 'text-gray-400' : 'text-green-500'">
            Confirm Email
          </span>
        </li>

      </ol>
    </div>
  </section>
  <TheFooter/>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { registerUser } from '../api/user'
import { getUserQR } from '../api/qr'
import { getToken } from '../api/token'
import { useAuth } from '../composables/useAuth'
import type { QRCodeUserResponse } from '../types/common/qrFace'
import TheFooter from '../components/TheFooter.vue'
import { isSignerAuthCode } from '../lib/authCode'
import QRCode from 'qrcode'

const APP_STORE_URL = 'https://apps.apple.com/us/app/cadena-bitcoin/id6753348211'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.cadenabitcoin.mobile.signer'
const appStoreQR = ref<string | null>(null)
const playStoreQR = ref<string | null>(null)

async function generateAppStoreQRs() {
  const opts = { width: 180, margin: 1, color: { dark: '#000000', light: '#ffffff' } }
  appStoreQR.value = await QRCode.toDataURL(APP_STORE_URL, opts)
  playStoreQR.value = await QRCode.toDataURL(PLAY_STORE_URL, opts)
}

// UI state
const step = ref<number>(1)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const accepted = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const showPw = ref(false)

// QR display
const qrCode = ref<string | null>(null)

// Auth store
const { user, setUserFromApi } = useAuth()

// --- Validation ---
const emailError = computed(() => {
  if (!email.value) return ''
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  return ok ? '' : 'Please enter a valid email address.'
})

const confirmError = computed(() => {
  if (!confirmPassword.value) return ''
  return confirmPassword.value === password.value ? '' : 'Passwords do not match.'
})

const formValid = computed(() =>
  !!email.value &&
  !emailError.value &&
  !!password.value &&
  confirmError.value === '' &&
  accepted.value
)

// --- Router ---
const route = useRoute()
const router = useRouter()
const DASHBOARD_PATH = '/allocate_liquidity'

// poll timer for step 3
const step3PollId = ref<number | null>(null)

const prefillEmailFromRoute = () => {
  const qp = Array.isArray(route.query.email) ? route.query.email[0] : route.query.email
  if (typeof qp === 'string' && qp.trim() && !email.value) {
    email.value = qp.trim()
  }
}

const submitForm = async () => {
  error.value = null
  if (!formValid.value) return
  loading.value = true
  try {
    await registerUser({
      email_address: email.value,
      password: password.value,
    } as any)

    step.value = 2
    await router.replace({ query: { ...route.query, step: '2' } })
  } catch (err: any) {
    error.value = err?.message || 'Registration failed.'
  } finally {
    password.value = ''
    confirmPassword.value = ''
    loading.value = false
  }
}

const buildSvgDataUri = (svgLike: string): string => {
  const val = svgLike.trim()
  if (/^data:image\/svg\+xml[,;]/i.test(val)) return val
  if (/^https?:\/\//i.test(val)) return val
  if (val.startsWith('<svg') || val.startsWith('<?xml')) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(val)
  }
  if (val.startsWith('%3Csvg') || val.startsWith('%3C?xml')) {
    return 'data:image/svg+xml,' + val
  }
  throw new Error('Unexpected QR format.')
}

const loadQrCode = async () => {
  error.value = null
  qrCode.value = null
  try {
    const token = getToken()
    if (!token) return
    const data: QRCodeUserResponse = await getUserQR()
    const svg = (data as any)?.payload?.qr_code
    if (typeof svg !== 'string') throw new Error('QR code not found in response payload.')
    qrCode.value = buildSvgDataUri(svg)
  } catch (err: any) {
    error.value = err?.message || 'Failed to load QR code.'
  }
}

// small helper
const readAuthCode = () => {
  const raw = user.value
  const fromPayload = Number((raw as any)?.payload?.auth_code)
  if (Number.isFinite(fromPayload)) return fromPayload
  const top = Number((raw as any)?.auth_code)
  if (Number.isFinite(top)) return top
  return null
}

const startStep3Polling = () => {
  // avoid double timers
  if (step3PollId.value !== null) return
  step3PollId.value = window.setInterval(async () => {
    try {
      await setUserFromApi?.()
      const code = readAuthCode()
      if (isSignerAuthCode(code)) {
        // stop first so we don't keep firing after navigation
        stopStep3Polling()
        await router.push(DASHBOARD_PATH)
      }
    } catch (e) {
      // non-blocking, just keep polling
    }
  }, 3000) // every 3s
}

const stopStep3Polling = () => {
  if (step3PollId.value !== null) {
    clearInterval(step3PollId.value)
    step3PollId.value = null
  }
}

/** Check profile first, then go to BTCUSD regardless */
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
const goToDashboard = async () => {
  error.value = null
  loading.value = true
  try {
    const token = getToken()
    if (token) {
      const deadline = Date.now() + 6000
      while (Date.now() < deadline) {
        await setUserFromApi?.()
        const code = readAuthCode()
        if (Number.isFinite(code)) break
        await sleep(400)
      }
    }
  } catch (e: any) {
    error.value = e?.message || 'Could not refresh your profile.'
  } finally {
    loading.value = false
    await router.push(DASHBOARD_PATH)
  }
}

// --- Step/URL sync ---
const syncStepFromRoute = () => {
  const stepParam = Array.isArray(route.query.step) ? route.query.step[0] : route.query.step
  if (stepParam === '3') step.value = 3
  else if (stepParam === '2') step.value = 2
  else step.value = 1
}

watch(step, async (val) => {
  const next = String(val)
  if (route.query.step !== next) {
    await router.replace({ query: { ...route.query, step: next } })
  }
  if (val === 2) {
    // Fire X conversion event for registration step 2
    if (typeof window !== 'undefined' && window.twq) {
      window.twq('event', 'tw-prcqf-qvn1b', {
        email_address: email.value || null
      })
    }
  }
  if (val === 3) {
    await loadQrCode()
    startStep3Polling()
  } else {
    stopStep3Polling()
  }
})

watch(() => route.query.step, () => syncStepFromRoute())

onMounted(async () => {
  prefillEmailFromRoute()
  syncStepFromRoute()
  generateAppStoreQRs()
  if (step.value === 3) {
    await loadQrCode()
    startStep3Polling()
  }
})
watch(() => route.query.email, () => prefillEmailFromRoute())

onBeforeUnmount(() => {
  stopStep3Polling()
})
</script>


<style scoped>
.bg-page-gradient{
  background-color: #081123;
}
</style>
