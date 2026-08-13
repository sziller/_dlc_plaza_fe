<!-- MarketOverview.vue -->
<template>
  <section class="w-full h-full" :class="{ compact }">
    <div class="w-full h-full mx-auto">
      <div
        class="rounded-xl border border-white/10 shadow-lg bg-dark p-6 h-full min-h-0 flex flex-col"
        :style="{ '--secondary': currentAccent }"
      >
        <!-- Header: title only -->
        <div class="mb-6 shrink-0">
          <div class="text-3xl lg:text-4xl font-extrabold text-center title-text">
            {{ title }}
          </div>
        </div>

        <!-- Content Wrapper -->
        <div
          v-if="isServerDown"
          class="flex flex-col items-center justify-center text-center gap-4 rounded-lg border border-white/15 bg-white/5 p-6 sm:p-8 flex-1"
        >
          <div class="text-2xl font-semibold">Cadena is undergoing maintenance</div>
          <p class="text-white/80 text-base max-w-2xl">
            {{ serverStatusMessage || 'There are no live rates right now and logins are temporarily disabled. Please try again shortly.' }}
          </p>
        </div>
        <div v-else class="overflow-y-auto overflow-x-hidden flex-1 min-h-0">
          <!-- 4-step loan configurator -->
          <div class="flex flex-col gap-0 py-6 sm:py-8 w-full max-w-md mx-auto">

            <!-- ── Step 1: Currency ── always visible -->
            <div class="px-1 pb-6">
              <div class="flex items-center gap-2.5 mb-4">
                <div class="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[11px] font-black text-white shrink-0 shadow shadow-secondary/40">1</div>
                <span class="text-[11px] font-bold uppercase tracking-widest text-white/50">Choose Currency</span>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="cur in ['USD', 'EUR']"
                  :key="cur"
                  type="button"
                  @click="handleCurrencySelect(cur)"
                  class="relative flex flex-col items-start gap-1.5 p-4 rounded-xl border transition-all duration-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
                  :class="selectedCurrency === cur && currencyChosen
                    ? 'border-secondary bg-secondary/10 shadow-lg shadow-secondary/20'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.07]'"
                >
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-2">
                      <img :src="`https://flagcdn.com/${cur === 'USD' ? 'us' : 'eu'}.svg`" :alt="cur === 'USD' ? 'US Flag' : 'EU Flag'" class="w-6 h-4 rounded-[3px] object-cover shadow-sm" />
                      <span class="text-xl font-black" :class="selectedCurrency === cur && currencyChosen ? 'text-white' : 'text-white/55'">{{ cur }}</span>
                    </div>
                    <div v-if="selectedCurrency === cur && currencyChosen" class="w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                  </div>
                  <span class="text-xs text-white/45">{{ cur === 'USD' ? 'US Dollar' : 'Euro' }}</span>
                  <span class="text-[10px]" :class="selectedCurrency === cur && currencyChosen ? 'text-secondary/70' : 'text-white/25'">
                    {{ cur === 'USD' ? '90 / 180 / 365 days' : '1 year only' }}
                  </span>
                </button>
              </div>
            </div>

            <div class="w-full h-px bg-white/[0.07] mb-6"></div>

            <!-- ── Step 2: Amount ── -->
            <div class="px-1 pb-6">
              <div class="flex items-center gap-2.5 mb-4">
                <div class="w-6 h-6 rounded-full border border-secondary/50 bg-secondary/15 flex items-center justify-center text-[11px] font-black text-secondary shrink-0">2</div>
                <span class="text-[11px] font-bold uppercase tracking-widest text-white/50">Choose Amount</span>
              </div>
              <div class="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
                <div class="flex items-center justify-center gap-1 mb-1">
                  <span class="text-4xl sm:text-5xl font-bold text-white/40">{{ currencySymbol }}</span>
                  <input
                    type="text"
                    inputmode="numeric"
                    :value="usdInputRaw"
                    @input="onUsdInput"
                    @focus="onUsdFocus"
                    @blur="onUsdBlur"
                    class="text-4xl sm:text-5xl font-bold bg-transparent border-none outline-none text-white text-center w-full max-w-[260px] tabular-nums"
                    aria-label="Amount"
                  />
                </div>
                <div class="text-center text-white/40 text-sm mb-5 tabular-nums min-h-[1.25rem]">
                  <span v-if="selectedCurrency === 'USD'">≈ {{ btcEquivalentDisplay }}</span>
                </div>
                <input
                  type="range"
                  :min="AMOUNT_MIN"
                  :max="AMOUNT_MAX"
                  :step="AMOUNT_STEP"
                  :value="usdAmount"
                  @input="onSliderInput"
                  class="amount-slider w-full"
                  :style="{ '--fill': sliderFillPct + '%' }"
                  aria-label="Amount slider"
                />
                <div class="flex justify-between text-xs text-white/35 mt-1.5 tabular-nums">
                  <span>{{ currencySymbol }}1,000</span>
                  <span>{{ currencySymbol }}1,000,000</span>
                </div>
              </div>
            </div>

            <div class="w-full h-px bg-white/[0.07] mb-6"></div>

            <!-- ── Step 3: Term (duration only, no rates) ── -->
            <div class="px-1 pb-2">
              <div class="flex items-center gap-2.5 mb-4">
                <div class="w-6 h-6 rounded-full border border-secondary/50 bg-secondary/15 flex items-center justify-center text-[11px] font-black text-secondary shrink-0">3</div>
                <span class="text-[11px] font-bold uppercase tracking-widest text-white/50">Choose Term</span>
              </div>
              <div
                class="grid gap-3"
                :class="activeTargetTerms.length === 1 ? 'grid-cols-1 max-w-[200px] mx-auto' : 'grid-cols-3'"
              >
                <button
                  v-for="termDays in activeTargetTerms"
                  :key="termDays"
                  type="button"
                  @click="handleTermSelect(termDays)"
                  class="relative flex flex-col items-center py-5 px-2 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
                  :class="activeTermDays === termDays && termChosen
                    ? 'border-secondary bg-secondary/10 shadow-lg shadow-secondary/20'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.07]'"
                >
                  <span
                    class="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2 transition-colors"
                    :class="activeTermDays === termDays && termChosen ? 'text-secondary' : 'text-white/30'"
                  >{{ termShortLabel(termDays) }}</span>
                  <span
                    class="text-3xl sm:text-4xl font-black tabular-nums leading-none"
                    :class="activeTermDays === termDays && termChosen ? 'text-white' : 'text-white/55'"
                  >{{ termDays }}</span>
                  <span class="text-[9px] text-white/30 mt-1">days</span>
                  <div v-if="activeTermDays === termDays && termChosen" class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-secondary"></div>
                </button>
              </div>
              <p class="text-white/25 text-[9px] text-center mt-3">50% LTV &middot; {{ selectedCurrency }}/BTC</p>
            </div>

            <!-- ── Step 4: Rate & Action ── revealed after term click -->
            <Transition name="step-reveal">
              <div v-if="termChosen" class="flex flex-col gap-0">
                <div class="w-full h-px bg-white/[0.07] mt-6 mb-6"></div>

                <div class="px-1">
                  <div class="flex items-center gap-2.5 mb-4">
                    <div class="w-6 h-6 rounded-full border border-secondary/50 bg-secondary/15 flex items-center justify-center text-[11px] font-black text-secondary shrink-0">4</div>
                    <span class="text-[11px] font-bold uppercase tracking-widest text-white/50">Rate &amp; Action</span>
                  </div>

                  <!-- Recap summary row -->
                  <div class="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.08]">
                    <div>
                      <div class="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Currency</div>
                      <div class="flex items-center gap-1.5 text-sm font-semibold text-white">
                        <img :src="`https://flagcdn.com/${selectedCurrency === 'USD' ? 'us' : 'eu'}.svg`" :alt="selectedCurrency === 'USD' ? 'US Flag' : 'EU Flag'" class="w-5 h-3.5 rounded-[2px] object-cover shadow-sm" />
                        {{ selectedCurrency }}
                      </div>
                    </div>
                    <div class="w-px h-8 bg-white/10 shrink-0"></div>
                    <div>
                      <div class="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Term</div>
                      <div class="text-sm font-semibold text-white">{{ termShortLabel(activeTermDays) }}</div>
                    </div>
                    <div class="w-px h-8 bg-white/10 shrink-0"></div>
                    <div>
                      <div class="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Amount</div>
                      <div class="text-sm font-semibold text-white">{{ currencySymbol }}{{ usdAmount.toLocaleString('en-US') }}</div>
                    </div>
                    <div class="w-px h-8 bg-white/10 shrink-0"></div>
                    <div>
                      <div class="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">LTV</div>
                      <div class="text-sm font-semibold text-white">50%</div>
                    </div>
                  </div>

                  <!-- Live rates -->
                  <template v-if="hasRates(activeTermDays)">
                    <div class="space-y-3">
                      <div class="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/[0.06] border border-secondary/20">
                        <div class="min-w-0">
                          <div class="text-[10px] font-bold uppercase tracking-wider text-secondary/70 mb-0.5">Lend APR</div>
                          <div class="text-2xl font-black text-white tabular-nums">{{ getTermRate(activeTermDays, 'lend') }}</div>
                          <div class="text-[10px] text-white/35 mt-0.5">Earn fixed returns in {{ selectedCurrency }}</div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                          <button type="button" @click="handleSimpleLendLimit" class="border border-white/15 hover:border-white/30 text-white/50 hover:text-white px-3 py-2.5 rounded-lg text-xs font-medium transition-all hover:bg-white/[0.05]">Change rate</button>
                          <button type="button" @click="handleSimpleLend" class="bg-secondary/20 hover:bg-secondary/30 border border-secondary/35 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">Lend →</button>
                        </div>
                      </div>
                      <div class="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/[0.06] border border-secondary/20">
                        <div class="min-w-0">
                          <div class="text-[10px] font-bold uppercase tracking-wider text-secondary/70 mb-0.5">Borrow APR</div>
                          <div class="text-2xl font-black text-white tabular-nums">{{ getTermRate(activeTermDays, 'borrow') }}</div>
                          <div class="text-[10px] text-white/35 mt-0.5">Keep BTC exposure, access {{ selectedCurrency }}</div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                          <button type="button" @click="handleSimpleBorrowLimit" class="border border-white/15 hover:border-white/30 text-white/50 hover:text-white px-3 py-2.5 rounded-lg text-xs font-medium transition-all hover:bg-white/[0.05]">Change rate</button>
                          <button type="button" @click="handleSimpleBorrow" class="bg-secondary/20 hover:bg-secondary/30 border border-secondary/35 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">Borrow →</button>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- No live rates — limit order -->
                  <template v-else>
                    <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center mb-4">
                      <div class="text-sm text-white/50 mb-1">No current offers for {{ activeTermDays }}-day {{ selectedCurrency }} loans</div>
                      <div class="text-xs text-secondary/60">You'll set your own rate — limit order</div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                      <button type="button" @click="handleSimpleLendLimit" class="flex-1 bg-secondary hover:bg-secondary/90 text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-secondary/25">Lend — Set My Rate</button>
                      <button type="button" @click="handleSimpleBorrowLimit" class="flex-1 border-2 border-secondary/80 text-white hover:bg-secondary/10 hover:border-secondary px-5 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">Borrow — Set My Rate</button>
                    </div>
                  </template>
                </div>
              </div>
            </Transition>

          </div>

          <!-- Rate Select Modal -->
          <RateSelectModal
            v-if="showRateModal"
            :action-type="rateModalAction"
            :term-days="activeTermDays"
            :market-rate="rateModalMarketRate"
            @confirm="handleRateModalConfirm"
            @close="showRateModal = false"
          />

          <!-- Order Modal -->
          <OrderModal
            v-if="showModal"
            :rate="selectedRate"
            :action-type="selectedAction"
            :term-days="selectedTermDays"
            :loading="modalLoading"
            :notice="modalNotice"
            :ltv="selectedLtv"
            :contract-size="selectedContract"
            :skip-to-review="true"
            :btc-price="btcPriceUsd"
            :requested-usd="usdAmount"
            :oracle-id="selectedOracle"
            :oracle-label="selectedOracleLabel"
            :fiat-currency="selectedFiat"
            :allocation-result="allocationResult"
            :allocation-loading="allocationLoading"
            :balance-check-result="balanceCheckResult"
            :balance-loading="balanceLoading"
            :topup-address="topupAddress"
            :topup-qr-svg="topupQrSvg"
            :topup-loading="topupLoading"
            :topup-error="topupError"
            :user-auth-code="userAuthCode"
            :show-funding-screen="showFundingScreen"
            :show-auth-prompt="showAuthPrompt"
            @close="handleModalClose"
            @submit="handleOrderSubmit"
            @review="handleReviewOrder"
            @confirm="handleOrderConfirm"
            @check-balance="handleBalanceCheck"
            @recheck-balance="handleRecheckBalance"
            @retry-order="handleRecheckAndRetry"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import OrderModal from './OrderModal.vue'
