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
                :key="row.dlcIdFull"
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
                <td class="px-4 py-3">{{ row.annualized }}</td>
                <td class="px-4 py-3">{{ row.role }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-block px-2 py-1 rounded text-xs font-semibold"
                    :class="row.statusClass"
                  >
                    {{ row.status }}
                  </span>
                </td>
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
      :user-email="userEmail"
      @close="selectedDlc = null"
      @deleted="onDeleted"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import DlcDetails from './DLCDetails.vue'
import { getUserDlcs } from '../api/userDlcs'
import { getUserProfile } from '../api/userProfile'

const columns = Object.freeze([
  { label: 'DLC ID', key: 'dlcId' },
  { label: 'Oracle', key: 'oracle' },
  { label: 'Term', key: 'term' },
  { label: 'Loan To Value', key: 'ltv' },
  { label: 'Annualized Yield', key: 'annualized' },
  { label: 'Role', key: 'role' },            // Borrower / Lender (computed)
  { label: 'Status', key: 'status' },
])

// state
const apiDlcs = ref([])
const rows = ref([])
const loading = ref(false)
const error = ref(null)
const sortKey = ref('dlcId')
const sortAsc = ref(true)
const selectedDlc = ref(null)
const pollMs = 30000

// auth context (real email pulled from profile)
const userEmail = ref('')

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
const isYearish = (days) => {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
const displayDays = (days) => (isYearish(days) ? 365 : Math.round(Number(days) || 0))
const annualize360 = (termPct, days) => {
  const r = Number(termPct)
  const d = Number(days)
  if (!Number.isFinite(r) || !Number.isFinite(d) || d <= 0) return NaN
  return r * (360 / d)
}

const isHidden = (s) => String(s ?? '').trim() === '--- hidden ---'
const normEmail = (s) => String(s ?? '').trim().toLowerCase()
const normRole  = (r) => {
  const v = String(r ?? '').trim().toLowerCase()
  return v === 'borrow' || v === 'lend' ? v : ''
}
const roleFromIni = (iniRole) => iniRole === 'borrow' ? 'Borrower' : iniRole === 'lend' ? 'Lender' : '—'
const oppositeRole = (iniRole) => iniRole === 'borrow' ? 'Lender' : iniRole === 'lend' ? 'Borrower' : '—'

/**
 * Compute role for the *current user*:
 * - If user matches initiator email → role = ini_role
 * - If user matches acceptor email → role = opposite(ini_role)
 * - If one email is hidden, still allow matching the other one.
 * - If both hidden or no match → '—'
 * Supports alternate field names from API.
 */
function computeUserRole(d, user) {
  const u = normEmail(user)
  if (!u) return '—'

  const iniEmail = normEmail(d.ini_email ?? d.iniEmail)
  const accEmail = normEmail(d.acc_email ?? d.accEmail)
  const iniRole  = normRole(d.ini_role ?? d.iniRole)

  // If we can match initiator directly
  if (!isHidden(iniEmail) && u === iniEmail) return roleFromIni(iniRole)

  // If we can match acceptor directly
  if (!isHidden(accEmail) && u === accEmail) return oppositeRole(iniRole)

  // If one side is hidden, check the visible side only
  if (isHidden(iniEmail) && !isHidden(accEmail) && u === accEmail) return oppositeRole(iniRole)
  if (isHidden(accEmail) && !isHidden(iniEmail) && u === iniEmail) return roleFromIni(iniRole)

  return '—'
}

/** EXACT mapping from Sziller (kept as-is) */
function getStatusDetails(dlc, user) {
  let statusLabel = ''
  let statusStyle = ''
  if (dlc.status === 'offer_p') {
    statusLabel = 'Offer'; statusStyle = 'bg-offer'
  } else if (dlc.status === 'offer_dlc') {
    statusLabel = 'Please sign!'; statusStyle = 'bg-red-500 text-offer'
  } else if (dlc.status === 'signed') {
    statusLabel = 'Signed'; statusStyle = 'bg-signed'
  } else if (dlc.status === 'broadcast') {
    statusLabel = 'Broadcast'; statusStyle = 'bg-aura-500'
  } else if (dlc.status === 'active') {
    statusLabel = 'Active'; statusStyle = 'bg-lime-500'
  } else if (dlc.status === 'confirmed') {
    statusLabel = 'Confirmed'; statusStyle = 'bg-lime-500'
  } else if (dlc.status === 'executed') {
    statusLabel = 'Executed'; statusStyle = 'bg-aura-500'
  } else if (dlc.status === 'attested') {
    statusLabel = 'Attested'; statusStyle = 'bg-red-500 text-offer'
  } else if (dlc.status === 'settled') {
    statusLabel = 'Settled'; statusStyle = 'bg-accepted'
  } else if (dlc.status === 'revoked') {
    statusLabel = 'Revoked'; statusStyle = 'bg-base-500 text-offer'
  } else if (dlc.status === 'reset') {
    statusLabel = 'Reset'; statusStyle = 'bg-base-500 text-offer'
  } else if (dlc.status === 'sign_ini') {
    if (dlc.ini_email === user) { statusLabel = 'Waiting for peer!'; statusStyle = 'bg-blue-500 text-offer' }
    if (dlc.acc_email === user) { statusLabel = 'Please sign!';      statusStyle = 'bg-red-500 text-offer' }
  } else if (dlc.status === 'sign_acc') {
    if (dlc.acc_email === user) { statusLabel = 'Waiting for peer!'; statusStyle = 'bg-blue-500 text-offer' }
    if (dlc.ini_email === user) { statusLabel = 'Please sign!';      statusStyle = 'bg-red-500 text-offer' }
  } else {
    statusLabel = 'Unknown'; statusStyle = 'bg-gray-500'
  }
  return { statusLabel, statusStyle }
}

const statusLabelPlain = (s) => s || '—'
const short = (s, n) => {
  const t = String(s || '')
  if (!t) return '—'
  return t.slice(0, n)
}

// map API item -> table row (keep full values for sorting/selection; show short)
const toRow = (d) => {
  const rawDays = parseTermDays(d.product_id, d.duration)   // e.g. 30, 90, 180, 360
  const uiDays  = rawDays ? displayDays(rawDays) : null     // e.g. 30, 90, 180, 365
  const ltv = parseLtv(d.product_id)
  const rateNum = Number(d.interest)
  const ear = annualize360(rateNum, rawDays)

  const fullId = d.dlc_id || d.tmp_cntr_id || ''
  const fullOracle = d.orcl_id || ''

  const { statusLabel: smartLabel, statusStyle } = getStatusDetails(
    { status: d.status, ini_email: d.ini_email, acc_email: d.acc_email },
    userEmail.value
  )

  return {
    // full values for logic/sorting
    dlcIdFull: fullId,
    oracleFull: fullOracle,

    // displayed trims
    dlcId: short(fullId, 8),
    oracle: short(fullOracle, 9),

    term: uiDays ? `${uiDays} Days` : '—',
    ltv: ltv != null ? `${ltv}%` : '—',
    annualized: pct2(ear),

    role: computeUserRole(d, userEmail.value),

    status: smartLabel || statusLabelPlain(d.status),
    statusClass: statusStyle || '',
  }
}

// sorting
function sortBy(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}
const normForSort = (row, key) => {
  if (key === 'dlcId') return row.dlcIdFull || ''
  if (key === 'oracle') return (row.oracleFull || '').toLowerCase()
  if (key === 'term') { const m = String(row.term).match(/(\d+)/); return m ? Number(m[1]) : 0 }
  if (key === 'ltv' || key === 'annualized') {
    const m = String(row[key]).match(/([\d.]+)/); return m ? Number(m[1]) : -1
  }
  if (key === 'role') return String(row.role || '').toLowerCase()
  return String(row[key] ?? '').toLowerCase()
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

// selection uses the full id
function selectDlc(row) {
  const raw = apiDlcs.value.find(d => (d.dlc_id || d.tmp_cntr_id) === row.dlcIdFull)
  selectedDlc.value = raw || null
}

// polling + profile fetch
let pollId = null
let isFetching = false
let hasLoadedOnce = false

const statuses = Object.freeze([
  'offer_p','offer_dlc','sign_ini','sign_acc','signed',
  'broadcast','active','attested','executed','settled','revoked','reset','confirmed'
])

async function loadProfileEmail() {
  try {
    const prof = await getUserProfile()
    const email = String(prof?.payload?.email || '').trim()
    if (email) userEmail.value = email
  } catch (e) {
    console.warn('[UsersDLCS] failed to get profile email:', e?.message || e)
    userEmail.value = ''
  }
}

function sameRows(a, b) {
  // compare on stable keys + statusClass so style updates propagate
  const pick = r => ({
    dlcIdFull: r.dlcIdFull, oracleFull: r.oracleFull, term: r.term, ltv: r.ltv,
    annualized: r.annualized, status: r.status, statusClass: r.statusClass, role: r.role
  })
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const A = pick(a[i]); const B = pick(b[i])
    if (
      A.dlcIdFull !== B.dlcIdFull || A.oracleFull !== B.oracleFull || A.term !== B.term ||
      A.ltv !== B.ltv || A.annualized !== B.annualized || A.role !== B.role ||
      A.status !== B.status || A.statusClass !== B.statusClass
    ) return false
  }
  return true
}

async function load(initial = false) {
  if (isFetching) return
  if (!initial && document.hidden) return

  isFetching = true
  if (initial) { loading.value = true; error.value = null }
  try {
    if (!userEmail.value) await loadProfileEmail()

    const res = await getUserDlcs(statuses)
    const payload = Array.isArray(res?.payload) ? res.payload : []
    const nextRows = payload.map(toRow)

    if (!sameRows(rows.value, nextRows)) {
      apiDlcs.value = payload
      rows.value = nextRows
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

// If the userEmail arrives late, recompute rows so Role fills in
watch(userEmail, (now, prev) => {
  if (now && apiDlcs.value.length) {
    const nextRows = apiDlcs.value.map(toRow)
    if (!sameRows(rows.value, nextRows)) rows.value = nextRows
  }
})

function onVisChange() { if (!document.hidden) load(false) }
function onFocus() { load(false) }
function onAuthChanged() {
  userEmail.value = ''
  load(true)
}

// lifecycle
onMounted(async () => {
  await load(true)
  pollId = setInterval(() => { if (!document.hidden) load(false) }, pollMs)
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
