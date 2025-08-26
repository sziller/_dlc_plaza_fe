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
        <div><span class="font-semibold">Fee:</span> 0.50%</div>

        <div class="h-px bg-white/10 my-2"></div>

        <div><span class="font-semibold">Status:</span> {{ detail.status }}</div>
        <div><span class="font-semibold">Initiator role:</span> {{ roleText }}</div>

        <div class="h-px bg-white/10 my-2"></div>

        <div><span class="font-semibold">Initiator collateral:</span> {{ satsToBtc(detail.ini_collateral_sats) }} BTC</div>
        <div><span class="font-semibold">Acceptor collateral:</span> {{ satsToBtc(detail.acc_collateral_sats) }} BTC</div>

        <!-- Actions -->
        <div v-if="isOwn" class="pt-4">
          <button
            class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60"
            :disabled="deleting"
            @click="confirmDelete"
          >
            {{ deleting ? 'Deleting…' : 'Delete DLC' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'

const props = defineProps({
  dlc: { type: Object, required: true },
  isOwn: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'deleted'])

const loading = ref(true)
const error = ref(null)
const detail = ref(null)
const deleting = ref(false)

const dlcId = computed(() => props.dlc?.dlc_id || props.dlc?.dlcId || props.dlc?.tmp_cntr_id)

// Normalize + defaults (front-end only)
function normalize(d) {
  const nowSec = Math.floor(Date.now() / 1000)
  const defaults = {
    dlc_id: dlcId.value || 'DLC-DEMO-001',
    orcl_id: 'orcl-demo-btcusd',
    product_id: 'ltv-50_d-30',
    duration: 30,
    interest: 10.0,
    interest_ear: 10.47,
    status: 'active',
    ini_role: 'lend',
    ini_email: 'demo@example.com',
    ini_collateral_sats: 2500000,
    acc_collateral_sats: 2500000,
    offered_at: nowSec - 3600,
    created_at: nowSec - 3600,
  }
  return { ...defaults, ...(d || {}) }
}

async function load() {
  loading.value = true
  error.value = null
  // Simulate a tiny delay to show loading state (optional)
  await new Promise(r => setTimeout(r, 150))
  detail.value = normalize(props.dlc)
  loading.value = false
}

onMounted(load)
watchEffect(() => {
  // re-hydrate if parent passes a different dlc
  if (props.dlc) load()
})

async function confirmDelete() {
  if (!dlcId.value) return
  const ok = window.confirm(`Delete DLC ${dlcId.value}? This cannot be undone.`)
  if (!ok) return
  deleting.value = true
  // Simulate delete delay
  await new Promise(r => setTimeout(r, 250))
  deleting.value = false
  emit('deleted')
  emit('close')
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
</script>

<style scoped>
@media (max-width: 640px) {
  .max-w-2xl { max-width: 90%; }
}
</style>
