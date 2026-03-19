<template>
  <section class="w-full h-full">
    <div class="w-full h-full mx-auto">
      <div class="rounded-xl border border-secondary shadow-lg bg-dark p-6 h-full min-h-0 flex flex-col">
        <!-- Title -->
        <div class="text-3xl font-extrabold text-center mb-6 shrink-0">
          Open Orders
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
                    v-if="col.label"
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
                :key="row.uuid"
                class="hover:bg-white/5 transition border-b border-white/10"
              >
                <td class="px-4 py-3">{{ row.role }}</td>
                <td class="px-4 py-3 tabular-nums">{{ row.dollar }}</td>
                <td class="px-4 py-3">{{ row.interest }}</td>
                <td class="px-4 py-3 tabular-nums">{{ row.liquidity }}</td>
                <td class="px-4 py-3">{{ row.date }}</td>
                <td class="px-4 py-3">
                  <button
                    type="button"
                    :disabled="cancelling.has(row.uuid)"
                    class="px-3 py-1 text-xs font-semibold rounded border border-red-500/60 text-red-400 hover:bg-red-500/15 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    @click="cancelAllocation(row)"
                  >
                    {{ cancelling.has(row.uuid) ? 'Cancelling…' : 'Cancel' }}
                  </button>
                </td>
              </tr>
              <tr v-if="sortedData.length === 0">
                <td class="px-4 py-6 text-white/70" colspan="6">No open orders found.</td>
              </tr>
            </tbody>

            <tbody v-else-if="loading">
              <tr>
                <td class="px-4 py-6 text-white/70" colspan="6">Loading…</td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td class="px-4 py-6 text-red-400" colspan="6">{{ error }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { postUserLiquQuery } from '../api/userLiquQuery'
import { postLiquidityWithdrawalV1 } from '../api/liquidityAllocation'
import { getPrice } from '../api/price'

const columns = Object.freeze([
  { label: 'Type', key: 'role' },
  { label: 'Dollar', key: 'dollarValue' },
  { label: 'Interest (%)', key: 'interestBp' },
  { label: 'Liquidity (BTC)', key: 'liquiditySat' },
  { label: 'Date', key: 'timestamp' },
  { label: '', key: 'actions' },
])

const rows = ref([])
const loading = ref(false)
const error = ref(null)
const sortKey = ref('timestamp')
const sortAsc = ref(false)
const pollMs = 30000
const btcPrice = ref(0)
const cancelling = ref(new Set())

function satsToBtc(sats) {
  const n = Number(sats)
  if (!Number.isFinite(n)) return '—'
  return (n / 1e8).toFixed(8)
}

function fmtDate(ts) {
  if (!ts) return '—'
  const ms = Number(ts) < 1e12 ? Number(ts) * 1000 : Number(ts)
  return new Date(ms).toLocaleString()
}

function capitalize(s) {
  const v = String(s || '')
  return v.charAt(0).toUpperCase() + v.slice(1)
}

function fmtDollar(sats) {
  const n = Number(sats)
  if (!Number.isFinite(n) || !btcPrice.value) return '—'
  const usd = (n / 1e8) * btcPrice.value
  return '$' + usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function toRow(a) {
  return {
    uuid: a.uuid,
    role: capitalize(a.ini_role),
    dollar: fmtDollar(a.liquidity_sat),
    dollarValue: btcPrice.value ? (Number(a.liquidity_sat) / 1e8) * btcPrice.value : 0,
    interest: (a.interest_bp / 100).toFixed(2) + '%',
    interestBp: Number(a.interest_bp) || 0,
    liquidity: satsToBtc(a.liquidity_sat),
    liquiditySat: Number(a.liquidity_sat) || 0,
    date: fmtDate(a.timestamp),
    timestamp: Number(a.timestamp) || 0,
    // keep raw values for cancel
    _raw: a,
  }
}

// sorting
function sortBy(key) {
  if (key === 'actions') return
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}

function normForSort(row, key) {
  if (key === 'role') return String(row[key] || '').toLowerCase()
  if (key === 'dollarValue') return row.dollarValue
  if (key === 'interestBp') return row.interestBp
  if (key === 'liquiditySat') return row.liquiditySat
  if (key === 'timestamp') return row.timestamp
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

// cancel allocation
async function cancelAllocation(row) {
  if (!window.confirm('Are you sure you want to cancel this allocation?')) return
  const raw = row._raw
  const next = new Set(cancelling.value)
  next.add(row.uuid)
  cancelling.value = next
  try {
    await postLiquidityWithdrawalV1({
      ini_role: raw.ini_role,
      interest: raw.interest_bp / 100,
      liquidity_sat: raw.liquidity_sat,
    })
    await load(true)
  } catch (e) {
    alert(e?.message || 'Failed to cancel allocation.')
  } finally {
    const after = new Set(cancelling.value)
    after.delete(row.uuid)
    cancelling.value = after
  }
}

// fetching
let pollId = null
let isFetching = false
let hasLoadedOnce = false
let rawAllocations = []

async function fetchBtcPrice() {
  try {
    const price = await getPrice()
    if (Number.isFinite(price) && price > 0) btcPrice.value = price
  } catch (e) {
    console.debug('BTC price fetch failed:', e)
  }
}

async function load(initial = false) {
  if (isFetching) return
  if (!initial && typeof document !== 'undefined' && document.hidden) return

  isFetching = true
  if (initial) { loading.value = true; error.value = null }
  try {
    await fetchBtcPrice()
    const res = await postUserLiquQuery()
    const allocations = Array.isArray(res?.payload?.allocations) ? res.payload.allocations : []
    rawAllocations = allocations
    rows.value = allocations.map(toRow)
    hasLoadedOnce = true
  } catch (e) {
    console.error('postUserLiquQuery failed:', e)
    if (!hasLoadedOnce) {
      error.value = e?.message || 'Failed to fetch open orders.'
      rows.value = []
    }
  } finally {
    if (initial) loading.value = false
    isFetching = false
  }
}

function onVisChange() { if (!document.hidden) load(false) }
function onFocus() { load(false) }
function onAuthChanged() { load(true) }

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
