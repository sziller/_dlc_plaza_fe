<!-- src/pages/WhitepaperPdf.vue -->
<template>
  <main class="min-h-screen bg-primary text-white pt-24 pb-12">
    <div class="mx-auto max-w-7xl px-6">
      <h1 class="text-2xl font-bold tracking-tight mb-4">Cadena Whitepaper</h1>
      <p class="text-white/70">Opening the whitepaper…</p>
      <p class="mt-2 text-sm">
        If it doesn't open, <a :href="pdfHref" class="underline">tap here</a>.
      </p>
    </div>
  </main>
  <TheFooter class="mt-12" />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

const pdfUrl = '/whitepaper.pdf'

// preserve ?page=&zoom= if present
const qs = new URLSearchParams(location.search)
const page = Number(qs.get('page')) || 1
const zoomQ = qs.get('zoom') || ''
const isMobile = matchMedia('(max-width: 640px)').matches
// many browsers ignore zoom, but it's harmless
const zoom = zoomQ || (isMobile ? 'page-width' : 'page-fit')

const pdfHref = computed(() => `${pdfUrl}#page=${page}&zoom=${encodeURIComponent(zoom)}`)

onMounted(() => {
  window.location.replace(pdfHref.value) // replaces history so Back doesn’t bounce here
})
</script>
