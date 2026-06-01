<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import TheFooter from '../../components/TheFooter.vue'
import HeroRatesDisplay from '../../components/HeroRatesDisplay.vue'
import MailingListModal from '../../components/MailingListModal.vue'
import ChainAnimation from '../../components/ChainAnimation.vue'
import FeaturesCarousel from '../../components/FeaturesCarousel.vue'
import { useAuth } from '../../composables/useAuth'
import { postContactEmail, isValidEmail } from '../../api/publicContact'
import { blogArticles } from '../../data/exploreContent'

/* ---------- YouTube facade ---------- */

/* ---------- Articles ---------- */
const articles = blogArticles

/* ---------- Auth / CTA ---------- */
const { setUserFromApi } = useAuth()
const heroCtaTo = computed(() => '/btcusd')
function onHeroCtaClick() {}

const showMailingList = ref(false)
const footerEmail = ref('')
const footerSubscribeLoading = ref(false)
const footerSubscribeError = ref('')
const footerSubscribeSuccess = ref('')

/* ---------- How it Works tab ---------- */
const howItWorksTab = ref('borrow')

const borrowSteps = [
  {
    title: 'Both parties commit Bitcoin to the same contract.',
    desc: 'You commit Bitcoin as collateral; the lender commits Bitcoin as principal. Both sit in the same Discreet Log Contract (DLC) pool on Bitcoin\'s base layer. Every settlement outcome is pre-signed by both parties before any Bitcoin moves. Cadena holds no key.',
  },
  {
    title: 'You sell your own Bitcoin separately for the cash you need.',
    desc: 'The contract gives you synthetic exposure to your locked collateral. You sell Bitcoin separately on your own exchange or OTC desk for the cash.',
    note: 'Cash in hand. Bitcoin position preserved through the locked collateral.',
  },
  {
    title: 'The contract settles itself at term-end.',
    desc: 'At maturity, the pre-signed Contract Execution Transaction broadcasts on-chain. The lender\'s USD target is paid in Bitcoin at maturity price. You receive the residual back to self-custody.',
    note: 'No margin calls. No active repayment.',
  },
]

const lendSteps = [
  {
    title: 'Commit Bitcoin to a matched contract.',
    desc: 'Your Bitcoin sits in the same on-chain DLC pool as the borrower\'s collateral. Identity verification flows through Sumsub, on-device via the open-sourced Cadena Signer App. Cadena holds no key at any point.',
  },
  {
    title: 'Earn USD-denominated yield, settled in Bitcoin.',
    desc: '12% annualized. Your dollar target is fixed at funding. No margin calls and no in-term liquidations — the contract enforces itself on Bitcoin\'s base layer.',
  },
  {
    title: 'Get paid at maturity.',
    desc: 'At term-end, the pre-signed CET pays your dollar target in Bitcoin at the oracle\'s maturity price. Lower BTC at maturity = more sats received; higher BTC = fewer sats. Full pool protection down to a 50% BTC drop. Gap risk above that is hedgeable separately.',
  },
]

/* ---------- Feature cards ---------- */
const features = [
  {

    title: 'True self-custody',
    desc: 'Your private keys never leave your hands. Bitcoin sits in on-chain DLC contracts — Cadena has zero ability to move, seize, freeze, or rehypothecate your collateral. The Signer App is open-source and verifiable.',
  },
  {

    title: 'No margin calls',
    desc: 'Every settlement outcome is pre-signed at funding. No liquidation bots. No forced selling. No in-term recalls. Settlement is a single event at maturity.',
  },
  {

    title: 'Fully on-chain',
    desc: 'Every loan is enforced by Bitcoin script — no trusted third parties, no off-chain databases, no counterparty discretion. The contract is the law.',
  },
  {

    title: 'Funded fast, verified properly',
    desc: 'Contract funding broadcasts on-chain within minutes of both parties signing. Onboarding — Sumsub KYC, Signer App setup — happens once and reuses across every contract you fund.',
  },
  {

    title: 'Regulated · verifiable · live',
    desc: 'Registered Bitcoin Service Provider in El Salvador. KYC on-device via the open-sourced Signer App. An early contract settled on Bitcoin\'s mainnet May 9, 2026 — verify on-chain.',
  },
]

/* ---------- Comparison table ---------- */
const comparisonRows = [
  { feature: 'Keep BTC in self-custody',    cadena: true,      custodial: false,       defi: '✗ wrapped',            selling: false },
  { feature: 'No margin calls',             cadena: true,      custodial: false,       defi: '✗ liquidation engine', selling: '—' },
  { feature: 'No rehypothecation',          cadena: true,      custodial: false,       defi: '✗ pooled',             selling: '—' },
  { feature: 'No credit check',             cadena: true,      custodial: false,       defi: true,                   selling: '—' },
  { feature: 'No taxable event',            cadena: true,      custodial: true,        defi: 'depends',              selling: false },
  { feature: 'Fully on-chain enforcement',  cadena: true,      custodial: false,       defi: true,                   selling: '—' },
  { feature: 'Bitcoin-native (no wrapping)',cadena: true,      custodial: 'depends',   defi: false,                  selling: '—' },
  { feature: 'Keep BTC price upside',       cadena: true,      custodial: true,        defi: true,                   selling: false },
  { feature: 'Lender gets fixed yield',     cadena: true,      custodial: true,        defi: '✗ variable',           selling: '—' },
  { feature: 'Pre-signed settlement',       cadena: true,      custodial: '—',         defi: false,                  selling: '—' },
]

