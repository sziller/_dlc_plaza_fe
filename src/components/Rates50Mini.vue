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
      <header class="flex items-center justify-center mb-3 sm:mb-4 gap-2 sm:gap-3">
        <h3 class="font-bold text-center chart-title">
          50% LTV · BTCUSD ·
        </h3>

        <!-- custom dropdown -->
        <div class="relative">
          <button
            type="button"
            class="custom-dd-trigger"
            @click="toggleDropdown"
          >
            <span>{{ displayContractLabel }}</span>
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div
            v-if="dropdownOpen"
            class="custom-dd-menu"
          >
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
import { getOffers, getUserOffers } from '../api/offers'
import { getToken } from '../api/token'
import { acceptOffer } from '../api/acceptOffer'
import { postOffer } from '../api/postOffer'

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

// contract sizes -> accent
const CONTRACT_ACCENTS = {
  '0.01': '#000000',
  '0.10': '#6738e4',
  '1.00': '#8387c4',
}

const contractOptions = [
  { value: '1.00', label: '1.00 BTC' },
  { value: '0.10', label: '0.10 BTC' },
  { value: '0.01', label: '0.01 BTC' },
]

// dropdown state
const selectedContract = ref('0.10')
const dropdownOpen = ref(false)

const displayContractLabel = computed(() => {
  return contractOptions.find(o => o.value === selectedContract.value)?.label || '0.10 BTC'
})

// computed accent
const currentAccent = computed(() => {
  return CONTRACT_ACCENTS[selectedContract.value] || '#6738e4'
})

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}
function selectContract(val) {
  selectedContract.value = val
  dropdownOpen.value = false
}

// modal state
const showModal = ref(false)
const selectedRate = ref('*')
const selectedAction = ref('Lend')
const selectedTermDays = ref(30)
const selectedLtv = ref(50)
const selectedOfferId = ref(null)
const modalLoading = ref(false)
const modalNotice = ref({ type: '', text: '' })

function getDaysFromLabel(label) {
  const m = String(label || '').match(/(\d+)/)
  return m ? Number(m[1]) : 30
}

// table data (now also stores ids)
const rows = ref([
  { label: '30 Days',  lendTerm: '*', lendEar: '*', borrowTerm: '*', borrowEar: '*', lendId: null, borrowId: null, pid: null },
  { label: '90 Days',  lendTerm: '*', lendEar: '*', borrowTerm: '*', borrowEar: '*', lendId: null, borrowId: null, pid: null },
  { label: '180 Days', lendTerm: '*', lendEar: '*', borrowTerm: '*', borrowEar: '*', lendId: null, borrowId: null, pid: null },
  { label: '365 Days', lendTerm: '*', lendEar: '*', borrowTerm: '*', borrowEar: '*', lendId: null, borrowId: null, pid: null },
])

const flash = ref(new Set())
let intervalId = null
let fetching = false

const TARGET_TERMS = [30, 90, 180, 365]
const fmtPct2 = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '*')
const isYearish = (d) => Number.isFinite(d) && d >= 360 && d <= 366
const PID_PREFIX = 'LendBorrowBTCUSD:'

// parsing helpers
function parseLtv(pid) {
  const m = String(pid || '').match(/ltv-(\d{1,3})/i)
  return m ? Number(m[1]) : null
}
function parseTermRawFromPid(pid) {
  const m = String(pid || '').match(/d-(\d+(\.\d+)?)/i)
  return m ? Math.round(Number(m[1])) : null
}
function parseContractFromPid(pid) {
  const m = String(pid || '').match(/c-([\d.]+)/i)
  if (m) {
    const num = Number(m[1])
    if (Number.isFinite(num)) {
      return num.toFixed(2)
    }
  }
  return '0.10'
}
function normalizeRawDays(pid, duration) {
  const fromPid = parseTermRawFromPid(pid)
  if (fromPid) return fromPid
  const d = Number(duration)
  return Number.isFinite(d) ? Math.round(d) : 30
}
function mapDaysForUi(d) { return isYearish(d) ? 365 : d }
function annualize360(termPct, days) {
  if (!Number.isFinite(termPct) || !days) return null
  if (isYearish(days)) return termPct
  return termPct * (360 / days)
}

function buildProductId(days, contractStr) {
  const normalizedDays = isYearish(days) ? 360 : days
  const cleanContract = Number(contractStr)
  const cPart = Number.isFinite(cleanContract) ? cleanContract.toFixed(2) : '0.10'
  return `${PID_PREFIX}ltv-50_d-${normalizedDays}_c-${cPart}`
}

