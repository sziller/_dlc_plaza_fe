<template>
  <div class="bg-primary mt-20 text-white ">
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

    <!-- ARTICLE CONTENT -->
    <section class="px-10 py-5 lg:py-14 max-w-[1100px] mx-auto space-y-6 text-lg leading-relaxed text-white/90">
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

      <!-- QUOTE (Edited as requested) -->
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

    <!-- PERSONALIZED CTA -->
  <section class="bg-secondary text-white py-20 px-6 relative">
  <div class="max-w-4xl mx-auto text-center space-y-6">
    <h2 class="text-3xl md:text-4xl font-extrabold">
      Ready to build without KYC?
    </h2>
    <p class="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
      Your keys. Your credit. Your choice. Experience decentralized, verifiable, on-chain lending and borrowing—no sidechains, no wrapping, no margin calls.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      <router-link
        :to="isLoggedIn ? '/btcusd' : '/register'"
        class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90"
      >
        Get Started with Cadena
      </router-link>
    </div>
  </div>

  <!-- Prev: stacks under CTA on mobile; absolute on md+ -->
  <div class="mt-6 md:mt-0 md:absolute md:top-1/2 md:left-4 md:transform md:-translate-y-1/2">
    <router-link
      to="/article/cadena-bitcoin-security"
      class="flex items-center gap-2 text-white hover:text-primary transition text-sm md:text-base font-medium max-w-[200px]"
    >
      <span class="text-2xl">←</span>
      <span class="leading-tight">
        How Does it Work?
      </span>
    </router-link>
  </div>

  <!-- Next: follows prev on mobile; absolute on md+ -->
  <div class="mt-4 md:mt-0 md:absolute md:top-1/2 md:right-4 md:transform md:-translate-y-1/2 md:text-right">
    <router-link
      to="/article/cadena-improving-btc"
      class="flex items-center md:justify-end gap-2 text-white hover:text-primary transition text-sm md:text-base font-medium max-w-[200px]"
    >
      <span class="leading-tight">
        How Cadena Bitcoin is Improving Bitcoin Borrowing and Lending
      </span>
      <span class="text-2xl">→</span>
    </router-link>
  </div>
</section>


    <!-- FOOTER -->
    
  </div>
  <TheFooter />
</template>

<script setup>
import { onMounted, computed } from 'vue'

// Personalization: pass a userName prop (e.g., from your auth store) to tailor the CTA
const props = defineProps({
  userName: {
    type: String,
    default: ''
  }
})

// Fallback to a friendly generic if no name provided
const ctaName = computed(() => props.userName?.trim() || 'friend')
import { useAuth } from '../composables/useAuth'
const { isLoggedIn, setUserFromApi } = useAuth()
onMounted(() => {
  setUserFromApi()
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
