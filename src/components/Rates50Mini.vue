<!-- MarketOverview.vue -->
<template>
  <section
    class="w-full"
    :class="[`density-${density}`]"
  >
    <!-- bind the current accent on the outer card so everything inside picks it up -->
    <div
      class="rounded-xl border border-secondary/60 shadow-lg bg-dark/80 p-5 sm:p-6"
      :style="{ '--secondary': currentAccent }"
    >
      <!-- ===== Title row: BTCUSD · [LTV dropdown] · [Amount dropdown] ===== -->
      <header class="flex items-center justify-center mb-3 sm:mb-4 gap-2 sm:gap-3">
        <h3 class="font-bold text-center chart-title">
          BTCUSD ·
        </h3>

        <!-- LTV dropdown -->
        <div class="relative">
          <button
            type="button"
            class="custom-dd-trigger custom-dd-trigger--lg"
            @click="toggleLtv"
          >
            <span>{{ displayLtvLabel }}</span>
            <svg class="w-6 h-6 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <!-- LTV menu + explainer (desktop) -->
          <div v-if="ltvOpen" class="custom-dd-wrap sm:flex hidden">
            <div class="custom-dd-menu custom-dd-menu--th">
              <button
                v-for="opt in ltvOptions"
                :key="`ltv-${opt.value}`"
                type="button"
                class="custom-dd-item"
                :class="opt.value === selectedLtv ? 'active' : ''"
                @click="selectLtv(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>

            <aside class="custom-dd-infobox" role="note" aria-live="polite">
              <div class="infobox-title">What you’re changing</div>
              <p class="infobox-text">
                <strong>LTV</strong> (Loan-to-Value) filters quotes to that collateral level and is encoded in the product you’ll trade.
              </p>
              <ul class="infobox-list">
                <li>Lower LTV → safer for lender; borrower often sees lower % at higher collateral.</li>
                <li>We refresh the table to this LTV.</li>
              </ul>
            </aside>
          </div>

          <!-- LTV explainer (mobile) -->
          <aside v-if="ltvOpen" class="custom-dd-infobox-mobile mt-2 sm:hidden" role="note" aria-live="polite">
            <div class="infobox-title">What you’re changing</div>
            <p class="infobox-text">
              <strong>LTV</strong> filters quotes and is baked into the product ID.
            </p>
          </aside>
        </div>

        <h3 class="font-bold text-center chart-title">·</h3>

        <!-- Amount (contract size) dropdown -->
        <div class="relative">
          <button
            type="button"
            class="custom-dd-trigger custom-dd-trigger--lg"
            @click="toggleDropdown"
          >
            <span>{{ displayContractLabel }}</span>
            <svg class="w-6 h-6 shrink-0" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <!-- Dropdown + explanatory box wrapper (desktop only) -->
          <div v-if="dropdownOpen" class="custom-dd-wrap sm:flex hidden">
            <div class="custom-dd-menu custom-dd-menu--th">
              <button
                v-for="opt in contractOptions"
                :key="opt.value"
                type="button"
                class="custom-dd-item"
                :class="opt.value === selectedContract ? 'active' : ''"
                @click="selectContract(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>

            <!-- Info box -->
            <aside class="custom-dd-infobox" role="note" aria-live="polite">
              <div class="infobox-title">What you’re changing</div>
              <p class="infobox-text">
                <strong>Contract size</strong> is the notional BTC for each deal. It
                filters quotes to this size and is baked into the product ID you’ll trade.
              </p>
              <ul class="infobox-list">
                <li>We’ll show the best Lend/Borrow quotes that match this size.</li>
                <li>You can switch sizes anytime; the table will refresh.</li>
              </ul>
            </aside>
          </div>

          <!-- Mobile info box under the button -->
          <aside v-if="dropdownOpen" class="custom-dd-infobox-mobile mt-2 sm:hidden" role="note" aria-live="polite">
            <div class="infobox-title">What you’re changing</div>
            <p class="infobox-text">
              <strong>Contract size</strong> sets the BTC notional for each deal and filters the quotes shown below.
            </p>
          </aside>
        </div>
      </header>

      <!-- Desktop -->
      <div class="hidden sm:block">
        <table class="w-full rates-table">
          <colgroup>
            <col class="col-term" style="width:84px" />
            <col class="col-side" />
            <col class="col-side" />
          </colgroup>
          <thead>
            <tr class="text-white/80">
              <th class="text-center th term">Term</th>
              <th class="th side">Lend</th>
              <th class="th side">Borrow</th>
            </tr>
          </thead>
          <tbody class="text-white/90">
            <tr v-for="(row, i) in rows" :key="row.label" class="align-middle">
              <td class="td term">
                {{ row.label }}
              </td>

              <td
                class="td cell hover-glow"
                :class="flash.has(`${i}-lend`) ? 'text-secondary flash' : ''"
                @click="handleCellClick(row, 'lend')"
              >
                <div class="rate">{{ row.lendEar }}</div>
                <div class="kicker" v-if="row.label !== '365 Days'">Annualized yield</div>
                <div class="sub" v-if="row.label !== '365 Days'">{{ row.lendTerm }} for {{ row.label }}</div>
              </td>

              <td
                class="td cell hover-glow"
                :class="flash.has(`${i}-borrow`) ? 'text-secondary flash' : ''"
                @click="handleCellClick(row, 'borrow')"
              >
                <div class="rate">{{ row.borrowEar }}</div>
                <div class="kicker" v-if="row.label !== '365 Days'">Annualized yield</div>
                <div class="sub" v-if="row.label !== '365 Days'">{{ row.borrowTerm }} for {{ row.label }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile -->
      <div class="sm:hidden space-y-2.5 sm:space-y-3">
        <div
          v-for="(row, i) in rows"
          :key="`m-${row.label}`"
          class="rounded-lg bg-white/5 p-3 mobile-card"
        >
          <div class="mobile-term text-white text-center">
            {{ row.label }}
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="btn hover-glow"
              :class="flash.has(`${i}-lend`) ? 'text-secondary flash' : ''"
              @click="handleCellClick(row, 'lend')"
            >
              <div class="btn-label">Lend</div>
              <div class="btn-rate">{{ row.lendEar }}</div>
              <template v-if="row.label !== '365 Days'">
                <div class="btn-kicker">Annualized yield</div>
                <div class="btn-sub">{{ row.lendTerm }} for {{ row.label }}</div>
              </template>
            </button>

            <button
              type="button"
              class="btn hover-glow"
              :class="flash.has(`${i}-borrow`) ? 'text-secondary flash' : ''"
              @click="handleCellClick(row, 'borrow')"
            >
              <div class="btn-label">Borrow</div>
              <div class="btn-rate">{{ row.borrowEar }}</div>
              <template v-if="row.label !== '365 Days'">
                <div class="btn-kicker">Annualized yield</div>
                <div class="btn-sub">{{ row.borrowTerm }} for {{ row.label }}</div>
              </template>
            </button>
          </div>
        </div>
      </div>

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
        @close="showModal = false"
        @submit="handleOrderSubmit"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import OrderModal from './OrderModal.vue'
import { getToken } from '../api/token'
import { postLiquidityAllocationV1, getLiquidityMarket } from '../api/liquidityAllocation'
import { formatBtcValue } from '../functions/amount_formatting'
import { DEFAULT_ORACLE } from '../config'
import { postProductQueryV0 } from '../api/productQuery' // ApiEnvelope<ProductLendBorrowDtoLtd[]>

const props = defineProps({
  pollMs: { type: Number, default: 5000 },
  changeFlashMs: { type: Number, default: 600 },
  density: {
    type: String,
    default: 'normal',
    validator: v => ['normal','compact','tiny'].includes(v)
  },
})

const router = useRouter()

// ---- Staging detection (prod = any cadenabitcoin.com except staging.cadenabitcoin.com) ----
const IS_STAGING = (() => {
  const host = (typeof location !== 'undefined' ? location.hostname : '').toLowerCase()
  const IS_PROD = /^(?:www\.)?cadenabitcoin\.com$/.test(host) && host !== 'staging.cadenabitcoin.com'
  return !IS_PROD
})()

// accent by contract — MATCHED to your other component
const CONTRACT_ACCENTS = {
  '0.01' : '#6738e4',
  '0.10' : '#8387c4',
  '1.00' : '#000000',
}

/* ---------- Persistence for amount (contract size) ---------- */
const STORAGE_KEY = 'mo:selectedContract'
function loadPreferredContract() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v && typeof v === 'string' ? v : null
  } catch { return null }
}
function savePreferredContract(v) {
  try { localStorage.setItem(STORAGE_KEY, String(v)) } catch {}
}
function onContractStorage(e) {
  if (e.key === STORAGE_KEY) {
    const v = e.newValue
    if (v && v !== selectedContract.value) {
      selectedContract.value = v // watch will refresh data + resave
    }
  }
}

