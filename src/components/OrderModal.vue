<template>
  <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div class="bg-dark text-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-6 relative">
      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-4 right-4 text-white hover:text-secondary text-xl font-bold">×</button>

      <!-- Step 1: Order Entry -->
      <div v-if="step === 1">
        <h2 class="text-2xl font-bold text-center mb-4">
          Leave an order to {{ actionType }} Bitcoin
        </h2>

        <!-- Order Type Dropdown -->
        <div>
          <label class="block mb-1 font-semibold">Order Type</label>
          <select
            v-model="orderType"
            class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none"
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
          </select>
          <p class="text-xs text-white/70 mt-1">
            Market orders execute immediately at the current rate. Limit orders only execute at the rate you specify.
          </p>
        </div>

        <!-- Rate Input -->
        <div>
          <label class="block mb-1 font-semibold mt-4">Rate</label>
          <input
            type="text"
            v-model="rate"
            :disabled="orderType === 'market'"
            class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none disabled:opacity-50"
          />
        </div>

        <!-- Review Button -->
        <div class="text-center mt-6">
          <button
            @click="step = 2"
            class="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded font-semibold"
          >
            Review Order
          </button>
        </div>
      </div>

      <!-- Step 2: Review -->
      <div v-else>
        <h2 class="text-2xl font-bold text-center mb-4">Review Your Order</h2>
        <ul class="space-y-2 text-sm text-white/90">
          <li><span class="font-semibold text-white">Loan Duration:</span> {{ loanDuration }}</li>
          <li><span class="font-semibold text-white">Amount:</span> 0.1 BTC</li>
          <li><span class="font-semibold text-white">Commission/Fees:</span> 0.25%</li>
          <li><span class="font-semibold text-white">Maturity Date:</span> {{ maturityDate }}</li>
          <li><span class="font-semibold text-white">Interest Rate for Term:</span> {{ rate }}</li>
          <li><span class="font-semibold text-white">Annualized Yield:</span> {{ annualizedYield(rate, loanDuration) }}</li>
          <li><span class="font-semibold text-white">Role:</span> {{ actionType }}</li>
          <li><span class="font-semibold text-white">Collateral Contribution:</span> {{ collateralContribution }}</li>
        </ul>

        <!-- Buttons -->
        <div class="flex justify-between items-center mt-6">
          <button
            @click="step = 1"
            class="text-white hover:text-secondary text-sm underline"
          >
            Back
          </button>
          <button
            @click="submitOrder"
            class="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded font-semibold"
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  rate: String,
  actionType: String, // "Lend" or "Borrow"
})
const emit = defineEmits(['close', 'submit'])

const orderType = ref('market')
const rate = ref(props.rate)
const step = ref(1)

// Static data for demo — adjust as needed
const loanDuration = '90 Days'
const collateralContribution = computed(() => props.actionType === 'Lend' ? '0%' : '100%')

const maturityDate = computed(() => {
  const match = loanDuration.match(/(\d+)/)
  const days = match ? parseInt(match[1]) : 0
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString()
})

function annualizedYield(rateStr, durationLabel) {
  if (!rateStr || rateStr === '*') return '*'
  const match = rateStr.match(/([\d.]+)%/)
  if (!match) return '*'
  const rate = parseFloat(match[1])
  const daysMatch = durationLabel.match(/(\d+)/)
  const days = daysMatch ? parseInt(daysMatch[1]) : 0
  if (days === 0) return '*'
  return `${(rate * 360 / days).toFixed(2)}%`
}

watch(orderType, (val) => {
  if (val === 'market') rate.value = props.rate
})

function submitOrder () {
  emit('submit', {
    action: props.actionType,
    orderType: orderType.value,
    rate: rate.value,
    duration: loanDuration,
    maturityDate: maturityDate.value,
    annualizedYield: annualizedYield(rate.value, loanDuration),
    amount: '0.1 BTC',
    collateralContribution: collateralContribution.value,
    fees: '0.25%',
  })
  emit('close')
}
</script>
