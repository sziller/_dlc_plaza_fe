<template>
  <section class="w-full h-full">
    <div class="w-full h-full mx-auto">
      <div class="rounded-xl border border-secondary shadow-lg bg-dark p-6 h-full min-h-0 flex flex-col">
        <!-- Title -->
        <div class="text-3xl font-extrabold text-center mb-6 shrink-0">
          Liquidity Allocations
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
                :key="row.uuid"
                class="hover:bg-white/5 transition border-b border-white/10"
              >
                <td class="px-4 py-3">{{ row.role }}</td>
                <td class="px-4 py-3">{{ row.product }}</td>
                <td class="px-4 py-3">{{ row.interest }}</td>
                <td class="px-4 py-3 tabular-nums">{{ row.liquidity }}</td>
                <td class="px-4 py-3">{{ row.date }}</td>
              </tr>
              <tr v-if="sortedData.length === 0">
                <td class="px-4 py-6 text-white/70" colspan="5">No liquidity allocations found.</td>
              </tr>
            </tbody>

            <tbody v-else-if="loading">
              <tr>
                <td class="px-4 py-6 text-white/70" colspan="5">Loading…</td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td class="px-4 py-6 text-red-400" colspan="5">{{ error }}</td>
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

const columns = Object.freeze([
  { label: 'Role', key: 'role' },
  { label: 'Product', key: 'product' },
  { label: 'Interest (bp)', key: 'interestBp' },
  { label: 'Liquidity (BTC)', key: 'liquiditySat' },
  { label: 'Date', key: 'timestamp' },
])

const rows = ref([])
const loading = ref(false)
const error = ref(null)
const sortKey = ref('timestamp')
const sortAsc = ref(false)
const pollMs = 30000

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

function toRow(a) {
  return {
    uuid: a.uuid,
    role: capitalize(a.ini_role),
    product: a.service_type || '—',
    interest: String(a.interest_bp ?? '—'),
    interestBp: Number(a.interest_bp) || 0,
    liquidity: satsToBtc(a.liquidity_sat),
    liquiditySat: Number(a.liquidity_sat) || 0,
    date: fmtDate(a.timestamp),
    timestamp: Number(a.timestamp) || 0,
  }
}

// sorting
function sortBy(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}

function normForSort(row, key) {
  if (key === 'role' || key === 'product') return String(row[key] || '').toLowerCase()
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

// fetching
let pollId = null
let isFetching = false
let hasLoadedOnce = false

async function load(initial = false) {
  if (isFetching) return
  if (!initial && typeof document !== 'undefined' && document.hidden) return

  isFetching = true
  if (initial) { loading.value = true; error.value = null }
  try {
    const res = await postUserLiquQuery()
    const allocations = Array.isArray(res?.payload?.allocations) ? res.payload.allocations : []
    rows.value = allocations.map(toRow)
    hasLoadedOnce = true
  } catch (e) {
    console.error('postUserLiquQuery failed:', e)
    if (!hasLoadedOnce) {
      error.value = e?.message || 'Failed to fetch liquidity allocations.'
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