import RateSelectModal from './RateSelectModal.vue'
import { getToken } from '../api/token'
import { postProductQueryV0 } from '../api/productQuery' // uses ApiEnvelope<{...}[]>
import { formatBtcValue } from '../functions/amount_formatting'
import { useServerStatus } from '../composables/useServerStatus'
import { getPrice } from '../api/price'
import { postLiquidityAllocation, postLiquidityAllocationV1, getLiquidityMarket } from '../api/liquidityAllocation'
import { getOwnDerivedBalance } from '../api/userDerivedBalance'
import { getTopupAddressQR } from '../api/qr'
import { useAuth } from '../composables/useAuth'
import { useOracle } from '../composables/useOracle'
import { usePriceSymbol } from '../composables/usePriceSymbol'
import { generateIdempotencyKey } from '../lib/idempotencyKey'
import { notifySlackCollateralShortfall } from '../api/slackNotify'

const router = useRouter()

// -------- Collateral helper (matches OrderModal formula) ----------
const FEE_PCT = 0.01

function computeRequiredCollateralSats(loanSats, rateDecimal, ltv, isBorrow) {
  if (!Number.isFinite(loanSats) || loanSats <= 0) return 0
  const r = Number.isFinite(rateDecimal) ? rateDecimal : 0
  const l = Number.isFinite(ltv) && ltv > 0 ? ltv : 0.5
  if (isBorrow) {
    return Math.round(loanSats * (1 + 2 * r + FEE_PCT * (1 + r) / l))
  }
  return loanSats
}

