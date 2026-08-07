<template>
  <div class="relative">
    <!-- NAVBAR (fixed) -->
    <nav
      ref="navRef"
      :class="[
        'w-full fixed top-0 left-0 right-0 z-[65] nav-bg text-white'
      ]"
      role="navigation"
      aria-label="Main"
    >
      <!-- Mobile-only BTCUSD strip -->
      <div v-if="!serverDown" class="md:hidden flex items-center justify-center gap-1.5 px-4 py-1 text-xs font-medium border-b border-white/10">
        <img
          src="https://flagcdn.com/us.svg"
          alt="US Flag"
          class="w-3.5 h-3.5 inline-block"
          width="14" height="10"
          decoding="async"
          loading="lazy"
          draggable="false"
          referrerpolicy="no-referrer"
        />
        <span class="text-white/60">BTCUSD</span>
        <span
          class="text-secondary font-semibold"
          :class="{ 'opacity-50': btcPriceStale }"
          :title="btcPriceStale ? 'Price feed may be outdated — Cadena is having trouble reaching its servers.' : undefined"
        >${{ btcPrice }}</span>
      </div>

      <!-- Main navbar row -->
      <div class="px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-x-4">
        <!-- Left: Logo -->
        <router-link
          to="/"
          class="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-secondary/60 rounded-md w-fit"
          aria-label="Go to Home"
        >
          <img
            :src="logo"
            alt="Cadena Bitcoin Logo"
            class="w-10 h-10 object-contain"
            decoding="async"
            loading="eager"
            draggable="false"
            referrerpolicy="no-referrer"
          />
          <span class="text-xl font-bold tracking-wide leading-tight text-secondary group-hover:text-white transition-colors">
            Cadena Bitcoin
          </span>
        </router-link>

        <!-- Center: BTCUSD ticker -->
        <div v-if="!serverDown" class="hidden md:flex justify-center items-center gap-1.5 text-sm font-medium">
          <img
            src="https://flagcdn.com/us.svg"
            alt="US Flag"
            class="w-4 h-4 inline-block"
            width="16" height="12"
            decoding="async"
            loading="lazy"
            draggable="false"
            referrerpolicy="no-referrer"
          />
          <span class="text-white/70">BTCUSD</span>
          <span
            class="text-secondary font-semibold text-base"
            :class="{ 'opacity-50': btcPriceStale }"
            :title="btcPriceStale ? 'Price feed may be outdated — Cadena is having trouble reaching its servers.' : undefined"
          >${{ btcPrice }}</span>
        </div>

        <!-- Right: Desktop Nav + CTA -->
        <div class="hidden md:flex items-center justify-end gap-4 flex-nowrap whitespace-nowrap">
          <router-link :class="linkClass" to="/signerapp">Signer App</router-link>
          <router-link :class="linkClass" to="/allocate_liquidity">Create Loan</router-link>

          <!-- Calculators dropdown -->
          <div class="relative group">
            <button :class="['flex items-center gap-1 transition', linkClass]" aria-haspopup="menu" aria-expanded="false">
              <span>Calculators</span>
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
              </svg>
            </button>
            <div
              class="absolute top-full right-0 mt-2 w-52 bg-[#081123] text-white border border-secondary/40 rounded-md shadow-xl z-[70] opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200"
              role="menu"
            >
              <router-link to="/loan-calculator" class="block px-4 py-2 text-white hover:bg-white/10 hover:text-white transition" role="menuitem">Loan Calculator</router-link>
              <router-link to="/settlement-calculator" class="block px-4 py-2 text-white hover:bg-white/10 hover:text-white transition" role="menuitem">Settlement Calculator</router-link>
              <router-link to="/liquidation-calculator" class="block px-4 py-2 text-white hover:bg-white/10 hover:text-white transition" role="menuitem">Liquidation Risk</router-link>
              <router-link to="/bitcoin-allocation" class="block px-4 py-2 text-white hover:bg-white/10 hover:text-white transition" role="menuitem">Bitcoin Allocation</router-link>
            </div>
          </div>

          <!-- Resources dropdown -->
          <div class="relative group">
            <button :class="['flex items-center gap-1 transition', linkClass]" aria-haspopup="menu" aria-expanded="false">
              <span>Resources</span>
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
              </svg>
            </button>
            <div
              class="absolute top-full right-0 mt-2 w-52 bg-[#081123] text-white border border-secondary/40 rounded-md shadow-xl z-[70] opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200"
              role="menu"
            >
              <router-link to="/knowledge-hub" class="block px-4 py-2 text-white hover:bg-white/10 hover:text-white transition" role="menuitem">Knowledge Hub</router-link>
              <router-link to="/cadena-paper" class="block px-4 py-2 text-white hover:bg-white/10 hover:text-white transition" role="menuitem">Cadena Paper</router-link>
              <router-link to="/endgame" class="block px-4 py-2 text-white hover:bg-white/10 hover:text-white transition" role="menuitem">Endgame Book</router-link>
              <router-link to="/endgame-study-guide" class="block px-4 py-2 text-white hover:bg-white/10 hover:text-white transition" role="menuitem">Endgame Study Guide</router-link>
              <a href="https://www.youtube.com/@cadenabitcoin" target="_blank" rel="noopener" class="block px-4 py-2 text-white hover:bg-white/10 hover:text-white transition" role="menuitem">Podcast</a>
              <a href="https://github.com/CadenaWizard/cryptlib" target="_blank" rel="noopener" class="block px-4 py-2 text-white hover:bg-white/10 hover:text-white transition" role="menuitem">GitHub</a>
            </div>
          </div>

          <!-- Auth + CTA -->
          <div class="flex items-center gap-4 text-white">
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class="text-sm hover:text-secondary transition"
          >Login</router-link>

          <button
            v-else
            @click.prevent="logoutUser"
            class="text-sm hover:text-secondary transition cursor-pointer"
            :disabled="sessionBusy"
            :aria-disabled="sessionBusy ? 'true' : 'false'"
            title="Logout disabled while reconnecting"
          >
            Logout
          </button>

          <router-link
            v-if="!isLoggedIn"
            to="/register"
            class="bg-secondary hover:bg-white text-white hover:text-secondary px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(103,56,228,0.5)]"
          >
            Get Started
          </router-link>
          <router-link
            v-else
            to="/my-profile"
            class="bg-secondary hover:bg-white text-white hover:text-secondary px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(103,56,228,0.5)]"
          >
            My Profile
          </router-link>
          </div><!-- /auth+cta -->
        </div><!-- /right col -->

        <!-- Burger (mobile) -->
        <div class="md:hidden flex justify-end col-span-2">
          <button
            @click="toggleMobileMenu"
            @keyup.esc="closeMobileMenu"
            class="focus:outline-none text-white"
            :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
                 viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- INFO STRIP -->
    <div
      v-if="isLoggedIn"
      ref="infoRef"
      class="w-full fixed left-0 right-0 z-40 bg-secondary border-b border-white/[0.07] supports-[backdrop-filter]:bg-secondary backdrop-blur"
      :style="{ top: 'var(--nav-h)' }"
      role="region"
      aria-label="User info"
    >
      <div class="px-4 h-10 flex items-center justify-center gap-2">

        <!-- Loading -->
        <template v-if="loading">
          <div class="h-3 w-24 rounded-full bg-white/10 animate-pulse" />
          <div class="h-3 w-16 rounded-full bg-white/10 animate-pulse" />
          <div class="hidden sm:block h-3 w-20 rounded-full bg-white/10 animate-pulse" />
        </template>

        <!-- Error -->
        <template v-else-if="error">
          <span class="text-xs text-red-300/80">Balance unavailable</span>
          <button
            v-if="canRetry"
            class="text-xs px-2.5 py-1 rounded-full border border-white/10 hover:bg-white/10 text-white transition"
            @click="$emit('retry')"
          >Retry</button>
        </template>

        <!-- Data -->
        <template v-else>

          <!-- Email chip -->
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08]">
            <svg class="w-3 h-3 text-white shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
            <span class="text-xs text-white truncate max-w-[22ch]" :title="email">{{ email }}</span>
          </div>

          <span class="w-px h-4 bg-white/10 hidden sm:block" aria-hidden="true" />

          <!-- Pairing -->
          <template v-if="isPending">
            <div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/20" role="status">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" aria-hidden="true" />
              <span class="text-xs text-amber-200">Setup pending</span>
              <router-link to="/register?step=3" class="text-xs text-amber-300 hover:text-white transition underline underline-offset-2">View QR</router-link>
            </div>
          </template>
          <template v-else-if="showPairing">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition"
              :class="isPaired ? 'bg-green-500/10 border-green-400/20' : 'bg-red-500/10 border-red-400/20'"
              role="status"
              :aria-label="isPaired ? 'Device paired' : 'Device not paired'"
            >
              <span :class="['w-1.5 h-1.5 rounded-full shrink-0', isPaired ? 'bg-green-400' : 'bg-red-400 animate-pulse']" aria-hidden="true" />
              <span :class="['text-xs font-medium', isPaired ? 'text-green-300' : 'text-red-300']">{{ isPaired ? 'Paired' : 'Not paired' }}</span>
              <router-link v-if="!isPaired" to="/register?step=3" class="text-xs text-red-200 hover:text-white transition underline underline-offset-2 ml-0.5">Scan QR</router-link>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]" aria-hidden="true">
              <span class="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
              <span class="text-xs text-white tracking-widest">···</span>
            </div>
          </template>

          <span class="w-px h-4 bg-white/10 hidden sm:block" aria-hidden="true" />

          <!-- Liquid balance chip -->
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08]">
            <span class="text-xs text-white">Liquid Balance</span>
            <span class="text-xs font-semibold text-white tabular-nums" :aria-live="live" role="status">
              <template v-if="balanceDerivedSats !== null">{{ btc(balanceDerivedSats) }} BTC</template>
              <template v-else><span class="text-white">—</span></template>
            </span>
          </div>

          <!-- On-chain balance chip -->
          <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08]">
            <span class="text-xs text-white">Wallet Balance</span>
            <span class="text-xs font-semibold text-white tabular-nums" :aria-live="live" role="status">
              <template v-if="balanceOnchainSats !== null">{{ btc(balanceOnchainSats) }} BTC</template>
              <template v-else><span class="text-white">—</span></template>
            </span>
          </div>

          <!-- Zero-balance nudge -->
          <template v-if="isZeroAvailable">
            <span class="w-px h-4 bg-white/10 hidden sm:block" aria-hidden="true" />
            <router-link
              to="/get-started"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-secondary text-xs font-bold hover:bg-white/90 transition shadow-sm"
            >
              <svg class="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              Fund wallet
            </router-link>
          </template>

        </template>
      </div>
    </div>

    <!-- Spacer: reserve combined height (nav + info if shown) -->
    <div :style="{ height: spacerHeight + 'px' }" aria-hidden="true"></div>

    <!-- MOBILE MENU (black theme, BTCUSD only) -->
    <transition name="fade-slide">
      <div
        v-if="isMobileMenuOpen"
        id="mobile-menu"
        class="fixed inset-0 text-white px-6 pb-6 space-y-6 z-[70] md:hidden overflow-y-auto shadow-xl pt-[var(--nav-h)] mobile-menu-bg"
        @keyup.esc="closeMobileMenu"
      >
        <router-link @click="closeMobileMenu" to="/signerapp" class="block text-lg font-semibold hover:text-secondary">Signer App</router-link>
        <router-link @click="closeMobileMenu" to="/allocate_liquidity" class="block text-lg font-semibold hover:text-secondary">Create Loan</router-link>
        <div>
          <div class="text-white/50 uppercase text-xs mt-4 mb-2">Calculators</div>
          <router-link @click="closeMobileMenu" to="/loan-calculator" class="block pl-2 py-2 hover:text-secondary">Loan Calculator</router-link>
          <router-link @click="closeMobileMenu" to="/settlement-calculator" class="block pl-2 py-2 hover:text-secondary">Settlement Calculator</router-link>
          <router-link @click="closeMobileMenu" to="/liquidation-calculator" class="block pl-2 py-2 hover:text-secondary">Liquidation Risk</router-link>
          <router-link @click="closeMobileMenu" to="/bitcoin-allocation" class="block pl-2 py-2 hover:text-secondary">Bitcoin Allocation</router-link>
        </div>

        <div>
          <div class="text-white/50 uppercase text-xs mt-4 mb-2">Resources</div>
          <router-link @click="closeMobileMenu" to="/knowledge-hub" class="block pl-2 py-2 hover:text-secondary">Knowledge Hub</router-link>
          <router-link @click="closeMobileMenu" to="/cadena-paper" class="block pl-2 py-2 hover:text-secondary">Cadena Paper</router-link>
          <router-link @click="closeMobileMenu" to="/endgame" class="block pl-2 py-2 hover:text-secondary">Endgame Book</router-link>
          <router-link @click="closeMobileMenu" to="/endgame-study-guide" class="block pl-2 py-2 hover:text-secondary">Endgame Study Guide</router-link>
          <a href="https://www.youtube.com/@cadenabitcoin" target="_blank" rel="noopener" class="block pl-2 py-2 hover:text-secondary" @click="closeMobileMenu">Podcast</a>
          <a href="https://github.com/CadenaWizard/cryptlib" target="_blank" rel="noopener" class="block pl-2 py-2 hover:text-secondary" @click="closeMobileMenu">GitHub</a>
        </div>

        <router-link
          v-if="!isLoggedIn"
          @click="closeMobileMenu"
          to="/login"
          class="block text-lg font-semibold hover:text-secondary"
        >
          Login
        </router-link>

        <button
          v-else
          @click.prevent="logoutUser(true)"
          class="block text-left text-lg font-semibold hover:text-secondary cursor-pointer"
          :disabled="sessionBusy"
          :aria-disabled="sessionBusy ? 'true' : 'false'"
          title="Logout disabled while reconnecting"
        >
          Logout
        </button>

        <router-link
          v-if="!isLoggedIn"
          to="/register"
          class="block w-full bg-secondary hover:bg-secondary text-white px-4 py-3 rounded-full text-sm font-semibold text-center transition"
          @click="closeMobileMenu"
        >
          Get Started
        </router-link>
        <router-link
          v-else
          to="/my-profile"
          class="block w-full bg-secondary hover:bg-secondary text-white px-4 py-3 rounded-full text-sm font-semibold text-center transition"
          @click="closeMobileMenu"
        >
          My Profile
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/logos/cadena_bitcoin_logo_2.png'
import { useAuth } from '../composables/useAuth'
import { useBtcPrice } from '../composables/useBtcPrice'
import { useServerStatus } from '../composables/useServerStatus'
import { useOracle } from '../composables/useOracle'
import { formatBtcValue } from '../functions/amount_formatting'
import { isSignerAuthCode } from '../lib/authCode'

