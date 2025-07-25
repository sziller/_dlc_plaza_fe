<template>
  <section class="min-h-screen w-full bg-primary text-white flex flex-col md:flex-row">
    
    <!-- 🌗 Sidebar (Title + TOC) -->
    <aside
      class="bg-secondary w-full md:max-w-xs p-8 md:pt-32 text-white sticky top-0 h-screen overflow-y-auto"
    >
      <h1 class="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
        Cadena: A Peer-to-Peer Electronic Credit System
      </h1>
      <nav class="space-y-4 text-lg">
        <a href="#overview" class="block hover:underline">1. Overview</a>
        <a href="#introduction" class="block hover:underline">2. Introduction</a>
        <a href="#loan" class="block hover:underline">3. What Is a Loan?</a>
        <a href="#transactions" class="block hover:underline">4. Transactions</a>
        <a href="#dlc" class="block hover:underline">5. DLC Protocol</a>
        <a href="#adaptor" class="block hover:underline">6. Adaptor Signatures</a>
        <a href="#oracle" class="block hover:underline">7. Oracle</a>
        <a href="#conclusion" class="block hover:underline">8. Conclusion</a>
      </nav>
    </aside>

    <!-- 📄 Main Content -->
    <div class="flex-1 px-6 pt-24 pb-12 md:py-32 max-w-5xl mx-auto space-y-14">

      <!-- 🧠 Authors & Overview -->
      <div id="overview">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">1. Overview</h2>
        <p class="mb-2">Kevin Bell: <a href="mailto:kevin@cadenabitcoin.com" class="underline">kevin@cadenabitcoin.com</a></p>
        <p class="mb-4">Ladanyi Szilard: <a href="mailto:sziller@cadenabitcoin.com" class="underline">sziller@cadenabitcoin.com</a></p>
        <p>
          A purely peer-to-peer electronic credit system enables borrowing and lending directly between peers, bypassing financial institutions.
          While digital signatures offer a partial solution, their benefits erode if a trusted third party is still needed for custody.
          Cadena provides a trust-minimized solution using the Bitcoin network, leveraging discreet log contracts (DLCs), adaptor signatures,
          and oracles to create a secure, private, and scalable credit market.
        </p>
      </div>

      <!-- 🔍 Introduction -->
      <div id="introduction">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">2. Introduction</h2>
        <p>
          Online credit today depends heavily on financial institutions acting as intermediaries, issuing fiat currency and managing transactions.
          This trust-based model, while functional, has flaws: transactions are reversible, mediation raises costs, and disputes rely on third-party intervention.
        </p>
        <p>
          Worse, fiat money creation misaligns incentives—fueling debt, currency debasement, and financial instability over time.
          We propose a cryptographic alternative: an electronic credit system where two parties can lend and borrow directly,
          free from trusted intermediaries. Transactions are computationally irreversible, protecting both lenders and borrowers from counterparty risk.
        </p>
        <p>
          This paper introduces Cadena — a solution to the custody problem—using Bitcoin’s Blockchain, discreet log contracts, adaptor signatures,
          and an oracle to build a decentralized credit market.
        </p>
      </div>

      <!-- 💸 What is a Loan -->
      <div id="loan">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">3. What Is a Loan?</h2>
        <p>
          A secured loan is more than just a debt—it’s a financial instrument blending obligation and options.
          For the borrower, it’s a duty to repay paired with an implicit put option on the collateral.
        </p>
        <p>
          If the collateral (here, Bitcoin) falls below the agreed strike price at maturity, the borrower defaults,
          surrendering the collateral instead of paying out-of-pocket. The borrower’s downside is capped at the collateral’s value.
          The cost of this put reflects the interest paid plus any equity the borrower contributes.
        </p>
        <p>
          For the lender, a loan is a right to full repayment at maturity (a call option), offset by the risk of the borrower’s put.
          Higher Bitcoin volatility increases the put’s value—and thus the lender’s risk—since a price drop could leave them with less-valuable collateral.
          A higher strike price amplifies this risk further, reducing the collateral’s buffer against market swings.
        </p>
      </div>

      <!-- 🔁 Transactions -->
      <div id="transactions">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">4. Transactions</h2>
        <p>
          Cadena’s transactions are based on Discreet Log Contracts (DLCs), a Bitcoin-based framework addressing contract-simplicity, privacy,
          trust minimization and deterministic execution. DLCs obscure contract details on the Blockchain, making them invisible to outsiders.
        </p>
        <p>
          An electronic loan, in this system, consists of pre-signed transactions for each possible outcome at the contract’s end.
          Time locks and oracle attestations ensure only the correct transaction can be broadcast to the Bitcoin network.
        </p>
        <p>
          Traditional secured lending falters without custody: lenders can’t verify collateral without a trusted authority or third party.
          Centralizing custody reintroduces third-party risks—bank-driven money creation and costly legal enforcement.
          Cadena avoids this by combining Bitcoin’s native security with oracles — cryptographically incentivized,
          non-interactive, publicly verifiable data injection points, not counterparties.
        </p>
      </div>

      <!-- 📜 DLC Protocol -->
      <div id="dlc">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">5. DLC Protocol</h2>
        <p>
          In Cadena, contracts are represented by a single on-chain Transaction holding all funds until execution. Here’s how it works:
        </p>
        <ul class="list-disc list-inside space-y-2 text-white/90 mt-4">
          <li>Alice (lender) and Bob (borrower) agree on a funding transaction ID (txid) and interest rate.</li>
          <li>They pre-create child transactions that spend this (then future) output before it’s broadcast and confirmed.</li>
          <li>
            These transactions represent all possible outcomes, but on execution only the one — unlocked by the oracle’s signature —
            can be published on the Blockchain. Both parties sign and store these options upfront.
          </li>
        </ul>
        <p class="mt-4">
          The DLC protocol prioritizes privacy and trust minimization. By using an oracle to resolve outcomes — without revealing private keys —
          it enables smart contracts with conditional, time-locked payments. Bitcoin (the unit) serves as both collateral and unit of account,
          eliminating settlement risk for both parties.
        </p>
      </div>

      <!-- 🔐 Adaptor Signatures -->
      <div id="adaptor">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">6. Adaptor Signatures</h2>
        <p>
          Adaptor signatures are the cryptographic backbone of Cadena’s execution. They allow the parties to pre-commit to every possible contract outcome,
          with each signature becoming valid only when extended, thus unlocked by a matching oracle attestation.
        </p>
        <p>
          At contract inception:
        </p>
        <ul class="list-disc list-inside space-y-2 text-white/90 mt-2">
          <li>Signatures for every possible outcome are created and shared between borrower and lender.</li>
          <li>When the oracle attests Bitcoin’s price at maturity, it effectively “signs” the correct output.</li>
          <li>This enables either party to publish the correct execution-transaction on-chain—without needing further cooperation.</li>
          <li>Only two on-chain transactions occur: funding and execution. No separate closing step is needed.</li>
        </ul>
      </div>

      <!-- 📡 Oracle -->
      <div id="oracle">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">7. Oracle</h2>
        <p>
          The Oracle problem — ensuring reliable external data — is one of the core challenges Cadena tackles through careful system design
          and the use of Discreet Log Contracts. Rather than eliminating the oracle, Cadena constrains and disincentivizes its misuse
          while keeping it unaware of its own involvement.
        </p>
        <ul class="list-disc list-inside space-y-2 text-white/90 mt-3">
          <li><strong>Reliability:</strong> mirrored oracles, backups, and redundancy guarantee attestations. The technology is open source. If all fail, funds revert to their owners after a certain period as failsafe.</li>
          <li><strong>Incentives:</strong> Oracles are reputationally (and financially) motivated to publish unique and consistent attestations. They are blind to contract details, publish their attestations in the public domain, and provide an impartial and verifiable price feed for all users.</li>
        </ul>
        <p class="mt-3">
          This architecture supports a decentralized credit marketplace where lenders and borrowers connect securely — without relying on centralized control.
        </p>
      </div>

      <!-- 🧾 Conclusion -->
      <div id="conclusion">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">8. Conclusion</h2>
        <p>
          Bitcoin’s secure, verifiable network offers more than value transfer—it’s a foundation for decentralized credit.
          Cadena’s use of discreet log contracts, adaptor signatures, and oracles enables peer-to-peer lending without trusted third parties.
        </p>
        <p>
          This system could democratize finance, reduce systemic risk, and provide additional use cases for Bitcoin in global financial markets.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// No script logic needed
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
