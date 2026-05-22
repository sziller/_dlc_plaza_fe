<template>
  <main class="min-h-screen w-full text-white pt-20 md:pt-32 relative">
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- H1 + Intro -->
    <section class="max-w-4xl mx-auto text-center mb-20 px-6">
      <span class="inline-block text-sm font-semibold tracking-wide uppercase text-secondary mb-4 border border-secondary/40 rounded-full px-4 py-1">
        Risk Model &amp; Security
      </span>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
        How Cadena protects your Bitcoin
      </h1>
      <p class="text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
        Cadena is built on a simple principle: no one should be able to take your Bitcoin —
        not Cadena, not a counterparty, not a failed price feed, not a platform outage.
      </p>
      <p class="text-white text-base max-w-2xl mx-auto mt-4 leading-relaxed">
        This page explains how that holds up under pressure. Read the first few sections for the plain-language version.
        The links at the bottom go as deep as you want — open-source code, the on-chain proof, and a full security memo
        built for institutional risk teams.
      </p>
    </section>

    <!-- Section 1: Foundation -->
    <section class="max-w-4xl mx-auto px-6 mb-20 fade-in-el">
      <h2 class="text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
        The foundation: your Bitcoin never leaves a contract you can verify
      </h2>
      <p class="text-white mb-8 leading-relaxed">
        When you use Cadena, your Bitcoin is committed to a Discreet Log Contract (DLC) on Bitcoin's base layer.
        Not a Cadena wallet. Not a pooled account. A contract on Bitcoin's blockchain that you can verify yourself.
      </p>
      <div class="space-y-5">
        <div v-for="(item, i) in foundationPoints" :key="i" class="flex items-start gap-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center mt-0.5">
            <svg class="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="text-white leading-relaxed">
            <span class="font-semibold text-white">{{ item.title }}</span> {{ item.desc }}
          </div>
        </div>
      </div>
      <p class="mt-8 text-white text-sm border-l-2 border-secondary/40 pl-4 leading-relaxed">
        This is the structural difference between Cadena and the lenders that failed in 2022.
        They held customer keys. Cadena never does.
      </p>
    </section>

    <!-- Section 2: Oracle (featured) -->
    <section class="mb-20 fade-in-el">
      <div class="max-w-4xl mx-auto px-6">
        <div class="rounded-2xl border border-secondary/30 bg-secondary/[0.07] p-8 md:p-10">
          <div class="mb-5">
            <span class="inline-block text-xs font-semibold tracking-wide uppercase text-secondary border border-secondary/40 rounded-full px-3 py-0.5">
              Key mechanism
            </span>
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
            The Oracle: how settlement price is determined
          </h2>
          <p class="text-white mb-6 leading-relaxed">
            A Cadena contract settles at maturity based on the BTC/USD price. Something has to report that price.
            That something is the oracle — and because it matters, here is exactly how it works.
          </p>
          <p class="text-white font-semibold mb-4">Cadena uses the DLCP Oracle. It is:</p>
          <div class="space-y-4 mb-7">
            <div v-for="(point, i) in oraclePoints" :key="i" class="flex items-start gap-4">
              <div class="flex-shrink-0 w-7 h-7 rounded-md bg-secondary/20 flex items-center justify-center mt-0.5">
                <svg class="w-3.5 h-3.5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="text-white leading-relaxed">
                <span class="font-semibold text-white">{{ point.title }}</span> {{ point.desc }}
              </div>
            </div>
          </div>
          <p class="text-white mb-7 leading-relaxed">
            <span class="font-semibold text-white">The oracle selects; it does not authorize.</span>
            This is the key point. Every settlement outcome is already pre-signed before the oracle does anything.
            The oracle's only job at maturity is to point at which of the pre-signed transactions broadcasts.
            It cannot invent an outcome, refuse to settle, or move your Bitcoin.
          </p>

          <!-- Oracle failure callout box -->
          <div class="rounded-xl border border-white/10 bg-black/30 p-6">
            <h3 class="font-bold text-white mb-3">What happens if the oracle fails?</h3>
            <p class="text-white leading-relaxed mb-3">
              If the oracle goes offline or fails to publish at maturity, a refund timelock path activates.
              After a defined window, a pre-signed refund transaction returns the Bitcoin to both parties —
              the lender's principal and the borrower's collateral go home. This path is enforced by Bitcoin script;
              it does not require Cadena's cooperation or the oracle's. A silent oracle cannot trap your Bitcoin.
            </p>
            <p class="text-white text-sm leading-relaxed">
              For larger institutional contracts, Cadena's roadmap includes multi-oracle attestation
              (settlement contingent on 2-of-3 or 3-of-5 independent oracles), further reducing single-oracle risk.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: No margin calls -->
    <section class="max-w-4xl mx-auto px-6 mb-20 fade-in-el">
      <h2 class="text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
        No margin calls, no forced liquidations
      </h2>
      <p class="text-white mb-4 leading-relaxed">
        A Cadena contract has no in-term liquidation mechanism. There is no margin call.
        There is no liquidation bot watching the price.
      </p>
      <p class="text-white mb-4 leading-relaxed">
        Settlement is a single event at maturity. During the term, the contract is locked —
        no party, including Cadena, can move the other party's Bitcoin or trigger an early settlement.
        Whatever Bitcoin does between funding and maturity, the outcome is decided once, at the end,
        by the pre-signed transaction matching the oracle's attested price.
      </p>
      <p class="text-white leading-relaxed">
        For a borrower, this means no risk of being liquidated by a temporary price swing.
        For a lender, it means no path risk during the term — the outcome depends only on the price at maturity.
      </p>
    </section>

    <!-- Section 4: Gap risk -->
    <section class="max-w-4xl mx-auto px-6 mb-20 fade-in-el">
      <h2 class="text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
        Gap risk, honestly
      </h2>
      <p class="text-white mb-4 leading-relaxed">
        Cadena's contract pool is sized to cover the lender's full dollar-denominated target down to a 50% drop
        in Bitcoin's price between funding and maturity. That covers the overwhelming majority of historical scenarios.
      </p>
      <p class="text-white mb-4 leading-relaxed">
        If Bitcoin falls more than 50% over the contract term, the pool is no longer sufficient to cover the lender's
        full target — the lender absorbs the shortfall. This is gap risk, and we state it plainly rather than hide it.
        It is hedgeable: a lender can purchase a put option struck near the 50% threshold to cap the downside.
        The construction is detailed in the Security &amp; Operations Memo linked below.
      </p>
      <p class="text-white leading-relaxed">
        No Bitcoin credit product eliminates all risk. Cadena's design eliminates custody risk,
        counterparty-discretion risk, rehypothecation risk, and margin-call risk by structure.
        Gap risk is the one that remains — and it is bounded, disclosed, and hedgeable.
      </p>
    </section>

    <!-- Section 5: Verify it yourself (3 cards) -->
    <section class="max-w-5xl mx-auto px-6 mb-20 fade-in-el">
      <h2 class="text-2xl md:text-3xl font-extrabold text-center mb-3">Verify it yourself</h2>
      <p class="text-white text-center max-w-xl mx-auto mb-10 leading-relaxed">
        Cadena's security claims are not things you have to take on trust. They are verifiable.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          v-for="(card, i) in verifyCards"
          :key="i"
          :href="card.href"
          :target="card.external ? '_blank' : '_self'"
          :rel="card.external ? 'noopener noreferrer' : undefined"
          class="verify-card rounded-xl p-6 flex flex-col group"
        >
          <div class="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 text-xl">
            {{ card.icon }}
          </div>
          <h3 class="font-bold text-white mb-2">{{ card.title }}</h3>
          <p class="text-white text-sm leading-relaxed mb-5 flex-1">{{ card.desc }}</p>
          <span class="text-secondary text-sm font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-150">
            {{ card.linkText }}
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </span>
        </a>
      </div>
    </section>

    <!-- Section 6: For institutional risk teams -->
    <section class="mb-20 fade-in-el">
      <div class="max-w-5xl mx-auto px-6">
        <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12">
          <span class="inline-block text-xs font-semibold tracking-wide uppercase text-white border border-white/15 rounded-full px-3 py-0.5 mb-6">
            For Institutional Risk Teams
          </span>
          <h2 class="text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
            The Security &amp; Operations Memo
          </h2>
          <p class="text-white mb-6 leading-relaxed">
            The Security &amp; Operations Memo is written specifically for balance-sheet providers and institutional
            risk officers evaluating Cadena. It covers, in depth:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
            <div v-for="(item, i) in institutionalPoints" :key="i" class="flex items-start gap-3">
              <svg class="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-white text-sm leading-relaxed">{{ item }}</span>
            </div>
          </div>
          <p class="text-white text-sm mb-8 leading-relaxed">
            The full diligence package — including code repository access, mainnet transaction history,
            regulatory documentation, and counterparty profiles — is available within 48 hours of an institutional request.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <router-link
              to="/contact"
              class="inline-flex items-center justify-center rounded-full bg-secondary px-7 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none"
            >
              Request the diligence package
            </router-link>
            <router-link
              to="/contact"
              class="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:border-white/40 focus:ring-4 focus:ring-white/10 focus:outline-none"
            >
              Talk to the founder
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Closing line -->
    <section class="max-w-4xl mx-auto px-6 pb-28 text-center fade-in-el">
      <p class="text-white text-base md:text-lg leading-relaxed">
        Sound money deserves sound infrastructure. Every claim on this page is verifiable on Bitcoin's blockchain
        or in open-source code. If something here doesn't hold up to your scrutiny, we want to hear about it.
      </p>
    </section>
  </main>

  <TheFooter />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

