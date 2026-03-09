<template>
  <main class="min-h-screen w-full text-white pt-20 md:pt-32 relative">
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- 1. Header -->
    <section class="max-w-4xl mx-auto text-center mb-16 px-6">
      <span class="inline-block text-sm font-semibold tracking-wide uppercase text-secondary mb-4 border border-secondary/40 rounded-full px-4 py-1">
        Security &amp; Self-Custody
      </span>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
        Your Bitcoin stays in your hands.
      </h1>
      <p class="text-tertiary text-lg md:text-xl max-w-2xl mx-auto">
        Cadena uses Discreet Log Contracts to keep you in control of your keys at every step.
        No custodians, no middlemen, no counterparty risk.
      </p>
    </section>

    <!-- 2. Big statement card -->
    <section class="max-w-4xl mx-auto px-6 mb-20">
      <div class="relative rounded-2xl p-[1px] bg-gradient-to-br from-secondary via-secondary/40 to-transparent">
        <div class="rounded-2xl bg-dark px-8 py-10 md:px-12 md:py-14 text-center">
          <p class="text-2xl md:text-3xl font-bold leading-snug">
            Cadena never holds your Bitcoin.
          </p>
          <p class="text-tertiary mt-4 text-base md:text-lg max-w-xl mx-auto">
            Your collateral is locked in a Discreet Log Contract on the Bitcoin blockchain &mdash;
            not on our servers, not in a multisig we control, and not on a sidechain.
          </p>
        </div>
      </div>
    </section>

    <!-- 3. How it works -->
    <section class="max-w-5xl mx-auto px-6 mb-20">
      <h2 class="text-3xl md:text-4xl font-extrabold text-center mb-12">How it works</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(step, i) in howItWorks"
          :key="i"
          class="sec-card rounded-xl p-6 flex gap-5 items-start fade-in-el"
        >
          <span class="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/20 text-secondary font-bold flex items-center justify-center text-lg">
            {{ i + 1 }}
          </span>
          <div>
            <h3 class="text-lg font-semibold mb-1">{{ step.title }}</h3>
            <p class="text-white/70 text-sm leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. The Signer App -->
    <section class="max-w-6xl mx-auto px-6 mb-20">
      <h2 class="text-3xl md:text-4xl font-extrabold text-center mb-12">The Signer App</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: feature card -->
        <div class="sec-card rounded-xl p-8 fade-in-el">
          <h3 class="text-xl font-bold mb-4">Your keys live on your phone</h3>
          <p class="text-white/70 text-sm mb-6">
            The Cadena Signer App generates and stores your private keys locally.
            Keys never leave your device.
          </p>
          <ul class="space-y-3">
            <li v-for="(f, fi) in signerFeatures" :key="fi" class="flex items-start gap-3">
              <svg class="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-white/80">{{ f }}</span>
            </li>
          </ul>
        </div>
        <!-- Right: stat cards -->
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="(s, si) in signerStats"
            :key="si"
            class="sec-card rounded-xl p-6 text-center flex flex-col items-center justify-center fade-in-el"
          >
            <span class="text-3xl md:text-4xl font-extrabold text-secondary">{{ s.value }}</span>
            <span class="text-xs text-white/60 mt-2 uppercase tracking-wide">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Why DLCs change everything -->
    <section class="max-w-5xl mx-auto px-6 mb-20">
      <h2 class="text-3xl md:text-4xl font-extrabold text-center mb-12">Why DLCs change everything</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          v-for="(card, ci) in dlcCards"
          :key="ci"
          class="sec-card rounded-xl p-6 fade-in-el"
        >
          <div class="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 text-xl">
            {{ card.icon }}
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ card.title }}</h3>
          <p class="text-white/70 text-sm leading-relaxed">{{ card.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 6. Cadena vs. the rest -->
    <section class="max-w-5xl mx-auto px-6 mb-20">
      <h2 class="text-3xl md:text-4xl font-extrabold text-center mb-12">Cadena vs. the rest</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-white/10">
              <th class="py-4 px-4 text-white/50 font-medium">Feature</th>
              <th class="py-4 px-4 text-secondary font-semibold">Cadena</th>
              <th class="py-4 px-4 text-white/50 font-medium">BlockFi / Celsius</th>
              <th class="py-4 px-4 text-white/50 font-medium">Traditional Bank</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, ri) in comparisonRows" :key="ri" class="border-b border-white/[0.06]">
              <td class="py-4 px-4 text-white/80">{{ row.feature }}</td>
              <td class="py-4 px-4 text-white font-medium">{{ row.cadena }}</td>
              <td class="py-4 px-4 text-white/60">{{ row.cefi }}</td>
              <td class="py-4 px-4 text-white/60">{{ row.bank }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 7. FAQ -->
    <section class="max-w-4xl mx-auto px-6 mb-20">
      <h2 class="text-3xl md:text-4xl font-extrabold text-center mb-12">Security FAQ</h2>
      <div class="space-y-3">
        <div v-for="(item, i) in faqs" :key="i" class="rounded-md border border-white/10 bg-dark overflow-hidden">
          <button
            class="w-full flex items-center justify-between gap-3 text-left p-4"
            @click="toggle(i)"
            :aria-expanded="isOpen(i)"
            :aria-controls="`sec-faq-panel-${i}`"
          >
            <h3 class="text-lg font-medium">{{ item.q }}</h3>
            <svg class="size-5 shrink-0 transition-transform duration-300" :class="isOpen(i) ? '-rotate-180' : ''" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <transition @enter="onEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave" @leave="onLeave" @after-leave="onAfterLeave">
            <div v-show="isOpen(i)" :id="`sec-faq-panel-${i}`" role="region" class="faq-panel">
              <div class="px-4 pt-3 pb-5 text-white/90 leading-relaxed">
                {{ item.a }}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </section>

    <!-- 8. Trust bar -->
    <section class="max-w-5xl mx-auto px-6 mb-20">
      <div class="flex flex-wrap justify-center gap-6 md:gap-10">
        <div
          v-for="(t, ti) in trustSignals"
          :key="ti"
          class="flex items-center gap-2 text-sm text-white/70"
        >
          <svg class="w-5 h-5 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.351.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>{{ t }}</span>
        </div>
      </div>
    </section>

    <!-- 9. CTA block -->
    <section class="max-w-4xl mx-auto px-6 pb-20 text-center">
      <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
        Keep your Bitcoin. Unlock its value.
      </h2>
      <p class="text-tertiary text-lg mb-8 max-w-xl mx-auto">
        Get started with a self-custody loan in minutes. No banks, no custodians, no counterparty risk.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <router-link
          to="/register"
          class="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3 text-base font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none"
        >
          Get Started
        </router-link>
        <router-link
          to="/loan-explained"
          class="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white transition hover:border-white/40 focus:ring-4 focus:ring-white/10 focus:outline-none"
        >
          How It Works
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
  initObserver()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

// ─── Intersection Observer for fade-in ───
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
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
  )
  els.forEach((el) => observer.observe(el))
}

