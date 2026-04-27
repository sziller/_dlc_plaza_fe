import { ref, watch, onBeforeUnmount, type Ref } from 'vue'

interface UseExitIntentOptions {
  armDelayMs?: number
  enabled: Ref<boolean>
}

const STORAGE_SHOWN = 'cadena:exit-intent-shown'
const STORAGE_SUBMITTED = 'cadena:exit-intent-submitted'

function ssGet(key: string): string | null {
  try { return sessionStorage.getItem(key) } catch { return null }
}
function ssSet(key: string, value: string) {
  try { sessionStorage.setItem(key, value) } catch {}
}

export function useExitIntent(options: UseExitIntentOptions) {
  const { armDelayMs = 10_000, enabled } = options

  const showPopup = ref(false)

  // In-memory guard so the popup only fires once per SPA session even if
  // sessionStorage is unavailable.
  let firedThisSession = ssGet(STORAGE_SHOWN) === '1'
  let submittedThisSession = ssGet(STORAGE_SUBMITTED) === '1'

  type State = 'IDLE' | 'ARMED' | 'TRIGGERED' | 'DONE'
  let state: State = firedThisSession || submittedThisSession ? 'DONE' : 'IDLE'

  let armTimer: ReturnType<typeof setTimeout> | null = null

  // --- Mobile scroll tracking ---
  let lastScrollY = 0
  let lastScrollTime = 0

  // --- Listeners ---
  function onMouseLeave(e: MouseEvent) {
    if (state !== 'ARMED') return
    if (e.clientY > 0) return // only fire when cursor exits through top edge
    trigger()
  }

  function onScroll() {
    if (state !== 'ARMED') return
    const now = Date.now()
    const currentY = window.scrollY

    // Detect fast upward scroll near the top of the page
    if (
      currentY < 200 &&
      lastScrollY - currentY > 300 &&
      now - lastScrollTime < 400
    ) {
      trigger()
    }

    lastScrollY = currentY
    lastScrollTime = now
  }

  function trigger() {
    state = 'TRIGGERED'
    ssSet(STORAGE_SHOWN, '1')
    firedThisSession = true
    showPopup.value = true
    removeListeners()
    state = 'DONE'
  }

  function attachListeners() {
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  function removeListeners() {
    document.documentElement.removeEventListener('mouseleave', onMouseLeave)
    window.removeEventListener('scroll', onScroll)
  }

  function clearArmTimer() {
    if (armTimer !== null) {
      clearTimeout(armTimer)
      armTimer = null
    }
  }

  function arm() {
    if (state !== 'IDLE') return
    clearArmTimer()
    // Seed mobile scroll tracking
    lastScrollY = window.scrollY
    lastScrollTime = Date.now()
    armTimer = setTimeout(() => {
      if (state !== 'IDLE') return
      state = 'ARMED'
      attachListeners()
    }, armDelayMs)
  }

  function disarm() {
    clearArmTimer()
    removeListeners()
    if (state === 'ARMED' || state === 'IDLE') {
      state = 'IDLE'
    }
  }

  // --- Public API ---
  function dismiss() {
    showPopup.value = false
  }

  function markSubmitted() {
    ssSet(STORAGE_SUBMITTED, '1')
    submittedThisSession = true
    showPopup.value = false
    state = 'DONE'
    removeListeners()
    clearArmTimer()
  }

  // --- Reactive enabled watcher ---
  watch(
    enabled,
    (isEnabled) => {
      if (isEnabled) {
        if (state === 'DONE') return // already shown or submitted
        arm()
      } else {
        disarm()
        showPopup.value = false
      }
    },
    { immediate: true },
  )

  // --- Cleanup on unmount ---
  onBeforeUnmount(() => {
    clearArmTimer()
    removeListeners()
  })

  return { showPopup, dismiss, markSubmitted }
}
