<template>
  <section class="w-full min-h-screen bg-primary text-white px-0 py-4">
    <div class="flex flex-col md:flex-row gap-4 md:gap-5 items-start justify-center w-full">
      
      <!-- 📈 BTC/USD Chart -->
      <div class="w-full md:w-1/2 px-[6px] mt-4">
        <div class="rounded-xl border border-secondary shadow-lg bg-dark p-4 h-[650px] flex flex-col">
          
          <!-- ✅ Matching Title Style -->
          <div class="text-2xl font-extrabold text-center mb-6">
            BTC/USD 30-Day Chart
          </div>

          <!-- ✅ Chart Container -->
          <div class="flex-1 relative pb-6">
            <canvas ref="btcChart" class="w-full h-full"></canvas>
          </div>

        </div>
      </div>

      <!-- 📊 Market Overview Table -->
      <div class="w-full md:w-1/2 px-[6px] mt-4">
        <div class="rounded-xl border border-secondary shadow-lg bg-dark p-4 h-[650px] flex flex-col">
          
          <!-- ✅ Matching Title Style -->
          <div class="text-2xl font-extrabold text-center mb-6">
            BTC/USD Market Overview
          </div>

          <!-- ✅ Table fills the remaining vertical space -->
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
                <tr class="border-t border-secondary">
                  <td class="px-4 py-5 text-left border-r border-secondary">1 Month</td>
                  <td class="px-6 py-5 text-center border-x-4 border-secondary">5.1% – 5.2%</td>
                  <td class="px-8 py-5 text-center border-l border-secondary">9.8% – 9.9%</td>
                </tr>
                <tr class="border-t border-secondary">
                  <td class="px-4 py-5 text-left border-r border-secondary">3 Months</td>
                  <td class="px-6 py-5 text-center border-x-4 border-secondary">6.2% – 6.3%</td>
                  <td class="px-8 py-5 text-center border-l border-secondary">11.2% – 13.3%</td>
                </tr>
                <tr class="border-t border-secondary">
                  <td class="px-4 py-5 text-left border-r border-secondary">6 Months</td>
                  <td class="px-6 py-5 text-center border-x-4 border-secondary">7.2% – 7.5%</td>
                  <td class="px-8 py-5 text-center border-l border-secondary">* – *</td>
                </tr>
                <tr class="border-t border-b border-secondary">
                  <td class="px-4 py-5 text-left border-r border-secondary">1 Year</td>
                  <td class="px-6 py-5 text-center border-x-4 border-secondary">8.0% – 8.2%</td>
                  <td class="px-8 py-5 text-center border-l border-secondary">* – *</td>
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

onMounted(async () => {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30'
  )
  const data = await res.json()

  const labels = data.prices.map(p => new Date(p[0]).toLocaleDateString())
  const prices = data.prices.map(p => p[1])

  new Chart(btcChart.value, {
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
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          bottom: 16 // Reserve space for X-axis ticks
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#fff'
          },
          grid: {
            color: '#333'
          }
        },
        y: {
          ticks: {
            color: '#fff'
          },
          grid: {
            color: '#333'
          }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#fff' }
        }
      }
    }
  })
})
</script>

<style scoped>
/* Optional styles here if needed */
</style>
