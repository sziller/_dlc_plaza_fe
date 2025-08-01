<template>
  <div class="relative">
    <!-- NAVBAR -->
    <nav class="w-full fixed top-0 z-50 bg-white text-black px-6 py-4 flex justify-between items-center shadow">
      <!-- Logo & BTC Price Block -->
      <div class="flex items-center space-x-4">
        <img :src="logo" alt="Cadena Bitcoin Logo" class="w-10 h-10 object-contain" />
        <div class="flex flex-col items-start space-y-1">
          <div class="text-xl text-secondary font-bold tracking-wide leading-tight">Cadena Bitcoin</div>
          <div class="text-sm font-medium flex items-center gap-1">
            <img src="https://flagcdn.com/us.svg" alt="US Flag" class="w-4 h-4 inline-block" />
            BTCUSD:
            <span class="text-secondary font-semibold text-lg">${{ btcPrice }}</span>
          </div>
        </div>
      </div>

      <!-- Hamburger Menu Button -->
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="md:hidden text-black focus:outline-none"
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
          <button class="flex items-center space-x-1 hover:text-secondary transition">
            <span>Products and Services</span>
            <svg class="w-4 h-4 text-gray-500 transition" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <router-link to="/btcusd" class="block px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2">
              <img src="https://flagcdn.com/us.svg" alt="US Flag" class="w-4 h-4" /> BTCUSD
            </router-link>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">
              <img src="https://flagcdn.com/eu.svg" alt="EUR" class="w-4 h-4" /> BTCEUR (Coming Soon)
            </div>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">
              <img src="https://flagcdn.com/jp.svg" alt="JPY" class="w-4 h-4" /> BTCJPY (Coming Soon)
            </div>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">🟡 BTC/XAU (Coming Soon)</div>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">
              <img src="https://flagcdn.com/gb.svg" alt="GBP" class="w-4 h-4" /> BTCGBP (Coming Soon)
            </div>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">
              <img src="https://flagcdn.com/ca.svg" alt="CAD" class="w-4 h-4" /> BTCCAD (Coming Soon)
            </div>
            <div class="block px-4 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">
              <img src="https://flagcdn.com/au.svg" alt="AUD" class="w-4 h-4" /> BTCAUD (Coming Soon)
            </div>
          </div>
        </div>

        <!-- Explore Cadena Dropdown -->
        <div class="relative group">
          <button class="flex items-center space-x-1 hover:text-secondary transition">
            <span>Explore Cadena</span>
            <svg class="w-4 h-4 text-gray-500 transition" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <router-link to="/cadena-paper" class="block px-4 py-2 hover:bg-gray-100 transition">Cadena Paper</router-link>
            <router-link to="/contact" class="block px-4 py-2 hover:bg-gray-100 transition">GitHub Resources</router-link>
            <router-link to="/contact" class="block px-4 py-2 hover:bg-gray-100 transition">Contact Us</router-link>
          </div>
        </div>
      </div>

      <!-- CTA Buttons Desktop -->
      <div class="hidden md:flex items-center space-x-4">
        <router-link to="/login" class="text-sm hover:text-secondary transition">Login</router-link>
        <router-link
          to="/register"
          class="bg-secondary hover:bg-white text-white hover:text-secondary px-4 py-2 rounded-full text-sm font-semibold transition"
        >
          Get Started
        </router-link>
      </div>
    </nav>

    <!-- MOBILE MENU -->
    <transition name="fade-slide">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-white text-black px-6 pt-[96px] pb-6 space-y-6 z-40 md:hidden overflow-y-auto shadow-lg"
      >
        <router-link @click="isMobileMenuOpen = false" to="/" class="block text-lg font-semibold hover:text-secondary">Home</router-link>

        <div>
          <div class="text-gray-500 uppercase text-xs mb-2">Products and Services</div>
          <router-link @click="isMobileMenuOpen = false" to="/btcusd" class="block pl-2 py-2 hover:text-secondary flex items-center gap-2">
            <img src="https://flagcdn.com/us.svg" alt="US Flag" class="w-4 h-4" /> BTCUSD
          </router-link>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">
            <img src="https://flagcdn.com/eu.svg" alt="EUR" class="w-4 h-4" /> BTCEUR (Coming Soon)
          </div>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">
            <img src="https://flagcdn.com/jp.svg" alt="JPY" class="w-4 h-4" /> BTCJPY (Coming Soon)
          </div>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">🟡 BTC/XAU (Coming Soon)</div>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">
            <img src="https://flagcdn.com/gb.svg" alt="GBP" class="w-4 h-4" /> BTCGBP (Coming Soon)
          </div>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">
            <img src="https://flagcdn.com/ca.svg" alt="CAD" class="w-4 h-4" /> BTCCAD (Coming Soon)
          </div>
          <div class="pl-2 py-2 text-gray-400 flex items-center gap-2 cursor-not-allowed">
            <img src="https://flagcdn.com/au.svg" alt="AUD" class="w-4 h-4" /> BTCAUD (Coming Soon)
          </div>
        </div>

        <div>
          <div class="text-gray-500 uppercase text-xs mt-6 mb-2">Explore Cadena</div>
          <router-link @click="isMobileMenuOpen = false" to="/cadena-paper" class="block pl-2 py-2 hover:text-secondary">Cadena Paper</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/contact" class="block pl-2 py-2 hover:text-secondary">GitHub Resources</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/contact" class="block pl-2 py-2 hover:text-secondary">Contact Us</router-link>
        </div>

        <router-link @click="isMobileMenuOpen = false" to="/login" class="block text-lg font-semibold hover:text-secondary">Login</router-link>
        <router-link
          to="/register"
          class="block w-full bg-secondary hover:bg-secondary text-white px-4 py-3 rounded-full text-sm font-semibold text-center transition"
        >
          Get Started
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import logo from '../assets/logos/cadena_bitcoin_logo.png'

const isMobileMenuOpen = ref(false)
const btcPrice = ref('...')

const fetchBTCPrice = async () => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    const data = await res.json()
    btcPrice.value = data.bitcoin.usd.toLocaleString(undefined, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } catch (err) {
    console.error('Error fetching BTC price:', err)
    btcPrice.value = 'N/A'
  }
}

onMounted(() => {
  fetchBTCPrice()
  setInterval(fetchBTCPrice, 30000)
})

watch(isMobileMenuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>