// -------- Env: staging vs prod ----------
const IS_STAGING = (() => {
  const host = (typeof location !== 'undefined' ? location.hostname : '').toLowerCase()
  const IS_PROD = /^(?:www\.)?cadenabitcoin\.com$/.test(host) && host !== 'staging.cadenabitcoin.com'
  return !IS_PROD
})()

// -------- USD Amount Input + Slider ----------
const AMOUNT_MIN = 1000
const AMOUNT_MAX = 1000000
const AMOUNT_STEP = 1000
const AMOUNT_DEFAULT = 5000

const usdAmount = ref(AMOUNT_DEFAULT)
const usdInputRaw = ref('5,000')
const usdInputFocused = ref(false)

// -------- Props ----------
const props = defineProps({
  title: { type: String, default: 'Bitcoin Native Loans' },
  leftGroupLabel: { type: String, default: '50% LTV' },
  leftKeys: { type: Array, default: () => ['ltv50a', 'ltv50b'] },
  offersPollMs: { type: Number, default: 5000 },
  changeFlashMs: { type: Number, default: 600 },
  compact: { type: Boolean, default: true },
  accentColor: { type: String, default: null },
})

// -------- Auth state ----------
const isLoggedIn = ref(false)
function updateAuthState() {
  isLoggedIn.value = !!getToken()
}

// -------- Server availability (shared app-wide status; see App.vue's ServerStatusBanner) ----------
const {
  status: serverStatus,
  message: serverStatusMessage,
  isDown: isServerDown,
  checkNow: checkServerStatus,
} = useServerStatus()

// -------- Simplified flow constants ----------
const SIMPLE_BORROW_RATE = 12.0
const SIMPLE_LEND_RATE = 12.0
const SIMPLE_TERM_DAYS = 365

function resolveEffectiveRate(marketRateStr, fallback, role) {
  const market = toNum(marketRateStr)
  if (!Number.isFinite(market) || market <= 0) {
    return `${fallback.toFixed(4)}%`
  }
  return `${market.toFixed(4)}%`
}

// -------- BTC price polling ----------
const btcPriceUsd = ref(null)
let btcPriceIntervalId = null

async function fetchBtcPrice() {
  try {
    const price = await getPrice(selectedOracle.value)
    if (Number.isFinite(price) && price > 0) btcPriceUsd.value = price
  } catch (e) {
    console.debug('BTC price fetch failed:', e)
  }
}

// -------- Modal state ----------
const activeTermDays = ref(365)
const currencyChosen = ref(false)
const termChosen = ref(false)

const showModal = ref(false)
const showRateModal = ref(false)
const rateModalAction = ref('Lend')
const rateModalMarketRate = ref('*')
const showFundingScreen = ref(false)
const showAuthPrompt = ref(false)
const lastOrderPayload = ref(null)
const selectedRate = ref('')
const selectedAction = ref('Lend')
const selectedTermDays = ref(30)
const selectedLtv = ref(50)
const { selectedOracleId: selectedOracle, oracleLabel: selectedOracleLabel, resolveOracleFromProducts, fetchOracles } = useOracle()
const { priceSymbol } = usePriceSymbol()
const selectedFiat   = ref('USD')
const modalLoading = ref(false)
const modalNotice  = ref({ type: '', text: '' })

// -------- Idempotency key ----------
const currentIdempotencyKey = ref(null)

// -------- Allocation + Balance state ----------
const allocationResult = ref(null)
const allocationLoading = ref(false)
const balanceCheckResult = ref(null)
const balanceLoading = ref(false)

// -------- Topup + Auth state ----------
const topupAddress = ref('')
const topupQrSvg = ref('')
const topupLoading = ref(false)
const topupError = ref('')
const { user: authUser, setUserFromApi } = useAuth()
const userAuthCode = computed(() => authUser.value?.auth_code ?? 0)

function handleCellClick(row, key) {
  modalNotice.value = { type: '', text: '' }
  selectedRate.value = row[key]
  selectedAction.value = key.includes('a') ? 'Lend' : 'Borrow'
  selectedTermDays.value = getDaysFromLabel(row.label)
  selectedLtv.value = 50
  showModal.value = true
}

function handleCurrencySelect(cur) {
  selectedCurrency.value = cur
  priceSymbol.value = cur === 'EUR' ? 'BTCEUR' : 'BTCUSD'
  currencyChosen.value = true
  termChosen.value = false
}

function handleTermSelect(days) {
  activeTermDays.value = days
  termChosen.value = true
}

function handleSimpleBorrow() {
  modalNotice.value = { type: '', text: '' }
  selectedContract.value = nearestContractSize.value
  const termRow = terms.value.find(r => r.label === `${activeTermDays.value} Days`)
  const marketRate = termRow?.ltv50b
  const hasMarket = marketRate && marketRate !== '*' && toNum(marketRate) > 0
  selectedRate.value = hasMarket ? marketRate : '*'
  selectedAction.value = 'Borrow'
  selectedTermDays.value = activeTermDays.value
  selectedLtv.value = 50
  selectedFiat.value = selectedCurrency.value
  showModal.value = true
}

function handleSimpleLend() {
  modalNotice.value = { type: '', text: '' }
  selectedContract.value = nearestContractSize.value
  const termRow = terms.value.find(r => r.label === `${activeTermDays.value} Days`)
  const marketRate = termRow?.ltv50a
  const hasMarket = marketRate && marketRate !== '*' && toNum(marketRate) > 0
  selectedRate.value = hasMarket ? marketRate : '*'
  selectedAction.value = 'Lend'
  selectedTermDays.value = activeTermDays.value
  selectedLtv.value = 50
  selectedFiat.value = selectedCurrency.value
  showModal.value = true
}

