<template>
  <!-- 🔹 Full Page Stack -->
  <section class="w-full bg-black mt-0 text-white flex flex-col min-h-screen overflow-x-hidden">
    
    <!-- 🔹 Header (stays purple) -->
    <div class="w-full bg-secondary py-8 px-4 text-center shadow-md z-10">
      <h1 class="text-4xl md:text-5xl font-black leading-tight">
        How Cadena Bitcoin is Improving<br class="hidden md:block" />
        Bitcoin Borrowing and Lending
      </h1>
    </div>

    <!-- 🖼️ Image (on black) -->
    <div class="flex-grow w-full flex items-center justify-center px-4 py-8 bg-black">
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
          alt="Side-by-side infographic comparing custodied, DeFi, and Cadena Bitcoin loan models"
        />
      </picture>
    </div>

    <!-- 🔹 CTA -->
    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div class="max-w-5xl mx-auto relative">
        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Say Goodbye to Middlemen and Wrapping
          </h2>
          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
            Our loans are secured, settled, and enforced directly on the Bitcoin blockchain — no wrapping,
            no rehypothecation, no risk of custodial failure.
          </p>
          <router-link
            :to="isLoggedIn ? '/btcusd' : '/register'"
            class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span>Start a Bitcoin-Only Loan</span>
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
            to="/article/cadena-empowering-financial-freedom"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span>Empowering Financial Freedom</span>
            <span class="text-2xl transform group-hover:translate-x-1 transition-transform">→</span>
          </router-link>
        </div>
      </div>
    </section>
    
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
/* keep it simple; no inline styles, CSP-friendly */
* { box-sizing: border-box; }
</style>
