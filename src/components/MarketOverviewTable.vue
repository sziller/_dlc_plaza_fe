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
                  @click="handleCellClick(term[key], key)"
                  class="px-4 py-4 text-center bg-white/10 rounded-md transition-transform transform hover:scale-105 cursor-pointer"
                  style="min-width: 6rem;"
                >
                  <div>
                    <!-- BIG number = Annualized EAR from API -->
                    <span
                      :class="flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''"
                      class="text-3xl font-bold leading-tight"
                    >
                      {{ getEar(term, key) }}
                    </span>

                    <!-- Sub-lines: term yield for the term -->
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
                  @click="handleCellClick(term[key], key)"
                  class="px-4 py-4 text-center bg-white/10 rounded-md transition-transform transform hover:scale-105 cursor-pointer"
                  style="min-width: 6rem;"
                >
                  <div>
                    <!-- BIG number = Annualized EAR from API -->
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
            @close="showModal = false"
            @submit="handleOrderSubmit"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import OrderModal from './OrderModal.vue'
import { getOffers } from '../api/offers'

// ===== Modal state =====
const showModal = ref(false)
const selectedRate = ref('')
const selectedAction = ref('Lend')

function handleCellClick(rate, key) {
  selectedRate.value = rate
  selectedAction.value = key.includes('a') ? 'Lend' : 'Borrow'
  showModal.value = true
}
function handleOrderSubmit(data) {
  console.log('Order submitted:', data)
}

// ===== Props (labels + flashing controls) =====
const props = defineProps({
  title: { type: String, default: 'BTCUSD Market Overview' },
  leftGroupLabel: { type: String, default: '50% LTV' },
  rightGroupLabel: { type: String, default: '80% LTV' },
  leftKeys: { type: Array, default: () => ['ltv50a', 'ltv50b'] },  // a=Lend, b=Borrow
  rightKeys: { type: Array, default: () => ['ltv80a', 'ltv80b'] },
  initialDelayMs: { type: Number, default: 1000 },
  intervalMs: { type: Number, default: 30000 },
  flashProbability: { type: Number, default: 0.25 },
  flashes: { type: Number, default: 3 },
  perStateMs: { type: Number, default: 180 },
})

// ===== Table rows (built from API) =====
const terms = ref([
  { label: '30 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*' },
  { label: '90 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*' },
  { label: '180 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*' },
  { label: '365 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv80a: '*', ltv80aEar: '*', ltv80b: '*', ltv80bEar: '*' },
])

// ===== Display helpers =====
function getEar(row, key) {
  const v = row[`${key}Ear`]
  return v ?? '*'
}

// ===== Offer → table transform =====
const DEFAULT_LTV = 80
const DEFAULT_TERM = 30
const TARGET_TERMS = [30, 90, 180, 365]

function parseLtv(pid) {
  const m = String(pid || '').match(/ltv-(\d{1,3})/i)
  return m ? Number(m[1]) : DEFAULT_LTV
}
function parseTermFromPid(pid) {
  const m = String(pid || '').match(/d-(\d+(\.\d+)?)/i)
  return m ? Math.round(Number(m[1])) : null
}
function normalizeTerm(pid, duration) {
  const fromPid = parseTermFromPid(pid)
  if (fromPid != null) return fromPid
  const d = Number(duration)
  if (Number.isFinite(d) && d >= 1) return Math.round(d)
  return DEFAULT_TERM // treat missing/instant as 30d bucket
}
const fmtPct2 = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '*')
function calcEarFallback(termPct, days) {
  if (!Number.isFinite(termPct) || !days) return null
  const r = termPct / 100
  return (Math.pow(1 + r, 360 / days) - 1) * 100
}

