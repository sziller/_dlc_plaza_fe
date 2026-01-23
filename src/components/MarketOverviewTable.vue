<!-- MarketOverview.vue -->
<template>
  <section class="w-full h-full" :class="{ compact }">
    <div class="w-full h-full mx-auto">
      <div
        class="rounded-xl border border-secondary shadow-lg bg-dark p-6 h-full min-h-0 flex flex-col"
        :style="{ '--secondary': currentAccent }"
      >
        <!-- Header: title only -->
        <div class="mb-6 shrink-0">
          <div class="text-3xl font-extrabold text-center title-text">
            {{ title }}
          </div>
        </div>

        <!-- Content Wrapper -->
        <div
          v-if="isServerDown"
          class="flex flex-col items-center justify-center text-center gap-4 rounded-lg border border-white/15 bg-white/5 p-6 sm:p-8 flex-1"
        >
          <div class="text-2xl font-semibold">Cadena is undergoing maintenance</div>
          <p class="text-white/80 text-base max-w-2xl">
            {{ serverStatusMessage || 'There are no live rates right now and logins are temporarily disabled. Please try again shortly.' }}
          </p>
        </div>
        <div v-else class="overflow-y-auto overflow-x-hidden flex-1 min-h-0">
          <!-- ✅ Desktop/Tablet -->
          <div class="hidden sm:block overflow-x-hidden">
            <table class="w-full table-fixed border-separate border-spacing-y-4 border-spacing-x-2">
              <thead>
                <tr>
                  <!-- LEFT CONTROL CELL (over Term) -->
                  <th class="px-2 py-4 text-left align-middle">
                    <div class="relative inline-block">
                      <button
                        type="button"
                        class="custom-dd-trigger custom-dd-trigger--lg"
                        @click="toggleDropdown"
                      >
                        <span>{{ displayContractLabel }}</span>
                        <svg class="w-6 h-6 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </button>

                      <!-- Dropdown + explanatory box wrapper (desktop only) -->
                      <div v-if="dropdownOpen" class="custom-dd-wrap sm:flex hidden">
                        <div class="custom-dd-menu custom-dd-menu--th">
                          <button
                            v-for="opt in contractOptions"
                            :key="opt.value"
                            type="button"
                            class="custom-dd-item"
                            :class="opt.value === selectedContract ? 'active' : ''"
                            @click="selectContract(opt.value)"
                          >
                            {{ opt.label }}
                          </button>
                        </div>

                        <!-- Info box -->
                        <aside class="custom-dd-infobox" role="note" aria-live="polite">
                          <div class="infobox-title">What you’re changing</div>
                          <p class="infobox-text">
                            <strong>Contract size</strong> is the notional BTC for each deal. It
                            filters quotes to this size and is baked into the product ID you’ll trade.
                          </p>
                          <ul class="infobox-list">
                            <li>We’ll show the best Lend/Borrow quotes that match this size.</li>
                            <li>You can switch sizes anytime; the table will refresh.</li>
                          </ul>
                        </aside>
                      </div>
                    </div>
                  </th>

                  <!-- Group header -->
                  <th
                    colspan="2"
                    class="group-header rounded-md text-white text-center px-4 py-4 align-middle font-bold text-lg whitespace-nowrap"
                  >
                    <span class="gh-label">{{ leftGroupLabel }}</span>
                  </th>
                </tr>

                <tr class="text-white text-md">
                  <th class="px-4 py-4 text-left">Term</th>
                  <th class="px-4 py-4">
                    <div class="chip w-full text-center min-w-[6rem]">Lend</div>
                  </th>
                  <th class="px-4 py-4">
                    <div class="chip w-full text-center min-w-[6rem]">Borrow</div>
                  </th>
                </tr>
              </thead>

              <tbody class="text-white/90 text-lg">
                <tr
                  v-for="(term, index) in terms"
                  :key="term.label"
                  class="transition duration-200"
                >
                  <td class="px-4 py-4 text-left font-semibold">
                    {{ term.label }}
                  </td>

                  <!-- Left group cells (50% LTV) -->
                  <td
                    v-for="(key) in leftKeys"
                    :key="key"
                    @click="handleCellClick(term, key)"
                    class="px-4 py-4 text-center bg-white/10 rounded-md transition-transform transform hover:scale-105 cursor-pointer minw hover-glow"
                  >
                    <div>
                      <span
                        :class="[
                          flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''
                        ]"
                        class="text-3xl font-bold leading-tight rate"
                      >
                        {{ getEar(term, key) }}
                      </span>

                      <template v-if="term.label !== '365 Days'">
                        <div class="text-[10px] text-white/70 -mt-1">
                          Annualized yield
                        </div>
                        <div class="text-xs text-white/90 mt-1">
                          {{ term[key] }} for {{ term.label }}
                        </div>
                      </template>
                    </div>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>

          <!-- 📱 Mobile -->
          <div class="sm:hidden space-y-4">
            <!-- mobile control row (global) -->
            <div class="flex items-center justify-between">
              <div class="text-white/70 text-xs uppercase tracking-wide">Contract size</div>
              <div class="relative inline-block">
                <button
                  type="button"
                  class="custom-dd-trigger"
                  @click="toggleDropdown"
                >
                  <span>{{ displayContractLabel }}</span>
                  <svg class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <div v-if="dropdownOpen" class="custom-dd-menu custom-dd-menu--th">
                  <button
                    v-for="opt in contractOptions"
                    :key="`m-${opt.value}`"
                    type="button"
                    class="custom-dd-item"
                    :class="opt.value === selectedContract ? 'active' : ''"
                    @click="selectContract(opt.value)"
                  >
                    {{ opt.label }}
                  </button>
                </div>

                <!-- Mobile info box under the button -->
                <aside v-if="dropdownOpen" class="custom-dd-infobox-mobile mt-2" role="note" aria-live="polite">
                  <div class="infobox-title">What you’re changing</div>
                  <p class="infobox-text">
                    <strong>Contract size</strong> sets the BTC notional for each deal and filters the quotes shown below.
                  </p>
                  <ul class="infobox-list">
                    <li>Size changes BTC amounts, not the % rate.</li>
                    <li>Table refreshes to this size.</li>
                  </ul>
                </aside>
              </div>
            </div>

            <div
              v-for="(term, index) in terms"
              :key="`m-${term.label}`"
              class="rounded-lg bg-white/5 p-3"
            >
              <div class="text-base font-semibold text-white mb-2">
                {{ term.label }}
              </div>

              <!-- 50% LTV -->
              <div class="rounded-md bg-white/5 p-0 mb-3">
                <div class="text-[10px] tracking-wide uppercase text-white/70 mb-2 font-semibold">
                  {{ leftGroupLabel }}
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="key in leftKeys"
                    :key="`m-${term.label}-${key}`"
                    type="button"
                    @click="handleCellClick(term, key)"
                    class="px-3 py-3 text-center bg-white/10 rounded-md transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer minw hover-glow"
                  >
                    <div class="space-y-1">
                      <div class="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                        {{ key.includes('a') ? 'Lend' : 'Borrow' }}
                      </div>
                      <span
                        :class="[
                          flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''
                        ]"
                        class="text-2xl font-bold leading-tight rate"
                      >
                        {{ getEar(term, key) }}
                      </span>
                      <template v-if="term.label !== '365 Days'">
                        <div class="text-[10px] text-white/70 -mt-0.5">
                          Annualized yield
                        </div>
                        <div class="text-[11px] text-white/90 mt-0.5">
                          {{ term[key] }} for {{ term.label }}
                        </div>
                      </template>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Modal -->
          <OrderModal
            v-if="showModal"
            :rate="selectedRate"
            :action-type="selectedAction"
            :term-days="selectedTermDays"
            :loading="modalLoading"
            :notice="modalNotice"
            :ltv="selectedLtv"
            :contract-size="selectedContract"
            @close="showModal = false"
            @submit="handleOrderSubmit"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import OrderModal from './OrderModal.vue'
