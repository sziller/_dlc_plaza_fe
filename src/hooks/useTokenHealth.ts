// src/hooks/useTokenHealth.ts
import { onMounted, onBeforeUnmount, watchEffect, ref, readonly, computed, type Ref } from 'vue'
import axios from 'axios'
import { getUserProfile } from '../api/userProfile'
import { getToken } from '../api/token'

export type Status = 'idle' | 'checking' | 'healthy' | 'paused' | 'invalid'

export type Options = {
  intervalMs?: number
  failuresBeforeLogout?: number
  onInvalid: () => void
}

export function useTokenHealth(
  isLoggedInRef: { value: boolean },
  { intervalMs = 3_000, failuresBeforeLogout = 1, onInvalid }: Options
) {
  // ---- State ----
  const status = ref<Status>('idle')
  const lastOkAt = ref<number | null>(null)
  const nextCheckAt = ref<number | null>(null)
  const consecutiveAuthFails = ref<number>(0)
  const reason = ref<string | null>(null)

  // ---- Cross-tab logout broadcast ----
  let bc: BroadcastChannel | null = null
  if ('BroadcastChannel' in window) {
    bc = new BroadcastChannel('auth')
    bc.onmessage = (e: MessageEvent) => {
      const data = (e && (e as any).data) || null
      if (data?.type === 'logout') {
        reason.value = data?.reason || 'auth-failed'
        status.value = 'invalid'
        onInvalid()
      }
    }
  }

  // ---- Scheduling helpers (no overlap) ----
  let timeoutId: number | null = null
  let inFlight = false

  const pausedNow = () => document.hidden || !navigator.onLine

  const isAuthError = (err: unknown) =>
    axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)

  const jitter = (ms: number) => Math.round(ms * (0.9 + Math.random() * 0.2)) // ±10%

  const stop = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const scheduleNext = (baseMs: number) => {
    const delay = jitter(baseMs)
    nextCheckAt.value = Date.now() + delay
    timeoutId = window.setTimeout(tick, delay)
  }

  const ping = async (): Promise<void> => {
    if (!isLoggedInRef.value) return

    const t = getToken()
    if (import.meta?.env?.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[auth ping] token=', t ? t.slice(0, 12) + '…' : '(none)')
    }

    if (!t) {
      reason.value = 'no-token'
      status.value = 'invalid'
      bc?.postMessage({ type: 'logout', reason: reason.value })
      onInvalid()
      return
    }

    if (pausedNow()) {
      status.value = 'paused'
      return
    }

    if (inFlight) return
    inFlight = true
    status.value = 'checking'

    try {
      await getUserProfile() // lightweight auth check
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
          // transient: keep checking next cycle
          status.value = 'checking'
        }
      } else {
        // network/5xx — do not kick the user out
        status.value = 'healthy'
      }
    } finally {
      inFlight = false
    }
  }

  const tick = async () => {
    await ping()
    // Only keep the loop running while logged in
    if (isLoggedInRef.value) scheduleNext(intervalMs)
  }

  const start = () => {
    if (timeoutId !== null) return
    // Quick first pass so UI reflects state soon after mount
    timeoutId = window.setTimeout(tick, Math.min(5_000, Math.floor(intervalMs / 2)))
  }

  // ---- Lifecycle ----
  onMounted(() => {
    if (isLoggedInRef.value) start()
    window.addEventListener('visibilitychange', tick, { passive: true })
    window.addEventListener('online', tick, { passive: true })
  })

  onBeforeUnmount(() => {
    stop()
    bc?.close?.()
    window.removeEventListener('visibilitychange', tick as any)
    window.removeEventListener('online', tick as any)
  })

  watchEffect(() => {
    if (isLoggedInRef.value) {
      start()
    } else {
      stop()
      status.value = 'idle'
      consecutiveAuthFails.value = 0
      reason.value = null
      nextCheckAt.value = null
    }
  })

  const paused = computed<boolean>(() => status.value === 'paused')

  return {
    status: readonly(status) as Readonly<Ref<Status>>,
    lastOkAt: readonly(lastOkAt) as Readonly<Ref<number | null>>,
    nextCheckAt: readonly(nextCheckAt) as Readonly<Ref<number | null>>,
    reason: readonly(reason) as Readonly<Ref<string | null>>,
    consecutiveAuthFails: readonly(consecutiveAuthFails) as Readonly<Ref<number>>,
    paused: readonly(paused) as Readonly<Ref<boolean>>,
    pingNow: ping,
  }
}
