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
          <!-- Simplified CTA layout -->
          <div class="flex flex-col items-center gap-8 py-8 sm:py-12">
            <!-- USD Amount Input + Slider -->
            <div class="w-full max-w-md bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <label class="block text-white/70 text-sm font-semibold uppercase tracking-wide mb-4 text-center">Choose your amount</label>

              <!-- Large USD input -->
              <div class="flex items-center justify-center gap-1">
                <span class="text-4xl sm:text-5xl font-bold text-white/50">$</span>
                <input
                  type="text"
                  inputmode="numeric"
                  :value="usdInputFocused ? usdInputRaw : usdInputRaw"
                  @input="onUsdInput"
                  @focus="onUsdFocus"
                  @blur="onUsdBlur"
                  class="text-4xl sm:text-5xl font-bold bg-transparent border-none outline-none text-white text-center w-full max-w-[280px] tabular-nums"
                  aria-label="USD amount"
                />
              </div>

              <!-- BTC equivalent -->
              <div class="text-center text-white/60 text-sm mt-2 tabular-nums">
                ≈ {{ btcEquivalentDisplay }}
              </div>

              <!-- Range slider -->
              <div class="mt-6">
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
                <div class="flex justify-between text-xs text-white/50 mt-1 tabular-nums">
                  <span>$1,000</span>
                  <span>$100,000</span>
                </div>
              </div>
            </div>

            <!-- CTA buttons -->
            <div class="w-full max-w-md flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                @click="handleSimpleBorrow"
                class="flex-1 bg-secondary hover:bg-secondary/90 text-white px-6 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-secondary/20"
              >
                Borrow Bitcoin Exposure
              </button>
              <button
                type="button"
                @click="handleSimpleLend"
                class="flex-1 border-2 border-secondary text-white hover:bg-secondary/10 px-6 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-secondary/20"
              >
                Lend for Fixed Fiat Returns
              </button>
            </div>
          </div>

          <!-- Modal -->
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
            :allocation-result="allocationResult"
            :allocation-loading="allocationLoading"
            :balance-check-result="balanceCheckResult"
            :balance-loading="balanceLoading"
            :topup-address="topupAddress"
            :topup-qr-svg="topupQrSvg"
            :user-auth-code="userAuthCode"
            :show-funding-screen="showFundingScreen"
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
import { getOffers, getUserOffers } from '../api/offers'
import { postOffer } from '../api/postOffer'
import { acceptOffer } from '../api/acceptOffer'
import { getToken } from '../api/token'
import { postProductQueryV0 } from '../api/productQuery' // uses ApiEnvelope<{...}[]>
import { getServerStatus } from '../api/serverStatus'
import { getPrice } from '../api/price'
import { postLiquidityAllocation } from '../api/liquidityAllocation'
import { getOwnDerivedBalance } from '../api/userDerivedBalance'
import { getTopupAddressQR } from '../api/qr'
import { useAuth } from '../composables/useAuth'

const router = useRouter()

// -------- Env: staging vs prod ----------
const IS_STAGING = (() => {
  const host = (typeof location !== 'undefined' ? location.hostname : '').toLowerCase()
  const IS_PROD = /^(?:www\.)?cadenabitcoin\.com$/.test(host) && host !== 'staging.cadenabitcoin.com'
  return !IS_PROD
})()

// -------- USD Amount Input + Slider ----------
const AMOUNT_MIN = 1000
const AMOUNT_MAX = 100000
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

// -------- Server availability ----------
const FORCE_SERVER_DOWN = false
const serverStatus = ref(FORCE_SERVER_DOWN ? 'down' : 'checking')
const serverStatusMessage = ref('')
const DEFAULT_DOWNTIME_MSG =
  'There are no live rates right now and you will not be able to log in while the Cadena servers are under maintenance. Please try again shortly.'

const isServerDown = computed(() => serverStatus.value === 'down')

async function checkServerStatus() {
  if (FORCE_SERVER_DOWN) {
    serverStatus.value = 'down'
    serverStatusMessage.value = DEFAULT_DOWNTIME_MSG
    return
  }
  try {
    const res = await getServerStatus()
    const payload = res?.payload
    if (payload?.ok && payload?.status === 'up') {
      serverStatus.value = 'up'
      serverStatusMessage.value = ''
      return
    }
    serverStatus.value = 'down'
    serverStatusMessage.value = DEFAULT_DOWNTIME_MSG
  } catch (error) {
    const statusCode = error?.response?.status
    if (statusCode === 429) {
      serverStatusMessage.value =
        'Too many health-check requests from this IP. Please wait a moment and refresh. Rates are temporarily unavailable and logins are disabled until we reconnect.'
    } else {
      serverStatusMessage.value = DEFAULT_DOWNTIME_MSG
    }
    serverStatus.value = 'down'
  }
}

