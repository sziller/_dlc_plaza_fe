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
<!-- 🖼️ Image (scaled down) -->
<div class="flex-grow w-full flex items-center justify-center px-4 py-8 bg-primary">
  <picture>
    <source
      type="image/avif"
      srcset="
        /img/Infographic-Comparison-1-and-2-640.avif 640w,
        /img/Infographic-Comparison-1-and-2-960.avif 960w,
        /img/Infographic-Comparison-1-and-2-1280.avif 1280w" />
    <source
      type="image/webp"
      srcset="
        /img/Infographic-Comparison-1-and-2-640.webp 640w,
        /img/Infographic-Comparison-1-and-2-960.webp 960w,
        /img/Infographic-Comparison-1-and-2-1280.webp 1280w" />
    <img
      src="/img/Infographic-Comparison-1-and-2-960.webp"
      srcset="
        /img/Infographic-Comparison-1-and-2-640.webp 640w,
        /img/Infographic-Comparison-1-and-2-960.webp 960w,
        /img/Infographic-Comparison-1-and-2-1280.webp 1280w"
      sizes="(max-width: 768px) 92vw, (max-width: 1280px) 88vw, 70vw"
      width="1280" height="800"       
      loading="lazy" decoding="async"
      class="max-w-full max-h-[800px] w-auto h-auto object-contain"
      alt="Infographic Comparison"
    />
  </picture>
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
        :to="isLoggedIn ? '/btcusd' : '/register'"
        class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90"
      >
        Start a Bitcoin-Only Loan
      </router-link>
    </div>
  </div>

  <!-- Prev Article: stacked under CTA on mobile; absolute on md+ -->
  <div class="mt-6 md:mt-0 md:absolute md:top-1/2 md:left-4 md:transform md:-translate-y-1/2">
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

  <!-- Next Article: comes after prev on mobile; absolute on md+ -->
  <div class="mt-4 md:mt-0 md:absolute md:top-1/2 md:right-4 md:transform md:-translate-y-1/2 md:text-right">
    <router-link
      to="/article/cadena-vs-others"
      class="flex items-center md:justify-end gap-2 text-white hover:text-primary transition text-sm md:text-base font-medium max-w-[200px]"
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
import { useAuth } from '../composables/useAuth'
const { isLoggedIn, setUserFromApi } = useAuth()
onMounted(() => {
  window.scrollTo(0, 0)
  setUserFromApi() 
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
