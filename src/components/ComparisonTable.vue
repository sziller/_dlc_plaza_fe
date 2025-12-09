<template>
  <div class="bg-black border border-secondary/30 rounded-lg overflow-hidden my-8">
    <!-- Purple header with title/subtitle -->
    <div class="bg-secondary px-6 py-4">
      <h3 class="text-2xl font-bold text-white">{{ title }}</h3>
      <p v-if="subtitle" class="text-white/80 text-sm mt-1">{{ subtitle }}</p>
    </div>

    <!-- Comparison table -->
    <div class="overflow-x-auto">
      <table class="w-full text-white">
        <thead class="bg-white/5">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold">Feature</th>
            <th class="px-6 py-4 text-center text-sm font-semibold bg-secondary/20">Cadena Bitcoin</th>
            <th class="px-6 py-4 text-center text-sm font-semibold">Traditional Lenders</th>
            <th class="px-6 py-4 text-center text-sm font-semibold">Wrapped BTC DeFi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(feature, index) in features" :key="index" :class="index % 2 === 0 ? 'bg-white/5' : ''">
            <td class="px-6 py-4 text-sm">{{ feature.feature }}</td>
            <td class="px-6 py-4 text-center bg-secondary/10">
              <span v-if="feature.cadena === true" class="text-green-400 text-xl">✓</span>
              <span v-else-if="feature.cadena === false" class="text-red-400 text-xl">✗</span>
              <span v-else class="text-white/70 text-sm">{{ feature.cadena }}</span>
            </td>
            <td class="px-6 py-4 text-center">
              <span v-if="feature.traditional === true" class="text-green-400 text-xl">✓</span>
              <span v-else-if="feature.traditional === false" class="text-red-400 text-xl">✗</span>
              <span v-else class="text-white/70 text-sm">{{ feature.traditional }}</span>
            </td>
            <td class="px-6 py-4 text-center">
              <span v-if="feature.defi === true" class="text-green-400 text-xl">✓</span>
              <span v-else-if="feature.defi === false" class="text-red-400 text-xl">✗</span>
              <span v-else class="text-white/70 text-sm">{{ feature.defi }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CTA footer -->
    <div class="bg-secondary/10 px-6 py-4">
      <router-link
        :to="ctaLink"
        class="inline-block bg-secondary hover:bg-white text-white hover:text-secondary px-6 py-3 rounded-full font-semibold transition duration-200"
      >
        {{ ctaText }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Why Choose Cadena Bitcoin?'
  },
  subtitle: {
    type: String,
    default: ''
  },
  features: {
    type: Array,
    required: true,
    // Expected format: [{ feature: 'Feature name', cadena: true, traditional: false, defi: true }, ...]
  },
  ctaText: {
    type: String,
    default: 'Start with Cadena Bitcoin'
  },
  ctaLink: {
    type: String,
    default: '/register'
  }
})
</script>
