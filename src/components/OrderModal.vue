<!-- OrderModal.vue -->
<template>
  <div
    class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    @click.self="closeSelf"
  >
    <div
      class="bg-dark text-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-6 relative overflow-y-auto max-h-[90vh]"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="descId"
      :aria-busy="loading || allocationLoading ? 'true' : 'false'"
      ref="dialogRef"
      @keydown.tab.prevent="onTab"
      @keydown.esc.prevent="closeSelf"
    >
      <!-- Close Button -->
      <button
        type="button"
        @click="closeSelf"
        :disabled="loading || allocationLoading"
        class="absolute top-4 right-4 text-white hover:text-secondary text-xl font-bold disabled:opacity-50 z-10"
        aria-label="Close dialog"
      >
        ×
      </button>

      <!-- Step 1: Order Entry -->
      <div v-if="step === 1">
        <h2 :id="titleId" class="text-2xl font-bold text-center mb-4">
          Leave an order to {{ actionType }} Bitcoin
        </h2>

        <div
          v-if="notice?.text"
          :class="notice?.type === 'error' ? 'bg-red-500/15 border-red-500/40' : 'bg-green-500/15 border-green-500/40'"
          class="border rounded p-3 text-sm mb-3"
          role="status"
          aria-live="polite"
        >
          {{ notice.text }}
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
          <label class="block mb-1 font-semibold">Order Type</label>
          <div class="flex space-x-2">
            <button
              type="button"
              @click="orderType = 'market'"
              :class="orderType === 'market' ? 'bg-secondary text-white' : 'bg-white/10 text-white/70'"
              class="flex-1 px-4 py-2 rounded font-medium transition-colors"
            >
              Market Order
            </button>
            <button
              type="button"
              @click="orderType = 'limit'"
              :class="orderType === 'limit' ? 'bg-secondary text-white' : 'bg-white/10 text-white/70'"
              class="flex-1 px-4 py-2 rounded font-medium transition-colors"
            >
              Limit Order
            </button>
          </div>
          <p class="text-xs text-white/70 mt-1">
            Market executes at current rate. Limit lets you adjust relative to market.
          </p>
        </div>

        <!-- Rate Control -->
        <div class="mt-4">
          <label class="block mb-1 font-semibold">Rate for term</label>

          <div v-if="orderType === 'market'" class="w-full px-4 py-2 rounded bg-white/10 border border-white/20">
            {{ marketRateStr || '*' }}
          </div>

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

            <div class="mt-3 text-center">
              <div class="text-xs text-white/70">Annualized yield</div>
              <div class="mt-1 font-semibold tabular-nums">
                {{ annualizedYield(termRateStr, termDays) }}
              </div>
            </div>
          </div>

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

      <!-- Step 2: Review + Confirm -->
      <div v-else-if="step === 2">
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
          <li><span class="font-semibold text-white">Role:</span> {{ actionType }}</li>
          <li><span class="font-semibold text-white">Amount:</span> {{ formatAmountDisplay(amountBtc, amountUsd) }}</li>
          <li><span class="font-semibold text-white">Loan Duration:</span> {{ loanDuration }}</li>
          <li><span class="font-semibold text-white">Interest Rate for Term:</span> {{ reviewTermRateStr }}</li>
          <li><span class="font-semibold text-white">Cadena Fee:</span> {{ displayFee }}</li>
          <li><span class="font-semibold text-white">Annualized Yield:</span> {{ reviewAnnualizedYieldWithFee }}</li>
        </ul>

        <!-- Collateral Requirement Block -->
        <div class="mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/30">
          <p class="text-base font-semibold text-white">{{ collateralRequirementText }}</p>
        </div>

        <!-- Edit Rate Warning + Checkbox Flow -->
        <div v-if="showEditRateWarning" class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
          <p class="text-sm text-white/90 mb-3">
            Changing the interest rate will convert your order to a limit order instead of matching at the current market rate.
            Limit orders are filled on a best-efforts basis and are not guaranteed to execute.
          </p>
          <label class="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="editRateAcknowledged"
              class="mt-0.5 accent-secondary"
            />
            <span class="text-sm text-white/80">I understand this will become a limit order</span>
          </label>
        </div>

        <!-- Inline Rate Editor (shown after acknowledging warning) -->
        <div v-if="showEditRateWarning && editRateAcknowledged" class="bg-white/5 border border-white/10 rounded-lg p-4 mt-4">
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
          <div class="text-center mt-3">
            <button
              type="button"
              @click="finishEditRate"
              class="text-sm text-secondary hover:text-secondary/80 font-semibold"
            >Done</button>
          </div>
        </div>

        <!-- Allocation Results (shown after Confirm returns response) -->
        <div v-if="allocationResult" class="mt-4 bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 class="font-semibold text-sm text-white mb-3">Liquidity Allocation</h3>
          <table class="w-full text-xs text-white/80">
            <thead>
              <tr class="border-b border-white/10">
                <th class="text-left py-1 font-semibold">Qty</th>
                <th class="text-right py-1 font-semibold">Notional</th>
                <th class="text-right py-1 font-semibold">Collateral</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tier, idx) in allocationResult.allocation" :key="idx" class="border-b border-white/5">
                <td class="py-1.5">{{ tier.quantity }}×</td>
                <td class="text-right py-1.5 tabular-nums">{{ formatSatsToBtc(tier.notional) }} BTC</td>
                <td class="text-right py-1.5 tabular-nums">{{ formatSatsToBtc(tier.allocated_collateral) }} BTC</td>
              </tr>
            </tbody>
          </table>
          <div class="mt-2 pt-2 border-t border-white/10 text-xs space-y-1">
            <div class="flex justify-between">
              <span class="text-white/60">Total Allocated Collateral</span>
              <span class="font-semibold tabular-nums">{{ formatSatsToBtc(allocationResult.total_allocated_collateral) }} BTC</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/60">Unallocated Collateral</span>
              <span class="tabular-nums">{{ formatSatsToBtc(allocationResult.unallocated_collateral) }} BTC</span>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mt-6">
          <button
            type="button"
            @click="handleEditRateClick"
            :disabled="loading || allocationLoading"
            class="text-white hover:text-secondary text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ skipToReview && !showEditRateWarning ? 'Edit Rate' : (showEditRateWarning ? 'Cancel Edit' : 'Back') }}
          </button>

          <!-- Confirm button (before allocation) -->
          <button
            v-if="!allocationResult"
            type="button"
            @click="handleConfirm"
            :disabled="loading || allocationLoading"
            class="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!allocationLoading">Confirm</span>
            <span v-else class="inline-flex items-center gap-2">
              <span class="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
              Confirming…
            </span>
          </button>

          <!-- Continue button (after allocation) -->
          <button
            v-else
            type="button"
            @click="goToStep3"
            class="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded font-semibold"
          >
            Continue
          </button>
        </div>
      </div>

      <!-- Step 3: Collateral Check + Final Submit -->
      <div v-else-if="step === 3">
        <h2 :id="titleId" class="text-2xl font-bold text-center mb-4">Submit Your Order</h2>

        <div
          v-if="notice?.text"
          :class="notice?.type === 'error' ? 'bg-red-500/15 border-red-500/40' : 'bg-green-500/15 border-green-500/40'"
          class="border rounded p-3 text-sm mb-3"
          role="status"
          aria-live="polite"
        >
          {{ notice.text }}
        </div>

        <!-- Balance Check Loading -->
        <div v-if="balanceLoading" class="flex flex-col items-center gap-3 py-8">
          <div class="h-8 w-8 rounded-full border-4 border-white/30 border-t-white animate-spin"></div>
          <div class="text-sm text-white/80">Checking wallet balance…</div>
        </div>

        <!-- Wallet Not Connected -->
        <div v-else-if="balanceCheckResult && !balanceCheckResult.connected" class="space-y-4">
          <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
            <p class="text-sm text-white/90 font-semibold mb-2">Wallet Not Connected</p>
            <p class="text-xs text-white/70">Connect your Bitcoin wallet to verify your collateral balance.</p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p class="text-sm text-white/60 italic">How to connect your wallet (video coming soon)</p>
          </div>
        </div>

        <!-- Insufficient Collateral -->
        <div v-else-if="balanceCheckResult && !balanceCheckResult.sufficient" class="space-y-4">
          <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p class="text-sm text-white/90 font-semibold mb-2">Insufficient Collateral</p>
            <p class="text-xs text-white/70">
              Your wallet balance is {{ formatSatsToBtc(balanceCheckResult.satoshis) }} BTC,
              but this order requires more collateral.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p class="text-sm text-white/60 italic">How to top up your wallet (video coming soon)</p>
          </div>
        </div>

        <!-- Sufficient Balance — Show summary + Submit -->
        <div v-else-if="balanceCheckResult && balanceCheckResult.sufficient" class="space-y-4">
          <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p class="text-sm text-green-400 font-semibold">Wallet balance verified</p>
            <p class="text-xs text-white/70 mt-1">Balance: {{ formatSatsToBtc(balanceCheckResult.satoshis) }} BTC</p>
          </div>

          <!-- Order Summary -->
          <ul class="space-y-2 text-sm text-white/90">
            <li><span class="font-semibold text-white">Role:</span> {{ actionType }}</li>
            <li><span class="font-semibold text-white">Amount:</span> {{ formatAmountDisplay(amountBtc, amountUsd) }}</li>
            <li><span class="font-semibold text-white">Loan Duration:</span> {{ loanDuration }}</li>
            <li><span class="font-semibold text-white">Interest Rate for Term:</span> {{ reviewTermRateStr }}</li>
            <li><span class="font-semibold text-white">Cadena Fee:</span> {{ displayFee }}</li>
            <li><span class="font-semibold text-white">Annualized Yield:</span> {{ reviewAnnualizedYieldWithFee }}</li>
          </ul>

          <!-- Allocation summary -->
          <div v-if="allocationResult" class="bg-white/5 border border-white/10 rounded-lg p-3">
            <div class="text-xs space-y-1">
              <div class="flex justify-between">
                <span class="text-white/60">Total Allocated Collateral</span>
                <span class="font-semibold tabular-nums">{{ formatSatsToBtc(allocationResult.total_allocated_collateral) }} BTC</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">Unallocated Collateral</span>
                <span class="tabular-nums">{{ formatSatsToBtc(allocationResult.unallocated_collateral) }} BTC</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Rate Warning + Checkbox Flow (Step 3) -->
        <div v-if="showEditRateWarning" class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
          <p class="text-sm text-white/90 mb-3">
            Changing the interest rate will convert your order to a limit order instead of matching at the current market rate.
            Limit orders are filled on a best-efforts basis and are not guaranteed to execute.
          </p>
          <label class="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="editRateAcknowledged"
              class="mt-0.5 accent-secondary"
            />
            <span class="text-sm text-white/80">I understand this will become a limit order</span>
          </label>
        </div>

        <!-- Inline Rate Editor (Step 3) -->
        <div v-if="showEditRateWarning && editRateAcknowledged" class="bg-white/5 border border-white/10 rounded-lg p-4 mt-4">
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
          <div class="text-center mt-3">
            <button
              type="button"
              @click="finishEditRate"
              class="text-sm text-secondary hover:text-secondary/80 font-semibold"
            >Done</button>
          </div>
        </div>

        <div class="flex justify-between items-center mt-6">
          <button
            type="button"
            @click="handleStep3EditOrBack"
            :disabled="loading"
            class="text-white hover:text-secondary text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ showEditRateWarning ? 'Cancel Edit' : 'Edit Rate' }}
          </button>
          <button
            v-if="balanceCheckResult?.sufficient && !isSuccess"
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

      <!-- Loading overlay -->
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
  ltv: { type: Number, default: 0.5 },
  contractSize: { type: String, default: '0.10' },
  skipToReview: { type: Boolean, default: false },
  btcPrice: { type: Number, default: null },
  requestedUsd: { type: Number, default: null },
  allocationResult: { type: Object, default: null },
  allocationLoading: { type: Boolean, default: false },
  balanceCheckResult: { type: Object, default: null },
  balanceLoading: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'submit', 'confirm', 'checkBalance'])

