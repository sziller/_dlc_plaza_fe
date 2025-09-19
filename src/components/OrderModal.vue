<template>
  <div
    class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    @click.self="closeSelf"
  >
    <div
      class="bg-dark text-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-6 relative"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="descId"
      :aria-busy="loading ? 'true' : 'false'"
      ref="dialogRef"
      @keydown.tab.prevent="onTab"
      @keydown.esc.prevent="closeSelf"
    >
      <!-- Close Button -->
      <button
        type="button"
        @click="closeSelf"
        :disabled="loading"
        class="absolute top-4 right-4 text-white hover:text-secondary text-xl font-bold disabled:opacity-50"
        aria-label="Close dialog"
      >
        ×
      </button>

      <!-- Step 1: Order Entry -->
      <div v-if="step === 1">
        <h2 :id="titleId" class="text-2xl font-bold text-center mb-4">
          Leave an order to {{ actionType }} Bitcoin
        </h2>

        <!-- live region for notices -->
        <div
          v-if="notice?.text"
          :class="notice?.type === 'error' ? 'bg-red-500/15 border-red-500/40' : 'bg-green-500/15 border-green-500/40'"
          class="border rounded p-3 text-sm mb-3"
          role="status"
          aria-live="polite"
        >
          {{ notice.text }}
        </div>

        <!-- Order Type -->
        <div :id="descId" class="sr-only">
          Configure your order type and rate, then review before submitting.
        </div>

        <div v-if="marketIsZeroish">
          <label class="block mb-1 font-semibold">Order Type</label>
          <div class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 flex items-center justify-between">
            <span>Limit Order</span>
            <span class="text-xs px-2 py-1 rounded bg-secondary/20 border border-secondary/40">required</span>
          </div>
          <p class="text-xs text-white/70 mt-1">No market quote. Set your own rate.</p>
        </div>

        <div v-else>
          <label class="block mb-1 font-semibold" for="order-type">Order Type</label>
          <select
            id="order-type"
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
          <div v-if="orderType === 'market'" class="w-full px-4 py-2 rounded bg-white/10 border border-white/20">
            {{ marketRateStr || '*' }}
          </div>

          <!-- Limit: input + buttons -->
          <div v-else class="w-full rounded bg-white/10 border border-white/20 p-3">
            <div class="flex items-center justify-between gap-3">
              <button
                type="button"
                aria-label="Decrease rate"
                @click="decrement"
                @pointerdown.prevent="startHold(-1)"
                @pointerup="stopHold"
                @pointerleave="stopHold"
                :disabled="minusDisabled"
                class="px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
              >−</button>

              <!-- Editable numeric input (4 decimals) -->
              <input
                type="text"
                inputmode="decimal"
                pattern="[0-9]*[.]?[0-9]*"
                v-model="rateInput"
                @input="onRateInput"
                @focus="onRateFocus"
                @blur="onRateBlur"
                class="w-32 text-center px-3 py-2 rounded bg-white/10 border border-white/20 focus:outline-none font-bold tabular-nums"
                aria-label="Rate percentage"
                :aria-describedby="rateHelpId"
              />

              <button
                type="button"
                aria-label="Increase rate"
                @click="increment"
                @pointerdown.prevent="startHold(1)"
                @pointerup="stopHold"
                @pointerleave="stopHold"
                :disabled="plusDisabled"
                class="px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
              >+</button>
            </div>
            <p :id="rateHelpId" class="text-xs text-white/70 mt-2 text-center">
              {{ marketIsZeroish
                ? 'No market quote. Choose your rate.'
                : (isBorrower ? 'You can move down or back up to market.' : 'You can move up or back down to market.')
              }}
              Tick: {{ STEP.toFixed(RATE_DECIMALS) }}%.
            </p>

            <!-- Annualized, centered under rate for term -->
            <div class="mt-3 text-center">
              <div class="text-xs text-white/70">Annualized yield</div>
              <div class="mt-1 font-semibold tabular-nums">
                {{ annualizedYield(termRateStr, termDays) }}
              </div>
            </div>
          </div>

          <!-- Market-mode annualized, also centered -->
          <div v-if="orderType === 'market'" class="mt-3 text-center">
            <div class="text-xs text-white/70">Annualized yield</div>
            <div class="mt-1 font-semibold tabular-nums">
              {{ annualizedYield(termRateStr, termDays) }}
            </div>
          </div>
        </div>

        <!-- Review Button -->
        <div class="text-center mt-6">
          <button
            type="button"
            @click="step = 2"
            :disabled="loading"
            class="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review Order
          </button>
        </div>
      </div>

      <!-- Step 2: Review -->
      <div v-else>
        <h2 :id="titleId" class="text-2xl font-bold text-center mb-4">Review Your Order</h2>

        <div
          v-if="notice?.text"
          :class="notice?.type === 'error' ? 'bg-red-500/15 border-red-500/40' : 'bg-green-500/15 border-green-500/40'"
          class="border rounded p-3 text-sm mb-3"
          role="status"
          aria-live="polite"
        >
          {{ notice.text }}
        </div>

        <ul class="space-y-2 text-sm text-white/90">
          <li><span class="font-semibold text-white">Loan Duration:</span> {{ loanDuration }}</li>
          <li><span class="font-semibold text-white">Amount:</span> {{ formatBtc(amountBtc) }}</li>
          <li><span class="font-semibold text-white">Commission/Fees:</span> 0.50%</li>
          <li><span class="font-semibold text-white">Maturity Date:</span> {{ maturityDate }}</li>
          <li><span class="font-semibold text-white">Interest Rate for Term:</span> {{ termRateStr }}</li>
          <li><span class="font-semibold text-white">Annualized Yield:</span> {{ annualizedYield(termRateStr, termDays) }}</li>
          <li><span class="font-semibold text-white">Role:</span> {{ actionType }}</li>
          <li><span class="font-semibold text-white">Collateral Contribution:</span> {{ collateralContribution }}</li>
        </ul>

        <div class="flex justify-between items-center mt-6">
          <button
            type="button"
            @click="step = 1"
            :disabled="loading"
            class="text-white hover:text-secondary text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            v-if="!isSuccess"
            type="button"
            @click="submitOrder"
            :disabled="loading"
            class="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Submit Order</span>
            <span v-else class="inline-flex items-center gap-2">
              <span class="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
              Submitting…
            </span>
          </button>
        </div>
      </div>

      <!-- Loading veil -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl"
        aria-hidden="true"
      >
        <div class="flex flex-col items-center gap-3">
          <div class="h-8 w-8 rounded-full border-4 border-white/30 border-t-white animate-spin"></div>
          <div class="text-sm text-white/80">Submitting…</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, toRefs } from 'vue'

