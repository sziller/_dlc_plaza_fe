<template>
  <div
    class="rounded-xl border border-secondary/60 shadow-lg bg-dark transition-transform duration-500 ease-out"
    :class="[
      compact ? 'p-4' : 'p-6 sm:p-8',
      mounted ? 'translate-y-0' : 'translate-y-4'
    ]"
  >
    <!-- Header row -->
    <div class="flex items-center justify-between" :class="compact ? 'mb-1' : 'mb-7'">
      <h2 class="font-bold text-white" :class="compact ? 'text-lg' : 'text-xl sm:text-2xl'">
        Live Market Rates
      </h2>
      <div class="flex items-center gap-1 border border-white/20 rounded px-2 py-1 text-xs text-white/70 font-mono cursor-default select-none">
        1 Year <span class="text-white/50 ml-0.5">▾</span>
      </div>
    </div>
    <!-- Rate rows -->
    <div class="space-y-2" :class="compact ? 'mb-3' : 'mb-10'">
      <!-- Earn row -->
      <router-link
        :to="linkTo"
        class="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-secondary/40 transition-all duration-200 cursor-pointer"
        :class="compact ? 'px-3 py-2.5' : 'px-4 py-5'"
      >
        <div>
          <div class="text-xs text-white/60 font-mono mb-0.5 uppercase tracking-wide">Earn as a lender</div>
          <div class="text-xs text-white/50 font-mono">USD-denominated · paid in BTC at maturity</div>
        </div>
        <div class="text-right flex-shrink-0 ml-4">
          <div class="flex items-baseline gap-0.5">
            <span
              class="font-bold tabular-nums transition-colors duration-500"
              :class="[compact ? 'text-2xl' : 'text-3xl', lendFlash === 'green' ? 'text-green-400' : lendFlash === 'red' ? 'text-red-400' : 'text-secondary']"
            >{{ animatedLendRate }}</span>
            <span class="text-white/70 text-sm">%</span>
          </div>
          <div class="text-xs text-white/50 font-mono">APY</div>
        </div>
      </router-link>

      <!-- Borrow row -->
      <router-link
        :to="linkTo"
        class="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-secondary/40 transition-all duration-200 cursor-pointer"
        :class="compact ? 'px-3 py-2.5' : 'px-4 py-5'"
      >
        <div>
          <div class="text-xs text-white/60 font-mono mb-0.5 uppercase tracking-wide">Borrow all-in</div>
          <div class="text-xs text-white/50 font-mono">12% interest + 1% Cadena fee</div>
        </div>
        <div class="text-right flex-shrink-0 ml-4">
          <div class="flex items-baseline gap-0.5">
            <span class="font-bold tabular-nums text-secondary" :class="compact ? 'text-2xl' : 'text-3xl'">{{ animatedBorrowRate }}</span>
            <span class="text-white/70 text-sm">%</span>
          </div>
          <div class="text-xs text-white/50 font-mono">APR</div>
        </div>
      </router-link>
    </div>

    <!-- Marketplace CTA -->
    <router-link
      :to="linkTo"
      class="block w-full text-center rounded-lg border border-secondary/50 text-secondary font-semibold hover:bg-secondary/10 transition-all duration-200"
      :class="compact ? 'py-2 text-sm' : 'py-2.5 text-sm'"
    >
      Open the marketplace →
    </router-link>

    <div v-if="loading" class="mt-3 text-center text-white/60 text-xs font-mono">
      Loading rates...
    </div>
    <div v-if="apiError" class="mt-3 text-center text-red-300 text-xs font-mono">
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

const borrowRate = ref(13.0)
const lendRate = ref(12.0)
const animatedBorrowRate = ref('*.*')
const animatedLendRate = ref('*.*')
const borrowFlash = ref('')
const lendFlash = ref('')

let tickInterval = null
let borrowFlashTimer = null
let lendFlashTimer = null

const deltas = [-0.1, 0, 0, 0.1]

function tickRates() {
  const lDelta = deltas[Math.floor(Math.random() * deltas.length)]

  if (lDelta !== 0) {
    lendRate.value = Math.round(Math.min(12.5, Math.max(11.5, lendRate.value + lDelta)) * 10) / 10
    animatedLendRate.value = lendRate.value.toFixed(1)
    lendFlash.value = lDelta > 0 ? 'green' : 'red'
    clearTimeout(lendFlashTimer)
    lendFlashTimer = setTimeout(() => { lendFlash.value = '' }, 600)
  }
  // Borrow is always lend + 1% fee, shown as fixed
  const newBorrow = Math.round((lendRate.value + 1.0) * 10) / 10
  if (newBorrow !== borrowRate.value) {
    borrowRate.value = newBorrow
    animatedBorrowRate.value = borrowRate.value.toFixed(1)
  }
}

async function loadRates() {
  loading.value = false
  animatedLendRate.value = lendRate.value.toFixed(1)
  animatedBorrowRate.value = borrowRate.value.toFixed(1)
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
