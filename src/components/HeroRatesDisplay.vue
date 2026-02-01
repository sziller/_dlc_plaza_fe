<template>
  <div
    class="rounded-xl border border-secondary/60 shadow-lg bg-dark transition-all duration-500 ease-out"
    :class="[
      compact ? 'p-4' : 'p-5 sm:p-6',
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
      <!-- Borrow Card -->
      <router-link
        to="/register"
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
            class="font-bold text-secondary"
            :class="compact ? 'text-2xl' : 'text-3xl sm:text-4xl'"
          >
            {{ animatedBorrowRate }}
          </span>
          <span
            class="text-white/80"
            :class="compact ? 'text-sm' : 'text-lg'"
          >%</span>
        </div>
      </router-link>

      <!-- Lend Card -->
      <router-link
        to="/register"
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
            class="font-bold text-secondary"
            :class="compact ? 'text-2xl' : 'text-3xl sm:text-4xl'"
          >
            {{ animatedLendRate }}
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
import { ref, onMounted } from 'vue'

const props = defineProps({
  compact: { type: Boolean, default: false }
})

const mounted = ref(false)
const loading = ref(true)
const apiError = ref(false)
const animatedBorrowRate = ref('*.*')
const animatedLendRate = ref('*.*')

async function loadRates() {
  loading.value = false
  // Hardcoded rates for 1 Year term
  animatedBorrowRate.value = '10.9'
  animatedLendRate.value = '11.0'
  apiError.value = false
}

onMounted(async () => {
  mounted.value = true
  await loadRates()
})
</script>
