<template>
  <main class="min-h-screen w-full text-white pt-20 md:pt-32 relative">
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- Hero -->
    <section class="max-w-4xl mx-auto text-center mb-20 px-6">
      <span class="inline-block text-sm font-semibold tracking-wide uppercase text-secondary mb-4 border border-secondary/40 rounded-full px-4 py-1">
        Platform Comparison
      </span>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
        Bitcoin loans: Cadena vs. the alternatives
      </h1>
      <p class="text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
        Ledn, Unchained, and SALT are the most commonly cited custodial options.
        Here is an honest, sourced breakdown of how each one works and where the structural risks sit.
      </p>
    </section>

    <!-- Comparison Table -->
    <section class="max-w-6xl mx-auto px-4 mb-24 fade-in-el overflow-x-auto">
      <table class="w-full border-collapse text-sm min-w-[640px]">
        <thead>
          <tr>
            <th class="px-5 py-4 text-left font-semibold text-white/50 border-b border-white/10 w-48"></th>
            <th class="px-5 py-4 text-center font-bold border-b border-secondary/50 bg-secondary/10">
              <div class="flex flex-col items-center gap-1">
                <span class="text-secondary text-xs font-semibold tracking-widest uppercase">Non-custodial</span>
                <span class="text-white text-base">Cadena</span>
              </div>
            </th>
            <th class="px-5 py-4 text-center font-semibold border-b border-white/10">
              <span class="text-white/70 text-base">Ledn</span>
            </th>
            <th class="px-5 py-4 text-center font-semibold border-b border-white/10">
              <span class="text-white/70 text-base">Unchained</span>
            </th>
            <th class="px-5 py-4 text-center font-semibold border-b border-white/10">
              <span class="text-white/70 text-base">SALT</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, i) in tableRows" :key="i">
            <!-- Section header row -->
            <tr v-if="item.section">
              <td colspan="5" class="px-5 pt-6 pb-2 text-xs font-bold tracking-widest uppercase text-white/40 border-b border-white/5">
                {{ item.section }}
              </td>
            </tr>
            <!-- Data row -->
            <tr v-else :class="i % 2 === 0 ? 'bg-white/[0.02]' : ''">
              <td class="px-5 py-4 font-bold text-white border-b border-white/5 align-middle">{{ item.feature }}</td>
              <!-- Cadena -->
              <td class="px-5 py-3 text-center border-b border-secondary/20 bg-secondary/[0.06] align-middle">
                <TableCell :cell="item.cadena" :is-cadena="true" />
              </td>
              <!-- Ledn -->
              <td class="px-5 py-3 text-center border-b border-white/5 align-middle">
                <TableCell :cell="item.ledn" />
              </td>
              <!-- Unchained -->
              <td class="px-5 py-3 text-center border-b border-white/5 align-middle">
                <TableCell :cell="item.unchained" />
              </td>
              <!-- SALT -->
              <td class="px-5 py-3 text-center border-b border-white/5 align-middle">
                <TableCell :cell="item.salt" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <p class="text-white/30 text-xs mt-4 px-2">✓ = yes &nbsp;·&nbsp; ✗ = no &nbsp;·&nbsp; ~ = partial / conditional. Rates and terms sourced from platform websites and published terms. Last updated June 2026.</p>
    </section>

    <!-- Key difference callout -->
    <section class="max-w-4xl mx-auto px-6 mb-24 fade-in-el">
      <div class="rounded-2xl border border-secondary/30 bg-secondary/[0.07] p-8 md:p-10">
        <span class="inline-block text-xs font-semibold tracking-wide uppercase text-secondary border border-secondary/40 rounded-full px-3 py-0.5 mb-5">
          The structural difference
        </span>
        <h2 class="text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
          Custody is the root variable
        </h2>
        <p class="text-white leading-relaxed mb-4">
          Every material difference in the table above traces back to one question: who holds the keys during the loan?
          Ledn, Unchained, and SALT all take custody of your Bitcoin in some form.
          That single fact determines rehypothecation risk, counterparty risk, and what happens if the platform fails.
        </p>
        <p class="text-white leading-relaxed">
          We use Discreet Log Contracts. Your Bitcoin is committed to a Bitcoin-native script that neither
          we nor the lender can access unilaterally. Settlement is pre-signed and mathematically enforced.
          There are no keys to seize, no pool to commingle, and no discretion to exercise.
        </p>
      </div>
    </section>

    <!-- Why Cadena sections -->
    <section class="max-w-4xl mx-auto px-6 mb-8">
      <h2 class="text-2xl md:text-3xl font-extrabold mb-2 text-center">Why Cadena wins the comparison</h2>
      <p class="text-white/60 text-center mb-14 text-base">What you get with Cadena that no custodial platform can match.</p>
    </section>

    <section class="max-w-4xl mx-auto px-6 mb-10 fade-in-el">
      <div class="competitor-card rounded-2xl p-8">
        <div class="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 class="text-xl font-bold text-white mb-1">Cadena vs. Ledn</h3>
            <p class="text-white/50 text-sm">Ledn is US-unavailable and rehypothecates your collateral</p>
          </div>
        </div>
        <div class="space-y-4">
          <div v-for="(point, i) in lednPoints" :key="i" class="flex items-start gap-3">
            <div class="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 bg-secondary/20">
              <svg class="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <p class="text-white/80 text-sm leading-relaxed">
              <span class="font-semibold text-white">{{ point.title }}</span> {{ point.body }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-6 mb-10 fade-in-el">
      <div class="competitor-card rounded-2xl p-8">
        <div class="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 class="text-xl font-bold text-white mb-1">Cadena vs. Unchained</h3>
            <p class="text-white/50 text-sm">Unchained requires $150k minimum to borrow</p>
          </div>
        </div>
        <div class="space-y-4">
          <div v-for="(point, i) in unchainedPoints" :key="i" class="flex items-start gap-3">
            <div class="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 bg-secondary/20">
              <svg class="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <p class="text-white/80 text-sm leading-relaxed">
              <span class="font-semibold text-white">{{ point.title }}</span> {{ point.body }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-6 mb-24 fade-in-el">
      <div class="competitor-card rounded-2xl p-8">
        <div class="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 class="text-xl font-bold text-white mb-1">Cadena vs. SALT</h3>
            <p class="text-white/50 text-sm">SALT explicitly authorizes rehypothecation and publishes no proof of reserves</p>
          </div>
        </div>
        <div class="space-y-4">
          <div v-for="(point, i) in saltPoints" :key="i" class="flex items-start gap-3">
            <div class="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 bg-secondary/20">
              <svg class="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <p class="text-white/80 text-sm leading-relaxed">
              <span class="font-semibold text-white">{{ point.title }}</span> {{ point.body }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="mb-32 fade-in-el">
      <div class="max-w-5xl mx-auto px-6">
        <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12 text-center">
          <h2 class="text-2xl md:text-3xl font-extrabold mb-4">No custody. No counterparty. Just Bitcoin script.</h2>
          <p class="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
            We are the only platform on this list where your Bitcoin never enters a third-party wallet.
            Every settlement outcome is pre-signed and enforced on-chain before the loan begins.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/register"
              class="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none"
            >
              Get started with Cadena
            </router-link>
            <router-link
              to="/security"
              class="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 focus:ring-4 focus:ring-white/10 focus:outline-none"
            >
              How we protect your Bitcoin
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>

  <TheFooter />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'
import TableCell from '../components/ComparisonCell.vue'

// Cell helpers: { t: 'yes'|'no'|'partial'|'dash'|'text', n: note }
const y = (n) => ({ t: 'yes', n })
const no = (n) => ({ t: 'no', n })
const p = (n) => ({ t: 'partial', n })
const dash = () => ({ t: 'dash' })
const txt = (n) => ({ t: 'text', n })

const tableRows = [
  { section: 'Custody & Control' },
  {
    feature: 'Keep BTC in self-custody',
    cadena: y('Your keys never leave your device. We hold nothing.'),
    ledn: no('BTC held by Ledn'),
    unchained: p('You hold 1 of 3 multisig keys'),
    salt: no('BTC held by SALT / Fireblocks'),
  },
  {
    feature: 'No rehypothecation',
    cadena: y('Each contract is a unique on-chain pool. Your BTC is never lent to a third party.'),
    ledn: p('Standard loan: BTC may be re-posted to funding partner'),
    unchained: y('Core principle; on-chain verifiable'),
    salt: no('Terms allow repledge or sale of collateral'),
  },
  {
    feature: 'Bitcoin-native (no wrapping)',
    cadena: y('Pure Bitcoin base-layer. No bridges, no sidechains, no EVM.'),
    ledn: y('Native BTC collateral'),
    unchained: y('BTC-only; on-chain multisig'),
    salt: p('Also accepts wBTC & other tokens'),
  },
  {
    feature: 'Fully on-chain enforcement',
    cadena: y('Settlement is enforced by Bitcoin script. No server on our end is required.'),
    ledn: no('Off-chain; centralized liquidation engine'),
    unchained: p('On-chain collateral; off-chain loan ops'),
    salt: no('Centralized; off-chain enforcement'),
  },
  {
    feature: 'Pre-signed settlement',
    cadena: y('All outcomes are cryptographically signed before funding. The contract cannot be altered mid-term.'),
    ledn: no(),
    unchained: no(),
    salt: no(),
  },
  { section: 'Loan Mechanics' },
  {
    feature: 'No margin calls / liquidation',
    cadena: y('No liquidation bots. No margin calls. Settlement is a single event at maturity.'),
    ledn: no('Liquidation engine active'),
    unchained: no('Foreclosure at breach LTV'),
    salt: no('Calls at 75/83/90% LTV; Shield add-on available'),
  },
  {
    feature: 'No credit check',
    cadena: y('Bitcoin is the collateral. Your credit history is irrelevant.'),
    ledn: y('Collateral-only; min $1,000 BTC'),
    unchained: no('Commercial loan application required'),
    salt: y('Collateral-only; KYC required'),
  },
  {
    feature: 'No taxable event',
    cadena: y('Borrowing against BTC is not a sale. No capital gains triggered.'),
    ledn: y('Typically not a taxable event'),
    unchained: y('Loan proceeds not a taxable event'),
    salt: p('Stabilization converts BTC to USDC, which may trigger a taxable event'),
  },
  {
    feature: 'Keep BTC price upside',
    cadena: y('Your BTC stays in the contract. If price rises, you keep the gain.'),
    ledn: y(),
    unchained: y(),
    salt: p('Stabilization may convert BTC to stablecoin'),
  },
  {
    feature: 'Fixed yield for lender',
    cadena: y('Lenders earn a fixed, pre-agreed APR enforced by the contract itself, not by our promise.'),
    ledn: y('Fixed APR; tiered by loan size'),
    unchained: y('Fixed APR; interest-only monthly'),
    salt: y('Fixed APR offered'),
  },
  { section: 'Access & Transparency' },
  {
    feature: 'Minimum loan size',
    cadena: txt('$1,000'),
    ledn: txt('$1,000 in BTC'),
    unchained: txt('$150,000'),
    salt: txt('$5,000'),
  },
  {
    feature: 'Available in the US',
    cadena: y('All 50 states'),
    ledn: no('Not available to US residents'),
    unchained: y('Select states'),
    salt: y('Select states'),
  },
  {
    feature: 'Proof of reserves / verifiability',
    cadena: y('Every contract is a verifiable on-chain transaction. Verify it yourself on any block explorer.'),
    ledn: y('Monthly third-party attestation'),
    unchained: y('On-chain verifiable via open-source tools'),
    salt: no('No public PoR; proprietary custody'),
  },
]

const lednPoints = [
  {
    title: 'Cadena is available to US residents. Ledn is not.',
    body: 'Ledn is blocked for US borrowers entirely. We are open globally, including all 50 US states, with the exception of China.',
  },
  {
    title: 'With Cadena, your Bitcoin cannot be lent to anyone.',
    body: "Ledn's standard loan tier explicitly reserves the right to re-lend your collateral. With Cadena, your Bitcoin sits in a unique on-chain contract. No one can touch it except the pre-signed settlement logic.",
  },
  {
    title: 'Cadena has no margin calls. Ledn does.',
    body: 'If Bitcoin drops during a Ledn loan, they can demand more collateral or liquidate your position. Our contracts have no in-term liquidation mechanism. Settlement happens once, at maturity.',
  },
]

const unchainedPoints = [
  {
    title: 'Cadena starts at $1,000. Unchained requires $150,000.',
    body: "Unchained's three-key custody model is operationally expensive and priced accordingly. Our non-custodial DLC architecture has no per-loan custody overhead, so it is accessible to any borrower.",
  },
  {
    title: 'Cadena has no margin calls. Unchained does.',
    body: 'Even with distributed key custody, Unchained retains the ability to foreclose if LTV falls below their threshold. Our contracts are locked for the full term with no early-settlement mechanism.',
  },
  {
    title: 'Cadena is fully on-chain. Unchained mixes on-chain collateral with off-chain loan operations.',
    body: "Unchained holds collateral in a verifiable multisig, but loan terms and enforcement are managed off-chain. Our settlement logic is entirely in Bitcoin script.",
  },
]

const saltPoints = [
  {
    title: 'Cadena cannot rehypothecate your Bitcoin. SALT explicitly can.',
    body: "SALT's published loan terms authorize them to repledge, sell, or otherwise transfer your collateral. Our DLC structure makes rehypothecation structurally impossible. Your Bitcoin is locked in a contract neither party can unilaterally access.",
  },
  {
    title: "Cadena's proof of reserves is on-chain by design. SALT publishes none.",
    body: 'Every contract is a verifiable Bitcoin transaction. You can check it on any block explorer. SALT has no public proof-of-reserves and no independent verification path for whether their collateral pool is intact.',
  },
  {
    title: 'Cadena has no margin calls by default. SALT charges extra to remove them.',
    body: 'SALT charges a one-time fee for SALT Shield, which removes margin calls. With Cadena, there are no margin calls at all. Not because you paid extra, but because the contract structure does not allow them.',
  },
]

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
    { rootMargin: '0px 0px -10% 0px', threshold: 0.04 }
  )
  els.forEach((el) => observer.observe(el))
}
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

.competitor-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
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