function handleSimpleLendLimit() {
  rateModalAction.value = 'Lend'
  rateModalMarketRate.value = getTermRate(activeTermDays.value, 'lend')
  showRateModal.value = true
}

function handleSimpleBorrowLimit() {
  rateModalAction.value = 'Borrow'
  rateModalMarketRate.value = getTermRate(activeTermDays.value, 'borrow')
  showRateModal.value = true
}

function handleRateModalConfirm(rateStr) {
  showRateModal.value = false
  modalNotice.value = { type: '', text: '' }
  selectedContract.value = nearestContractSize.value
  selectedRate.value = rateStr
  selectedAction.value = rateModalAction.value
  selectedTermDays.value = activeTermDays.value
  selectedLtv.value = 50
  selectedFiat.value = selectedCurrency.value
  showModal.value = true
}

async function handleOrderSubmit(data) {
  const type = (data.orderType || '').toLowerCase()
  modalNotice.value = { type: '', text: '' }

  // Generate idempotency key if not already set (preserves key on retry)
  if (!currentIdempotencyKey.value) {
    currentIdempotencyKey.value = await generateIdempotencyKey()
  }

  // Save payload for potential auto-retry after funding
  lastOrderPayload.value = data

  if (!getToken()) {
    showAuthPrompt.value = true
    return
  }

  modalLoading.value = true

  // Direct collateral check: compare required sats against available liquidity
  if (allocationResult.value) {
    const rate = toNum(data.rate) / 100
    const isBorrowRole = String(data.action || '').toLowerCase() === 'borrow'
    const loanSats = allocationResult.value.required_btc_liquidity ?? 0
    const ltvDecimal = (selectedLtv.value || 50) / 100
    const requiredSats = computeRequiredCollateralSats(loanSats, rate, ltvDecimal, isBorrowRole)
    const availableSats = allocationResult.value.available_btc_liquidity ?? 0

    if (availableSats < requiredSats) {
      const userEmail = authUser.value?.payload?.email ?? authUser.value?.email ?? 'unknown'
      notifySlackCollateralShortfall(userEmail, usdAmount.value, availableSats, requiredSats)
      showFundingScreen.value = true
      await fetchTopupAddress()
      modalLoading.value = false
      return
    }
  }

  if (!allocationResult.value?.is_covered) {
    const userEmail = authUser.value?.payload?.email ?? authUser.value?.email ?? 'unknown'
    const availSats = allocationResult.value?.available_btc_liquidity ?? 0
    const reqSats = allocationResult.value?.required_collateral_sats ?? 0
    notifySlackCollateralShortfall(userEmail, usdAmount.value, availSats, reqSats)
    showFundingScreen.value = true
    await fetchTopupAddress()
    modalLoading.value = false
    return
  }

  if (type === 'market') {
    const interest = toNum(data.rate)
    if (!Number.isFinite(interest)) {
      modalLoading.value = false
      modalNotice.value = { type: 'error', text: 'Invalid rate.' }
      return
    }
    const days = Number(data.durationDays) || getDaysFromLabel(data.duration)
    const ltv = selectedLtv.value || 50
    const requiredSats = allocationResult.value?.required_collateral_sats ?? 0
    try {
      await postLiquidityAllocationV1({
        ini_role: String(data.action || '').toLowerCase(),
        interest,
        oracle: [selectedOracle.value],
        base_product: buildBaseProductId(days, ltv),
        liquidity_sat: requiredSats,
      }, currentIdempotencyKey.value)
      currentIdempotencyKey.value = null
      modalNotice.value = { type: 'success', text: 'Order submitted.' }
      setUserFromApi()
    } catch (e) {
      if (e?.status === 409 || e?.response?.status === 409) {
        currentIdempotencyKey.value = null
        modalNotice.value = { type: 'error', text: e.message || 'Duplicate request — please try again.' }
      } else {
        const detail = e?.response?.data?.detail || e?.message || ''
        if (/insufficient/i.test(detail)) {
          const userEmail = authUser.value?.payload?.email ?? authUser.value?.email ?? 'unknown'
          notifySlackCollateralShortfall(userEmail, usdAmount.value, 0, 0)
          showFundingScreen.value = true
          await fetchTopupAddress()
        } else {
          modalNotice.value = { type: 'error', text: detail || 'Order failed.' }
        }
      }
    } finally {
      modalLoading.value = false
    }
    return
  }

  if (type !== 'limit') return
  const interest = toNum(data.rate)
  if (!Number.isFinite(interest)) {
    modalLoading.value = false
    modalNotice.value = { type: 'error', text: 'Invalid rate.' }
    return
  }

  const days = Number(data.durationDays) || getDaysFromLabel(data.duration)
  const ltv = selectedLtv.value || 50
  const requiredSats = allocationResult.value?.required_collateral_sats ?? 0

  try {
    await postLiquidityAllocationV1({
      ini_role: String(data.action || '').toLowerCase(),
      interest,
      oracle: [selectedOracle.value],
      base_product: buildBaseProductId(days, ltv),
      liquidity_sat: requiredSats,
    }, currentIdempotencyKey.value)
    currentIdempotencyKey.value = null
    modalNotice.value = { type: 'success', text: 'Order submitted.' }
    setUserFromApi()
  } catch (e) {
    if (e?.status === 409 || e?.response?.status === 409) {
      currentIdempotencyKey.value = null
      modalNotice.value = { type: 'error', text: e.message || 'Duplicate request — please try again.' }
    } else {
      const detail = e?.response?.data?.detail || e?.message || ''
      if (/insufficient/i.test(detail)) {
        showFundingScreen.value = true
        await fetchTopupAddress()
      } else {
        modalNotice.value = { type: 'error', text: detail || 'Order failed.' }
      }
    }
  } finally {
    modalLoading.value = false
  }
}

