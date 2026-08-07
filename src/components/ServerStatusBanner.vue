<template>
  <div
    v-show="isDown"
    class="fixed inset-x-0 z-[60] pointer-events-none top-[calc(var(--nav-h,80px)+var(--info-h,0px))]"
    role="alert"
    aria-live="assertive"
    :aria-hidden="!isDown"
  >
    <div
      class="px-4 py-2.5 bg-secondary/95 border-b border-secondary/40 text-white backdrop-blur flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pointer-events-auto text-center"
    >
      <span class="inline-block w-2 h-2 rounded-full bg-white animate-pulse flex-shrink-0" aria-hidden="true" />
      <p class="text-sm font-medium">
        Cadena's servers are currently down. Logging in and placing orders is temporarily unavailable.
      </p>
      <button
        class="px-3 py-1 rounded bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-semibold flex-shrink-0 transition inline-flex items-center gap-1.5 disabled:opacity-70"
        :disabled="checking"
        @click="retry"
      >
        <svg
          v-if="checking"
          class="w-3 h-3 animate-spin flex-shrink-0"
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
import { ref } from 'vue'
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
</script>
