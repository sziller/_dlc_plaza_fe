import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getServerStatus } from '../api/serverStatus'

export type ServerStatusValue = 'checking' | 'up' | 'down'

// Flip to true only for manually testing the down-state UI locally.
const FORCE_SERVER_DOWN = false

const DEFAULT_DOWNTIME_MSG =
  'There are no live rates right now and you will not be able to log in while the Cadena servers are under maintenance. Please try again shortly.'
const RATE_LIMIT_MSG =
  'Too many health-check requests from this IP. Please wait a moment and refresh. Rates are temporarily unavailable and logins are disabled until we reconnect.'

// Module-scoped singleton — one status/poll loop shared by every consumer
// (the global banner, the order flow, anything else that cares), so a
// down/up transition detected anywhere is reflected everywhere at once.
const status = ref<ServerStatusValue>(FORCE_SERVER_DOWN ? 'down' : 'checking')
const message = ref('')
const lastCheckedAt = ref<number | null>(null)

let consumers = 0
let intervalId: ReturnType<typeof setInterval> | null = null
let inFlight = false

async function checkNow() {
  if (FORCE_SERVER_DOWN) {
    status.value = 'down'
    message.value = DEFAULT_DOWNTIME_MSG
    lastCheckedAt.value = Date.now()
    return
  }
  if (inFlight) return
  inFlight = true
  try {
    const res = await getServerStatus()
    const payload = res?.payload
    if (payload?.ok && payload?.status === 'up') {
      status.value = 'up'
      message.value = ''
    } else {
      status.value = 'down'
      message.value = DEFAULT_DOWNTIME_MSG
    }
  } catch (error: any) {
    status.value = 'down'
    message.value = error?.response?.status === 429 ? RATE_LIMIT_MSG : DEFAULT_DOWNTIME_MSG
  } finally {
    lastCheckedAt.value = Date.now()
    inFlight = false
  }
}

/**
 * Fast-path signals fed by the global axios interceptor (see api/axiosSetup.ts):
 * any real request to our own backend already tells us whether it's reachable,
 * so we don't have to wait for the next scheduled health-check poll to notice.
 */
function markUp() {
  if (FORCE_SERVER_DOWN) return
  status.value = 'up'
  message.value = ''
  lastCheckedAt.value = Date.now()
}

function markDown() {
  if (FORCE_SERVER_DOWN) return
  status.value = 'down'
  if (!message.value) message.value = DEFAULT_DOWNTIME_MSG
  lastCheckedAt.value = Date.now()
}

export const serverStatusSignals = { markUp, markDown }

function startPolling(pollMs: number) {
  if (intervalId !== null) return
  checkNow()
  intervalId = setInterval(() => {
    if (!document.hidden && navigator.onLine) checkNow()
  }, pollMs)
}

function stopPolling() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

export function useServerStatus(pollMs = 45_000) {
  onMounted(() => {
    consumers++
    if (consumers === 1) startPolling(pollMs)
  })
  onUnmounted(() => {
    consumers--
    if (consumers === 0) stopPolling()
  })

  return {
    status,
    message,
    lastCheckedAt,
    isDown: computed(() => status.value === 'down'),
    isUp: computed(() => status.value === 'up'),
    checkNow,
  }
}
