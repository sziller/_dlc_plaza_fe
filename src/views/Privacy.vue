<template>
  <main class="min-h-screen text-white pt-20 md:pt-24 relative bg-page-gradient">
    <!-- Header -->
    <section class="px-6 py-12 md:py-16 text-center">
      <h1 class="text-3xl md:text-5xl font-extrabold leading-tight">
        {{ title || 'Privacy Policy' }}
      </h1>
    </section>

    <!-- Body -->
    <section class="max-w-4xl mx-auto px-6 pb-16">
      <div v-if="loading" class="text-white/80">Loading…</div>
      <div v-else-if="error" class="text-red-400">{{ error }}</div>
      <article v-else class="prose prose-invert max-w-none" v-html="html"></article>
    </section>
  </main>
  <TheFooter />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'
import { getCadenaProdDetails } from '../api/cadenaDefaults' // adjust path if needed

const raw = ref('')
const title = ref('')
const loading = ref(true)
const error = ref('')

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function linkifySafe(escaped) {
  // turns plain URLs into safe anchors (keeps everything else escaped)
  return escaped.replace(
    /\bhttps?:\/\/[^\s<>"']+/g,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow" class="text-secondary underline hover:text-secondary/80">${url}</a>`
  )
}

function formatToHtml(text) {
  const escaped = escapeHtml(text.trim())

  // first non-empty line -> title
  const lines = escaped.split('\n')
  const i = lines.findIndex((l) => l.trim().length)
  if (i >= 0) {
    title.value = lines[i].trim()
    lines[i] = ''
  }
  const body = lines.join('\n').trim()

  // Promote "1. Section" lines to H2
  let html = body.replace(
    /^(\d+)\.\s+(.+)$/gm,
    (_m, n, h) => `<h2 id="s${n}" class="mt-10 text-2xl font-bold">${n}. ${h}</h2>`
  )

  // Paragraph blocks (preserve single newlines as <br/>)
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const b = block.trim()
      if (!b) return ''
      if (b.startsWith('<h2')) return b
      // safe-links inside the paragraph; original text already escaped
      const withLinks = linkifySafe(b)
      return `<p class="leading-relaxed">${withLinks.replace(/\n/g, '<br>')}</p>`
    })
    .join('\n')

  return html
}

const html = computed(() => formatToHtml(raw.value))

onMounted(async () => {
  try {
    raw.value = await getCadenaProdDetails('PrivacyPolicy') // expects plain text
  } catch (e) {
    error.value = e?.message || 'Failed to load privacy policy'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Bottom-centered purple glow on black — same as Home */
.bg-page-gradient{
  background-color: #000; /* solid black base */
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

/* Minimal spacing if @tailwindcss/typography isn't installed */
.prose :where(h2){ margin-top:2rem; margin-bottom:0.75rem; }
.prose :where(p){ margin-top:0.75rem; margin-bottom:0.75rem; }
</style>
