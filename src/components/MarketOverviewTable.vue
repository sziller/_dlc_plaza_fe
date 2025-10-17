<template>
  <section class="w-full h-full" :class="{ compact }">
    <div class="w-full h-full mx-auto">
      <div class="rounded-xl border border-secondary shadow-lg bg-dark p-6 h-full min-h-0 flex flex-col">
        <!-- Title -->
        <div class="text-3xl font-extrabold text-center mb-6 shrink-0 title-text">
          {{ title }}
        </div>

        <!-- Content Wrapper -->
        <div class="overflow-auto flex-1 min-h-0">
          <!-- ✅ Desktop/Tablet (unchanged structure; tighter sizing via CSS) -->
          <div class="hidden sm:block">
            <table class="w-full table-fixed border-separate border-spacing-y-4 border-spacing-x-2">
              <thead>
                <tr>
                  <th></th>
                  <th colspan="2" class="bg-secondary rounded-md text-white text-center px-4 py-4 align-middle font-bold text-lg">
                    {{ leftGroupLabel }}
                  </th>
                  <th class="spacer px-1"></th>
                  <th colspan="2" class="bg-secondary rounded-md text-white text-center px-4 py-4 align-middle font-bold text-lg">
                    {{ rightGroupLabel }}
                  </th>
                </tr>
                <tr class="text-white text-md">
                  <th class="px-4 py-4 text-left">Term</th>
                  <th class="px-4 py-4">
                    <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center min-w-[6rem]">
                      Lend
                    </div>
                  </th>
                  <th class="px-4 py-4">
                    <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center min-w-[6rem]">
                      Borrow
                    </div>
                  </th>
                  <th class="spacer px-1 py-4"></th>
                  <th class="px-4 py-4">
                    <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center min-w-[6rem]">
                      Lend
                    </div>
                  </th>
                  <th class="px-4 py-4">
                    <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center min-w-[6rem]">
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
                    class="px-4 py-4 text-center bg-white/10 rounded-md transition-transform transform hover:scale-105 cursor-pointer minw hover-glow"
                  >
                    <div>
                      <span
                        :class="flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''"
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

                  <!-- Right group cells -->
                  <td
                    v-for="(key) in rightKeys"
                    :key="key"
                    @click="handleCellClick(term, key)"
                    class="px-4 py-4 text-center bg-white/10 rounded-md transition-transform transform hover:scale-105 cursor-pointer minw hover-glow"
                  >
                    <div>
                      <span
                        :class="flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''"
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

          <!-- 📱 Mobile: stacked blocks (50% on top, 80% below) -->
          <div class="sm:hidden space-y-4">
            <div
              v-for="(term, index) in terms"
              :key="`m-${term.label}`"
              class="rounded-lg bg-white/5 p-3"
            >
              <!-- Term -->
              <div class="text-base font-semibold text-white mb-2">{{ term.label }}</div>

              <!-- 50% LTV block -->
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
                        :class="flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''"
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

              <!-- 80% LTV block -->
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
                        :class="flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''"
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
import { getOffers, getUserOffers } from '../api/offers'
import { postOffer } from '../api/postOffer'
import { acceptOffer } from '../api/acceptOffer'
import { getToken } from '../api/token'

const router = useRouter()

// dev-only logging (nothing leaks in prod)
function logDev(...args) {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      console.log(...args)
    }
  } catch {}
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
const selectedLtv = ref(80) // 50 or 80
const selectedOfferId = ref(null) // real offer id (dlc_id) for market accept
const modalLoading = ref(false)
const modalNotice  = ref({ type: '', text: '' }) // type: 'success' | 'error' | ''

