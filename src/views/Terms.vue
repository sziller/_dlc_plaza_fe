<template>
  <main class="bg-primary text-white mt-20">
    <!-- Header: unified gradient -->
    <section class="px-6 py-12 md:py-16 text-center bg-page-gradient">
      <h1 v-if="title" class="text-3xl md:text-5xl font-extrabold leading-tight">{{ title }}</h1>
      <h1 v-else class="text-3xl md:text-5xl font-extrabold leading-tight">Terms of Service</h1>
    </section>

    <!-- Body -->
    <section class="max-w-4xl mx-auto px-6 py-10">
      <div v-if="loading" class="text-white/80" aria-live="polite">Loading…</div>
      <div v-else-if="error" class="text-red-400">{{ error }}</div>
      <!-- html is generated from escaped source -> safe to v-html -->
      <article v-else class="prose prose-invert max-w-none break-words" v-html="html"></article>
    </section>
  </main>
  <TheFooter />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'
import { getCadenaProdDetails } from '../api/cadenaDefaults'

const raw = ref('')
const title = ref('')
const loading = ref(true)
const error = ref('')

/* --- utils --- */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

function safeUrl(href) {
  try {
    const u = new URL(href, location.origin)
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.href
  } catch {}
  return null
}

function linkifyEscaped(textEscaped) {
  // text is already HTML-escaped; we inject only vetted <a> tags
  return textEscaped.replace(/https?:\/\/[^\s<]+/g, (m) => {
    const href = safeUrl(m)
    if (!href) return m
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="underline text-secondary break-words">${m}</a>`
  })
}

function formatToHtml(text) {
  const escaped = escapeHtml(text.trim())

  // first non-empty line -> page title
  const lines = escaped.split('\n')
  const i = lines.findIndex(l => l.trim().length)
  if (i >= 0) {
    // Title kept escaped (safe)
    title.value = lines[i].trim()
    lines[i] = ''
  }
  const body = lines.join('\n').trim()

  // Promote "1. Section" style lines to H2s
  // Store headings so we can keep them when splitting into blocks
  const withHeadings = body.replace(/^(\d+)\.\s+(.+)$/gm, (_m, n, h) => {
    const id = `s${n}-${slugify(h)}`
    return `<h2 id="${id}" class="mt-10 text-2xl font-bold">${n}. ${h}</h2>`
  })

  // Split on blank lines; keep single newlines as <br>
  const blocks = withHeadings
    .split(/\n{2,}/)
    .map((block) => {
      const b = block.trim()
      if (!b) return ''
      if (b.startsWith('<h2')) return b
      // Linkify inside paragraph while preserving escapes
      const linked = linkifyEscaped(b.replace(/\n/g, '<br>'))
      return `<p class="leading-relaxed">${linked}</p>`
    })

  return blocks.join('\n')
}

const html = computed(() => formatToHtml(raw.value))

onMounted(async () => {
  try {
    raw.value = await getCadenaProdDetails('TermsOfService')
  } catch (e) {
    error.value = e?.message || 'Failed to load terms'
  } finally {
    loading.value = false
  }
})
</script>

<style>
/* Local, CSP-friendly gradient (matches Home) */
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

/* Extra safety: don’t let huge words/URLs blow the layout */
.prose { word-wrap: break-word; overflow-wrap: anywhere; }
</style>