import { getOffers, getUserOffers } from '../api/offers'
import { postOffer } from '../api/postOffer'
import { acceptOffer } from '../api/acceptOffer'
import { getToken } from '../api/token'
import { postProductQueryV0 } from '../api/productQuery' // uses ApiEnvelope<{...}[]>
import { getServerStatus } from '../api/serverStatus'

const router = useRouter()

// -------- Env: staging vs prod ----------
const IS_STAGING = (() => {
  const host = (typeof location !== 'undefined' ? location.hostname : '').toLowerCase()
  const IS_PROD = /^(?:www\.)?cadenabitcoin\.com$/.test(host) && host !== 'staging.cadenabitcoin.com'
  return !IS_PROD
})()

// -------- Accent colors per known sizes ----------
const CONTRACT_ACCENTS = {
  '0.01':  '#6738e4',
  '0.10':  '#8387c4',
  '1.00':  '#000000',
}

// -------- Props ----------
const props = defineProps({
  title: { type: String, default: 'BTCUSD Market Overview' },
  leftGroupLabel: { type: String, default: '50% LTV' },
  leftKeys: { type: Array, default: () => ['ltv50a', 'ltv50b'] },
  offersPollMs: { type: Number, default: 5000 },
  changeFlashMs: { type: Number, default: 600 },
  compact: { type: Boolean, default: true },
  accentColor: { type: String, default: null },
})

