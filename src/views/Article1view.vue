<template>
  <div class="bg-primary text-white">
    <!-- HERO TITLE SECTION (Smaller) -->
    <section class="bg-secondary px-6 py-10 lg:py-14 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          Cadena Bitcoin – Decentralized Peer-to-Peer Bitcoin Finance
        </h1>
        <p class="text-white/80 text-base sm:text-lg font-medium mb-1">Kevin Bell, CFA</p>
        <p class="text-white/80 text-base sm:text-lg font-medium">President, Cadena Bitcoin</p>
      </div>
    </section>

    <!-- ARTICLE CONTENT -->
    <section class="px-6 py-16 lg:py-24 max-w-[1000px] mx-auto space-y-10 text-lg leading-relaxed text-white/90">
      <p>
        Cadena Bitcoin evolved as a solution to a personal problem. I wanted to borrow against Bitcoin, and when I explored 
        the market options, all the solutions involved centralization and trusting third parties.
      </p>

      <p>
        Three lines into the 
        <a 
          href="https://bitcoin.org/bitcoin.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
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
        We match borrowers and investors and create smart contracts that are enforced on the Bitcoin blockchain.
      </p>

      <p>
        At Cadena Bitcoin, we don’t want custody of your coins. Transactions are public and verifiable on-chain. 
        There are no sidechains, no wrapping, no margin calls, and no rehypothecation.
      </p>

      <p>
        We want borrowers and investors to benefit from using decentralized financial services in a free market to achieve their goals.
      </p>

      <!-- CTA styled to stand out -->
      <p class="text-xl font-semibold leading-relaxed text-white">
        Join us at <span class="text-secondary font-bold">Cadena Bitcoin</span> to experience decentralized peer-to-peer finance, 
        powered by the Bitcoin blockchain.
      </p>
    </section>
    <section class="bg-secondary text-white py-20 px-6">
  <div class="max-w-4xl mx-auto text-center space-y-6">
    <h2 class="text-3xl md:text-4xl font-extrabold">
      Experience True Peer-to-Peer Bitcoin Finance
    </h2>
    <p class="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
      No sidechains, no wrapping, no margin calls. Just decentralized, verifiable, on-chain lending and borrowing. The way Bitcoin was meant to work.
    </p>
    <div class="flex justify-center mt-8">
      <router-link
        to="/register"
        class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90"
      >
        Get Started with Cadena
      </router-link>
    </div>
  </div>
</section>

    <!-- FOOTER -->
    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  window.scrollTo(0, 0)
})

import TheFooter from '../components/TheFooter.vue'
</script>

<style scoped>
/* Optional Scrollbar Styling */
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
