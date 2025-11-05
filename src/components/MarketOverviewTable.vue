<!-- MarketOverview.vue -->
<template>
  <section class="w-full h-full" :class="{ compact }">
    <div class="w-full h-full mx-auto">
      <div
        class="rounded-xl border border-secondary shadow-lg bg-dark p-6 h-full min-h-0 flex flex-col"
        :style="{ '--secondary': currentAccent }"
      >
        <!-- Title + dropdown -->
        <div class="flex items-center justify-between gap-3 mb-6 shrink-0">
          <div class="text-3xl font-extrabold text-center sm:text-left title-text flex-1">
            {{ title }}
          </div>

          <!-- custom dropdown (contract size) -->
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
        </div>

        <!-- Content Wrapper -->
        <div class="overflow-auto flex-1 min-h-0">
          <!-- ✅ Desktop/Tablet -->
          <div class="hidden sm:block">
            <table class="w-full table-fixed border-separate border-spacing-y-4 border-spacing-x-2">
              <thead>
                <tr>
                  <th></th>
                  <th
                    colspan="2"
                    class="group-header rounded-md text-white text-center px-4 py-4 align-middle font-bold text-lg"
                  >
                    {{ leftGroupLabel }}
                  </th>
                  <th class="spacer px-1"></th>
                  <th
                    colspan="2"
                    class="group-header rounded-md text-white text-center px-4 py-4 align-middle font-bold text-lg"
                  >
                    {{ rightGroupLabel }}
                  </th>
                </tr>
                <tr class="text-white text-md">
                  <th class="px-4 py-4 text-left">Term</th>
                  <th class="px-4 py-4">
                    <div class="chip w-full text-center min-w-[6rem]">
                      Lend
                    </div>
                  </th>
                  <th class="px-4 py-4">
                    <div class="chip w-full text-center min-w-[6rem]">
                      Borrow
                    </div>
                  </th>
                  <th class="spacer px-1 py-4"></th>
                  <th class="px-4 py-4">
                    <div class="chip w-full text-center min-w-[6rem]">
                      Lend
                    </div>
                  </th>
                  <th class="px-4 py-4">
                    <div class="chip w-full text-center min-w-[6rem]">
                      Borrow
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody class="text-white/90 text-lg">
                <tr
                  v-for="(term, index) in terms"
                  :key="term.label"
                  class="transition duration-200"
                >
                  <td class="px-4 py-4 text-left font-semibold">
                    {{ term.label }}
                  </td>

                  <!-- Left group cells (50% LTV) -->
                  <td
                    v-for="(key) in leftKeys"
                    :key="key"
                    @click="handleCellClick(term, key)"
                    class="px-4 py-4 text-center bg-white/10 rounded-md transition-transform transform hover:scale-105 cursor-pointer minw hover-glow"
                  >
                    <div>
                      <span
                        :class="[
                          flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''
                        ]"
                        class="text-3xl font-bold leading-tight rate"
                      >
                        {{ getEar(term, key) }}
                      </span>

                      <template v-if="term.label !== '365 Days'">
                        <div class="text-[10px] text-white/70 -mt-1">
                          Annualized yield
                        </div>
                        <div class="text-xs text-white/90 mt-1">
                          {{ term[key] }} for {{ term.label }}
                        </div>
                      </template>
                    </div>
                  </td>

                  <td class="px-1 spacer"></td>

                  <!-- Right group cells (80% LTV) -->
                  <td
                    v-for="(key) in rightKeys"
                    :key="key"
                    @click="handleCellClick(term, key)"
                    class="px-4 py-4 text-center bg-white/10 rounded-md transition-transform transform hover:scale-105 cursor-pointer minw hover-glow"
                  >
                    <div>
                      <span
                        :class="[
                          flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''
                        ]"
                        class="text-3xl font-bold leading-tight rate"
                      >
                        {{ getEar(term, key) }}
                      </span>

                      <template v-if="term.label !== '365 Days'">
                        <div class="text-[10px] text-white/70 -mt-1">
                          Annualized yield
                        </div>
                        <div class="text-xs text-white/90 mt-1">
                          {{ term[key] }} for {{ term.label }}
                        </div>
                      </template>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 📱 Mobile -->
          <div class="sm:hidden space-y-4">
            <div
              v-for="(term, index) in terms"
              :key="`m-${term.label}`"
              class="rounded-lg bg-white/5 p-3"
            >
              <div class="text-base font-semibold text-white mb-2">
                {{ term.label }}
              </div>

              <!-- 50% LTV -->
              <div class="rounded-md bg-white/5 p-3 mb-3">
                <div class="text-[11px] tracking-wide uppercase text-white/70 mb-2 font-semibold">
                  {{ leftGroupLabel }}
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="key in leftKeys"
                    :key="`m-${term.label}-${key}`"
                    type="button"
                    @click="handleCellClick(term, key)"
                    class="px-3 py-3 text-center bg-white/10 rounded-md transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer minw hover-glow"
                  >
                    <div class="space-y-1">
                      <div class="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                        {{ key.includes('a') ? 'Lend' : 'Borrow' }}
                      </div>
                      <span
                        :class="[
                          flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''
                        ]"
                        class="text-2xl font-bold leading-tight rate"
                      >
                        {{ getEar(term, key) }}
                      </span>
                      <template v-if="term.label !== '365 Days'">
                        <div class="text-[10px] text-white/70 -mt-0.5">
                          Annualized yield
                        </div>
                        <div class="text-[11px] text-white/90 mt-0.5">
                          {{ term[key] }} for {{ term.label }}
                        </div>
                      </template>
                    </div>
                  </button>
                </div>
              </div>

              <!-- 80% LTV -->
              <div class="rounded-md bg-white/5 p-3">
                <div class="text-[11px] tracking-wide uppercase text-white/70 mb-2 font-semibold">
                  {{ rightGroupLabel }}
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="key in rightKeys"
                    :key="`m-${term.label}-${key}`"
                    type="button"
                    @click="handleCellClick(term, key)"
                    class="px-3 py-3 text-center bg-white/10 rounded-md transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer minw hover-glow"
                  >
                    <div class="space-y-1">
                      <div class="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                        {{ key.includes('a') ? 'Lend' : 'Borrow' }}
                      </div>
                      <span
                        :class="[
                          flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''
                        ]"
                        class="text-2xl font-bold leading-tight rate"
                      >
                        {{ getEar(term, key) }}
                      </span>
                      <template v-if="term.label !== '365 Days'">
                        <div class="text-[10px] text-white/70 -mt-0.5">
                          Annualized yield
                        </div>
                        <div class="text-[11px] text-white/90 mt-0.5">
                          {{ term[key] }} for {{ term.label }}
                        </div>
                      </template>
                    </div>
                  </button>
                </div>
              </div>
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
            @close="showModal = false"
            @submit="handleOrderSubmit"
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

