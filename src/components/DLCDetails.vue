<template>
  <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div class="bg-dark rounded-xl p-6 w-full max-w-2xl text-white shadow-xl relative">
      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 text-white text-xl hover:text-secondary"
        @click="$emit('close')"
        aria-label="Close"
      >
        &times;
      </button>

      <!-- Title -->
      <div class="text-2xl font-bold mb-6">DLC Details</div>

      <div class="space-y-4 text-sm md:text-base">
        <div><span class="font-semibold">DLC ID:</span> {{ dlc.dlcId }}</div>
        <div><span class="font-semibold">Start Date:</span> Nov 23, 2023, 10:14 AM</div>
        <div><span class="font-semibold">Maturity Date:</span> Dec 5, 2028, 10:14 AM</div>
        <div><span class="font-semibold">Reference Index:</span> BTCUSD Oracle</div>
        <div><span class="font-semibold">Contract Size:</span> 0.1 BTC</div>
        <div><span class="font-semibold">Loan to Value:</span> {{ dlc.ltv }}</div>
        <div><span class="font-semibold">Term:</span> {{ dlc.term }}</div>
        <div><span class="font-semibold">Interest Rate for Term:</span> {{ dlc.rate }}</div>
        <div><span class="font-semibold">Annualized Yield:</span> 3.1%</div>
        <div><span class="font-semibold">Fee:</span> 0.25%</div>
        <div><span class="font-semibold">Loan Amount:</span> $12,250.00 (0.08 BTC)</div>
        <div><span class="font-semibold">Status:</span> {{ dlc.status }}</div>
        <div><span class="font-semibold">Role:</span> {{ dlc.role }}</div>
        <div><span class="font-semibold">Collateral Contribution:</span> 0.08 BTC</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dlc: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
@media (max-width: 640px) {
  .max-w-2xl {
    max-width: 90%;
  }
}
</style>
