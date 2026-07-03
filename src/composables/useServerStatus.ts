import { ref, computed } from 'vue'
import { getServerStatus } from '../api/serverStatus'

const FORCE_DOWN = false
const DEFAULT_MSG =
  'Cadena is temporarily under maintenance. Logins and registrations are disabled. Please try again shortly.'

// Module-level singleton — shared across all callers in the same SPA session
const status = ref<'idle' | 'checking' | 'up' | 'down'>(FORCE_DOWN ? 'down' : 'idle')
const message = ref('')

export function useServerStatus() {
  const isServerDown = computed(() => status.value === 'down')

  async function checkServerStatus() {
    if (FORCE_DOWN) {
      status.value = 'down'
      message.value = DEFAULT_MSG
      return
    }
    // If already checked and resolved, skip
    if (status.value === 'up' || status.value === 'down') return
    status.value = 'checking'
    try {
      const res = await getServerStatus()
      const p = res?.payload
      if (p?.ok && p?.status === 'up') {
        status.value = 'up'
        message.value = ''
      } else {
        status.value = 'down'
        message.value = DEFAULT_MSG
      }
    } catch (e: any) {
      const code = (e as any)?.response?.status
      message.value =
        code === 429
          ? 'Too many requests from this IP. Please wait a moment and refresh.'
          : DEFAULT_MSG
      status.value = 'down'
    }
  }

  return { isServerDown, serverStatusMessage: message, checkServerStatus }
}
