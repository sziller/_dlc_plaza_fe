<template>
  <div
    v-show="isDown"
    class="fixed inset-x-0 z-[60] pointer-events-none top-[calc(var(--nav-h,80px)+var(--info-h,0px))]"
    role="alert"
    aria-live="assertive"
    :aria-hidden="!isDown"
  >
    <div
      ref="barRef"
      class="px-3 py-1.5 sm:px-4 sm:py-2.5 bg-secondary/95 border-b border-secondary/40 text-white backdrop-blur flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:gap-x-3 pointer-events-auto text-center"
    >
      <span class="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse flex-shrink-0" aria-hidden="true" />
      <p class="text-xs sm:text-sm font-medium">
        Cadena's servers are currently down. Logging in and placing orders is temporarily unavailable.
      </p>
      <button
        class="px-2 py-0.5 sm:px-3 sm:py-1 rounded bg-white/15 hover:bg-white/25 border border-white/25 text-[11px] sm:text-xs font-semibold flex-shrink-0 transition inline-flex items-center gap-1.5 disabled:opacity-70"
        :disabled="checking"
        @click="retry"
      >
        <svg
          v-if="checking"
          class="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ checking ? 'Checking…' : 'Retry' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useServerStatus } from '../composables/useServerStatus'

const { isDown, checkNow } = useServerStatus()

// A real check can resolve in well under 100ms, which reads as the button
// doing nothing. Hold the "Checking…" state for a minimum stretch so a
// click always visibly registers, even when the answer is still "down".
const checking = ref(false)
async function retry() {
  if (checking.value) return
  checking.value = true
  const start = Date.now()
  try {
    await checkNow()
  } finally {
    const elapsed = Date.now() - start
    const minMs = 700
    if (elapsed < minMs) await new Promise((r) => setTimeout(r, minMs - elapsed))
    checking.value = false
  }
}

// Publish our own rendered height as --banner-h, mirroring how Navbar.vue
// publishes --nav-h/--info-h, so App.vue can push page content down by
// exactly this much instead of letting the banner overlap it.
const barRef = ref(null)
let resizeObs = null

function publishHeight(h) {
  document.documentElement.style.setProperty('--banner-h', h + 'px')
}

function measure() {
  publishHeight(isDown.value && barRef.value ? barRef.value.offsetHeight : 0)
}

watch(
  isDown,
  async (down) => {
    await nextTick()
    if (down && barRef.value) {
      if (!resizeObs && 'ResizeObserver' in window) {
        resizeObs = new ResizeObserver(measure)
      }
      resizeObs?.observe(barRef.value)
      measure()
    } else {
      resizeObs?.disconnect()
      publishHeight(0)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  resizeObs?.disconnect()
  publishHeight(0)
})
</script>
