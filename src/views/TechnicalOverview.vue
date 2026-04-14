<template>
  <main class="min-h-screen w-full text-white pt-20 md:pt-32 relative">
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- Hero -->
    <section class="max-w-4xl mx-auto text-center mb-12 px-6">
      <span class="inline-block text-sm font-semibold tracking-wide uppercase text-secondary mb-4 border border-secondary/40 rounded-full px-4 py-1">
        Technical Overview
      </span>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
        The Cadena Paper
      </h1>
      <p class="text-tertiary text-lg md:text-xl max-w-2xl mx-auto">
        A deep dive into Cadena Bitcoin's protocol design, DLC-based lending architecture,
        and the security model that keeps your keys in your hands.
      </p>

      <!-- Download CTA -->
      <div class="mt-8">
        <a
          :href="pdfUrl"
          download
          class="inline-flex items-center gap-2 rounded-full bg-secondary text-dark font-semibold px-8 py-4 text-lg transition hover:bg-secondary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          Download PDF
        </a>
      </div>
    </section>

    <!-- Embedded PDF viewer -->
    <section class="max-w-5xl mx-auto px-6 mb-16">
      <div class="relative rounded-2xl p-[1px] bg-gradient-to-br from-secondary via-secondary/40 to-transparent">
        <div class="rounded-2xl bg-dark overflow-hidden">
          <iframe
            :src="pdfUrl"
            class="w-full border-0 rounded-2xl"
            style="height: 80vh; min-height: 600px;"
            title="Cadena Paper — Technical Overview PDF"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="max-w-4xl mx-auto text-center px-6 mb-20">
      <h2 class="text-3xl md:text-4xl font-extrabold mb-6">
        Ready to get started?
      </h2>
      <p class="text-tertiary text-lg max-w-2xl mx-auto mb-8">
        Put the protocol to work. Borrow against your Bitcoin or earn yield — all with the security described in the paper.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/register"
          class="inline-block rounded-full bg-white text-dark font-semibold px-8 py-4 text-lg transition hover:bg-white/90"
        >
          Get Started
        </router-link>
        <router-link
          to="/security"
          class="inline-block rounded-full border-2 border-white text-white font-semibold px-8 py-4 text-lg transition hover:bg-white hover:text-dark"
        >
          Learn About Security
        </router-link>
      </div>
    </section>
  </main>

  <TheFooter />
</template>

<script setup>
import TheFooter from '../components/TheFooter.vue'

const pdfUrl = '/whitepaper.pdf'
</script>
