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
        <!-- Logo & BTC Price -->
        <div class="flex items-center space-x-4">
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
            <div class="text-xl font-bold tracking-wide leading-tight text-secondary">Cadena Bitcoin</div>
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
        </div>

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
          <router-link :class="linkClass" to="/">Home</router-link>

          <!-- Products and Services -->
          <div class="relative group">
            <button :class="['flex items-center space-x-1 transition', linkClass]" aria-haspopup="menu" aria-expanded="false">
              <span>Products and Services</span>
              <svg class="w-4 h-4 transition" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
              </svg>
            </button>
            <div
              class="absolute top-full left-0 mt-2 w-64 bg-black text-white border border-secondary/40 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              role="menu"
            >
              <router-link to="/btcusd" class="block px-4 py-2 hover:bg-white/10 hover:text-white transition flex items-center gap-2" role="menuitem">
                <img src="https://flagcdn.com/us.svg" alt="US Flag" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
                BTCUSD
              </router-link>
              <div class="block px-4 py-2 text-secondary/60 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
                <img src="https://flagcdn.com/eu.svg" alt="EUR" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
                BTCEUR (Coming Soon)
              </div>
              <div class="block px-4 py-2 text-secondary/60 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
                <img src="https://flagcdn.com/jp.svg" alt="JPY" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
                BTCJPY (Coming Soon)
              </div>
              <div class="block px-4 py-2 text-secondary/60 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">🟡 BTC/XAU (Coming Soon)</div>
              <div class="block px-4 py-2 text-secondary/60 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
                <img src="https://flagcdn.com/gb.svg" alt="GBP" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
                BTCGBP (Coming Soon)
              </div>
              <div class="block px-4 py-2 text-secondary/60 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
                <img src="https://flagcdn.com/ca.svg" alt="CAD" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
                BTCCAD (Coming Soon)
              </div>
              <div class="block px-4 py-2 text-secondary/60 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
                <img src="https://flagcdn.com/au.svg" alt="AUD" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
                BTCAUD (Coming Soon)
              </div>
            </div>
          </div>

          <!-- Explore Cadena -->
          <div class="relative group">
            <button :class="['flex items-center space-x-1 transition', linkClass]" aria-haspopup="menu" aria-expanded="false">
              <span>Explore Cadena</span>
              <svg class="w-4 h-4 transition" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
              </svg>
            </button>
            <div
              class="absolute top-full left-0 mt-2 w-64 bg-black text-white border border-secondary/40 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              role="menu"
            >
              <router-link to="/cadena-paper" class="block px-4 py-2 hover:bg-white/10 hover:text-white transition" role="menuitem">Cadena Paper</router-link>
              <router-link to="/contact" class="block px-4 py-2 hover:bg-white/10 hover:text-white transition" role="menuitem">GitHub Resources</router-link>
              <router-link to="/contact" class="block px-4 py-2 hover:bg-white/10 hover:text-white transition" role="menuitem">About Us</router-link>
              <router-link to="/signerapp" class="block px-4 py-2 hover:bg-white/10 hover:text-white transition" role="menuitem">Signer App</router-link>
            </div>
          </div>
        </div>

        <!-- CTA Buttons Desktop -->
        <div class="hidden md:flex items-center space-x-4 text-white">
          <a href="/downloads/Cadena(notify).apk" download type="application/vnd.android.package-archive" class="hover:text-secondary transition">Download APK</a>

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
        <template v-if="showPairing">
          <div class="flex items-center gap-2" role="status" :aria-label="isPaired ? 'Device paired' : 'Device not paired'">
            <span :class="['inline-block w-2.5 h-2.5 rounded-full', isPaired ? 'bg-green-400' : 'bg-red-400']" aria-hidden="true" />
            <span class="text-white/90 font-medium">
              {{ isPaired ? 'Paired' : 'Not paired' }}
            </span>
          </div>
          <template v-if="!isPaired">
            <span class="hidden sm:inline select-none text-white/40">•</span>
            <span class="text-white/90">Scan QR code using signer app</span>
          </template>
        </template>
        <template v-else>
          <div class="flex items-center gap-2" aria-hidden="true">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-white/30 animate-pulse" />
            <span class="text-white/70">••••••</span>
          </div>
        </template>

        <span class="hidden sm:inline select-none text-white/40">•</span>

        <!-- Liquid -->
        <div class="flex items-center gap-2">
          <span class="text-white/80">Liquid Balance:</span>
          <span class="tabular-nums font-semibold" :aria-live="live" role="status">
            <template v-if="balanceDerivedSats !== null">
              {{ btc(balanceDerivedSats) }} BTC
              <span v-if="showFiat && fiatAvailable !== null" class="text-white/80 font-normal">(≈ {{ fiatAvailable }})</span>
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
              <span v-if="showFiat && fiatOnchain !== null" class="text-white/80 font-normal">(≈ {{ fiatOnchain }})</span>
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

    <!-- MOBILE MENU (unchanged colors) -->
    <transition name="fade-slide">
      <div
        v-if="isMobileMenuOpen"
        id="mobile-menu"
        class="fixed inset-0 bg-white text-black px-6 pb-6 space-y-6 z-40 md:hidden overflow-y-auto shadow-lg pt-[var(--nav-h)]"
        @keyup.esc="closeMobileMenu"
      >
        <router-link @click="closeMobileMenu" to="/" class="block text-lg font-semibold hover:text-secondary">Home</router-link>

        <div>
          <div class="text-gray-500 uppercase text-xs mb-2">Products and Services</div>
          <router-link @click="closeMobileMenu" to="/btcusd" class="block pl-2 py-2 hover:text-secondary flex items-center gap-2">
            <img src="https://flagcdn.com/us.svg" alt="US Flag" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
            BTCUSD
          </router-link>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
            <img src="https://flagcdn.com/eu.svg" alt="EUR" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
            BTCEUR (Coming Soon)
          </div>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
            <img src="https://flagcdn.com/jp.svg" alt="JPY" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
            BTCJPY (Coming Soon)
          </div>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">🟡 BTC/XAU (Coming Soon)</div>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
            <img src="https://flagcdn.com/gb.svg" alt="GBP" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
            BTCGBP (Coming Soon)
          </div>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
            <img src="https://flagcdn.com/ca.svg" alt="CAD" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
            BTCCAD (Coming Soon)
          </div>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
            <img src="https://flagcdn.com/au.svg" alt="AUD" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
            BTCAUD (Coming Soon)
          </div>
        </div>

        <div>
          <div class="text-gray-500 uppercase text-xs mt-6 mb-2">Explore Cadena</div>
          <router-link @click="closeMobileMenu" to="/cadena-paper" class="block pl-2 py-2 hover:text-secondary">Cadena Paper</router-link>
          <router-link @click="closeMobileMenu" to="/contact" class="block pl-2 py-2 hover:text-secondary">GitHub Resources</router-link>
          <router-link @click="closeMobileMenu" to="/contact" class="block pl-2 py-2 hover:text-secondary">About Us</router-link>
          <router-link @click="closeMobileMenu" to="/signerapp" class="block pl-2 py-2 hover:text-secondary">Signer App</router-link>
        </div>

        <router-link
          @click="closeMobileMenu"
          v-if="!isLoggedIn"
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

        <a href="/downloads/Cadena(notify).apk" download type="application/vnd.android.package-archive" class="block hover:text-secondary transition">Download APK</a>

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
import { getUserProfile } from '../api/userProfile'

