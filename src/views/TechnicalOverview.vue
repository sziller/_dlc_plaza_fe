<!-- src/pages/WhitepaperPdf.vue -->
<template>
  <main class="min-h-screen bg-primary text-white pt-24 pb-12">
    <div class="mx-auto max-w-7xl px-6 space-y-4">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Cadena Whitepaper</h1>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <a :href="pdfUrl" download class="underline">Download PDF</a>
          <a :href="pdfUrl" target="_blank" rel="noopener" class="underline">Open full</a>
        </div>
      </header>

      <!-- PDF.js viewer with outline panel forced open -->
      <iframe
        :src="viewerSrc"
        class="w-full h-[82vh] rounded-2xl border border-white/10 bg-black/30 shadow-xl"
        title="Cadena Whitepaper"
      ></iframe>
    </div>

   
  </main>
   <TheFooter class="mt-12" />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

/** SAME PDF as before */
const pdfUrl = '/whitepaper.pdf'

/** PDF.js viewer path (served from /public/pdfjs/web/viewer.html) */
const viewerPath = '../whitepaper.pdf'

/** Optional deep links: /whitepaper-pdf?page=3 or /whitepaper-pdf?dest=Introduction */
const page = ref(1)
const dest = ref('')
const zoom = ref('page-fit')

/** Open the viewer with the Bookmarks/Outline sidebar via pagemode=bookmarks */
const viewerSrc = computed(() => {
  const base = `${viewerPath}?file=${encodeURIComponent(pdfUrl)}`
  const hash = dest.value
    ? `nameddest=${encodeURIComponent(dest.value)}&pagemode=bookmarks&zoom=${zoom.value}`
    : `page=${page.value}&pagemode=bookmarks&zoom=${zoom.value}`
  return `${base}#${hash}`
})

onMounted(() => {
  const qs = new URLSearchParams(location.search)
  const p = Number(qs.get('page'))
  const d = qs.get('dest')
  const z = qs.get('zoom')
  if (Number.isInteger(p) && p > 0) page.value = p
  if (d) dest.value = d
  if (z) zoom.value = z
})
</script>
