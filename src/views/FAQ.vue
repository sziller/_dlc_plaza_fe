<template>
  <main class="min-h-screen w-full text-white pt-20 md:pt-32 relative">
    <!-- Background: same as Home -->
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- 🧠 Top Title -->
    <div class="max-w-4xl mx-auto text-center mb-16 px-6">
      <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
        Cadena Bitcoin FAQ
      </h1>
      <p class="text-tertiary text-lg">
        Common questions about how Cadena works, financial terms, and user security
      </p>
    </div>

    <!-- 📄 Main Content -->
    <section class="max-w-5xl mx-auto space-y-14 text-white/90 text-lg leading-relaxed px-6 pb-12">
      <!-- ✅ Intro -->
      <div class="text-tertiary space-y-4">
        <p>
          Cadena Bitcoin’s product enables peer-to-peer lending and borrowing using Bitcoin as collateral through Discreet Log Contracts (DLCs).
          Below, we answer common questions about its use cases, how it works, financial terms, and security.
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
          Bob wants more Bitcoin exposure without selling his stash. He uses his Bitcoin as collateral to borrow additional Bitcoin via Cadena, allowing him to HODL more.
          Alternatively, if Bob needs fiat, he can borrow Bitcoin, sell it for fiat, and remain protected if Bitcoin’s price rises.
        </p>

        <p class="font-semibold mb-2">Alice (Investor)</p>
        <p class="mb-4">
          Alice seeks a high risk-adjusted fiat return, secured by Bitcoin collateral. She’s okay with the risk of losing fiat if Bitcoin’s value drops.
          If Bitcoin falls significantly, Alice keeps the collateral, boosting her Bitcoin holdings.
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
          At maturity, the Oracle’s attestation determines the contract outcome.
          A single Contract Execution Transaction (CET) is broadcast, splitting the locked collateral based on the BTC/USD open and closing price.
        </p>
      </div>

      <!-- 📌 Section 3 -->
      <div id="financial-terms">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">3. What Are the Financial Terms (MVP)?</h2>

        <p class="font-semibold mb-1">Term</p>
        <p class="mb-3">
          Every Cadena Bitcoin contract has a duration of 30 days, starting when the contract is accepted. The actual duration may extend slightly to align with the next available Oracle attestation.
        </p>

        <p class="font-semibold mb-1">Interest</p>
        <p class="mb-3">
          Simple interest, 30/360 day count convention (like USD Treasury Bills). No compounding.
        </p>
        <p class="mb-3 italic text-tertiary">
          Note: The 360-day year slightly understates the effective rate vs. a 365-day year.
        </p>

        <ul class="list-disc list-inside space-y-2">
          <li>Contract Sum: 0.1 BTC</li>
          <li>Base Loan: 80% of the contract sum (0.08 BTC)</li>
          <li>Lender Contribution: <code class="bg-white/10 px-1 rounded">free_loan = base_loan / (1.0 + interest / 100)</code></li>
          <li>Borrower Contribution: 0.1 BTC + 0.50% fee − lender amount</li>
          <li>BTC/USD O/C Ratio: Open to Close price ratio determines final split</li>
        </ul>
      </div>

      <!-- 📌 Section 4 -->
      <div id="security">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">4. Security</h2>
        <p class="mb-3">Cadena Bitcoin prioritizes self-sovereignty, decentralization, and Bitcoin’s core security principles:</p>

        <ul class="list-disc list-inside space-y-2">
          <li><strong>Your Keys, Your Coins:</strong> You control your keys. Cadena never touches them.</li>
          <li><strong>User Responsibility:</strong> Your private data is yours to protect.</li>
        </ul>

        <p class="font-semibold mt-6 mb-1">Identification and Access</p>

        <ul class="list-disc list-inside space-y-2">
          <li><strong>Email Address:</strong> Your Cadena ID. No recovery if forgotten.</li>
          <li><strong>Seed Phrase:</strong> 12-word mnemonic from Signer App, encrypted with your password.</li>
        </ul>

        <p class="italic text-tertiary mt-3">Important: Backup your keys. You control funds even if Cadena disappears.</p>
        <p class="text-red-400 font-semibold mt-2">Warning: Never share your seed phrase. We’ll never ask for it.</p>

        <ul class="list-disc list-inside space-y-2 mt-4">
          <li><strong>Password:</strong> Used across Cadena + Signer App to unlock your phrase.</li>
        </ul>

        <p class="text-red-400 font-semibold mt-2">Warning: Don’t reuse your email password. Leaks = lost funds.</p>
      </div>

      <!-- 📎 Footer -->
      <div class="text-center pt-8 border-t border-secondary/30">
        <p class="text-white/80">
          For more details, check our
          <a href="#" class="underline hover:text-white">Technical Overview</a>
          or explore
          <a href="#" class="underline hover:text-white">our GitHub</a>.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
/* Page background: black base + bottom-anchored purple glow */
.bg-page-gradient{
  background-color: #000;
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,
      rgba(103,56,228,0.58) 0%,
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%
    );
}

@supports (background: radial-gradient(in oklch, black, white)) {
  .bg-page-gradient{
    background-color: oklch(0 0 0);
    background-image:
      radial-gradient(
        in oklch 125% 75% at 50% 100%,
        oklch(from #6738e4 l c h / 0.60) 0%,
        oklch(from #6738e4 l c h / 0.36) 26%,
        oklch(from #6738e4 l c h / 0.16) 52%,
        oklch(0 0 0 / 0) 76%
      );
  }
}

@media (max-height: 800px){
  .bg-page-gradient{
    background-image:
      radial-gradient(
        120% 60% at 50% 100%,
        rgba(103,56,228,0.52) 0%,
        rgba(103,56,228,0.30) 24%,
        rgba(103,56,228,0.12) 48%,
        rgba(0,0,0,0) 70%
      );
  }
}
</style>

<!-- smooth scroll must be global, not scoped -->
<style>
html { scroll-behavior: smooth; }
</style>
