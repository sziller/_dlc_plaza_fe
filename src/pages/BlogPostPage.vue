<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { marked } from 'marked'
import { fetchPostBySlug, fetchPublishedPosts, type BlogPost } from '../blogApi/blog'
import { useAuth } from '../composables/useAuth'
import TheFooter from '../components/TheFooter.vue'
import ComparisonTable from '../components/ComparisonTable.vue'
import RelatedResources from '../components/RelatedResources.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))

const post = ref<BlogPost | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const posts = ref<BlogPost[]>([])
const { isLoggedIn, setUserFromApi } = useAuth()
const comparisonFeatures = [
  { feature: 'Non-custodial collateral', cadena: true, traditional: false, defi: true },
  { feature: 'Transparent liquidation', cadena: true, traditional: false, defi: true },
  { feature: 'On-chain verification', cadena: true, traditional: false, defi: false },
  { feature: 'No rehypothecation', cadena: true, traditional: false, defi: 'Varies' },
  { feature: 'Adjustable LTV', cadena: true, traditional: true, defi: true },
  { feature: 'Instant collateral monitoring', cadena: true, traditional: false, defi: true }
]

const formatDate = (value: string | null | undefined) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const renderBoxBlocks = (content: string) =>
  content.replace(/:::box\s*([\s\S]*?)\s*:::/g, (match, inner) => {
    const innerHtml = marked.parse(inner, { breaks: true })
    return `<div class="kb-box">\n${innerHtml}\n</div>`
  })

const contentSegments = computed(() => {
  type Segment =
    | { type: 'html'; content: string }
    | { type: 'table'; config: any }
    | { type: 'related'; config: any }

  const segments: Segment[] = []
  if (!post.value?.body) return segments

  const regex = /\[\[(comparison-table|related-resources)([\s\S]*?)\]\]/gi
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(post.value.body)) !== null) {
    const before = post.value.body.slice(lastIndex, match.index)
    if (before.trim()) {
      const withBoxes = renderBoxBlocks(before)
      segments.push({ type: 'html', content: marked.parse(withBoxes, { breaks: true }) })
    }

    const kind = match[1]
    const configText = match[2]?.trim()

    if (kind === 'comparison-table') {
      let tableConfig = {
        title: 'Cadena vs Alternatives',
        subtitle: 'Non-custodial, transparent, and on-chain by default',
        features: comparisonFeatures
      }
      if (configText) {
        try {
          const parsed = JSON.parse(configText)
          tableConfig = {
            title: parsed.title || tableConfig.title,
            subtitle: parsed.subtitle || tableConfig.subtitle,
            features:
              Array.isArray(parsed.features) && parsed.features.length ? parsed.features : tableConfig.features
          }
        } catch {
          // ignore parse errors, keep defaults
        }
      }
      segments.push({ type: 'table', config: tableConfig })
    } else if (kind === 'related-resources') {
      let relatedConfig = {
        title: 'Related Resources',
        links: [] as Array<{ to: string; text: string }>
      }
      if (configText) {
        try {
          const parsed = JSON.parse(configText)
          relatedConfig = {
            title: parsed.title || relatedConfig.title,
            links: Array.isArray(parsed.links) ? parsed.links : relatedConfig.links
          }
        } catch {
          // ignore parse errors
        }
      }
      segments.push({ type: 'related', config: relatedConfig })
    }

    lastIndex = regex.lastIndex
  }

  const after = post.value.body.slice(lastIndex)
  if (after.trim()) {
    const withBoxes = renderBoxBlocks(after)
    segments.push({ type: 'html', content: marked.parse(withBoxes, { breaks: true }) })
  }

  return segments
})

const loadPost = async () => {
  loading.value = true
  error.value = null
  try {
    post.value = await fetchPostBySlug(slug.value)
  } catch (e: any) {
    error.value = e?.message ?? 'Failed to load post'
    post.value = null
  } finally {
    loading.value = false
  }
}

const loadPosts = async () => {
  try {
    posts.value = await fetchPublishedPosts()
  } catch (e) {
    // ignore list errors; next article is optional
  }
}

const nextSlug = computed(() => {
  if (!post.value || posts.value.length === 0) return null
  const idx = posts.value.findIndex((p) => p.slug === post.value?.slug)
  if (idx === -1 || idx === posts.value.length - 1) return null
  return posts.value[idx + 1]?.slug ?? null
})

onMounted(() => {
  setUserFromApi()
  loadPost()
  loadPosts()
  window.scrollTo(0, 0)
})