/* ---------- Carousel ---------- */
const currentIndex = ref(0)
const isMobile = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
const visibleArticles = computed(() => {
  if (isMobile.value) return articles
  const res = []
  const len = articles.length
  for (let i = 0; i < 3; i++) res.push(articles[(currentIndex.value + i) % len])
  return res
})
function scrollLeft() {
  if (!isMobile.value) {
    const len = articles.length
    currentIndex.value = (currentIndex.value - 1 + len) % len
  }
}
function scrollRight() {
  if (!isMobile.value) {
    const len = articles.length
    currentIndex.value = (currentIndex.value + 1) % len
  }
}

/* ---------- Scroll-in animations ---------- */
const sectionInView = ref([false, false, false])
let io

/* ---------- FAQ ---------- */
const faqs = [
  {
    q: 'What is the loan amount?',
    a: 'Loan size ranges from $1,000 minimum to $1M per single contract. Loans above $1M are syndicated across multiple parallel contracts funded the same day.',
  },
  {
    q: 'Is there a credit check?',
    a: 'No. Your Bitcoin is your credit.',
  },
  {
    q: 'What is the Loan-to-Value?',
    a: '50% LTV. This means the lender\'s USD principal is protected against up to a 50% BTC price decline between funding and maturity. The collateral pool is sized to cover the lender\'s full dollar-denominated target in any flat-or-down BTC scenario down to that threshold.',
  },
  {
    q: 'What currency is the loan in?',
    a: 'The contract is denominated in USD but funded and settled in Bitcoin. You commit Bitcoin as collateral; you sell additional Bitcoin separately on your own exchange or OTC desk to access cash. The contract preserves your original Bitcoin position through the term via the locked collateral.',
  },
  {
    q: 'Are there monthly payments?',
    a: 'No. All Cadena contracts settle in a single event at maturity via a pre-signed Contract Execution Transaction. The borrower\'s all-in cost is paid in BTC at maturity, denominated in USD.',
  },
  {
    q: 'Can I repay early?',
    a: 'Cadena contracts don\'t have an active repayment step. Settlement is automatic at term-end via the pre-signed CET. 1-year terms are standard; 90-day terms are available subject to lender match.',
  },
  {
    q: 'How is collateral managed?',
    a: 'You control your private keys and Bitcoin throughout. Cadena does not hold, custody, or access your private keys at any point. The Signer App is open-source.',
  },
  {
    q: 'How long does funding take?',
    a: 'Funding broadcasts within minutes of both parties signing. Initial onboarding (Sumsub KYC and Signer App setup) is a one-time step that reuses across every future contract.',
  },
  {
    q: 'Is Cadena regulated?',
    a: 'Yes. Cadena Bitcoin S.A. de C.V. is a registered Bitcoin Service Provider in El Salvador. All identity verification flows through Sumsub on-device via the open-sourced Cadena Signer App — identity goes to Sumsub directly, never through Cadena.',
  },
  {
    q: 'What happens if Bitcoin falls more than 50% during the term?',
    a: 'The collateral pool is sized for a 50% BTC drop. Below that threshold, the lender absorbs any shortfall against their dollar-denominated target. The gap risk above that threshold is hedgeable separately with a put position struck near the 50% LTV mark.',
  },
  {
    q: 'What\'s the fee structure?',
    a: '1% Cadena platform fee on the borrower side, paid in BTC from the borrower\'s collateral contribution at funding and settlement. 0% on the lender side.',
  },
  {
    q: 'Can I lend or borrow above $1M?',
    a: 'Yes. Above $1M, contracts are syndicated — multiple parallel $1M contracts funded the same day with matched counterparties.',
  },
  {
    q: 'Where does the off-ramp happen?',
    a: 'On your own exchange or OTC desk. Cadena is not in the off-ramp path and does not custody or process any fiat at any point.',
  },
]
const openSet = ref(new Set([0]))
const isOpen = (i) => openSet.value.has(i)
function toggle(i) {
  const s = new Set(openSet.value)
  s.has(i) ? s.delete(i) : s.add(i)
  openSet.value = s
}

/* ---------- Partners ---------- */
const partners = [
  { name: '21Rates',           href: 'https://21rates.com/companies/1067/cadena-bitcoin', imgSrc: '/img/21rates-640.webp',               alt: '21Rates' },
  { name: 'Bitcoin Treasuries',href: 'https://bitcointreasuries.net/directory#C',         imgSrc: '/img/treasuries-640.webp',            alt: 'BitcoinTreasuries.net' },
  { name: 'Adopting Bitcoin',  href: 'https://sv25.adoptingbitcoin.org/',                 imgSrc: '/img/adopting-640.webp',              alt: 'Adopting Bitcoin SV25' },
  { name: 'Surfdojo',          href: 'https://surfdojo.org/',                             imgSrc: '/img/surfdojo-640.webp',              alt: 'Surfdojo' },
  { name: 'Spark Services',    href: 'https://getsparkservices.com/',                     imgSrc: '/img/partners/spark-logo.png',        alt: 'Spark Services' },
  { name: 'Asobitcoin',        href: 'https://www.asobitcoin.org/',                       imgSrc: '/img/partners/asobitcoin-logo.webp',  alt: 'Asobitcoin' },
]

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

