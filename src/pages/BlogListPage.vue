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
  <div class="min-h-screen bg-black text-white">
    <!-- Hero Section (exact Knowledge Hub layout) -->
    <section class="bg-secondary px-4 py-12 lg:py-16 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          Knowledge Hub
        </h1>
        <p class="text-xl text-white/90 max-w-2xl mx-auto">
          Learn everything about Bitcoin-backed loans, decentralized lending,
          and how to unlock liquidity from your Bitcoin holdings.
        </p>
      </div>
    </section>

    <!-- Resource Grid (exact Knowledge Hub layout) -->
    <section class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-if="loading" class="md:col-span-2 lg:col-span-3 text-white/80">Loading posts…</div>
        <div v-else-if="error" class="md:col-span-2 lg:col-span-3 text-red-300 font-semibold">
          {{ error }}
        </div>

        <article
          v-else
          v-for="post in posts"
          :key="post.id"
          class="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-secondary/50 group"
        >
          <!-- Hero Image -->
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
              class="w-full h-48 bg-gradient-to-br from-secondary/60 via-secondary/40 to-amber-400/50 group-hover:opacity-90 transition"
            ></div>
          </RouterLink>

          <!-- Card Content -->
          <div class="p-6">
            <RouterLink :to="{ name: 'BlogPost', params: { slug: post.slug } }">
              <h2 class="text-xl font-bold mb-3 group-hover:text-secondary transition">
                {{ post.title }}
              </h2>
            </RouterLink>
            <p class="text-white/70 mb-4 line-clamp-3">
              {{ post.excerpt }}
            </p>
            <RouterLink
              :to="{ name: 'BlogPost', params: { slug: post.slug } }"
              class="inline-flex items-center text-secondary hover:text-white font-medium transition"
            >
              Read More
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </article>

        <p v-if="!loading && !error && posts.length === 0" class="md:col-span-2 lg:col-span-3 text-white/70">
          No posts yet.
        </p>
      </div>
    </section>

    <!-- CTA Section (copied from Knowledge Hub) -->
    <section class="bg-secondary py-16 px-6">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-extrabold mb-6">
          Ready to Borrow Against Your Bitcoin?
        </h2>
        <p class="text-lg text-white/90 mb-8">
          Access instant liquidity without selling your Bitcoin.
          Decentralized, non-custodial, and secured by DLCs.
        </p>
        <RouterLink
          :to="isLoggedIn ? '/btcusd' : '/register'"
          class="inline-block bg-white text-secondary hover:bg-white/90 px-8 py-4 rounded-full font-semibold text-lg transition"
        >
          Get Started Today
        </RouterLink>
      </div>
    </section>
  </div>

  <TheFooter />
</template>
