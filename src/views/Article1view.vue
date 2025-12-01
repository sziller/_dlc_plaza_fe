<template>
  <div class="min-h-screen mt-0 text-white relative overflow-hidden bg-black">
    <!-- HERO TITLE SECTION (Smaller) -->
    <section class="bg-secondary px-4 py-6 lg:py-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          Cadena Bitcoin – Decentralized Peer-to-Peer Bitcoin Finance
        </h1>
        <p class="text-white/80 text-base sm:text-lg font-medium mb-1">Kevin Bell, CFA</p>
        <p class="text-white/80 text-base sm:text-lg font-medium">President, Cadena Bitcoin</p>
      </div>
    </section>

    <!-- ARTICLE CONTENT -->
    <section class="px-10 py-5 lg:py-14 max-w-[1100px] mx-auto space-y-6 text-lg leading-relaxed text-white/90">
      <p>
        Cadena Bitcoin evolved as a solution to a personal problem. I wanted to borrow against Bitcoin, and when I explored 
        the market options, all the solutions involved centralization and trusting third parties.
      </p>

      <p>
        Three lines into the 
        <a 
          href="https://bitcoin.org/bitcoin.pdf" 
          target="_blank" 
          rel="noopener noreferrer nofollow"
          referrerpolicy="no-referrer"
          class="text-secondary underline hover:text-secondary/80 transition"
        >
          White Paper
        </a> 
        — Satoshi tells us that “the main benefits are lost if a trusted third party is still required”. 
        15 years later, I still think he meant it.
      </p>

      <p>
        The reason I don’t trust third parties or Bitcoin derivatives isn’t personal — it's understanding how, 
        over thousands of years, humans have developed to respond to incentives. Just look at recent history.
        From Mt. Gox to Celsius, it’s a story as old as time.
      </p>

      <p>
        The lesson is that there's an important distinction between owning Bitcoin and merely having exposure to it. 
        I wasn’t looking for a centralized solution for my electronic peer-to-peer cash.
      </p>

      <p>
        What Cadena does differently is that we're a 
        <span class="text-secondary font-semibold">decentralized peer-to-peer platform</span>. 
        We match borrowers and investors and create smart contracts that are funded and settled on the Bitcoin blockchain.
      </p>

      <p>
        At Cadena Bitcoin, we don’t want custody of your coins. Transactions are public and verifiable on-chain. 
        There are no sidechains, no wrapping, no margin calls, and no rehypothecation.
      </p>

      <p>
        We want borrowers and investors to benefit from using decentralized financial services in a free market to achieve their goals.
      </p>
    </section>

    <section class="bg-secondary text-white py-20 px-6 relative">
      <div class="max-w-4xl mx-auto text-center space-y-6">
        <h2 class="text-3xl md:text-4xl font-extrabold">
          Experience True Peer-to-Peer Bitcoin Finance
        </h2>
        <p class="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
          No sidechains, no wrapping, no margin calls. Just decentralized, verifiable, on-chain lending and borrowing. The way Bitcoin was meant to work.
        </p>

        <!-- CTA -->
        <div class="flex justify-center mt-8">
          <router-link
            :to="isLoggedIn ? '/btcusd' : '/register'"
            class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90"
          >
            Get Started with Cadena
          </router-link>
        </div>
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
          to="/article/cadena-improving-btc"
          class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
        >
          <span>Improving BTC Borrowing</span>
          <span class="text-2xl transform group-hover:translate-x-1 transition-transform">→</span>
        </router-link>
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
/* Match Home’s bottom-anchored purple glow */
.bg-page-gradient{
  background-color: #000; /* solid black base */
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,      /* big ellipse, anchored at bottom center */
      rgba(103,56,228,0.58) 0%,  /* #6738e4 strongest near bottom */
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%          /* fade to transparent -> pure black */
    );
}
@supports (background: radial-gradient(in oklch, black, white)) {
  .bg-page-gradient{
    background-color: oklch(0 0 0);
    background-image:
      radial-gradient(
        in oklch 125% 75% at 50% 100%,
        oklch(from #6738e4 l c h / 0.60) 0%,
        oklch(from #6738e4 l c h / 0.36) 26%,
        oklch(from #6738e4 l c h / 0.16) 52%,
        oklch(0 0 0 / 0) 76%
      );
  }
}
/* Keep the glow lower on short screens */
@media (max-height: 800px){
  .bg-page-gradient{
    background-image:
      radial-gradient(
        120% 60% at 50% 100%,
        rgba(103,56,228,0.52) 0%,
        rgba(103,56,228,0.30) 24%,
        rgba(103,56,228,0.12) 48%,
        rgba(0,0,0,0) 70%
      );
  }
}

/* Optional Scrollbar Styling (safe; no inline JS) */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
