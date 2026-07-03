<template>
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
    <div class="w-full max-w-md bg-dark border border-white/10 rounded-2xl shadow-2xl p-8 text-white text-center space-y-5">
      <!-- Icon -->
      <div class="flex justify-center">
        <div class="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
      </div>

      <div class="space-y-2">
        <h2 class="text-2xl font-bold">Under Maintenance</h2>
        <p class="text-white/70 text-sm leading-relaxed">
          {{ message || 'Cadena is temporarily under maintenance. Logins and registrations are disabled. Please try again shortly.' }}
        </p>
      </div>

      <button
        type="button"
        @click="refresh"
        class="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full font-semibold transition text-sm"
      >
        Refresh page
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>()

function refresh() {
  window.location.reload()
}
</script>
