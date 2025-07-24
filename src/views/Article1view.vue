<template>
  <!-- Intro Title Block (add top padding for fixed header offset) -->
  <section class="bg-secondary text-white pt-28 pb-12 px-6">
    <div class="max-w-4xl mx-auto text-center space-y-4">
      <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight">
        Cadena Bitcoin vs Other Bitcoin Lending Platforms
      </h1>
      <p class="text-white/80 text-lg font-medium">Written by Kevin Bell, President</p>
    </div>
  </section>

  <!-- Main Content Section -->
  <section class="bg-primary text-white px-6 py-24">
    <div class="max-w-3xl mx-auto space-y-10">
      <!-- Paragraph 1 -->
      <p class="text-lg leading-relaxed text-white/90">
        Cadena Bitcoin evolved as a solution to a personal problem. I wanted to borrow against Bitcoin, and when I explored 
        the market options, all the solutions involved centralization and trusting third parties.
      </p>

      <!-- Paragraph 2 -->
      <p class="text-lg leading-relaxed text-white/90">
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

      <!-- Paragraph 3 -->
      <p class="text-lg leading-relaxed text-white/90">
        The reason I don’t trust third parties or Bitcoin derivatives isn’t personal — it's understanding how, 
        over thousands of years, humans have developed to respond to incentives. Just look at recent history.
      </p>

      <!-- Quote -->
      <blockquote class="border-l-4 border-secondary pl-4 italic text-white/70">
        From Mt. Gox to Celsius, it’s a story as old as time.
      </blockquote>

      <!-- Paragraph 5 -->
      <p class="text-lg leading-relaxed text-white/90">
        The lesson is that there's an important distinction between owning Bitcoin and merely having exposure to it. 
        I wasn’t looking for a centralized solution for my electronic peer-to-peer cash.
      </p>

      <!-- Paragraph 6 -->
      <p class="text-lg leading-relaxed text-white/90">
        What Cadena does differently is that we're a <span class="text-secondary font-semibold">decentralized peer-to-peer platform</span>. 
        We match borrowers and investors and create smart contracts that are enforced on the Bitcoin blockchain.
      </p>

      <!-- Paragraph 7 -->
      <p class="text-lg leading-relaxed text-white/90">
        At Cadena Bitcoin, we don’t want custody of your coins. Transactions are public and verifiable on-chain. 
        There are no sidechains, no wrapping, no margin calls, and no rehypothecation.
      </p>

      <!-- Paragraph 8 -->
      <p class="text-lg leading-relaxed text-white/90">
        We want borrowers and investors to benefit from using decentralized financial services in a free market to achieve their goals.
      </p>

      <!-- CTA -->
      <p class="text-xl font-semibold leading-relaxed text-white">
        Join us at <span class="text-secondary font-bold">Cadena Bitcoin</span> to experience decentralized peer-to-peer finance, 
        powered by the Bitcoin blockchain.
      </p>
    </div>
  </section>

  <!-- 🖼️ Infographic Section -->
  <section class="bg-white px-6 py-20">
    <div class="max-w-6xl mx-auto text-center">
      <h2 class="text-2xl sm:text-3xl font-bold text-primary mb-8">
        How Cadena Compares
      </h2>
      <div class="rounded-xl overflow-hidden shadow-xl border border-gray-200">
        <img 
          src="../assets/images/Infographic Comparison 2.jpg" 
          alt="Infographic Comparison" 
          class="w-full h-auto object-contain"
        />
      </div>
      <p class="text-gray-700 text-base mt-6 max-w-4xl mx-auto leading-relaxed">
        This visual comparison highlights how Cadena Bitcoin’s decentralized approach offers greater transparency, independence, 
        and control compared to traditional custodial lending platforms.
      </p>
    </div>
  </section>
</template>

<script setup>
// Static content – no logic required
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
