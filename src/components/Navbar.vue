<template>
  <div class="relative">
    <!-- NAVBAR -->
    <nav
      class="w-full fixed top-0 z-50 bg-white text-black px-6 py-4 flex justify-between items-center shadow"
      role="navigation"
      aria-label="Main"
    >
      <!-- Logo & BTC Price Block -->
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
          <div class="text-xl text-secondary font-bold tracking-wide leading-tight">Cadena Bitcoin</div>
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
            BTCUSD:
            <span class="text-secondary font-semibold text-lg">${{ btcPrice }}</span>
          </div>
        </div>
      </div>

      <!-- Hamburger Menu Button -->
      <button
        @click="toggleMobileMenu"
        @keyup.esc="closeMobileMenu"
        class="md:hidden text-black focus:outline-none"
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
        <router-link to="/" class="hover:text-secondary transition">Home</router-link>

        <!-- Products and Services Dropdown -->
        <div class="relative group">
          <button class="flex items-center space-x-1 hover:text-secondary transition" aria-haspopup="menu" aria-expanded="false">
            <span>Products and Services</span>
            <svg class="w-4 h-4 text-gray-500 transition" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" role="menu">
            <router-link to="/btcusd" class="block px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2" role="menuitem">
              <img src="https://flagcdn.com/us.svg" alt="US Flag" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
              BTCUSD
            </router-link>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
              <img src="https://flagcdn.com/eu.svg" alt="EUR" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
              BTCEUR (Coming Soon)
            </div>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
              <img src="https://flagcdn.com/jp.svg" alt="JPY" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
              BTCJPY (Coming Soon)
            </div>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">🟡 BTC/XAU (Coming Soon)</div>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
              <img src="https://flagcdn.com/gb.svg" alt="GBP" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
              BTCGBP (Coming Soon)
            </div>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
              <img src="https://flagcdn.com/ca.svg" alt="CAD" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
              BTCCAD (Coming Soon)
            </div>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed" aria-disabled="true">
              <img src="https://flagcdn.com/au.svg" alt="AUD" class="w-4 h-4" width="16" height="12" decoding="async" loading="lazy" draggable="false" referrerpolicy="no-referrer" />
              BTCAUD (Coming Soon)
            </div>
          </div>
        </div>

        <!-- Explore Cadena Dropdown -->
        <div class="relative group">
          <button class="flex items-center space-x-1 hover:text-secondary transition" aria-haspopup="menu" aria-expanded="false">
            <span>Explore Cadena</span>
            <svg class="w-4 h-4 text-gray-500 transition" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" role="menu">
            <router-link to="/cadena-paper" class="block px-4 py-2 hover:bg-gray-100 transition" role="menuitem">Cadena Paper</router-link>
            <router-link to="/contact" class="block px-4 py-2 hover:bg-gray-100 transition" role="menuitem">GitHub Resources</router-link>
            <router-link to="/contact" class="block px-4 py-2 hover:bg-gray-100 transition" role="menuitem">Contact Us</router-link>
          </div>
        </div>
      </div>

      <!-- CTA Buttons Desktop -->
      <div class="hidden md:flex items-center space-x-4">
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
    </nav>

    <!-- MOBILE MENU -->
    <transition name="fade-slide">
      <div
        v-if="isMobileMenuOpen"
        id="mobile-menu"
        class="fixed inset-0 bg-white text-black px-6 pt-[96px] pb-6 space-y-6 z-40 md:hidden overflow-y-auto shadow-lg"
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
          <router-link @click="closeMobileMenu" to="/contact" class="block pl-2 py-2 hover:text-secondary">Contact Us</router-link>
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/logos/cadena_bitcoin_logo.png'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isLoggedIn, logout } = useAuth()

const isMobileMenuOpen = ref(false)
const btcPrice = ref('...')

let priceIntervalId = null
let abortCtrl = null

// Poll BTC price with safer fetch settings and abort on unmount
const fetchBTCPrice = async () => {
  try {
    abortCtrl?.abort()
    abortCtrl = new AbortController()
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        signal: abortCtrl.signal,
        headers: { 'accept': 'application/json' },
      }
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const usd = data?.bitcoin?.usd
    btcPrice.value = (typeof usd === 'number' ? usd : 0).toLocaleString(undefined, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } catch (err) {
    // silent degrade to N/A to avoid leaking details
    btcPrice.value = 'N/A'
  }
}

function startPricePolling() {
  fetchBTCPrice()
  clearInterval(priceIntervalId)
  priceIntervalId = setInterval(fetchBTCPrice, 30000)
}
function stopPricePolling() {
  clearInterval(priceIntervalId)
  priceIntervalId = null
  abortCtrl?.abort()
}

// Pause polling when tab is hidden (saves battery & requests)
const onVis = () => (document.hidden ? stopPricePolling() : startPricePolling())

// Toggle mobile menu without inline styles; use body class (CSP-friendly)
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

watch(isMobileMenuOpen, (open) => {
  document.body.classList.toggle('overflow-hidden', open)
})

// Close menu on route change
const unregAfterEach = router.afterEach(() => { closeMobileMenu() })

// Logout
const logoutUser = async (fromMobile = false) => {
  try {
    logout()
    if (fromMobile) closeMobileMenu()
    await router.push('/login')
  } catch {
    /* swallow */
  }
}

onMounted(() => {
  startPricePolling()
  document.addEventListener('visibilitychange', onVis)
  window.addEventListener('keydown', onEscClose, { passive: true })
})

onUnmounted(() => {
  stopPricePolling()
  document.removeEventListener('visibilitychange', onVis)
  window.removeEventListener('keydown', onEscClose)
  unregAfterEach && unregAfterEach()
})

function onEscClose(e) {
  if (e.key === 'Escape') closeMobileMenu()
}
</script>