const props = defineProps({
  rate: String,
  actionType: String,
  termDays: { type: Number, default: 90 },
  loading: { type: Boolean, default: false },
  notice:  { type: Object,  default: () => ({ type: '', text: '' }) },
  /**
   * LTV can be given as a ratio (0.5, 0.8) or a percent (50, 80).
   * We'll normalize to 0..1.
   */
  ltv: { type: Number, default: 0.5 },
})
const emit = defineEmits(['close', 'submit'])

const { loading, notice, termDays, actionType, rate, ltv } = toRefs(props)

const orderType = ref('market')
const step = ref(1)
const isBorrower = computed(() => (actionType.value || '').toLowerCase() === 'borrow')
const isSuccess = computed(() => notice.value?.type === 'success')

// ===== Formatting constants =====
const RATE_DECIMALS = 4                        // show rate to 4 dp
const ANNUAL_DECIMALS = 2                      // annualized shown to 2 dp
const STEP = 0.1                               // % step (0.1%)
const FEE_PCT = 0.005                          // 0.50% as decimal

// IDs for accessibility
const titleId = `order-modal-title-${Math.random().toString(36).slice(2)}`
const descId  = `order-modal-desc-${Math.random().toString(36).slice(2)}`
const rateHelpId = `order-modal-ratehelp-${Math.random().toString(36).slice(2)}`
const dialogRef = ref(null)

// Focus trap + scroll lock
let lastFocus = null
onMounted(() => {
  lastFocus = document.activeElement
  document.body.classList.add('overflow-hidden')
  setTimeout(() => {
    const el = dialogRef.value
    const target = el && el.querySelector(focusSel)
    target?.focus?.()
  }, 0)
})
onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
  if (lastFocus && typeof lastFocus.focus === 'function') {
    lastFocus.focus()
  }
})
const focusSel =
  'button, [href], select, textarea, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])'

