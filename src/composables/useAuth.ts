import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const TOKEN_KEY = 'token'
const USER_KEY  = 'auth_user'

const token   = ref<string | null>(localStorage.getItem(TOKEN_KEY))
const user    = ref<any>(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
const loading = ref(false)
const error   = ref<string | null>(null)

export function useAuth() {
  const isLoggedIn = computed(() => !!(token.value && token.value.trim()))

  function syncFromStorage() {
    token.value = localStorage.getItem(TOKEN_KEY)
    user.value  = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  }

  function login(newToken = 'dev-token', profilePayload?: any) {
    token.value = newToken
    user.value  = profilePayload ?? user.value ?? { name: 'Demo', email: 'demo@example.com' }

    localStorage.setItem(TOKEN_KEY, token.value)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))

    window.dispatchEvent(new Event('auth-changed'))
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    token.value = null
    user.value  = null
    window.dispatchEvent(new Event('auth-changed'))
  }

  // In mock mode this just hydrates from storage
  function setUserFromApi() {
    syncFromStorage()
  }

  onMounted(() => {
    window.addEventListener('storage', syncFromStorage)
    window.addEventListener('auth-changed', syncFromStorage)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('storage', syncFromStorage)
    window.removeEventListener('auth-changed', syncFromStorage)
  })

  return { token, user, isLoggedIn, loading, error, login, logout, setUserFromApi }
}
