<template>
  <div class="min-h-screen mt-0 text-white relative overflow-hidden bg-black">
    <!-- HERO -->
    <section class="bg-secondary px-4 py-8 lg:py-12 text-center">
      <div class="max-w-4xl mx-auto space-y-3">
     
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight">
          Cadena Bitcoin Presentation
        </h1>
        <p class="text-white/80 text-base sm:text-lg font-medium max-w-3xl mx-auto">
          Slide deck overview of Cadena Bitcoin’s mission, non-custodial lending model, and how DLCs
          keep your keys in your control.
        </p>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="px-6 py-10 lg:py-14 max-w-5xl mx-auto space-y-8 text-lg leading-relaxed text-white/90">
      

      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg space-y-6">
        <p class="text-white/75">
          Read the slides without leaving the page. Use your browser’s built-in toolbar to zoom or download.
        </p>
        <div class="w-full rounded-xl overflow-hidden border border-white/10 bg-black">
          <iframe
            :src="viewerUrl"
            title="Cadena Bitcoin Presentation PDF"
            class="w-full h-[70vh] min-h-[420px]"
          ></iframe>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <a
            :href="pdfUrl"
            download="Cadena-Bitcoin-Presentation.pdf"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-white text-secondary font-semibold px-6 py-3 text-base shadow-md hover:shadow-lg transition"
          >
            <span>Download PDF</span>
          </a>
          <a
            :href="pdfUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 text-white font-semibold px-6 py-3 text-base hover:bg-white/10 transition"
          >
            <span>Open in New Tab</span>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      <div class="max-w-5xl mx-auto relative">
        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Ready to keep your Bitcoin working for you?
          </h2>
          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
            Access non-custodial, peer-to-peer lending. No sidechains, no rehypothecation, just DLC-secured contracts.
          </p>
          <router-link
            :to="isLoggedIn ? '/allocate_liquidity' : '/register'"
            class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span>Get Started</span>
            <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
          <router-link
            to="/knowledge-hub"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span class="text-2xl transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Knowledge Hub</span>
          </router-link>

          <router-link
            to="/article/cadena-bitcoin-loan-walkthrough"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span>Cadena Bitcoin Loan Walkthrough</span>
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
const pdfUrl = new URL('../assets/images/Cadena Bitcoin - white.pdf', import.meta.url).href
const viewerUrl = `${pdfUrl}#toolbar=1&statusbar=0&navpanes=0`

onMounted(() => {
  setUserFromApi()
  window.scrollTo(0, 0)
})
</script>
