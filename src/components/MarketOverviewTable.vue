<template>
  <section class="w-full h-full">
    <div class="w-full h-full mx-auto">
      <div class="rounded-xl border border-secondary shadow-lg bg-dark p-6 h-full min-h-0 flex flex-col">
        <!-- Title -->
        <div class="text-3xl font-extrabold text-center mb-6 shrink-0">
          {{ title }}
        </div>

        <!-- Table Wrapper -->
        <div class="overflow-auto flex-1 min-h-0">
          <table class="w-full table-fixed border-separate border-spacing-y-4 border-spacing-x-6">
            <thead>
              <tr>
                <th></th>
                <th colspan="2" class="bg-secondary rounded-md text-white text-center px-4 py-4 align-middle font-bold text-lg">
                  {{ leftGroupLabel }}
                </th>
                <th class="spacer px-4"></th>
                <th colspan="2" class="bg-secondary rounded-md text-white text-center px-4 py-4 align-middle font-bold text-lg">
                  {{ rightGroupLabel }}
                </th>
              </tr>
              <tr class="text-white text-md">
                <th class="px-4 py-4 text-left">Term</th>
                <th class="px-4 py-4">
                  <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center" style="min-width: 6rem;">
                    Lend
                  </div>
                </th>
                <th class="px-4 py-4">
                  <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center" style="min-width: 6rem;">
                    Borrow
                  </div>
                </th>
                <th class="spacer px-4 py-4"></th>
                <th class="px-4 py-4">
                  <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center" style="min-width: 6rem;">
                    Lend
                  </div>
                </th>
                <th class="px-4 py-4">
                  <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center" style="min-width: 6rem;">
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
                <td class="px-4 py-4 text-left font-semibold">{{ term.label }}</td>

                <!-- Left group cells -->
                <td
                  v-for="(key) in leftKeys"
                  :key="key"
                  @click="handleCellClick(term, key)"
                  class="px-4 py-4 text-center bg-white/10 rounded-md transition-transform transform hover:scale-105 cursor-pointer"
                  style="min-width: 6rem;"
                >
                  <div>
                    <span
                      :class="flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''"
                      class="text-3xl font-bold leading-tight"
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

                <td class="px-4 spacer"></td>

                <!-- Right group cells -->
                <td
                  v-for="(key) in rightKeys"
                  :key="key"
                  @click="handleCellClick(term, key)"
                  class="px-4 py-4 text-center bg-white/10 rounded-md transition-transform transform hover:scale-105 cursor-pointer"
                  style="min-width: 6rem;"
                >
                  <div>
                    <span
                      :class="flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''"
                      class="text-3xl font-bold leading-tight"
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

          <OrderModal
            v-if="showModal"
            :rate="selectedRate"
            :action-type="selectedAction"
            :term-days="selectedTermDays"
            @close="showModal = false"
            @submit="handleOrderSubmit"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import OrderModal from './OrderModal.vue'
import { getOffers } from '../api/offers'
import { postOffer } from '../api/postOffer'
import { acceptOffer } from '../api/acceptOffer'
import { getToken } from '../api/token'

const router = useRouter()

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
const selectedLtv = ref(80) // 50 or 80
const selectedOfferId = ref(null) // real offer id (dlc_id) for market accept

function handleCellClick(row, key) {
  if (!isLoggedIn.value) { router.push('/login'); return }

  selectedRate.value = row[key]
  selectedAction.value = key.includes('a') ? 'Lend' : 'Borrow'
  selectedTermDays.value = getDaysFromLabel(row.label)
  selectedLtv.value = key.startsWith('ltv50') ? 50 : 80

  // map "ltv50a" -> "ltv50aId" etc.
  const idKey = `${key}Id`
  selectedOfferId.value = row[idKey] || null

  showModal.value = true
}

function handleOrderSubmit(data) {
  const type = (data.orderType || '').toLowerCase()

  // MARKET: accept existing best offer by id
  if (type === 'market') {
    if (!selectedOfferId.value) { alert('Missing offer id'); return }
    ;(async () => {
      try {
        const res = await acceptOffer({ dlc_id: String(selectedOfferId.value) })
        console.log('Offer accepted:', res)
        alert('Market order accepted')
      } catch (e) {
        alert(e?.message || 'Accept failed')
      }
    })()
    return
  }

  // LIMIT: post a new offer
  if (type !== 'limit') return
  const interest = toNum(data.rate)
  if (!Number.isFinite(interest)) { alert('Invalid rate'); return }

  const days = Number(data.durationDays) || getDaysFromLabel(data.duration)
  const ltv = selectedLtv.value || 80
  const product_id = buildProductId(days, ltv)
  const tmp_cntr_id = genTmpCntrId()

  const params = {
    product_id,
    tmp_cntr_id,
    ini_role: String(data.action || '').toLowerCase(),
    interest,
  }

  ;(async () => {
    try {
      const res = await postOffer(params)
      console.log('Offer posted:', res)
      alert('Limit offer posted')
    } catch (e) {
      alert(e?.message || 'Offer failed')
    }
  })()
}