/* ---------- Dynamic product catalog (ltv + contract) ---------- */
const products = ref([])

const ltvValues = computed(() => {
  const set = new Set()
  for (const p of products.value || []) {
    const n = Number(p.ltv)
    if (Number.isFinite(n)) set.add(Math.round(n))
  }
  return Array.from(set).sort((a,b)=>a-b)
})
const ltvOptions = computed(() => {
  const arr = ltvValues.value
  const fb = [50, 80]
  const use = arr.length ? arr : fb
  return use.map(v => ({ value: v, label: `${v}% LTV` }))
})

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
    if (label && Number(label) >= 0.01) set.add(label)
  }
  if (!set.size) {
    const fb = IS_STAGING ? ['0.10', '1.00'] : ['0.10', '1.00']
    return fb
  }
  return Array.from(set).sort((a,b)=>Number(a)-Number(b))
})
const contractOptions = computed(() => availableContracts.value.map(v => ({ value: v, label: `${formatBtcValue(Number(v))} BTC` })))

/* ---------- Dropdown state ---------- */
const selectedLtv = ref(50)
const selectedContract = ref(loadPreferredContract() || '0.10')
const ltvOpen = ref(false)
const dropdownOpen = ref(false)

const displayLtvLabel = computed(() =>
  (ltvOptions.value.find(o => o.value === selectedLtv.value)?.label) || (ltvOptions.value[0]?.label ?? '50% LTV')
)
const displayContractLabel = computed(() =>
  (contractOptions.value.find(o => o.value === selectedContract.value)?.label) || '0.10 BTC'
)

