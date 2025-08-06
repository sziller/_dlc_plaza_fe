<template>
  <div class="bg-primary text-white">
    <!-- HERO TITLE SECTION -->
    <section class="bg-secondary px-4 py-6 lg:py-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-2">
          How Does it Work?
        </h1>
        <p class="text-white/80 text-base sm:text-lg font-medium">Kevin Bell, CFA</p>
        <p class="text-white/80 text-base sm:text-lg font-medium">President, Cadena Bitcoin</p>
      </div>
    </section>

    <!-- ARTICLE CONTENT -->
    <section class="px-4 py-10 lg:py-14 max-w-[1000px] mx-auto space-y-6 text-base sm:text-lg leading-snug text-white/90">
      <p>
        Cadena Bitcoin is a decentralized lending and borrowing product where 
        users lock Bitcoin collateral in a Discreet Log Contracts (DLC) to facilitate loans. Here’s a breakdown
        of the key actions:
      </p>

      <!-- Key Actions -->
      <div class="space-y-5">
        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-1">Posting an Offer</h2>
        <p>
          A user (Initiator) posts an offer on Cadena Bitcoin, locking collateral and 
          specifying interest rate. Terms like loan size, contract tenor, loan to value, 
          and currency (USD) are fixed at the product level.
        </p>

        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-1">Accepting an Offer</h2>
        <p>
          Peer accepts the offer, locking in their collateral and forming a contract.
        </p>

        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-1">Funding Transaction</h2>
        <p>
          The on-chain DLC holds users’ collateral, provides change, and covers 
          Cadena Bitcoin’s service fee.
        </p>

        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-1">Contract Execution</h2>
        <p>
          At maturity, the Oracle’s attestation determines the contract outcome. A 
          single Contract Execution Transaction (CET) is broadcast, splitting the 
          locked collateral based on the BTCUSD price.
        </p>
      </div>

      <!-- Financial Terms -->
      <div class="space-y-5">
        

        <h4 class="text-xl sm:text-2xl font-semibold text-secondary mb-1">Term</h4>
        <p>
          Each Cadena Bitcoin contract lasts 30, 90, 180, or 360 days starting when the contract is accepted. Duration may extend slightly to align with the next available Oracle attestation after maturity.
        </p>

        <h4 class="text-xl sm:text-2xl font-semibold text-secondary mb-1">Interest</h4>
        <p>
          Simple interest using a 30/360-day count convention (commonly used in USD debt). No compounding. For tenors 
shorter than 1 year, the 360 day basis understates the true rate compared 
to a 365-day base.
        </p>

        <h4 class="text-xl sm:text-2xl font-semibold text-secondary mb-1">Loan Size</h4>
        <p>
          Base loan value is 0.1 BTC. The borrower receives 80% of the contract sum (0.08 BTC).
        </p>

        <p><span class="font-semibold text-secondary">Lender contribution:</span> Base Loan / (1.0 + interest / 100)</p>

        <p>
          <span class="font-semibold text-secondary">Borrower Loan:</span>
          Borrower provides 0.1 BTC plus 0.25% service fee minus lender’s contribution.
        </p>

        <p>
          <span class="font-semibold text-secondary">Settlement:</span>
          A single Contract Execution Transaction (CET) splits collateral based on BTCUSD price at maturity.
        </p>

        <p>
          The lender receives 0.08 BTC × (BTC price at acceptance ÷ price at maturity). The borrower receives the remainder.
        </p>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="bg-secondary text-white py-12 px-4">
      <div class="max-w-4xl mx-auto text-center space-y-4">
        <h2 class="text-3xl md:text-4xl font-extrabold">
          Cadena Bitcoin Makes Bitcoin Backed Loans Simple and Transparent
        </h2>
        <p class="text-base sm:text-lg text-white/80 leading-snug max-w-2xl mx-auto">
          Post or accept loan offers with preset terms and Bitcoin collateral. All transactions are on chain secured by Discreet Log Contracts and settled with a single execution based on a trusted Oracle price feed.
        </p>
        <div class="flex justify-center mt-6">
          <router-link
            to="/register"
            class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90"
          >
            Explore Cadena Bitcoin Contracts
          </router-link>
        </div>
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