// -------- Simplified flow constants ----------
const SIMPLE_BORROW_RATE = 12.0
const SIMPLE_LEND_RATE = 8.0
const SIMPLE_TERM_DAYS = 365

// -------- BTC price polling ----------
const btcPriceUsd = ref(null)
let btcPriceIntervalId = null

async function fetchBtcPrice() {
  try {
    const price = await getPrice()
    if (Number.isFinite(price) && price > 0) btcPriceUsd.value = price
  } catch (e) {
    console.debug('BTC price fetch failed:', e)
  }
}

// -------- Modal state ----------
const showModal = ref(false)
const showFundingScreen = ref(false)
const lastOrderPayload = ref(null)
const selectedRate = ref('')
const selectedAction = ref('Lend')
const selectedTermDays = ref(30)
const selectedLtv = ref(50)
const selectedOfferId = ref(null)
const modalLoading = ref(false)
const modalNotice  = ref({ type: '', text: '' })

// -------- Allocation + Balance state ----------
const allocationResult = ref(null)
const allocationLoading = ref(false)
const balanceCheckResult = ref(null)
const balanceLoading = ref(false)

// -------- Topup + Auth state ----------
const topupAddress = ref('')
const topupQrSvg = ref('')
const { user: authUser } = useAuth()
const userAuthCode = computed(() => authUser.value?.auth_code ?? 0)

function handleCellClick(row, key) {
  modalNotice.value = { type: '', text: '' }
  selectedRate.value = row[key]
  selectedAction.value = key.includes('a') ? 'Lend' : 'Borrow'
  selectedTermDays.value = getDaysFromLabel(row.label)
  selectedLtv.value = 50
  const idKey = `${key}Id`
  selectedOfferId.value = row[idKey] || null
  showModal.value = true
}

function handleSimpleBorrow() {
  modalNotice.value = { type: '', text: '' }
  selectedContract.value = nearestContractSize.value
  selectedRate.value = `${SIMPLE_BORROW_RATE.toFixed(4)}%`
  selectedAction.value = 'Borrow'
  selectedTermDays.value = SIMPLE_TERM_DAYS
  selectedLtv.value = 50
  selectedOfferId.value = null
  showModal.value = true
}

function handleSimpleLend() {
  modalNotice.value = { type: '', text: '' }
  selectedContract.value = nearestContractSize.value
  selectedRate.value = `${SIMPLE_LEND_RATE.toFixed(4)}%`
  selectedAction.value = 'Lend'
  selectedTermDays.value = SIMPLE_TERM_DAYS
  selectedLtv.value = 50
  selectedOfferId.value = null
  showModal.value = true
}

