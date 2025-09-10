<template>
  <main class="flex flex-col min-h-screen text-white pt-20 md:pt-24 relative">
    <!-- Gradient Background (matches Home) -->
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- Content Section -->
    <section class="flex-1 px-4 py-4">
      <div class="w-full max-w-screen-xl mx-auto space-y-12 pb-10">
        <MarketOverviewTable />
        <UsersDLCS v-if="isLoggedIn" />
      </div>
    </section>
  </main>

  <TheFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import MarketOverviewTable from '../components/MarketOverviewTable.vue'
import UsersDLCS from '../components/UsersDLCS.vue'
import TheFooter from '../components/TheFooter.vue'
import { useAuth } from '../composables/useAuth'

const { isLoggedIn, setUserFromApi } = useAuth()

onMounted(() => {
  setUserFromApi()
})
</script>

<style scoped>
/* Bottom-anchored purple glow on a black base (same as Home) */
.bg-page-gradient{
  background-color: #000; /* solid black base */
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,      /* big ellipse, anchored at bottom center */
      rgba(103,56,228,0.58) 0%,  /* #6738e4, strongest near bottom */
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%          /* fade to transparent -> pure black */
    );
}

/* Smoother math when OKLCH is available, but same hue (#6738e4) */
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

/* Keep the glow lower on short screens so it doesn't climb mid-page */
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
</style>
