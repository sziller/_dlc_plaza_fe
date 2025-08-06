<template>
  <main class="pt-20 md:pt-24 pb-24">
    <section class="w-full min-h-screen bg-primary text-white px-0 py-4">
      <div class="flex justify-center w-full pb-10">
        <MarketOverviewTable
        />
      </div>
      <div class="flex justify-center w-full">
        <UsersDLCS
        />
      </div>
    </section>
    <TheFooter />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import MarketOverviewTable from '../components/MarketOverviewTable.vue'
import TheFooter from '../components/TheFooter.vue'
import UsersDLCS from '../components/UsersDLCS.vue'
const tableRef = ref()

const terms = [
  { label: '30 Days', ltv50a: '5.1%', ltv50b: '5.2%', ltv80a: '9.8%', ltv80b: '9.9%' },
  { label: '90 Days', ltv50a: '6.2%', ltv50b: '6.3%', ltv80a: '11.2%', ltv80b: '13.3%' },
  { label: '180 Days', ltv50a: '7.2%', ltv50b: '7.5%', ltv80a: '*', ltv80b: '*' },
  { label: '365 Days', ltv50a: '8.0%', ltv50b: '8.2%', ltv80a: '*', ltv80b: '*' },
]

// Optional: control flashing from parent
// tableRef.value?.stopFlashing()
// tableRef.value?.startFlashing()
</script>
