<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchPublishedPosts, type BlogPost } from '../blogApi/blog'
import { useAuth } from '../composables/useAuth'
import TheFooter from '../components/TheFooter.vue'

const posts = ref<BlogPost[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const { isLoggedIn, setUserFromApi } = useAuth()

const formatDate = (value: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const loadPosts = async () => {
  loading.value = true
  try {
    posts.value = await fetchPublishedPosts()
  } catch (e: any) {
    error.value = e?.message ?? 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  setUserFromApi()
  loadPosts()
})
</script>

<template>
  <main class="min-h-screen w-full text-white pt-20 md:pt-32 relative">
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- Hero -->
    <section class="max-w-4xl mx-auto text-center mb-16 px-6">
      <span class="inline-block text-sm font-semibold tracking-wide uppercase text-secondary mb-4 border border-secondary/40 rounded-full px-4 py-1">
        Knowledge Hub
      </span>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
        Everything Bitcoin lending
      </h1>
      <p class="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
        Learn how Bitcoin-backed loans work, how DLCs keep you in control,
        and how to unlock liquidity without selling your Bitcoin.
      </p>
    </section>

    <!-- Post grid -->
    <section class="max-w-7xl mx-auto px-6 pb-24">
      <div v-if="loading" class="text-center py-20 text-white/50">Loading posts…</div>
      <div v-else-if="error" class="text-center py-20 text-red-400 font-semibold">{{ error }}</div>
      <p v-else-if="posts.length === 0" class="text-center py-20 text-white/50">No posts yet.</p>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="post in posts"
          :key="post.id"
          class="post-card rounded-xl overflow-hidden group flex flex-col"
        >
          <RouterLink :to="{ name: 'BlogPost', params: { slug: post.slug } }">
            <img
              v-if="post.hero_image_url"
              :src="post.hero_image_url"
              :alt="post.title"
              class="w-full h-48 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div
              v-else
              class="w-full h-48 bg-gradient-to-br from-secondary/50 via-secondary/30 to-transparent"
            ></div>
          </RouterLink>

          <div class="p-6 flex flex-col flex-1">
            <RouterLink :to="{ name: 'BlogPost', params: { slug: post.slug } }">
              <div class="flex items-start gap-2 mb-3">
                <h2 class="text-lg font-bold group-hover:text-secondary transition-colors leading-snug flex-1">
                  {{ post.title }}
                </h2>
                <span v-if="post.access_level === 'subscriber'" class="flex-shrink-0 mt-0.5 text-xs font-semibold text-secondary border border-secondary/40 rounded-full px-2 py-0.5">
                  Subscribers
                </span>
              </div>
            </RouterLink>
            <p class="text-white/60 text-sm mb-5 line-clamp-3 leading-relaxed flex-1">
              {{ post.excerpt }}
            </p>
            <RouterLink
              :to="{ name: 'BlogPost', params: { slug: post.slug } }"
              class="inline-flex items-center gap-1 text-secondary text-sm font-medium hover:gap-2 transition-all duration-150"
            >
              Read more
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </article>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-4xl mx-auto px-6 pb-28 text-center">
      <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
        Ready to put it to work?
      </h2>
      <p class="text-white/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
        Access liquidity without selling your Bitcoin. Non-custodial, no margin calls, settled on-chain.
      </p>
      <RouterLink
        :to="isLoggedIn ? '/allocate_liquidity' : '/register'"
        class="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3 text-base font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none"
      >
        Get started
      </RouterLink>
    </section>
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

.post-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  transition: border-color 0.2s ease, background 0.2s ease;
}
.post-card:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(103,56,228,0.35);
}
</style>
