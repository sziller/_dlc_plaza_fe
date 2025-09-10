<template>
  <!-- Backdrop (click outside + Esc to close; keyboard focusable for Esc) -->
  <div
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    @click.self="$emit('close')"
    @keydown.esc="$emit('close')"
    tabindex="-1"
    ref="backdropRef"
    role="presentation"
  >
    <!-- Dialog -->
    <div
      class="bg-dark rounded-xl p-6 w-full max-w-2xl text-white shadow-xl relative"
      role="dialog"
      :aria-labelledby="titleId"
      :aria-describedby="bodyId"
      aria-modal="true"
      :aria-busy="loading ? 'true' : 'false'"
      ref="dialogRef"
      @keydown="onKeydown"
    >
      <!-- Close Button -->
      <button
        type="button"
        class="absolute top-4 right-4 text-white text-xl hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-dark rounded"
        @click="$emit('close')"
        :aria-label="closeLabel"
        ref="closeBtnRef"
      >
        &times;
      </button>

      <!-- Title -->
      <h2 :id="titleId" class="text-2xl font-bold mb-6">DLC Details</h2>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-white/80 text-sm">Loading…</div>
      <div v-else-if="error" class="text-red-400 text-sm">{{ error }}</div>

      <!-- Details -->
      <div v-else-if="detail" class="space-y-4 text-sm md:text-base" :id="bodyId">
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
            type="button"
            class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { getDlcById } from '../api/dlcById'   // adjust path if needed
import { deleteDlc } from '../api/dlcDelete'  // adjust path if needed

const props = defineProps({
  dlc: { type: Object, required: true },
  isOwn: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'deleted'])

/* ---------- state ---------- */
const loading = ref(true)
const error = ref(null)
const detail = ref(null)
const deleting = ref(false)

const dlcId = computed(() => props.dlc?.dlc_id || props.dlc?.dlcId || null)

/* ---------- a11y / focus ---------- */
const titleId = `dlc-title-${Math.random().toString(36).slice(2)}`
const bodyId = `dlc-body-${Math.random().toString(36).slice(2)}`
const closeLabel = 'Close dialog'

const backdropRef = ref(null)
const dialogRef = ref(null)
const closeBtnRef = ref(null)
let previouslyFocused = null

onMounted(async () => {
  // Save current focus, then move it inside dialog safely
  previouslyFocused = document.activeElement
  await nextTick()
  try {
    backdropRef.value?.focus() // ensure Esc will work immediately
    // Move focus to close button (most obvious action)
    closeBtnRef.value?.focus()
  } catch {}
  // Load initial data
  if (dlcId.value) load()
})

// Restore focus to the element that had focus when the modal opened
onBeforeUnmount(() => {
  if (previouslyFocused && previouslyFocused.focus) {
    try { previouslyFocused.focus() } catch {}
  }
})

/* Trap focus within dialog (no visual change) */
function getFocusable() {
  if (!dialogRef.value) return []
  return Array.from(
    dialogRef.value.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )
  )
}
function onKeydown(e) {
  if (e.key !== 'Tab') return
  const f = getFocusable()
  if (!f.length) return
  const first = f[0]
  const last = f[f.length - 1]
  const active = document.activeElement
  if (e.shiftKey) {
    if (active === first || !dialogRef.value.contains(active)) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (active === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

/* ---------- data loading ---------- */
async function load() {
  loading.value = true
  error.value = null
  try {
    const res = await getDlcById(String(dlcId.value))
    detail.value = res?.payload || null
  } catch (e) {
    error.value = e?.message || 'Failed to load DLC.'
    detail.value = null
  } finally {
    loading.value = false
  }
}

// If the parent swaps the dlc prop while open, re-load details
watch(dlcId, (n, o) => {
  if (n && n !== o) load()
})

/* ---------- actions ---------- */
async function confirmDelete() {
  if (!dlcId.value) return
  // Native confirm is fine (no style change, no XSS risk).
  const ok = window.confirm(`Delete DLC ${dlcId.value}? This cannot be undone.`)
  if (!ok) return
  deleting.value = true
  try {
    await deleteDlc(String(dlcId.value))
    emit('deleted')
  } catch (e) {
    // Avoid rendering arbitrary strings in HTML: alert is fine here.
    alert(e?.message || 'Delete failed')
  } finally {
    deleting.value = false
  }
}

/* ---------- formatters ---------- */
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
/* Keep visuals identical; only add better focus indication (CSP-safe) */
:focus-visible {
  outline: none;
}
</style>