function buildRows(offers, contractStr) {
  const best = {}
  for (const o of offers || []) {
    const ltv = parseLtv(o.product_id)
    // ONLY 50% LTV here
    if (ltv !== 50) continue

    const contract = parseContractFromPid(o.product_id)
    if (contract !== contractStr) continue

    const rawDays = normalizeRawDays(o.product_id, o.duration)
    const uiDays  = mapDaysForUi(rawDays)
    if (!TARGET_TERMS.includes(uiDays)) continue

    best[uiDays] ??= {
      lend: { term:null, ear:null, id:null },
      borrow: { term:null, ear:null, id:null },
      pid: o.product_id,
    }

    const side = o.ini_role === 'borrow' ? 'lend' : o.ini_role === 'lend' ? 'borrow' : null
    if (!side) continue

    const ear = annualize360(o.interest, rawDays)
    if (side === 'lend') {
      if (best[uiDays].lend.term == null || o.interest > best[uiDays].lend.term) {
        best[uiDays].lend.term = o.interest
        best[uiDays].lend.ear  = ear
        best[uiDays].lend.id   = o.dlc_id
        best[uiDays].pid       = o.product_id
      }
    } else {
      if (best[uiDays].borrow.term == null || o.interest < best[uiDays].borrow.term) {
        best[uiDays].borrow.term = o.interest
        best[uiDays].borrow.ear  = ear
        best[uiDays].borrow.id   = o.dlc_id
        best[uiDays].pid         = best[uiDays].pid || o.product_id
      }
    }
  }

  return TARGET_TERMS.map(d => {
    const b = best[d] || { lend:{}, borrow:{}, pid: buildProductId(d, contractStr) }
    return {
      label: `${d} Days`,
      lendTerm: fmtPct2(b.lend.term),
      lendEar:  fmtPct2(b.lend.ear),
      borrowTerm: fmtPct2(b.borrow.term),
      borrowEar:  fmtPct2(b.borrow.ear),
      lendId: b.lend.id || null,
      borrowId: b.borrow.id || null,
      pid: b.pid || buildProductId(d, contractStr),
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

async function loadOnce() {
  if (fetching) return
  fetching = true
  try {
    const token = getToken()
    const res = token ? await getUserOffers('both', false) : await getOffers('both')
    const list = Array.isArray(res?.payload) ? res.payload : []
    const nextRows = buildRows(list, selectedContract.value)
    flashDiff(rows.value, nextRows)
    rows.value = nextRows
  } catch (e) {
    console.error('Rates50Mini: load failed', e)
  } finally {
    fetching = false
  }
}

function handleCellClick(row, side) {
  // rate to show in modal (term rate, not ear)
  selectedRate.value = side === 'lend' ? row.lendTerm : row.borrowTerm
  selectedAction.value = side === 'lend' ? 'Lend' : 'Borrow'
  selectedTermDays.value = getDaysFromLabel(row.label)
  selectedLtv.value = 50
  selectedOfferId.value = side === 'lend' ? row.lendId : row.borrowId
  modalNotice.value = { type: '', text: '' }
  showModal.value = true
}

async function handleOrderSubmit(data) {
  const type = (data.orderType || '').toLowerCase()
  modalNotice.value = { type: '', text: '' }

  // if not logged in, send to login
  if (!getToken()) {
    showModal.value = false
    router.push('/login')
    return
  }

  modalLoading.value = true

  // MARKET → accept the offer we have
  if (type === 'market') {
    if (!selectedOfferId.value) {
      modalLoading.value = false
      modalNotice.value = { type: 'error', text: 'Missing offer id' }
      return
    }
    try {
      await acceptOffer({ dlc_id: String(selectedOfferId.value) })
      modalNotice.value = { type: 'success', text: 'Market order accepted.' }
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || 'Accept failed.'
      modalNotice.value = { type: 'error', text: msg }
    } finally {
      modalLoading.value = false
    }
    return
  }

  // LIMIT → postOffer
  if (type === 'limit') {
    const interest = toNum(data.rate)
    if (!Number.isFinite(interest)) {
      modalLoading.value = false
      modalNotice.value = { type: 'error', text: 'Invalid rate.' }
      return
    }

    const days = Number(data.durationDays) || selectedTermDays.value
    const cntr = selectedContract.value
    const product_id = buildProductId(days, cntr)
    const tmp_cntr_id = genTmpCntrId()

    const params = {
      product_id,
      tmp_cntr_id,
      ini_role: String(data.action || '').toLowerCase(), // 'lend' or 'borrow'
      interest,
    }

    try {
      await postOffer(params)
      modalNotice.value = { type: 'success', text: 'Limit order posted.' }
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || 'Offer failed.'
      modalNotice.value = { type: 'error', text: msg }
    } finally {
      modalLoading.value = false
    }
  }
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

onMounted(async () => {
  await loadOnce()
  intervalId = setInterval(loadOnce, props.pollMs)
  window.addEventListener('focus', loadOnce)
  document.addEventListener('visibilitychange', onVisChange)
})
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  window.removeEventListener('focus', loadOnce)
  document.removeEventListener('visibilitychange', onVisChange)
})

function onVisChange() {
  if (!document.hidden) loadOnce()
}

// reload data when switching contract
watch(selectedContract, () => {
  loadOnce()
})
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

/* Table */
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

/* Cells */
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

/* Mobile */
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

/* Flash & hover */
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

/* custom dropdown */
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
.custom-dd-item {
  width: 100%;
  text-align: left;
  padding: 0.4rem 0.6rem;
  font-size: 0.82rem;
  color: rgba(255,255,255,.9);
  background: transparent;
  transition: background 120ms ease;
}
.custom-dd-item:hover {
  background: rgba(103,56,228,.14);
}
.custom-dd-item.active {
  background: rgba(103,56,228,.28);
  color: #fff;
  font-weight: 600;
}
</style>
