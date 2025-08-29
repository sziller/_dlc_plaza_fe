<template>
  <main class="min-h-screen text-white pt-[150px] px-6 pb-16 relative overflow-hidden">
    <!-- Gradient background -->
    <div
  class="fixed inset-0 -z-10"
  style="background: linear-gradient(
    to bottom,
    #000000 0%,
    #000000 56%,
    #0a051f 66%,
    #1b0a3c 76%,
    #35157a 88%,
    #6738e4 100%
  );">
</div>

    <div class="max-w-7xl mx-auto space-y-8">
      <header class="flex items-center justify-between">
        <h1 class="text-5xl font-bold">My Profile</h1>
        <button
          class="px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15"
          :disabled="loading"
          @click="load"
        >
          {{ loading ? 'Refreshing…' : 'Refresh' }}
        </button>
      </header>

      <!-- Error -->
      <div v-if="error" class="p-4 border border-red-500/40 bg-red-500/10 rounded-lg">
        <div class="font-semibold text-red-300">Error</div>
        <div class="text-red-200 text-sm mt-1 break-words">{{ error }}</div>
      </div>

      <!-- Loading -->
      <div v-else-if="loading" class="p-4 border border-white/20 bg-white/5 rounded-lg">
        Loading profile…
      </div>

      <!-- Profile Data -->
      <div v-else-if="profile" class="space-y-6">
        <!-- Basic info -->
        <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-2">
          <div><span class="font-semibold">Email:</span> {{ profile.payload.email }}</div>
          <div><span class="font-semibold">XPUB:</span> {{ profile.payload.xpub }}</div>
          <div><span class="font-semibold">Auth Code:</span> {{ profile.payload.auth_code }}</div>
        </section>

        <!-- Balances -->
        <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-2">
          <div><span class="font-semibold">Liquid Balance:</span> {{ formatBtc(profile.payload.balance_derived) }} BTC</div>
          <div><span class="font-semibold">Wallet Balance:</span> {{ formatBtc(profile.payload.balance_onchain) }} BTC</div>
        </section>

        <!-- Add funds -->
        <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-4">
          <h2 class="text-2xl font-bold">Add funds</h2>

          <div v-if="addrError" class="p-3 rounded border border-red-500/40 bg-red-500/10 text-red-200 text-sm">
            {{ addrError }}
          </div>

          <div v-else-if="addrLoading" class="text-white/80 text-sm">Fetching top-up address…</div>

          <div v-else-if="address" class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="font-semibold">Address:</span>
              <code class="px-2 py-1 rounded bg-black/30 border border-white/10 break-all text-xs sm:text-sm">{{ address }}</code>
              <button
                class="ml-auto sm:ml-0 px-3 py-1 rounded bg-white/10 border border-white/20 hover:bg-white/15 text-sm"
                @click="copyAddress"
              >
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
            </div>
<!-- QR SVG -->
<div class="flex justify-center">
  <div class="qr-box rounded-lg bg-white text-black w-1/2 aspect-square overflow-hidden">
    <div class="w-full h-full" v-html="qrSvgProcessed"></div>
  </div>
</div>





          </div>
        </section>
      </div>
    </div>
  </main>
  <TheFooter/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUserProfile } from '../api/userProfile'
import { getTopupAddressQR } from '../api/qr' // adjust path
import TheFooter from '../components/TheFooter.vue'

// ---- QR SVG: make responsive ----
const qrSvg = ref('')
const qrSvgProcessed = computed(() => {
  if (!qrSvg.value) return ''
  const orig = qrSvg.value

  const wMatch = orig.match(/\bwidth="(\d+)"/)
  const hMatch = orig.match(/\bheight="(\d+)"/)
  const w = wMatch ? wMatch[1] : '0'
  const h = hMatch ? hMatch[1] : '0'

  let s = orig
  s = s.replace(/\s(width|height)="[^"]*"/g, '')
  if (!/viewBox=/.test(s)) {
    const vw = Number(w) > 0 ? Number(w) : 100
    const vh = Number(h) > 0 ? Number(h) : vw
    s = s.replace('<svg', `<svg viewBox="0 0 ${vw} ${vh}"`)
  }
  if (!/preserveAspectRatio=/.test(s)) {
    s = s.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"')
  }
  if (!/style=/.test(s)) {
    s = s.replace('<svg', '<svg style="width:100%;height:100%;display:block"')
  }
  return s
})

// ---- State ----
const profile = ref(null)
const loading = ref(false)
const error = ref(null)

const address = ref('')
const addrLoading = ref(false)
const addrError = ref(null)
const copied = ref(false)

// ---- Actions ----
async function load() {
  loading.value = true
  error.value = null
  try {
    profile.value = await getUserProfile()
  } catch (e) {
    error.value = e && e.message ? e.message : String(e)
    profile.value = null
  } finally {
    loading.value = false
  }
}

async function fetchTopup() {
  addrError.value = null
  addrLoading.value = true
  address.value = ''
  qrSvg.value = ''
  copied.value = false

  try {
    const res = await getTopupAddressQR(-1)
    address.value = String(res?.payload?.string || '')
    qrSvg.value = String(res?.payload?.qr_code || '')
    if (!address.value || !qrSvg.value) {
      addrError.value = 'Invalid response: missing address or QR code.'
    }
  } catch (e) {
    addrError.value = e && e.message ? e.message : String(e)
  } finally {
    addrLoading.value = false
  }
}

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(address.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = address.value
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy'); copied.value = true } catch {}
    document.body.removeChild(ta)
    setTimeout(() => { copied.value = false }, 1500)
  }
}

function formatBtc(sats) {
  return (Number(sats) / 1e8).toFixed(8)
}

onMounted(() => {
  load()
  fetchTopup()
})
</script>

<style scoped>
/* Force embedded QR SVG to fill its container */
div[v-html] svg {
  width: 100% !important;
  height: 100% !important;
}
/* Force embedded QR SVG to fill the square */
:deep(.qr-box svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}


</style>