// ===== Props (labels + polling controls) =====
const props = defineProps({
  title: { type: String, default: 'BTCUSD Market Overview' },
  leftGroupLabel: { type: String, default: '50% LTV' },
  rightGroupLabel: { type: String, default: '80% LTV' },
  leftKeys: { type: Array, default: () => ['ltv50a', 'ltv50b'] },
  rightKeys: { type: Array, default: () => ['ltv80a', 'ltv80b'] },
  // polling and flash tuning
  offersPollMs: { type: Number, default: 30000 },     // fetch every 30s
  changeFlashMs: { type: Number, default: 600 },      // flash duration per change
})

// ===== Table rows (built from API) =====
const terms = ref([
  { label: '30 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
  { label: '90 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
  { label: '180 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
  { label: '365 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
])

// ===== Display helpers =====
function getEar(row, key) {
  const v = row[`${key}Ear`]
  return v ?? '*'
}

// ===== Offer → table transform =====
const TARGET_TERMS = [30, 90, 180, 365]

// backend uses 360, UI uses 365
function mapDaysForUi(d) {
  return d === 360 ? 365 : d
}
function parseLtv(pid) {
  const m = String(pid || '').match(/ltv-(\d{1,3})/i)
  return m ? Number(m[1]) : null
}
function parseTermFromPid(pid) {
  const m = String(pid || '').match(/d-(\d+(\.\d+)?)/i)
  if (!m) return null
  const raw = Math.round(Number(m[1]))
  return mapDaysForUi(raw)
}
function normalizeTerm(pid, duration) {
  const fromPid = parseTermFromPid(pid)
  if (fromPid) return fromPid
  const d = Number(duration)
  return Number.isFinite(d) ? mapDaysForUi(Math.round(d)) : 30
}
const fmtPct2 = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '*')
function calcEarFallback(termPct, days) {
  if (!Number.isFinite(termPct) || !days) return null
  const r = termPct / 100
  return (Math.pow(1 + r, 360 / days) - 1) * 100
}

function buildTermsFromOffers(offers) {
  const best = {}

  for (const o of offers || []) {
    const ltv = parseLtv(o.product_id)
    const term = normalizeTerm(o.product_id, o.duration)
    if (!ltv || !term) continue

    best[term] ??= {}
    best[term][ltv] ??= {
      lend: { term: null, ear: null, id: null },
      borrow: { term: null, ear: null, id: null },
      pid: null
    }

    const side = o.ini_role === 'borrow' ? 'lend' : o.ini_role === 'lend' ? 'borrow' : null
    if (!side) continue

    const earVal = Number.isFinite(o.interest_ear) && o.interest_ear > 0
      ? o.interest_ear
      : calcEarFallback(o.interest, term)

    if (side === 'lend') {
      if (best[term][ltv].lend.term == null || o.interest > best[term][ltv].lend.term) {
        best[term][ltv].lend.term = o.interest
        best[term][ltv].lend.ear  = earVal ?? null
        best[term][ltv].lend.id   = o.dlc_id
        best[term][ltv].pid       = o.product_id
      }
    } else {
      if (best[term][ltv].borrow.term == null || o.interest < best[term][ltv].borrow.term) {
        best[term][ltv].borrow.term = o.interest
        best[term][ltv].borrow.ear  = earVal ?? null
        best[term][ltv].borrow.id   = o.dlc_id
        best[term][ltv].pid         = best[term][ltv].pid || o.product_id
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

// ===== Polling + diff flashing =====
const flashActive = ref(new Set())
let offersIntervalId = null
let isFetchingOffers = false

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
  const keys = ['ltv50a', 'ltv50b', 'ltv80a', 'ltv80b'] // base keys
  for (let i = 0; i < newRows.length; i++) {
    for (const base of keys) {
      const earKey = `${base}Ear`
      const prev = oldRows?.[i]?.[earKey]
      const next = newRows?.[i]?.[earKey]
      // trigger on any actual change
      if (prev !== next) {
        markFlashOnce(`${i}-${base}`)
      }
    }
  }
}

async function loadOffersOnce() {
  if (isFetchingOffers) return
  isFetchingOffers = true
  try {
    const res = await getOffers('both')
    if (!res || !Array.isArray(res.payload)) throw new Error('Bad payload')
    const nextTerms = buildTermsFromOffers(res.payload)
    diffAndFlash(terms.value, nextTerms)
    terms.value = nextTerms
  } catch (e) {
    console.error('Failed to load offers:', e)
  } finally {
    isFetchingOffers = false
  }
}

function onVisChange() {
  if (!document.hidden) {
    loadOffersOnce() // fast refresh on focus/visibility return
  }
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
const PID_PREFIX = 'LendBorrowBTCUSD:'
function buildProductId(days, ltv) {
  // UI 365 posts as backend 360
  const normalizedDays = days === 365 ? 360 : days
  return `${PID_PREFIX}ltv-${ltv}_d-${normalizedDays}`
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
  return ``
}

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
  .left-group-header,
  .right-group-header {
    display: table-cell !important;
    font-size: 0.75rem;
    white-space: nowrap;
  }
  .spacer {
    display: none !important;
  }
  .-mt-1 {
    margin-top: -0.25rem;
  }
}
</style>
