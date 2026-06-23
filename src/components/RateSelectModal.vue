<template>
  <div
    class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div
      class="bg-dark text-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5 relative"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rate-modal-title"
    >
      <button
        type="button"
        @click="$emit('close')"
        class="absolute top-4 right-4 text-white hover:text-secondary text-xl font-bold"
        aria-label="Close"
      >×</button>

      <div>
        <h2 id="rate-modal-title" class="text-xl font-bold">Set Your Rate</h2>
        <p class="text-sm text-white/50 mt-1">{{ actionType }} · {{ termDays }}-day term</p>
      </div>

      <!-- Limit order warning -->
      <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-3">
        <p class="text-sm text-white/85 leading-relaxed">
          This places a <span class="font-semibold text-yellow-300">limit order</span> at your chosen rate
          instead of matching the current market rate.
          Limit orders are filled on a best-efforts basis and are <span class="font-semibold">not guaranteed</span> to execute.
        </p>
        <label class="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            v-model="acknowledged"
            class="mt-0.5 accent-secondary w-4 h-4 shrink-0"
          />
          <span class="text-sm text-white/75">I understand this is a limit order and may not execute</span>
        </label>
      </div>

      <!-- Rate selector -->
      <Transition name="rate-reveal">
        <div v-if="acknowledged" class="bg-white/[0.04] border border-white/10 rounded-xl p-4 space-y-3">
          <div class="text-xs text-white/40 text-center">
            {{ marketRate && marketRate !== '*' ? `Market rate: ${marketRate}` : 'No market rate — set your own' }}
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="decrement"
              :disabled="rateNum <= RATE_MIN"
              @pointerdown.prevent="startHold(-1)"
              @pointerup="stopHold"
              @pointerleave="stopHold"
              class="w-11 h-11 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-xl font-bold shrink-0 transition-colors"
            >−</button>
            <div class="flex-1 relative">
              <input
                type="text"
                inputmode="decimal"
                v-model="rateInput"
                @input="onRateInput"
                @focus="rateInputFocused = true"
                @blur="onRateBlur"
                class="w-full text-center px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 focus:border-secondary/60 focus:outline-none font-bold tabular-nums text-xl"
                aria-label="Rate percentage"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm pointer-events-none">%</span>
            </div>
            <button
              type="button"
              @click="increment"
              :disabled="rateNum >= RATE_MAX"
              @pointerdown.prevent="startHold(1)"
              @pointerup="stopHold"
              @pointerleave="stopHold"
              class="w-11 h-11 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-xl font-bold shrink-0 transition-colors"
            >+</button>
          </div>
          <p class="text-[11px] text-white/35 text-center">Tick: {{ STEP }}% · Range: {{ RATE_MIN }}–{{ RATE_MAX }}%</p>
        </div>
      </Transition>

      <!-- Actions -->
      <div class="flex gap-3 pt-1">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 border border-white/15 text-white/70 hover:text-white hover:border-white/30 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
        >Cancel</button>
        <button
          type="button"
          @click="confirm"
          :disabled="!acknowledged || !isValid"
          class="flex-1 bg-secondary hover:bg-secondary/90 text-white px-4 py-2.5 rounded-xl font-bold text-sm disabled:opacity-35 disabled:cursor-not-allowed transition-all"
        >
          {{ isValid ? `Confirm ${rateNum.toFixed(2)}% →` : 'Confirm Rate →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  actionType: { type: String, default: 'Lend' },
  termDays: { type: Number, default: 365 },
  marketRate: { type: String, default: '*' },
})
const emit = defineEmits(['confirm', 'close'])

const RATE_DECIMALS = 4
const STEP = 0.1
const RATE_MIN = 0
const RATE_MAX = 25

const acknowledged = ref(false)
const rateInputFocused = ref(false)

const initialRate = computed(() => {
  if (!props.marketRate || props.marketRate === '*') return 0
  const m = props.marketRate.match(/([\d.]+)/)
  return m ? parseFloat(m[1]) : 0
})

const rateNum = ref(initialRate.value)
const rateInput = ref(rateNum.value.toFixed(RATE_DECIMALS))

const isValid = computed(() => Number.isFinite(rateNum.value) && rateNum.value > 0)

function roundRate(n) { return parseFloat(n.toFixed(RATE_DECIMALS)) }
function clampRate(n) { return Math.min(Math.max(n, RATE_MIN), RATE_MAX) }

function onRateInput(e) {
  let v = String(e.target.value || '').replace(/[^\d.]/g, '')
  const parts = v.split('.')
  if (parts.length > 1) {
    const frac = parts.slice(1).join('').slice(0, RATE_DECIMALS)
    v = (parts[0] || '0') + '.' + frac
  }
  if (v.startsWith('.')) v = '0' + v
  rateInput.value = v
  const parsed = parseFloat(v)
  if (Number.isFinite(parsed)) rateNum.value = roundRate(clampRate(parsed))
}

function onRateBlur() {
  rateInputFocused.value = false
  const parsed = parseFloat(rateInput.value)
  const clamped = roundRate(clampRate(Number.isFinite(parsed) ? parsed : rateNum.value || 0))
  rateNum.value = clamped
  rateInput.value = clamped.toFixed(RATE_DECIMALS)
}

function increment() { adjustRate(STEP) }
function decrement() { adjustRate(-STEP) }

function adjustRate(delta) {
  const base = Number.isFinite(rateNum.value) ? rateNum.value : 0
  const next = roundRate(clampRate(base + delta))
  rateNum.value = next
  rateInput.value = next.toFixed(RATE_DECIMALS)
}

const HOLD_START_DELAY = 500
const HOLD_INTERVAL = 120
let holdTimer = null
let holdDir = 0

function startHold(dir) {
  holdDir = dir
  stopHold()
  holdTimer = setTimeout(tickHold, HOLD_START_DELAY)
  window.addEventListener('pointerup', stopHold, { once: true })
  window.addEventListener('blur', stopHold, { once: true })
}
function tickHold() {
  adjustRate(holdDir * STEP)
  holdTimer = setTimeout(tickHold, HOLD_INTERVAL)
}
function stopHold() {
  if (holdTimer) { clearTimeout(holdTimer); holdTimer = null }
}
onUnmounted(stopHold)

function confirm() {
  if (!acknowledged.value || !isValid.value) return
  emit('confirm', `${rateNum.value.toFixed(RATE_DECIMALS)}%`)
}
</script>

<style scoped>
.rate-reveal-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.rate-reveal-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
</style>