/* ---------- Accent ---------- */
const currentAccent = computed(() => {
  return CONTRACT_ACCENTS[selectedContract.value] || '#6738e4'
})

function toggleLtv() {
  ltvOpen.value = !ltvOpen.value
  if (ltvOpen.value) dropdownOpen.value = false
}
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) ltvOpen.value = false
}
function selectLtv(val) {
  selectedLtv.value = val
  ltvOpen.value = false
  loadOnce()
}
function selectContract(val) {
  selectedContract.value = val
  savePreferredContract(val)
  dropdownOpen.value = false
  loadOnce()
}

/* ---------- Modal state ---------- */
const showModal = ref(false)
const selectedRate = ref('*')
const selectedAction = ref('Lend')
const selectedTermDays = ref(30)
const modalLoading = ref(false)
const modalNotice = ref({ type: '', text: '' })

function getDaysFromLabel(label) {
  const m = String(label || '').match(/(\d+)/)
  return m ? Number(m[1]) : 30
}

/* ---------- Table data (unchanged sizes) ---------- */
const rows = ref([
  { label: '365 Days', lendTerm: '*', lendEar: '*', borrowTerm: '*', borrowEar: '*', lendId: null, borrowId: null, pid: null },
])

const flash = ref(new Set())
let intervalId = null
let fetching = false

