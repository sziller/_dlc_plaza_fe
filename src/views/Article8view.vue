<template>
  <div class="min-h-screen mt-0 text-white relative overflow-hidden bg-black">
    <section class="bg-secondary px-4 py-6 lg:py-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          Bitcoin Collateral Loans: Everything You Need to Know
        </h1>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-6 py-8">
      <picture>
        <source type="image/avif" :srcset="getImageSrcset('avif')" />
        <source type="image/webp" :srcset="getImageSrcset('webp')" />
        <img :src="`/img/article8-960.webp`" alt="Bitcoin collateral loans explained" class="w-full rounded-lg" loading="eager" decoding="async" />
      </picture>
    </section>

    <section class="px-10 py-5 lg:py-14 max-w-[1100px] mx-auto space-y-6 text-lg leading-relaxed text-white/90">
      <p>Bitcoin collateral loans allow you to unlock liquidity from your Bitcoin holdings without selling. Understanding how collateral works, managing loan-to-value ratios, and avoiding liquidation are critical skills for any Bitcoin borrower. This comprehensive guide covers everything from basic concepts to advanced collateral management strategies.</p>

      <div class="space-y-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Understanding Bitcoin as Collateral</h2>
          <p>When you use Bitcoin as collateral, you're pledging your BTC to secure a loan without transferring ownership. The lender locks your Bitcoin in a secure contract (DLC, multisig, or custodial wallet depending on the platform), and if you default, they have the right to liquidate the collateral to recover their funds.</p>
          <p class="mt-4">This differs fundamentally from traditional collateral like real estate or cars. Bitcoin's high volatility means collateral values can change dramatically in hours, requiring dynamic management and automated liquidation mechanisms to protect lenders.</p>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Loan-to-Value Ratios and Collateral Requirements</h2>
          <p>The loan-to-value (LTV) ratio determines how much you can borrow against your Bitcoin. Most platforms offer 30-70% LTV, meaning:</p>
          <ul class="list-disc list-inside space-y-2 mt-4 ml-4">
            <li><strong>30% LTV:</strong> Very safe, large collateral buffer, low liquidation risk</li>
            <li><strong>50% LTV:</strong> Balanced approach, standard for most borrowers</li>
            <li><strong>70% LTV:</strong> Maximum liquidity, higher liquidation risk, requires active monitoring</li>
          </ul>
          <p class="mt-4">On Cadena Bitcoin, you can choose your LTV ratio based on your risk tolerance. Conservative borrowers opt for 30-40% LTV, while experienced traders comfortable with volatility may use 60-70% LTV.</p>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Liquidation Mechanics and Protection</h2>
          <p>Liquidation occurs when your collateral value falls below the minimum threshold (typically 110-125% of the loan value). When this happens, the platform automatically sells your Bitcoin to repay the lender.</p>
          <p class="mt-4">Cadena's DLC-based system provides transparent, on-chain liquidation triggered by oracle price feeds—no hidden liquidation engines or preferential treatment. You always know exactly when liquidation will occur based on publicly verifiable price data.</p>
        </div>
      </div>

      <ComparisonTable
        title="Collateral Management: Cadena vs Competitors"
        subtitle="How different platforms handle your Bitcoin collateral"
        :features="comparisonFeatures"
        cta-text="Secure Your Bitcoin Loan"
      />

      <div class="space-y-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Best Practices for Collateral Management</h2>
          <ul class="list-disc list-inside space-y-3 mt-4 ml-4">
            <li><strong>Start conservative:</strong> Your first loan should be 30-40% LTV to learn the mechanics safely</li>
            <li><strong>Monitor regularly:</strong> Check your collateral ratio daily during volatile markets</li>
            <li><strong>Add margin proactively:</strong> Don't wait until you're close to liquidation—add collateral when you reach 60% of the liquidation threshold</li>
            <li><strong>Set price alerts:</strong> Use alerts to notify you when Bitcoin drops 10%, 15%, 20% from your loan price</li>
            <li><strong>Understand grace periods:</strong> Some platforms offer time to add collateral; Cadena's DLCs settle automatically based on oracle data</li>
          </ul>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Collateral Security: Custodial vs Non-Custodial</h2>
          <p>The biggest risk in Bitcoin collateral loans isn't liquidation—it's custody. Centralized platforms like BlockFi and Celsius held custody of borrowers' collateral and lost billions when they became insolvent.</p>
          <p class="mt-4">Cadena's <router-link to="/article/non-custodial-bitcoin-borrowing" class="text-secondary underline hover:text-white transition">non-custodial approach</router-link> using DLCs means your Bitcoin never enters a company wallet. It's locked in a contract controlled by cryptographic keys, not by corporate custodians who can misuse or lose your funds.</p>
        </div>
      </div>

      <div class="bg-white/5 border border-secondary/30 rounded-lg p-6 my-8">
        <h3 class="text-xl font-bold text-secondary mb-4">Related Resources</h3>
        <ul class="space-y-2">
          <li v-for="link in relatedArticles" :key="link.to">
            <router-link :to="link.to" class="text-white hover:text-secondary transition flex items-start">
              <span class="text-secondary mr-2">→</span>
              <span>{{ link.text }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Conclusion: Master Collateral Management for Safe Bitcoin Borrowing</h2>
        <p>Bitcoin collateral loans are powerful tools, but they require understanding and active management. By choosing appropriate LTV ratios, monitoring your positions, and using non-custodial platforms like Cadena Bitcoin, you can safely access liquidity while maintaining control of your assets.</p>
      </div>
    </section>

    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div class="max-w-5xl mx-auto relative">
        <!-- Main CTA Card -->
        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Start Your Bitcoin-Backed Loan
          </h2>
          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
            Non-custodial collateral management with full transparency. Your Bitcoin, secured by DLCs, never in custody.
          </p>

          <router-link
            :to="isLoggedIn ? '/allocate_liquidity' : '/register'"
            class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span>Get Started</span>
            <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
          <router-link
            to="/article/borrow-against-bitcoin"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span class="text-2xl transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Borrow Against Bitcoin</span>
          </router-link>

          <router-link
            to="/article/non-custodial-bitcoin-borrowing"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span>Non-Custodial Bitcoin Borrowing</span>
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
import ComparisonTable from '../components/ComparisonTable.vue'
import { useAuth } from '../composables/useAuth'

const { isLoggedIn, setUserFromApi } = useAuth()

const comparisonFeatures = [
  { feature: 'Non-custodial collateral', cadena: true, traditional: false, defi: true },
  { feature: 'Transparent liquidation', cadena: true, traditional: false, defi: true },
  { feature: 'On-chain verification', cadena: true, traditional: false, defi: false },
  { feature: 'No rehypothecation', cadena: true, traditional: false, defi: 'Varies' },
  { feature: 'Adjustable LTV', cadena: true, traditional: true, defi: true },
  { feature: 'Instant collateral monitoring', cadena: true, traditional: false, defi: true }
]

const relatedArticles = [
  { to: '/article/borrow-against-bitcoin', text: 'How to Borrow Against Bitcoin' },
  { to: '/article/peer-to-peer-bitcoin-loans', text: 'Peer-to-Peer Bitcoin Loans' },
  { to: '/article/bitcoin-backed-loans', text: 'Bitcoin Backed Loans Market Overview' },
  { to: '/knowledge-hub', text: 'Browse Knowledge Hub' }
]

function getImageSrcset(format) {
  return `/img/article8-640.${format} 640w, /img/article8-960.${format} 960w, /img/article8-1280.${format} 1280w`
}

onMounted(() => {
  setUserFromApi()
  window.scrollTo(0, 0)
})
</script>