async function handleReviewOrder(data) {
  allocationLoading.value = true
  allocationResult.value = null
  modalNotice.value = { type: '', text: '' }

  if (!getToken()) {
    showAuthPrompt.value = true
    allocationLoading.value = false
    return
  }

  const days = Number(data.durationDays) || SIMPLE_TERM_DAYS
  const ltv = selectedLtv.value || 50
  const role = String(data.action || '').toLowerCase()
  const interest = data.rateNumeric ?? toNum(data.rate)
  if (Number.isNaN(interest)) {
    modalNotice.value = { type: 'error', text: 'Invalid interest rate.' }
    allocationLoading.value = false
    return
  }

  const baseProduct = buildBaseProductId(days, ltv)
  const foreignCollateral = Math.round(usdAmount.value)

  try {
    if (getToken()) {
      // v1 auth path: compute required collateral locally, check balance
      const liquiditySat = Math.round((foreignCollateral / btcPriceUsd.value) * 1e8)
      const ltvDecimal = (selectedLtv.value || 50) / 100
      const rateDecimal = interest / 100
      const isBorrow = role === 'borrow'
      const collateralSats = computeRequiredCollateralSats(liquiditySat, rateDecimal, ltvDecimal, isBorrow)

      let availableBtc = 0
      try {
        await setUserFromApi()
        availableBtc = authUser.value?.balance_derived ?? 0
      } catch (e) { console.error('[handleReviewOrder] balance check failed:', e) }

      allocationResult.value = {
        required_btc_liquidity: liquiditySat,
        required_collateral_sats: collateralSats,
        available_btc_liquidity: availableBtc,
        is_covered: availableBtc >= collateralSats,
      }
    } else {
      // v0 unauth path: simulation only
      const res = await postLiquidityAllocation({
        ini_role: role,
        interest,
        foreign_collateral: foreignCollateral,
        oracle: selectedOracle.value,
        base_product: baseProduct,
        margin_percent: 5,
      })
      const raw = res.payload
      const cd = raw.contract_details || {}

      let availableBtc = raw.available_btc_liquidity ?? 0
      if (!availableBtc) {
        try {
          const balRes = await getOwnDerivedBalance()
          availableBtc = balRes?.payload ?? 0
        } catch (e) { console.error('[handleReviewOrder] balance fallback failed:', e) }
      }

      allocationResult.value = {
        ...cd,
        available_btc_liquidity: availableBtc,
        is_covered: !!raw.is_covered && availableBtc >= (cd.required_btc_liquidity ?? Infinity),
      }
    }
  } catch (e) {
    console.error('[handleReviewOrder] allocation failed:', e?.response?.data || e)
    const errData = e?.response?.data
    const msg = errData?.detail || errData?.message || e?.message || 'Allocation request failed.'
    modalNotice.value = { type: 'error', text: msg }
  } finally {
    allocationLoading.value = false
  }
}

async function handleOrderConfirm(data) {
  // Re-run simulation if not yet done (e.g. rate was edited)
  if (!allocationResult.value) {
    await handleReviewOrder(data)
  }

  // Lock liquidity via v1 endpoint
  if (!getToken()) return

  // Generate idempotency key if not already set (preserves key on retry)
  if (!currentIdempotencyKey.value) {
    currentIdempotencyKey.value = await generateIdempotencyKey()
  }

  const days = Number(data.durationDays) || SIMPLE_TERM_DAYS
  const ltv = selectedLtv.value || 50
  const role = String(data.action || '').toLowerCase()
  const interest = data.rateNumeric ?? toNum(data.rate)
  if (Number.isNaN(interest)) {
    modalNotice.value = { type: 'error', text: 'Invalid interest rate.' }
    modalLoading.value = false
    return
  }

  const requiredSats = allocationResult.value?.required_collateral_sats ?? 0
  if (requiredSats <= 0) return

  modalLoading.value = true
  try {
    await postLiquidityAllocationV1({
      ini_role: role,
      interest,
      oracle: [selectedOracle.value],
      base_product: buildBaseProductId(days, ltv),
      liquidity_sat: requiredSats,
    }, currentIdempotencyKey.value)
    currentIdempotencyKey.value = null
  } catch (e) {
    if (e?.status === 409 || e?.response?.status === 409) {
      currentIdempotencyKey.value = null
      modalNotice.value = { type: 'error', text: e.message || 'Duplicate request — please try again.' }
    } else {
      const detail = e?.response?.data?.detail || e?.message || ''
      if (/insufficient/i.test(detail)) {
        showFundingScreen.value = true
        await fetchTopupAddress()
      } else {
        modalNotice.value = { type: 'error', text: detail || 'Liquidity allocation failed.' }
      }
    }
  } finally {
    modalLoading.value = false
  }
}

async function handleBalanceCheck() {
  balanceLoading.value = true
  balanceCheckResult.value = null

  try {
    await setUserFromApi()
    const satoshis = authUser.value?.balance_derived ?? 0
    const isBorrow = (selectedAction.value || '').toLowerCase() === 'borrow'

    // Compute required collateral locally using the same formula as OrderModal
    let requiredSats = 0
    if (btcPriceUsd.value && btcPriceUsd.value > 0) {
      const rate = parseFloat(selectedRate.value) / 100
      const isBorrowRole = (selectedAction.value || '').toLowerCase() === 'borrow'
      const loanSats = Math.round((usdAmount.value / btcPriceUsd.value) * 1e8)
      const ltvDecimal = (selectedLtv.value || 50) / 100
      requiredSats = computeRequiredCollateralSats(loanSats, rate, ltvDecimal, isBorrowRole)
    }

    balanceCheckResult.value = {
      satoshis,
      sufficient: satoshis >= requiredSats,
      connected: true,
    }
  } catch (e) {
    balanceCheckResult.value = { satoshis: 0, sufficient: false, connected: false }
  } finally {
    balanceLoading.value = false
  }
}

async function fetchTopupAddress() {
  topupLoading.value = true
  topupError.value = ''
  try {
    const res = await getTopupAddressQR()
    topupAddress.value = res?.payload?.string || ''
    topupQrSvg.value = res?.payload?.qr_code || ''
    if (!topupAddress.value) {
      topupError.value = 'Could not load your deposit address. Please try again or visit your profile page.'
    }
  } catch (e) {
    console.debug('Topup address fetch failed:', e)
    topupError.value = 'Could not load your deposit address. Please try again or visit your profile page.'
  } finally {
    topupLoading.value = false
  }
}

async function handleRecheckBalance() {
  try {
    await setUserFromApi()
    const satoshis = authUser.value?.balance_derived ?? 0
    // Compute needed collateral locally using the same formula as OrderModal
    let needed = 0
    if (btcPriceUsd.value && btcPriceUsd.value > 0) {
      const rate = parseFloat(selectedRate.value) / 100
      const isBorrowRole = (selectedAction.value || '').toLowerCase() === 'borrow'
      const loanSats = Math.round((usdAmount.value / btcPriceUsd.value) * 1e8)
      const ltvDecimal = (selectedLtv.value || 50) / 100
      needed = computeRequiredCollateralSats(loanSats, rate, ltvDecimal, isBorrowRole)
    }
    if (satoshis >= needed) {
      allocationResult.value = {
        ...allocationResult.value,
        is_covered: true,
        available_btc_liquidity: satoshis,
      }
    }
  } catch (e) {
    console.debug('Balance recheck failed:', e)
  }
}

async function handleRecheckAndRetry() {
  modalNotice.value = { type: '', text: '' }
  await handleRecheckBalance()
  if (allocationResult.value?.is_covered) {
    showFundingScreen.value = false
    if (lastOrderPayload.value) {
      await handleOrderSubmit(lastOrderPayload.value)
    }
  } else {
    modalNotice.value = {
      type: 'error',
      text: 'Balance is still insufficient. Please send BTC to the address above and try again.',
    }
  }
}