// ─── Data arrays ───

const howItWorks = [
  {
    title: 'Keys stay on your phone',
    desc: 'The Cadena Signer App generates your private keys locally. They never leave your device and are never shared with Cadena or anyone else.',
  },
  {
    title: 'DLC contract is signed',
    desc: 'You and the lender each sign a Discreet Log Contract on the Bitcoin blockchain. The contract defines all possible outcomes at maturity.',
  },
  {
    title: 'No margin calls, ever',
    desc: 'DLCs pre-compute every payout scenario at contract creation. There are no margin calls and no forced liquidations during the loan term.',
  },
  {
    title: 'On-chain settlement',
    desc: 'At maturity, an oracle attests to the BTC/USD price and the contract settles automatically on-chain. No human intervention required.',
  },
]

const signerFeatures = [
  'Private keys generated and stored on your device',
  'Keys never transmitted to Cadena servers',
  'Signs DLC contracts directly from your phone',
  'Open-source and auditable',
]

const signerStats = [
  { value: '100%', label: 'Self-custody' },
  { value: '0', label: 'Keys held by Cadena' },
  { value: 'DLC', label: 'Contract type' },
  { value: 'L1', label: 'Bitcoin layer' },
]

const dlcCards = [
  {
    icon: '\u20BF',
    title: 'Bitcoin-native',
    desc: 'DLCs run on Bitcoin Layer 1. No sidechains, no wrapped tokens, no bridges. Your Bitcoin stays on the Bitcoin network.',
  },
  {
    icon: '\u2699',
    title: 'Pre-computed outcomes',
    desc: 'Every possible settlement outcome is calculated and signed before the contract is funded. No surprises, no discretion.',
  },
  {
    icon: '\u26A1',
    title: 'No margin calls',
    desc: 'Because all outcomes are pre-signed, there is no mechanism for margin calls or forced liquidations during the contract term.',
  },
  {
    icon: '\u2713',
    title: 'Publicly verifiable',
    desc: 'All contract transactions are recorded on the Bitcoin blockchain. Anyone can independently verify the contract state.',
  },
]

