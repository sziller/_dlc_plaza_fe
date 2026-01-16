<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { createPost, fetchAdminPostById, updatePost, type PostStatus } from '../blogApi/blog'

const route = useRoute()
const router = useRouter()

const idParam = route.params.id as string | undefined
const isEdit = computed(() => !!idParam)

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)

const form = reactive<{
  title: string
  slug: string
  subheading: string
  authorName: string
  excerpt: string
  heroImageUrl: string
  articleImageUrl: string
  slidesPresentationUrl: string
  ctaText: string
  ctaTextBig: string
  ctaTextSmall: string
  ctaButtonText: string
  body: string
  status: PostStatus
}>({
  title: '',
  slug: '',
  subheading: '',
  authorName: '',
  excerpt: '',
  heroImageUrl: '',
  articleImageUrl: '',
  slidesPresentationUrl: '',
  ctaText: '',
  ctaTextBig: '',
  ctaTextSmall: '',
  ctaButtonText: '',
  body: '',
  status: 'draft'
})

const loadPost = async () => {
  if (!isEdit.value) return
  loading.value = true
  error.value = null
  try {
    const id = Number(idParam)
    const post = await fetchAdminPostById(id)
    form.title = post.title
    form.slug = post.slug
    form.subheading = post.subheading ?? ''
    form.authorName = post.author_name ?? ''
    form.excerpt = post.excerpt ?? ''
    form.heroImageUrl = post.hero_image_url ?? ''
    form.articleImageUrl = post.article_image_url ?? ''
    form.slidesPresentationUrl = post.slides_presentation_url ?? ''
    form.ctaText = post.cta_text_big ?? '' // legacy, keep mapped to new fields
    form.ctaTextBig = post.cta_text_big ?? ''
    form.ctaTextSmall = post.cta_text_small ?? ''
    form.ctaButtonText = post.cta_button_text ?? ''
    form.body = post.body
    form.status = post.status
  } catch (e: any) {
    error.value = 'Failed to load post'
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  saving.value = true
  error.value = null
  try {
    if (isEdit.value) {
      const id = Number(idParam)
      await updatePost(id, {
        title: form.title,
        slug: form.slug,
        subheading: form.subheading,
        author_name: form.authorName,
        excerpt: form.excerpt,
        hero_image_url: form.heroImageUrl || null,
        article_image_url: form.articleImageUrl || null,
        slides_presentation_url: form.slidesPresentationUrl || null,
        cta_text_big: form.ctaTextBig || form.ctaText || null,
        cta_text_small: form.ctaTextSmall || null,
        cta_button_text: form.ctaButtonText,
        body: form.body,
        status: form.status
      })
    } else {
      await createPost({
        title: form.title,
        slug: form.slug,
        subheading: form.subheading,
        author_name: form.authorName,
        excerpt: form.excerpt,
        hero_image_url: form.heroImageUrl || null,
        article_image_url: form.articleImageUrl || null,
        slides_presentation_url: form.slidesPresentationUrl || null,
        cta_text_big: form.ctaTextBig || form.ctaText || null,
        cta_text_small: form.ctaTextSmall || null,
        cta_button_text: form.ctaButtonText,
        body: form.body,
        status: form.status
      })
    }
    await router.push({ name: 'AdminBlogList' })
  } catch (e: any) {
    error.value = 'Failed to save post'
  } finally {
    saving.value = false
  }
}

onMounted(loadPost)
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 py-12">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Admin</p>
    <h1 class="text-3xl font-extrabold text-gray-900 mb-6">
      {{ isEdit ? 'Edit Knowledge Hub Article' : 'Create Knowledge Hub Article' }}
    </h1>

    <section class="rounded-xl border border-white/10 bg-black text-white p-6 shadow-sm">
      <div v-if="loading && isEdit" class="text-white/70">Loading post…</div>
      <form v-else class="space-y-5" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium text-white/80 mb-1">Title</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white/80 mb-1">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
          <p class="text-xs text-white/60 mt-1">URL part, e.g. <code>how-bitcoin-fixes-x</code></p>
        </div>

        <div>
          <label class="block text-sm font-medium text-white/80 mb-1">Excerpt</label>
          <textarea
            v-model="form.excerpt"
            rows="2"
            class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-white/80 mb-1">Subheading</label>
            <textarea
              v-model="form.subheading"
              rows="2"
              class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/80 mb-1">Author Name</label>
            <input
              v-model="form.authorName"
              type="text"
              class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-white/80 mb-1">Hero Image URL</label>
          <input
            v-model="form.heroImageUrl"
            type="url"
            placeholder="https://cdn.example.com/blog/hero.jpg"
            class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white/80 mb-1">Article Image URL</label>
          <input
            v-model="form.articleImageUrl"
            type="url"
            placeholder="https://cdn.example.com/blog/article-image.jpg"
            class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white/80 mb-1">Slides Presentation URL</label>
          <input
            v-model="form.slidesPresentationUrl"
            type="url"
            placeholder="https://docs.google.com/presentation/d/.../embed"
            class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-white/80 mb-1">CTA Text</label>
            <textarea
              v-model="form.ctaTextBig"
              rows="2"
              class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/80 mb-1">CTA Button Text</label>
            <input
              v-model="form.ctaButtonText"
              type="text"
              class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-white/80 mb-1">CTA Supporting Text</label>
          <textarea
            v-model="form.ctaTextSmall"
            rows="2"
            class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-white/80 mb-1">Status</label>
            <select
              v-model="form.status"
              class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div class="flex items-end justify-end">
            <RouterLink
              :to="{ name: 'AdminBlogList' }"
              class="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-white font-semibold hover:bg-white/10"
            >
              ← Back to Admin List
            </RouterLink>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-white/80 mb-1">Body (Markdown)</label>
          <textarea
            v-model="form.body"
            rows="12"
            class="w-full rounded border border-white/20 bg-black/60 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <div class="flex items-center gap-3">
            <button
            type="submit"
            class="px-4 py-2 bg-secondary text-white rounded-lg font-semibold shadow-lg shadow-secondary/30 hover:bg-secondary/80 disabled:opacity-60"
            :disabled="saving"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <RouterLink
            :to="{ name: 'AdminBlogList' }"
            class="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white font-semibold hover:bg-white/20"
          >
            Cancel
          </RouterLink>
        </div>
      </form>
    </section>
  </main>
</template>
