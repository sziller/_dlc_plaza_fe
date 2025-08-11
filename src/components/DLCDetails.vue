<template>
  <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div class="bg-dark rounded-xl p-6 w-full max-w-2xl text-white shadow-xl relative">
      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 text-white text-xl hover:text-secondary"
        @click="$emit('close')"
        aria-label="Close"
      >
        &times;
      </button>

      <!-- Title -->
      <div class="text-2xl font-bold mb-6">DLC Details</div>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-white/80 text-sm">Loading…</div>
      <div v-else-if="error" class="text-red-400 text-sm">{{ error }}</div>

      <!-- Details -->
      <div v-else-if="detail" class="space-y-4 text-sm md:text-base">
        <div><span class="font-semibold">DLC ID:</span> {{ detail.dlc_id }}</div>
        <div><span class="font-semibold">Start Date:</span> {{ fmtDate(startTs) }}</div>
        <div><span class="font-semibold">Maturity Date:</span> {{ fmtDate(maturityTs) }}</div>
        <div><span class="font-semibold">Reference Index:</span> {{ detail.orcl_id || '—' }}</div>

        <div class="h-px bg-white/10 my-2"></div>

        <div><span class="font-semibold">Loan to Value:</span> {{ ltvText }}</div>
        <div><span class="font-semibold">Term:</span> {{ termText }}</div>
        <div><span class="font-semibold">Interest (for term):</span> {{ pct2(detail.interest) }}</div>
        <div><span class="font-semibold">Annualized yield:</span> {{ pct2(detail.interest_ear) }}</div>
        <div><span class="font-semibold">Fee:</span> 0.25%</div>

        <div class="h-px bg-white/10 my-2"></div>

        <div><span class="font-semibold">Status:</span> {{ detail.status }}</div>
        <div><span class="font-semibold">Initiator role:</span> {{ roleText }}</div>

        <div class="h-px bg-white/10 my-2"></div>

        <div><span class="font-semibold">Initiator collateral:</span> {{ satsToBtc(detail.ini_collateral_sats) }} BTC</div>
        <div><span class="font-semibold">Acceptor collateral:</span> {{ satsToBtc(detail.acc_collateral_sats) }} BTC</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { getDlcById } from '../api/dlcById' // adjust path if needed

const props = defineProps({
  // Can be the row object from the table; must include dlc_id or dlcId
  dlc: {
    type: Object,
    required: true,
  },
})

const loading = ref(true)
const error = ref(null)
const detail = ref(null)

const dlcId = computed(() => props.dlc?.dlc_id || props.dlc?.dlcId)

onMounted(load)
watchEffect(() => {
  // if prop changes, refetch
  if (dlcId.value) load()
})

async function load() {
  if (!dlcId.value) return
  loading.value = true
  error.value = null
  try {
    const res = await getDlcById(dlcId.value)
    detail.value = res?.payload || null
  } catch (e) {
    error.value = e?.message || 'Failed to load DLC.'
    detail.value = null
  } finally {
    loading.value = false
  }
}

/** ---------- formatters / derived ---------- */
function pct2(n) {
  const x = Number(n)
  return Number.isFinite(x) ? `${x.toFixed(2)}%` : '—'
}
function satsToBtc(sats) {
  const x = Number(sats)
  return Number.isFinite(x) ? (x / 1e8).toFixed(8) : '0.00000000'
}
function fmtDate(tsSec) {
  if (!tsSec) return '—'
  const d = new Date(tsSec * 1000)
  return d.toLocaleString()
}
const startTs = computed(() => detail.value?.offered_at || detail.value?.created_at || null)
const maturityTs = computed(() => {
  const start = startTs.value
  const durDays = Number(detail.value?.duration)
  if (!start || !Number.isFinite(durDays)) return null
  return start + Math.round(durDays * 24 * 60 * 60)
})

const ltvText = computed(() => {
  const pid = String(detail.value?.product_id || '')
  const m = pid.match(/ltv-(\d{1,3})/i)
  return m ? `${Number(m[1]).toFixed(0)}%` : '—'
})
const termText = computed(() => {
  const d = Number(detail.value?.duration)
  return Number.isFinite(d) ? `${Math.round(d)} Days` : '—'
})
const roleText = computed(() => {
  const r = detail.value?.ini_role
  if (r === 'lend') return 'Lender'
  if (r === 'borrow') return 'Borrower'
  return r || '—'
})
const feeText = computed(() => {
  const fee = detail.value?.cntr_terms?.fee
  return Number.isFinite(fee) ? `${Number(fee).toFixed(2)}%` : '—'
})
</script>

<style scoped>
@media (max-width: 640px) {
  .max-w-2xl {
    max-width: 90%;
  }
}
</style>
