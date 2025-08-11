import { ref, computed, onMounted } from 'vue'
import { getToken } from '../api/token'
import { getUserProfile } from '../api/userProfile'
import { logout as apiLogout } from '../api/auth' // ← use this

const token = ref<string | null>(getToken() || null)
const user = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const isLoggedIn = computed(() => !!(token.value && token.value.trim()))

  async function setUserFromApi() { /* unchanged */ }

  // login here should ONLY set reactive state; getAuthToken already saved token
  function login(newToken: string, profilePayload?: any) {
    token.value = newToken || null
    user.value = profilePayload ?? null
    window.dispatchEvent(new Event('auth-changed'))
  }

  function logout() {
    apiLogout()            // clears storage + dispatches 'auth-changed'
    token.value = null
    user.value = null
  }

  onMounted(() => {
    const sync = () => { token.value = getToken() || null }
    window.addEventListener('storage', sync)
    window.addEventListener('auth-changed', sync)
  })

  return { token, user, isLoggedIn, loading, error, login, logout, setUserFromApi }
}
