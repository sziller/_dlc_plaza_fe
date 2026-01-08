<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../blogApi/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const router = useRouter()

const onSubmit = async () => {
  loading.value = true
  error.value = null
  try {
    await login(email.value, password.value)
    await router.push({ name: 'AdminBlogList' })
  } catch (e: any) {
    error.value = e?.message ?? 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class=" bg-page-gradient text-white flex items-center justify-center px-6 py-12">
    <section class="w-full max-w-4xl grid gap-8 lg:gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
      <div class="space-y-5 text-center lg:text-left">
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Admin</p>
        <h1 class="text-4xl md:text-5xl font-black leading-tight">
          Knowledge Hub Control Room
        </h1>
      
       
      
      </div>

      <div class="w-full">
        <div class="relative rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl shadow-xl p-8 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-secondary/80">Authenticate</p>
              <h2 class="text-2xl font-bold">Admin Login</h2>
            </div>
        
          </div>

          <form class="space-y-5" @submit.prevent="onSubmit">
            <label class="block space-y-2">
              <span class="text-sm font-semibold text-white/90">Admin Email</span>
              <input
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="admin@cadena"
                class="w-full rounded-lg bg-black/60 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 focus:border-secondary focus:ring-2 focus:ring-secondary/40 focus:outline-none"
                required
              />
            </label>

            <label class="block space-y-2">
              <span class="text-sm font-semibold text-white/90">Passphrase</span>
              <input
                v-model="password"
                type="password"
                autocomplete="current-password"
                placeholder="••••••••••"
                class="w-full rounded-lg bg-black/60 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 focus:border-secondary focus:ring-2 focus:ring-secondary/40 focus:outline-none"
                required
              />
            </label>

            <p v-if="error" class="text-red-200 text-sm">{{ error }}</p>

            <button
              type="submit"
              class="w-full rounded-full bg-secondary text-white font-bold py-3 shadow-lg shadow-secondary/35 hover:shadow-secondary/50 transition transform hover:-translate-y-0.5 disabled:opacity-60"
              :disabled="loading"
              aria-label="Sign in as admin"
            >
              {{ loading ? 'Signing in…' : 'Enter' }}
            </button>
          </form>

        
        </div>
      </div>
    </section>
  </main>
</template>
