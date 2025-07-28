<template>
  <section class="min-h-screen w-full bg-primary text-white flex flex-col md:flex-row">

   <!-- 🌗 Sidebar (Title + TOC) -->
<aside
  class="bg-secondary w-full md:max-w-xs p-8 md:pt-32 text-white sticky top-0 h-screen overflow-y-auto"
>
  <h1 class="text-4xl md:text-5xl font-extrabold mb-8">Cadena Bitcoin FAQ</h1>
  <nav class="space-y-4 text-lg">
    <a href="#use-case" class="block hover:underline">1. Use Case</a>
    <a href="#how-it-works" class="block hover:underline">2. How It Works</a>
    <a href="#financial-terms" class="block hover:underline">3. Financial Terms</a>
    <a href="#security" class="block hover:underline">4. Security</a>
  </nav>
</aside>


    <!-- 📄 Main Content -->
    <div class="flex-1 px-6 pt-24 pb-12 md:py-32 max-w-5xl mx-auto space-y-14">

      <!-- ✅ Intro -->
      <div class="text-tertiary text-lg space-y-4">
        <p>
          Cadena Bitcoin’s product enables peer-to-peer lending and borrowing using Bitcoin as collateral through Discreet Log Contracts (DLCs). Below, we answer common questions about its use cases, how it works, financial terms, and security.
        </p>
        <p class="italic">
          For more technical details, check out the Technical Overview, or explore our open-source resources on GitHub.
        </p>
      </div>

      <!-- 📌 Section 1 -->
      <div id="use-case">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">1. Use Case for Cadena’s Product?</h2>
        <p class="mb-4">
          Cadena Bitcoin lets you use Bitcoin flexibly—whether you want to grow your Bitcoin holdings, access fiat without losing Bitcoin exposure, or generate fiat returns secured by Bitcoin. Here’s how it works for two types of users:
        </p>

        <p class="font-semibold mb-2">Bob (Borrower)</p>
        <p class="mb-4">
          Bob wants more Bitcoin exposure without selling his stash. He uses his Bitcoin as collateral to borrow additional Bitcoin via Cadena, allowing him to HODL more. Alternatively, if Bob needs fiat (e.g., for a big purchase, debt payoff, or starting a business), he can borrow Bitcoin, sell it for fiat, and remain protected if Bitcoin’s price rises.
        </p>

        <p class="font-semibold mb-2">Alice (Investor)</p>
        <p class="mb-4">
          Alice seeks a high risk-adjusted fiat return, secured by Bitcoin collateral. She’s okay with the risk of losing fiat if Bitcoin’s value drops beyond her collateral coverage. If Bitcoin falls significantly during the loan term, Alice keeps all the collateral, boosting her Bitcoin holdings. Bob, in this case, would lose his collateral.
        </p>

        <p class="italic text-tertiary">Check out our video walking through the life cycle of a Cadena loan!</p>
      </div>

      <!-- 📌 Section 2 -->
      <div id="how-it-works">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">2. How Does it Work?</h2>
        <p class="mb-3">Cadena Bitcoin is a decentralized lending and borrowing product where users lock Bitcoin collateral in a DLC to facilitate loans. Here’s a breakdown of the key actions:</p>

        <p class="font-semibold mb-1">Posting an Offer</p>
        <p class="mb-3">
          A user (Initiator) posts an offer on Cadena Bitcoin, locking collateral and specifying interest rate. Terms like loan size (0.1 Bitcoin), duration (1 month), and currency (USD) are fixed in the current product.
        </p>

        <p class="font-semibold mb-1">Accepting an Offer</p>
        <p class="mb-3">
          Another user (Peer) accepts the offer, locking in their collateral and forming a contract.
        </p>

        <p class="font-semibold mb-1">Funding Transaction</p>
        <p class="mb-3">
          The on-chain DLC holds users’ collateral, provides change, and covers Cadena Bitcoin’s service fee.
        </p>

        <p class="font-semibold mb-1">Contract Execution</p>
        <p>
          At maturity, the Oracle’s attestation determines the contract outcome. A single Contract Execution Transaction (CET) is broadcast, splitting the locked collateral based on the BTC/USD open and closing price.
        </p>
      </div>

      <!-- 📌 Section 3 -->
      <div id="financial-terms">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">3. What Are the Financial Terms (MVP)?</h2>

        <p class="font-semibold mb-1">Term</p>
        <p class="mb-3">
          Today every Cadena Bitcoin contract has a duration of 30 days, starting when the contract is set accepted. The actual duration may extend slightly to align with the next available Oracle attestation after 30 days.
        </p>

        <p class="font-semibold mb-1">Interest</p>
        <p class="mb-3">
          Calculation: Uses simple interest based on a 30/360-day count convention (common in short-term fiat debt like USD Treasury Bills). No compounding.
        </p>
        <p class="mb-3 italic text-tertiary">
          Note: The 360-day year slightly understates the effective rate compared to a 365-day year.
        </p>

        <ul class="list-disc list-inside space-y-2 text-white/90">
          <li>Contract Sum: Base amount for calculations, set at 0.1 BTC</li>
          <li>Base Loan: Loan amount, set at 80% of the contract sum (0.08 BTC)</li>
          <li>Free Loan: Amount the lender contribution calculated as <code class="bg-white/10 px-1 rounded">free_loan = base_loan / (1.0 + interest / 100)</code></li>
          <li>Borrow Loan: Amount the borrower provides up front calculated as 0.1 Bitcoin plus 0.25% service fee minus the lender’s contribution</li>
          <li>BTC/USD O/C Ratio: Ratio of Bitcoin price at contract acceptance (open) to maturity (close), determining collateral distribution.</li>
        </ul>
      </div>

      <!-- 📌 Section 4 -->
      <div id="security">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">4. Security</h2>
        <p class="mb-3">Cadena Bitcoin prioritizes self-sovereignty, decentralization, and Bitcoin’s core security principles:</p>

        <ul class="list-disc list-inside space-y-2 text-white/90">
          <li><strong>Your Keys, Your Coins:</strong> You control your private keys and funds. Cadena Bitcoin does not hold or access your private keys or seed phrase.</li>
          <li><strong>User Responsibility:</strong> Protect your private data to prevent loss or theft.</li>
        </ul>

        <p class="font-semibold mt-6 mb-1">Identification and Access</p>

        <ul class="list-disc list-inside space-y-2 text-white/90">
          <li><strong>Email Address:</strong> Your sole identity for Cadena Bitcoin and the Signer App. Ensure you retain access, as there’s no recovery if forgotten.</li>
          <li><strong>Seed Phrase:</strong> A 12-word Bitcoin mnemonic generated by the Signer App, used to derive DLC addresses. Stored encrypted with your password.</li>
        </ul>

        <p class="text-tertiary italic mt-3">Important: Keep a durable backup. You control your funds even if Cadena Bitcoin is unavailable.</p>
        <p class="text-red-400 font-semibold mt-2">Warning: Never share your seed phrase; Cadena Bitcoin will never request it.</p>

        <ul class="list-disc list-inside space-y-2 text-white/90 mt-4">
          <li><strong>Password:</strong> Used across Cadena Bitcoin’s platform and Signer App to access your seed phrase.</li>
        </ul>

        <p class="text-red-400 font-semibold mt-2">Warning: Do not reuse your email password. A leaked password risks seed phrase exposure and fund loss.</p>
      </div>

      <!-- 📎 Footer -->
      <div class="text-center pt-8 border-t border-secondary/30">
        <p class="text-white/80">For more details, check our <a href="#" class="underline hover:text-white">Technical Overview</a> or browse <a href="#" class="underline hover:text-white">our GitHub</a>.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>


<style scoped>
/* optional smooth scroll */
html {
  scroll-behavior: smooth;
}
</style>