const { loading, notice, termDays, actionType, rate, ltv, contractSize,
        allocationResult, allocationLoading, balanceCheckResult, balanceLoading, skipToReview } = toRefs(props)

const orderType = ref(props.skipToReview ? 'limit' : 'market')
const step = ref(props.skipToReview ? 2 : 1)
const showEditRateWarning = ref(false)
const editRateAcknowledged = ref(false)
const rateWasEdited = ref(false)
const isBorrower = computed(() => (actionType.value || '').toLowerCase() === 'borrow')
const isSuccess = computed(() => notice.value?.type === 'success')

const RATE_DECIMALS = 4
const ANNUAL_DECIMALS = 2
const STEP = 0.1
const FEE_PCT = 0.01

const titleId = `order-modal-title-${Math.random().toString(36).slice(2)}`
const descId  = `order-modal-desc-${Math.random().toString(36).slice(2)}`
const rateHelpId = `order-modal-ratehelp-${Math.random().toString(36).slice(2)}`
const dialogRef = ref(null)

let lastFocus = null
const focusSel =
  'button, [href], select, textarea, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])'

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
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus()
})

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

function isYearish(days) {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
function displayDays(days) {
  return isYearish(days) ? 365 : Math.round(Number(days) || 0)
}

function toNum(rateStr) {
  const m = rateStr?.match(/([\d.]+)/)
  return m ? parseFloat(m[1]) : NaN
}
function roundRate(n) { return Number.isNaN(n) ? NaN : parseFloat(n.toFixed(RATE_DECIMALS)) }
function fmt(n) { return Number.isNaN(n) ? '*' : `${n.toFixed(RATE_DECIMALS)}%` }
function fmtReview(n) { return Number.isNaN(n) ? '*' : `${n.toFixed(2)}%` }
function formatBtc(n) {
  const x = Number(n)
  return Number.isFinite(x) ? `${x.toFixed(8)} BTC` : '*'
}
function roundBtc(n) {
  const x = Number(n)
  return Number.isFinite(x) ? Number(x.toFixed(8)) : NaN
}
function formatSatsToBtc(sats) {
  if (!Number.isFinite(sats)) return '0'
  return (sats / 1e8).toFixed(8)
}

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
watch(marketIsZeroish, (zr) => { if (zr) orderType.value = 'limit' }, { immediate: true })

const rateNum = ref(props.skipToReview ? toNum(props.rate) || marketRateNum.value : marketRateNum.value)
const rateInput = ref('')
const rateInputFocused = ref(false)

watch(orderType, () => { rateNum.value = marketRateNum.value })
watch(marketRateNum, (n) => { rateNum.value = n })
watch(rateNum, (n) => {
  if (!rateInputFocused.value) {
    rateInput.value = Number.isNaN(n) ? '' : n.toFixed(RATE_DECIMALS)
  }
}, { immediate: true })
watch(rateInput, (s) => {
  if (!rateInputFocused.value) return
  if (s.trim() === '') {
    rateNum.value = NaN
    return
  }
  const parsed = parseFloat(s)
  if (Number.isFinite(parsed)) {
    rateNum.value = roundRate(clampRate(parsed))
  }
})

function onRateInput(e) {
  let v = String(e.target.value || '')
  v = v.replace(/[^\d.]/g, '')
  const parts = v.split('.')
  if (parts.length > 1) {
    const intPart = parts.shift() || '0'
    let frac = parts.join('')
    if (frac.length > RATE_DECIMALS) frac = frac.slice(0, RATE_DECIMALS)
    v = intPart + '.' + frac
  } else {
    v = parts[0]
  }
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
    const fallback = Number.isNaN(rateNum.value) ? 0 : rateNum.value
    const clamped = roundRate(clampRate(fallback))
    rateNum.value = clamped
    rateInput.value = clamped.toFixed(RATE_DECIMALS)
  }
}