const TARGET_TERMS = [365]
const fmtPct2 = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '*')
const isYearish = (d) => Number.isFinite(d) && d >= 360 && d <= 366
const PID_PREFIX = 'LendBorrowBTCUSD:'

function annualize360(termPct, days) {
  if (!Number.isFinite(termPct) || !days) return null
  if (isYearish(days)) return termPct
  return termPct * (360 / days)
}

/* ---------- product id ---------- */
function buildProductId(days, ltv, contractStr) {
  return `${PID_PREFIX}ltv-50_d-365_c-xxx`
}

/* ---------- rows from v1 liquidity-market data ---------- */
function buildRowsFromMarket(marketResults) {
  return TARGET_TERMS.map((d) => {
    const entry = marketResults[d] || {}
    const lendBuckets = entry.lend || {}
    const borrowBuckets = entry.borrow || {}

    // Best lend rate = highest rate with liquidity
    const lendRates = Object.keys(lendBuckets).map(Number).filter(Number.isFinite).sort((a, b) => b - a)
    const bestLendRate = lendRates.length ? lendRates[0] : null
    const bestLendEar = bestLendRate != null ? annualize360(bestLendRate, d) : null

    // Best borrow rate = lowest rate with liquidity
    const borrowRates = Object.keys(borrowBuckets).map(Number).filter(Number.isFinite).sort((a, b) => a - b)
    const bestBorrowRate = borrowRates.length ? borrowRates[0] : null
    const bestBorrowEar = bestBorrowRate != null ? annualize360(bestBorrowRate, d) : null

    return {
      label: `${d} Days`,
      lendTerm: fmtPct2(bestLendRate),
      lendEar: fmtPct2(bestLendEar),
      borrowTerm: fmtPct2(bestBorrowRate),
      borrowEar: fmtPct2(bestBorrowEar),
      lendId: null,
      borrowId: null,
      pid: buildProductId(d, selectedLtv.value, selectedContract.value),
    }
  })
}

function flashDiff(prev, next) {
  for (let i = 0; i < next.length; i++) {
    if (prev?.[i]?.lendEar !== next?.[i]?.lendEar) mark(`${i}-lend`)
    if (prev?.[i]?.borrowEar !== next?.[i]?.borrowEar) mark(`${i}-borrow`)
  }
}
function mark(id) {
  const n = new Set(flash.value)
  n.add(id)
  flash.value = n
  setTimeout(() => {
    const n2 = new Set(flash.value)
    n2.delete(id)
    flash.value = n2
  }, props.changeFlashMs)
}

/* ---------- data + actions ---------- */
async function prefetchProducts() {
  try {
    const res = await postProductQueryV0([]) // [] => all products
    const payload = Array.isArray(res?.payload) ? res.payload : []
    products.value = payload

    // ensure selections are valid (and honor persisted contract if valid)
    const optsLtv = ltvOptions.value
    const optsCn  = contractOptions.value

    if (!optsLtv.find(o => o.value === selectedLtv.value) && optsLtv.length) {
      selectedLtv.value = optsLtv[0].value
    }

    const stored = loadPreferredContract()
    const storedValid = stored && optsCn.find(o => o.value === stored)
    if (storedValid && stored !== selectedContract.value) {
      selectedContract.value = stored
    } else if (!optsCn.find(o => o.value === selectedContract.value) && optsCn.length) {
      selectedContract.value = optsCn[0].value
    }
  } catch (e) {
    console.debug('Product catalog prefetch failed:', e)
  }
}

