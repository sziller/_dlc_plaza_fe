<template>
  <main class="min-h-screen relative pt-24 md:pt-28 text-white">
    <!-- Background: shared bottom-anchored glow -->
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <section class="px-6 pb-16 flex flex-col justify-between">
      <div class="max-w-xl mx-auto w-full space-y-10">
        <h1 class="text-3xl font-bold text-center">Sign In</h1>

        <form
          class="space-y-6"
          @submit.prevent="submitLogin"
          autocomplete="on"
          :aria-busy="loading ? 'true' : 'false'"
        >
          <!-- Email -->
          <label>
            <span class="block mb-1 font-semibold">Email</span>
            <input
              v-model.trim="email"
              type="email"
              inputmode="email"
              autocomplete="email"
              autocapitalize="off"
              spellcheck="false"
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
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              spellcheck="false"
              placeholder="••••••••"
              class="w-full px-4 py-2 rounded bg-white text-black"
              required
            />
            <button
              type="button"
              class="mt-2 text-sm text-white/80 hover:text-white underline"
              @click="showPassword = !showPassword"
              :aria-pressed="showPassword ? 'true' : 'false'"
            >
              {{ showPassword ? 'Hide' : 'Show' }} password
            </button>
          </label>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="!formValid || loading"
            :aria-disabled="!formValid || loading ? 'true' : 'false'"
            class="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold transition disabled:opacity-40"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>

          <!-- Error Message (accessible live region) -->
          <div
            v-if="error"
            class="text-center text-red-400 font-semibold"
            role="status"
            aria-live="polite"
          >
            {{ error }}
          </div>

          <!-- Centered Register Link -->
          <div class="text-center text-sm pt-4">
            <router-link to="/register" class="text-secondary hover:underline font-medium">
              Don't have an account? Register
            </router-link>
          </div>
        </form>
      </div>
    </section>
  </main>
  <TheFooter/>
</template>

<script setup lang="ts">
import TheFooter from '../components/TheFooter.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAuthToken } from '../api/auth'
import { isSignerAuthCode } from '../lib/authCode'
import { getUserProfile } from '../api/userProfile'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const auth = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const formValid = computed(() => !!email.value && !!password.value)

// --- tiny single-flight to avoid parallel profile calls from other listeners right after login ---
let inFlightProfile: Promise<any> | null = null
const getUserProfileOnce = async () => {
  if (!inFlightProfile) {
    inFlightProfile = getUserProfile()
      .finally(() => { inFlightProfile = null })
  }
  return inFlightProfile
}

const submitLogin = async () => {
  error.value = null
  loading.value = true

  try {
    // 1) Authenticate
    const token = await getAuthToken(email.value, password.value)

    // 2) Store token immediately so subsequent requests are authorized
    //    (this also signals other parts of the app that we're logged in)
    auth.login(token)

    // 3) Resolve profile (prefer cache, otherwise fetch once)
    let profilePayload: any | null = auth.user.value ?? null
    if (!profilePayload) {
      try {
        const profileData = await getUserProfileOnce()
        profilePayload = profileData?.payload ?? profileData ?? null
      } catch (e: any) {
        // If the fetch fails with a non-auth error, keep user logged in and continue gracefully
        // If it was actually an auth error, surface invalid credentials below
        const msg = String(e?.message || '').toLowerCase()
        if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('invalid')) {
          throw e
        }
        profilePayload = null
      }
    }

    // 4) Normalize + persist combined auth state (token + profile)
    auth.login(token, profilePayload)

    // 5) Route based on auth_code if present (fallback to home)
    const code = Number(profilePayload?.auth_code)
    if (code === 2) {
      await router.push({ path: '/register', query: { step: '3' } })
    } else if (isSignerAuthCode(code)) {
      await router.push('/btcusd')
    } else {
      await router.push('/')
    }

    // No global "auth-changed" event here — avoids fan-out duplicate fetches
  } catch (err: any) {
    const msg = String(err?.message || '').toLowerCase()
    if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('invalid')) {
      error.value = 'Invalid email or password.'
    } else {
      error.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
/* keeps it local to this component */
.page-gradient{
  /* solid black base */
  background-color: #000;
  /* bottom-centered purple glow that fades to black */
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,
      rgba(103,56,228,0.58) 0%,
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%
    );
}

/* nicer blending when OKLCH is supported */
@supports (background: radial-gradient(in oklch, black, white)) {
  .page-gradient{
    background-color: oklch(0 0 0);
    background-image:
      radial-gradient(
        in oklch 125% 75% at 50% 100%,
        oklch(from #6738e4 l c h / 0.60) 0%,
        oklch(from #6738e4 l c h / 0.36) 26%,
        oklch(from #6738e4 l c h / 0.16) 52%,
        oklch(0 0 0 / 0) 76%
      );
  }
}

/* keep the glow lower on short screens so it doesn't creep up */
@media (max-height: 800px){
  .page-gradient{
    background-image:
      radial-gradient(
        120% 60% at 50% 100%,
        rgba(103,56,228,0.52) 0%,
        rgba(103,56,228,0.30) 24%,
        rgba(103,56,228,0.12) 48%,
        rgba(0,0,0,0) 70%
      );
  }
}

</style>
