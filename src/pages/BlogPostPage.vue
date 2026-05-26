<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { marked } from 'marked'
import { fetchPostBySlug, fetchPublishedPosts, type BlogPost } from '../blogApi/blog'
import { useAuth } from '../composables/useAuth'
import { isSubscriberAuthCode } from '../lib/authCode'
import { postContactEmail, isValidEmail } from '../api/publicContact'
import TheFooter from '../components/TheFooter.vue'
import ComparisonTable from '../components/ComparisonTable.vue'
import RelatedResources from '../components/RelatedResources.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))

const post = ref<BlogPost | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const posts = ref<BlogPost[]>([])
const { isLoggedIn, setUserFromApi, user } = useAuth()

const isSubscriber = computed(() => {
  const code = (user.value as any)?.auth_code ?? (user.value as any)?.payload?.auth_code
  return isSubscriberAuthCode(code)
})

const isGated = computed(() =>
  post.value?.access_level === 'subscriber' && !isSubscriber.value
)

// Newsletter CTA state
const nlEmail = ref('')
const nlLoading = ref(false)
const nlSuccess = ref(false)
const nlError = ref('')

const submitNewsletter = async () => {
  nlError.value = ''
  if (!isValidEmail(nlEmail.value)) {
    nlError.value = 'Please enter a valid email.'
    return
  }
  nlLoading.value = true
  try {
    await postContactEmail(nlEmail.value)
    nlSuccess.value = true
  } catch {
    nlError.value = 'Something went wrong. Please try again.'
  } finally {
    nlLoading.value = false
  }
}

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
    if (import.meta.env.DEV) {
      console.log('[BlogPost] loaded post:', { access_level: post.value?.access_level, title: post.value?.title })
      console.log('[BlogPost] user auth_code:', (user.value as any)?.auth_code, '| isSubscriber:', isSubscriber.value, '| isGated:', isGated.value)
    }
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
  <main class="min-h-screen w-full text-white pt-20 md:pt-32 relative">
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- Loading / error -->
    <div v-if="loading" class="max-w-4xl mx-auto px-6 py-20 text-white/50">Loading…</div>
    <div v-else-if="error" class="max-w-4xl mx-auto px-6 py-20 text-red-400 font-semibold">{{ error }}</div>
    <p v-else-if="!post" class="max-w-4xl mx-auto px-6 py-20 text-white/50">Post not found.</p>

    <template v-else>
      <!-- Hero -->
      <section class="max-w-4xl mx-auto text-center mb-14 px-6">
        <div class="flex items-center justify-center gap-3 text-sm text-white/50 mb-6">
          <RouterLink to="/knowledge-hub" class="hover:text-secondary transition-colors">Knowledge Hub</RouterLink>
          <span>/</span>
          <span>{{ formatDate(post.published_at || post.created_at) }}</span>
          <template v-if="post.access_level === 'subscriber'">
            <span>/</span>
            <span class="text-secondary font-semibold">Subscribers</span>
          </template>
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
          {{ post.title }}
        </h1>
        <p v-if="post.subheading" class="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          {{ post.subheading }}
        </p>
        <p v-if="post.author_name" class="text-sm text-white/40 mt-4">{{ post.author_name }}</p>
      </section>

      <!-- Hero image -->
      <section v-if="post.hero_image_url && !post.article_image_url" class="max-w-4xl mx-auto px-6 mb-12">
        <div class="rounded-2xl overflow-hidden border border-white/10">
          <img :src="post.hero_image_url" :alt="post.title" class="w-full h-auto" loading="lazy" decoding="async" />
        </div>
      </section>

      <!-- Article image -->
      <section v-if="post.article_image_url" class="max-w-4xl mx-auto px-6 mb-12">
        <div class="rounded-2xl overflow-hidden border border-white/10">
          <img :src="post.article_image_url" :alt="post.title" class="w-full h-auto" loading="lazy" decoding="async" />
        </div>
      </section>

      <!-- Slides -->
      <section v-if="post.slides_presentation_url" class="max-w-4xl mx-auto px-6 mb-12">
        <div class="bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
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
          <a
            :href="post.slides_presentation_url"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 rounded-full border border-white/20 text-white text-sm font-semibold px-5 py-2.5 hover:bg-white/10 transition"
          >
            Open in new tab
          </a>
        </div>
      </section>

      <!-- Gate (full-width blur) -->
      <div v-if="isGated" class="relative w-full overflow-hidden mb-0">
        <div class="pointer-events-none select-none blur-sm opacity-30 max-h-48 overflow-hidden px-6">
          <div class="max-w-5xl mx-auto prose prose-invert prose-xl max-w-none" v-html="contentSegments.find(s => s.type === 'html')?.content ?? ''" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black"></div>
        <div class="relative max-w-4xl mx-auto px-6 mt-8 pb-16">
          <div class="rounded-2xl border border-secondary/30 bg-secondary/[0.07] p-8 text-center">
            <p class="text-xs font-semibold tracking-widest uppercase text-secondary mb-3">Subscribers only</p>
            <h3 class="text-xl font-bold mb-2">This article is for newsletter subscribers</h3>
            <p class="text-white/60 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Subscribe to the Cadena newsletter to unlock this article and all subscriber content.
            </p>

            <!-- Create account -->
            <RouterLink
              v-if="!isLoggedIn"
              to="/register"
              class="inline-flex items-center justify-center rounded-full bg-secondary px-7 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90"
            >
              Create an account
            </RouterLink>
            <p v-else class="text-white/50 text-sm mb-6">
              Your account is not yet subscribed. Sign up for the newsletter to unlock access.
            </p>

            <!-- Already have an account -->
            <div class="mt-6 border-t border-white/10 pt-5">
              <p class="text-sm text-white/50">
                Already have an account?
                <RouterLink to="/login" class="text-secondary hover:underline font-semibold">Sign in</RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Body -->
      <section v-if="!isGated" class="max-w-5xl mx-auto px-6 pb-16">
        <template v-for="(segment, idx) in contentSegments" :key="idx">
          <div
            v-if="segment.type === 'html'"
            class="prose prose-invert prose-xl max-w-none
              prose-p:text-white prose-p:leading-relaxed
              prose-headings:text-white prose-headings:font-extrabold
              prose-h2:text-4xl prose-h3:text-2xl
              prose-strong:text-white
              prose-a:text-secondary hover:prose-a:text-white prose-a:no-underline hover:prose-a:underline
              prose-blockquote:text-white prose-blockquote:border-secondary
              prose-li:text-white prose-li:marker:text-secondary
              prose-img:rounded-xl prose-img:border prose-img:border-white/10
              prose-code:text-secondary prose-code:bg-white/5 prose-code:rounded prose-code:px-1"
            v-html="segment.content"
          />
          <ComparisonTable
            v-else-if="segment.type === 'table'"
            class="mt-10"
            :title="segment.config.title"
            :subtitle="segment.config.subtitle"
            :features="segment.config.features"
          />
          <RelatedResources
            v-else-if="segment.type === 'related'"
            class="mt-10"
            :title="segment.config.title"
            :links="segment.config.links"
          />
        </template>
      </section>

      <!-- CTA -->
      <section class="max-w-4xl mx-auto px-6 pb-28">
        <!-- Newsletter CTA (non-subscribers) -->
        <div v-if="!isSubscriber" class="rounded-2xl border border-secondary/30 bg-secondary/[0.06] p-8 md:p-12 mb-6">
          <template v-if="!nlSuccess">
            <p class="text-xs font-semibold tracking-widest uppercase text-secondary mb-3">Cadena Newsletter</p>
            <h2 class="text-3xl md:text-4xl font-extrabold mb-3">Stay ahead of Bitcoin lending</h2>
            <p class="text-white/60 text-lg max-w-xl mb-8 leading-relaxed">
              Educational explainers, product updates, and market insights — delivered to your inbox.
            </p>
            <form class="flex flex-col sm:flex-row gap-3 max-w-lg" @submit.prevent="submitNewsletter">
              <input
                v-model="nlEmail"
                type="email"
                placeholder="your@email.com"
                required
                class="flex-1 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                :disabled="nlLoading"
                class="rounded-full bg-secondary px-7 py-3 text-base font-semibold text-white transition hover:bg-secondary/90 disabled:opacity-60 whitespace-nowrap"
              >
                {{ nlLoading ? 'Joining...' : 'Join newsletter' }}
              </button>
            </form>
            <p v-if="nlError" class="mt-3 text-sm text-red-400">{{ nlError }}</p>
            <p class="mt-4 text-sm text-white/40">
              Already have an account?
              <RouterLink to="/login" class="text-secondary hover:underline">Log in</RouterLink>
            </p>
          </template>
          <template v-else>
            <p class="text-xs font-semibold tracking-widest uppercase text-secondary mb-3">Almost there</p>
            <h2 class="text-3xl font-extrabold mb-2">Confirm your email</h2>
            <p class="text-white/60 text-lg leading-relaxed">
              We sent a confirmation link to <span class="text-white font-semibold">{{ nlEmail }}</span>. Click it to complete your subscription.
            </p>
          </template>
        </div>

        <!-- Navigation row -->
        <div class="flex flex-col sm:flex-row gap-4">
          <RouterLink
            v-if="isSubscriber"
            :to="isLoggedIn ? '/btcusd' : '/register'"
            class="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3 text-base font-semibold text-white transition hover:bg-secondary/90"
          >
            {{ post.cta_button_text || 'Get started' }}
          </RouterLink>
          <RouterLink
            v-if="nextSlug"
            :to="{ name: 'BlogPost', params: { slug: nextSlug } }"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white transition hover:border-white/40 group"
          >
            Next article
            <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </RouterLink>
          <RouterLink
            to="/knowledge-hub"
            class="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white transition hover:border-white/40"
          >
            &larr; Knowledge Hub
          </RouterLink>
        </div>
      </section>
    </template>
  </main>

  <TheFooter />
</template>

<style scoped>
.bg-page-gradient {
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
  .bg-page-gradient {
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
