<!-- src/pages/WhitepaperPdf.vue -->
<template>
  <main class="min-h-screen bg-primary text-white pt-24 pb-12">
    <div class="mx-auto max-w-7xl px-6">
      <h1 class="text-2xl font-bold tracking-tight mb-4">Cadena Whitepaper</h1>

      <p class="text-white/70" aria-live="polite">Opening the whitepaper…</p>
      <p class="mt-2 text-sm">
        If it doesn't open, 
        <a :href="pdfHref" class="underline" target="_blank" rel="noopener">tap here</a>
        or <a :href="pdfUrl" class="underline" download>download the PDF</a>.
      </p>

      <noscript>
        <p class="mt-4 text-sm text-white/80">
          JavaScript is required to auto-open the PDF.
          <a href="/whitepaper.pdf" class="underline">Open the whitepaper</a>.
        </p>
      </noscript>
    </div>
  </main>
  <TheFooter class="mt-12" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

/** Static file path (same-origin) */
const pdfUrl = '/whitepaper.pdf'

/** Reactive state so the fallback link reflects the same target */
const page = ref(1)
const zoom = ref('page-fit')

/** Build the fragment-only viewer URL */
const pdfHref = computed(() => `${pdfUrl}`)

onMounted(() => {
  try {
    const params = new URLSearchParams(window.location.search)

    // page: positive integer, default 1
    const p = parseInt(params.get('page') || '1', 10)
    page.value = Number.isFinite(p) && p > 0 ? p : 1

    // zoom: keep to a conservative allowlist; default based on viewport
    const z = params.get('zoom')
    const isMobile = window.matchMedia('(max-width: 640px)').matches
    const defaultZoom = isMobile ? 'page-width' : 'page-fit'
    const allowed = /^(page-(?:width|fit)|\d{1,3})$/i   // e.g. "page-width", "page-fit", or numeric %
    zoom.value = z && allowed.test(z) ? z : defaultZoom

    // Replace so Back doesn't bounce back to this helper page
    window.location.replace(pdfHref.value)
  } catch (e) {
    // If anything goes wrong, keep the page visible with working links
    console.error('PDF redirect failed:', e)
  }
})

// Exported for template binding if needed elsewhere
defineExpose({ pdfUrl, pdfHref })
</script>