async function handleFooterSubscribe() {
  footerSubscribeError.value = ''
  footerSubscribeSuccess.value = ''

  if (!isValidEmail(footerEmail.value)) {
    footerSubscribeError.value = 'Please enter a valid email address.'
    return
  }

  footerSubscribeLoading.value = true
  try {
    await postContactEmail(footerEmail.value)

    const attioEmail = footerEmail.value
    fetch('https://hooks.attio.com/w/f2661d8b-9de8-4673-9281-3d3624c2e90b/50d3fdcf-686c-491f-b561-68badcff0cff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: attioEmail }),
    }).catch(() => {})

    footerSubscribeSuccess.value = 'Thanks! Check your inbox for Cadena updates.'
    footerEmail.value = ''
    setTimeout(() => { footerSubscribeSuccess.value = '' }, 5000)
  } catch (err) {
    const msg = err && typeof err === 'object' && 'message' in err ? err.message : null
    footerSubscribeError.value = msg || 'Could not add your email. Please try again.'
  } finally {
    footerSubscribeLoading.value = false
  }
}

let updateIsMobile

onMounted(() => {
  setUserFromApi()

  updateIsMobile = () => {
    const width = window.innerWidth
    isMobile.value = width < 640
    viewportWidth.value = width
  }
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)

  io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        io.unobserve(entry.target)
      }
    })
  }, { rootMargin: '0px 0px -70px 0px', threshold: 0.07 })
  document.querySelectorAll('.reveal').forEach(el => io.observe(el))
})

onBeforeUnmount(() => {
  if (updateIsMobile) window.removeEventListener('resize', updateIsMobile)
  if (io) io.disconnect()
})
</script>