function handleModalClose() {
  showModal.value = false
  showFundingScreen.value = false
  showAuthPrompt.value = false
  lastOrderPayload.value = null
  currentIdempotencyKey.value = null
  allocationResult.value = null
  allocationLoading.value = false
  balanceCheckResult.value = null
  balanceLoading.value = false
  modalNotice.value = { type: '', text: '' }
  topupAddress.value = ''
  topupQrSvg.value = ''
  topupError.value = ''
}

// -------- Table rows / offers polling ----------
const terms = ref([
  { label: '90 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId: null, ltv50bId: null },
  { label: '180 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId: null, ltv50bId: null },
  { label: '365 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId: null, ltv50bId: null },
])

const flashActive = ref(new Set())
let offersIntervalId = null
let isFetchingOffers = false

const selectedCurrency = ref('USD')
const currencySymbol = computed(() => selectedCurrency.value === 'EUR' ? '€' : '$')
const activePidPrefix = computed(() =>
  selectedCurrency.value === 'EUR' ? 'LendBorrowBTCEUR:' : 'LendBorrowBTCUSD:'
)
const activeTargetTerms = computed(() =>
  selectedCurrency.value === 'EUR' ? [365] : [90, 180, 365]
)

function hasRates(days) {
  const row = terms.value.find(r => r.label === `${days} Days`)
  if (!row) return false
  return (row.ltv50a !== '*' && toNum(row.ltv50a) > 0) ||
         (row.ltv50b !== '*' && toNum(row.ltv50b) > 0)
}

watch(selectedCurrency, async () => {
  termChosen.value = false
  selectedFiat.value = selectedCurrency.value
  activeTermDays.value = 365
  terms.value = activeTargetTerms.value.map(d => ({
    label: `${d} Days`,
    ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*',
    ltv50pid: null, ltv50aId: null, ltv50bId: null,
  }))
  await loadOffersOnce()
})

watch(priceSymbol, (sym) => {
  const cur = sym === 'BTCEUR' ? 'EUR' : 'USD'
  if (selectedCurrency.value !== cur) {
    selectedCurrency.value = cur
    currencyChosen.value = true
    termChosen.value = false
  }
})

function parseFiatFromPrefix(prefix) {
  const m = prefix.match(/LendBorrowBTC(\w+):/)
  return m ? m[1] : 'USD'
}

function isYearish(days) {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
function mapDaysForUi(d) { return isYearish(d) ? 365 : d }

function getEar(row, key) {
  const v = row[`${key}Ear`]
  return v ?? '*'
}
const TARGET_TERMS = [90, 180, 365]

function parseLtv(pid) {
  const m = String(pid || '').match(/ltv-(\d{1,3})/i)
  return m ? Number(m[1]) : null
}
function parseContractFromPid(pid) {
  const m = String(pid || '').match(/c-([\d.]+)/i)
  if (m) {
    const v = Number(m[1])
    if (!Number.isFinite(v)) return '0.10'
    const decimals = v < 0.01 ? 3 : 2
    return v.toFixed(decimals)
  }
  return '0.10'
}
function parseTermRawFromPid(pid) {
  const m = String(pid || '').match(/d-(\d+(\.\d+)?)/i)
  return m ? Math.round(Number(m[1])) : null
}
function normalizeRawDays(pid, duration) {
  const fromPid = parseTermRawFromPid(pid)
  if (fromPid) return fromPid
  const d = Number(duration)
  return Number.isFinite(d) ? Math.round(d) : 30
}
function normalizeDisplayDays(pid, duration) {
  const raw = normalizeRawDays(pid, duration)
  return mapDaysForUi(raw)
}
const fmtPct2 = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '*')

function annualize360(termPct, days) {
  if (!Number.isFinite(termPct) || !days) return null
  if (isYearish(days)) return termPct
  return termPct * (360 / days)
}

function buildTermsFromOffers(offers, contractStr) {
  const best = {}
  for (const o of offers || []) {
    const ltv = parseLtv(o.product_id)
    const rawDays = normalizeRawDays(o.product_id, o.duration)
    const uiDays  = normalizeDisplayDays(o.product_id, o.duration)
    if (!ltv || !rawDays || !uiDays) continue
    if (!TARGET_TERMS.includes(uiDays)) continue

    const contract = parseContractFromPid(o.product_id)
    if (contract !== contractStr) continue

    best[uiDays] ??= {}
    best[uiDays][ltv] ??= {
      lend: { term: null, ear: null, id: null },
      borrow: { term: null, ear: null, id: null },
      pid: null,
    }

    const side = o.ini_role === 'borrow' ? 'lend' : o.ini_role === 'lend' ? 'borrow' : null
    if (!side) continue

    const earVal = annualize360(o.interest, rawDays)

    if (side === 'lend') {
      if (best[uiDays][ltv].lend.term == null || o.interest > best[uiDays][ltv].lend.term) {
        best[uiDays][ltv].lend.term = o.interest
        best[uiDays][ltv].lend.ear  = earVal ?? null
        best[uiDays][ltv].lend.id   = o.dlc_id
        best[uiDays][ltv].pid       = o.product_id
      }
    } else {
      if (best[uiDays][ltv].borrow.term == null || o.interest < best[uiDays][ltv].borrow.term) {
        best[uiDays][ltv].borrow.term = o.interest
        best[uiDays][ltv].borrow.ear  = earVal ?? null
        best[uiDays][ltv].borrow.id   = o.dlc_id
        best[uiDays][ltv].pid         = best[uiDays][ltv].pid || o.product_id
      }
    }
  }

  return TARGET_TERMS.map((d) => {
    const row = best[d] || {}
    const l50 = row[50] || { lend:{term:null,ear:null,id:null}, borrow:{term:null,ear:null,id:null}, pid:null }
    return {
      label: `${d} Days`,
      ltv50a: fmtPct2(l50.lend.term),   ltv50aEar: fmtPct2(l50.lend.ear),
      ltv50b: fmtPct2(l50.borrow.term), ltv50bEar: fmtPct2(l50.borrow.ear),
      ltv50pid: l50.pid,
      ltv50aId: l50.lend.id, ltv50bId: l50.borrow.id,
    }
  })
}

function buildTermsFromLiquidityMarket(marketResults, termsArr = [90, 180, 365]) {
  return termsArr.map((d) => {
    const entry = marketResults[d] || {}
    const lendBuckets = entry.lend || {}
    const borrowBuckets = entry.borrow || {}

    // Lend column (ltv50a) = best rate for lender = highest from BORROW bucket
    const borrowRates = Object.keys(borrowBuckets).map(Number).filter(Number.isFinite).sort((a, b) => b - a)
    const hasLend = borrowRates.length > 0
    const bestLendRate = hasLend ? borrowRates[0] / 100 : null

    // Borrow column (ltv50b) = best rate for borrower = lowest from LEND bucket
    const lendRates = Object.keys(lendBuckets).map(Number).filter(Number.isFinite).sort((a, b) => a - b)
    const hasBorrow = lendRates.length > 0
    const bestBorrowRate = hasBorrow ? lendRates[0] / 100 : null

    return {
      label: `${d} Days`,
      ltv50a: hasLend ? fmtPct2(bestLendRate) : '*',
      ltv50aEar: hasLend ? fmtPct2(bestLendRate) : '*',
      ltv50b: hasBorrow ? fmtPct2(bestBorrowRate) : '*',
      ltv50bEar: hasBorrow ? fmtPct2(bestBorrowRate) : '*',
      ltv50pid: null,
      ltv50aId: null, ltv50bId: null,
    }
  })
}

function markFlashOnce(cellId) {
  const next = new Set(flashActive.value)
  next.add(cellId)
  flashActive.value = next
  setTimeout(() => {
    const n2 = new Set(flashActive.value)
    n2.delete(cellId)
    flashActive.value = n2
  }, props.changeFlashMs)
}
function diffAndFlash(oldRows, newRows) {
  const keys = ['ltv50a', 'ltv50b']
  for (let i = 0; i < newRows.length; i++) {
    for (const base of keys) {
      const earKey = `${base}Ear`
      const prev = oldRows?.[i]?.[earKey]
      const next = newRows?.[i]?.[earKey]
      if (prev !== next) markFlashOnce(`${i}-${base}`)
    }
  }
}


// -------- Product catalog → dynamic contract sizes ----------
const products = ref([])
const selectedContract = ref('0.10')

function satsToBtcLabel(sats) {
  const n = Number(sats)
  if (!Number.isFinite(n)) return null
  const btc = n / 1e8
  const decimals = btc < 0.01 ? 3 : 2
  return btc.toFixed(decimals)
}

const availableContracts = computed(() => {
  const set = new Set()
  for (const p of products.value || []) {
    const label = satsToBtcLabel(p.contract_value)
    if (!label) continue
    if (Number(label) < 0.01) continue
    set.add(label)
  }
  return Array.from(set).sort((a, b) => Number(a) - Number(b))
})

const currentAccent = computed(() => props.accentColor || '#6738e4')

// -------- USD Amount computed helpers ----------
const btcEquivalent = computed(() => {
  if (!btcPriceUsd.value || btcPriceUsd.value <= 0) return 0
  return usdAmount.value / btcPriceUsd.value
})

const nearestContractSize = computed(() => {
  const contracts = availableContracts.value.length
    ? availableContracts.value
    : ['0.10', '1.00']
  const target = btcEquivalent.value
  let closest = contracts[0]
  let minDiff = Infinity
  for (const c of contracts) {
    const diff = Math.abs(Number(c) - target)
    if (diff < minDiff) {
      minDiff = diff
      closest = c
    }
  }
  return closest
})

const btcEquivalentDisplay = computed(() => {
  const btc = btcEquivalent.value
  if (!btcPriceUsd.value || btcPriceUsd.value <= 0) return '—'
  return `${formatBtcValue(btc)} BTC`
})

const sliderFillPct = computed(() => {
  return ((usdAmount.value - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN)) * 100
})

function roundToStep(val) {
  return Math.round(val / AMOUNT_STEP) * AMOUNT_STEP
}
function clampAmount(val) {
  return Math.min(AMOUNT_MAX, Math.max(AMOUNT_MIN, val))
}
function formatUsd(val) {
  return val.toLocaleString('en-US')
}
function onUsdInput(e) {
  let raw = String(e.target.value || '').replace(/[^\d]/g, '')
  if (raw === '') {
    usdInputRaw.value = ''
    return
  }
  const num = parseInt(raw, 10)
  if (Number.isFinite(num)) {
    usdAmount.value = num
    usdInputRaw.value = raw
  }
}
function onUsdFocus() {
  usdInputFocused.value = true
  usdInputRaw.value = String(usdAmount.value)
}
function onUsdBlur() {
  usdInputFocused.value = false
  const clamped = clampAmount(roundToStep(usdAmount.value))
  usdAmount.value = clamped
  usdInputRaw.value = formatUsd(clamped)
}
function onSliderInput(e) {
  const val = Number(e.target.value)
  usdAmount.value = val
  usdInputRaw.value = usdInputFocused.value ? String(val) : formatUsd(val)
}

// -------- Fetch products once, then offers --------
async function prefetchProducts() {
  try {
    const res = await postProductQueryV0([]) // [] => all products
    const payload = Array.isArray(res?.payload) ? res.payload : []
    products.value = payload
    if (payload.length > 0) {
      const first = payload[0]
      resolveOracleFromProducts(payload)
      if (Number.isFinite(first.ltv) && first.ltv > 0) {
        selectedLtv.value = first.ltv
      }
      selectedFiat.value = selectedCurrency.value
    }
  } catch (e) {
    console.debug('Product catalog prefetch failed:', e)
  }
}

async function loadOffersOnce() {
  if (isServerDown.value || serverStatus.value === 'checking') return
  if (isFetchingOffers) return
  isFetchingOffers = true
  const prefix = activePidPrefix.value
  const termsToFetch = activeTargetTerms.value
  try {
    const marketResults = {}
    const ltv = 50
    const fetches = termsToFetch.map(async (d) => {
      const pid = buildBaseProductId(d, ltv, prefix)
      try {
        const res = await getLiquidityMarket(pid, selectedOracle.value)
        marketResults[d] = res?.payload || {}
      } catch (e) {
        console.debug(`liquidity-market fetch failed for ${pid}:`, e)
        marketResults[d] = {}
      }
    })
    await Promise.all(fetches)
    const nextTerms = buildTermsFromLiquidityMarket(marketResults, termsToFetch)
    diffAndFlash(terms.value, nextTerms)
    terms.value = nextTerms
  } catch (e) {
    console.error('Failed to load liquidity market:', e)
  } finally {
    isFetchingOffers = false
  }
}

function onVisChange() {
  if (!document.hidden) loadOffersOnce()
}

// -------- Lifecycle ----------
onMounted(async () => {
  updateAuthState()
  window.addEventListener('auth-changed', updateAuthState)
  window.addEventListener('storage', updateAuthState)
  window.addEventListener('focus', updateAuthState)

  document.addEventListener('visibilitychange', onVisChange)
  window.addEventListener('focus', loadOffersOnce)

  await checkServerStatus()
  if (serverStatus.value !== 'up') {
    return
  }

  await fetchOracles()
  await prefetchProducts()
  await loadOffersOnce()
  offersIntervalId = setInterval(loadOffersOnce, props.offersPollMs)

  fetchBtcPrice()
  btcPriceIntervalId = setInterval(fetchBtcPrice, 30000)
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', updateAuthState)
  window.removeEventListener('storage', updateAuthState)
  window.removeEventListener('focus', updateAuthState)

  document.removeEventListener('visibilitychange', onVisChange)
  window.removeEventListener('focus', loadOffersOnce)

  if (offersIntervalId) clearInterval(offersIntervalId)
  if (btcPriceIntervalId) clearInterval(btcPriceIntervalId)
  flashActive.value = new Set()
})

// -------- Local helpers ----------
function buildProductId(days, ltv, _contractStr, prefix = activePidPrefix.value) {
  return `${prefix}ltv-${ltv}_d-${days}_c-xxx`
}
function buildBaseProductId(days, ltv, prefix = activePidPrefix.value) {
  return `${prefix}ltv-${ltv}_d-${days}_c-xxx`
}
function getDaysFromLabel(label) {
  const m = String(label || '').match(/(\d+)/)
  return m ? Number(m[1]) : 30
}
function toNum(rateStr) {
  const m = String(rateStr ?? '').match(/([\d.]+)/)
  return m ? parseFloat(m[1]) : NaN
}
function termShortLabel(days) {
  if (days === 90) return '3 months'
  if (days === 180) return '6 months'
  if (days === 365) return '1 year'
  return `${days} days`
}

function getTermRate(days, side) {
  const row = terms.value.find(r => r.label === `${days} Days`)
  if (!row) return '*'
  if (side === 'lend') return row.ltv50aEar !== '*' ? row.ltv50aEar : row.ltv50a
  return row.ltv50bEar !== '*' ? row.ltv50bEar : row.ltv50b
}

// Refresh offers whenever selection changes
watch(selectedContract, () => {
  loadOffersOnce()
})

defineExpose({ loadOffersOnce, getEar })
</script>

<style scoped>
.step-reveal-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.step-reveal-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.flash-text {
  animation: flashPop 0.18s ease-in-out;
}
@keyframes flashPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.07); }
  100% { transform: scale(1); }
}

