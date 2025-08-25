<template>
  <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div class="bg-dark text-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-6 relative">
      <!-- Close Button -->
      <button @click="$emit('close')" :disabled="props.loading" class="absolute top-4 right-4 text-white hover:text-secondary text-xl font-bold disabled:opacity-50">×</button>

      <!-- Step 1: Order Entry -->
      <div v-if="step === 1">
        <h2 class="text-2xl font-bold text-center mb-4">
          Leave an order to {{ actionType }} Bitcoin
        </h2>
        <div v-if="props.notice?.text" :class="props.notice?.type === 'error' ? 'bg-red-500/15 border-red-500/40' : 'bg-green-500/15 border-green-500/40'"
          class="border rounded p-3 text-sm mb-3">
          {{ props.notice.text }}
        </div>

        <!-- Order Type -->
        <div v-if="marketIsZeroish">
          <label class="block mb-1 font-semibold">Order Type</label>
          <div class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 flex items-center justify-between">
            <span>Limit Order</span>
            <span class="text-xs px-2 py-1 rounded bg-secondary/20 border border-secondary/40">required</span>
          </div>
          <p class="text-xs text-white/70 mt-1">No market quote. Set your own rate.</p>
        </div>
        <div v-else>
          <label class="block mb-1 font-semibold">Order Type</label>
          <select
            v-model="orderType"
            class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none"
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
          </select>
          <p class="text-xs text-white/70 mt-1">
            Market executes at current rate. Limit lets you adjust relative to market.
          </p>
        </div>

        <!-- Rate Control -->
        <div class="mt-4">
          <label class="block mb-1 font-semibold">Rate for term</label>

          <!-- Market: show current rate only -->
          <div
            v-if="orderType === 'market'"
            class="w-full px-4 py-2 rounded bg-white/10 border border-white/20"
          >
            {{ marketRateStr || '*' }}
          </div>

          <!-- Limit: buttons only -->
          <div v-else class="w-full rounded bg-white/10 border border-white/20 p-3">
            <div class="flex items-center justify-between gap-3">
              <button
                aria-label="Decrease rate"
                @click="decrement"
                @pointerdown.prevent="startHold(-1)"
                @pointerup="stopHold"
                @pointerleave="stopHold"
                :disabled="minusDisabled"
                class="px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
              >−</button>

              <div class="text-lg font-bold tabular-nums">{{ fmt(rateNum) }}</div>

              <button
                aria-label="Increase rate"
                @click="increment"
                @pointerdown.prevent="startHold(1)"
                @pointerup="stopHold"
                @pointerleave="stopHold"
                :disabled="plusDisabled"
                class="px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
              >+</button>
            </div>
            <p class="text-xs text-white/70 mt-2">
              {{ marketIsZeroish
                ? 'No market quote. Choose your rate.'
                : (isBorrower ? 'You can move down or back up to market.' : 'You can move up or back down to market.')
              }}
              Tick: {{ STEP.toFixed(2) }}%.
            </p>
          </div>
        </div>

        <!-- Review Button -->
        <div class="text-center mt-6">
          <button
            @click="step = 2"
            :disabled="props.loading"
            class=" bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review Order
          </button>
        </div>
      </div>

      <!-- Step 2: Review -->
      <div v-else>
        <h2 class="text-2xl font-bold text-center mb-4">Review Your Order</h2>
        <div v-if="props.notice?.text" :class="props.notice?.type === 'error' ? 'bg-red-500/15 border-red-500/40' : 'bg-green-500/15 border-green-500/40'"
          class="border rounded p-3 text-sm mb-3">
          {{ props.notice.text }}
        </div>
        <ul class="space-y-2 text-sm text-white/90">
          <li><span class="font-semibold text-white">Loan Duration:</span> {{ loanDuration }}</li>
          <li><span class="font-semibold text-white">Amount:</span> 0.1 BTC</li>
          <li><span class="font-semibold text-white">Commission/Fees:</span> 0.25%</li>
          <li><span class="font-semibold text-white">Maturity Date:</span> {{ maturityDate }}</li>
          <li><span class="font-semibold text-white">Interest Rate for Term:</span> {{ orderType === 'market' ? marketRateStr : fmt(rateNum) }}</li>
          <li><span class="font-semibold text-white">Annualized Yield:</span> {{ annualizedYield(orderType === 'market' ? marketRateStr : fmt(rateNum), termDays) }}</li>
          <li><span class="font-semibold text-white">Role:</span> {{ actionType }}</li>
          <li><span class="font-semibold text-white">Collateral Contribution:</span> {{ collateralContribution }}</li>
        </ul>

        <div class="flex justify-between items-center mt-6">
          <button @click="step = 1" :disabled="props.loading" class="text-white hover:text-secondary text-sm underline disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
          <button
          v-if="!isSuccess"
          @click="submitOrder"
          :disabled="props.loading"
          class="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!props.loading">Submit Order</span>
          <span v-else class="inline-flex items-center gap-2">
            <span class="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            Submitting…
          </span>
        </button>
        </div>
      </div>
      <div v-if="props.loading" class="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
        <div class="flex flex-col items-center gap-3">
          <div class="h-8 w-8 rounded-full border-4 border-white/30 border-t-white animate-spin"></div>
          <div class="text-sm text-white/80">Submitting…</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'

const props = defineProps({
  rate: String,
  actionType: String,
  termDays: { type: Number, default: 90 },
  loading: { type: Boolean, default: false },
  notice:  { type: Object,  default: () => ({ type: '', text: '' }) },
})
const emit = defineEmits(['close', 'submit'])