function clampRate(val) {
  let min = 0
  let max = 100
  if (!marketIsZeroish.value) {
    if (isBorrower.value) {
      max = marketRateNum.value
    } else {
      min = marketRateNum.value
    }
  }
  if (!Number.isFinite(val)) return Number.isNaN(val) ? NaN : val
  return Math.min(Math.max(val, min), max)
}

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
function increment() { incrementBy(STEP) }
function decrement() { decrementBy(STEP) }
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

const loanDuration = computed(() => `${displayDays(termDays.value)} Days`)

const termRateStr = computed(() =>
  orderType.value === 'market' ? marketRateStr.value : fmt(rateNum.value)
)
const termRateDecimal = computed(() => {
  const m = termRateStr.value?.match(/([\d.]+)%/)
  return m ? parseFloat(m[1]) / 100 : NaN
})
function annualizedYield(rateStr, days) {
  if (!rateStr || rateStr === '*' || !Number.isFinite(days) || days <= 0) return '*'
  const m = rateStr.match(/([\d.]+)%/)
  if (!m) return '*'
  const r = parseFloat(m[1])
  if (isYearish(days)) return `${r.toFixed(ANNUAL_DECIMALS)}%`
  const annual = r * (360 / days)
  return `${annual.toFixed(ANNUAL_DECIMALS)}%`
}

