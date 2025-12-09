<template>
  <div class="bg-black mt-0 text-white">
    <!-- HERO TITLE SECTION (Smaller) -->
    <section class="bg-secondary px-4 py-6 lg:py-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          We Need to Talk About KYC
        </h1>
        <p class="text-white/80 text-base sm:text-lg font-medium mb-1">Kevin Bell, CFA</p>
        <p class="text-white/80 text-base sm:text-lg font-medium">President, Cadena Bitcoin</p>
      </div>
    </section>

    <!-- ARTICLE CONTENT (solid black body) -->
    <section class="bg-black px-10 py-5 lg:py-14 max-w-[1100px] mx-auto space-y-6 text-lg leading-relaxed text-white/90">
      <p>
        Identification is quietly becoming the default requirement for access to the internet.
      </p>

      <p>
        No ID? No entry. No selfie? No account. This is how KYC culture has expanded, moving far beyond finance into social
        platforms and even dating apps. We’ve been led to believe that identity verification equals safety.
      </p>

      <p>
        The reality is that centralized databases get breached and information meant for internal review ends up archived
        on the dark web.
      </p>

      <p>
        If we want a safer internet, we need to stop equating surveillance with security. The real path to safety is minimizing what gets
        collected in the first place. That means building systems that do not rely on a single gatekeeper to decide who gets to participate.
      </p>

      <blockquote class="border-l-4 border-white/30 pl-4 md:pl-6 italic text-white/90">
        The safest database is the one that never existed.
      </blockquote>

      <p>
        Ongoing and regular data breaches in the news each week are a reminder that we are all vulnerable in a world that demands ID
        verification just to participate in daily life.
      </p>

      <p>
        KYC is a liability, not a security measure. The more personal data a platform holds, the more dangerous a breach becomes.
        Normalizing ID collection puts people at risk. The existence of a database is always a risk, no matter how noble the intent.
      </p>

      <p>
        Think twice before handing over your ID to a platform you use and ask yourself who is really being protected. The most secure
        systems are those that minimize trust.
      </p>
    </section>

    <!-- CTA -->
    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div class="max-w-5xl mx-auto relative">
        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Ready to build without KYC?
          </h2>
          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
            Your keys. Your credit. Your choice. Experience decentralized, verifiable, on-chain lending and borrowing—no sidechains, no wrapping, no margin calls.
          </p>
          <router-link
            :to="isLoggedIn ? '/btcusd' : '/register'"
            class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span>Get Started with Cadena</span>
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
            to="/article/borrow-against-bitcoin"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span>Borrow Against Bitcoin</span>
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

onMounted(() => {
  setUserFromApi()
  window.scrollTo(0, 0)
})
</script>

<style scoped>
/* Optional Scrollbar Styling */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
