<template>
  <section class="w-full h-full">
    <div class="w-full h-full mx-auto">
      <div class="rounded-xl border border-secondary shadow-lg bg-dark p-6 h-full min-h-0 flex flex-col">
        <!-- Title -->
        <div class="text-3xl font-extrabold text-center mb-6 shrink-0">
          Users DLCs
        </div>

        <!-- Table Wrapper -->
        <div class="overflow-auto flex-1 min-h-0">
          <table class="w-full table-auto border-collapse text-white">
            <thead>
              <tr class="text-white text-left text-sm md:text-base">
                <th
                  v-for="col in columns"
                  :key="col.key"
                  scope="col"
                  class="px-4 py-2 whitespace-nowrap"
                  :aria-sort="sortKey === col.key ? (sortAsc ? 'ascending' : 'descending') : 'none'"
                >
                  <button
                    type="button"
                    class="cursor-pointer select-none hover:text-secondary transition inline-flex items-center gap-1"
                    @click="sortBy(col.key)"
                    @keydown.enter.prevent="sortBy(col.key)"
                    @keydown.space.prevent="sortBy(col.key)"
                  >
                    <span>{{ col.label }}</span>
                    <span v-if="sortKey === col.key" aria-hidden="true">
                      {{ sortAsc ? '↑' : '↓' }}
                    </span>
                  </button>
                  <span v-if="sortKey === col.key" class="sr-only">
                    (sorted {{ sortAsc ? 'ascending' : 'descending' }})
                  </span>
                </th>
              </tr>
            </thead>

            <tbody v-if="!loading && !error" class="text-white/90 text-sm md:text-base">
              <tr
                v-for="row in sortedData"
                :key="row.dlcId"
                @click="selectDlc(row)"
                @keydown.enter.prevent="selectDlc(row)"
                @keydown.space.prevent="selectDlc(row)"
                role="button"
                tabindex="0"
                class="hover:bg-white/5 cursor-pointer transition border-b border-white/10"
              >
                <td class="px-4 py-3">{{ row.dlcId }}</td>
                <td class="px-4 py-3">{{ row.oracle }}</td>
                <td class="px-4 py-3">{{ row.term }}</td>
                <td class="px-4 py-3">{{ row.ltv }}</td>
                <td class="px-4 py-3">{{ row.rate }}</td>
                <td class="px-4 py-3">{{ row.annualized }}</td>
                <td class="px-4 py-3">{{ row.status }}</td>
                <td class="px-4 py-3">{{ row.role }}</td>
              </tr>
              <tr v-if="sortedData.length === 0">
                <td class="px-4 py-6 text-white/70" colspan="8">No DLCs found.</td>
              </tr>
            </tbody>

            <tbody v-else-if="loading">
              <tr>
                <td class="px-4 py-6 text-white/70" colspan="8">Loading…</td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td class="px-4 py-6 text-red-400" colspan="8">{{ error }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- DLC Detail Modal -->
    <DlcDetails
      v-if="selectedDlc"
      :dlc="selectedDlc"
      :is-own="true"
      @close="selectedDlc = null"
      @deleted="onDeleted"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DlcDetails from './DLCDetails.vue'
import { getUserDlcs } from '../api/userDlcs'

const props = defineProps({
  pollMs: { type: Number, default: 30000 } // 30s
})

const columns = Object.freeze([
  { label: 'DLC ID', key: 'dlcId' },
  { label: 'Oracle', key: 'oracle' },
  { label: 'Term', key: 'term' },
  { label: 'Loan To Value', key: 'ltv' },
  { label: 'Rate (Term)', key: 'rate' },
  { label: 'Annualized Yield', key: 'annualized' },
  { label: 'Status', key: 'status' },
  { label: 'Role', key: 'role' },
])

// state
const apiDlcs = ref([])     // raw payload from API
const rows = ref([])        // mapped for table
const loading = ref(false)
const error = ref(null)
const sortKey = ref('dlcId')
const sortAsc = ref(true)
const selectedDlc = ref(null)

// helpers
const pct2 = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '*')
const parseLtv = (pid) => {
  const m = String(pid || '').match(/ltv-(\d{1,3})/i)
  return m ? Number(m[1]) : null
}
/** Extract raw term days (as provided), without UI normalization. */
const parseTermDays = (pid, duration) => {
  const fromPid = String(pid || '').match(/d-(\d+(\.\d+)?)/i)
  if (fromPid) return Math.round(Number(fromPid[1]))
  const d = Number(duration)
  return Number.isFinite(d) && d > 0 ? Math.round(d) : null
}
/** Treat anything in [360..366] as a 1-year term; display as 365 days. */
const isYearish = (days) => {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
const displayDays = (days) => (isYearish(days) ? 365 : Math.round(Number(days) || 0))

/** Simple 360-day annualization (no compounding), same as Market Overview. */
const annualize360 = (termPct, days) => {
  const r = Number(termPct)
  const d = Number(days)
  if (!Number.isFinite(r) || !Number.isFinite(d) || d <= 0) return NaN
  return r * (360 / d)
}

const isHiddenEmail = (s) => String(s ?? '').trim() === '--- hidden ---'
const roleLabel = (ini_role, ini_email) => {
  if (ini_role === 'lend' && !isHiddenEmail(ini_email)) return 'Lender'
  if (ini_role === 'lend' && isHiddenEmail(ini_email))  return 'Borrower'
  if (ini_role === 'borrow' && !isHiddenEmail(ini_email)) return 'Borrower'
  if (ini_role === 'borrow' && isHiddenEmail(ini_email))  return 'Lender'
  return '—'
}
const statusLabel = (s) => s || '—'

// map API item -> table row (normalize yearish terms to 365 for display, but compute annualized on raw days)
const toRow = (d) => {
  const rawDays = parseTermDays(d.product_id, d.duration) // e.g. 30, 90, 180, 360
  const uiDays  = rawDays ? displayDays(rawDays) : null   // e.g. 30, 90, 180, 365
  const ltv = parseLtv(d.product_id)
  const rateNum = Number(d.interest)
  const ear = annualize360(rateNum, rawDays)

  return {
    dlcId: d.dlc_id || d.tmp_cntr_id || '—',
    oracle: d.orcl_id || '—',
    term: uiDays ? `${uiDays} Days` : '—',
    ltv: ltv != null ? `${ltv}%` : '—',
    rate: pct2(rateNum),
    annualized: pct2(ear),
    status: statusLabel(d.status),
    role: roleLabel(d.ini_role, d.ini_email),
  }
}

// sorting
function sortBy(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}
const normForSort = (row, key) => {
  const v = row[key]
  if (v == null) return ''
  if (key === 'term') {
    // Parse displayed number (already normalized to 365 if yearish)
    const m = String(v).match(/(\d+)/); return m ? Number(m[1]) : 0
  }
  if (key === 'ltv' || key === 'rate' || key === 'annualized') {
    const m = String(v).match(/([\d.]+)/); return m ? Number(m[1]) : -1
  }
  return String(v).toLowerCase()
}
const sortedData = computed(() => {
  return [...rows.value].sort((a, b) => {
    const A = normForSort(a, sortKey.value)
    const B = normForSort(b, sortKey.value)
    if (A < B) return sortAsc.value ? -1 : 1
    if (A > B) return sortAsc.value ? 1 : -1
    return 0
  })
})

// selection
function selectDlc(row) {
  const raw = apiDlcs.value.find(d => (d.dlc_id || d.tmp_cntr_id) === row.dlcId)
  selectedDlc.value = raw || null
}

// polling
let pollId = null
let isFetching = false
let hasLoadedOnce = false

const statuses = Object.freeze([
  "offer_p","offer_dlc","sign_ini","sign_acc","signed",
  "broadcast","active","attested","executed","settled","revoked","reset"
])

function sameRows(a, b) {
  // compare on stable keys only
  const pick = r => ({
    dlcId: r.dlcId, oracle: r.oracle, term: r.term, ltv: r.ltv, rate: r.rate, annualized: r.annualized, status: r.status, role: r.role
  })
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const A = pick(a[i]); const B = pick(b[i])
    if (A.dlcId !== B.dlcId || A.oracle !== B.oracle || A.term !== B.term ||
        A.ltv !== B.ltv || A.rate !== B.rate || A.annualized !== B.annualized ||
        A.status !== B.status || A.role !== B.role) return false
  }
  return true
}

