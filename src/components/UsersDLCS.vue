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
                  @click="sortBy(col.key)"
                  class="px-4 py-2 cursor-pointer select-none hover:text-secondary transition whitespace-nowrap"
                >
                  {{ col.label }}
                  <span v-if="sortKey === col.key">
                    {{ sortAsc ? '↑' : '↓' }}
                  </span>
                </th>
              </tr>
            </thead>

            <tbody v-if="!loading && !error" class="text-white/90 text-sm md:text-base">
              <tr
                v-for="row in sortedData"
                :key="row.dlcId"
                @click="selectDlc(row)"
                class="hover:bg-white/5 cursor-pointer transition border-b border-white/10"
              >
                <td class="px-4 py-3">{{ row.dlcId }}</td>
                <td class="px-4 py-3">{{ row.oracle }}</td>
                <td class="px-4 py-3">{{ row.term }}</td>
                <td class="px-4 py-3">{{ row.ltv }}</td>
                <td class="px-4 py-3">{{ row.rate }}</td>
                <td class="px-4 py-3">{{ row.status }}</td>
                <td class="px-4 py-3">{{ row.role }}</td>
              </tr>
              <tr v-if="sortedData.length === 0">
                <td class="px-4 py-6 text-white/70" colspan="7">No DLCs found.</td>
              </tr>
            </tbody>

            <tbody v-else-if="loading">
              <tr>
                <td class="px-4 py-6 text-white/70" colspan="7">Loading…</td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td class="px-4 py-6 text-red-400" colspan="7">{{ error }}</td>
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

const columns = [
  { label: 'DLC ID', key: 'dlcId' },
  { label: 'Oracle', key: 'oracle' },
  { label: 'Term', key: 'term' },
  { label: 'Loan To Value', key: 'ltv' },
  { label: 'Rate', key: 'rate' },
  { label: 'Status', key: 'status' },
  { label: 'Role', key: 'role' },
]

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
const parseTermDays = (pid, duration) => {
  const fromPid = String(pid || '').match(/d-(\d+(\.\d+)?)/i)
  if (fromPid) return Math.round(Number(fromPid[1]))
  const d = Number(duration)
  return Number.isFinite(d) && d > 0 ? Math.round(d) : null
}
const isHiddenEmail = (s) => String(s ?? '').trim() === '--- hidden ---'
const roleLabel = (ini_role, ini_email) => {
  if (ini_role === 'lend' && !isHiddenEmail(ini_email)) return 'Lender'
  if (ini_role === 'lend' && isHiddenEmail(ini_email)) return 'Borrower'
  if (ini_role === 'borrow' && !isHiddenEmail(ini_email)) return 'Borrower'
  if (ini_role === 'borrow' && isHiddenEmail(ini_email)) return 'Lender'
  return '—'
}
const statusLabel = (s) => s || '—'

// map API item -> table row
const toRow = (d) => {
  const days = parseTermDays(d.product_id, d.duration)
  const ltv = parseLtv(d.product_id)
  return {
    dlcId: d.dlc_id || d.tmp_cntr_id || '—',
    oracle: d.orcl_id || '—',
    term: days ? `${days} Days` : '—',
    ltv: ltv != null ? `${ltv}%` : '—',
    rate: pct2(Number(d.interest)),
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
    const m = String(v).match(/(\d+)/); return m ? Number(m[1]) : 0
  }
  if (key === 'ltv' || key === 'rate') {
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

const statuses = ["offer_p","offer_dlc","sign_ini","sign_acc","signed","broadcast","active","attested","executed","settled","revoked","reset"]

function sameRows(a, b) {
  // compare on stable keys only
  const pick = r => ({
    dlcId: r.dlcId, oracle: r.oracle, term: r.term, ltv: r.ltv, rate: r.rate, status: r.status, role: r.role
  })
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const A = pick(a[i]); const B = pick(b[i])
    if (A.dlcId !== B.dlcId || A.oracle !== B.oracle || A.term !== B.term ||
        A.ltv !== B.ltv || A.rate !== B.rate || A.status !== B.status || A.role !== B.role) return false
  }
  return true
}

async function load(initial = false) {
  if (isFetching) return
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
  pollId = setInterval(() => load(false), props.pollMs)
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
</style>