function buildTermsFromOffers(offers) {
  // best[term][ltv] = { lend: {term:number|null, ear:number|null}, borrow:{term:number|null, ear:number|null} }
  const best = {}

  for (const o of offers || []) {
    const ltv = parseLtv(o.product_id)
    const term = normalizeTerm(o.product_id, o.duration)
    best[term] ??= {}
    best[term][ltv] ??= { lend: { term: null, ear: null }, borrow: { term: null, ear: null } }

    // Invert sides: borrower offer shows in LEND column; lender offer shows in BORROW column
    const side = o.ini_role === 'borrow' ? 'lend' : o.ini_role === 'lend' ? 'borrow' : null
    if (!side) continue

    const earVal = Number.isFinite(o.interest_ear) && o.interest_ear > 0
      ? o.interest_ear
      : calcEarFallback(o.interest, term)

    if (side === 'lend') {
      // Lenders want the HIGHEST term rate
      if (best[term][ltv].lend.term == null || o.interest > best[term][ltv].lend.term) {
        best[term][ltv].lend.term = o.interest
        best[term][ltv].lend.ear = earVal ?? null
      }
    } else {
      // Borrowers want the LOWEST term rate
      if (best[term][ltv].borrow.term == null || o.interest < best[term][ltv].borrow.term) {
        best[term][ltv].borrow.term = o.interest
        best[term][ltv].borrow.ear = earVal ?? null
      }
    }
  }

  return TARGET_TERMS.map((d) => {
    const row = best[d] || {}
    const l50 = row[50] || { lend: {term:null,ear:null}, borrow: {term:null,ear:null} }
    const l80 = row[80] || { lend: {term:null,ear:null}, borrow: {term:null,ear:null} }
    return {
      label: `${d} Days`,
      // 50% LTV
      ltv50a: fmtPct2(l50.lend.term),   // Lend term rate, 2dp
      ltv50aEar: fmtPct2(l50.lend.ear), // Lend EAR, 2dp
      ltv50b: fmtPct2(l50.borrow.term),   // Borrow term rate, 2dp
      ltv50bEar: fmtPct2(l50.borrow.ear), // Borrow EAR, 2dp
      // 80% LTV
      ltv80a: fmtPct2(l80.lend.term),
      ltv80aEar: fmtPct2(l80.lend.ear),
      ltv80b: fmtPct2(l80.borrow.term),
      ltv80bEar: fmtPct2(l80.borrow.ear),
    }
  })
}

// ===== Load offers =====
async function load() {
  try {
    const res = await getOffers('both')
    if (!res || !Array.isArray(res.payload)) throw new Error('Bad payload')
    terms.value = buildTermsFromOffers(res.payload)
  } catch (e) {
    console.error('Failed to load offers:', e)
  }
}

// ===== Flashing =====
const flashActive = ref(new Set())
let intervalHandle = null
let initialTimer = null

function pickRandomCells () {
  const picks = []
  for (let i = 0; i < terms.value.length; i++) {
    const candidates = [props.leftKeys[0], props.leftKeys[1], props.rightKeys[0], props.rightKeys[1]]
    candidates.forEach((key) => {
      if (Math.random() < props.flashProbability) picks.push(`${i}-${key}`)
    })
  }
  if (picks.length === 0 && terms.value.length > 0) {
    picks.push(`0-${props.leftKeys[0]}`)
  }
  return picks
}
function tripleFlash () {
  const targets = pickRandomCells()
  const periods = props.flashes * 2
  const interval = props.perStateMs
  for (let k = 0; k <= periods; k++) {
    setTimeout(() => {
      const next = new Set(flashActive.value)
      targets.forEach((id) => next.has(id) ? next.delete(id) : next.add(id))
      flashActive.value = next
    }, k * interval)
  }
  setTimeout(() => { flashActive.value = new Set() }, (periods + 1) * interval)
}
function startFlashing () {
  stopFlashing()
  initialTimer = setTimeout(tripleFlash, props.initialDelayMs)
  intervalHandle = setInterval(tripleFlash, props.intervalMs)
}
function stopFlashing () {
  if (initialTimer) { clearTimeout(initialTimer); initialTimer = null }
  if (intervalHandle) { clearInterval(intervalHandle); intervalHandle = null }
  flashActive.value = new Set()
}

onMounted(async () => {
  startFlashing()
  await load()
})
onUnmounted(stopFlashing)
watch(terms, () => { startFlashing() })

defineExpose({ startFlashing, stopFlashing, getEar })
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
