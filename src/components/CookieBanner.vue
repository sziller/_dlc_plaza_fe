<template>
  <transition name="cookie-fade">
    <section
      v-if="shouldShowBanner"
      class="fixed inset-x-4 bottom-4 z-50 rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl text-white p-6 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[640px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
    >
      <div class="flex flex-col gap-4">
        <div>
          <h2 id="cookie-title" class="text-lg font-semibold">Cookie preferences</h2>
          <p class="mt-1 text-sm text-white/80">
            We use necessary cookies to make Cadena work. Optional analytics and marketing cookies help us improve your
            experience. You can update your choices anytime in our
            <router-link to="/cookies" class="text-secondary underline font-medium">
              Cookie Policy
            </router-link>.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="flex-1 min-w-[140px] rounded-full bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            @click="handleAcceptAll"
          >
            Accept all
          </button>
          <button
            type="button"
            class="flex-1 min-w-[170px] rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            @click="handleReject"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            class="min-w-[180px] rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:border-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            @click="togglePreferences"
            :aria-expanded="showPreferences ? 'true' : 'false'"
            aria-controls="cookie-preferences-panel"
          >
            Manage preferences
          </button>
        </div>

        <transition name="cookie-slide">
          <form
            v-if="showPreferences"
            id="cookie-preferences-panel"
            class="mt-2 rounded-xl border border-white/10 bg-black/40 p-4 space-y-4"
            @submit.prevent="handleSaveCustom"
          >
            <label
              v-for="opt in optionalCategories"
              :key="opt.key"
              class="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <input
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-secondary focus:ring-secondary"
                v-model="localPrefs[opt.key]"
              />
              <span>
                <span class="font-semibold">{{ opt.label }}</span>
                <span class="block text-white/70 text-sm">{{ opt.description }}</span>
              </span>
            </label>

            <div class="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                class="flex-1 min-w-[140px] rounded-full bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                Save preferences
              </button>
              <button
                type="button"
                class="flex-1 min-w-[140px] rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                @click="togglePreferences"
              >
                Cancel
              </button>
            </div>
          </form>
        </transition>
      </div>
    </section>
  </transition>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useCookieConsent } from '../composables/useCookieConsent'

type OptionalKey = 'analytics' | 'marketing'

const { shouldShowBanner, acceptAll, rejectNonEssential, saveCustomPreferences, preferences } = useCookieConsent()

const showPreferences = ref(false)
const localPrefs = reactive<Record<OptionalKey, boolean>>({
  analytics: preferences.value.analytics,
  marketing: preferences.value.marketing,
})

const optionalCategories: Array<{ key: OptionalKey; label: string; description: string }> = [
  {
    key: 'analytics',
    label: 'Analytics cookies',
    description: 'Help us understand site performance and usage so we can improve the experience.',
  },
  {
    key: 'marketing',
    label: 'Marketing cookies',
    description: 'Allow us to personalize Cadena communications and measure campaign effectiveness.',
  },
]

watch(
  () => preferences.value,
  (next) => {
    localPrefs.analytics = next.analytics
    localPrefs.marketing = next.marketing
  },
  { immediate: true }
)

const togglePreferences = () => {
  showPreferences.value = !showPreferences.value
}

const handleAcceptAll = () => {
  acceptAll()
  showPreferences.value = false
}

const handleReject = () => {
  rejectNonEssential()
  showPreferences.value = false
}

const handleSaveCustom = () => {
  saveCustomPreferences({ ...localPrefs })
  showPreferences.value = false
}
</script>

<style scoped>
.cookie-fade-enter-active,
.cookie-fade-leave-active {
  transition: opacity 0.3s ease;
}
.cookie-fade-enter-from,
.cookie-fade-leave-to {
  opacity: 0;
}
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: max-height 0.25s ease, opacity 0.25s ease;
}
.cookie-slide-enter-from,
.cookie-slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