const reviewTermRateStr = computed(() =>
  orderType.value === 'market' ? fmtReview(marketRateNum.value) : fmtReview(rateNum.value)
)

/* ==== Fee & Yield logic (role-aware) ==== */
const displayFee = computed(() => isBorrower.value ? '1.00%' : '0.00%')

const reviewAnnualizedYieldWithFee = computed(() => {
  const r = orderType.value === 'market' ? marketRateNum.value : rateNum.value
  if (Number.isNaN(r) || !Number.isFinite(termDays.value) || termDays.value <= 0) return '*'
  const base = isYearish(termDays.value) ? r : r * (360 / termDays.value)
  const withFee = isBorrower.value ? base + 1 : base
  return `${withFee.toFixed(2)}%`
})

/* ==== amount from contract size ==== */
const amountBtc = computed(() => {
  const n = Number(contractSize.value)
  if (Number.isFinite(n) && n > 0) return n
  return 0.1
})

const amountUsd = computed(() => {
  if (props.btcPrice && Number.isFinite(props.btcPrice)) {
    return Number(amountBtc.value) * props.btcPrice
  }
  return null
})

function formatAmountDisplay(btc, usd) {
  const btcStr = formatBtc(btc)
  if (props.requestedUsd != null && Number.isFinite(props.requestedUsd)) {
    const usdStr = props.requestedUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    return usdStr
  }
  if (usd != null && Number.isFinite(usd)) {
    const usdStr = usd.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    return usdStr
  }
  return btcStr
}

