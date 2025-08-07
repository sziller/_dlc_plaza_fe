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
                  class="px-4 py-2 cursor-pointer select-none hover:text-secondary transition"
                >
                  {{ col.label }}
                  <span v-if="sortKey === col.key">
                    {{ sortAsc ? '↑' : '↓' }}
                  </span>
                </th>
              </tr>
            </thead>

            <tbody class="text-white/90 text-sm md:text-base">
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
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- DLC Detail Modal -->
    <DlcDetails v-if="selectedDlc" :dlc="selectedDlc" @close="selectedDlc = null" />
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import DlcDetails from './DLCDetails.vue' 

const columns = [
  { label: 'DLC ID', key: 'dlcId' },
  { label: 'Oracle', key: 'oracle' },
  { label: 'Term', key: 'term' },
  { label: 'Loan To Value', key: 'ltv' },
  { label: 'Rate', key: 'rate' },
  { label: 'Status', key: 'status' },
  { label: 'Role', key: 'role' },
]

const rows = ref([
  { dlcId: '001', oracle: 'oracle1.com', term: '30 Days', ltv: '50%', rate: '5.2%', status: 'Active', role: 'Lender' },
  { dlcId: '002', oracle: 'oracle2.net', term: '60 Days', ltv: '80%', rate: '9.9%', status: 'Pending', role: 'Borrower' },
  { dlcId: '003', oracle: 'oracle3.io', term: '90 Days', ltv: '50%', rate: '6.4%', status: 'Closed', role: 'Lender' },
  { dlcId: '004', oracle: 'oracle4.org', term: '365 Days', ltv: '80%', rate: '10.1%', status: 'Active', role: 'Borrower' },
])

const sortKey = ref('dlcId')
const sortAsc = ref(true)
const selectedDlc = ref(null)

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function selectDlc(dlc) {
  selectedDlc.value = dlc
}

const sortedData = computed(() => {
  return [...rows.value].sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]
    if (valA < valB) return sortAsc.value ? -1 : 1
    if (valA > valB) return sortAsc.value ? 1 : -1
    return 0
  })
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
</style>