/** ---- Props for the info strip ---- */
const props = defineProps({
  isLoggedIn: { type: Boolean, default: false },
  email: { type: String, default: '' },
  balanceDerivedSats: { type: [Number, String], default: null },
  balanceOnchainSats: { type: [Number, String], default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  btcUsd: { type: Number, default: null },
  showFiat: { type: Boolean, default: false },
  canRetry: { type: Boolean, default: true },
  /** Optional override: if parent already has it, pass it in */
  authCode: { type: Number, default: null },
})
defineEmits(['retry'])

/** ---- Auth + router ---- */
const router = useRouter()
const { isLoggedIn: authLoggedIn, logout, tokenHealth } = useAuth()

/** ---- UI state ---- */
const isMobileMenuOpen = ref(false)
const btcPrice = ref('...')

/** ---- Fixed nav + info measurement ---- */
const navRef = ref(null)
const navHeight = ref(0)
const infoRef = ref(null)
const infoHeight = ref(0)
let resizeObs = null

function applyHeights() {
  document.documentElement.style.setProperty('--nav-h', navHeight.value + 'px')
  document.documentElement.style.setProperty('--info-h', infoHeight.value + 'px')
}
function updateNavHeight() {
  navHeight.value = navRef.value?.offsetHeight || 0
  applyHeights()
}
function updateInfoHeight() {
  infoHeight.value = props.isLoggedIn ? (infoRef.value?.offsetHeight || 0) : 0
  applyHeights()
}
/** Combined spacer to keep content below both fixed bars */
const spacerHeight = computed(() => navHeight.value + (props.isLoggedIn ? infoHeight.value : 0))

/** ---- BTC price polling ---- */
let priceIntervalId = null
let abortCtrl = null
const fetchBTCPrice = async () => {
  try {
    abortCtrl?.abort()
    abortCtrl = new AbortController()
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      { method: 'GET', mode: 'cors', cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: abortCtrl?.signal, headers: { accept: 'application/json' } }
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const usd = data?.bitcoin?.usd
    btcPrice.value = (typeof usd === 'number' ? usd : 0).toLocaleString(undefined, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } catch {
    btcPrice.value = 'N/A'
  }
}
function startPricePolling() { fetchBTCPrice(); clearInterval(priceIntervalId); priceIntervalId = setInterval(fetchBTCPrice, 30000) }
function stopPricePolling() { clearInterval(priceIntervalId); priceIntervalId = null; abortCtrl?.abort() }

/** ---- Session / nav interactions ---- */
const sessionBusy = computed(() => {
  const s = tokenHealth?.status
  return s === 'checking' || s === 'paused'
})
const unregAfterEach = router.afterEach(() => { closeMobileMenu() })

function toggleMobileMenu() { isMobileMenuOpen.value = !isMobileMenuOpen.value }
function closeMobileMenu() { isMobileMenuOpen.value = false }
watch(isMobileMenuOpen, (open) => { document.body.classList.toggle('overflow-hidden', open); nextTick().then(() => { updateNavHeight(); updateInfoHeight() }) })

/** ---- Auth code fetching ---- */
const authCodeFromApi = ref(null)
const authCodeLoading = ref(false)
const authCodeError = ref(null)

async function loadAuthCode() {
  if (props.authCode != null) return
  if (!authLoggedIn.value) { authCodeFromApi.value = null; return }
  authCodeLoading.value = true
  authCodeError.value = null
  try {
    const prof = await getUserProfile()
    const code = Number(prof?.payload?.auth_code)
    authCodeFromApi.value = Number.isFinite(code) ? code : null
  } catch (e) {
    authCodeError.value = e?.message || String(e)
    authCodeFromApi.value = null
  } finally {
    authCodeLoading.value = false
    // info bar height may change as content swaps
    nextTick().then(updateInfoHeight)
  }
}

/** Use prop if present; otherwise fall back to fetched value */
const effectiveAuthCode = computed(() => props.authCode != null ? Number(props.authCode) : authCodeFromApi.value)
const isPaired = computed(() => Number(effectiveAuthCode.value) === 6)
/** Only show pairing UI when we definitively know the code and we’re not loading/erroring */
const showPairing = computed(() => !authCodeLoading.value && authCodeError.value == null && effectiveAuthCode.value != null)

/** Balance zero? (derived available) */
const isZeroAvailable = computed(() => {
  const n = Number(props.balanceDerivedSats)
  return Number.isFinite(n) && n === 0
})

/** ---- Lifecycle ---- */
onMounted(async () => {
  await nextTick()
  updateNavHeight()
  updateInfoHeight()

  if ('ResizeObserver' in window) {
    resizeObs = new ResizeObserver(() => requestAnimationFrame(() => { updateNavHeight(); updateInfoHeight() }))
    if (navRef.value) resizeObs.observe(navRef.value)
    // Observe info bar as it can change with data state
    nextTick(() => { if (infoRef.value) resizeObs.observe(infoRef.value) })
  } else {
    window.addEventListener('resize', () => { updateNavHeight(); updateInfoHeight() }, { passive: true })
  }

  startPricePolling()
  loadAuthCode()
})

onUnmounted(() => {
  stopPricePolling()
  if (resizeObs) resizeObs.disconnect()
  else window.removeEventListener('resize', () => { updateNavHeight(); updateInfoHeight() })
  unregAfterEach && unregAfterEach()
  stopStatusWatch && stopStatusWatch()
})

/** Re-measure when header-height-affecting state flips */
watch(() => authLoggedIn.value, () => { nextTick().then(() => { updateNavHeight(); updateInfoHeight() }); loadAuthCode() })
watch(() => props.loading, () => nextTick().then(updateInfoHeight))
watch(() => props.error, () => nextTick().then(updateInfoHeight))
watch(() => props.isLoggedIn, () => nextTick().then(updateInfoHeight))

/** Refresh auth code when token becomes valid again */
const stopStatusWatch = watch(
  () => tokenHealth && tokenHealth.status,
  (s) => {
    if (s === 'invalid') { isMobileMenuOpen.value = false; logoutUser(false) }
    if (s === 'valid') { loadAuthCode() }
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

/** ---- Info strip helpers (BTC/fiat) ---- */
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
const fiatAvailable = computed(() => {
  if (!props.showFiat || props.btcUsd == null) return null
  const b = satsToBtc(props.balanceDerivedSats)
  return b == null ? null : formatFiat(b * props.btcUsd)
})
const fiatOnchain = computed(() => {
  if (!props.showFiat || props.btcUsd == null) return null
  const b = satsToBtc(props.balanceOnchainSats)
  return b == null ? null : formatFiat(b * props.btcUsd)
})

/** ---- Link color helper (constant white with secondary hover) ---- */
const linkClass = computed(() => 'hover:text-secondary text-white')
</script>

<style scoped>
:where(.tabular-nums){
  font-variant-numeric: tabular-nums;
}
</style>
