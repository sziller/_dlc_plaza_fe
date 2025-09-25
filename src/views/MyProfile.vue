<template>
  <main class="min-h-screen text-white pt-[150px] px-6 pb-16 relative overflow-hidden">
    <!-- Gradient background (local class, no inline styles) -->
    <div class="fixed inset-0 -z-10 page-gradient"></div>

    <div class="max-w-7xl mx-auto space-y-8">
      <header class="flex items-center justify-between">
        <h1 class="text-5xl font-bold">My Profile</h1>
        <button
          class="px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 disabled:opacity-50"
          :disabled="loading"
          :aria-busy="loading ? 'true' : 'false'"
          @click="reloadAll"
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
        <!-- PENDING REGISTRATION (auth_code === 0) -->
        <section
          v-if="isPending"
          class="p-4 border border-amber-400/30 bg-amber-400/10 rounded-lg space-y-3"
        >
          <h2 class="text-2xl font-bold">Finish setting up your account</h2>

          <!-- Tiny warning banner -->
          <div
            class="flex items-start gap-3 p-3 rounded border border-amber-400/40 bg-amber-400/15 text-amber-100"
            role="status"
            aria-live="polite"
          >
            <span class="mt-0.5 inline-block text-amber-200" aria-hidden="true">⚠️</span>
            <p class="text-sm">
              You’re almost there. <span class="font-semibold">Sign out, sign back in</span>, then
              open the <span class="font-semibold">Cadena Signer</span> app and
              <span class="font-semibold">scan the QR code using the Signer app</span> to complete registration.
            </p>
          </div>

          <p class="text-white/80">
            To complete your registration, open the email we sent and click the confirmation link.
            Then download the <span class="font-semibold">Cadena&nbsp;Signer</span> app and
            <span class="font-semibold">scan the QR code using the Signer app</span>.
          </p>

          <div class="text-white/70 text-sm">
            <div><span class="font-semibold">Email:</span> {{ profile.payload.email }}</div>
            <div><span class="font-semibold">Status:</span> {{ registrationLevel }}</div>
          </div>

          <div class="text-white/60 text-sm">
            Once confirmed, sign back in and scan the QR code using the Signer app to complete registration.
          </div>
        </section>

        <!-- NORMAL PROFILE (auth_code !== 0) -->
        <template v-else>
          <!-- Basic info -->
          <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-2">
            <div><span class="font-semibold">Email:</span> {{ profile.payload.email }}</div>
            <div><span class="font-semibold">XPUB:</span> {{ profile.payload.xpub }}</div>
            <div><span class="font-semibold">Registration Level:</span> {{ registrationLevel }}</div>
          </section>

          <!-- Balances -->
          <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-2">
            <div><span class="font-semibold">Liquid Balance:</span> {{ formatBtc(profile.payload.balance_derived) }} BTC</div>
            <div><span class="font-semibold">Wallet Balance:</span> {{ formatBtc(profile.payload.balance_onchain) }} BTC</div>
          </section>

          <!-- Referrals -->
          <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-3">
            <h2 class="text-2xl font-bold">Referrals</h2>

            <div class="space-y-2" v-if="refCode">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                <span class="font-semibold">Your Code:</span>
                <code class="px-2 py-1 rounded bg-black/30 border border-white/10 break-all text-xs sm:text-sm">
                  {{ refCode }}
                </code>
                <button
                  class="sm:ml-auto px-3 py-1 rounded bg-white/10 border border-white/20 hover:bg-white/15 text-sm"
                  @click="copyText(refCode, 'code')"
                >
                  {{ copiedWhat === 'code' ? 'Copied' : 'Copy' }}
                </button>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                <span class="font-semibold">Share Link:</span>
                <a
                  v-if="refLink"
                  :href="refLink"
                  class="px-2 py-1 rounded bg-black/30 border border-white/10 break-all text-xs sm:text-sm underline"
                  target="_blank" rel="noopener"
                >{{ refLink }}</a>
                <span v-else class="text-white/60 text-sm">Not available</span>

                <button
                  v-if="refLink"
                  class="sm:ml-auto px-3 py-1 rounded bg-white/10 border border-white/20 hover:bg-white/15 text-sm"
                  @click="copyText(refLink, 'link')"
                >
                  {{ copiedWhat === 'link' ? 'Copied' : 'Copy' }}
                </button>
              </div>

              <div v-if="refParent" class="text-white/70 text-sm">
                Referred by: <code class="px-1 py-0.5 rounded bg-black/30 border border-white/10">{{ refParent }}</code>
              </div>
            </div>

            <div v-else class="text-white/70 text-sm">No referral code on file.</div>
          </section>

          <!-- Add funds -->
          <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-4">
            <h2 class="text-2xl font-bold">Add funds</h2>

            <div v-if="addrError" class="p-3 rounded border border-red-500/40 bg-red-500/10 text-red-200 text-sm">
              {{ addrError }}
            </div>

            <div v-else-if="addrLoading" class="text-white/80 text-sm">Fetching top-up address…</div>

            <div v-else-if="address" class="space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                <span class="font-semibold">Address:</span>
                <code class="px-2 py-1 rounded bg-black/30 border border-white/10 break-all text-xs sm:text-sm">{{ address }}</code>
                <button
                  class="sm:ml-auto px-3 py-1 rounded bg-white/10 border border-white/20 hover:bg-white/15 text-sm"
                  @click="copyAddress"
                  :aria-label="copied ? 'Address copied' : 'Copy address'"
                >
                  {{ copied ? 'Copied' : 'Copy' }}
                </button>
              </div>

              <!-- QR (sanitized SVG rendered as a data URL in an <img>) -->
              <div class="flex justify-center">
                <div class="qr-box rounded-lg bg-white text-black w-1/2 aspect-square overflow-hidden">
                  <img
                    v-if="qrDataUrl"
                    :src="qrDataUrl"
                    alt="QR code for your top-up address"
                    class="w-full h-full block"
                  />
                </div>
              </div>
            </div>
          </section>
        </template>
      </div>
    </div>
  </main>
  <TheFooter/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUserProfile } from '../api/userProfile'