function handleCellClick(row, key) {
  modalNotice.value = { type: '', text: '' }

  // NOTE: modal gets the *term* rate (not annualized)
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

  // ⬇️ Login gate right before hitting the API
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
      logDev('Offer accepted:', res)
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
  const product_id = buildProductId(days, ltv)
  const tmp_cntr_id = genTmpCntrId()

  const params = {
    product_id,
    tmp_cntr_id,
    ini_role: String(data.action || '').toLowerCase(),
    interest,
  }

  try {
    const res = await postOffer(params)
    logDev('Offer posted:', res)
    modalNotice.value = { type: 'success', text: 'Limit order posted' }
  } catch (e) {
    const msg = e?.response?.data?.detail || e?.message || 'Offer failed.'
    modalNotice.value = { type: 'error', text: msg }
  } finally {
    modalLoading.value = false
  }
}

// ===== Props (labels + polling controls) =====
const props = defineProps({
  title: { type: String, default: 'BTCUSD Market Overview' },
  leftGroupLabel: { type: String, default: '50% LTV' },
  rightGroupLabel: { type: String, default: '80% LTV' },
  leftKeys: { type: Array, default: () => ['ltv50a', 'ltv50b'] },
  rightKeys: { type: Array, default: () => ['ltv80a', 'ltv80b'] },
  offersPollMs: { type: Number, default: 5000 },
  changeFlashMs: { type: Number, default: 600 },
  compact: { type: Boolean, default: true }, // 👈 new
})

