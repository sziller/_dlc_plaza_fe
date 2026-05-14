<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import TheFooter from '../../components/TheFooter.vue'
import HeroRatesDisplay from '../../components/HeroRatesDisplay.vue'
import MailingListModal from '../../components/MailingListModal.vue'
import { useAuth } from '../../composables/useAuth'
import { postContactEmail, isValidEmail } from '../../api/publicContact'
import { blogArticles } from '../../data/exploreContent'
import HubStyleMosaic from '../../components/HubStyleMosaic.vue'

/* ---------- YouTube facade ---------- */
const showVideo = ref(false)

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
    title: 'Lock BTC in a DLC',
    desc: 'Your Bitcoin is locked in a Discreet Log Contract on-chain. You keep your private keys throughout — Cadena never touches your coins.',
  },
  {
    title: 'Receive loan funds',
    desc: 'Get matched with a lender and receive Bitcoin directly. The whole process takes minutes, not days. No paperwork, no credit check.',
  },
  {
    title: 'Settle at term end',
    desc: 'After 365 days, the DLC settles automatically. Repay the loan and your BTC is unlocked. No margin calls, ever.',
  },
]

const lendSteps = [
  {
    title: 'Choose your rate',
    desc: 'Browse open loan requests and pick the terms you want. You set the rate — the market matches you with a borrower.',
  },
  {
    title: 'Fund the loan',
    desc: 'Send Bitcoin to the DLC smart contract. Your funds are cryptographically secured and can only be claimed by you at maturity.',
  },
  {
    title: 'Collect your return',
    desc: 'At the end of the 365-day term, the DLC settles and you receive your principal plus interest — guaranteed by Bitcoin script.',
  },
]

/* ---------- Feature cards ---------- */
const features = [
  {
    title: 'True Self-Custody',
    desc: 'Your private keys never leave your hands. Bitcoin is locked in on-chain DLC contracts — Cadena has zero access.',
  },
  {
    title: 'No Margin Calls',
    desc: 'Unlike custodial lenders, Cadena uses fixed-outcome DLCs. No liquidation bots. No forced selling. No sleepless nights.',
  },
  {
    title: 'Minutes, Not Days',
    desc: 'Loan matching and on-chain funding happens in minutes. No lengthy approval process, no banking hours, no borders.',
  },
  {
    title: 'Fully On-Chain',
    desc: 'Every loan is enforced by Bitcoin script — no trusted third parties, no off-chain databases, no counterparty risk.',
  },
]

