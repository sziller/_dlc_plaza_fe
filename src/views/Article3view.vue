<template>
  <div class="bg-primary text-white">
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

    <!-- ARTICLE CONTENT -->
    <section class="px-10 py-5 lg:py-14 max-w-[1100px] mx-auto space-y-6 text-lg leading-relaxed text-white/90">
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

    <!-- VIDEO SECTION -->
    
    <section class="bg-secondary text-white py-20 px-6 relative">
  <div class="max-w-4xl mx-auto text-center space-y-6">
    <h2 class="text-3xl md:text-4xl font-extrabold">
      Cadena Bitcoin Empowers Individual Financial Freedom
    </h2>
    <h4 class="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
      Looking for Leverage or Yield?
    </h4>
    <div class="flex justify-center mt-8">
      <router-link
        to="/register"
        class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90"
      >
        Get Started with Cadena Bitcoin
      </router-link>
    </div>
  </div>

  <!-- 🔁 Prev Article -->
  <div class="absolute top-1/2 left-4 transform -translate-y-1/2">
    <router-link
      to="/article/cadena-vs-others"
      class="flex items-center gap-2 text-white hover:text-primary transition text-sm md:text-base font-medium max-w-[200px]"
    >
      <span class="text-2xl">←</span>
      <span class="leading-tight">
        Cadena Bitcoin – Decentralized Peer-to-Peer Bitcoin Finance
      </span>
    </router-link>
  </div>

  <!-- 🔁 Next Article -->
  <div class="absolute top-1/2 right-4 transform -translate-y-1/2 text-right">
    <router-link
      to="/article/cadena-loan-lifecycle"
      class="flex items-center justify-end gap-2 text-white hover:text-primary transition text-sm md:text-base font-medium max-w-[200px]"
    >
      <span class="leading-tight">
        Cadena Bitcoin: Security
      </span>
      <span class="text-2xl">→</span>
    </router-link>
  </div>
</section>




    <!-- FOOTER -->
    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