<template>
  <div class="page-root relative min-h-screen text-white">

    <!-- ═══════════════════════════════════════════════════
         HERO
    ═══════════════════════════════════════════════════ -->
    <section class="hero-shell text-white">

      <!-- 3D Chain — starts right edge, angles toward top-center, behind content -->
      <div class="absolute top-0 h-full pointer-events-none select-none" style="width:min(640px,72vw);right:-50px;z-index:0;">
        <ChainAnimation />
      </div>

      <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-1 pb-2 sm:py-3 lg:py-4 relative z-10">

        <!-- Desktop: side-by-side | Mobile: stacked -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">

          <!-- Left: Copy + CTAs -->
          <div class="flex-1 text-center lg:text-left">

            <!-- Live indicator -->
            <div class="inline-flex items-center gap-2 border border-secondary/40 rounded-sm px-3 py-1 text-xs font-mono font-medium text-secondary mb-5 tracking-widest uppercase">
              <span class="relative flex h-1.5 w-1.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-secondary"></span>
              </span>
              Live market &mdash; Bitcoin-native DLC loans
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
              Bitcoin credit, on Bitcoin's base layer.
            </h1>

            <p class="mt-5 text-lg sm:text-xl text-white max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Borrow against your Bitcoin or earn 12% on it — without surrendering custody. Non-custodial. No margin calls. No counterparty risk.
            </p>

            <!-- Feature checks — 4 across -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mt-6 text-sm text-white text-left">
              <!-- Self-custody: lock -->
              <div class="flex items-start gap-2">
                <svg class="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Self-custody throughout</span>
              </div>
              <!-- Pre-signed settlement: document with checkmark -->
              <div class="flex items-start gap-2">
                <svg class="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>
                </svg>
                <span>Pre-signed settlement — no margin calls</span>
              </div>
              <!-- No rehypothecation / on-chain: chain link -->
              <div class="flex items-start gap-2">
                <svg class="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span>No rehypothecation — every contract on-chain</span>
              </div>
              <!-- Regulated / KYC: shield -->
              <div class="flex items-start gap-2">
                <svg class="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>El Salvador BSP regulated · KYC on-device</span>
              </div>
            </div>

            <!-- Desktop CTAs -->
            <div class="hidden lg:flex gap-4 mt-8">
              <router-link :to="heroCtaTo" class="cta-primary" @click="onHeroCtaClick">
                Get a Bitcoin Loan
              </router-link>
              <span class="cta-outline-wrap">
                <router-link :to="heroCtaTo" class="cta-outline" @click="onHeroCtaClick">
                  Earn 12% Lending
                </router-link>
              </span>
            </div>

            <p class="mt-4 text-xs text-white font-mono hidden lg:block">
              // Browse live rates — no registration required.
            </p>
          </div>

          <!-- Right: Rates Card -->
          <div class="flex justify-center lg:justify-end w-full lg:w-auto lg:flex-shrink-0">
            <HeroRatesDisplay
              :compact="isMobile"
              :link-to="heroCtaTo"
              class="w-full max-w-sm sm:max-w-md lg:max-w-none lg:w-[360px]"
            />
          </div>

        </div>

        <!-- Mobile CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 lg:hidden">
          <router-link :to="heroCtaTo" class="cta-primary w-full sm:w-auto text-center" @click="onHeroCtaClick">
            Get a Bitcoin Loan
          </router-link>
          <span class="cta-outline-wrap w-full sm:w-auto">
            <router-link :to="heroCtaTo" class="cta-outline w-full text-center" @click="onHeroCtaClick">
              Earn 12% Lending
            </router-link>
          </span>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         PARTNERS MARQUEE
    ═══════════════════════════════════════════════════ -->
    <section class="w-full bg-transparent text-white pt-10 pb-6 px-4">
      <div class="max-w-screen-xl mx-auto text-center mb-4 reveal">
        <p class="text-xs font-semibold text-white/60 uppercase tracking-widest">Listed &amp; verified</p>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-8 sm:gap-12 max-w-screen-xl mx-auto px-4">
        <a
          v-for="p in partners"
          :key="p.name"
          :href="p.href"
          target="_blank"
          rel="noopener"
          :aria-label="p.name"
        >
          <img
            :src="p.imgSrc"
            :alt="p.alt"
            class="h-7 sm:h-8 w-auto object-contain grayscale brightness-110 opacity-70 hover:grayscale-0 hover:brightness-100 hover:opacity-100 transition-all duration-200"
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>
      <div class="max-w-screen-xl mx-auto text-center mt-6">
        <a
          href="https://mempool.space/tx/95bf1377f4709235656bbaafa4afe454f91e905f8bb2dfe3e2bd1b619e5aab7d"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-secondary/50 bg-secondary/10 hover:bg-secondary/20 hover:border-secondary/80 transition-all duration-200 group"
        >
          <span class="flex items-center justify-center w-4 h-4 rounded-full bg-secondary text-white text-[10px] font-bold shrink-0">✓</span>
          <span class="text-xs font-mono text-white font-semibold group-hover:text-white transition-colors">Mainnet-settled contract</span>
          <span class="text-white/40">·</span>
          <span class="text-xs font-mono text-secondary font-semibold group-hover:brightness-125 transition-all">verify on mempool.space →</span>
        </a>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         HOW IT WORKS
    ═══════════════════════════════════════════════════ -->
    <section class="px-4 py-20 sm:py-24 sm:px-6 lg:px-8">
      <div class="max-w-screen-xl mx-auto">
        <div class="reveal text-center mb-10">
          <span class="eyebrow">The mechanism</span>
          <h2 class="text-3xl md:text-4xl font-extrabold">How it works</h2>
          <p class="mt-3 text-white/80 text-base max-w-2xl mx-auto leading-relaxed">
            Both parties commit Bitcoin. Both parties pre-sign every possible outcome. Bitcoin's base layer enforces the result.
          </p>
        </div>

        <!-- Tab switcher -->
        <div class="flex justify-center mb-8">
          <div class="tab-container">
            <button class="tab-btn" :class="howItWorksTab === 'borrow' ? 'tab-btn-active' : ''" @click="howItWorksTab = 'borrow'">
              I want to borrow
            </button>
            <button class="tab-btn" :class="howItWorksTab === 'lend' ? 'tab-btn-active' : ''" @click="howItWorksTab = 'lend'">
              I want to lend
            </button>
          </div>
        </div>

        <!-- Steps grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-px max-w-4xl mx-auto step-grid">
          <div
            v-for="(step, i) in howItWorksTab === 'borrow' ? borrowSteps : lendSteps"
            :key="`${howItWorksTab}-${i}`"
            class="step-card"
            :style="{ animationDelay: i * 80 + 'ms' }"
          >
            <div class="step-number font-mono">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="text-base font-bold mt-4 mb-2 text-white">{{ step.title }}</h3>
            <p class="text-white text-sm leading-relaxed">{{ step.desc }}</p>
            <p v-if="step.note" class="mt-3 text-xs font-mono text-secondary/80 leading-relaxed">{{ step.note }}</p>
          </div>
        </div>

        <div class="text-center mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link :to="heroCtaTo" class="cta-primary inline-flex">
            {{ howItWorksTab === 'borrow' ? 'Build your borrower scenario →' : 'Build your lender scenario →' }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         WHY CADENA
    ═══════════════════════════════════════════════════ -->
    <section class="px-4 py-20 sm:py-24 sm:px-6 lg:px-8">
      <div class="max-w-screen-xl mx-auto">
        <FeaturesCarousel />
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         COMPARISON TABLE
    ═══════════════════════════════════════════════════ -->
    <section class="bg-transparent px-4 py-20 sm:py-24 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="reveal text-center mb-10">
          <span class="eyebrow">Comparison</span>
          <h2 class="text-3xl md:text-4xl font-extrabold">How Cadena compares</h2>
          <p class="mt-3 text-white/80 text-base max-w-2xl mx-auto">Why non-custodial Bitcoin credit is structurally different from every other option.</p>
        </div>

        <div class="reveal overflow-x-auto rounded-xl border border-white/10">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-white/5">
                <th class="text-left px-5 py-4 text-white font-medium text-xs uppercase tracking-wide">Feature</th>
                <th class="px-4 py-4 text-center min-w-[90px]">
                  <div class="text-secondary font-extrabold text-base">Cadena</div>
                </th>
                <th class="px-4 py-4 text-center min-w-[110px]">
                  <div class="text-white font-medium text-xs">Custodial<br/>Lenders</div>
                </th>
                <th class="px-4 py-4 text-center min-w-[110px]">
                  <div class="text-white font-medium text-xs">DeFi Pools<br/>(wBTC)</div>
                </th>
                <th class="px-4 py-4 text-center min-w-[90px]">
                  <div class="text-white font-medium text-xs">Selling<br/>Bitcoin</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in comparisonRows"
                :key="i"
                :class="i % 2 === 0 ? 'bg-white/[0.02]' : ''"
              >
                <td class="px-5 py-3 text-white font-medium text-sm">{{ row.feature }}</td>
                <td class="px-4 py-3 text-center">
                  <span v-if="row.cadena === true" class="text-green-400 font-bold text-base">✓</span>
                  <span v-else-if="row.cadena === false" class="text-red-400 text-base">✗</span>
                  <span v-else class="text-white text-xs font-mono">{{ row.cadena }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="row.custodial === true" class="text-green-400 font-bold text-base">✓</span>
                  <span v-else-if="row.custodial === false" class="text-red-400 text-base">✗</span>
                  <span v-else class="text-white text-xs font-mono">{{ row.custodial }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="row.defi === true" class="text-green-400 font-bold text-base">✓</span>
                  <span v-else-if="row.defi === false" class="text-red-400 text-base">✗</span>
                  <span v-else class="text-white text-xs font-mono">{{ row.defi }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="row.selling === true" class="text-green-400 font-bold text-base">✓</span>
                  <span v-else-if="row.selling === false" class="text-red-400 text-base">✗</span>
                  <span v-else class="text-white text-xs font-mono">{{ row.selling }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         VERIFIED ON-CHAIN
    ═══════════════════════════════════════════════════ -->
    <section class="px-4 py-20 sm:py-24 sm:px-6 lg:px-8" style="background:#081123">
      <div class="max-w-2xl mx-auto">

        <div class="reveal text-center mb-8">
          <span class="eyebrow">On-chain proof</span>
          <h2 class="text-3xl md:text-4xl font-extrabold">Verified on mainnet</h2>
        </div>

        <!-- Explorer card -->
        <div class="voc-card reveal" style="transition-delay:120ms">

          <!-- Card header -->
          <div class="voc-card-header">
            <div class="voc-status-dot"></div>
            <span class="voc-card-header-label">Bitcoin Mainnet · DLC Contract · Settled</span>
            <span class="voc-verified-badge">✓ Verified</span>
          </div>

          <!-- Main content -->
          <div class="voc-body">
            <p class="voc-body-sub">Early contract — funded Nov 2025, settled May 2026</p>
            <p class="voc-body-stats">6-month term · $80k BTC · 12% annualized yield</p>
            <p class="voc-body-desc">Bitcoin's price fell over the term — the lender received more sats than the opening BTC contribution implied, exactly as the pre-signed CETs were structured to deliver.</p>
          </div>

          <!-- TX block -->
          <div class="voc-tx-block">
            <p class="voc-tx-label">Transaction ID</p>
            <a
              href="https://mempool.space/tx/95bf1377f4709235656bbaafa4afe454f91e905f8bb2dfe3e2bd1b619e5aab7d"
              target="_blank"
              rel="noopener noreferrer"
              class="voc-tx-hash"
            >
              95bf1377f4709235656bbaafa4afe454f91e905f8bb2dfe3e2bd1b619e5aab7d
            </a>
          </div>

          <!-- Card footer -->
          <div class="voc-card-footer">
            <span class="voc-footer-note">Every Cadena contract leaves a verifiable on-chain trail. The contract is the proof.</span>
            <a
              href="https://mempool.space/tx/95bf1377f4709235656bbaafa4afe454f91e905f8bb2dfe3e2bd1b619e5aab7d"
              target="_blank"
              rel="noopener noreferrer"
              class="voc-tx-link"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Verify on mempool.space →
            </a>
          </div>

        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FAQ
    ═══════════════════════════════════════════════════ -->
    <section id="faq" class="bg-transparent text-white px-4 py-20 sm:py-24 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="reveal text-center mb-10">
          <span class="eyebrow">Common questions</span>
          <h2 class="text-3xl md:text-4xl font-extrabold">Frequently asked questions</h2>
          <p class="mt-3 text-white/80 text-base">The questions every prospect asks before their first contract.</p>
        </div>

        <div class="reveal space-y-2" style="transition-delay:100ms">
          <div v-for="(item, i) in faqs" :key="i" class="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <button
              class="w-full flex items-center justify-between gap-3 text-left px-5 py-4"
              @click="toggle(i)"
              :aria-expanded="isOpen(i)"
              :aria-controls="`faq-panel-${i}`"
            >
              <h3 class="text-base font-semibold leading-snug">{{ item.q }}</h3>
              <svg
                class="size-5 shrink-0 transition-transform duration-300 text-white"
                :class="isOpen(i) ? '-rotate-180' : ''"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition @enter="onEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave" @leave="onLeave" @after-leave="onAfterLeave">
              <div v-show="isOpen(i)" :id="`faq-panel-${i}`" role="region" class="faq-panel">
                <div class="px-5 pt-0 pb-5 text-white leading-relaxed text-sm">
                  {{ item.a }}
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FOR INSTITUTIONS
    ═══════════════════════════════════════════════════ -->
    <section class="inst-root px-4 py-20 sm:py-24 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto text-center">

        <!-- Label + heading -->
        <div class="reveal">
          <span class="eyebrow">Institutional</span>
          <h2 class="text-3xl md:text-4xl font-extrabold mb-3">For institutions</h2>
        </div>
        <p class="inst-sub reveal" style="transition-delay:80ms">If you're managing a Bitcoin treasury, running a fund, operating a mining business, or sitting on a sec-lending desk — Cadena's architecture maps onto your existing collateral and settlement mental model.</p>

        <!-- Cards -->
        <p class="inst-examples-label reveal" style="transition-delay:140ms">Worked examples by use case</p>
        <div class="inst-cards reveal" style="transition-delay:200ms">
          <router-link to="/btcusd" class="inst-card">
            <div class="inst-card-badge inst-card-badge-lend">Lend</div>
            <div class="inst-card-amount">$1M</div>
            <p class="inst-card-desc">12% annualized USD yield on Bitcoin</p>
            <span class="inst-card-link">View →</span>
          </router-link>
          <router-link to="/btcusd" class="inst-card">
            <div class="inst-card-badge inst-card-badge-borrow">Borrow</div>
            <div class="inst-card-amount">$3M</div>
            <p class="inst-card-desc">Non-custodial liquidity without selling</p>
            <span class="inst-card-link">View →</span>
          </router-link>
        </div>

        <!-- Kevin -->
        <div class="inst-kevin">
          <div class="inst-kevin-avatar">KB</div>
          <div>
            <p class="inst-kevin-name">Kevin Bell, CFA</p>
            <p class="inst-kevin-title">Founder — term sheets available</p>
          </div>
        </div>

        <!-- CTAs -->
        <div class="inst-ctas">
          <router-link to="/contact" class="inst-cta-primary">Schedule a call →</router-link>
          <router-link to="/contact" class="inst-cta-secondary">Request a term sheet →</router-link>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         NEWSLETTER
    ═══════════════════════════════════════════════════ -->
    <section class="bg-transparent px-4 py-20 sm:py-24 sm:px-6 lg:px-8">
      <div class="max-w-lg mx-auto text-center reveal">
        <h3 class="text-2xl font-bold text-white mb-2">Stay in the loop</h3>
        <p class="text-white text-sm mb-5">Rate updates, on-chain settlements, and chapter excerpts from Endgame — Kevin's book on the credit function on Bitcoin.</p>
        <form class="flex flex-col sm:flex-row gap-3 sm:justify-center" @submit.prevent="handleFooterSubscribe">
          <input
            v-model.trim="footerEmail"
            type="email"
            inputmode="email"
            placeholder="Enter your email"
            required
            class="flex-1 max-w-md rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
            :disabled="footerSubscribeLoading"
          />
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-base font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none disabled:opacity-50 min-w-[140px]"
            :disabled="footerSubscribeLoading"
          >
            <span v-if="footerSubscribeLoading">Subscribing…</span>
            <span v-else>Subscribe</span>
          </button>
        </form>
        <div v-if="footerSubscribeError" class="mt-2 text-sm text-red-300" aria-live="polite">{{ footerSubscribeError }}</div>
        <div v-else-if="footerSubscribeSuccess" class="mt-2 text-sm text-green-300" aria-live="polite">{{ footerSubscribeSuccess }}</div>
        <p class="mt-3 text-white text-xs">One email per week. Unsubscribe anytime.</p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FINAL CTA BANNER
    ═══════════════════════════════════════════════════ -->
    <section class="bg-secondary text-white py-20 px-6">
      <div class="max-w-4xl mx-auto text-center reveal">
        <h2 class="text-3xl md:text-4xl font-extrabold leading-tight">
          Ready to put your Bitcoin to work?
        </h2>
        <p class="mt-4 text-lg text-white leading-relaxed max-w-2xl mx-auto">
          Borrow against your Bitcoin or earn 12% USD-denominated yield on it — without surrendering custody. Onboard once. Reuse across every contract.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <router-link
            to="/btcusd"
            class="inline-flex items-center justify-center rounded-full bg-white text-secondary font-extrabold px-8 py-4 text-base transition hover:bg-white/90 shadow-xl"
          >
            Get a Loan
          </router-link>
          <router-link
            to="/btcusd"
            class="inline-flex items-center justify-center rounded-full border-2 border-white/70 text-white font-bold px-8 py-4 text-base transition hover:border-white hover:bg-white/10"
          >
            Start Lending
          </router-link>
          <router-link
            to="/contact"
            class="inline-flex items-center justify-center rounded-full border-2 border-white/30 text-white font-bold px-8 py-4 text-base transition hover:border-white hover:bg-white/10"
          >
            Talk to Kevin →
          </router-link>
        </div>
        <p class="mt-5 text-sm text-white">No credit check · No custody transfer · No margin calls · Mainnet-verified</p>
      </div>
    </section>

  </div>

  <TheFooter />

  <MailingListModal
    :open="showMailingList"
    @close="showMailingList = false"
  />
</template>

<style scoped>
/* ═══════════════════════════════════════════════════
   PAGE BASE — pure dark, no gradient
═══════════════════════════════════════════════════ */
.page-root {
  background-color: #081123;
}

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */
.hero-shell {
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 60vh;
  padding-top: 0;
  padding-bottom: clamp(1rem, 2vw, 1.5rem);
}
@media (min-width: 1024px) {
  .hero-shell { justify-content: center; }
}
@media (max-width: 1023px) {
  .hero-shell { padding-bottom: clamp(1.5rem, 4vw, 2.5rem); }
}


/* ═══════════════════════════════════════════════════
   CTAs
═══════════════════════════════════════════════════ */
.cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #6738e3;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  transition: background-color 0.15s, box-shadow 0.15s;
  white-space: nowrap;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
}
.cta-primary:hover {
  background-color: #7a4af0;
  box-shadow: 0 0 20px rgba(103,56,228,0.4);
}
.cta-outline-wrap {
  display: inline-flex;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  background: rgba(103,56,228,0.6);
  padding: 1px;
  transition: background-color 0.15s;
}
.cta-outline-wrap:hover {
  background: #6738e3;
}
.cta-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%);
  background: #081123;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  transition: background-color 0.15s;
  white-space: nowrap;
}
.cta-outline:hover {
  background-color: rgba(103,56,228,0.12);
}

/* ═══════════════════════════════════════════════════
   TRUST PILLS
═══════════════════════════════════════════════════ */
.trust-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(103,56,228,0.08);
  border: 1px solid rgba(103,56,228,0.25);
  padding: 0.3rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.02em;
  clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
}
.trust-icon {
  width: 0.9rem;
  height: 0.9rem;
  color: #6738e3;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════ */
.testimonial-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.07);
  border-left: 2px solid rgba(103,56,228,0.5);
  padding: 1.25rem 1.5rem;
}