function getFocusable() {
  const root = dialogRef.value
  if (!root) return []
  return Array.from(root.querySelectorAll(focusSel))
    .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null)
}
function onTab(e) {
  const nodes = getFocusable()
  if (!nodes.length) return
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  const active = document.activeElement
  if (e.shiftKey) {
    if (active === first || !nodes.includes(active)) last.focus()
    else nodes[nodes.indexOf(active) - 1]?.focus()
  } else {
    if (active === last || !nodes.includes(active)) first.focus()
    else nodes[nodes.indexOf(active) + 1]?.focus()
  }
}
function closeSelf() { emit('close') }

// ===== Year-consistency helpers =====
function isYearish(days) {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
function displayDays(days) {
  // UI should always show 365 for any ~1-year term
  return isYearish(days) ? 365 : Math.round(Number(days) || 0)
}

// ===== Helpers =====
function toNum(rateStr) {
  const m = rateStr?.match(/([\d.]+)/)
  return m ? parseFloat(m[1]) : NaN
}
function roundRate(n) { return Number.isNaN(n) ? NaN : parseFloat(n.toFixed(RATE_DECIMALS)) }
function fmt(n) { return Number.isNaN(n) ? '*' : `${n.toFixed(RATE_DECIMALS)}%` }
function formatBtc(n) {
  const x = Number(n)
  return Number.isFinite(x) ? `${x.toFixed(4)} BTC` : '*'
}
function roundBtc(n) {
  const x = Number(n)
  return Number.isFinite(x) ? Number(x.toFixed(8)) : NaN
}
function clampRate(val) {
  let min = 0
  let max = 100
  if (!marketIsZeroish.value) {
    if (isBorrower.value) {
      // borrower can go down from market, not above it
      max = marketRateNum.value
    } else {
      // lender can go up from market, not below it
      min = marketRateNum.value
    }
  }
  if (!Number.isFinite(val)) return Number.isNaN(val) ? NaN : val
  return Math.min(Math.max(val, min), max)
}

// ===== Baseline market rate =====
const marketRateNum = computed(() => {
  const n = toNum(rate.value)
  return Number.isNaN(n) ? 0 : n
})
const marketRateStr = computed(() => fmt(marketRateNum.value))
const marketIsZeroish = computed(() => {
  const raw = (rate.value || '').trim()
  const n = toNum(rate.value)
  return raw === '*' || Number.isNaN(n) || n === 0
})

// Enforce limit-only when zeroish
watch(marketIsZeroish, (zr) => { if (zr) orderType.value = 'limit' }, { immediate: true })

// ===== Limit selection state =====
const rateNum = ref(marketRateNum.value)      // numeric backing value (0..100, NaN allowed when input empty)
const rateInput = ref('')                     // string shown in input
const rateInputFocused = ref(false)

watch(orderType, () => { rateNum.value = marketRateNum.value })
watch(marketRateNum, (n) => { rateNum.value = n })

// keep input in sync with number when not typing
watch(rateNum, (n) => {
  if (!rateInputFocused.value) {
    rateInput.value = Number.isNaN(n) ? '' : n.toFixed(RATE_DECIMALS)
  }
}, { immediate: true })

// while typing, update numeric value but don't reformat the input yet
watch(rateInput, (s) => {
  if (!rateInputFocused.value) return
  if (s.trim() === '') {
    // treat empty as 0 baseline for ticking
    rateNum.value = NaN
    return
  }
  const parsed = parseFloat(s)
  if (Number.isFinite(parsed)) {
    rateNum.value = roundRate(clampRate(parsed))
  }
})

// Limit user entry to max 4 decimals (on every keystroke/paste)
function onRateInput(e) {
  let v = String(e.target.value || '')
  // keep digits and dot only
  v = v.replace(/[^\d.]/g, '')
  // ensure only one dot
  const parts = v.split('.')
  if (parts.length > 1) {
    const intPart = parts.shift() || '0'
    let frac = parts.join('') // drop extra dots
    if (frac.length > RATE_DECIMALS) frac = frac.slice(0, RATE_DECIMALS)
    v = intPart + '.' + frac
  } else {
    v = parts[0]
  }
  // avoid starting with a dot -> "0.x"
  if (v.startsWith('.')) v = '0' + v
  rateInput.value = v
}

function onRateFocus() { rateInputFocused.value = true }
function onRateBlur() {
  rateInputFocused.value = false
  const parsed = parseFloat(rateInput.value)
  if (Number.isFinite(parsed)) {
    const clamped = roundRate(clampRate(parsed))
    rateNum.value = clamped
    rateInput.value = clamped.toFixed(RATE_DECIMALS)
  } else {
    // revert to last known good value (use 0 if NaN)
    const fallback = Number.isNaN(rateNum.value) ? 0 : rateNum.value
    const clamped = roundRate(clampRate(fallback))
    rateNum.value = clamped
    rateInput.value = clamped.toFixed(RATE_DECIMALS)
  }
}

// ===== Button guards =====
const plusDisabled = computed(() => {
  if (orderType.value !== 'limit') return true
  const current = Number.isFinite(rateNum.value) ? rateNum.value : 0
  if (isBorrower.value) return marketIsZeroish.value ? current >= 100 : current >= marketRateNum.value
  return current >= 100
})
const minusDisabled = computed(() => {
  if (orderType.value !== 'limit') return true
  const current = Number.isFinite(rateNum.value) ? rateNum.value : 0
  if (isBorrower.value) return current <= 0
  const floor = marketIsZeroish.value ? 0 : marketRateNum.value
  return current <= floor
})

// ===== Single-tap nudge =====
function increment() { incrementBy(STEP) }
function decrement() { decrementBy(STEP) }

// Variable step setters (used by hold)
function incrementBy(delta) {
  if (orderType.value !== 'limit') return
  const base = Number.isFinite(rateNum.value) ? rateNum.value : 0
  const next = roundRate(base + delta)
  if (isBorrower.value) {
    rateNum.value = marketIsZeroish.value ? Math.min(100, next) : Math.min(marketRateNum.value, next)
  } else {
    rateNum.value = Math.min(100, next)
  }
  if (rateInputFocused.value || rateInput.value.trim() === '') {
    rateInput.value = rateNum.value.toFixed(RATE_DECIMALS)
  }
}
function decrementBy(delta) {
  if (orderType.value !== 'limit') return
  const base = Number.isFinite(rateNum.value) ? rateNum.value : 0
  const next = roundRate(base - delta)
  if (isBorrower.value) {
    rateNum.value = Math.max(0, next)
  } else {
    const floor = marketIsZeroish.value ? 0 : marketRateNum.value
    rateNum.value = Math.max(floor, next)
  }
  if (rateInputFocused.value || rateInput.value.trim() === '') {
    rateInput.value = rateNum.value.toFixed(RATE_DECIMALS)
  }
}

/** ===== Gentler press-and-hold (cleanly torn down) ===== **/
const HOLD_START_DELAY = 500
const HOLD_INTERVAL = 120
let holdTimer = null
let holdInfo = { dir: 0, startedAt: 0 }

function startHold(dir) {
  if (orderType.value !== 'limit') return
  if (dir > 0 && plusDisabled.value) return
  if (dir < 0 && minusDisabled.value) return
  stopHold()
  holdInfo = { dir, startedAt: Date.now() }
  holdTimer = setTimeout(tickHold, HOLD_START_DELAY)
  window.addEventListener('pointerup', stopHold, { once: true })
  window.addEventListener('blur', stopHold, { once: true })
}
function tickHold() {
  const heldMs = Date.now() - holdInfo.startedAt
  const mult = heldMs >= 3500 ? 4 : heldMs >= 1800 ? 2 : 1
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
}
onUnmounted(stopHold)

// ===== Duration and dates =====
const loanDuration = computed(() => `${displayDays(termDays.value)} Days`)
const maturityDate = computed(() => {
  // Keep actual date arithmetic based on provided termDays (BE/parent truth)
  const d = new Date()
  d.setDate(d.getDate() + (Number.isFinite(termDays.value) ? termDays.value : 0))
  return d.toLocaleDateString()
})

// ===== Selected rate for the term (used in both steps) =====
const termRateStr = computed(() =>
  orderType.value === 'market' ? marketRateStr.value : fmt(rateNum.value)
)
const termRateDecimal = computed(() => {
  const m = termRateStr.value?.match(/([\d.]+)%/)
  return m ? parseFloat(m[1]) / 100 : NaN
})

/** ========= Annualized Yield (local calc; ignore API) =========
 * Simple 360-day basis, no compounding:
 * annualized = term_rate_pct * (360 / term_days)
 * For any ~1-year term (360–366), we display the term rate itself.
 */
function annualizedYield(rateStr, days) {
  if (!rateStr || rateStr === '*' || !Number.isFinite(days) || days <= 0) return '*'
  const m = rateStr.match(/([\d.]+)%/)
  if (!m) return '*'
  const r = parseFloat(m[1])
  if (isYearish(days)) return `${r.toFixed(ANNUAL_DECIMALS)}%`
  const annual = r * (360 / days)
  return `${annual.toFixed(ANNUAL_DECIMALS)}%`
}

// ===== Amount & Collateral contribution calculation =====
const amountBtc = ref(0.1) // fixed for now; wire this to a real input if needed

// normalize LTV to ratio 0..1
const ltvRatio = computed(() => {
  let v = Number(ltv.value)
  if (!Number.isFinite(v)) return NaN
  if (v > 1) v = v / 100 // treat as percent if >1
  if (v < 0) v = 0
  if (v > 1) v = 1
  return v
})

// Lender contribution: loan * LTV / (1 + term_rate_decimal)
const lenderContributionBtcNum = computed(() => {
  const L = Number(amountBtc.value)
  const l = ltvRatio.value
  const r = termRateDecimal.value
  if (!Number.isFinite(L) || !Number.isFinite(l) || !Number.isFinite(r)) return NaN
  const denom = 1 + r
  if (denom <= 0) return NaN
  return roundBtc(L * l / denom)
})

// Borrower contribution: loan - lender_contribution + (0.5% * loan)
const borrowerContributionBtcNum = computed(() => {
  const L = Number(amountBtc.value)
  const lenderC = lenderContributionBtcNum.value
  if (!Number.isFinite(L) || !Number.isFinite(lenderC)) return NaN
  const fee = roundBtc(L * FEE_PCT)
  return roundBtc((L - lenderC) + fee)
})

const lenderContributionPct = computed(() => {
  const l = ltvRatio.value
  const r = termRateDecimal.value
  if (!Number.isFinite(l) || !Number.isFinite(r)) return NaN
  return Number(((l / (1 + r)) * 100).toFixed(2))
})
const borrowerContributionPct = computed(() => {
  const lenderP = lenderContributionPct.value
  if (!Number.isFinite(lenderP)) return NaN
  return Number((100 - lenderP + (FEE_PCT * 100)).toFixed(2))
})

const collateralContribution = computed(() => {
  const val = isBorrower.value ? borrowerContributionBtcNum.value : lenderContributionBtcNum.value
  return formatBtc(val)
})

// ===== Submit =====
function submitOrder () {
  const finalRateStr = termRateStr.value
  const m = finalRateStr.match(/([\d.]+)/)
  const rateNumeric = m ? parseFloat(m[1]) : NaN

  const lenderBtc = lenderContributionBtcNum.value
  const borrowerBtc = borrowerContributionBtcNum.value
  const lenderPct = lenderContributionPct.value
  const borrowerPct = borrowerContributionPct.value

  emit('submit', {
    action: actionType.value,
    orderType: orderType.value,
    rate: finalRateStr,                          // e.g., "2.5000%"
    rateNumeric,                                 // numeric percent (no % sign)
    duration: loanDuration.value,                // displays 365 for any ~1-year term
    durationDays: displayDays(termDays.value),   // pass 365 to parent for consistency; parent can map to 360 for BE
    maturityDate: maturityDate.value,
    annualizedYield: annualizedYield(finalRateStr, termDays.value),
    amount: formatBtc(amountBtc.value),
    ltvUsed: ltvRatio.value,
    feePct: '0.50%',
    collateralContribution: collateralContribution.value,      // formatted string for current role
    collateralContributionBtcNum: isBorrower.value ? borrowerBtc : lenderBtc,
    collateralContributionPct: Number.isFinite(isBorrower.value ? borrowerPct : lenderPct)
      ? `${(isBorrower.value ? borrowerPct : lenderPct).toFixed(2)}%`
      : null,
    lenderContributionBtcNum: lenderBtc,
    borrowerContributionBtcNum: borrowerBtc,
  })
}
</script>