const router = useRouter()

// Detect staging via envs or hostname
const IS_STAGING = (() => {
  const host = (typeof location !== 'undefined' ? location.hostname : '').toLowerCase()

  // prod if cadenabitcoin.com (or www.) but NOT staging.cadenabitcoin.com
  const IS_PROD =
    /^(?:www\.)?cadenabitcoin\.com$/.test(host) &&
    host !== 'staging.cadenabitcoin.com'

  return !IS_PROD
})()

const CONTRACT_ACCENTS = {
  '0.01':  '#000000',
  '0.10':  '#6738e4',
  '1.00':  '#8387c4',
  '0.001': '#6738e4', // staging-only: use secondary
}

// Staging-gated contract options
const contractOptions = computed(() => {
  const base = [
    { value: '1.00',  label: '1.00 BTC' },
    { value: '0.10',  label: '0.10 BTC' },
    { value: '0.01',  label: '0.01 BTC' },
  ]
  if (IS_STAGING) base.push({ value: '0.001', label: '0.001 BTC' })
  return base
})

const props = defineProps({
  title: { type: String, default: 'BTCUSD Market Overview' },
  leftGroupLabel: { type: String, default: '50% LTV' },
  rightGroupLabel: { type: String, default: '80% LTV' },
  leftKeys: { type: Array, default: () => ['ltv50a', 'ltv50b'] },
  rightKeys: { type: Array, default: () => ['ltv80a', 'ltv80b'] },
  offersPollMs: { type: Number, default: 5000 },
  changeFlashMs: { type: Number, default: 600 },
  compact: { type: Boolean, default: true },
})

const selectedContract = ref('0.10')
const dropdownOpen = ref(false)
const displayContractLabel = computed(() =>
  (contractOptions.value.find(o => o.value === selectedContract.value)?.label) || '0.10 BTC'
)
const currentAccent = computed(() =>
  CONTRACT_ACCENTS[selectedContract.value] || '#6738e4'
)

function toggleDropdown() { dropdownOpen.value = !dropdownOpen.value }
function selectContract(v) {
  selectedContract.value = v
  dropdownOpen.value = false
  loadOffersOnce()
}

// ===== Auth state =====
const isLoggedIn = ref(false)
function updateAuthState() {
  isLoggedIn.value = !!getToken()
}