onMounted(() => {
  window.scrollTo(0, 0)
  initObserver()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

let observer = null
function initObserver() {
  const els = document.querySelectorAll('.fade-in-el')
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.06 }
  )
  els.forEach((el) => observer.observe(el))
}

const foundationPoints = [
  {
    title: 'Cadena holds no key.',
    desc: 'At no point can Cadena move, freeze, or seize your Bitcoin.',
  },
  {
    title: 'Every outcome is pre-signed at funding.',
    desc: "Before any Bitcoin moves, both parties sign every possible settlement transaction. The contract's full lifecycle is mathematically determined before it begins.",
  },
  {
    title: 'No commingling.',
    desc: "Each contract sits in its own unique on-chain pool. Your Bitcoin is never lent to a third party or used as collateral for anything else.",
  },
]

const oraclePoints = [
  {
    title: 'Independent of Cadena.',
    desc: 'Separate operating entity, separate key infrastructure. Cadena cannot influence what the oracle reports.',
  },
  {
    title: 'Multi-source.',
    desc: 'The oracle aggregates BTC/USD prices from multiple independent exchanges, with publicly documented methodology. No single exchange can move the settlement price.',
  },
  {
    title: 'Cryptographically pre-committed.',
    desc: "The oracle publishes its public key when your contract is funded. Any attestation it makes later is verifiable against that key — it cannot retroactively change a price without the change being detectable on-chain.",
  },
]

