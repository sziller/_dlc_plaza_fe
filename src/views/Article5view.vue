<template>
  <div class="bg-primary text-white">
    <!-- HERO TITLE SECTION -->
    <section class="bg-secondary px-6 py-10 lg:py-14 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          How Does it Work?
        </h1>
        <p class="text-white/80 text-base sm:text-lg font-medium mb-1">Kevin Bell, CFA</p>
        <p class="text-white/80 text-base sm:text-lg font-medium">President, Cadena Bitcoin</p>
      </div>
    </section>

    <!-- ARTICLE CONTENT -->
    <section class="px-6 py-16 lg:py-24 max-w-[1000px] mx-auto space-y-10 text-lg leading-relaxed text-white/90">

      <p>
        Cadena Bitcoin is a decentralized lending and borrowing product where 
        users lock Bitcoin collateral in a DLC to facilitate loans. Here’s a breakdown
        of the key actions:
      </p>

      <!-- Key Actions -->
      <div class="space-y-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-secondary">Posting an Offer</h2>
        <p>
          A user (Initiator) posts an offer on Cadena Bitcoin, locking collateral and 
          specifying interest rate. Terms like loan size, contract tenor, loan to value, 
          and currency (USD) are fixed at the product level.
        </p>

        <h2 class="text-2xl sm:text-3xl font-bold text-secondary">Accepting an Offer</h2>
        <p>
          Peer accepts the offer, locking in their collateral and forming a contract.
        </p>

        <h2 class="text-2xl sm:text-3xl font-bold text-secondary">Funding Transaction</h2>
        <p>
          The on-chain DLC holds users’ collateral, provides change, and covers 
          Cadena Bitcoin’s service fee.
        </p>

        <h2 class="text-2xl sm:text-3xl font-bold text-secondary">Contract Execution</h2>
        <p>
          At maturity, the Oracle’s attestation determines the contract outcome. A 
          single Contract Execution Transaction (CET) is broadcast, splitting the 
          locked collateral based on the BTCUSD price.
        </p>
      </div>

      <!-- Financial Terms -->
      <div class="space-y-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-secondary">3. What Are the Financial Terms (MVP)?</h2>
        <h4 class="text-2xl sm:text-3xl font-bold text-secondary">Term</h4>
        <p>
          Today every Cadena Bitcoin contract has a duration of 30, 90, 180 and 360 
          days, starting when the contract is set accepted. The actual duration may 
          extend slightly to align with the next available Oracle attestation after the 
          maturity of the contract.
        </p>
        <h4 class="text-2xl sm:text-3xl font-bold text-secondary">Interest</h4>
        <p>
          Calculation: Uses simple interest based on a 30/360-day count convention 
          (common in short-term fiat debt like USD Treasury Bills). No compounding. 
          The 360-day year slightly understates the effective rate compared to a 365-
          day year.
        </p>
        <h4 class="text-2xl sm:text-3xl font-bold text-secondary">Loan Size</h4>
        <p>
  Base amount for calculations, set at 0.1 BTC, loan amount set 
  at 80% of the contract sum (0.08 BTC)
</p>

<p>
  <span class="font-semibold text-secondary">Lender contribution:</span>
  Base Loan / (1.0 + interest / 100)
</p>

<p>
  <span class="font-semibold text-secondary">Borrow Loan:</span>
  Amount the borrower provides up front calculated as 0.1 
  Bitcoin plus 0.25% service fee minus the lender’s contribution
</p>

<p>
  <span class="font-semibold text-secondary">Settlement:</span>
  A single Contract Execution Transaction (CET) is broadcast, 
  splitting the locked collateral based on the BTCUSD price.
</p>

<p>
  The lender receives 0.08 Bitcoin multiplied by the ratio of Bitcoin’s price at 
  contract acceptance and maturity; the borrower receives the rest of the 
  collateral.
</p>

      </div>
    </section>

    <!-- FOOTER -->
    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
