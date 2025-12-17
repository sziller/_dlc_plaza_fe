<template>
  <div class="bg-white/5 border border-secondary/30 rounded-lg p-6 my-8">
    <h3 class="text-xl font-bold text-secondary mb-4">{{ title }}</h3>
    <ul class="space-y-2">
      <li v-for="link in links" :key="link.to">
        <router-link :to="link.to" class="text-white hover:text-secondary transition flex items-start">
          <span class="text-secondary mr-2">→</span>
          <span>{{ link.text }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  title?: string
  links: Array<{ to: string; text: string }>
}>()
</script>