import { getTopupAddressQR } from '../api/qr'
import TheFooter from '../components/TheFooter.vue'

// ---- State ----
const profile = ref(null)
const loading = ref(false)
const error = ref(null)

const address = ref('')
const addrLoading = ref(false)
const addrError = ref(null)
const copied = ref(false)

// ---- Load profile ----
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

async function reloadAll() {
  await load()
  if (!isPending.value) {
    await fetchTopup()
  } else {
    // clear any previously fetched address if user fell back to pending
    address.value = ''
    qrRawSvg.value = ''
  }
}

// ---- QR: fetch & sanitize -> data URL for <img> ----
const qrRawSvg = ref('')

async function fetchTopup() {
  addrError.value = null
  addrLoading.value = true
  address.value = ''
  qrRawSvg.value = ''
  copied.value = false

  try {
    const res = await getTopupAddressQR(-1)
    address.value = String(res?.payload?.string || '')
    const svg = String(res?.payload?.qr_code || '')
    if (!address.value || !svg) {
      addrError.value = 'Invalid response: missing address or QR code.'
    } else {
      qrRawSvg.value = svg
    }
  } catch (e) {
    addrError.value = e && e.message ? e.message : String(e)
  } finally {
    addrLoading.value = false
  }
}

// Very small allowlist sanitizer for QR SVGs
function sanitizeSvg(svgText) {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgText, 'image/svg+xml')
    const allowedTags = new Set(['svg', 'g', 'path', 'rect'])
    const allowedAttrs = new Set([
      'viewBox', 'xmlns', 'version', 'fill', 'stroke', 'd', 'x', 'y', 'width', 'height',
      'rx', 'ry', 'transform', 'shape-rendering', 'stroke-width'
    ])

    const walker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT, null)
    const toRemove = []

    // walk & prune
    let node = walker.nextNode()
    while (node) {
      const el = node
      const tag = el.tagName?.toLowerCase?.()
      if (!allowedTags.has(tag)) {
        toRemove.push(el)
      } else {
        // remove disallowed attributes (incl. any on*)
        for (const attr of Array.from(el.attributes)) {
          const name = attr.name
          if (name.startsWith('on') || name === 'style' || name === 'href' || name === 'xlink:href') {
            el.removeAttribute(name)
            continue
          }
          if (!allowedAttrs.has(name)) el.removeAttribute(name)
        }
      }
      node = walker.nextNode()
    }
    for (const n of toRemove) n.parentNode?.removeChild(n)

    // make responsive: strip width/height on root, ensure viewBox + preserveAspectRatio
    const root = doc.documentElement
    root.removeAttribute('width')
    root.removeAttribute('height')
    if (!root.getAttribute('viewBox')) {
      // fallback viewBox if missing; QR is square
      root.setAttribute('viewBox', '0 0 50 50')
    }
    root.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    // serialize
    return new XMLSerializer().serializeToString(doc)
  } catch {
    return ''
  }
}