// -------- Auth state ----------
const isLoggedIn = ref(false)
function updateAuthState() {
  isLoggedIn.value = !!getToken()
}

// -------- Server availability ----------
const FORCE_SERVER_DOWN = false
const serverStatus = ref(FORCE_SERVER_DOWN ? 'down' : 'checking')
const serverStatusMessage = ref('')
const DEFAULT_DOWNTIME_MSG =
  'There are no live rates right now and you will not be able to log in while the Cadena servers are under maintenance. Please try again shortly.'

const isServerDown = computed(() => serverStatus.value === 'down')

async function checkServerStatus() {
  if (FORCE_SERVER_DOWN) {
    serverStatus.value = 'down'
    serverStatusMessage.value = DEFAULT_DOWNTIME_MSG
    return
  }
  try {
    const res = await getServerStatus()
    const payload = res?.payload
    if (payload?.ok && payload?.status === 'up') {
      serverStatus.value = 'up'
      serverStatusMessage.value = ''
      return
    }
    serverStatus.value = 'down'
    serverStatusMessage.value = DEFAULT_DOWNTIME_MSG
  } catch (error) {
    const statusCode = error?.response?.status
    if (statusCode === 429) {
      serverStatusMessage.value =
        'Too many health-check requests from this IP. Please wait a moment and refresh. Rates are temporarily unavailable and logins are disabled until we reconnect.'
    } else {
      serverStatusMessage.value = DEFAULT_DOWNTIME_MSG
    }
    serverStatus.value = 'down'
  }
}

// -------- Modal state ----------
const showModal = ref(false)
const selectedRate = ref('')
const selectedAction = ref('Lend')
const selectedTermDays = ref(30)
const selectedLtv = ref(50)
const selectedOfferId = ref(null)
const modalLoading = ref(false)
const modalNotice  = ref({ type: '', text: '' })

function handleCellClick(row, key) {
  modalNotice.value = { type: '', text: '' }
  selectedRate.value = row[key]
  selectedAction.value = key.includes('a') ? 'Lend' : 'Borrow'
  selectedTermDays.value = getDaysFromLabel(row.label)
  selectedLtv.value = 50
  const idKey = `${key}Id`
  selectedOfferId.value = row[idKey] || null
  showModal.value = true
}