const orderType = ref('market')
const step = ref(1)
const isBorrower = computed(() => (props.actionType || '').toLowerCase() === 'borrow')
const isSuccess = computed(() => props.notice?.type === 'success')
// Helpers
function toNum(rateStr) {
  const m = rateStr?.match(/([\d.]+)/)
  return m ? parseFloat(m[1]) : NaN
}
function fmtNum(n) { return Number.isNaN(n) ? NaN : parseFloat(n.toFixed(2)) }
function fmt(n) { return Number.isNaN(n) ? '*' : `${n.toFixed(2)}%` }

// Baseline market rate
const marketRateNum = computed(() => {
  const n = toNum(props.rate)
  return Number.isNaN(n) ? 0 : n
})
const marketRateStr = computed(() => fmt(marketRateNum.value))
const marketIsZeroish = computed(() => {
  const raw = (props.rate || '').trim()
  const n = toNum(props.rate)
  return raw === '*' || Number.isNaN(n) || n === 0
})

// Enforce limit-only when zeroish
watch(marketIsZeroish, (zr) => { if (zr) orderType.value = 'limit' }, { immediate: true })

// Limit selection state
const STEP = 0.01
const rateNum = ref(marketRateNum.value)
watch(orderType, () => { rateNum.value = marketRateNum.value })
watch(() => marketRateNum.value, (n) => { rateNum.value = n })

// Button guards
const plusDisabled = computed(() => {
  if (orderType.value !== 'limit') return true
  if (isBorrower.value) return marketIsZeroish.value ? rateNum.value >= 100 : rateNum.value >= marketRateNum.value
  return rateNum.value >= 100
})
const minusDisabled = computed(() => {
  if (orderType.value !== 'limit') return true
  if (isBorrower.value) return rateNum.value <= 0
  const floor = marketIsZeroish.value ? 0 : marketRateNum.value
  return rateNum.value <= floor
})

// Single-tap nudge
function increment() { incrementBy(STEP) }
function decrement() { decrementBy(STEP) }

// Variable step setters (used by hold)
function incrementBy(delta) {
  if (orderType.value !== 'limit') return
  const next = fmtNum(rateNum.value + delta)
  if (isBorrower.value) {
    rateNum.value = marketIsZeroish.value ? Math.min(100, next) : Math.min(marketRateNum.value, next)
  } else {
    rateNum.value = Math.min(100, next)
  }
}
function decrementBy(delta) {
  if (orderType.value !== 'limit') return
  const next = fmtNum(rateNum.value - delta)
  if (isBorrower.value) {
    rateNum.value = Math.max(0, next)
  } else {
    const floor = marketIsZeroish.value ? 0 : marketRateNum.value
    rateNum.value = Math.max(floor, next)
  }
}

// Press-and-hold acceleration
const HOLD_START_DELAY = 300   // ms before repeat starts
const HOLD_INTERVAL = 50       // ms between repeats
let holdTimer = null
let holdInfo = { dir: 0, startedAt: 0 }

function startHold(dir) {
  if (orderType.value !== 'limit') return
  if (dir > 0 && plusDisabled.value) return
  if (dir < 0 && minusDisabled.value) return
  stopHold()
  holdInfo = { dir, startedAt: Date.now() }
  holdTimer = setTimeout(tickHold, HOLD_START_DELAY)
  window.addEventListener('pointerup', stopHold)
  window.addEventListener('blur', stopHold)
}
function tickHold() {
  const heldMs = Date.now() - holdInfo.startedAt
  // accelerate step size over time
  const mult = heldMs >= 3000 ? 100 : heldMs >= 1500 ? 20 : heldMs >= 500 ? 5 : 1
  const delta = STEP * mult
  if (holdInfo.dir > 0) {
    incrementBy(delta)
    if (plusDisabled.value) return stopHold()
  } else {
    decrementBy(delta)
    if (minusDisabled.value) return stopHold()
  }
  holdTimer = setTimeout(tickHold, HOLD_INTERVAL)
}
function stopHold() {
  if (holdTimer) { clearTimeout(holdTimer); holdTimer = null }
  window.removeEventListener('pointerup', stopHold)
  window.removeEventListener('blur', stopHold)
}
onUnmounted(stopHold)

// Duration and dates
const loanDuration = computed(() => `${props.termDays} Days`)
const maturityDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + (Number.isFinite(props.termDays) ? props.termDays : 0))
  return d.toLocaleDateString()
})

// Yield
function annualizedYield(rateStr, days) {
  if (!rateStr || rateStr === '*' || !Number.isFinite(days) || days <= 0) return '*'
  const m = rateStr.match(/([\d.]+)%/)
  if (!m) return '*'
  const r = parseFloat(m[1])
  if (days!=365) return `${(100 *(1+ r * 0.01) **  (360 / days)-100).toFixed(2)}%`
  return rateStr
}

// Submit
function submitOrder () {
  const finalRateStr = orderType.value === 'market' ? marketRateStr.value : fmt(rateNum.value)
  emit('submit', {
    action: props.actionType,
    orderType: orderType.value,
    rate: finalRateStr,
    duration: loanDuration.value,
    durationDays: props.termDays,
    maturityDate: maturityDate.value,
    annualizedYield: annualizedYield(finalRateStr, props.termDays),
    amount: '0.1 BTC',
    collateralContribution: (props.actionType === 'Lend') ? '0%' : '100%',
    fees: '0.25%',
  })
  
}
</script>