async function loadOnce() {
  if (fetching) return
  fetching = true
  try {
    const ltv = selectedLtv.value
    const marketResults = {}
    const fetches = TARGET_TERMS.map(async (d) => {
      const pid = buildProductId(d, ltv, selectedContract.value)
      try {
        const res = await getLiquidityMarket(pid)
        marketResults[d] = res?.payload || {}
      } catch (e) {
        console.debug(`liquidity-market fetch failed for ${pid}:`, e)
        marketResults[d] = {}
      }
    })
    await Promise.all(fetches)
    const nextRows = buildRowsFromMarket(marketResults)
    flashDiff(rows.value, nextRows)
    rows.value = nextRows
  } catch (e) {
    console.error('Rates table load failed', e)
  } finally {
    fetching = false
  }
}

function handleCellClick(row, side) {
  // rate to show in modal (term rate, not ear)
  selectedRate.value = side === 'lend' ? row.lendTerm : row.borrowTerm
  selectedAction.value = side === 'lend' ? 'Lend' : 'Borrow'
  selectedTermDays.value = getDaysFromLabel(row.label)
  modalNotice.value = { type: '', text: '' }
  showModal.value = true
}

async function handleOrderSubmit(data) {
  modalNotice.value = { type: '', text: '' }

  if (!getToken()) {
    showModal.value = false
    router.push('/login')
    return
  }

  modalLoading.value = true

  const interest = toNum(data.rate)
  if (!Number.isFinite(interest)) {
    modalLoading.value = false
    modalNotice.value = { type: 'error', text: 'Invalid rate.' }
    return
  }

  const days = Number(data.durationDays) || selectedTermDays.value
  const ltv = selectedLtv.value
  const cntr = selectedContract.value

  try {
    await postLiquidityAllocationV1({
      ini_role: String(data.action || '').toLowerCase(),
      interest,
      oracle: [DEFAULT_ORACLE],
      base_product: buildProductId(days, ltv, cntr),
      liquidity_sat: 0,
    })
    modalNotice.value = { type: 'success', text: 'Order submitted.' }
  } catch (e) {
    const msg = e?.response?.data?.detail || e?.message || 'Order failed.'
    modalNotice.value = { type: 'error', text: msg }
  } finally {
    modalLoading.value = false
  }
}

function toNum(rateStr) {
  const m = String(rateStr ?? '').match(/([\d.]+)/)
  return m ? parseFloat(m[1]) : NaN
}
onMounted(async () => {
  await prefetchProducts()
  await loadOnce()
  intervalId = setInterval(loadOnce, props.pollMs)
  window.addEventListener('focus', loadOnce)
  document.addEventListener('visibilitychange', onVisChange)
  window.addEventListener('storage', onContractStorage)
})
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  window.removeEventListener('focus', loadOnce)
  document.removeEventListener('visibilitychange', onVisChange)
  window.removeEventListener('storage', onContractStorage)
})

function onVisChange() {
  if (!document.hidden) loadOnce()
}

// reload & persist data when switching selections
watch(selectedContract, (v) => { savePreferredContract(v); loadOnce() })
watch(selectedLtv, () => { loadOnce() })
</script>

<style scoped>
/* ---- Density scales ---- */
.density-normal {
  --title-fs: clamp(1.125rem, 1.1rem + 0.6vw, 1.5rem);
  --thead-fs: clamp(0.9rem, 0.85rem + 0.25vw, 1rem);
  --term-fs: clamp(1.05rem, 1rem + 0.5vw, 1.25rem);
  --rate-fs: clamp(1.5rem, 1.25rem + 1.2vw, 1.875rem);
  --kicker-fs: 0.7rem;
  --sub-fs: 0.75rem;
  --cell-py: 1rem;
  --cell-px: 1rem;
  --table-gap-y: 0.75rem;
  --table-gap-x: 0.75rem;
}

.density-compact {
  --title-fs: clamp(1rem, 0.95rem + 0.4vw, 1.25rem);
  --thead-fs: clamp(0.85rem, 0.8rem + 0.2vw, 0.95rem);
  --term-fs: clamp(0.95rem, 0.9rem + 0.4vw, 1.15rem);
  --rate-fs: clamp(1.35rem, 1.1rem + 1vw, 1.6rem);
  --kicker-fs: 0.68rem;
  --sub-fs: 0.72rem;
  --cell-py: 0.75rem;
  --cell-px: 0.75rem;
  --table-gap-y: 0.55rem;
  --table-gap-x: 0.55rem;
}