const ltvRatio = computed(() => {
  let v = Number(ltv.value)
  if (!Number.isFinite(v)) return NaN
  if (v > 1) v = v / 100
  if (v < 0) v = 0
  if (v > 1) v = 1
  return v
})

const lenderContributionBtcNum = computed(() => {
  const L = Number(amountBtc.value)
  const l = ltvRatio.value
  const r = termRateDecimal.value
  if (!Number.isFinite(L) || !Number.isFinite(l) || !Number.isFinite(r)) return NaN
  const denom = 1 + r
  if (denom <= 0) return NaN
  return roundBtc(L * l / denom)
})
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

/* ==== Collateral Requirement Text ==== */
const collateralRequirementText = computed(() => {
  const val = isBorrower.value ? borrowerContributionBtcNum.value : lenderContributionBtcNum.value
  if (!Number.isFinite(val)) return 'Collateral requirement unavailable.'
  return `To complete the loan, you are required to contribute ${val.toFixed(5)} Bitcoin collateral.`
})

/* ==== Edit Rate Flow ==== */
function handleEditRateClick() {
  if (showEditRateWarning.value) {
    // Cancel edit
    showEditRateWarning.value = false
    editRateAcknowledged.value = false
  } else if (skipToReview.value || step.value === 2) {
    showEditRateWarning.value = true
    editRateAcknowledged.value = false
  } else {
    step.value = 1
  }
}

function handleStep3EditOrBack() {
  if (showEditRateWarning.value) {
    showEditRateWarning.value = false
    editRateAcknowledged.value = false
  } else {
    showEditRateWarning.value = true
    editRateAcknowledged.value = false
  }
}

function finishEditRate() {
  showEditRateWarning.value = false
  editRateAcknowledged.value = false
  rateWasEdited.value = true
  // If rate was edited after allocation, clear allocation so user must re-Confirm
  if (allocationResult.value) {
    emit('confirm', buildConfirmPayload())
  }
}

/* ==== Confirm Handler ==== */
function buildConfirmPayload() {
  const finalRateStr = termRateStr.value
  const m = finalRateStr.match(/([\d.]+)/)
  const rateNumeric = m ? parseFloat(m[1]) : NaN

  return {
    action: actionType.value,
    rate: finalRateStr,
    rateNumeric,
    durationDays: displayDays(termDays.value),
    amountUsd: props.requestedUsd,
    ltvUsed: ltvRatio.value,
    rateWasEdited: rateWasEdited.value,
  }
}

function handleConfirm() {
  emit('confirm', buildConfirmPayload())
}

/* ==== Step 3 transition ==== */
function goToStep3() {
  step.value = 3
  emit('checkBalance')
}

/* ==== Final Submit ==== */
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
    rate: finalRateStr,
    rateNumeric,
    duration: loanDuration.value,
    durationDays: displayDays(termDays.value),
    annualizedYield: annualizedYield(finalRateStr, termDays.value),
    amount: formatBtc(amountBtc.value),
    amountNumeric: Number(amountBtc.value),
    ltvUsed: ltvRatio.value,
    feePct: displayFee.value,
    collateralContribution: collateralContribution.value,
    collateralContributionBtcNum: isBorrower.value ? borrowerBtc : lenderBtc,
    collateralContributionPct: Number.isFinite(isBorrower.value ? borrowerPct : lenderPct)
      ? `${(isBorrower.value ? borrowerPct : lenderPct).toFixed(2)}%`
      : null,
    lenderContributionBtcNum: lenderBtc,
    borrowerContributionBtcNum: borrowerBtc,
    rateWasEdited: rateWasEdited.value,
  })
}
</script>