async function handleOrderSubmit(data) {
  const type = (data.orderType || '').toLowerCase()
  modalNotice.value = { type: '', text: '' }

  if (!getToken()) {
    showModal.value = false
    router.push('/login')
    return
  }

  modalLoading.value = true

  if (type === 'market') {
    if (!selectedOfferId.value) {
      modalLoading.value = false
      modalNotice.value = { type: 'error', text: 'Missing offer id' }
      return
    }
    try {
      const res = await acceptOffer({ dlc_id: String(selectedOfferId.value) })
      console.log('Offer accepted:', res)
      modalNotice.value = { type: 'success', text: 'Market order accepted.' }
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || 'Accept failed.'
      modalNotice.value = { type: 'error', text: msg }
    } finally {
      modalLoading.value = false
    }
    return
  }

  if (type !== 'limit') return
  const interest = toNum(data.rate)
  if (!Number.isFinite(interest)) {
    modalLoading.value = false
    modalNotice.value = { type: 'error', text: 'Invalid rate.' }
    return
  }

  const days = Number(data.durationDays) || getDaysFromLabel(data.duration)
  const ltv = selectedLtv.value || 50
  const cntr = selectedContract.value || '0.10'
  const product_id = buildProductId(days, ltv, cntr)
  const tmp_cntr_id = genTmpCntrId()

  const params = {
    product_id,
    tmp_cntr_id,
    ini_role: String(data.action || '').toLowerCase(),
    interest,
  }

  try {
    const res = await postOffer(params)
    console.log('Offer posted:', res)
    modalNotice.value = { type: 'success', text: 'Limit order posted' }
  } catch (e) {
    const msg = e?.response?.data?.detail || e?.message || 'Offer failed.'
    modalNotice.value = { type: 'error', text: msg }
  } finally {
    modalLoading.value = false
  }
}