@media (max-width: 640px) {
  table {
    border-spacing: 0.25rem 0.75rem !important;
    table-layout: fixed;
  }
  th, td {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    font-size: 0.8rem;
  }
  .spacer {
    display: none !important;
  }
  .-mt-1 { margin-top: -0.25rem; }
}

.spacer {
  width: 0.5rem;
  min-width: 0.5rem;
  max-width: 0.5rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.compact .rounded-xl { padding: 1rem; }
.compact .title-text { font-size: 1.75rem; margin-bottom: 0; }

/* keep spacing tight */
.compact table { border-spacing: 0.25rem 0.625rem !important; }
.compact thead th { padding: 0.45rem 0.6rem !important; }
/* don't clamp font-size too small for headers; let the gh-label scale instead */
.compact thead .group-header { padding: 0.5rem 0.75rem !important; }
.compact tbody td { padding: 0.6rem !important; }

.compact .rate { font-size: 1.6rem; line-height: 1.15; }
@media (min-width: 640px) {
  .compact .rate { font-size: 1.75rem; }
}
.compact [class*="text-[10px]"] { font-size: 10px !important; }
.compact .text-xs,
.compact [class*="text-[11px]"] { font-size: 11px !important; }

.minw { min-width: 6rem; }
.compact .minw { min-width: 5rem; }

@media (max-width: 640px) {
  .compact .p-3 { padding: 0.625rem !important; }
  .compact .mb-3 { margin-bottom: 0.625rem !important; }
  .compact .grid { gap: 0.5rem !important; }
  .compact .px-3.py-3 { padding: 0.625rem !important; }
}

/* group header uses accent */
.group-header {
  background: color-mix(in oklch, var(--secondary, #6738e4), black 12%);
  border: 1px solid color-mix(in oklch, var(--secondary, #6738e4), white 10%);
  line-height: 1.05; /* keep box height tight while text grows */
}

/* make the label text "fill" more of the header without growing the box */
.gh-label {
  display: inline-block;
  font-weight: 800;
  /* grows with viewport but stays within same header height */
  font-size: clamp(1rem, 1.4vw + 0.2rem, 1.35rem);
  letter-spacing: -0.015em; /* tighten just a touch so text looks fuller */
  white-space: nowrap;      /* no wrap to avoid taller header */
  line-height: 1.05;
  vertical-align: middle;
  text-wrap: balance;
}

/* chips use accent */
.chip {
  background: color-mix(in oklch, var(--secondary, #6738e4), black 10%);
  color: white;
  border-radius: 0.55rem;
  font-weight: 600;
  padding: 0.65rem 1rem;
  border: 1px solid color-mix(in oklch, var(--secondary, #6738e4), white 12%);
}

/* Hover glow picks accent */
.hover-glow {
  position: relative;
  isolation: isolate;
  outline: none;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
  overflow: clip; /* keep blur ring inside */
}
.hover-glow::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  --ring: 5px;
  --blur: 16px;
  --alpha: 0;
  background: color-mix(in oklch, var(--secondary, #6738e4), white 10%);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
          mask-composite: exclude;
  padding: var(--ring);
  filter: blur(var(--blur));
  opacity: var(--alpha);
  transform: scale(0.995);
  transition:
    opacity 180ms ease,
    filter 180ms ease,
    transform 180ms ease;
}
.hover-glow:hover::before,
.hover-glow:focus-visible::before {
  --alpha: 0.85;
  --blur: 18px;
  transform: scale(1);
}
.hover-glow:hover,
.hover-glow:focus-visible {
  box-shadow:
    inset 0 0 0 1px color-mix(in oklch, var(--secondary, #6738e4), white 25%),
    inset 0 0 24px color-mix(in oklch, var(--secondary, #6738e4), black 70% / 18%),
    0 10px 26px -14px color-mix(in oklch, var(--secondary, #6738e4), black 20%);
}

/* this makes .text-secondary follow the current accent too */
.text-secondary {
  color: var(--secondary, #6738e4) !important;
}

/* ===== Amount slider ===== */
.amount-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    #6738e4 0%,
    #6738e4 var(--fill, 0%),
    rgba(255,255,255,0.15) var(--fill, 0%),
    rgba(255,255,255,0.15) 100%
  );
  outline: none;
  cursor: pointer;
}
.amount-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #6738e4;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: transform 120ms ease;
}
.amount-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
.amount-slider::-webkit-slider-thumb:active {
  transform: scale(1.05);
}
.amount-slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #6738e4;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  cursor: pointer;
}
.amount-slider::-moz-range-track {
  height: 6px;
  border-radius: 3px;
  background: transparent;
}
</style>
