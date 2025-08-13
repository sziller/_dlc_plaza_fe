<template>
  <main class="flex flex-col min-h-screen text-white pt-20 md:pt-24 relative">
    <!-- Gradient Background -->
    <div class="absolute inset-0 -z-10 bg-gradient-to-b from-primary via-primary to-secondary"></div>

    <!-- Content Section -->
    <section class="flex-1 px-4 py-4">
      <div class="w-full max-w-screen-xl mx-auto space-y-12 pb-10">
        <MarketOverviewTable />
        <UsersDLCS v-if="isLoggedIn" />
      </div>
    </section>

    <!-- Footer -->
    
  </main>
  <TheFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import MarketOverviewTable from '../components/MarketOverviewTable.vue'
import UsersDLCS from '../components/UsersDLCS.vue'
import TheFooter from '../components/TheFooter.vue'
import { useAuth } from '../composables/useAuth'

// use global auth state
const { isLoggedIn, setUserFromApi } = useAuth()

// hydrate user if a token already exists (e.g., on refresh)
onMounted(() => {
  setUserFromApi()
})
</script>