.density-tiny {
  --title-fs: clamp(0.95rem, 0.9rem + 0.25vw, 1.1rem);
  --thead-fs: clamp(0.8rem, 0.75rem + 0.2vw, 0.9rem);
  --term-fs: clamp(0.9rem, 0.85rem + 0.3vw, 1rem);
  --rate-fs: clamp(1.15rem, 1rem + 0.8vw, 1.35rem);
  --kicker-fs: 0.66rem;
  --sub-fs: 0.7rem;
  --cell-py: 0.55rem;
  --cell-px: 0.6rem;
  --table-gap-y: 0.45rem;
  --table-gap-x: 0.45rem;
}

/* Title */
.chart-title { font-size: var(--title-fs); }

/* Table (UNCHANGED sizes/shape) */
.rates-table {
  border-collapse: separate;
  border-spacing: var(--table-gap-x) var(--table-gap-y);
  width: 100%;
}

.th.term {
  padding: 0.75rem 1rem;
  text-align: center;
  font-size: var(--thead-fs);
}
.th.side {
  padding: 0.75rem 1rem;
  text-align: center;
  font-size: var(--thead-fs);
  color: white;
  background: color-mix(in oklch, var(--secondary, #6738e4), black 10%);
  border-radius: 0.5rem;
}

/* Cells (UNCHANGED) */
.td.term {
  padding: var(--cell-py) var(--cell-px);
  text-align: center;
  white-space: nowrap;
  font-weight: 600;
  font-size: var(--term-fs);
}
.td.cell {
  padding: var(--cell-py) var(--cell-px);
  text-align: center;
  background: rgba(255,255,255,0.08);
  border-radius: 0.5rem;
  cursor: pointer;
}
.rate { font-weight: 800; line-height: 1.1; font-size: var(--rate-fs); }
.kicker { margin-top: 0.35rem; color: rgba(255,255,255,0.7); font-size: var(--kicker-fs); }
.sub { margin-top: 0.2rem; color: rgba(255,255,255,0.9); font-size: var(--sub-fs); }

/* Mobile (UNCHANGED) */
.mobile-card { padding: 0.65rem 0.75rem; }
.mobile-term { font-weight: 600; font-size: clamp(1rem, 0.95rem + 0.6vw, 1.25rem); margin-bottom: 0.4rem; }
.btn {
  padding: 0.6rem 0.7rem;
  text-align: center;
  background: rgba(255,255,255,0.08);
  border-radius: 0.5rem;
  transition: transform 120ms ease;
}
.btn:active { transform: scale(0.98); }
.btn-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: rgba(255,255,255,0.75); }
.btn-rate { font-size: clamp(1.15rem, 1rem + 1vw, 1.5rem); font-weight: 800; line-height: 1.1; margin-top: 0.1rem; }
.btn-kicker { font-size: 0.65rem; color: rgba(255,255,255,0.7); margin-top: 0.1rem; }
.btn-sub { font-size: 0.7rem; color: rgba(255,255,255,0.9); margin-top: 0.15rem; }

/* Flash & hover (UNCHANGED) */
.flash { animation: pop 0.18s ease-in-out; }
@keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.06)} 100%{transform:scale(1)} }

