<template>
  <!-- 🔹 Full Page Stack -->
  <section class="w-screen bg-primary text-white flex flex-col min-h-screen">
    
    <!-- 🔹 Header -->
    <div class="w-full bg-secondary py-8 px-4 text-center shadow-md z-10">
      <h1 class="text-4xl md:text-5xl font-black leading-tight">
        How Cadena Bitcoin is Improving<br class="hidden md:block" />
        Bitcoin Borrowing and Lending
      </h1>
    </div>

    <!-- 🖼️ Image (fills remaining space before CTA) -->
    <div class="flex-grow w-full">
      <img
        src="../assets/images/Infographic Comparison 1 and 2.jpg"
        alt="Infographic Comparison"
        class="w-full h-full object-contain"
        loading="lazy"
      />
    </div>

    <!-- 🔻 CTA Section -->
    <div class="w-full bg-secondary text-white py-20 px-6">
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
    </div>

    <!-- 🔻 Footer -->
    <TheFooter />
  </section>
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
