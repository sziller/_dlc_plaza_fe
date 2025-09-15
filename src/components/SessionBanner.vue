<template>
  <div
    class="fixed top-0 inset-x-0 z-[1000] pointer-events-none"
    aria-live="polite"
    :aria-hidden="!isVisible"
    v-show="isVisible"
  >
    <div
      class="mx-auto max-w-7xl px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/30 text-yellow-100 backdrop-blur flex items-center gap-3 pointer-events-auto"
      role="status"
    >
      <span class="inline-block w-2 h-2 rounded-full" :class="dotClass" />
      <p class="text-sm">
        <span v-if="statusNow === 'checking'">Reconnecting…</span>
        <span v-else-if="statusNow === 'paused'">
          Checks paused <span class="opacity-70">(tab hidden or offline)</span>
        </span>
        <span v-else-if="statusNow === 'invalid'">Session expired. Please sign in again.</span>
        <span v-else-if="statusNow === 'healthy'">
          Connected<span v-if="eta" class="opacity-70"> — next check in {{ eta }}s</span>
        </span>
      </p>

      <div class="ml-auto flex items-center gap-2">
        <button
          v-if="statusNow !== 'invalid'"
          class="px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs"
          @click="$emit('refresh')"
        >
          Check now
        </button>
        <button
          v-else
          class="px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-100 text-xs"
          @click="$emit('signin')"
        >
          Sign in
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Use safe defaults so missing/undefined props don't break render
const props = defineProps({
  status: { type: String, default: 'healthy' }, // 'idle' | 'checking' | 'healthy' | 'paused' | 'invalid'
  nextCheckAt: { type: Number, default: null }
})

const statusNow = computed(() => props.status || 'healthy')

// Only show when not idle/healthy
const isVisible = computed(() => statusNow.value !== 'idle' && statusNow.value !== 'healthy')

// Non-blocking dot style
const dotClass = computed(() => ({
  'bg-green-400': statusNow.value === 'healthy',
  'bg-yellow-400 animate-pulse': statusNow.value === 'checking' || statusNow.value === 'paused',
  'bg-red-400': statusNow.value === 'invalid',
}))

const eta = computed(() => {
  if (!props.nextCheckAt || isNaN(props.nextCheckAt)) return null
  return Math.max(0, Math.round((props.nextCheckAt - Date.now()) / 1000))
})
</script>