async function handleOrderSubmit(data) {
  const type = (data.orderType || '').toLowerCase()
  modalNotice.value = { type: '', text: '' }

  // Save payload for potential auto-retry after funding
  lastOrderPayload.value = data

  if (!getToken()) {
    showModal.value = false
    router.push('/login')
    return
  }

  modalLoading.value = true

  if (type === 'market') {
    if (!selectedOfferId.value) {
      modalLoading.value = false
      modalNotice.value = { type: 'error', text: 'Missing offer id' }
      return
    }
    try {
      const res = await acceptOffer({ dlc_id: String(selectedOfferId.value) })
      console.log('Offer accepted:', res)
      modalNotice.value = { type: 'success', text: 'Market order accepted.' }
      fetchTopupAddress()
    } catch (e) {
      const detail = e?.response?.data?.detail || e?.message || ''
      if (/insufficient funds/i.test(detail)) {
        showFundingScreen.value = true
        fetchTopupAddress()
      } else {
        modalNotice.value = { type: 'error', text: detail || 'Accept failed.' }
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
  const cntr = selectedContract.value || '0.10'
  const product_id = buildProductId(days, ltv, cntr)
  const tmp_cntr_id = genTmpCntrId()

  const params = {
    product_id,
    tmp_cntr_id,
    ini_role: String(data.action || '').toLowerCase(),
    interest,
  }

  try {
    const res = await postOffer(params)
    console.log('Offer posted:', res)
    modalNotice.value = { type: 'success', text: 'Limit order posted' }
    fetchTopupAddress()
  } catch (e) {
    const detail = e?.response?.data?.detail || e?.message || ''
    if (/insufficient funds/i.test(detail)) {
      showFundingScreen.value = true
      fetchTopupAddress()
    } else {
      modalNotice.value = { type: 'error', text: detail || 'Offer failed.' }
    }
  } finally {
    modalLoading.value = false
  }
}

async function handleReviewOrder(data) {
  if (!getToken()) {
    showModal.value = false
    router.push('/login')
    return
  }

  allocationLoading.value = true
  allocationResult.value = null
  modalNotice.value = { type: '', text: '' }

  const days = Number(data.durationDays) || SIMPLE_TERM_DAYS
  const ltv = selectedLtv.value || 50
  const role = String(data.action || '').toLowerCase()
  const interest = data.rateNumeric

  const params = {
    ini_role: role,
    interest,
    foreign_collateral: Math.round(usdAmount.value),
    oracle: 'oracle_dlcp',
    base_product: buildBaseProductId(days, ltv),
    margin_percent: 5,
  }

  try {
    const res = await postLiquidityAllocation(params)
    const raw = res.payload
    const cd = raw.contract_details || {}
    allocationResult.value = {
      ...cd,
      available_btc_liquidity: raw.available_btc_liquidity ?? 0,
      is_covered: !!raw.is_covered,
    }
  } catch (e) {
    const msg = e?.response?.data?.detail || e?.message || 'Allocation request failed.'
    modalNotice.value = { type: 'error', text: msg }
  } finally {
    allocationLoading.value = false
  }
}

async function handleOrderConfirm(data) {
  // Allocation already happened on review; re-run if rate was edited
  if (!allocationResult.value) {
    await handleReviewOrder(data)
  }
}

async function handleBalanceCheck() {
  balanceLoading.value = true
  balanceCheckResult.value = null

  try {
    const res = await getOwnDerivedBalance()
    const satoshis = res?.payload ?? 0
    const isBorrow = (selectedAction.value || '').toLowerCase() === 'borrow'

    // Determine required collateral from allocation result
    let requiredSats = 0
    if (allocationResult.value?.required_btc_liquidity) {
      requiredSats = allocationResult.value.required_btc_liquidity
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
  try {
    const res = await getTopupAddressQR(-1)
    topupAddress.value = res?.payload?.string || ''
    topupQrSvg.value = res?.payload?.qr_code || ''
  } catch (e) {
    console.debug('Topup address fetch failed:', e)
  }
}

async function handleRecheckBalance() {
  try {
    const res = await getOwnDerivedBalance()
    const satoshis = res?.payload ?? 0
    const needed = allocationResult.value?.required_btc_liquidity ?? 0
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
  lastOrderPayload.value = null
  allocationResult.value = null
  allocationLoading.value = false
  balanceCheckResult.value = null
  balanceLoading.value = false
  modalNotice.value = { type: '', text: '' }
  topupAddress.value = ''
  topupQrSvg.value = ''
}

// -------- Table rows / offers polling ----------
const terms = ref([
  { label: '30 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId:null, ltv50bId:null },
  { label: '90 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId:null, ltv50bId:null },
  { label: '180 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId:null, ltv50bId:null },
  { label: '365 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId:null, ltv50bId:null },
])

const flashActive = ref(new Set())
let offersIntervalId = null
let isFetchingOffers = false

const PID_PREFIX = 'LendBorrowBTCUSD:'

function isYearish(days) {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
function mapDaysForUi(d) { return isYearish(d) ? 365 : d }

function getEar(row, key) {
  const v = row[`${key}Ear`]
  return v ?? '*'
}
const TARGET_TERMS = [30, 90, 180, 365]

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
    : ['0.01', '0.10', '1.00']
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
  return `${btc.toFixed(4)} BTC`
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
  } catch (e) {
    console.debug('Product catalog prefetch failed:', e)
  }
}

async function loadOffersOnce() {
  if (isServerDown.value || serverStatus.value === 'checking') return
  if (isFetchingOffers) return
  isFetchingOffers = true
  try {
    const token = getToken()
    const res = token
      ? await getUserOffers('both', false)
      : await getOffers('both')
    if (!res || !Array.isArray(res.payload)) throw new Error('Bad payload')
    const nextTerms = buildTermsFromOffers(res.payload, selectedContract.value)
    diffAndFlash(terms.value, nextTerms)
    terms.value = nextTerms
  } catch (e) {
    console.error('Failed to load offers:', e)
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
function buildProductId(days, ltv, contractStr) {
  const normalizedDays = isYearish(days) ? 365 : days
  const cleanContract = Number(contractStr)
  const decimals = (Number.isFinite(cleanContract) && cleanContract < 0.01) ? 3 : 2
  const cPart = Number.isFinite(cleanContract) ? cleanContract.toFixed(decimals) : '0.10'
  return `${PID_PREFIX}ltv-${ltv}_d-${normalizedDays}_c-${cPart}`
}
function buildBaseProductId(days, ltv) {
  const normalizedDays = isYearish(days) ? 365 : days
  return `${PID_PREFIX}ltv-${ltv}_d-${normalizedDays}_c-xxx`
}
function getDaysFromLabel(label) {
  const m = String(label || '').match(/(\d+)/)
  return m ? Number(m[1]) : 30
}
function toNum(rateStr) {
  const m = String(rateStr ?? '').match(/([\d.]+)/)
  return m ? parseFloat(m[1]) : NaN
}
function genTmpCntrId() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

// Refresh offers whenever selection changes
watch(selectedContract, () => {
  loadOffersOnce()
})

defineExpose({ loadOffersOnce, getEar })
</script>

<style scoped>
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