// ===== Modal state =====
const showModal = ref(false)
const selectedRate = ref('')
const selectedAction = ref('Lend')
const selectedTermDays = ref(30)
const selectedLtv = ref(80)
const selectedOfferId = ref(null)
const modalLoading = ref(false)
const modalNotice  = ref({ type: '', text: '' })

function handleCellClick(row, key) {
  modalNotice.value = { type: '', text: '' }

  selectedRate.value = row[key]
  selectedAction.value = key.includes('a') ? 'Lend' : 'Borrow'
  selectedTermDays.value = getDaysFromLabel(row.label)
  selectedLtv.value = key.startsWith('ltv50') ? 50 : 80

  const idKey = `${key}Id`
  selectedOfferId.value = row[idKey] || null

  showModal.value = true
}

async function handleOrderSubmit(data) {
  const type = (data.orderType || '').toLowerCase()
  modalNotice.value = { type: '', text: '' }

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
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || 'Accept failed.'
      modalNotice.value = { type: 'error', text: msg }
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
  const ltv = selectedLtv.value || 80
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
  } catch (e) {
    const msg = e?.response?.data?.detail || e?.message || 'Offer failed.'
    modalNotice.value = { type: 'error', text: msg }
  } finally {
    modalLoading.value = false
  }
}

// ===== Table rows =====
const terms = ref([
  { label: '30 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
  { label: '90 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
  { label: '180 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
  { label: '365 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
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
    const l80 = row[80] || { lend:{term:null,ear:null,id:null}, borrow:{term:null,ear:null,id:null}, pid:null }
    return {
      label: `${d} Days`,
      ltv50a: fmtPct2(l50.lend.term),   ltv50aEar: fmtPct2(l50.lend.ear),
      ltv50b: fmtPct2(l50.borrow.term), ltv50bEar: fmtPct2(l50.borrow.ear),
      ltv80a: fmtPct2(l80.lend.term),   ltv80aEar: fmtPct2(l80.lend.ear),
      ltv80b: fmtPct2(l80.borrow.term), ltv80bEar: fmtPct2(l80.borrow.ear),
      ltv50pid: l50.pid, ltv80pid: l80.pid,
      ltv50aId: l50.lend.id, ltv50bId: l50.borrow.id,
      ltv80aId: l80.lend.id, ltv80bId: l80.borrow.id,
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
  const keys = ['ltv50a', 'ltv50b', 'ltv80a', 'ltv80b']
  for (let i = 0; i < newRows.length; i++) {
    for (const base of keys) {
      const earKey = `${base}Ear`
      const prev = oldRows?.[i]?.[earKey]
      const next = newRows?.[i]?.[earKey]
      if (prev !== next) markFlashOnce(`${i}-${base}`)
    }
  }
}

async function loadOffersOnce() {
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

// ===== Lifecycle =====
onMounted(async () => {
  updateAuthState()
  window.addEventListener('auth-changed', updateAuthState)
  window.addEventListener('storage', updateAuthState)
  window.addEventListener('focus', updateAuthState)

  document.addEventListener('visibilitychange', onVisChange)
  window.addEventListener('focus', loadOffersOnce)

  await loadOffersOnce()
  offersIntervalId = setInterval(loadOffersOnce, props.offersPollMs)
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', updateAuthState)
  window.removeEventListener('storage', updateAuthState)
  window.removeEventListener('focus', updateAuthState)

  document.removeEventListener('visibilitychange', onVisChange)
  window.removeEventListener('focus', loadOffersOnce)

  if (offersIntervalId) clearInterval(offersIntervalId)
  flashActive.value = new Set()
})

// ===== Local helpers =====
function buildProductId(days, ltv, contractStr) {
  const normalizedDays = isYearish(days) ? 360 : days
  const cleanContract = Number(contractStr)
  const decimals = (Number.isFinite(cleanContract) && cleanContract < 0.01) ? 3 : 2
  const cPart = Number.isFinite(cleanContract) ? cleanContract.toFixed(decimals) : '0.10'
  return `${PID_PREFIX}ltv-${ltv}_d-${normalizedDays}_c-${cPart}`
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
.compact .title-text { font-size: 1.75rem; margin-bottom: 1rem; }

.compact table { border-spacing: 0.25rem 0.625rem !important; }
.compact thead th { padding: 0.45rem 0.6rem !important; font-size: 0.95rem; }
.compact tbody td { padding: 0.6rem !important; }

.compact thead .group-header { padding: 0.5rem 0.75rem !important; font-size: 1rem; }
.compact thead .font-semibold { font-size: 0.9rem; }

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

/* dropdown */
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