.hover-glow {
  position:relative;
  isolation:isolate;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
}
.hover-glow::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  pointer-events:none;
  --ring:5px;
  --blur:16px;
  --alpha:0;
  background: color-mix(in oklch, var(--secondary, #6738e4), white 10%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  padding: var(--ring);
  filter: blur(var(--blur));
  opacity: var(--alpha);
  transform: scale(0.995);
  transition: opacity 180ms ease, filter 180ms ease, transform 180ms ease;
}
.hover-glow:hover::before,
.hover-glow:focus-visible::before {
  --alpha:.85;
  --blur:18px;
  transform:scale(1);
}

/* table layout widths (UNCHANGED) */
.rates-table { table-layout: fixed; }
.rates-table .col-term { width: clamp(88px, 12%, 128px); }
.rates-table .col-side { width: auto; }

.th.term,
.td.term {
  padding-inline: calc(var(--cell-px) * 0.55);
}
.rates-table col.col-term { width: clamp(72px, 9%, 110px); }
.rates-table col.col-side { width: auto; }

.rates-table .th.term,
.rates-table .td.term {
  width: clamp(72px, 9%, 110px) !important;
  padding-inline: calc(var(--cell-px) * 0.45) !important;
}
.rates-table .td.term { white-space: normal; line-height: 1.15; }

/* this makes .text-secondary follow the current accent too */
.text-secondary {
  color: var(--secondary, #6738e4) !important;
}

/* ===== Bigger, colored dropdowns (NEW) — Title bar only ===== */
.custom-dd-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(10,10,15,.35);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 0.45rem;
  padding: 0.35rem 0.6rem 0.35rem 0.7rem;
  font-size: 0.875rem;
  color: #fff;
  line-height: 1.1;
  transition: border 120ms ease, background 120ms ease;
}
.custom-dd-trigger:hover {
  border-color: rgba(255,255,255,.32);
  background: rgba(10,10,15,.55);
}

/* Larger colored variant used in the title bar */
.custom-dd-trigger--lg {
  background: #6738e4; /* colored to match */
  border: 1px solid rgba(255,255,255,.18);
  padding: 0.55rem 0.9rem;
  font-size: 1rem;
  border-radius: 0.6rem;
}
.custom-dd-trigger--lg:hover {
  border-color: rgba(255,255,255,.32);
  background: rgba(103,56,228,.9);
}

.custom-dd-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.35rem;
  min-width: 7.5rem;
  background: rgba(11,12,18,0.96);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 0.55rem;
  box-shadow: 0 16px 35px rgba(0,0,0,.35);
  backdrop-filter: blur(6px);
  z-index: 30;
  overflow: hidden;
}
.custom-dd-menu--th { left: 0; right: auto; }

.custom-dd-item {
  width: 100%;
  text-align: left;
  padding: 0.55rem 0.8rem;
  font-size: 0.92rem;
  color: rgba(255,255,255,.9);
  background: transparent;
  transition: background 120ms ease;
}
.custom-dd-item + .custom-dd-item { border-top: 1px solid rgba(0,0,0,.35) }
.custom-dd-item:hover { background: rgba(103,56,228,.14); }
.custom-dd-item.active {
  background: rgba(103,56,228,.28);
  color: #fff;
  font-weight: 600;
}

/* Menu + info panel wrapper (desktop) */
.custom-dd-wrap {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
  z-index: 45;
}

/* Info panels */
.custom-dd-infobox {
  width: 22rem;
  padding: 0.85rem 1rem;
  border-radius: 0.7rem;
  background: rgba(13,14,20,0.9);
  border: 1px solid rgba(255,255,255,.10);
  box-shadow: 0 20px 45px rgba(0,0,0,.35);
  color: rgba(255,255,255,.92);
  backdrop-filter: blur(6px);
}
.infobox-title { font-weight: 800; margin-bottom: 0.35rem; font-size: 0.95rem; letter-spacing: -0.01em; }
.infobox-text { font-size: 0.86rem; line-height: 1.3; margin-bottom: 0.4rem; }
.infobox-list { font-size: 0.82rem; line-height: 1.35; padding-left: 1rem; list-style: disc; color: rgba(255,255,255,.85); }

/* Mobile info panel */
.custom-dd-infobox-mobile {
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(13,14,20,0.9);
  color: rgba(255,255,255,.92);
  border-radius: 0.7rem;
  padding: 0.75rem 0.85rem;
  box-shadow: 0 12px 28px rgba(0,0,0,.35);
}
</style>
