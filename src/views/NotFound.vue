<template>
  <main class="min-h-screen text-white pt-32 pb-20 px-6 relative overflow-hidden flex items-center">
    <div class="fixed inset-0 -z-10 page-gradient"></div>

    <div class="max-w-xl mx-auto text-center space-y-6">
      <p class="text-sm uppercase tracking-widest text-white/40">Error 404</p>
      <h1 class="text-4xl sm:text-5xl font-bold">Page not found</h1>
      <p class="text-white/70 text-base leading-relaxed">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 rounded-full bg-secondary hover:bg-secondary/80 px-6 py-2.5 text-sm font-semibold text-white transition"
        >
          Go to homepage
        </router-link>
        <router-link
          to="/allocate_liquidity"
          class="inline-flex items-center gap-2 rounded-full border border-white/20 hover:border-secondary hover:text-secondary px-6 py-2.5 text-sm font-semibold text-white transition"
        >
          Create a loan
        </router-link>
      </div>
    </div>
  </main>

  <TheFooter />
</template>

<script setup>
import TheFooter from '../components/TheFooter.vue'
</script>

<style scoped>
.page-gradient {
  background-color: #000;
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,
      rgba(103,56,228,0.58) 0%,
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%
    );
}
@supports (background: radial-gradient(in oklch, black, white)) {
  .page-gradient {
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
</style>