watch(
  () => slug.value,
  () => {
    loadPost()
    window.scrollTo(0, 0)
  }
)
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Hero Section (matches Knowledge Hub) -->
    <section class="bg-secondary px-4 py-6 lg:py-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-3">
          {{ post?.title || 'Loading article...' }}
        </h1>
        <p v-if="post?.subheading" class="text-white/80 text-base sm:text-lg font-medium max-w-3xl mx-auto">
          {{ post.subheading }}
        </p>
        <p v-if="post?.author_name" class="text-white/70 text-sm mt-2">{{ post.author_name }}</p>
      </div>
    </section>

    <!-- Article Content -->
    <section class="bg-black px-6 py-12 lg:py-16 max-w-[1100px] mx-auto">
      <div v-if="loading" class="text-white/80">Loading post…</div>
      <div v-else-if="error" class="text-red-300 font-semibold">
        {{ error }}
      </div>
      <article v-else-if="post" class="space-y-8">
        <div class="flex items-center text-white/60 text-sm">
          <span>{{ formatDate(post.published_at || post.created_at) }}</span>
          <span class="mx-3 text-white/20">•</span>
          <RouterLink to="/knowledge-hub" class="text-secondary hover:text-white font-semibold transition">Back to Hub</RouterLink>
        </div>

        <div v-if="post.hero_image_url && !post.article_image_url" class="rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/30">
          <img
            :src="post.hero_image_url"
            :alt="post.title"
            class="w-full h-auto"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div v-if="post.article_image_url" class="rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-black/25">
          <img
            :src="post.article_image_url"
            :alt="post.title"
            class="w-full h-auto"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div
          v-if="post.slides_presentation_url"
          class="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg space-y-4"
        >
          <p class="text-white/75">
            Read the slides without leaving the page. Use your browser’s toolbar to zoom or open in a new tab.
          </p>
          <div class="w-full rounded-xl overflow-hidden border border-white/10 bg-black">
            <iframe
              :src="post.slides_presentation_url"
              title="Slides Presentation"
              class="w-full h-[70vh] min-h-[420px]"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer"
            ></iframe>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <a
              :href="post.slides_presentation_url"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 text-white font-semibold px-6 py-3 text-base hover:bg-white/10 transition"
            >
              <span>Open in New Tab</span>
            </a>
          </div>
        </div>

        <h2 class="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
          {{ post.title }}
        </h2>

        <template v-for="(segment, idx) in contentSegments" :key="idx">
          <div
            v-if="segment.type === 'html'"
            class="prose prose-invert prose-lg max-w-none prose-headings:text-secondary prose-strong:text-white prose-a:text-secondary hover:prose-a:text-white prose-blockquote:text-white/80 prose-li:marker:text-secondary prose-img:rounded-xl prose-img:border prose-img:border-white/10"
            v-html="segment.content"
          />
          <ComparisonTable
            v-else-if="segment.type === 'table'"
            class="mt-8"
            :title="segment.config.title"
            :subtitle="segment.config.subtitle"
            :features="segment.config.features"
          />
          <RelatedResources
            v-else-if="segment.type === 'related'"
            class="mt-8"
            :title="segment.config.title"
            :links="segment.config.links"
          />
        </template>

      </article>
      <p v-else class="text-white/70">Post not found.</p>
    </section>

    <!-- CTA Section (matches Knowledge Hub) -->
    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      <div class="max-w-5xl mx-auto relative">
        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-4xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            {{ post?.cta_text_big || 'Ready to Borrow Against Your Bitcoin?' }}
          </h2>
          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
            {{ post?.cta_text_small || 'Access instant liquidity without selling your Bitcoin. Decentralized, non-custodial, and secured by DLCs.' }}
          </p>
          <div class="mt-6 flex flex-col items-center gap-3 md:grid md:grid-cols-3 md:items-center md:gap-4">
            <RouterLink
              to="/knowledge-hub"
              class="inline-flex items-center gap-2 rounded-full bg-white/10 text-white font-semibold px-6 py-3 shadow-lg shadow-black/30 hover:bg-white/20 transition md:justify-self-start"
            >
              <span class="text-xl">←</span>
              <span>Back to Knowledge Hub</span>
            </RouterLink>
            <RouterLink
              :to="isLoggedIn ? '/btcusd' : '/register'"
              class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 md:justify-self-center"
            >
              <span>{{ post?.cta_button_text || 'Get Started Today' }}</span>
            </RouterLink>
            <RouterLink
              v-if="nextSlug"
              :to="{ name: 'BlogPost', params: { slug: nextSlug } }"
              class="inline-flex items-center gap-2 rounded-full bg-white text-secondary font-bold px-6 py-3 shadow-lg shadow-secondary/30 hover:shadow-secondary/50 transition group md:justify-self-end"
            >
              <span>Next Article</span>
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>

  <TheFooter />
</template>

<style scoped>
:deep(.kb-box) {
  background: linear-gradient(135deg, rgba(103, 56, 227, 0.1), rgba(103, 56, 227, 0.05));
  border: 1px solid rgba(103, 56, 227, 0.4);
  box-shadow: 0 20px 45px -18px rgba(103, 56, 227, 0.6);
  border-radius: 18px;
  padding: 1.25rem;
  margin: 1.5rem 0;
}
:deep(.kb-box p) {
  color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem 0;
}
:deep(.kb-box ul),
:deep(.kb-box ol) {
  margin: 0.75rem 0 0.5rem 1.25rem;
}
:deep(.kb-box a) {
  color: #fff;
  text-decoration: underline;
}
</style>
