import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getPrice } from '../api/price'
import { DEFAULT_ORACLE } from '../config'

// Module-scoped singleton — one interval for the whole app
const btcPriceUsd = ref<number | null>(null)
const lastUpdatedAt = ref<number | null>(null)
// Bumped on every poll attempt (success or failure) so `isStale` re-evaluates
// on a schedule, instead of only when a fetch actually succeeds.
const tick = ref<number>(Date.now())

let consumers = 0
let intervalId: ReturnType<typeof setInterval> | null = null
let inFlight = false

const POLL_MS_DEFAULT = 30_000
// If we haven't had a successful fetch in this long, treat the displayed
// price as stale rather than silently presenting old data as live — this is
// the one thing we should keep showing even if Cadena's backend is down, but
// the user should be able to tell it's not fresh.
const STALE_AFTER_MS = POLL_MS_DEFAULT * 3

async function fetchOnce() {
  if (inFlight) return
  inFlight = true
  try {
    const p = await getPrice(DEFAULT_ORACLE)
    if (Number.isFinite(p) && p > 0) {
      btcPriceUsd.value = p
      lastUpdatedAt.value = Date.now()
    }
  } catch {
    // non-fatal; keep last known value — but don't touch lastUpdatedAt,
    // so `isStale` reflects how old that value actually is.
  } finally {
    inFlight = false
    tick.value = Date.now()
  }
}

function startPolling(pollMs = POLL_MS_DEFAULT) {
  if (intervalId !== null) return
  fetchOnce()
  intervalId = setInterval(() => {
    if (!document.hidden) fetchOnce()
  }, pollMs)
}

function stopPolling() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

export function useBtcPrice(pollMs = POLL_MS_DEFAULT) {
  onMounted(() => {
    consumers++
    if (consumers === 1) startPolling(pollMs)
  })
  onUnmounted(() => {
    consumers--
    if (consumers === 0) stopPolling()
  })

  const isStale = computed(() => {
    void tick.value
    if (btcPriceUsd.value === null) return false
    if (lastUpdatedAt.value === null) return true
    return Date.now() - lastUpdatedAt.value > STALE_AFTER_MS
  })

  return { btcPriceUsd, lastUpdatedAt, isStale }
}