// ===== Table rows (built from API) =====
const terms = ref([
  { label: '30 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
  { label: '90 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
  { label: '180 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
  { label: '365 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*', ltv50pid: null, ltv80pid: null, ltv50aId:null, ltv50bId:null, ltv80aId:null, ltv80bId:null },
])

// ===== Year-consistency helpers =====
function isYearish(days) {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
function mapDaysForUi(d) { return isYearish(d) ? 365 : d }

// ===== Display helpers =====
function getEar(row, key) {
  const v = row[`${key}Ear`]
  return v ?? '*'
}

// ===== Offer → table transform =====
const TARGET_TERMS = [30, 90, 180, 365]
function parseLtv(pid) { const m = String(pid || '').match(/ltv-(\d{1,3})/i); return m ? Number(m[1]) : null }

// raw 'd-xxx' from product_id without mapping to 365
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

// Format helpers
const fmtPct2 = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '*')

// === Annualized calculation (replace API ear):
// We *ignore* API-provided interest_ear and compute our own annualized figure.
// Convention: simple annualization on a 360-day basis (no compounding).
// For any ~1-year term (360–366), display the term rate itself.
function annualize360(termPct, days) {
  if (!Number.isFinite(termPct) || !days) return null
  if (isYearish(days)) return termPct
  return termPct * (360 / days)
}

function buildTermsFromOffers(offers) {
  const best = {}
  for (const o of offers || []) {
    const ltv = parseLtv(o.product_id)
    const rawDays = normalizeRawDays(o.product_id, o.duration)
    const uiDays  = normalizeDisplayDays(o.product_id, o.duration)
    if (!ltv || !rawDays || !uiDays) continue

    best[uiDays] ??= {}
    best[uiDays][ltv] ??= {
      lend: { term: null, ear: null, id: null },
      borrow: { term: null, ear: null, id: null },
      pid: null
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
    const nextTerms = buildTermsFromOffers(res.payload) // <-- annualized computed locally
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
const PID_PREFIX = 'LendBorrowBTCUSD:'
function buildProductId(days, ltv) {
  // Always encode ~1-year terms as 360 for the BE, while *displaying* 365 in the UI
  const normalizedDays = isYearish(days) ? 360 : days
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
/** cryptographically-strong tmp id (CSP-safe) */
function genTmpCntrId() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

defineExpose({ loadOffersOnce, getEar })
</script>

<style scoped>
/* ===== Animations ===== */
.flash-text {
  animation: flashPop 0.18s ease-in-out;
}
@keyframes flashPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.07); }
  100% { transform: scale(1); }
}

/* ===== Small-screen fallback for desktop table (if ever rendered) ===== */
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

/* ===== Spacer (narrow but visible) ===== */
.spacer {
  width: 0.5rem;         /* narrow separator */
  min-width: 0.5rem;
  max-width: 0.5rem;
  padding-left: 0.25rem; /* tailwind px-1 */
  padding-right: 0.25rem;
}

/* ===== Compact Mode (in-between sizing) ===== */
.compact .rounded-xl { padding: 1rem; } /* was 0.75rem */
.compact .title-text { font-size: 1.75rem; margin-bottom: 1rem; } /* was 1.5/0.75 */

/* Desktop table tightening */
.compact table { border-spacing: 0.25rem 0.625rem !important; } /* horizontal smaller, vertical same */
.compact thead th { padding: 0.45rem 0.6rem !important; font-size: 0.95rem; } /* was 0.35/0.5/0.9 */
.compact tbody td { padding: 0.6rem !important; } /* was 0.5rem */

/* Group chips ("Lend"/"Borrow") + group headers */
.compact thead .bg-secondary { padding: 0.5rem 0.75rem !important; font-size: 1rem; }
.compact thead .font-semibold { font-size: 0.9rem; }

/* Rates */
.compact .rate { font-size: 1.6rem; line-height: 1.15; }
@media (min-width: 640px) {
  .compact .rate { font-size: 1.75rem; }
}

/* Hint lines under rates (avoid invalid identifiers like .text-[10px]) */
.compact [class*="text-[10px]"] { font-size: 10px !important; }
.compact .text-xs,
.compact [class*="text-[11px]"] { font-size: 11px !important; }

/* Min width for cells/buttons */
.minw { min-width: 6rem; }
.compact .minw { min-width: 5rem; }

/* Mobile card tightening — roomier than ultra-compact */
@media (max-width: 640px) {
  .compact .p-3 { padding: 0.625rem !important; }
  .compact .mb-3 { margin-bottom: 0.625rem !important; }
  .compact .grid { gap: 0.5rem !important; }
  .compact .px-3.py-3 { padding: 0.625rem !important; }
}

/* ==== Natural edge glow (no circle, no rectangle bleed) ==== */
.hover-glow {
  position: relative;
  isolation: isolate;
  outline: none;
  /* base surface stays quiet */
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
}

/* ring that follows the shape exactly, blurred for glow */
.hover-glow::before {
  content: "";
  position: absolute;
  inset: 0;                      /* match element bounds */
  border-radius: inherit;        /* respect rounded corners */
  pointer-events: none;

  /* theme knobs */
  --secondary: #6738e4;          /* swap to your CSS var if you have one */
  --ring: 5px;                  /* ring thickness */
  --blur: 16px;                  /* softness */
  --alpha: 0;                    /* start hidden */

  /* solid color, then we cut out the middle with mask below */
  background: color-mix(in oklch, var(--secondary), white 10%);

  /* Mask trick: keep only a thin band near the edges (no circles) */
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
          mask-composite: exclude;

  /* The content box is the inner edge of the ring */
  padding: var(--ring);

  /* soften + subtle scale to sit “behind” */
  filter: blur(var(--blur));
  opacity: var(--alpha);
  transform: scale(0.995);

  transition:
    opacity 180ms ease,
    filter 180ms ease,
    transform 180ms ease;
}

/* Hover / focus: reveal the ring */
.hover-glow:hover::before,
.hover-glow:focus-visible::before {
  --alpha: 0.85;
  --blur: 18px;
  transform: scale(1);
}

/* A touch of depth: faint inner rim + outer drop (kept subtle) */
.hover-glow:hover,
.hover-glow:focus-visible {
  box-shadow:
    inset 0 0 0 1px color-mix(in oklch, var(--secondary), white 25%),
    inset 0 0 24px color-mix(in oklch, var(--secondary), black 70% / 18%),
    0 10px 26px -14px color-mix(in oklch, var(--secondary), black 20%);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hover-glow::before {
    transition: opacity 120ms linear;
  }
}

</style>
