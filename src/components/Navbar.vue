<template>
  <nav class="w-full fixed top-0 z-50 bg-black/80 text-white px-6 py-4 flex justify-between items-center shadow">
    <!-- Logo -->
    <div class="text-xl font-bold tracking-wide">Cadena Bitcoin</div>

    <!-- Hamburger Menu Button -->
    <button
      @click="isMobileMenuOpen = !isMobileMenuOpen"
      class="md:hidden text-white focus:outline-none"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
        viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <!-- Desktop Nav -->
    <div class="hidden md:flex space-x-6 items-center">
      <router-link to="/" class="hover:text-secondary transition">Home</router-link>

      <!-- Explore Cadena Dropdown -->
      <div class="relative group">
        <button class="flex items-center space-x-1 hover:text-secondary transition">
          <span>Explore Cadena</span>
          <svg
            class="w-4 h-4 fill-current text-tertiary group-hover:text-secondary transition"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"/>
          </svg>
        </button>
        <div
          class="absolute top-full left-0 mt-2 bg-primary border border-secondary rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 z-50 w-64"
        >
          <router-link to="/explore#faq" class="block px-4 py-2 hover:bg-secondary hover:text-white transition">FAQ</router-link>
          <router-link to="/explore#technical-faq" class="block px-4 py-2 hover:bg-secondary hover:text-white transition">Technical FAQ</router-link>
          <router-link to="/explore#technical-overview" class="block px-4 py-2 hover:bg-secondary hover:text-white transition">Cadena Paper</router-link>
          <router-link to="/explore#about-us" class="block px-4 py-2 hover:bg-secondary hover:text-white transition">About Us</router-link>
          <router-link to="/explore#contact" class="block px-4 py-2 hover:bg-secondary hover:text-white transition">Contact</router-link>
        </div>
      </div>

      <!-- Existing Services Dropdown -->
      <div class="relative group">
        <button class="flex items-center space-x-1 hover:text-secondary transition">
          <span>Services</span>
          <svg
            class="w-4 h-4 fill-current text-tertiary group-hover:text-secondary transition"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"/>
          </svg>
        </button>
        <div
          class="absolute top-full left-0 mt-2 bg-primary border border-secondary rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 z-50 w-40"
        >
          <router-link to="/borrow" class="block px-4 py-2 hover:bg-secondary hover:text-white transition">Borrow</router-link>
          <router-link to="/lend" class="block px-4 py-2 hover:bg-secondary hover:text-white transition">Invest</router-link>
        </div>
      </div>

      <a href="#" class="hover:text-secondary transition">Rates</a>
    </div>

    <!-- CTA Buttons Desktop -->
    <div class="hidden md:flex items-center space-x-4">
      <a href="#" class="text-sm hover:text-secondary transition">Login</a>
      <button class="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
        Get Started
      </button>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div v-if="isMobileMenuOpen" class="md:hidden bg-black text-white px-6 pt-4 pb-6 space-y-4">
    <router-link @click="isMobileMenuOpen = false" to="/" class="block hover:text-secondary">Home</router-link>

    <!-- Explore Cadena Mobile -->
    <div>
      <div class="text-tertiary uppercase text-xs mb-1">Explore Cadena</div>
      <router-link @click="isMobileMenuOpen = false" to="/explore#faq" class="block pl-2 py-1 hover:text-secondary">FAQ</router-link>
      <router-link @click="isMobileMenuOpen = false" to="/explore#technical-faq" class="block pl-2 py-1 hover:text-secondary">Technical FAQ</router-link>
      <router-link @click="isMobileMenuOpen = false" to="/explore#technical-overview" class="block pl-2 py-1 hover:text-secondary">Cadena Paper</router-link>
      <router-link @click="isMobileMenuOpen = false" to="/explore#about-us" class="block pl-2 py-1 hover:text-secondary">About Us</router-link>
      <router-link @click="isMobileMenuOpen = false" to="/explore#contact" class="block pl-2 py-1 hover:text-secondary">Contact</router-link>
    </div>

    <!-- Services Mobile -->
    <div>
      <div class="text-tertiary uppercase text-xs mt-4 mb-1">Services</div>
      <router-link @click="isMobileMenuOpen = false" to="/borrow" class="block pl-2 py-1 hover:text-secondary">Borrow</router-link>
      <router-link @click="isMobileMenuOpen = false" to="/lend" class="block pl-2 py-1 hover:text-secondary">Invest</router-link>
    </div>

    <router-link @click="isMobileMenuOpen = false" to="#" class="block hover:text-secondary">Rates</router-link>
    <a href="#" class="block hover:text-secondary">Login</a>
    <button class="w-full bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
      Get Started
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isMobileMenuOpen = ref(false)
</script>
