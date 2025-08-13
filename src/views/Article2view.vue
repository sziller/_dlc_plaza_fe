<template>
  <!-- 🔹 Full Page Stack -->
  <section class="w-screen bg-secondary mt-20 text-white flex flex-col min-h-screen">
    
    <!-- 🔹 Header -->
    <div class="w-full bg-secondary py-8 px-4 text-center shadow-md z-10">
      <h1 class="text-4xl md:text-5xl font-black leading-tight">
        How Cadena Bitcoin is Improving<br class="hidden md:block" />
        Bitcoin Borrowing and Lending
      </h1>
    </div>

    <!-- 🖼️ Image (scaled down) -->
<div class="flex-grow w-full flex items-center justify-center px-4 py-8">
  <img
    src="../assets/images/Infographic Comparison 1 and 2.jpg"
    alt="Infographic Comparison"
    class="max-w-full max-h-[800px] w-auto h-auto object-contain"
    loading="lazy"
  />
</div>


    <div class="w-full bg-secondary text-white py-20 px-6 relative">
  <div class="max-w-4xl mx-auto text-center space-y-6">
    <h2 class="text-3xl md:text-4xl font-extrabold">
      Say Goodbye to Middlemen and Wrapping
    </h2>
    <p class="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
      Custodied loans require trust. DeFi loans require sidechains. Cadena Bitcoin requires neither.
      Our loans are secured, settled, and enforced directly on the Bitcoin blockchain — no wrapping,
      no rehypothecation, no risk of custodial failure.
    </p>
    <div class="flex justify-center mt-8">
      <router-link
        to="/register"
        class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90"
      >
        Start a Bitcoin-Only Loan
      </router-link>
    </div>
  </div>

  <!-- 🔁 Prev Article -->
  <div class="absolute top-1/2 left-4 transform -translate-y-1/2">
    <router-link
      to="/article/we-need-to-talk-about-kyc"
      class="flex items-center gap-2 text-white hover:text-primary transition text-sm md:text-base font-medium max-w-[200px]"
    >
      <span class="text-2xl">←</span>
      <span class="leading-tight">
        We Need to Talk About KYC
      </span>
    </router-link>
  </div>

  <!-- 🔁 Next Article -->
  <div class="absolute top-1/2 right-4 transform -translate-y-1/2 text-right">
    <router-link
      to="/article/cadena-vs-others"
      class="flex items-center justify-end gap-2 text-white hover:text-primary transition text-sm md:text-base font-medium max-w-[200px]"
    >
      <span class="leading-tight">
        Cadena Bitcoin – Decentralized Peer-to-Peer Bitcoin Finance
      </span>
      <span class="text-2xl">→</span>
    </router-link>
  </div>
</div>

    <!-- 🔻 Footer -->
    
  </section>
  <TheFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
