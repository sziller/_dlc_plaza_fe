<template>
  <div class="relative">
    <!-- NAVBAR (fixed) -->
    <nav
      ref="navRef"
      :class="[
        'w-full fixed top-0 left-0 right-0 z-50 transition-colors duration-200',
        'bg-black text-white supports-[backdrop-filter]:backdrop-blur'
      ]"
      role="navigation"
      aria-label="Main"
    >
      <!-- Main navbar row -->
      <div class="px-6 py-4 flex justify-between items-center">
        <!-- Logo & BTC Price (clickable; when logged in -> BTCUSD) -->
        <router-link
          to="/"
          class="flex items-center space-x-4 group focus:outline-none focus:ring-2 focus:ring-secondary/60 rounded-md"
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
          <div class="flex flex-col items-start space-y-1">
            <div class="text-xl font-bold tracking-wide leading-tight text-secondary group-hover:text-white transition-colors">
              Cadena Bitcoin
            </div>
            <div class="text-sm font-medium flex items-center gap-1">
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
              <span class="text-white">BTCUSD:</span>
              <span class="text-secondary font-semibold text-lg">${{ btcPrice }}</span>
            </div>
          </div>
        </router-link>

        <!-- Burger -->
        <button
          @click="toggleMobileMenu"
          @keyup.esc="closeMobileMenu"
          class="md:hidden focus:outline-none text-white"
          :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
               viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Desktop Nav -->
        <div class="hidden md:flex space-x-6 items-center">
          <router-link :class="linkClass" to="/signerapp">Signer App</router-link>
          <router-link :class="linkClass" to="/btcusd">Create Loan</router-link>

          <!-- Socials dropdown -->
          <div class="relative group">
            <button :class="['flex items-center space-x-1 transition', linkClass]" aria-haspopup="menu" aria-expanded="false">
              <span>Socials</span>
              <svg class="w-4 h-4 transition" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
              </svg>
            </button>
            <div
              class="absolute top-full left-0 mt-2 w-48 bg-black text-white border border-secondary/40 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              role="menu"
            >
              <a href="https://x.com/cadenabitcoin" target="_blank" rel="noopener" class="block px-4 py-2 hover:bg-white/10 hover:text-white transition" role="menuitem">X (Twitter)</a>
              <a href="https://www.youtube.com/@cadenabitcoin" target="_blank" rel="noopener" class="block px-4 py-2 hover:bg-white/10 hover:text-white transition" role="menuitem">YouTube</a>
              <a href="https://www.instagram.com/cadenabitcoin" target="_blank" rel="noopener" class="block px-4 py-2 hover:bg-white/10 hover:text-white transition" role="menuitem">Instagram</a>
              <a href="https://www.facebook.com/people/CadenaBitcoin/61568348506268" target="_blank" rel="noopener" class="block px-4 py-2 hover:bg-white/10 hover:text-white transition" role="menuitem">Facebook</a>
              <a href="https://github.com/CadenaWizard/cryptlib" target="_blank" rel="noopener" class="block px-4 py-2 hover:bg-white/10 hover:text-white transition" role="menuitem">GitHub</a>
            </div>
          </div>
        </div>

        <!-- CTA Buttons Desktop -->
        <div class="hidden md:flex items-center space-x-4 text-white">
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
            class="bg-secondary hover:bg-white text-white hover:text-secondary px-4 py-2 rounded-full text-sm font-semibold transition"
          >
            Get Started
          </router-link>
          <router-link
            v-else
            to="/my-profile"
            class="bg-secondary hover:bg-white text-white hover:text-secondary px-4 py-2 rounded-full text-sm font-semibold transition"
          >
            My Profile
          </router-link>
        </div>
      </div>
    </nav>

    <!-- INFO STRIP (fixed under nav, medium size, BIGGER TEXT) -->
    <div
      v-if="isLoggedIn"
      ref="infoRef"
      class="w-full fixed left-0 right-0 z-40 border-b border-secondary bg-secondary text-white supports-[backdrop-filter]:bg-secondary backdrop-blur"
      :style="{ top: `var(--nav-h)` }"
      role="region"
      aria-label="User info"
    >
      <!-- keep bar height the same -->
      <div class="px-6 h-12 sm:h-14 md:h-16 flex items-center justify-center">
        <!-- ↑ text sizes only (no height change) -->
        <div class="h-full flex items-center justify-center gap-3 md:gap-4 text-center text-sm sm:text-base md:text-lg text-white/90">
          <!-- Loading -->
          <template v-if="loading">
            <div class="flex items-center gap-3">
              <div class="h-4 w-28 rounded bg-white/20 animate-pulse" aria-hidden="true" />
              <div class="h-4 w-24 rounded bg-white/20 animate-pulse" aria-hidden="true" />
              <div class="hidden sm:block h-4 w-28 rounded bg-white/20 animate-pulse" aria-hidden="true" />
            </div>
          </template>

          <!-- Error -->
          <template v-else-if="error">
            <div class="flex items-center gap-2 text-red-200 text-base md:text-lg">
              <svg class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.5a.75.75 0 011.5 0v5a.75.75 0 01-1.5 0v-5zM10 14.75a.875.875 0 100 1.75.875.875 0 000-1.75z" clip-rule="evenodd" />
              </svg>
              <span>Balance unavailable</span>
              <button
                v-if="canRetry"
                class="ml-2 px-2 py-1 rounded border border-white/20 hover:bg-white/10 text-white"
                @click="$emit('retry')"
              >
                Retry
              </button>
            </div>
          </template>

          <!-- Data -->
          <template v-else>
            <!-- Email -->
            <div class="min-w-0 flex items-center gap-2">
              <span class="hidden sm:inline text-white/70">Signed in:</span>
              <span class="truncate max-w-[38ch] font-medium" :title="email">{{ email }}</span>
            </div>

            <span class="hidden sm:inline select-none text-white/40">•</span>

            <!-- Pairing -->
            <template v-if="isPending">
              <div class="flex flex-wrap items-center gap-2 text-amber-100" role="status">
                <svg class="w-5 h-5 md:w-6 md:h-6 text-amber-200" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 14a1.25 1.25 0 111.25-1.25A1.251 1.251 0 0112 16zm1-4.75a1 1 0 01-2 0v-5a1 1 0 012 0z"/>
                </svg>
                <span class="text-sm sm:text-base md:text-lg">
                  Finish setup: sign out/in, then scan the QR using the Cadena Signer app.
                </span>
                <router-link
                  to="/register?step=3"
                  class="px-2 py-1 rounded border border-white/20 hover:bg-white/10 text-white text-sm"
                >
                  View QR
                </router-link>
              </div>
            </template>
            <template v-else-if="showPairing">
              <div class="flex items-center gap-2" role="status" :aria-label="isPaired ? 'Device paired' : 'Device not paired'">
                <span :class="['inline-block w-2.5 h-2.5 rounded-full', isPaired ? 'bg-green-400' : 'bg-red-400']" aria-hidden="true" />
                <span class="text-white/90 font-medium">
                  {{ isPaired ? 'Paired' : 'Not paired' }}
                </span>
              </div>
              <template v-if="!isPaired">
                <span class="hidden sm:inline select-none text-white/40">•</span>
                <router-link
                  to="/register?step=3"
                  class="px-2 py-1 rounded border border-white/20 hover:bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                  aria-label="Go to registration to scan QR with the Signer app"
                >
                  Scan QR code using signer app
                </router-link>
              </template>
            </template>
            <template v-else>
              <div class="flex items-center gap-2" aria-hidden="true">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-white/30 animate-pulse" />
                <span class="text-white/70">•••∂•••</span>
              </div>
            </template>

            <span class="hidden sm:inline select-none text-white/40">•</span>

            <!-- Liquid -->
            <div class="flex items-center gap-2">
              <span class="text-white/80">Liquid Balance:</span>
              <span class="tabular-nums font-semibold" :aria-live="live" role="status">
                <template v-if="balanceDerivedSats !== null">
                  {{ btc(balanceDerivedSats) }} BTC
                </template>
                <template v-else>—</template>
              </span>
            </div>

            <span class="hidden sm:inline select-none text-white/40">•</span>

            <!-- On-chain -->
            <div class="hidden sm:flex items-center gap-2">
              <span class="text-white/80">Wallet Balance:</span>
              <span class="tabular-nums font-semibold" :aria-live="live" role="status">
                <template v-if="balanceOnchainSats !== null">
                  {{ btc(balanceOnchainSats) }} BTC
                </template>
                <template v-else>—</template>
              </span>
            </div>

            <!-- Zero-balance nudge -->
            <template v-if="isZeroAvailable">
              <span class="hidden sm:inline select-none text-white/40">•</span>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 text-white/95">
                  <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 14a1.25 1.25 0 111.25-1.25A1.251 1.251 0 0112 16zm1-4.75a1 1 0 01-2 0v-5a1 1 0 012 0z"/>
                  </svg>
                  Balance is 0
                </span>
                <router-link
                  to="/my-profile"
                  class="px-2 py-1 rounded border border-white/20 hover:bg-white/10 text-white"
                >
                  Add funds
                </router-link>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>

    <!-- Spacer: reserve combined height (nav + info if shown) -->
    <div :style="{ height: spacerHeight + 'px' }" aria-hidden="true"></div>

    <!-- MOBILE MENU (black theme, BTCUSD only) -->
    <transition name="fade-slide">
      <div
        v-if="isMobileMenuOpen"
        id="mobile-menu"
        class="fixed inset-0 bg-black text-white px-6 pb-6 space-y-6 z-40 md:hidden overflow-y-auto shadow-lg pt-[var(--nav-h)]"
        @keyup.esc="closeMobileMenu"
      >
        <router-link @click="closeMobileMenu" to="/signerapp" class="block text-lg font-semibold hover:text-secondary">Signer App</router-link>
        <router-link @click="closeMobileMenu" to="/btcusd" class="block text-lg font-semibold hover:text-secondary">Create Loan</router-link>

        <div>
          <div class="text-white/50 uppercase text-xs mt-4 mb-2">Socials</div>
          <a href="https://x.com/cadenabitcoin" target="_blank" rel="noopener" class="block pl-2 py-2 hover:text-secondary" @click="closeMobileMenu">X (Twitter)</a>
          <a href="https://www.youtube.com/@cadenabitcoin" target="_blank" rel="noopener" class="block pl-2 py-2 hover:text-secondary" @click="closeMobileMenu">YouTube</a>
          <a href="https://www.instagram.com/cadenabitcoin" target="_blank" rel="noopener" class="block pl-2 py-2 hover:text-secondary" @click="closeMobileMenu">Instagram</a>
          <a href="https://www.facebook.com/people/CadenaBitcoin/61568348506268" target="_blank" rel="noopener" class="block pl-2 py-2 hover:text-secondary" @click="closeMobileMenu">Facebook</a>
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
import { getPrice } from '../api/price' // ⬅️ oracle price helper
import { isSignerAuthCode } from '../lib/authCode'

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

