// src/composables/useAuth.ts
import { ref, computed, onMounted } from 'vue'
import { saveToken, getToken, removeToken } from '../api/token'
import { getUserProfile } from '../api/userProfile'

function sanitizeToken(raw: unknown): string | null {
  const t = typeof raw === 'string' ? raw.trim() : null
  if (!t || t === 'undefined' || t === 'null') return null
  return t
}

const token = ref<string | null>(sanitizeToken(getToken()))
const user = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const isLoggedIn = computed(() => !!sanitizeToken(token.value))

  async function setUserFromApi() {
    if (!sanitizeToken(token.value)) {
      user.value = null
      return
    }
    try {
      loading.value = true
      const profile = await getUserProfile()
      user.value = profile.payload
    } catch (e: any) {
      console.error('Failed to fetch profile:', e)
      error.value = e?.message ?? 'Failed to fetch user profile'
      // if token is invalid, consider logging out here if you want:
      // logout()
    } finally {
      loading.value = false
    }
  }

  function login(newToken: string, profilePayload?: any) {
    const clean = sanitizeToken(newToken)
    token.value = clean
    if (clean) saveToken(clean)
    user.value = profilePayload ?? null
  }

  function logout() {
    token.value = null
    user.value = null
    removeToken()
    // if your removeToken doesn't clear, you can also:
    // sessionStorage.removeItem('token'); localStorage.removeItem('token');
  }

  // Keep auth state in sync if storage changes (other tabs or code)
  onMounted(() => {
    window.addEventListener('storage', () => {
      token.value = sanitizeToken(getToken())
    })
  })

  return {
    // state
    token,
    user,
    isLoggedIn,
    loading,
    error,
    // actions
    login,
    logout,
    setUserFromApi,
  }
}