const verifyCards = [
  {
    icon: '⌥',
    title: 'Open-source Signer App',
    desc: 'The software that handles your keys is fully open-source. Read the code. Build it yourself. Verify that key generation, signing, and KYC do exactly what we describe.',
    linkText: 'github.com/CadenaWizard/cryptlib',
    href: 'https://github.com/CadenaWizard/cryptlib',
    external: true,
  },
  {
    icon: '⛓',
    title: 'On-chain proof',
    desc: "An early Cadena contract settled on Bitcoin’s mainnet on May 9, 2026 — funded Nov 2025, 6-month term. The architecture executed exactly per the pre-signed structure.",
    linkText: 'Verify the settlement transaction',
    href: '#',
    external: false,
  },
  {
    icon: '📄',
    title: 'Security & Operations Memo',
    desc: 'A full institutional-grade memo covering collateral security, oracle architecture, settlement mechanics, failure-mode coverage, and gap-risk hedging.',
    linkText: 'Read the Security & Operations Memo',
    href: '/Security Operations Memo.pdf',
    external: false,
  },
]

const institutionalPoints = [
  'Collateral security architecture and the pre-signed CET structure',
  'Oracle architecture, redundancy, and failure-mode handling',
  'Settlement mechanics and what happens in every operational failure scenario',
  'Gap-risk quantification and hedge construction',
  'Regulatory posture (El Salvador BSP, Sumsub KYC on-device)',
  'A line-by-line diligence checklist with independent verification paths',
]
</script>

<style scoped>
.bg-page-gradient {
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
  .bg-page-gradient {
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

@media (max-height: 800px) {
  .bg-page-gradient {
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

.verify-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  transition: border-color 0.2s ease, background 0.2s ease;
}
.verify-card:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(103,56,228,0.35);
}

.fade-in-el {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in-el.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-el {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>

<style>
html { scroll-behavior: smooth; }
</style>
