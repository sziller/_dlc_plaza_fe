<template>
  <main class="min-h-screen text-white pt-[150px] px-6 pb-16 relative overflow-hidden">
    <!-- Gradient background (local, no inline styles) -->
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

          <!-- Create Loan -->
          <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-3">
            <h2 class="text-2xl font-bold">Create Loan</h2>
            <p class="text-white/70 text-sm">
              Borrow against your Bitcoin or lend for fixed fiat returns.
            </p>
            <router-link
              to="/btcusd"
              class="inline-flex items-center gap-2 self-start rounded-full border border-white/40 px-6 py-2 text-sm font-semibold text-white transition hover:border-secondary hover:text-secondary"
            >
              Create Loan
            </router-link>
          </section>

          <!-- Open Orders -->
          <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-3">
            <h2 class="text-2xl font-bold">Locked Collateral</h2>
            <UsersLiquidity />
          </section>

          <!-- Users DLCs -->
          <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-3">
            <UsersDLCS />
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

          <!-- Mailing list -->
          <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-3">
            <h2 class="text-2xl font-bold">Stay in the loop</h2>
            <p class="text-white/70 text-sm">
              Educational explainers, product updates, and occasional announcements to help you get more comfortable
              with Cadena’s technology.
            </p>
            <button
              type="button"
              class="inline-flex items-center gap-2 self-start rounded-full border border-white/40 px-6 py-2 text-sm font-semibold text-white transition hover:border-secondary hover:text-secondary"
              @click="showMailingList = true"
            >
              Join our mailing list
            </button>
          </section>

          <!-- Add funds -->
          <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-4">
            <h2 class="text-2xl font-bold">Add funds</h2>

            <!-- Needs Signer pairing (detected from auth_code or 422 response) -->
            <div
              v-if="needsSigner || addrErrorKind === 'setup'"
              class="p-3 rounded border border-amber-400/30 bg-amber-400/10 text-amber-100 text-sm space-y-1"
              role="status"
            >
              <p class="font-semibold">Pair the Cadena Signer to get your deposit address.</p>
              <p class="text-amber-100/80">
                Download the <span class="font-semibold">Cadena Signer</span> app, sign out, sign back in, then
                scan the QR code using the Signer app to complete setup.
              </p>
            </div>

            <!-- Session expired -->
            <div
              v-else-if="addrErrorKind === 'auth'"
              class="p-3 rounded border border-red-500/40 bg-red-500/10 text-red-200 text-sm flex items-center justify-between gap-3"
            >
              <span>Your session has expired. Please sign out and sign back in.</span>
              <button
                type="button"
                class="shrink-0 rounded border border-white/30 px-3 py-1 text-white hover:bg-white/10 transition"
                @click="logout(); router.push('/login')"
              >
                Sign out
              </button>
            </div>

            <!-- Generic fetch error -->
            <div
              v-else-if="addrErrorKind === 'generic'"
              class="p-3 rounded border border-red-500/40 bg-red-500/10 text-red-200 text-sm flex items-center justify-between gap-3"
            >
              <span>Could not load your deposit address. Please try again or contact support.</span>
              <button
                type="button"
                class="shrink-0 rounded border border-white/30 px-3 py-1 text-white hover:bg-white/10 transition"
                @click="fetchTopup"
              >
                Retry
              </button>
            </div>

            <div v-else-if="addrLoading" class="text-white/80 text-sm">Fetching top-up address…</div>

            <div v-else class="space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2" v-if="address">
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

              <!-- QR (same logic as registration page), now bigger/wider -->
              <div class="flex justify-center">
                <div
                  class="qr-box rounded-lg bg-white text-black w-full max-w-[420px] aspect-square overflow-hidden flex items-center justify-center"
                >
                  <template v-if="qrCode">
                    <img
                      :src="qrCode"
                      alt="QR code for your top-up / signer link"
                      class="w-full h-full block object-contain"
                    />
                  </template>
                  <p v-else class="text-black text-sm px-2 text-center">Loading QR Code…</p>
                </div>
              </div>

              <div v-if="qrError" class="text-red-200 text-sm">
                {{ qrError }}
              </div>
            </div>
          </section>

          <!-- ===== Past DLCs (settled > 2 days ago) ===== -->
          <section class="p-4 border border-white/20 bg-white/5 rounded-lg space-y-3">
            <h2 class="text-2xl font-bold">DLC History</h2>

            <div v-if="pastError === 'auth'" class="p-3 rounded border border-red-500/40 bg-red-500/10 text-red-200 text-sm flex items-center justify-between gap-3">
              <span>Your session has expired. Please sign out and sign back in.</span>
              <button
                type="button"
                class="shrink-0 rounded border border-white/30 px-3 py-1 text-white hover:bg-white/10 transition"
                @click="logout(); router.push('/login')"
              >Sign out</button>
            </div>
            <div v-else-if="pastError" class="p-3 rounded border border-red-500/40 bg-red-500/10 text-red-200 text-sm">
              Could not load DLC history. Please refresh or contact support.
            </div>

            <div v-else-if="pastLoading" class="text-white/80 text-sm">Loading past DLCs…</div>

            <div v-else>
              <div v-if="pastRows.length === 0" class="text-white/70 text-sm">No past DLCs found.</div>

              <div v-else class="overflow-auto -mx-2">
                <table class="min-w-full table-auto border-collapse text-white mx-2">
                  <thead>
                    <tr class="text-left text-sm md:text-base">
                      <th class="px-3 py-2 whitespace-nowrap">DLC ID</th>
                      <th class="px-3 py-2 whitespace-nowrap">Term</th>
                      <th class="px-3 py-2 whitespace-nowrap">LTV</th>
                      <th class="px-3 py-2 whitespace-nowrap">Annualized</th>
                      <th class="px-3 py-2 whitespace-nowrap">Settled At</th>
                    </tr>
                  </thead>
                  <tbody class="text-white/90 text-sm md:text-base">
                    <tr
                      v-for="r in pastRows"
                      :key="r.fullId"
                      class="border-b border-white/10 hover:bg-white/5 cursor-pointer transition"
                      role="button"
                      tabindex="0"
                      @click="selectPast(r)"
                      @keydown.enter.prevent="selectPast(r)"
                      @keydown.space.prevent="selectPast(r)"
                    >
                      <td class="px-3 py-2">{{ r.idShort }}</td>
                      <td class="px-3 py-2">{{ r.term }}</td>
                      <td class="px-3 py-2">{{ r.ltv }}</td>
                      <td class="px-3 py-2">{{ r.annualized }}</td>
                      <td class="px-3 py-2">{{ r.settledAt }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <!-- ===== Danger Zone ===== -->
          <section class="p-4 border border-red-500/40 bg-red-500/10 rounded-lg space-y-3">
            <h2 class="text-2xl font-bold text-red-200">Delete Account</h2>
            <p class="text-red-200/80 text-sm">
              This will permanently delete your Cadena account and associated data. This action cannot be undone.
            </p>
            <button
              class="px-4 py-2 rounded bg-red-600/90 hover:bg-red-600 text-white font-semibold"
              @click="delOpen = true"
            >
              Delete account
            </button>
          </section>
        </template>
      </div>
    </div>
  </main>

  <!-- DLC Detail Modal -->
  <DlcDetails
    v-if="selectedDlc"
    :dlc="selectedDlc"
    :is-own="true"
    :user-email="userEmail"
    @close="selectedDlc = null"
    @deleted="onPastDeleted"
  />

  <!-- Delete Account Confirm Modal -->
  <transition name="fade">
    <div
      v-if="delOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="del-title"
    >
      <!-- backdrop -->
      <div class="absolute inset-0 bg-black/70" @click="delOpen = false; delConfirm = ''; delEmail = ''; delError = null"></div>

      <!-- dialog -->
      <div class="relative w-[min(560px,92vw)] rounded-lg border border-white/20 bg-black p-6 text-white shadow-xl space-y-4">
        <h3 id="del-title" class="text-xl font-bold">Delete account</h3>

        <div class="space-y-2 text-white/80 text-sm leading-relaxed">
          <p>
            Deleting your account will permanently remove your <span class="font-semibold">Cadena</span> profile from our database.
            DLCs already <span class="font-semibold">in progress (active)</span> will remain unaffected.
          </p>
          <p>
            Your <span class="font-semibold">Seed Phrase</span> and <span class="font-semibold">XPUB</span> data on-chain stay valid — meaning:
          </p>
          <ul class="list-disc list-inside space-y-1 ml-3">
            <li>Funds on your existing Cadena-used addresses are unchanged.</li>
            <li>You can still use your Seed Phrase in other wallet software.</li>
            <li>We delete your email-linked records, forget your XPUB, UTXO-set, and any placed Offers.</li>
          </ul>
        </div>

        <p class="text-white/70 text-sm">
          To confirm deletion, please type <code class="px-1 py-0.5 rounded bg-black/40 border border-white/10">DELETE</code> and your
          <span class="font-semibold">current email address</span> below.
        </p>

        <div class="space-y-2">
          <input
            v-model.trim="delConfirm"
            type="text"
            autocomplete="off"
            spellcheck="false"
            class="w-full px-3 py-2 rounded bg-white text-black"
            placeholder='Type "DELETE"'
            :disabled="delBusy"
          />
          <input
            v-model.trim="delEmail"
            type="email"
            autocomplete="off"
            spellcheck="false"
            class="w-full px-3 py-2 rounded bg-white text-black"
            placeholder="Enter your email address"
            :disabled="delBusy"
          />
        </div>

        <div v-if="delError" class="p-2 rounded border border-red-500/40 bg-red-500/10 text-red-200 text-sm">
          {{ delError }}
        </div>

        <div class="flex justify-end gap-2">
          <button
            class="px-3 py-2 rounded border border-white/20 hover:bg-white/10"
            @click="delOpen = false; delConfirm = ''; delEmail = ''; delError = null"
            :disabled="delBusy"
          >
            Cancel
          </button>
          <button
            class="px-3 py-2 rounded bg-red-600/90 hover:bg-red-600 disabled:opacity-50"
            :disabled="delBusy || delConfirm !== 'DELETE' || delEmail.toLowerCase() !== userEmail"
            @click="onConfirmDelete"
          >
            {{ delBusy ? 'Deleting…' : 'Delete account' }}
          </button>
        </div>
      </div>
    </div>
  </transition>

  <TheFooter/>

  <MailingListModal
    :open="showMailingList"
    :default-email="profile?.payload?.email || ''"
    @close="showMailingList = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { getTopupAddressQR } from '../api/qr'
import { getUserDlcs } from '../api/userDlcs'
import { satsForm } from '../functions/amount_formatting'
import { deleteSelf } from '../api/deleteSelf'
import TheFooter from '../components/TheFooter.vue'
import DlcDetails from '../components/DLCDetails.vue'
import MailingListModal from '../components/MailingListModal.vue'
import UsersLiquidity from '../components/UsersLiquidity.vue'
import UsersDLCS from '../components/UsersDLCS.vue'
import { isSignerAuthCode } from '../lib/authCode'

// ---- Router & Auth ----
const router = useRouter()
const {
  user,
  setUserFromApi,
  loading: authLoading,
  error: authError,
  logout,
} = useAuth()

// Expose the same shape your template expects: profile?.payload.??
const profile = computed(() => {
  const u = user.value
  if (!u) return null
  return { payload: u?.payload ?? u }
})
const userEmail = computed(() => String(profile.value?.payload?.email || '').trim().toLowerCase())

// ---- Local UI state ----
const loading = computed(() => !!authLoading.value)
const error   = computed(() => String(authError.value || ''))

const address = ref('')
const addrLoading = ref(false)
const addrError = ref(null)
const copied = ref(false)

// QR (top-up address)
const qrCode = ref(null)
const qrError = ref(null)

// ---- Load profile ----
async function load() {
  await setUserFromApi()
}

// Full refresh
async function reloadAll() {
  await load()
  await nextTick()
  if (!isPending.value && !needsSigner.value) {
    await fetchTopup()
  } else {
    address.value = ''
    qrCode.value = null
    addrError.value = null
  }
  await fetchPastDlcs()
}

// ---- Address fetch (keep) ----
async function fetchTopup() {
  addrError.value = null
  qrError.value = null
  addrLoading.value = true
  address.value = ''
  qrCode.value = null
  copied.value = false

  try {
    const res = await getTopupAddressQR()

    const addr = String(res?.payload?.string || '')
    if (!addr) throw new Error('Top-up address not found in response payload.')
    address.value = addr

    const svg = res?.payload?.qr_code
    if (typeof svg !== 'string') {
      qrError.value = 'QR code not found in response payload.'
    } else {
      try {
        qrCode.value = buildSvgDataUri(svg)
      } catch (err) {
        qrError.value = err?.message || 'Failed to load QR code.'
      }
    }
  } catch (e) {
    addrError.value = e?.message || String(e) || 'Unknown error'
  } finally {
    addrLoading.value = false
  }
}

// ---- QR load (copied from registration page style) ----
const buildSvgDataUri = (svgLike) => {
  const val = String(svgLike || '').trim()
  if (!val) throw new Error('Empty QR')
  if (/^data:image\/svg\+xml[,;]/i.test(val)) return val
  if (/^https?:\/\//i.test(val)) return val
  if (val.startsWith('<svg') || val.startsWith('<?xml')) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(val)
  }
  if (val.startsWith('%3Csvg') || val.startsWith('%3C?xml')) {
    return 'data:image/svg+xml,' + val
  }
  throw new Error('Unexpected QR format.')
}

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
  return satsForm(sats)
}