const qrDataUrl = computed(() => {
  if (!qrRawSvg.value) return ''
  const clean = sanitizeSvg(qrRawSvg.value)
  if (!clean) return ''
  // Encode to base64 data URL for <img>
  const b64 = btoa(unescape(encodeURIComponent(clean)))
  return `data:image/svg+xml;base64,${b64}`
})

// ---- Copy address ----
async function copyAddress() {
  try {
    await navigator.clipboard.writeText(address.value)
    copied.value = true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = address.value
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy'); copied.value = true } catch {}
    document.body.removeChild(ta)
  } finally {
    setTimeout(() => { copied.value = false }, 1500)
  }
}

function formatBtc(sats) {
  return (Number(sats) / 1e8).toFixed(8)
}

// Referral helpers (JS)
const copiedWhat = ref('') // '' | 'code' | 'link'

const rawRefCode = computed(() => profile.value?.payload?.referral_code || '')
const refCode = computed(() => {
  const s = String(rawRefCode.value || '')
  return s.startsWith('refcode:') ? s.slice('refcode:'.length) : s
})

// prefer canonical domain if you have it; else current origin
const siteBase = (import.meta.env && import.meta.env.VITE_SITE_BASE) || window.location.origin
const refLink = computed(() => (refCode.value ? `${siteBase}/?ref=${encodeURIComponent(refCode.value)}` : ''))
const refParent = computed(() => profile.value?.payload?.par_referral_code || null)

async function copyText(text, which) {
  try {
    await navigator.clipboard.writeText(text)
    copiedWhat.value = which // 'code' | 'link'
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy'); copiedWhat.value = which } catch {}
    document.body.removeChild(ta)
  } finally {
    setTimeout(() => { copiedWhat.value = '' }, 1500)
  }
}

const isPending = computed(() => Number(profile.value?.payload?.auth_code) === 0)

const registrationLevel = computed(() => {
  const code = Number(profile.value?.payload?.auth_code)
  if (code === 6) return 'Signer'
  if (code === 2) return 'Registered'
  if (code === 0) return 'Pending email confirmation'
  if (!Number.isFinite(code)) return '—'
  return `Code ${code}`
})

onMounted(async () => {
  await load()
  if (!isPending.value) {
    await fetchTopup()
  }
})
</script>

<style scoped>
/* Gradient background (local, CSP-safe; purple glow from bottom) */
.page-gradient{
  background-color: #000;
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,
      rgba(103,56,228,0.58) 0%,
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%
    );
}
@supports (background: radial-gradient(in oklch, black, white)) {
  .page-gradient{
    background-color: oklch(0 0 0);
    background-image:
      radial-gradient(
        in oklch 125% 75% at 50% 100%,
        oklch(from #6738e4 l c h / 0.60) 0%,
        oklch(from #6738e4 l c h / 0.36) 26%,
        oklch(from #6738e4 l c h / 0.16) 52%,
        oklch(0 0 0 / 0) 76%
      );
  }
}
@media (max-height: 800px){
  .page-gradient{
    background-image:
      radial-gradient(
        120% 60% at 50% 100%,
        rgba(103,56,228,0.52) 0%,
        rgba(103,56,228,0.30) 24%,
        rgba(103,56,228,0.12) 48%,
        rgba(0,0,0,0) 70%
      );
  }
}

.qr-box{
  display: grid;
  place-items: center;   /* center the image box */
}

.qr-box img{
  width: 100%;
  height: 100%;
  object-fit: contain;   /* keep aspect, no crop */
  object-position: center;
  display: block;
}
</style>