/* ═══════════════════════════════════════════════════
   HOW IT WORKS — TABS
═══════════════════════════════════════════════════ */
.tab-container {
  display: flex;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 3px;
  gap: 2px;
}
.tab-btn {
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  transition: color 0.15s, background-color 0.15s;
  white-space: nowrap;
}
.tab-btn:hover { color: #fff; }
.tab-btn-active {
  background-color: #6738e3;
  color: #fff;
}

/* ═══════════════════════════════════════════════════
   STEP CARDS
═══════════════════════════════════════════════════ */
.step-grid {
  background: rgba(103,56,228,0.12);
  border: 1px solid rgba(103,56,228,0.2);
}
.step-card {
  background: #081123;
  padding: 1.75rem;
  position: relative;
  animation: step-enter 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes step-enter {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
.step-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: #6738e3;
  line-height: 1;
  opacity: 0.7;
}

/* ═══════════════════════════════════════════════════
   FEATURE CARDS
═══════════════════════════════════════════════════ */
.feature-grid {
  background: rgba(103,56,228,0.12);
  border: 1px solid rgba(103,56,228,0.2);
}
.feature-card {
  background: #081123;
  padding: 1.75rem;
  transition: background-color 0.2s;
  position: relative;
}
.feature-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 2px;
  height: 0;
  background: #6738e3;
  transition: height 0.25s ease;
}
.feature-card:hover { background-color: rgba(103,56,228,0.05); }
.feature-card:hover::before { height: 100%; }
.feature-icon {
  width: 2rem;
  height: 2rem;
  color: #6738e3;
  margin-bottom: 1rem;
}
.feature-icon svg {
  width: 100%;
  height: 100%;
}


/* ═══════════════════════════════════════════════════
   SCROLL-REVEAL
═══════════════════════════════════════════════════ */
.reveal {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1),
              transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.visible {
  opacity: 1;
  transform: none;
}

/* ═══════════════════════════════════════════════════
   EYEBROW LABEL
═══════════════════════════════════════════════════ */
.eyebrow {
  display: inline-block;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #6738e3;
  margin-bottom: 0.6rem;
}

/* ═══════════════════════════════════════════════════
   SECTION DIVIDER
═══════════════════════════════════════════════════ */
.{
  border-top: 1px solid rgba(255,255,255,0.055);
}

/* legacy — kept for backward compat */
.animated-section {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.9s ease, transform 0.9s ease;
  will-change: opacity, transform;
  transform: translateY(24px);
}
.animate-in-up {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

/* ═══════════════════════════════════════════════════
   YOUTUBE EMBED
═══════════════════════════════════════════════════ */
.yt {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  overflow: hidden;
  border: 1px solid rgba(103,56,228,0.25);
}
.yt iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; display: block; }
.yt-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.yt-ready { cursor: pointer; }
.yt-play {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 0.15s, transform 0.15s;
}
.yt-ready:hover .yt-play { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }

/* ═══════════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════════ */
.faq-panel { overflow: hidden; background: transparent; border: 0; }

/* ═══════════════════════════════════════════════════
   PARTNERS MARQUEE
═══════════════════════════════════════════════════ */
.marquee-container {
  mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
}
.marquee-track {
  animation: marquee-scroll 30s linear infinite;
  width: max-content;
}
@keyframes marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation-play-state: paused; }
}