/** ---- BTC price polling (via oracle) ---- */
const btcPrice = ref('...')
let priceIntervalId = null
let priceStarted = false

function pickNumber (obj, keys) {
  const src = obj ?? {}
  for (const k of keys) {
    const v = src[k]
    const n = Number(v)
    if (Number.isFinite(n)) return n
  }
  return null
}

const fetchBTCPrice = async () => {
  try {
    // getPrice is typed Promise<number>, but be defensive in case
    // the implementation returns a JSON object instead.
    const raw = await getPrice()

    let usd = null

    if (typeof raw === 'number') {
      usd = raw
    } else if (raw && typeof raw === 'object') {
      // Try common field names on the top level
      usd = pickNumber(raw, ['price', 'value', 'last_price', 'price_usd'])
      // Or inside payload if present
      if (usd == null && raw.payload && typeof raw.payload === 'object') {
        usd = pickNumber(raw.payload, ['price', 'value', 'last_price', 'price_usd'])
      }
    }

    if (usd == null || !Number.isFinite(Number(usd))) {
      throw new Error('Invalid oracle response for BTCUSD')
    }

    btcPrice.value = Number(usd).toLocaleString(undefined, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } catch (err) {
    console.error('Failed to fetch BTC price from oracle:', err)
    btcPrice.value = 'N/A'
  }
}

function startPricePolling () {
  if (priceStarted) return
  priceStarted = true
  fetchBTCPrice()
  priceIntervalId = setInterval(fetchBTCPrice, 30_000)
}

function stopPricePolling () {
  if (priceIntervalId) {
    clearInterval(priceIntervalId)
    priceIntervalId = null
  }
  priceStarted = false
}

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

  // Start BTC price polling once (from oracle)
  startPricePolling()

  // If logged in but no cached profile yet, refresh without blanking UI
  if (isLoggedIn.value && !authUser.value) {
    // IMPORTANT: your composable should implement SWR so this doesn’t toggle loading if data exists
    await setUserFromApi?.().catch(() => {})
  }
})

onUnmounted(() => {
  stopPricePolling()
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
  const s = n.toFixed(8)
  return s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
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
:where(.tabular-nums){
  font-variant-numeric: tabular-nums;
}
</style>
