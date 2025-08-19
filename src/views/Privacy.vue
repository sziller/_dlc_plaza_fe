<template>
  <main class="bg-primary text-white mt-20">
    <!-- Header -->
    <section class="px-6 py-12 md:py-16 text-center bg-[linear-gradient(to_bottom,_#000_0%,_#000_56%,_#0a051f_66%,_#1b0a3c_76%,_#35157a_88%,_#6738e4_100%)]">
      <h1 v-if="title" class="text-3xl md:text-5xl font-extrabold leading-tight">{{ title }}</h1>
      <h1 v-else class="text-3xl md:text-5xl font-extrabold leading-tight">Privacy Policy</h1>
    </section>

    <!-- Body -->
    <section class="max-w-4xl mx-auto px-6 py-10">
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
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function formatToHtml(text) {
  const escaped = escapeHtml(text.trim())

  // first non-empty line -> page title
  const lines = escaped.split('\n')
  const i = lines.findIndex(l => l.trim().length)
  if (i >= 0) {
    title.value = lines[i].trim()
    lines[i] = ''
  }
  const body = lines.join('\n').trim()

  // Promote "1. Section" lines to H2
  let html = body.replace(/^(\d+)\.\s+(.+)$/gm, (_m, n, h) =>
    `<h2 id="s${n}" class="mt-10 text-2xl font-bold">${n}. ${h}</h2>`)

  // Paragraph blocks. Preserve single newlines with <br>
  html = html
    .split(/\n{2,}/)
    .map(block => {
      const b = block.trim()
      if (!b) return ''
      if (b.startsWith('<h2')) return b
      return `<p class="leading-relaxed">${b.replace(/\n/g, '<br>')}</p>`
    })
    .join('\n')

  return html
}

const html = computed(() => formatToHtml(raw.value))

onMounted(async () => {
  try {
    raw.value = await getCadenaProdDetails('PrivacyPolicy')
  } catch (e) {
    error.value = e?.message || 'Failed to load privacy policy'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Minimal spacing if @tailwindcss/typography isn't installed */
.prose :where(h2){ margin-top:2rem; margin-bottom:0.75rem; }
.prose :where(p){ margin-top:0.75rem; margin-bottom:0.75rem; }
</style>
