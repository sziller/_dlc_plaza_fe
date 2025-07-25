<template>
  <section class="w-full min-h-screen bg-primary text-white px-0 py-4">
    <div class="flex flex-col md:flex-row items-stretch justify-center w-full">

      <!-- 📈 BTC/USD Chart -->
      <div class="w-full md:w-1/2 md:pr-0 mt-4">
        <div class="rounded-none md:rounded-l-xl border-y md:border-l border-secondary shadow-lg bg-dark p-4 h-[650px] flex flex-col">

          <!-- Title -->
          <div class="text-2xl font-extrabold text-center mb-6">
            BTCUSD Chart - {{ selectedTerm.label }}
          </div>

          <!-- Chart Container -->
          <div class="flex-1 relative pb-6">
            <canvas ref="btcChart" class="w-full h-full"></canvas>
          </div>
        </div>
      </div>

      <!-- 📊 Market Overview Table -->
      <div class="w-full md:w-1/2 md:pl-0 mt-4">
        <div class="rounded-none md:rounded-r-xl border-y md:border-r border-l md:border-l-0 border-secondary shadow-lg bg-dark p-4 h-[650px] flex flex-col">

          <!-- Title -->
          <div class="text-2xl font-extrabold text-center mb-6">
            BTCUSD Market Overview
          </div>

          <!-- Table -->
          <div class="overflow-x-auto flex-1">
            <table class="w-full table-fixed border border-secondary rounded-xl h-full">
              <thead>
                <tr class="bg-secondary text-white text-md">
                  <th class="px-4 py-4 text-left border-b border-secondary">Term</th>
                  <th class="px-6 py-4 text-center border-l border-r-4 border-b border-secondary whitespace-nowrap">50% LTV</th>
                  <th class="px-8 py-4 text-center border-b border-secondary whitespace-nowrap">80% LTV</th>
                </tr>
              </thead>
              <tbody class="text-white/90 text-lg">
                <tr
                  v-for="term in terms"
                  :key="term.label"
                  @click="updateChart(term)"
                  :class="['cursor-pointer transition duration-200', selectedTerm.label === term.label ? 'bg-secondary/20' : 'hover:bg-secondary/10']"
                >
                  <td class="px-4 py-5 text-left border-r border-secondary">{{ term.label }}</td>
                  <td class="px-6 py-5 text-center border-x-4 border-secondary">{{ term.ltv50 }}</td>
                  <td class="px-8 py-5 text-center border-l border-secondary">{{ term.ltv80 }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const btcChart = ref(null)
let chartInstance = null

// Available terms and their API day mapping
const terms = [
  { label: '1 Month', days: 30, ltv50: '5.1% – 5.2%', ltv80: '9.8% – 9.9%' },
  { label: '3 Months', days: 90, ltv50: '6.2% – 6.3%', ltv80: '11.2% – 13.3%' },
  { label: '6 Months', days: 180, ltv50: '7.2% – 7.5%', ltv80: '* – *' },
  { label: '1 Year', days: 365, ltv50: '8.0% – 8.2%', ltv80: '* – *' }
]

const selectedTerm = ref(terms[0]) // Default: 1 Month

const fetchAndRenderChart = async (days) => {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`)
  const data = await res.json()

  const labels = data.prices.map(p => new Date(p[0]).toLocaleDateString())
  const prices = data.prices.map(p => p[1])

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(btcChart.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'BTC/USD',
          data: prices,
          borderColor: '#8387c3',
          backgroundColor: 'rgba(131, 135, 195, 0.15)',
          tension: 0.3,
          fill: true,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { bottom: 16 }
      },
      scales: {
        x: {
          ticks: { color: '#fff' },
          grid: { color: '#333' }
        },
        y: {
          ticks: { color: '#fff' },
          grid: { color: '#333' }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#fff' }
        }
      }
    }
  })
}

const updateChart = (term) => {
  selectedTerm.value = term
  fetchAndRenderChart(term.days)
}

onMounted(() => {
  fetchAndRenderChart(selectedTerm.value.days)
})
</script>

<style scoped>
/* optional hover indicator, already handled in :class bindings */
</style>
