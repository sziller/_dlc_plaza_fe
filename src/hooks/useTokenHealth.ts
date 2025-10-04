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
  let timerId: number | null = null

  const status = ref<Status>('idle')
  const lastOkAt = ref<number | null>(null)
  const nextCheckAt = ref<number | null>(null)
  const consecutiveAuthFails = ref<number>(0)
  const reason = ref<string | null>(null)

  const bc: BroadcastChannel | null =
    'BroadcastChannel' in window ? new BroadcastChannel('auth') : null

  if (bc) {
    bc.onmessage = (e: MessageEvent) => {
      const data = (e && (e as any).data) || null
      if (data?.type === 'logout') {
        reason.value = data?.reason || 'auth-failed'
        status.value = 'invalid'
        onInvalid()
      }
    }
  }

  const paused = () => document.hidden || !navigator.onLine

  const isAuthError = (err: unknown) =>
    axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)

  const ping = async (): Promise<void> => {
    const t = getToken()
    if (import.meta?.env?.DEV) {
      // safe prefix only
      // eslint-disable-next-line no-console
      console.debug('[auth ping] token=', t ? t.slice(0, 12) + '…' : '(none)')
    }

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
      // Consider swapping to a lightweight /auth/ping endpoint if available
      await getUserProfile()
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
          // transient auth issue — try again on next tick
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

    const tick = async () => {
      nextCheckAt.value = Date.now() + intervalMs
      await ping()
    }

    timerId = window.setInterval(tick, intervalMs)
    // quick first pass so UI updates immediately
    window.setTimeout(tick, Math.min(5_000, Math.floor(intervalMs / 2)))
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

  const pausedComputed = computed<boolean>(() => status.value === 'paused')

  return {
    status: readonly(status) as Readonly<Ref<Status>>,
    lastOkAt: readonly(lastOkAt) as Readonly<Ref<number | null>>,
    nextCheckAt: readonly(nextCheckAt) as Readonly<Ref<number | null>>,
    reason: readonly(reason) as Readonly<Ref<string | null>>,
    consecutiveAuthFails: readonly(consecutiveAuthFails) as Readonly<Ref<number>>,
    paused: readonly(pausedComputed) as Readonly<Ref<boolean>>,
    pingNow: ping,
  }
}
