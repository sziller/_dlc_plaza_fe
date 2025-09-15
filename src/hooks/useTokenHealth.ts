import { onMounted, onBeforeUnmount, watchEffect, ref, readonly, computed } from 'vue'
import axios from 'axios'
import { getUserProfile } from '../api/userProfile'
import { getToken } from '../api/token'

type Status = 'idle' | 'checking' | 'healthy' | 'paused' | 'invalid'

type Options = {
  intervalMs?: number
  failuresBeforeLogout?: number
  onInvalid: () => void
}

export function useTokenHealth(
  isLoggedInRef: { value: boolean },
  { intervalMs = 3_000, failuresBeforeLogout = 1, onInvalid }: Options
) {
  let timerId: number | null = null
  const status = ref<Status>('idle')
  const lastOkAt = ref<number | null>(null)
  const nextCheckAt = ref<number | null>(null)
  const consecutiveAuthFails = ref(0)
  const reason = ref<string | null>(null)

  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('auth') : null
  if (bc) {
    bc.onmessage = (e) => {
      if (e?.data?.type === 'logout') {
        reason.value = e?.data?.reason || 'auth-failed'
        status.value = 'invalid'
        onInvalid()
      }
    }
  }

  const paused = () => document.hidden || !navigator.onLine

  const isAuthError = (err: unknown) =>
    axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)

  const ping = async () => {
    const t = getToken()
console.debug('[auth ping] token=', t ? t.slice(0, 12) + '…' : '(none)')
    if (!isLoggedInRef.value) return
    if (!getToken()) {
      reason.value = 'no-token'
      status.value = 'invalid'
      bc?.postMessage({ type: 'logout', reason: reason.value })
      onInvalid()
      return
    }

    if (paused()) {
      status.value = 'paused'
      return
    }

    status.value = 'checking'
    try {
      await getUserProfile() // swap to a lighter /auth/ping if you add one
      consecutiveAuthFails.value = 0
      lastOkAt.value = Date.now()
      status.value = 'healthy'
    } catch (err) {
      if (isAuthError(err)) {
        consecutiveAuthFails.value += 1
        reason.value = 'auth-failed'
        if (consecutiveAuthFails.value >= failuresBeforeLogout) {
          status.value = 'invalid'
          bc?.postMessage({ type: 'logout', reason: reason.value })
          onInvalid()
        } else {
          // transient? show "checking" for a moment then try again on the next tick
          status.value = 'checking'
        }
      } else {
        // network/5xx — don’t punish the user
        status.value = 'healthy'
      }
    }
  }

  const schedule = () => {
    if (timerId !== null) return
    // set nextCheckAt so UI can render a countdown if it wants to
    const tick = async () => {
      nextCheckAt.value = Date.now() + intervalMs
      await ping()
    }
    timerId = window.setInterval(tick, intervalMs)
    // quick first pass so UI updates immediately
    setTimeout(tick, Math.min(5_000, intervalMs / 2))
  }

  const stop = () => {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
  }

  onMounted(() => {
    if (isLoggedInRef.value) schedule()
  })
  onBeforeUnmount(stop)
  watchEffect(() => {
    if (isLoggedInRef.value) schedule()
    else stop()
  })

  const pausedComputed = computed(() => status.value === 'paused')

  return {
    // public, read-only so components can’t accidentally mutate
    status: readonly(status),
    lastOkAt: readonly(lastOkAt),
    nextCheckAt: readonly(nextCheckAt),
    reason: readonly(reason),
    consecutiveAuthFails: readonly(consecutiveAuthFails),
    paused: readonly(pausedComputed),
    // helpers
    pingNow: ping,
  }
}