// ---- Referrals ----
const copiedWhat = ref('') // '' | 'code' | 'link'
const rawRefCode = computed(() => profile.value?.payload?.referral_code || '')
const refCode = computed(() => {
  const s = String(rawRefCode.value || '')
  return s.startsWith('refcode:') ? s.slice('refcode:'.length) : s
})
const siteBase = (import.meta.env && import.meta.env.VITE_SITE_BASE) || window.location.origin
const refLink = computed(() => (refCode.value ? `${siteBase}/?ref=${encodeURIComponent(refCode.value)}` : ''))
const refParent = computed(() => profile.value?.payload?.par_referral_code || null)

async function copyText(text, which) {
  try {
    await navigator.clipboard.writeText(text)
    copiedWhat.value = which
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

// ---- Registration state ----
const isPending   = computed(() => Number(profile.value?.payload?.auth_code) === 0)
const needsSigner = computed(() => {
  const code = Number(profile.value?.payload?.auth_code)
  return Number.isFinite(code) && code !== 0 && !isSignerAuthCode(code)
})
const registrationLevel = computed(() => {
  const code = Number(profile.value?.payload?.auth_code)
  if (isSignerAuthCode(code)) return 'Signer'
  if (code === 2) return 'Registered'
  if (code === 0) return 'Pending email confirmation'
  if (!Number.isFinite(code)) return '—'
  return `Code ${code}`
})

// Classify deposit-address errors so we can show targeted messages
const addrErrorKind = computed(() => {
  const e = String(addrError.value || '').toLowerCase()
  if (!e) return null
  if (e.includes('unauthorized') || e.includes('401')) return 'auth'
  if (e.includes('422') || e.includes('unprocessable')) return 'setup'
  return 'generic'
})

const showMailingList = ref(false)

/* ======================= Past DLCs ======================= */
const pastLoading = ref(false)
const pastError = ref(null)
const pastRows = ref([])
const pastApiDlcs = ref([])
const selectedDlc = ref(null)

const STATUSES = Object.freeze([
  'offer_p','offer_dlc','sign_ini','sign_acc','signed',
  'broadcast','active','attested','executed','settled','revoked','reset','confirmed'
])

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000
const toMs = (v) => {
  if (v == null) return null
  const n = Number(v)
  if (Number.isFinite(n)) return n < 1e12 ? n * 1000 : n
  const p = Date.parse(String(v))
  return Number.isFinite(p) ? p : null
}
const isYearish = (days) => {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
const displayDays = (days) => (isYearish(days) ? 365 : Math.round(Number(days) || 0))
const parseTermDays = (pid, duration) => {
  const fromPid = String(pid || '').match(/d-(\d+(\.\d+)?)/i)
  if (fromPid) return Math.round(Number(fromPid[1]))
  const d = Number(duration)
  return Number.isFinite(d) && d > 0 ? Math.round(d) : null
}
const parseLtv = (pid) => {
  const m = String(pid || '').match(/ltv-(\d{1,3})/i)
  return m ? Number(m[1]) : null
}
const annualize360 = (termPct, days) => {
  const r = Number(termPct)
  const d = Number(days)
  if (!Number.isFinite(r) || !Number.isFinite(d) || d <= 0) return NaN
  return r * (360 / d)
}
const pct2 = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '—')
const shortId = (s) => (s ? String(s).slice(0, 8) : '—')
const fmtDate = (ms) => (ms ? new Date(ms).toLocaleString() : '—')
const settledTimeMs = (d) => {
  const candidates = [
    d.settled_at, d.settledAt,
    d.closed_at, d.closedAt,
    d.maturity_at, d.maturityAt, d.maturity_date, d.maturityDate,
    d.updated_at, d.updatedAt,
  ]
  for (const c of candidates) {
    const ms = toMs(c)
    if (ms) return ms
  }
  return null
}

async function fetchPastDlcs() {
  pastLoading.value = true
  pastError.value = null
  pastRows.value = []
  pastApiDlcs.value = []
  try {
    const res = await getUserDlcs(STATUSES)
    const items = Array.isArray(res?.payload) ? res.payload : []

    const now = Date.now()
    const past = items
      .filter(d => String(d?.status ?? '').toLowerCase() === 'settled')
      .map(d => ({ d, t: settledTimeMs(d) }))
      .filter(({ t }) => t && (now - t) > TWO_DAYS_MS)

    pastApiDlcs.value = past.map(p => p.d)

    const rows = past
      .map(({ d, t }) => {
        const rawDays = parseTermDays(d.product_id, d.duration)
        const uiDays  = rawDays ? displayDays(rawDays) : null
        const ltv = parseLtv(d.product_id)
        const ear = annualize360(Number(d.interest), rawDays)
        const id = d.dlc_id || d.tmp_cntr_id || ''
        return {
          fullId: id,
          idShort: shortId(id),
          term: uiDays ? `${uiDays} Days` : '—',
          ltv: ltv != null ? `${ltv}%` : '—',
          annualized: pct2(ear),
          settledAt: fmtDate(t),
          t,
        }
      })
      .sort((a, b) => (b.t || 0) - (a.t || 0))

    pastRows.value = rows
  } catch (e) {
    const msg = String(e?.message || '').toLowerCase()
    if (msg.includes('unauthorized') || msg.includes('401')) {
      pastError.value = 'auth'
    } else {
      pastError.value = 'generic'
    }
  } finally {
    pastLoading.value = false
  }
}

function selectPast(row) {
  const match = pastApiDlcs.value.find(d => (d.dlc_id || d.tmp_cntr_id) === row.fullId)
  if (match) selectedDlc.value = match
}
function onPastDeleted() {
  selectedDlc.value = null
  fetchPastDlcs()
}

/* ======================= Delete account ======================= */
const delOpen = ref(false)
const delBusy = ref(false)
const delError = ref(null)
const delConfirm = ref('')
const delEmail = ref('')

async function onConfirmDelete() {
  if (delBusy.value) return

  if (delConfirm.value !== 'DELETE' || delEmail.value.toLowerCase() !== userEmail.value) {
    delError.value = 'Confirmation text or email does not match.'
    return
  }

  delBusy.value = true
  delError.value = null
  try {
    // pass email to API (lowercased)
    await deleteSelf(delEmail.value.toLowerCase())
    logout()
    await router.replace('/login?deleted=1')
  } catch (e) {
    delError.value = e?.message || 'Failed to delete account.'
  } finally {
    delBusy.value = false
  }
}

/* ===================== Lifecycle ===================== */
onMounted(async () => {
  await load()
  if (!isPending.value && !needsSigner.value) {
    await fetchTopup()
  }
  await fetchPastDlcs()
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
  place-items: center;
}

.qr-box img{
  width: 100%;
  height: 420px;
  object-fit: contain;
  object-position: center;
  display: block;
}

.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
