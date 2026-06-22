<template>
  <div class="flex flex-col items-center justify-center gap-1 h-full">
    <span v-if="cell.t === 'yes'" class="inline-flex items-center justify-center w-6 h-6 rounded-full" :class="isCadena ? 'bg-green-400/20' : 'bg-white/10'">
      <svg class="w-3.5 h-3.5" :class="isCadena ? 'text-green-400' : 'text-white/50'" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>
    </span>
    <span v-else-if="cell.t === 'no'" class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-400/15">
      <svg class="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
      </svg>
    </span>
    <span v-else-if="cell.t === 'partial'" class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/15 text-amber-400 font-bold text-sm leading-none">~</span>
    <span v-else-if="cell.t === 'dash'" class="text-white/25 text-base">—</span>
    <span v-else class="text-white/60 text-xs font-medium">{{ cell.n }}</span>
    <span v-if="isCadena && cell.n && cell.t !== 'text'" class="text-green-400/70 text-xs leading-snug max-w-[130px] text-center">{{ cell.n }}</span>
  </div>
</template>

<script setup>
defineProps({
  cell: { type: Object, required: true },
  isCadena: { type: Boolean, default: false },
})
</script>