// -------- Table rows / offers polling ----------
const terms = ref([
  { label: '30 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId:null, ltv50bId:null },
  { label: '90 Days',  ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId:null, ltv50bId:null },
  { label: '180 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId:null, ltv50bId:null },
  { label: '365 Days', ltv50a: '*', ltv50aEar: '*', ltv50b: '*', ltv50bEar: '*', ltv50pid: null, ltv50aId:null, ltv50bId:null },
])

const flashActive = ref(new Set())
let offersIntervalId = null
let isFetchingOffers = false

const PID_PREFIX = 'LendBorrowBTCUSD:'

function isYearish(days) {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
function mapDaysForUi(d) { return isYearish(d) ? 365 : d }

function getEar(row, key) {
  const v = row[`${key}Ear`]
  return v ?? '*'
}
const TARGET_TERMS = [30, 90, 180, 365]

function parseLtv(pid) {
  const m = String(pid || '').match(/ltv-(\d{1,3})/i)
  return m ? Number(m[1]) : null
}
function parseContractFromPid(pid) {
  const m = String(pid || '').match(/c-([\d.]+)/i)
  if (m) {
    const v = Number(m[1])
    if (!Number.isFinite(v)) return '0.10'
    const decimals = v < 0.01 ? 3 : 2
    return v.toFixed(decimals)
  }
  return '0.10'
}
function parseTermRawFromPid(pid) {
  const m = String(pid || '').match(/d-(\d+(\.\d+)?)/i)
  return m ? Math.round(Number(m[1])) : null
}
function normalizeRawDays(pid, duration) {
  const fromPid = parseTermRawFromPid(pid)
  if (fromPid) return fromPid
  const d = Number(duration)
  return Number.isFinite(d) ? Math.round(d) : 30
}
function normalizeDisplayDays(pid, duration) {
  const raw = normalizeRawDays(pid, duration)
  return mapDaysForUi(raw)
}
const fmtPct2 = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '*')

function annualize360(termPct, days) {
  if (!Number.isFinite(termPct) || !days) return null
  if (isYearish(days)) return termPct
  return termPct * (360 / days)
}

function buildTermsFromOffers(offers, contractStr) {
  const best = {}
  for (const o of offers || []) {
    const ltv = parseLtv(o.product_id)
    const rawDays = normalizeRawDays(o.product_id, o.duration)
    const uiDays  = normalizeDisplayDays(o.product_id, o.duration)
    if (!ltv || !rawDays || !uiDays) continue
    if (!TARGET_TERMS.includes(uiDays)) continue

    const contract = parseContractFromPid(o.product_id)
    if (contract !== contractStr) continue

    best[uiDays] ??= {}
    best[uiDays][ltv] ??= {
      lend: { term: null, ear: null, id: null },
      borrow: { term: null, ear: null, id: null },
      pid: null,
    }

    const side = o.ini_role === 'borrow' ? 'lend' : o.ini_role === 'lend' ? 'borrow' : null
    if (!side) continue

    const earVal = annualize360(o.interest, rawDays)

    if (side === 'lend') {
      if (best[uiDays][ltv].lend.term == null || o.interest > best[uiDays][ltv].lend.term) {
        best[uiDays][ltv].lend.term = o.interest
        best[uiDays][ltv].lend.ear  = earVal ?? null
        best[uiDays][ltv].lend.id   = o.dlc_id
        best[uiDays][ltv].pid       = o.product_id
      }
    } else {
      if (best[uiDays][ltv].borrow.term == null || o.interest < best[uiDays][ltv].borrow.term) {
        best[uiDays][ltv].borrow.term = o.interest
        best[uiDays][ltv].borrow.ear  = earVal ?? null
        best[uiDays][ltv].borrow.id   = o.dlc_id
        best[uiDays][ltv].pid         = best[uiDays][ltv].pid || o.product_id
      }
    }
  }

  return TARGET_TERMS.map((d) => {
    const row = best[d] || {}
    const l50 = row[50] || { lend:{term:null,ear:null,id:null}, borrow:{term:null,ear:null,id:null}, pid:null }
    return {
      label: `${d} Days`,
      ltv50a: fmtPct2(l50.lend.term),   ltv50aEar: fmtPct2(l50.lend.ear),
      ltv50b: fmtPct2(l50.borrow.term), ltv50bEar: fmtPct2(l50.borrow.ear),
      ltv50pid: l50.pid,
      ltv50aId: l50.lend.id, ltv50bId: l50.borrow.id,
    }
  })
}

function markFlashOnce(cellId) {
  const next = new Set(flashActive.value)
  next.add(cellId)
  flashActive.value = next
  setTimeout(() => {
    const n2 = new Set(flashActive.value)
    n2.delete(cellId)
    flashActive.value = n2
  }, props.changeFlashMs)
}
function diffAndFlash(oldRows, newRows) {
  const keys = ['ltv50a', 'ltv50b']
  for (let i = 0; i < newRows.length; i++) {
    for (const base of keys) {
      const earKey = `${base}Ear`
      const prev = oldRows?.[i]?.[earKey]
      const next = newRows?.[i]?.[earKey]
      if (prev !== next) markFlashOnce(`${i}-${base}`)
    }
  }
}

// -------- Persist selected contract size ----------
const STORAGE_KEY = 'mo:selectedContract'
function loadPreferredContract() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v && typeof v === 'string' ? v : null
  } catch { return null }
}
function savePreferredContract(v) {
  try { localStorage.setItem(STORAGE_KEY, String(v)) } catch {}
}

// -------- Product catalog → dynamic contract sizes ----------
const products = ref([])
const selectedContract = ref(loadPreferredContract() || '0.10')
const dropdownOpen = ref(false)

function satsToBtcLabel(sats) {
  const n = Number(sats)
  if (!Number.isFinite(n)) return null
  const btc = n / 1e8
  const decimals = btc < 0.01 ? 3 : 2
  return btc.toFixed(decimals)
}

const availableContracts = computed(() => {
  const set = new Set()
  for (const p of products.value || []) {
    const label = satsToBtcLabel(p.contract_value)
    if (!label) continue
    if (Number(label) < 0.01) continue
    set.add(label)
  }
  return Array.from(set).sort((a, b) => Number(a) - Number(b))
})

const contractOptions = computed(() => {
  const arr = availableContracts.value
  if (arr.length) {
    return arr.map(v => ({ value: v, label: `${v} BTC` }))
  }
  const fallback = IS_STAGING ? ['0.01', '0.10', '1.00'] : ['0.01', '0.10', '1.00']
  return fallback.map(v => ({ value: v, label: `${v} BTC` }))
})