const comparisonRows = [
  { feature: 'Custody model', cadena: 'Self-custody (DLC)', cefi: 'Custodial', bank: 'Custodial' },
  { feature: 'Margin calls', cadena: 'None', cefi: 'Yes', bank: 'N/A' },
  { feature: 'Forced liquidation', cadena: 'None', cefi: 'Yes', bank: 'Yes (collateral seizure)' },
  { feature: 'Counterparty risk', cadena: 'Minimized', cefi: 'High (bankruptcy risk)', bank: 'Moderate' },
  { feature: 'Blockchain', cadena: 'Bitcoin L1', cefi: 'Various / off-chain', bank: 'None' },
  { feature: 'Key control', cadena: 'You hold keys', cefi: 'Platform holds keys', bank: 'N/A' },
]

const faqs = [
  {
    q: 'What is a Discreet Log Contract (DLC)?',
    a: 'A DLC is a type of smart contract built on Bitcoin that enables two parties to make conditional payments based on an oracle-attested outcome. All possible payouts are pre-signed before funding, so neither party can change the terms after the contract is live.',
  },
  {
    q: 'Does Cadena ever have access to my private keys?',
    a: 'No. Your private keys are generated and stored locally on your device by the Cadena Signer App. They are never transmitted to Cadena or any third party.',
  },
  {
    q: 'What happens if the price of Bitcoin drops significantly?',
    a: 'Because DLCs pre-compute all possible outcomes, there are no margin calls or forced liquidations. The contract settles at maturity based on the oracle-attested price, regardless of price movements during the term.',
  },
  {
    q: 'How is the settlement price determined?',
    a: 'An independent oracle attests to the BTC/USD price at the contract maturity date. This attestation triggers the automatic on-chain settlement of the DLC.',
  },
  {
    q: 'Is the Signer App open source?',
    a: 'Yes. The Cadena Signer App is open-source and publicly auditable. You can review the code to verify that keys are generated and stored securely on your device.',
  },
]

const trustSignals = [
  'Keys on your device',
  'No margin calls',
  'No liquidations',
  'DLC contracts',
  'El Salvador licensed',
]

// ─── FAQ accordion (same pattern as FAQ.vue) ───

const openSet = ref(new Set([0]))
const isOpen = (i) => openSet.value.has(i)
function toggle(i) {
  const s = new Set(openSet.value)
  s.has(i) ? s.delete(i) : s.add(i)
  openSet.value = s
}

function onEnter(el) {
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.willChange = 'height,opacity'
  void el.offsetHeight
  el.style.transition = 'height 300ms cubic-bezier(.22,.61,.36,1), opacity 220ms ease-out'
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
}
function onAfterEnter(el) {
  el.style.transition = ''
  el.style.height = 'auto'
  el.style.willChange = ''
}
function onBeforeLeave(el) {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  el.style.willChange = 'height,opacity'
  void el.offsetHeight
}
function onLeave(el) {
  el.style.transition = 'height 300ms cubic-bezier(.22,.61,.36,1), opacity 200ms ease-in'
  el.style.height = '0px'
  el.style.opacity = '0'
}
function onAfterLeave(el) {
  el.style.transition = ''
  el.style.willChange = ''
}
</script>

<style scoped>
/* Page background: same gradient as FAQ.vue */
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

/* Section cards */
.sec-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
}

/* FAQ panel */
.faq-panel { overflow: hidden; background: transparent; border: 0; }

/* Fade-in animation */
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
