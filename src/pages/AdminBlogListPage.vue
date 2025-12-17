<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { deletePost, fetchAdminPosts, type BlogPost, type PostStatus } from '../blogApi/blog'

const posts = ref<BlogPost[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const filterStatus = ref<PostStatus | null>(null)

const loadPosts = async () => {
  loading.value = true
  error.value = null
  try {
    posts.value = await fetchAdminPosts()
  } catch (e: any) {
    error.value = e?.message ?? 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

const filteredPosts = computed(() => {
  if (!filterStatus.value) return posts.value
  return posts.value.filter((p) => p.status === filterStatus.value)
})

const formatDate = (value: string | null) => {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

const onDelete = async (id: number) => {
  if (!confirm('Delete this post?')) return
  try {
    await deletePost(id)
    posts.value = posts.value.filter((p) => p.id !== id)
  } catch (e: any) {
    alert('Failed to delete post')
  }
}

onMounted(loadPosts)
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-12">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Admin</p>
        <h1 class="text-3xl font-extrabold text-gray-900">Manage Knowledge Hub</h1>
        <p class="text-gray-600">Scroll through drafts and published posts to edit or delete.</p>
      </div>
      <RouterLink
        to="/admin/blog/new"
        class="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-white font-semibold shadow-sm hover:bg-secondary/80"
      >
        + New Article
      </RouterLink>
    </header>

    <section class="rounded-xl border border-white/10 bg-black text-white p-6 shadow-sm">
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <span class="text-sm font-semibold text-white/80">Filter:</span>
        <button
          class="px-3 py-1 rounded text-sm border border-white/20 text-white/80 hover:bg-white/10"
          :class="!filterStatus ? 'bg-secondary text-white border-secondary' : ''"
          @click="filterStatus = null"
        >
          All
        </button>
        <button
          class="px-3 py-1 rounded text-sm border border-white/20 text-white/80 hover:bg-white/10"
          :class="filterStatus === 'draft' ? 'bg-secondary text-white border-secondary' : ''"
          @click="filterStatus = 'draft'"
        >
          Drafts
        </button>
        <button
          class="px-3 py-1 rounded text-sm border border-white/20 text-white/80 hover:bg-white/10"
          :class="filterStatus === 'published' ? 'bg-secondary text-white border-secondary' : ''"
          @click="filterStatus = 'published'"
        >
          Published
        </button>
      </div>

      <div v-if="loading" class="text-white/70">Loading posts…</div>
      <div v-else-if="error" class="text-red-300 font-semibold">{{ error }}</div>

      <div v-else class="overflow-auto max-h-[70vh] rounded-lg border border-white/10">
        <table class="min-w-full text-left text-sm bg-black">
          <thead class="bg-white/5 sticky top-0">
            <tr>
              <th class="px-3 py-2 border-b border-white/10 text-white/80">Title</th>
              <th class="px-3 py-2 border-b border-white/10 text-white/80">Slug</th>
              <th class="px-3 py-2 border-b border-white/10 text-white/80">Status</th>
              <th class="px-3 py-2 border-b border-white/10 text-white/80">Updated</th>
              <th class="px-3 py-2 border-b border-white/10 w-32 text-white/80">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-white/5">
              <td class="px-3 py-2 border-b border-white/5 font-semibold text-white">
                {{ post.title }}
              </td>
              <td class="px-3 py-2 border-b border-white/5 text-white/70">{{ post.slug }}</td>
              <td class="px-3 py-2 border-b border-white/5">
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-semibold',
                    post.status === 'published'
                      ? 'bg-green-900/60 text-green-200'
                      : 'bg-yellow-900/60 text-yellow-200'
                  ]"
                >
                  {{ post.status }}
                </span>
              </td>
              <td class="px-3 py-2 border-b border-white/5 text-white/70">
                {{ formatDate(post.updated_at) }}
              </td>
              <td class="px-3 py-2 border-b border-white/5 space-x-3">
                <RouterLink
                  class="text-secondary font-semibold hover:text-secondary/80"
                  :to="{ name: 'AdminBlogEdit', params: { id: post.id } }"
                >
                  Edit
                </RouterLink>
                <button class="text-red-600 font-semibold hover:text-red-700" @click="onDelete(post.id)">
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="filteredPosts.length === 0">
              <td colspan="5" class="px-3 py-4 text-center text-gray-500">
                No posts found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