/* ---------- Comparison table ---------- */
const comparisonRows = [
  { feature: 'Keep BTC in self-custody', cadena: true, custodial: false, selling: false },
  { feature: 'No margin calls', cadena: true, custodial: false, selling: 'N/A' },
  { feature: 'No credit check', cadena: true, custodial: true, selling: 'N/A' },
  { feature: 'No taxable event', cadena: true, custodial: true, selling: false },
  { feature: 'Fully on-chain enforcement', cadena: true, custodial: false, selling: 'N/A' },
  { feature: 'Keep BTC price upside', cadena: true, custodial: false, selling: false },
  { feature: 'Lender gets guaranteed return', cadena: true, custodial: false, selling: 'N/A' },
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
    a: 'Loans are in any $1,000 USD denomination.',
  },
  {
    q: 'Can I repay my loan early?',
    a: 'All loans settle at the end of the 365 day term.',
  },
  {
    q: 'Are there monthly payments?',
    a: 'There are no payments. All loans settle at the end of the term.',
  },
  {
    q: 'What is the Loan To Value?',
    a: 'Loans are 50% value loans.',
  },
  {
    q: 'How is collateral managed?',
    a: 'You control your private keys and funds. Cadena Bitcoin does not hold or access your private keys or seed phrase. Bitcoin is locked in smart contracts onchain.',
  },
  {
    q: 'What currency can I get my loan in?',
    a: 'Loans are funded in Bitcoin and settled in Bitcoin.',
  },
  {
    q: 'How long does it take to get a loan?',
    a: 'Minutes. Funding transactions are broadcast as soon as the contracts are signed.',
  },
  {
    q: 'Is there a credit check?',
    a: 'No. Your bitcoin is your credit.',
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
  { name: '21Rates', href: 'https://21rates.com/companies/1067/cadena-bitcoin', imgSrc: '/img/21rates-640.webp', alt: '21Rates' },
  { name: 'Adopting Bitcoin', href: 'https://sv25.adoptingbitcoin.org/', imgSrc: '/img/adopting-640.webp', alt: 'Adopting Bitcoin' },
  { name: 'Surfdojo', href: 'https://surfdojo.org/', imgSrc: '/img/surfdojo-640.webp', alt: 'Surfdojo' },
  { name: 'Bitcoin Treasuries', href: 'https://bitcointreasuries.net/directory#C', imgSrc: '/img/treasuries-640.webp', alt: 'Bitcoin Treasuries' },
  { name: 'Spark Services', href: 'https://getsparkservices.com/', imgSrc: '/img/partners/spark-logo.png', alt: 'Spark Services' },
  { name: 'Asobitcoin', href: 'https://www.asobitcoin.org/', imgSrc: '/img/partners/asobitcoin-logo.webp', alt: 'Asobitcoin' },
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

  const sections = document.querySelectorAll('.animated-section')
  io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...sections].indexOf(entry.target)
        if (idx !== -1) {
          sectionInView.value[idx] = true
          io.unobserve(entry.target)
        }
      }
    })
  }, { rootMargin: '0px 0px -100px 0px' })
  sections.forEach(el => io.observe(el))
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
      <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 relative z-10">

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
              Borrow Against Bitcoin.<br class="hidden sm:block" />
              <span class="text-secondary">Keep Every Sat.</span>
            </h1>

            <p class="mt-5 text-lg sm:text-xl text-white max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Non-custodial Bitcoin loans secured by Discreet Log Contracts. No margin calls, no credit check, no surrendering your keys.
            </p>

            <!-- Trust pills — SVG icons, no emoji -->
            <div class="flex flex-wrap gap-2 mt-5 justify-center lg:justify-start">
              <span class="trust-pill">
                <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Self-custody
              </span>
              <span class="trust-pill">
                <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M4.93 4.93l14.14 14.14"/></svg>
                No margin calls
              </span>
              <span class="trust-pill">
                <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                No credit check
              </span>
              <span class="trust-pill">
                <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3c4 4 4 14 0 18M12 3c-4 4-4 14 0 18M3 12h18"/></svg>
                Global access
              </span>
            </div>

            <!-- Desktop CTAs -->
            <div class="hidden lg:flex gap-4 mt-8">
              <router-link :to="heroCtaTo" class="cta-primary" @click="onHeroCtaClick">
                Get a Bitcoin Loan
              </router-link>
              <span class="cta-outline-wrap">
                <router-link :to="heroCtaTo" class="cta-outline" @click="onHeroCtaClick">
                  Earn ~11% APY Lending
                </router-link>
              </span>
            </div>

            <p class="mt-4 text-xs text-white font-mono hidden lg:block">
              // No registration required to browse rates
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
              Earn ~11% APY Lending
            </router-link>
          </span>
        </div>

        <!-- Testimonials -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 sm:mt-12">
          <div class="testimonial-card">
            <div class="flex gap-0.5 mb-3">
              <span v-for="n in 5" :key="n" class="text-secondary text-sm">★</span>
            </div>
            <p class="text-white text-sm leading-relaxed">
              "A Bitcoin lending platform where you do not give up custody of your BTC. What a unique concept."
            </p>
            <p class="mt-3 text-xs text-white font-mono">— Antonio, Canada</p>
          </div>
          <div class="testimonial-card">
            <div class="flex gap-0.5 mb-3">
              <span v-for="n in 5" :key="n" class="text-secondary text-sm">★</span>
            </div>
            <p class="text-white text-sm leading-relaxed">
              "I think this product is going very far."
            </p>
            <p class="mt-3 text-xs text-white font-mono">— Frederick, Denmark</p>
          </div>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         PARTNERS MARQUEE
    ═══════════════════════════════════════════════════ -->
    <section class="w-full bg-transparent text-white pt-6 pb-4 px-4">
      <div class="max-w-screen-xl mx-auto text-center mb-4">
        <p class="text-xs font-semibold text-white uppercase tracking-widest">Trusted &amp; Featured By</p>
      </div>
      <div class="marquee-container max-w-screen-xl mx-auto overflow-hidden">
        <div class="marquee-track flex items-center gap-10 sm:gap-12">
          <template v-for="copy in 2" :key="copy">
            <a
              v-for="p in partners"
              :key="`${copy}-${p.name}`"
              :href="p.href"
              target="_blank"
              rel="noopener"
              class="flex-shrink-0 marquee-logo"
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
          </template>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         HOW IT WORKS
    ═══════════════════════════════════════════════════ -->
    <section class="px-4 pt-16 pb-10 sm:px-6 lg:px-8">
      <div class="max-w-screen-xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-3xl md:text-4xl font-extrabold">How It Works</h2>
          <p class="mt-3 text-white text-lg">Two ways to use Cadena — both fully non-custodial.</p>
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
          >
            <div class="step-number font-mono">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="text-base font-bold mt-4 mb-2 text-white">{{ step.title }}</h3>
            <p class="text-white text-sm leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>

        <div class="text-center mt-8">
          <router-link :to="heroCtaTo" class="cta-primary inline-flex">
            {{ howItWorksTab === 'borrow' ? 'Get Your Loan' : 'Start Earning' }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         WHY CADENA
    ═══════════════════════════════════════════════════ -->
    <section class="px-4 pt-8 pb-12 sm:px-6 lg:px-8">
      <div class="max-w-screen-xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-3xl md:text-4xl font-extrabold">Why Cadena?</h2>
          <p class="mt-3 text-white text-lg">Most Bitcoin lenders take your coins. We don't.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px feature-grid">
          <div v-for="(feat, fi) in features" :key="feat.title" class="feature-card">
            <!-- SVG icon per card -->
            <div class="feature-icon">
              <!-- Self-custody: lock -->
              <svg v-if="fi === 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <!-- No margin calls: slash circle -->
              <svg v-if="fi === 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M4.93 4.93l14.14 14.14"/></svg>
              <!-- Minutes not days: bolt -->
              <svg v-if="fi === 2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <!-- Fully on-chain: chain link -->
              <svg v-if="fi === 3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </div>
            <h3 class="text-base font-bold mb-2 text-white">{{ feat.title }}</h3>
            <p class="text-sm text-white leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         COMPARISON TABLE
    ═══════════════════════════════════════════════════ -->
    <section class="bg-transparent px-4 pt-4 pb-14 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-3xl md:text-4xl font-extrabold">How We Compare</h2>
          <p class="mt-3 text-white text-base">See why Cadena is the only way to borrow Bitcoin without the trade-offs.</p>
        </div>

        <div class="overflow-x-auto rounded-xl border border-white/10">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-white/5">
                <th class="text-left px-5 py-4 text-white font-medium text-xs uppercase tracking-wide">Feature</th>
                <th class="px-4 py-4 text-center min-w-[100px]">
                  <div class="text-secondary font-extrabold text-base">Cadena</div>
                </th>
                <th class="px-4 py-4 text-center min-w-[120px]">
                  <div class="text-white font-medium text-sm">Custodial<br/>Lenders</div>
                </th>
                <th class="px-4 py-4 text-center min-w-[100px]">
                  <div class="text-white font-medium text-sm">Selling<br/>BTC</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in comparisonRows"
                :key="i"
                class=""
                :class="i % 2 === 0 ? 'bg-white/[0.02]' : ''"
              >
                <td class="px-5 py-3.5 text-white font-medium">{{ row.feature }}</td>
                <td class="px-4 py-3.5 text-center">
                  <span v-if="row.cadena === true" class="text-green-400 font-bold text-lg">✓</span>
                  <span v-else-if="row.cadena === false" class="text-red-400 text-lg">✗</span>
                  <span v-else class="text-white text-xs">{{ row.cadena }}</span>
                </td>
                <td class="px-4 py-3.5 text-center">
                  <span v-if="row.custodial === true" class="text-green-400 font-bold text-lg">✓</span>
                  <span v-else-if="row.custodial === false" class="text-red-400 text-lg">✗</span>
                  <span v-else class="text-white text-xs">{{ row.custodial }}</span>
                </td>
                <td class="px-4 py-3.5 text-center">
                  <span v-if="row.selling === true" class="text-green-400 font-bold text-lg">✓</span>
                  <span v-else-if="row.selling === false" class="text-red-400 text-lg">✗</span>
                  <span v-else class="text-white text-xs">{{ row.selling }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         WHAT IS CADENA (video)
    ═══════════════════════════════════════════════════ -->
    <section class="px-4 sm:px-6 lg:px-8">
      <div class="rounded-2xl bg-secondary mx-auto max-w-screen-xl px-4 py-12 sm:px-8 lg:px-12">
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              What is Cadena Bitcoin?
            </h2>
            <p class="mt-5 text-white text-lg leading-relaxed">
              Cadena is a decentralized Bitcoin lending marketplace. Borrowers get liquidity without selling. Lenders earn guaranteed yields secured by Bitcoin. And
              <span class="font-semibold underline underline-offset-4 decoration-2 decoration-white/70">every participant keeps custody of their Bitcoin throughout.</span>
            </p>
            <div class="flex flex-col sm:flex-row gap-3 mt-7">
              <router-link
                :to="heroCtaTo"
                class="inline-flex items-center justify-center rounded-full bg-white text-secondary font-bold px-7 py-3.5 text-base hover:bg-white/90 transition"
              >
                Explore the marketplace →
              </router-link>
              <router-link
                to="/cadena-paper"
                class="inline-flex items-center justify-center rounded-full border-2 border-white/40 text-white font-semibold px-7 py-3.5 text-base hover:border-white hover:bg-white/10 transition"
              >
                Read the paper
              </router-link>
            </div>
          </div>
          <div>
            <div class="yt" :class="{ 'yt-ready': !showVideo }" @click="showVideo = true">
              <iframe
                v-if="showVideo"
                src="https://www.youtube-nocookie.com/embed/Sb1_HFkr4T0?rel=0&modestbranding=1&playsinline=1&autoplay=1"
                title="What is Cadena Bitcoin?"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
              ></iframe>
              <template v-else>
                <img
                  src="/img/cadena-video-thumb.webp"
                  alt="What is Cadena Bitcoin?"
                  decoding="async"
                  class="yt-thumb"
                />
                <button class="yt-play" aria-label="Play video">
                  <svg viewBox="0 0 68 48" width="68" height="48"><path d="M66.5 7.7A8.5 8.5 0 0 0 60.3 1.5C55 0 34 0 34 0S13 0 7.7 1.5A8.5 8.5 0 0 0 1.5 7.7C0 13 0 24 0 24s0 11 1.5 16.3a8.5 8.5 0 0 0 6.2 6.2C13 48 34 48 34 48s21 0 26.3-1.5a8.5 8.5 0 0 0 6.2-6.2C68 35 68 24 68 24s0-11-1.5-16.3z" fill="#ff0000"/><path d="M27 34l18-10-18-10v20z" fill="#fff"/></svg>
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         KNOWLEDGE HUB
    ═══════════════════════════════════════════════════ -->
    <HubStyleMosaic />

    <!-- ═══════════════════════════════════════════════════
         FAQ
    ═══════════════════════════════════════════════════ -->
    <section id="faq" class="bg-transparent text-white px-4 pt-12 pb-16 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h2>
          <p class="mt-3 text-white text-lg">Every question you have before taking the first step.</p>
        </div>

        <div class="space-y-2">
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
         NEWSLETTER
    ═══════════════════════════════════════════════════ -->
    <section class="bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div class="max-w-lg mx-auto text-center">
        <h3 class="text-xl font-bold text-white mb-1">Stay in the Loop</h3>
        <p class="text-white text-sm mb-5">Rate alerts, product updates, and Bitcoin finance insights.</p>
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
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         FINAL CTA BANNER
    ═══════════════════════════════════════════════════ -->
    <section class="bg-secondary text-white py-16 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-extrabold leading-tight">
          Ready to Put Your Bitcoin to Work?
        </h2>
        <p class="mt-4 text-lg text-white leading-relaxed max-w-2xl mx-auto">
          Borrow against your Bitcoin or earn guaranteed returns — all without surrendering custody. Set up in minutes.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <router-link
            to="/btcusd"
            class="inline-flex items-center justify-center rounded-full bg-white text-secondary font-extrabold px-9 py-4 text-lg transition hover:bg-white/90 shadow-xl"
          >
            Get a Loan Now
          </router-link>
          <router-link
            to="/btcusd"
            class="inline-flex items-center justify-center rounded-full border-2 border-white/70 text-white font-bold px-9 py-4 text-lg transition hover:border-white hover:bg-white/10"
          >
            Start Lending →
          </router-link>
        </div>
        <p class="mt-5 text-sm text-white">No credit check · No custody transfer · No margin calls</p>
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
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 60vh;
  padding-top: calc(var(--nav-h, 80px) + var(--info-h, 0px));
  padding-bottom: clamp(1rem, 2vw, 1.5rem);
}
@media (min-width: 1024px) {
  .hero-shell {
    padding-top: calc(var(--nav-h, 80px) + var(--info-h, 0px));
  }
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
   SCROLL-IN ANIMATIONS
═══════════════════════════════════════════════════ */
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

</style>