const { selectedOracleId } = useOracle()

/** ---- Emits (kept for the Retry button in the template) ---- */
const emit = defineEmits(['retry'])

/** ---- Optional display config props only ----
 * Keep surface-level display toggles here (not data).
 * If you already store btcUsd globally, you can drop this too.
 */
const props = defineProps({
  showFiat: { type: Boolean, default: false },
  btcUsd: { type: Number, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  canRetry: { type: Boolean, default: true },
})

/** ---- Auth + router ---- */
const router = useRouter()
const {
  isLoggedIn: authLoggedIn,
  logout,
  tokenHealth,
  user,
  // If your composable exposes these, use them:
  loading: authLoading = ref(false),
  error: authError = ref(null),
  setUserFromApi,            // canonical refresher (SWR-friendly in the composable)
} = useAuth()

/** ---- UI state ---- */
const isMobileMenuOpen = ref(false)

/** ---- Numeric field extractor (used by balance computeds below) ---- */
function pickNumber (obj, keys) {
  const src = obj ?? {}
  for (const k of keys) {
    const n = Number(src[k])
    if (Number.isFinite(n)) return n
  }
  return null
}

/** ---- BTC price (shared singleton — no local interval) ---- */
const { btcPriceUsd, isStale: btcPriceStale } = useBtcPrice()
const { isDown: serverDown } = useServerStatus()
const btcPrice = computed(() => {
  const v = btcPriceUsd.value
  if (!v) return '...'
  return Number(v).toLocaleString(undefined, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

/** ---- Fixed nav + info measurement ---- */
const navRef = ref(null)
const navHeight = ref(0)
const infoRef = ref(null)
const infoHeight = ref(0)
let resizeObs = null
let rafId = 0

function applyHeights () {
  document.documentElement.style.setProperty('--nav-h', navHeight.value + 'px')
  document.documentElement.style.setProperty('--info-h', infoHeight.value + 'px')
}
function updateNavHeight () {
  navHeight.value = navRef.value?.offsetHeight || 0
  applyHeights()
}
function updateInfoHeight () {
  infoHeight.value = isLoggedIn.value ? (infoRef.value?.offsetHeight || 0) : 0
  applyHeights()
}
function scheduleRecalc () {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    updateNavHeight()
    updateInfoHeight()
  })
}
const spacerHeight = computed(() => navHeight.value + (isLoggedIn.value ? infoHeight.value : 0))

/** ---- Derived auth state (no page props) ---- */
const isLoggedIn = computed(() => !!authLoggedIn?.value)
const authUser = computed(() => user?.value ?? null)

const email = computed(() => authUser.value?.payload?.email ?? authUser.value?.email ?? '')
const balanceDerivedSats = computed(() => {
  const src = authUser.value?.payload ?? authUser.value
  return pickNumber(src, [
    'balance_derived',     // your old field
    'liquid_sats',         // common alt
    'available_sats',      // common alt
    'liquid',              // sometimes just 'liquid'
    'balance_available',   // seen in some APIs
    'available',
  ])
})
const balanceOnchainSats = computed(() => {
  const src = authUser.value?.payload ?? authUser.value
  return pickNumber(src, [
    'balance_onchain',
    'onchain_sats',
    'wallet_sats',
    'onchain',
  ])
})
const authCode = computed(() => {
  const raw = authUser.value?.auth_code ?? authUser.value?.payload?.auth_code
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
})
const isPending = computed(() => authCode.value === 0)
const isPaired = computed(() => isSignerAuthCode(authCode.value))
const showPairing = computed(() => authCode.value != null && !isPending.value)

/** ---- Zero available? ---- */
const isZeroAvailable = computed(() => {
  const n = Number(balanceDerivedSats.value)
  return Number.isFinite(n) && n === 0
})

/** ---- Session / nav interactions ---- */
const sessionBusy = computed(() => {
  const s = tokenHealth && tokenHealth.status
  return s === 'checking' || s === 'paused'
})
const unregAfterEach = router.afterEach(() => { closeMobileMenu() })

function toggleMobileMenu () { isMobileMenuOpen.value = !isMobileMenuOpen.value }
function closeMobileMenu () { isMobileMenuOpen.value = false }

watch(isMobileMenuOpen, (open) => {
  document.body.classList.toggle('overflow-hidden', open)
  nextTick().then(scheduleRecalc)
})

/** ---- Lifecycle ---- */
onMounted(async () => {
  await nextTick()
  scheduleRecalc()

  if ('ResizeObserver' in window) {
    resizeObs = new ResizeObserver(() => scheduleRecalc())
    if (navRef.value) resizeObs.observe(navRef.value)
    nextTick(() => { if (infoRef.value && resizeObs) resizeObs.observe(infoRef.value) })
  } else {
    const onResize = () => scheduleRecalc()
    window.addEventListener('resize', onResize, { passive: true })
  }

  // If logged in but no cached profile yet, refresh without blanking UI
  if (isLoggedIn.value && !authUser.value) {
    // IMPORTANT: your composable should implement SWR so this doesn’t toggle loading if data exists
    await setUserFromApi?.().catch(() => {})
  }
})

onUnmounted(() => {
  if (resizeObs) resizeObs.disconnect()
  unregAfterEach && unregAfterEach()
  stopStatusWatch && stopStatusWatch()
})

/** Re-measure only on actual auth/user changes (not page props) ---- */
watch(() => isLoggedIn.value, () => nextTick().then(scheduleRecalc))
watch(() => authUser.value, () => nextTick().then(scheduleRecalc))

/** ---- Token health reactions ---- */
const stopStatusWatch = watch(
  () => tokenHealth && tokenHealth.status,
  (s) => {
    if (s === 'invalid') { isMobileMenuOpen.value = false; logoutUser(false) }
    if (s === 'valid') { nextTick().then(scheduleRecalc) }
  },
  { immediate: false }
)

/** ---- Logout ---- */
const logoutUser = async (fromMobile = false) => {
  try {
    logout()
    if (fromMobile) closeMobileMenu()
    await router.push('/login')
  } catch { /* no-op */ }
}

/** ---- Info strip helpers (BTC/fiat display) ---- */
const live = computed(() => 'polite')

function satsToBtc (s) {
  const n = Number(s)
  if (!Number.isFinite(n)) return null
  return n / 1e8
}
function formatBtc (n) {
  if (n == null) return '—'
  return formatBtcValue(n)
}
const btc = (sats) => {
  const n = satsToBtc(sats)
  return n == null ? '—' : formatBtc(n)
}
function formatFiat (n) {
  if (n == null) return null
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
  } catch {
    return `$${Math.round(n).toLocaleString()}`
  }
}

/** Prefer prop btcUsd if given; otherwise try parsing the live ticker number */
const btcUsdEffective = computed(() => {
  if (props.btcUsd != null) return Number(props.btcUsd)
  const raw = (btcPrice.value || '').replace(/,/g, '')
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
})

const fiatAvailable = computed(() => {
  if (!props.showFiat || btcUsdEffective.value == null) return null
  const b = satsToBtc(balanceDerivedSats.value)
  return b == null ? null : formatFiat(b * btcUsdEffective.value)
})
const fiatOnchain = computed(() => {
  if (!props.showFiat || btcUsdEffective.value == null) return null
  const b = satsToBtc(balanceOnchainSats.value)
  return b == null ? null : formatFiat(b * btcUsdEffective.value)
})

/** ---- Expose refs used in template ---- */
const linkClass = computed(() => 'hover:text-secondary text-white')
defineExpose({
  navRef, infoRef, spacerHeight,
  // Data used in template:
  email, balanceDerivedSats, balanceOnchainSats,
  isLoggedIn, isPaired, showPairing, isZeroAvailable,
  sessionBusy, btcPrice, authLoading, authError,
  logoutUser,
  linkClass,
  // For Retry button: bubble up so parent can call setUserFromApi (or handle centrally)
  onRetry: () => emit('retry'),
})
</script>


<style scoped>
:where(.tabular-nums) {
  font-variant-numeric: tabular-nums;
}

.nav-bg {
  background: #081123;
  transition: background 0.3s ease;
}

.mobile-menu-bg {
  background: #081123;
}
</style>
