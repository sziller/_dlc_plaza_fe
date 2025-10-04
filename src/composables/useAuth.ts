import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import { getToken } from '../api/token'
import { getUserProfile } from '../api/userProfile'
import { logout as apiLogout } from '../api/auth'
import { useTokenHealth } from '../hooks/useTokenHealth'
import {
  getCachedProfile,
  setCachedProfile,
  getCachedAgeMs
} from './userProfileCache'

const token = ref<string | null>(getToken() || null)
// Store ONLY the payload (uniform across app)
const user = ref<any>(getCachedProfile() || null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const isLoggedIn = computed(() => !!(token.value && token.value.trim()))

  // Fetch fresh profile and cache it
  async function setUserFromApi() {
    if (!token.value) {
      user.value = null
      setCachedProfile(null)
      return
    }
    loading.value = true
    error.value = null
    try {
      const profile = await getUserProfile()               // <- server call
      const payload = profile?.payload ?? profile ?? null  // support both shapes
      user.value = payload
      if (payload?.payload) {
        // if API wrapped it twice: {payload: { ...realFields }}
        setCachedProfile(payload.payload)
        user.value = payload.payload
      } else {
        setCachedProfile(payload)
      }
    } catch (err) {
      // keep previous user if any; set friendly error
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

  // Fast-path login: accept optional payload and cache it
  function login(newToken: string, profilePayload?: any) {
    token.value = newToken || null
    if (profilePayload?.payload) profilePayload = profilePayload.payload
    if (profilePayload) {
      user.value = profilePayload
      setCachedProfile(profilePayload)
    } else {
      // no payload? keep whatever cache we had; a watch below can refresh
      user.value = getCachedProfile() || null
    }
    window.dispatchEvent(new Event('auth-changed'))
  }

  function logout() {
    apiLogout()
    token.value = null
    user.value = null
    setCachedProfile(null)
  }

  // Convenience: ensure a reasonably fresh user (e.g., TTL 2 min)
  async function ensureFreshUser(ttlMs = 120_000) {
    if (!isLoggedIn.value) return null
    if (!user.value || getCachedAgeMs() > ttlMs) {
      await setUserFromApi()
    }
    return user.value
  }

  // Heartbeat invalidation
  const onInvalid = () => logout()
  const tokenHealth = useTokenHealth(isLoggedIn, {
    intervalMs: 60_000,
    failuresBeforeLogout: 1,
    onInvalid,
  })

  // Keep token & cached profile in sync across tabs
  onMounted(() => {
    const sync = () => {
      token.value = getToken() || null
      // if token vanished in another tab, drop profile
      if (!token.value) {
        user.value = null
        setCachedProfile(null)
      } else {
        // keep in-memory in sync with session cache
        const cached = getCachedProfile()
        if (cached) user.value = cached
      }
    }
    window.addEventListener('storage', sync)
    window.addEventListener('auth-changed', sync)

    const onAuthInvalid = () => logout()
    window.addEventListener('auth-invalid', onAuthInvalid)

    onBeforeUnmount(() => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('auth-changed', sync)
      window.removeEventListener('auth-invalid', onAuthInvalid)
    })
  })

  // When token becomes non-empty, quickly validate + backfill user if missing
  watch(
    () => token.value,
    async (t) => {
      if (t) {
        if (!getCachedProfile()) {
          // no cache? fetch once
          await setUserFromApi()
        }
        void tokenHealth.pingNow()
      } else {
        user.value = null
        setCachedProfile(null)
      }
    }
  )

  return {
    token,
    user,                 // <- THE instance to use everywhere
    isLoggedIn,
    loading,
    error,

    login,
    logout,
    setUserFromApi,
    ensureFreshUser,      // <- optional: guarded refresh on demand

    tokenHealth,
  }
}