const displayContractLabel = computed(() =>
  (contractOptions.value.find(o => o.value === selectedContract.value)?.label) ||
  (contractOptions.value[0]?.label ?? '0.10 BTC')
)

const currentAccent = computed(() =>
  props.accentColor ||
  CONTRACT_ACCENTS[selectedContract.value] ||
  '#6738e4'
)

function toggleDropdown() { dropdownOpen.value = !dropdownOpen.value }
function selectContract(v) {
  selectedContract.value = v
  savePreferredContract(v)
  dropdownOpen.value = false
  loadOffersOnce()
}

// -------- Fetch products once, then offers --------
async function prefetchProducts() {
  try {
    const res = await postProductQueryV0([]) // [] => all products
    const payload = Array.isArray(res?.payload) ? res.payload : []
    products.value = payload

    // validate persisted choice against current options
    const opts = contractOptions.value
    const stored = loadPreferredContract()
    const valid = stored && opts.find(o => o.value === stored)

    if (valid && stored !== selectedContract.value) {
      selectedContract.value = stored // triggers watch → save + refresh
    } else if (!opts.find(o => o.value === selectedContract.value) && opts.length) {
      selectedContract.value = opts[0].value // triggers watch
    }
  } catch (e) {
    console.debug('Product catalog prefetch failed:', e)
  }
}

async function loadOffersOnce() {
  if (isServerDown.value || serverStatus.value === 'checking') return
  if (isFetchingOffers) return
  isFetchingOffers = true
  try {
    const token = getToken()
    const res = token
      ? await getUserOffers('both', false)
      : await getOffers('both')
    if (!res || !Array.isArray(res.payload)) throw new Error('Bad payload')
    const nextTerms = buildTermsFromOffers(res.payload, selectedContract.value)
    diffAndFlash(terms.value, nextTerms)
    terms.value = nextTerms
  } catch (e) {
    console.error('Failed to load offers:', e)
  } finally {
    isFetchingOffers = false
  }
}

function onVisChange() {
  if (!document.hidden) loadOffersOnce()
}

// keep tabs/windows in sync for this preference only
function onContractStorage(e) {
  if (e.key === STORAGE_KEY) {
    const v = e.newValue
    if (v && v !== selectedContract.value) {
      selectedContract.value = v // watch handles save + refresh
    }
  }
}

// -------- Lifecycle ----------
onMounted(async () => {
  updateAuthState()
  window.addEventListener('auth-changed', updateAuthState)
  window.addEventListener('storage', updateAuthState)
  window.addEventListener('focus', updateAuthState)

  document.addEventListener('visibilitychange', onVisChange)
  window.addEventListener('focus', loadOffersOnce)
  window.addEventListener('storage', onContractStorage)

  await checkServerStatus()
  if (serverStatus.value !== 'up') {
    return
  }

  await prefetchProducts()
  await loadOffersOnce()
  offersIntervalId = setInterval(loadOffersOnce, props.offersPollMs)
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', updateAuthState)
  window.removeEventListener('storage', updateAuthState)
  window.removeEventListener('focus', updateAuthState)

  document.removeEventListener('visibilitychange', onVisChange)
  window.removeEventListener('focus', loadOffersOnce)
  window.removeEventListener('storage', onContractStorage)

  if (offersIntervalId) clearInterval(offersIntervalId)
  flashActive.value = new Set()
})

// -------- Local helpers ----------
function buildProductId(days, ltv, contractStr) {
  const normalizedDays = isYearish(days) ? 365 : days
  const cleanContract = Number(contractStr)
  const decimals = (Number.isFinite(cleanContract) && cleanContract < 0.01) ? 3 : 2
  const cPart = Number.isFinite(cleanContract) ? cleanContract.toFixed(decimals) : '0.10'
  return `${PID_PREFIX}ltv-${ltv}_d-${normalizedDays}_c-${cPart}`
}
function getDaysFromLabel(label) {
  const m = String(label || '').match(/(\d+)/)
  return m ? Number(m[1]) : 30
}
function toNum(rateStr) {
  const m = String(rateStr ?? '').match(/([\d.]+)/)
  return m ? parseFloat(m[1]) : NaN
}
function genTmpCntrId() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

