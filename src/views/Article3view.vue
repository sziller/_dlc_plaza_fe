<template>
  <div class="bg-black mt-0 text-white overflow-x-hidden">
    <!-- HERO TITLE SECTION -->
    <section class="bg-secondary px-4 py-6 lg:py-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          Cadena Bitcoin – Empowering Individual Financial Freedom
        </h1>
        <p class="text-white/80 text-base sm:text-lg font-medium mb-1">Kevin Bell, CFA</p>
        <p class="text-white/80 text-base sm:text-lg font-medium">President, Cadena Bitcoin</p>
      </div>
    </section>

    <!-- ARTICLE CONTENT (now on black) -->
    <section class="bg-black px-10 py-5 lg:py-14 max-w-[1100px] mx-auto space-y-6 text-lg leading-relaxed text-white/90">
      <p>
        Cadena Bitcoin lets you use Bitcoin flexibly—whether you want to grow your
        Bitcoin holdings, access fiat without losing Bitcoin exposure, or generate 
        fiat returns secured by Bitcoin. Here’s how it works for two types of users:
      </p>

      <!-- Bob Section -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-secondary">Bob (Borrower)</h2>
        <p>
          Bob wants more Bitcoin exposure without selling his stash. He uses his 
          Bitcoin as collateral to borrow additional Bitcoin via Cadena, allowing him 
          to HODL more. 
        </p>
        <p>
          Alternatively, if Bob needs fiat (e.g., for a big purchase, debt payoff, or starting a business), 
          he can borrow Bitcoin, sell it for fiat, and remain protected if Bitcoin’s price rises.
        </p>
      </div>

      <!-- Alice Section -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-secondary">Alice (Investor)</h2>
        <p>
          Alice seeks a high risk-adjusted fiat return, secured by Bitcoin collateral. 
          She’s okay with the risk of losing fiat if Bitcoin’s value drops beyond her 
          collateral coverage.
        </p>
        <p>
          If Bitcoin falls significantly during the loan term, Alice keeps all the collateral, 
          boosting her Bitcoin holdings.
        </p>
      </div>

      <!-- Settlement Details -->
      <p>
        For the term of the loan, user funds are time locked on the Bitcoin blockchain 
        then settled based on Bitcoin’s final price.
      </p>
    </section>

    <!-- CTA SECTION (stays purple) -->
    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div class="max-w-5xl mx-auto relative">
        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Cadena Bitcoin Empowers Individual Financial Freedom
          </h2>
          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
            Looking for leverage or yield? Tap non-custodial, verifiable, on-chain lending and borrowing—without sidechains, wrapping, or margin calls.
          </p>
          <router-link
            :to="isLoggedIn ? '/btcusd' : '/register'"
            class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span>Get Started with Cadena Bitcoin</span>
            <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
          <router-link
            to="/knowledge-hub"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span class="text-2xl transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Knowledge Hub</span>
          </router-link>

          <router-link
            to="/article/cadena-bitcoin-security"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span>Bitcoin Security</span>
            <span class="text-2xl transform group-hover:translate-x-1 transition-transform">→</span>
          </router-link>
        </div>
      </div>
    </section>
  </div>

  <TheFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'
import { useAuth } from '../composables/useAuth'

const { isLoggedIn, setUserFromApi } = useAuth()

onMounted(() => {
  setUserFromApi()
  window.scrollTo(0, 0)
})
</script>

<style scoped>
/* optional scrollbar styling */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
