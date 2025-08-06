<template>
  <section class="w-full h-full">
    <div class="w-full h-full mx-auto">
      <div class="rounded-xl border border-secondary shadow-lg bg-dark p-6 h-full min-h-0 flex flex-col">
        <!-- Title -->
        <div class="text-3xl font-extrabold text-center mb-6 shrink-0">
          {{ title }}
        </div>

        <!-- Table Wrapper -->
        <div class="overflow-auto flex-1 min-h-0">
          <table class="w-full table-fixed border-separate border-spacing-y-4 border-spacing-x-6">
            <thead>
              <tr>
                <th></th>
                <th colspan="2" class="bg-secondary rounded-md text-white text-center px-4 py-4 align-middle font-bold text-lg">
                  {{ leftGroupLabel }}
                </th>
                <th class="spacer px-4"></th>
                <th colspan="2" class="bg-secondary rounded-md text-white text-center px-4 py-4 align-middle font-bold text-lg">
                  {{ rightGroupLabel }}
                </th>
              </tr>
              <tr class="text-white text-md">
                <th class="px-4 py-4 text-left">Term</th>
                <th class="px-4 py-4">
                  <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center" style="min-width: 6rem;">
                    Lend
                  </div>
                </th>
                <th class="px-4 py-4">
                  <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center" style="min-width: 6rem;">
                    Borrow
                  </div>
                </th>
                <th class="spacer px-4 py-4"></th>
                <th class="px-4 py-4">
                  <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center" style="min-width: 6rem;">
                    Lend
                  </div>
                </th>
                <th class="px-4 py-4">
                  <div class="bg-secondary text-white rounded-md font-semibold px-4 py-4 w-full text-center" style="min-width: 6rem;">
                    Borrow
                  </div>
                </th>
              </tr>
            </thead>

            <tbody class="text-white/90 text-lg">
              <tr
                v-for="(term, index) in terms"
                :key="term.label"
                class="transition duration-200"
              >
                <td class="px-4 py-4 text-left font-semibold">{{ term.label }}</td>

                <!-- Left group cells -->
                <td
                  v-for="(key, keyIndex) in leftKeys"
                  :key="key"
                  class="px-4 py-4 text-center bg-white/10 rounded-md"
                  style="min-width: 6rem;"
                >
                  <div>
                    <span :class="flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''">
                      {{ term[key] }}
                    </span>
                    <template v-if="term.label !== '365 Days'">
                      <div class="text-xs text-white/70 -mt-1">
                        *annualized yield
                      </div>
                      <div class="text-sm text-white/90">
                        ({{ annualizedYield(term[key], term.label) }} for {{ term.label }})
                      </div>
                    </template>
                  </div>
                </td>

                <td class="px-4 spacer"></td>

                <!-- Right group cells -->
                <td
                  v-for="(key, keyIndex) in rightKeys"
                  :key="key"
                  class="px-4 py-4 text-center bg-white/10 rounded-md"
                  style="min-width: 6rem;"
                >
                  <div>
                    <span :class="flashActive.has(`${index}-${key}`) ? 'text-secondary flash-text' : ''">
                      {{ term[key] }}
                    </span>
                    <template v-if="term.label !== '365 Days'">
                      <div class="text-xs text-white/70 -mt-1">
                        *annualized yield
                      </div>
                      <div class="text-sm text-white/90">
                        ({{ annualizedYield(term[key], term.label) }} for {{ term.label }})
                      </div>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted, onUnmounted, watch, toRef } from 'vue'

const props = defineProps({
  title: { type: String, default: 'BTCUSD Market Overview' },
  terms: {
    type: Array,
    default: () => ([
      { label: '30 Days', ltv50a: '5.1%', ltv50b: '5.2%', ltv80a: '9.8%', ltv80b: '9.9%' },
      { label: '60 Days', ltv50a: '6.2%', ltv50b: '6.3%', ltv80a: '11.2%', ltv80b: '13.3%' },
      { label: '90 Days', ltv50a: '7.2%', ltv50b: '7.5%', ltv80a: '*', ltv80b: '*' },
      { label: '365 Days', ltv50a: '8.0%', ltv50b: '8.2%', ltv80a: '*', ltv80b: '*' },
    ])
  },
  leftGroupLabel: { type: String, default: '50% LTV' },
  rightGroupLabel: { type: String, default: '80% LTV' },
  leftKeys: { type: Array, default: () => ['ltv50a', 'ltv50b'] },
  rightKeys: { type: Array, default: () => ['ltv80a', 'ltv80b'] },
  initialDelayMs: { type: Number, default: 1000 },
  intervalMs: { type: Number, default: 30000 },
  flashProbability: { type: Number, default: 0.25 },
  flashes: { type: Number, default: 3 },
  perStateMs: { type: Number, default: 180 },
})

const termsRef = toRef(props, 'terms')
const flashActive = ref(new Set())

function annualizedYield(percentString, label) {
  if (!percentString || percentString === '*') return '*';
  const match = percentString.match(/([\d.]+)%/)
  if (!match) return '*';
  const rate = parseFloat(match[1])
  const daysMatch = label.match(/(\d+)/)
  const days = daysMatch ? parseInt(daysMatch[1]) : 0
  if (days === 0) return '*';
  return `${(rate * days / 365).toFixed(2)}%`
}

let intervalHandle = null
let initialTimer = null

function pickRandomCells () {
  const picks = []
  for (let i = 0; i < termsRef.value.length; i++) {
    const candidates = [props.leftKeys[0], props.leftKeys[1], props.rightKeys[0], props.rightKeys[1]]
    candidates.forEach((key) => {
      if (Math.random() < props.flashProbability) picks.push(`${i}-${key}`)
    })
  }
  if (picks.length === 0 && termsRef.value.length > 0) {
    picks.push(`0-${props.leftKeys[0]}`)
  }
  return picks
}

function tripleFlash () {
  const targets = pickRandomCells()
  const periods = props.flashes * 2
  const interval = props.perStateMs

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

  setTimeout(() => {
    flashActive.value = new Set()
  }, (periods + 1) * interval)
}

function startFlashing () {
  stopFlashing()
  initialTimer = setTimeout(tripleFlash, props.initialDelayMs)
  intervalHandle = setInterval(tripleFlash, props.intervalMs)
}

function stopFlashing () {
  if (initialTimer) { clearTimeout(initialTimer); initialTimer = null }
  if (intervalHandle) { clearInterval(intervalHandle); intervalHandle = null }
  flashActive.value = new Set()
}

onMounted(startFlashing)
onUnmounted(stopFlashing)
watch(termsRef, () => { startFlashing() })

defineExpose({ startFlashing, stopFlashing })
</script>

<style scoped>
.flash-text {
  animation: flashPop 0.18s ease-in-out;
}
@keyframes flashPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.07); }
  100% { transform: scale(1); }
}

@media (max-width: 640px) {
  table {
    border-spacing: 0.25rem 0.75rem !important;
    table-layout: fixed;
  }
  th, td {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    font-size: 0.8rem;
  }
  .left-group-header,
  .right-group-header {
    display: table-cell !important;
    font-size: 0.75rem;
    white-space: nowrap;
  }
  .spacer {
    display: none !important;
  }
  .-mt-1 {
    margin-top: -0.25rem;
  }
}
</style>
