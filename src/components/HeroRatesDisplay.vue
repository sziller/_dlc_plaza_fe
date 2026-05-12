<template>
  <div
    class="rounded-xl border border-secondary/60 shadow-lg bg-dark transition-transform duration-500 ease-out"
    :class="[
      compact ? 'p-4' : 'p-5 sm:p-6',
      mounted ? 'translate-y-0' : 'translate-y-4'
    ]"
  >
    <h3
      class="font-bold text-white text-center"
      :class="compact ? 'text-xl mb-1' : 'text-2xl sm:text-3xl mb-2'"
    >
      Market Rates
    </h3>
    <div
      class="text-white/70 text-center"
      :class="compact ? 'text-xs mb-3' : 'text-sm mb-4'"
    >
      1 Year Term
    </div>

    <!-- Side-by-side rate cards -->
    <div :class="compact ? 'flex gap-2' : 'flex gap-3 sm:gap-4'">
      <!-- Lend Card -->
      <router-link
        :to="linkTo"
        class="flex-1 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-secondary/40 cursor-pointer block"
        :class="compact ? 'p-2.5' : 'p-3 sm:p-4'"
      >
        <div
          class="bg-secondary text-white font-semibold rounded-md text-center"
          :class="compact ? 'text-xs py-1.5 px-2 mb-2' : 'text-sm py-2 px-3 mb-3'"
        >
          Lend
        </div>
        <div class="flex items-baseline justify-center gap-0.5">
          <span
            class="font-bold transition-colors duration-500"
            style="font-variant-numeric: tabular-nums"
            :class="[
              compact ? 'text-2xl' : 'text-3xl sm:text-4xl',
              lendFlash === 'green' ? 'text-green-400' : lendFlash === 'red' ? 'text-red-400' : 'text-secondary'
            ]"
          >
            {{ animatedLendRate }}
          </span>
          <span
            class="text-white/80"
            :class="compact ? 'text-sm' : 'text-lg'"
          >%</span>
        </div>
      </router-link>

      <!-- Borrow Card -->
      <router-link
        :to="linkTo"
        class="flex-1 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-secondary/40 cursor-pointer block"
        :class="compact ? 'p-2.5' : 'p-3 sm:p-4'"
      >
        <div
          class="bg-secondary/70 text-white font-semibold rounded-md text-center"
          :class="compact ? 'text-xs py-1.5 px-2 mb-2' : 'text-sm py-2 px-3 mb-3'"
        >
          Borrow
        </div>
        <div class="flex items-baseline justify-center gap-0.5">
          <span
            class="font-bold transition-colors duration-500"
            style="font-variant-numeric: tabular-nums"
            :class="[
              compact ? 'text-2xl' : 'text-3xl sm:text-4xl',
              borrowFlash === 'green' ? 'text-green-400' : borrowFlash === 'red' ? 'text-red-400' : 'text-secondary'
            ]"
          >
            {{ animatedBorrowRate }}
          </span>
          <span
            class="text-white/80"
            :class="compact ? 'text-sm' : 'text-lg'"
          >%</span>
        </div>
      </router-link>
    </div>

    <div v-if="loading" class="mt-4 text-center text-white/60 text-sm">
      Loading rates...
    </div>
    <div v-if="apiError" class="mt-4 text-center text-red-300 text-sm">
      Rates temporarily unavailable
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  compact: { type: Boolean, default: false },
  linkTo: { type: String, default: '/register' }
})

const mounted = ref(false)
const loading = ref(true)
const apiError = ref(false)

const borrowRate = ref(11.5)
const lendRate = ref(11.4)
const animatedBorrowRate = ref('*.*')
const animatedLendRate = ref('*.*')
const borrowFlash = ref('')
const lendFlash = ref('')

let tickInterval = null
let borrowFlashTimer = null
let lendFlashTimer = null

const deltas = [-0.2, -0.1, 0, 0.1, 0.2]

function tickRates() {
  const bDelta = deltas[Math.floor(Math.random() * deltas.length)]

  if (bDelta !== 0) {
    borrowRate.value = Math.round(Math.min(12.0, Math.max(11.1, borrowRate.value + bDelta)) * 10) / 10
    animatedBorrowRate.value = borrowRate.value.toFixed(1)
    borrowFlash.value = bDelta > 0 ? 'green' : 'red'
    clearTimeout(borrowFlashTimer)
    borrowFlashTimer = setTimeout(() => { borrowFlash.value = '' }, 600)
  }

  const newLend = Math.round((borrowRate.value - 0.1) * 10) / 10
  if (newLend !== lendRate.value) {
    const dir = newLend > lendRate.value ? 'green' : 'red'
    lendRate.value = newLend
    animatedLendRate.value = lendRate.value.toFixed(1)
    lendFlash.value = dir
    clearTimeout(lendFlashTimer)
    lendFlashTimer = setTimeout(() => { lendFlash.value = '' }, 600)
  }
}

async function loadRates() {
  loading.value = false
  animatedBorrowRate.value = borrowRate.value.toFixed(1)
  animatedLendRate.value = lendRate.value.toFixed(1)
  apiError.value = false
}

onMounted(async () => {
  mounted.value = true
  await loadRates()
  tickInterval = setInterval(tickRates, 3000)
})

onBeforeUnmount(() => {
  clearInterval(tickInterval)
  clearTimeout(borrowFlashTimer)
  clearTimeout(lendFlashTimer)
})
</script>