async function load(initial = false) {
  if (isFetching) return
  // Skip background polling when tab is hidden (saves battery/network)
  if (!initial && document.hidden) return

  isFetching = true
  if (initial) { loading.value = true; error.value = null }
  try {
    const res = await getUserDlcs(statuses)
    const payload = Array.isArray(res?.payload) ? res.payload : []
    const nextRows = payload.map(toRow)

    // only update if changed
    if (!sameRows(rows.value, nextRows)) {
      apiDlcs.value = payload
      rows.value = nextRows
      // keep modal data fresh
      if (selectedDlc.value) {
        const id = selectedDlc.value.dlc_id || selectedDlc.value.tmp_cntr_id
        const updated = payload.find(d => (d.dlc_id || d.tmp_cntr_id) === id)
        if (updated) selectedDlc.value = updated
      }
    }
    hasLoadedOnce = true
  } catch (e) {
    console.error('getUserDlcs failed:', e)
    if (!hasLoadedOnce) {
      error.value = e?.message || 'Failed to fetch user DLCs.'
      apiDlcs.value = []
      rows.value = []
    }
  } finally {
    if (initial) loading.value = false
    isFetching = false
  }
}

function onVisChange() {
  if (!document.hidden) load(false)
}
function onFocus() {
  load(false)
}
function onAuthChanged() {
  load(false)
}

// lifecycle
onMounted(async () => {
  await load(true)
  pollId = setInterval(() => { if (!document.hidden) load(false) }, props.pollMs)
  document.addEventListener('visibilitychange', onVisChange)
  window.addEventListener('focus', onFocus)
  window.addEventListener('auth-changed', onAuthChanged)
})
onUnmounted(() => {
  if (pollId) clearInterval(pollId)
  document.removeEventListener('visibilitychange', onVisChange)
  window.removeEventListener('focus', onFocus)
  window.removeEventListener('auth-changed', onAuthChanged)
})

// delete callback
function onDeleted() {
  selectedDlc.value = null
  load(false)
}
</script>

<style scoped>
tbody tr {
  border-radius: 0.5rem;
}
tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
th {
  user-select: none;
}
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}
</style>
