<template>
  <nav class="w-full fixed top-0 z-50 bg-white text-black px-6 py-4 flex justify-between items-center shadow">
    <!-- Logo & BTC Price Block -->
    <div class="flex flex-col items-start space-y-1">
      <div class="text-xl text-secondary font-bold tracking-wide leading-tight">Cadena Bitcoin</div>
      <div class="text-sm font-medium flex items-center gap-1">
        <img src="https://flagcdn.com/us.svg" alt="US Flag" class="w-4 h-4 inline-block" />
        BTC/USD:
         <span class="text-secondary font-semibold">${{ btcPrice }}</span>
      </div>
    </div>

    <!-- Hamburger Menu Button -->
    <button
      @click="isMobileMenuOpen = !isMobileMenuOpen"
      class="md:hidden text-black focus:outline-none"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
        viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 6h16M4 12h16M4 18h16"/>
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
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"/>
          </svg>
        </button>

        <div class="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <router-link to="/borrow" class="block px-4 py-2 hover:bg-gray-100 transition">Borrow</router-link>
          <router-link to="/lend" class="block px-4 py-2 hover:bg-gray-100 transition">Invest</router-link>
        </div>
      </div>

      <!-- Explore Cadena Dropdown -->
      <div class="relative group">
        <button class="flex items-center space-x-1 hover:text-secondary transition">
          <span>Explore Cadena</span>
          <svg class="w-4 h-4 text-gray-500 transition" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"/>
          </svg>
        </button>

        <div class="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <router-link to="/explore#faq" class="block px-4 py-2 hover:bg-gray-100 transition">FAQ</router-link>
          <router-link to="/explore#technical-faq" class="block px-4 py-2 hover:bg-gray-100 transition">Technical FAQ</router-link>
          <router-link to="/explore#technical-overview" class="block px-4 py-2 hover:bg-gray-100 transition">Cadena Paper</router-link>
          <router-link to="/explore#about-us" class="block px-4 py-2 hover:bg-gray-100 transition">About Us</router-link>
          <router-link to="/explore#contact" class="block px-4 py-2 hover:bg-gray-100 transition">Contact</router-link>
        </div>
      </div>
    </div>

    <!-- CTA Buttons Desktop -->
    <div class="hidden md:flex items-center space-x-4">
      <router-link to="/login" class="text-sm hover:text-secondary transition">Login</router-link>
      <router-link
        to="/borrow"
        class="bg-secondary hover:bg-white text-white hover:text-secondary px-4 py-2 rounded-full text-sm font-semibold transition"
      >
        Get Started
      </router-link>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div v-if="isMobileMenuOpen" class="md:hidden bg-white text-black px-6 pt-4 pb-6 space-y-4">
    <router-link @click="isMobileMenuOpen = false" to="/" class="block hover:text-secondary">Home</router-link>

    <!-- Explore Cadena Mobile -->
    <div>
      <div class="text-gray-500 uppercase text-xs mb-1">Explore Cadena</div>
      <router-link @click="isMobileMenuOpen = false" to="/explore#faq" class="block pl-2 py-1 hover:text-secondary">FAQ</router-link>
      <router-link @click="isMobileMenuOpen = false" to="/explore#technical-faq" class="block pl-2 py-1 hover:text-secondary">Technical FAQ</router-link>
      <router-link @click="isMobileMenuOpen = false" to="/explore#technical-overview" class="block pl-2 py-1 hover:text-secondary">Cadena Paper</router-link>
      <router-link @click="isMobileMenuOpen = false" to="/explore#about-us" class="block pl-2 py-1 hover:text-secondary">About Us</router-link>
      <router-link @click="isMobileMenuOpen = false" to="/explore#contact" class="block pl-2 py-1 hover:text-secondary">Contact</router-link>
    </div>

    <!-- Products and Services Mobile -->
    <div>
      <div class="text-gray-500 uppercase text-xs mt-4 mb-1">Products and Services</div>
      <router-link @click="isMobileMenuOpen = false" to="/borrow" class="block pl-2 py-1 hover:text-secondary">Borrow</router-link>
      <router-link @click="isMobileMenuOpen = false" to="/lend" class="block pl-2 py-1 hover:text-secondary">Invest</router-link>
    </div>

    <router-link @click="isMobileMenuOpen = false" to="/login" class="block hover:text-secondary">Login</router-link>
    <router-link
      to="/borrow"
      class="block w-full bg-secondary hover:bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold text-center transition"
    >
      Get Started
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
</script>
