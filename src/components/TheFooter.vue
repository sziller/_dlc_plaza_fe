<template>
  <footer class="text-white" style="background:#081123">
    <div class="max-w-screen-xl mx-auto px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">

      <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">

        <!-- Logo -->
        <div class="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col items-start">
          <router-link to="/" aria-label="Go to homepage" class="block">
            <img
              :src="logo"
              alt="Cadena Bitcoin Logo"
              loading="lazy"
              decoding="async"
              width="48" height="48"
              class="w-12 h-12 object-contain"
            />
          </router-link>
          <div class="text-lg font-extrabold text-secondary mt-3">Cadena Bitcoin</div>
        </div>

        <!-- Company -->
        <div>
          <p class="text-sm font-semibold text-secondary mb-4 uppercase tracking-wide">Company</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li><router-link to="/contact" class="hover:text-white transition-colors">Contact</router-link></li>
            <li><router-link to="/newsletter" class="hover:text-white transition-colors">Newsletter</router-link></li>
            <li><a href="https://mempool.space/tx/95bf1377f4709235656bbaafa4afe454f91e905f8bb2dfe3e2bd1b619e5aab7d" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">On-chain proof</a></li>
          </ul>
        </div>

        <!-- Product -->
        <div>
          <p class="text-sm font-semibold text-secondary mb-4 uppercase tracking-wide">Product</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li><router-link to="/allocate_liquidity" class="hover:text-white transition-colors">Create Loan</router-link></li>
            <li><router-link to="/loan-calculator" class="hover:text-white transition-colors">Loan Calculator</router-link></li>
            <li><router-link to="/settlement-calculator" class="hover:text-white transition-colors">Settlement Calculator</router-link></li>
            <li><router-link to="/liquidation-calculator" class="hover:text-white transition-colors">Liquidation Risk</router-link></li>
            <li><router-link to="/bitcoin-allocation" class="hover:text-white transition-colors">Bitcoin Allocation</router-link></li>
            <li><router-link to="/knowledge-hub" class="hover:text-white transition-colors">Knowledge Hub</router-link></li>
            <li><router-link to="/compare" class="hover:text-white transition-colors">Compare</router-link></li>
          </ul>
        </div>

        <!-- Resources (shared with the Navbar menu — see src/data/siteMenu.js) -->
        <div>
          <p class="text-sm font-semibold text-secondary mb-4 uppercase tracking-wide">Resources</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li v-for="item in resourcesLinks" :key="item.to">
              <router-link :to="item.to" class="hover:text-white transition-colors">{{ item.label }}</router-link>
            </li>
            <li><router-link to="/endgame-study-guide" class="hover:text-white transition-colors">Endgame Study Guide</router-link></li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <p class="text-sm font-semibold text-secondary mb-4 uppercase tracking-wide">Social</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li>
              <a href="https://x.com/cadenabitcoin" class="hover:text-white transition-colors" rel="noopener noreferrer" target="_blank">
                X <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://youtube.com/@cadenabitcoin?si=VNgOLehpTTVFELbt" class="hover:text-white transition-colors" rel="noopener noreferrer" target="_blank">
                YouTube <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@cadenabitcoin" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">
                Freedom Money Podcast <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://instagram.com/cadenabitcoin" class="hover:text-white transition-colors" rel="noopener noreferrer" target="_blank">
                Instagram <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://facebook.com/cadenabitcoin" class="hover:text-white transition-colors" rel="noopener noreferrer" target="_blank">
                Facebook <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/CadenaWizard/cryptlib" class="hover:text-white transition-colors" rel="noopener noreferrer" target="_blank">
                GitHub <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/company/cadenabitcoin" class="hover:text-white transition-colors" rel="noopener noreferrer" target="_blank">
                LinkedIn <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://discord.gg/RPUa6q7cs" class="hover:text-white transition-colors" rel="noopener noreferrer" target="_blank">
                Discord <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <p class="text-sm font-semibold text-secondary mb-4 uppercase tracking-wide">Legal</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li><router-link to="/terms" class="hover:text-white transition-colors">Terms</router-link></li>
            <li><router-link to="/privacy" class="hover:text-white transition-colors">Privacy</router-link></li>
            <li><router-link to="/cookies" class="hover:text-white transition-colors">Cookies</router-link></li>
          </ul>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="mt-12 pt-6 border-t border-white/10 text-xs text-white/40 text-center leading-relaxed">
        <p>&copy; {{ year }} Cadena Bitcoin. All rights reserved. Cadena Bitcoin is operated by Cadena Bitcoin S.A. de C.V., an El Salvador&ndash;licensed Bitcoin Service Provider. <span class="whitespace-nowrap" data-app-version>v{{ version }}</span></p>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import logo from '../assets/logos/cadena_bitcoin_logo_2.png'
import { resourcesLinks } from '../data/siteMenu'
const year = computed(() => new Date().getFullYear())
const version = __APP_VERSION__
</script>

<style scoped>
/* no extra styling needed */
</style>
