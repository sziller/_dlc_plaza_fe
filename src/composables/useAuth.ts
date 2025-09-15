// src/composables/useAuth.ts
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import { getToken } from '../api/token'
import { getUserProfile } from '../api/userProfile'
import { logout as apiLogout } from '../api/auth'
import { useTokenHealth } from '../hooks/useTokenHealth'

const token = ref<string | null>(getToken() || null)
const user = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// optional: keep a single listener reference so we can clean up
let synced = false
let storageHandler: ((this: Window, ev: StorageEvent) => any) | null = null
let authChangedHandler: ((this: Window, ev: Event) => any) | null = null

export function useAuth() {
  const isLoggedIn = computed(() => !!(token.value && token.value.trim()))

  async function setUserFromApi() {
    if (!token.value) {
      user.value = null
      return
    }
    loading.value = true
    error.value = null
    try {
      const profile = await getUserProfile()
      user.value = profile
    } catch (err) {
      // Don't log the user out here; the heartbeat handles true expiry.
      // Still surface a friendly message for the current screen.
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          error.value = 'Your session may have expired.'
        } else if (err.code === 'ECONNABORTED') {
          error.value = 'The request timed out. Please try again.'
        } else {
          error.value = 'Could not load your profile.'
        }
      } else {
        error.value = 'Unexpected error.'
      }
    } finally {
      loading.value = false
    }
  }

  // login here should ONLY set reactive state; getAuthToken already saved token
  function login(newToken: string, profilePayload?: any) {
    token.value = newToken || null
    user.value = profilePayload ?? null
    window.dispatchEvent(new Event('auth-changed'))
  }

  function logout() {
    apiLogout() // clears storage + dispatches 'auth-changed'
    token.value = null
    user.value = null
  }

  // Heartbeat: UI-reactive token health
  const onInvalid = () => {
    // unify logout flow when heartbeat detects invalid auth
    logout()
  }

  const tokenHealth = useTokenHealth(isLoggedIn, {
    intervalMs: 60_000,        // adjust as desired
    failuresBeforeLogout: 1,   // set to 2 if you want extra tolerance
    onInvalid,
  })
  if (import.meta.env.DEV) {
  (window as any).__AUTH = {
    get status() { return tokenHealth.status },
    get nextCheckAt() { return tokenHealth.nextCheckAt },
    pingNow: tokenHealth.pingNow,
    logout,
    // NEW: force a bad token and ping immediately
    expireNow() {
      sessionStorage.setItem('authToken', 'badtoken')
      window.dispatchEvent(new Event('auth-changed'))
      return tokenHealth.pingNow()
    },
    // NEW: see which token the ping will send
    peekToken() { return sessionStorage.getItem('authToken') }
  }
}
  // Keep token in sync across tabs / programmatic changes
  onMounted(() => {
  const sync = () => { token.value = getToken() || null }
  window.addEventListener('storage', sync)
  window.addEventListener('auth-changed', sync)

  // NEW: bounce on 401 anywhere
  const onAuthInvalid = () => logout()
  window.addEventListener('auth-invalid', onAuthInvalid)

  // cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('storage', sync)
    window.removeEventListener('auth-changed', sync)
    window.removeEventListener('auth-invalid', onAuthInvalid)
  })
})


  onBeforeUnmount(() => {
    if (storageHandler) window.removeEventListener('storage', storageHandler)
    if (authChangedHandler) window.removeEventListener('auth-changed', authChangedHandler)
    storageHandler = null
    authChangedHandler = null
    synced = false
  })

  // When token flips to a non-empty value, fetch profile & validate quickly
  watch(
    () => token.value,
    (t) => {
      if (t) {
        void setUserFromApi()
        // quick reality check so UI reflects health ASAP
        void tokenHealth.pingNow()
      } else {
        user.value = null
      }
    }
  )

  return {
    // auth state
    token,
    user,
    isLoggedIn,
    loading,
    error,

    // actions
    login,
    logout,
    setUserFromApi,

    // heartbeat (reactive UI can bind to these)
    tokenHealth, // exposes: status, lastOkAt, nextCheckAt, paused, reason, consecutiveAuthFails, pingNow
  }
}
