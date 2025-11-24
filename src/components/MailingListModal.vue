<template>
  <transition name="mailing-fade">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mailing-title"
    >
      <div class="w-full max-w-lg rounded-2xl bg-dark border border-white/15 shadow-2xl p-6 sm:p-8 text-white relative">
        <button
          type="button"
          class="absolute top-3 right-3 text-white/60 hover:text-white transition"
          @click="handleClose"
          aria-label="Close mailing list dialog"
        >
          ✕
        </button>

        <div class="space-y-3">
          <h2 id="mailing-title" class="text-2xl font-bold">Join the Cadena mailing list</h2>
          <p class="text-white/70">
            Educational explainers, product updates, and occasional announcements to help you get comfortable with
            Cadena’s technology.
          </p>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
          <label class="block text-sm font-semibold">
            Email address
            <input
              ref="emailField"
              v-model.trim="email"
              type="email"
              inputmode="email"
              required
              class="mt-1 w-full rounded-lg bg-white text-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              :aria-invalid="!!localError || !!error"
            />
          </label>

          <p v-if="localError" class="text-sm text-red-300" aria-live="polite">{{ localError }}</p>
          <p v-else-if="error" class="text-sm text-red-300" aria-live="polite">{{ error }}</p>
          <p v-else-if="successMessage" class="text-sm text-green-300" aria-live="polite">{{ successMessage }}</p>

          <button
            type="submit"
            class="w-full rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-secondary/90 disabled:opacity-50"
            :disabled="loading"
            :aria-busy="loading ? 'true' : 'false'"
          >
            <span v-if="loading">Joining…</span>
            <span v-else>Join mailing list</span>
          </button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { isValidEmail } from '../api/publicContact'

const props = defineProps<{
  open: boolean
  loading?: boolean
  error?: string | null
  successMessage?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', email: string): void
}>()

const email = ref('')
const localError = ref('')
const emailField = ref<HTMLInputElement | null>(null)

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      localError.value = ''
      email.value = ''
      await nextTick()
      emailField.value?.focus()
    }
  }
)

function handleClose() {
  emit('close')
}

function handleSubmit() {
  localError.value = ''
  if (!isValidEmail(email.value)) {
    localError.value = 'Please enter a valid email address.'
    return
  }
  emit('submit', email.value)
}
</script>

<style scoped>
.mailing-fade-enter-active,
.mailing-fade-leave-active {
  transition: opacity 0.2s ease;
}
.mailing-fade-enter-from,
.mailing-fade-leave-to {
  opacity: 0;
}
</style>
