<template>
  <div class="bg-black mt-0 text-white overflow-x-hidden">
    <!-- HERO TITLE SECTION -->
    <section class="bg-secondary px-4 py-6 lg:py-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-2">
          How Does it Work?
        </h1>
        <p class="text-white/80 text-base sm:text-lg font-medium">Kevin Bell, CFA</p>
        <p class="text-white/80 text-base sm:text-lg font-medium">President, Cadena Bitcoin</p>
      </div>
    </section>

    <!-- ARTICLE CONTENT (solid black) -->
    <section class="bg-black px-4 py-10 lg:py-14 max-w-[1000px] mx-auto space-y-6 text-base sm:text-lg leading-snug text-white/90">
      <p>
        Cadena Bitcoin is a decentralized lending and borrowing product where
        users lock Bitcoin collateral in a Discreet Log Contract (DLC) to facilitate loans. Here’s a breakdown
        of the key actions:
      </p>

      <!-- Key Actions -->
      <div class="space-y-5">
        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-1">Posting an Offer</h2>
        <p>
          A user (Initiator) posts an offer on Cadena Bitcoin, locking collateral and
          specifying interest rate. Terms like loan size, contract tenor, loan to value,
          and currency (USD) are fixed at the product level.
        </p>

        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-1">Accepting an Offer</h2>
        <p>
          Peer accepts the offer, locking in their collateral and forming a contract.
        </p>

        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-1">Funding Transaction</h2>
        <p>
          The on-chain DLC holds users’ collateral, provides change, and covers
          Cadena Bitcoin’s service fee.
        </p>

        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-1">Contract Execution</h2>
        <p>
          At maturity, the Oracle’s attestation determines the contract outcome. A
          single Contract Execution Transaction (CET) is broadcast, splitting the
          locked collateral based on the BTCUSD price.
        </p>
      </div>

      <!-- Financial Terms -->
      <div class="space-y-5">
        <h4 class="text-xl sm:text-2xl font-semibold text-secondary mb-1">Term</h4>
        <p>
          Each Cadena Bitcoin contract lasts 30, 90, 180, or 365 days starting when the contract is accepted. Duration may extend slightly to align with the next available Oracle attestation after maturity.
        </p>

        <h4 class="text-xl sm:text-2xl font-semibold text-secondary mb-1">Interest</h4>
        <p>
          Simple interest using a 30/360-day count convention (commonly used in USD debt). No compounding. For tenors shorter than 1 year, the 360-day basis understates the true rate compared to a 365-day base.
        </p>

        <h4 class="text-xl sm:text-2xl font-semibold text-secondary mb-1">Loan Size</h4>
        <p>
          Base loan value is 0.1 BTC.
        </p>

        <p><span class="font-semibold text-secondary">Lender contribution:</span> Base Loan / (1.0 + interest / 100)</p>

        <p>
          <span class="font-semibold text-secondary">Borrower Loan:</span>
          Borrower provides 0.1 BTC plus 0.50% service fee minus lender’s contribution.
        </p>

        <p>
          <span class="font-semibold text-secondary">Settlement:</span>
          A single Contract Execution Transaction (CET) splits collateral based on BTCUSD price at maturity.
        </p>
      </div>
    </section>

    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div class="max-w-5xl mx-auto relative">
        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Bitcoin Backed Loans Made Simple and Transparent
          </h2>
          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
            All transactions are on-chain secured by Discreet Log Contracts and settled with a single execution based on a trusted Oracle price feed.
          </p>
          <router-link
            :to="isLoggedIn ? '/btcusd' : '/register'"
            class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span>Explore Cadena Bitcoin Contracts</span>
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
            to="/article/we-need-to-talk-about-kyc"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span>We Need to Talk About KYC</span>
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