:deep(.rate) { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }

/* ── Verified on-chain ── */
.voc-card {
  border: 1px solid rgba(103,56,228,0.35);
  background: #080e1d;
  overflow: hidden;
}

.voc-card-header {
  display: flex; align-items: center; gap: 0.6rem;
  background: rgba(103,56,228,0.08);
  border-bottom: 1px solid rgba(103,56,228,0.2);
  padding: 0.65rem 1.25rem;
}
.voc-status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34,197,94,0.8);
  flex-shrink: 0;
}
.voc-card-header-label {
  font-size: 0.62rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: #fff; font-family: monospace; flex: 1;
}
.voc-verified-badge {
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: #22c55e; border: 1px solid rgba(34,197,94,0.35); padding: 0.15rem 0.5rem;
}

.voc-body {
  padding: 1.75rem 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.voc-body-heading {
  font-size: 1.4rem; font-weight: 900; color: #fff; letter-spacing: -0.02em; margin-bottom: 0.35rem;
}
.voc-body-sub {
  font-size: 0.78rem; font-family: monospace; color: #fff; margin-bottom: 0.6rem;
}
.voc-body-stats {
  font-size: 0.72rem; font-family: monospace; font-weight: 700; color: #6738e3;
  letter-spacing: 0.04em; margin-bottom: 1rem;
}
.voc-body-desc {
  font-size: 0.88rem; color: #fff; line-height: 1.65;
}

.voc-tx-block {
  padding: 1rem 1.5rem;
  background: rgba(0,0,0,0.25);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.voc-tx-label {
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  color: #fff; font-family: monospace; margin-bottom: 0.35rem;
}
.voc-tx-hash {
  font-family: monospace; font-size: 0.75rem; color: #6738e3;
  text-decoration: none; word-break: break-all; line-height: 1.5; display: block;
  transition: color 0.15s;
}
.voc-tx-hash:hover { color: #8b63f0; }

.voc-card-footer {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.875rem 1.5rem;
  flex-wrap: wrap;
}
.voc-footer-note {
  font-size: 0.72rem; color: #fff; font-family: monospace; line-height: 1.5; flex: 1;
}
.voc-tx-link {
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-size: 0.72rem; font-weight: 600; color: #6738e3;
  text-decoration: none; border: 1px solid rgba(103,56,228,0.4);
  padding: 0.35rem 0.75rem; white-space: nowrap; flex-shrink: 0;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.voc-tx-link:hover { color: #fff; border-color: rgba(103,56,228,0.8); background: rgba(103,56,228,0.1); }

/* ── For Institutions ── */
.inst-root { background: #081123; }

.inst-label {
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  color: #6738e3; display: block; margin-bottom: 1rem;
}
.inst-heading {
  font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 900; color: #fff;
  line-height: 1.1; letter-spacing: -0.025em; margin-bottom: 1.25rem;
}
.inst-sub {
  font-size: 0.92rem; color: #fff; line-height: 1.75;
  margin-bottom: 2.5rem;
}

.inst-examples-label {
  font-size: 0.6rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
  color: #fff; font-family: monospace; margin-bottom: 1.25rem;
}

.inst-cards {
  display: flex; gap: 1rem; justify-content: center; margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.inst-card {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 1.75rem 2rem;
  border: 1px solid rgba(103,56,228,0.25);
  background: rgba(103,56,228,0.04);
  text-decoration: none; width: 200px;
  transition: border-color 0.2s, background 0.2s;
}
.inst-card:hover { border-color: rgba(103,56,228,0.6); background: rgba(103,56,228,0.08); }

.inst-card-badge {
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  padding: 0.15rem 0.5rem; margin-bottom: 1rem; display: inline-block;
}
.inst-card-badge-lend { color: #22c55e; border: 1px solid rgba(34,197,94,0.35); }
.inst-card-badge-borrow { color: #6738e3; border: 1px solid rgba(103,56,228,0.4); }

.inst-card-amount {
  font-size: 2.25rem; font-weight: 900; color: #fff; line-height: 1;
  font-family: monospace; margin-bottom: 0.75rem;
}
.inst-card-desc {
  font-size: 0.75rem; color: #fff; line-height: 1.5; margin-bottom: 1rem; flex: 1;
}
.inst-card-link { font-size: 0.73rem; font-weight: 600; color: #6738e3; transition: color 0.15s; }
.inst-card:hover .inst-card-link { color: #8b63f0; }

.inst-kevin {
  display: inline-flex; align-items: center; gap: 0.875rem;
  margin-bottom: 1.75rem;
}
.inst-kevin-avatar {
  width: 2.5rem; height: 2.5rem; border-radius: 50%;
  background: linear-gradient(135deg, #6738e3, #3b1fa3);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 800; color: #fff; flex-shrink: 0; letter-spacing: 0.05em;
}
.inst-kevin-name { font-size: 0.85rem; font-weight: 700; color: #fff; text-align: left; }
.inst-kevin-title { font-size: 0.7rem; color: #fff; text-align: left; margin-top: 0.1rem; }

.inst-ctas { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }

.inst-cta-primary {
  display: inline-flex; align-items: center;
  background: #6738e3; color: #fff; font-weight: 700; font-size: 0.82rem;
  padding: 0.7rem 1.6rem; text-decoration: none; transition: background 0.2s;
}
.inst-cta-primary:hover { background: #7b4df5; }

.inst-cta-secondary {
  display: inline-flex; align-items: center;
  border: 1px solid rgba(255,255,255,0.25); color: #fff;
  font-weight: 600; font-size: 0.82rem; padding: 0.7rem 1.6rem; text-decoration: none;
  transition: border-color 0.2s;
}
.inst-cta-secondary:hover { border-color: #fff; }

</style>
