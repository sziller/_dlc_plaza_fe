import { ref, onMounted, onUnmounted } from 'vue'
import { getPrice } from '../api/price'
import { DEFAULT_ORACLE } from '../config'

// Module-scoped singleton — one interval for the whole app
const btcPriceUsd = ref<number | null>(null)
let consumers = 0
let intervalId: ReturnType<typeof setInterval> | null = null
let inFlight = false

async function fetchOnce() {
  if (inFlight) return
  inFlight = true
  try {
    const p = await getPrice(DEFAULT_ORACLE)
    if (Number.isFinite(p) && p > 0) btcPriceUsd.value = p
  } catch {
    // non-fatal; keep last known value
  } finally {
    inFlight = false
  }
}

function startPolling(pollMs = 30_000) {
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

export function useBtcPrice(pollMs = 30_000) {
  onMounted(() => {
    consumers++
    if (consumers === 1) startPolling(pollMs)
  })
  onUnmounted(() => {
    consumers--
    if (consumers === 0) stopPolling()
  })
  return { btcPriceUsd }
}