// Save + refresh whenever selection changes programmatically
watch(selectedContract, (v) => {
  savePreferredContract(v)
  loadOffersOnce()
})

defineExpose({ loadOffersOnce, getEar })
</script>

<style scoped>
.flash-text {
  animation: flashPop 0.18s ease-in-out;
}
@keyframes flashPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.07); }
  100% { transform: scale(1); }
}

@media (max-width: 640px) {
  table {
    border-spacing: 0.25rem 0.75rem !important;
    table-layout: fixed;
  }
  th, td {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    font-size: 0.8rem;
  }
  .spacer {
    display: none !important;
  }
  .-mt-1 { margin-top: -0.25rem; }
}

.spacer {
  width: 0.5rem;
  min-width: 0.5rem;
  max-width: 0.5rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.compact .rounded-xl { padding: 1rem; }
.compact .title-text { font-size: 1.75rem; margin-bottom: 0; }

/* keep spacing tight */
.compact table { border-spacing: 0.25rem 0.625rem !important; }
.compact thead th { padding: 0.45rem 0.6rem !important; }
/* don't clamp font-size too small for headers; let the gh-label scale instead */
.compact thead .group-header { padding: 0.5rem 0.75rem !important; }
.compact tbody td { padding: 0.6rem !important; }

.compact .rate { font-size: 1.6rem; line-height: 1.15; }
@media (min-width: 640px) {
  .compact .rate { font-size: 1.75rem; }
}
.compact [class*="text-[10px]"] { font-size: 10px !important; }
.compact .text-xs,
.compact [class*="text-[11px]"] { font-size: 11px !important; }

.minw { min-width: 6rem; }
.compact .minw { min-width: 5rem; }

@media (max-width: 640px) {
  .compact .p-3 { padding: 0.625rem !important; }
  .compact .mb-3 { margin-bottom: 0.625rem !important; }
  .compact .grid { gap: 0.5rem !important; }
  .compact .px-3.py-3 { padding: 0.625rem !important; }
}

/* group header uses accent */
.group-header {
  background: color-mix(in oklch, var(--secondary, #6738e4), black 12%);
  border: 1px solid color-mix(in oklch, var(--secondary, #6738e4), white 10%);
  line-height: 1.05; /* keep box height tight while text grows */
}

/* make the label text "fill" more of the header without growing the box */
.gh-label {
  display: inline-block;
  font-weight: 800;
  /* grows with viewport but stays within same header height */
  font-size: clamp(1rem, 1.4vw + 0.2rem, 1.35rem);
  letter-spacing: -0.015em; /* tighten just a touch so text looks fuller */
  white-space: nowrap;      /* no wrap to avoid taller header */
  line-height: 1.05;
  vertical-align: middle;
  text-wrap: balance;
}

/* chips use accent */
.chip {
  background: color-mix(in oklch, var(--secondary, #6738e4), black 10%);
  color: white;
  border-radius: 0.55rem;
  font-weight: 600;
  padding: 0.65rem 1rem;
  border: 1px solid color-mix(in oklch, var(--secondary, #6738e4), white 12%);
}

/* Hover glow picks accent */
.hover-glow {
  position: relative;
  isolation: isolate;
  outline: none;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
  overflow: clip; /* keep blur ring inside */
}
.hover-glow::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  --ring: 5px;
  --blur: 16px;
  --alpha: 0;
  background: color-mix(in oklch, var(--secondary, #6738e4), white 10%);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
          mask-composite: exclude;
  padding: var(--ring);
  filter: blur(var(--blur));
  opacity: var(--alpha);
  transform: scale(0.995);
  transition:
    opacity 180ms ease,
    filter 180ms ease,
    transform 180ms ease;
}
.hover-glow:hover::before,
.hover-glow:focus-visible::before {
  --alpha: 0.85;
  --blur: 18px;
  transform: scale(1);
}
.hover-glow:hover,
.hover-glow:focus-visible {
  box-shadow:
    inset 0 0 0 1px color-mix(in oklch, var(--secondary, #6738e4), white 25%),
    inset 0 0 24px color-mix(in oklch, var(--secondary, #6738e4), black 70% / 18%),
    0 10px 26px -14px color-mix(in oklch, var(--secondary, #6738e4), black 20%);
}

/* this makes .text-secondary follow the current accent too */
.text-secondary {
  color: var(--secondary, #6738e4) !important;
}

/* Dropdown sizing + feel (bigger) */
.custom-dd-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #6738e4;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 0.6rem;
  padding: 0.55rem 0.9rem;
  font-size: 1rem;
  color: #fff;
  line-height: 1.2;
  transition: border 120ms ease, background 120ms ease, transform 80ms ease;
  -webkit-tap-highlight-color: transparent;
}
.custom-dd-trigger:hover {
  border-color: rgba(255,255,255,.32);
  background: rgba(103,56,228,.32);
}
.custom-dd-trigger:active { transform: translateY(0.5px); }

/* Larger variant used near the table header */
.custom-dd-trigger--lg {
  padding: 0.75rem 1.15rem;
  font-size: 1.125rem; /* ~18px */
  border-radius: 0.7rem;
  min-width: 11rem;
}

.custom-dd-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 12rem;
  background: rgba(11,12,18,0.96);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 0.7rem;
  box-shadow: 0 20px 45px rgba(0,0,0,.40);
  backdrop-filter: blur(6px);
  z-index: 40;
  overflow: hidden;
}

/* When used under header control, anchor under the button's left edge */
.custom-dd-menu--th {
  left: 0;
  right: auto;
}

.custom-dd-item {
  width: 100%;
  text-align: left;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  line-height: 1.3;
  color: rgba(255,255,255,.92);
  background: transparent;
  transition: background 120ms ease, color 120ms ease;
}
.custom-dd-item + .custom-dd-item {
  border-top: 1px solid rgba(0,0,0,.40)
}
.custom-dd-item:hover {
  background: rgba(103,56,228,.16);
}
.custom-dd-item.active {
  background: rgba(103,56,228,.32);
  color: #fff;
  font-weight: 600;
}

/* Wrapper to sit the menu and info box side-by-side (desktop) */
.custom-dd-wrap {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
  z-index: 45; /* above table header */
}

/* Desktop info panel */
.custom-dd-infobox {
  width: 22rem;
  padding: 0.85rem 1rem;
  border-radius: 0.7rem;
  background: rgba(13,14,20,0.9);
  border: 1px solid rgba(255,255,255,.10);
  box-shadow: 0 20px 45px rgba(0,0,0,.35);
  color: rgba(255,255,255,.92);
  backdrop-filter: blur(6px);
}
.infobox-title {
  font-weight: 800;
  margin-bottom: 0.35rem;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}
.infobox-text {
  font-size: 0.86rem;
  line-height: 1.3;
  margin-bottom: 0.4rem;
}
.infobox-list {
  font-size: 0.82rem;
  line-height: 1.35;
  padding-left: 1rem;
  list-style: disc;
  color: rgba(255,255,255,.85);
}

/* Mobile info panel */
.custom-dd-infobox-mobile {
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(13,14,20,0.9);
  color: rgba(255,255,255,.92);
  border-radius: 0.7rem;
  padding: 0.75rem 0.85rem;
  box-shadow: 0 12px 28px rgba(0,0,0,.35);
}

/* Better touch targets on small screens */
@media (max-width: 640px) {
  .custom-dd-trigger--lg {
    padding: 0.85rem 1.2rem;
    font-size: 1.15rem;
    min-width: 12rem;
  }
  .custom-dd-menu { min-width: 14rem; }
}
</style>
