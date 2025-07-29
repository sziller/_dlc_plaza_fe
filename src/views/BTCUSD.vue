<template>
      <main class="pt-20 md:pt-24 pb-24">
  <section class="w-full min-h-screen bg-primary text-white px-0 py-4">
    <div class="flex justify-center w-full">

      <!-- 📊 Market Overview Table (Full Width) -->
      <div class="w-full max-w-6xl mt-4">
        <div class="rounded-xl border border-secondary shadow-lg bg-dark p-6 h-[650px] flex flex-col">

          <!-- Title -->
          <div class="text-3xl font-extrabold text-center mb-6">
            BTCUSD Market Overview
          </div>

          <!-- Table -->
          <div class="overflow-x-auto flex-1">
            <table class="w-full table-fixed border-separate border-spacing-y-4 border-spacing-x-6">
              <thead>
                <tr class="text-white text-md">
                  <th class="px-4 py-4 text-left">Term</th>
                  <th class="px-4 py-4 text-center bg-secondary rounded-md" colspan="2">50% LTV</th>
                  <th class="px-8 py-4"></th>
                  <th class="px-4 py-4 text-center bg-secondary rounded-md" colspan="2">80% LTV</th>
                </tr>
              </thead>
              <tbody class="text-white/90 text-lg">
                <tr
                  v-for="(term, index) in terms"
                  :key="term.label"
                  class="transition duration-200"
                >
                  <td class="px-4 py-5 text-left font-semibold">{{ term.label }}</td>

                  <td class="px-4 py-5 text-center bg-white/10 rounded-md">
                    <span :class="flashActive.has(`${index}-50a`) ? 'text-secondary flash-text' : ''">{{ term.ltv50a }}</span>
                  </td>
                  <td class="px-4 py-5 text-center bg-white/10 rounded-md">
                    <span :class="flashActive.has(`${index}-50b`) ? 'text-secondary flash-text' : ''">{{ term.ltv50b }}</span>
                  </td>

                  <td class="px-8"></td>

                  <td class="px-4 py-5 text-center bg-white/10 rounded-md">
                    <span :class="flashActive.has(`${index}-80a`) ? 'text-secondary flash-text' : ''">{{ term.ltv80a }}</span>
                  </td>
                  <td class="px-4 py-5 text-center bg-white/10 rounded-md">
                    <span :class="flashActive.has(`${index}-80b`) ? 'text-secondary flash-text' : ''">{{ term.ltv80b }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  </section>
</main>
  <TheFooter/>
    
</template>

<script setup>
import { ref, onMounted } from 'vue'

const terms = [
  { label: '1 Month', ltv50a: '5.1%', ltv50b: '5.2%', ltv80a: '9.8%', ltv80b: '9.9%' },
  { label: '3 Months', ltv50a: '6.2%', ltv50b: '6.3%', ltv80a: '11.2%', ltv80b: '13.3%' },
  { label: '6 Months', ltv50a: '7.2%', ltv50b: '7.5%', ltv80a: '*', ltv80b: '*' },
  { label: '1 Year', ltv50a: '8.0%', ltv50b: '8.2%', ltv80a: '*', ltv80b: '*' },
]

// Set of active flashing cell IDs like `"0-50a"`
const flashActive = ref(new Set())

function pickRandomCells() {
  const picks = []
  for (let i = 0; i < terms.length; i++) {
    ;['50a', '50b', '80a', '80b'].forEach((suffix) => {
      if (Math.random() < 0.25) picks.push(`${i}-${suffix}`)
    })
  }
  // Ensure at least one flashes
  if (picks.length === 0) picks.push(`0-50a`)
  return picks
}

function tripleFlash() {
  const targets = pickRandomCells()
  const periods = 6 // on/off * 3 flashes
  const interval = 180 // ms per state

  for (let k = 0; k <= periods; k++) {
    setTimeout(() => {
      const next = new Set(flashActive.value)
      targets.forEach((id) => {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      })
      flashActive.value = next
    }, k * interval)
  }

  // Make sure we end in OFF state
  setTimeout(() => {
    flashActive.value = new Set()
  }, (periods + 1) * interval)
}

onMounted(() => {
  // initial delay then every ~30s
  setTimeout(tripleFlash, 1000)
  setInterval(tripleFlash, 30000)
})
import TheFooter from '../components/TheFooter.vue'
</script>

<style scoped>
/* Text flash animation helper (subtle scale for pop) */
.flash-text {
  animation: flashPop 0.18s ease-in-out;
}
@keyframes flashPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.07); }
  100% { transform: scale(1); }
}
</style>
