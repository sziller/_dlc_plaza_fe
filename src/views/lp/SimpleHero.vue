<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import TheFooter from '../../components/TheFooter.vue'
import HeroRatesDisplay from '../../components/HeroRatesDisplay.vue'
import MailingListModal from '../../components/MailingListModal.vue'
import { useAuth } from '../../composables/useAuth'
import { postContactEmail, isValidEmail } from '../../api/publicContact'
import { blogArticles } from '../../data/exploreContent'

/* ---------- Media ---------- */
const videos = ['WfBMCMVsD1Q', 'yNbE83BF8Mk', 'Gr0H0MpUbhU']

/* ---------- Articles ---------- */
const articles = blogArticles
/* ---------- Auth / CTA ---------- */
const { isLoggedIn, setUserFromApi } = useAuth()
const heroCtaTo = computed(() => '/btcusd')
const heroCtaLabel = computed(() => (isLoggedIn.value ? 'Open the Dashboard' : 'Get Started Today'))
function onHeroCtaClick() {
  // placeholder for analytics/tracking when CTA is clicked
}

const showMailingList = ref(false)
const footerEmail = ref('')
const footerSubscribeLoading = ref(false)
const footerSubscribeError = ref('')
const footerSubscribeSuccess = ref('')

/* ---------- Carousel ---------- */
const currentIndex = ref(0)
const isMobile = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
const heroPhoneScale = computed(() => {
  const width = viewportWidth.value
  if (width >= 1800) return 1.45
  if (width >= 1500) return 1.3
  if (width >= 1200) return 1.18
  if (width >= 1000) return 1.05
  return 1
})
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
function handleScroll() {
  const sections = document.querySelectorAll('.animated-section')
  sections.forEach((section, idx) => {
    const rect = section.getBoundingClientRect()
    if (!sectionInView.value[idx] && rect.top < window.innerHeight - 100) sectionInView.value[idx] = true
  })
}

/* ---------- FAQ ---------- */
const faqs = [
  { q: 'What is the loan amount?', a: 'Loans are in any $1,000 USD denomination.' },
  { q: 'Can I repay my loan early?', a: 'All loans settle at the end of the 365 day term.' },
  { q: 'Are there monthly payments?', a: 'There are no payments. All loans settle at the end of the term.' },
  { q: 'What is the Loan To Value?', a: 'Loans are 50% value loans.' },
  { q: 'How is collateral managed?', a: 'You control your private keys and funds. Cadena Bitcoin does not hold or access your private keys or seed phrase. Bitcoin is locked in smart contracts onchain.' },
  { q: 'What currency can I get my loan in?', a: 'Loans are funded in Bitcoin and settled in Bitcoin.' },
  { q: 'How long does it take to get a loan?', a: 'Minutes. Funding transactions are broadcast as soon as the contracts are signed.' },
  { q: 'Is there a credit check?', a: 'No. Your bitcoin is your credit.' },
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

/* ---------- Left stack instant-fit logic ---------- */
const leftStackRef = ref(null)
const stackScale = ref(1)
const density = ref('normal')
const NAV_OFFSET = 96
const GAP_BETWEEN = 24

if (typeof window !== 'undefined') {
  const availPre = window.innerHeight - NAV_OFFSET - GAP_BETWEEN
  density.value = availPre < 620 ? 'tiny' : availPre < 780 ? 'compact' : 'normal'
}

function rafDebounce(fn) {
  let raf = 0
  return () => {
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(fn)
  }
}

let lastMeasuredH = 0
function fitLeftStack() {
  if (!leftStackRef.value) return
  const base = baseScale || 1

  const avail = Math.max((window.innerHeight || 0) - NAV_OFFSET - GAP_BETWEEN, 160)

  const h = leftStackRef.value.offsetHeight
  lastMeasuredH = h

  const needShrink = (h * base) > avail
  const s = needShrink
    ? Math.max(0.78, Math.min(1, avail / (h * base)))
    : 1

  stackScale.value = s
}
const fitDebounced = rafDebounce(() => {
  if (!leftStackRef.value) return
  const h = leftStackRef.value.offsetHeight
  if (Math.abs(h - lastMeasuredH) > 1) fitLeftStack()
})

/* ---------- Phone preview height = EXACT rendered LEFT STACK HEIGHT ---------- */
const clampedPhoneH = ref(0)
function computeClampedPhoneH() {
  const viewportCap = Math.max((window.innerHeight || 0) - NAV_OFFSET, 360)
  const generousCap = Math.min(viewportCap * 1, viewportCap)
  const rawH = leftStackRef.value?.offsetHeight || generousCap
  const renderedH = rawH * (stackScale.value || 1) * (baseScale || 1)
  const target = Math.min(Math.max(renderedH, 320), generousCap)
  clampedPhoneH.value = Math.round(target)
}
const clampDebounced = rafDebounce(computeClampedPhoneH)
const baseScale = 1.2

const heroStackScaleAmount = computed(() => {
  const width = viewportWidth.value || 0
  if (width < 768) return 1
  const scaled = (stackScale.value || 1) * baseScale
  return Number.isFinite(scaled) ? scaled : 1
})
const heroStackOrigin = computed(() => (viewportWidth.value < 768 ? 'top center' : 'top left'))

/* ---------- Mount / Unmount ---------- */
let ro
let updateIsMobile
function handleLayoutChange() {
  fitDebounced()
  clampDebounced()
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

    // Also send to Attio CRM (fire-and-forget)
    const attioEmail = footerEmail.value
    fetch('https://hooks.attio.com/w/f2661d8b-9de8-4673-9281-3d3624c2e90b/50d3fdcf-686c-491f-b561-68badcff0cff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: attioEmail }),
    }).catch(() => {})

    footerSubscribeSuccess.value = 'Thanks! Check your inbox for Cadena updates.'
    footerEmail.value = ''
    setTimeout(() => {
      footerSubscribeSuccess.value = ''
    }, 5000)
  } catch (err) {
    const msg = err && typeof err === 'object' && 'message' in err ? err.message : null
    footerSubscribeError.value = msg || 'Could not add your email. Please try again.'
  } finally {
    footerSubscribeLoading.value = false
  }
}
onMounted(async () => {
  setUserFromApi()
  updateIsMobile = () => {
    const width = window.innerWidth
    isMobile.value = width < 640
    viewportWidth.value = width
  }
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)

  window.addEventListener('scroll', handleScroll)
  handleScroll()

  await nextTick()
  fitLeftStack()
  computeClampedPhoneH()

  ro = new ResizeObserver(() => handleLayoutChange())
  if (leftStackRef.value) ro.observe(leftStackRef.value)

  window.addEventListener('resize', handleLayoutChange)
  window.addEventListener('orientationchange', handleLayoutChange)
  window.addEventListener('focus', handleLayoutChange)

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => { handleLayoutChange() }).catch(() => {})
  }
})

onBeforeUnmount(() => {
  if (updateIsMobile) window.removeEventListener('resize', updateIsMobile)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleLayoutChange)
  window.removeEventListener('orientationchange', handleLayoutChange)
  window.removeEventListener('focus', handleLayoutChange)
  if (ro) { try { ro.disconnect() } catch {} }
})
</script>

<template>
  <!-- Page wrapper with global gradient background -->
  <div class="relative min-h-screen text-white">
    <div class="fixed inset-0 -z-10 bg-page-gradient"></div>

    <!-- Hero Section -->
    <section class="hero-shell bg-transparent text-white">
      <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4">

        <!-- Desktop: side-by-side | Mobile: stacked -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">

          <!-- Left Column: Copy + Desktop Buttons -->
          <div class="flex-1 text-center lg:text-left">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Bitcoin Native Lending
            </h1>
            <ul class="mt-4 sm:mt-6 space-y-2 text-lg sm:text-xl text-white/80 max-w-xl mx-auto lg:mx-0">
              <li class="flex items-center gap-3">
                <svg class="w-6 h-6 shrink-0 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Borrow for increased Bitcoin exposure
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-6 h-6 shrink-0 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Lend for guaranteed fiat returns
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-6 h-6 shrink-0 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                No liquidations or margin calls
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-6 h-6 shrink-0 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Full self custody
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-6 h-6 shrink-0 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Globally accessible
              </li>
            </ul>

            <!-- Desktop Buttons (hidden on mobile) -->
            <div class="hidden lg:flex gap-4 mt-8">
              <router-link
                :to="heroCtaTo"
                class="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-4 text-lg font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none whitespace-nowrap"
                @click="onHeroCtaClick"
              >
                Lend for Fix Returns
              </router-link>
              <router-link
                :to="heroCtaTo"
                class="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-4 text-lg font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none whitespace-nowrap"
                @click="onHeroCtaClick"
              >
                Borrow Bitcoin Exposure
              </router-link>
            </div>
          </div>

          <!-- Right Column: Rates Card -->
          <div class="flex justify-center lg:justify-end w-full lg:w-auto lg:flex-shrink-0">
            <HeroRatesDisplay
              :compact="isMobile"
              :link-to="heroCtaTo"
              class="w-full max-w-sm sm:max-w-md lg:max-w-none lg:w-[360px]"
            />
          </div>
        </div>

        <!-- Mobile Buttons (hidden on desktop) -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 lg:hidden">
          <router-link
            :to="heroCtaTo"
            class="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-secondary px-8 py-4 text-lg font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none whitespace-nowrap"
            @click="onHeroCtaClick"
          >
            Lend for Fixed Fiat Returns
          </router-link>
          <router-link
            :to="heroCtaTo"
            class="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-secondary px-8 py-4 text-lg font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none whitespace-nowrap"
            @click="onHeroCtaClick"
          >
            Borrow Bitcoin Exposure
          </router-link>
        </div>

        <!-- Social Proof -->
        <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-10 sm:mt-12">
          <!-- Testimonial 1 -->
          <div class="flex-1 bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-xl px-6 py-5">
            <svg class="w-6 h-6 text-secondary/60 mb-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11.3 2.6C6.1 5.1 3 9.5 3 14.3c0 3 2 5.1 4.4 5.1 2.2 0 3.9-1.7 3.9-3.8 0-2-1.5-3.6-3.4-3.8-.3 0-.5 0-.8.1.5-2.6 2.7-5.4 5.6-7l-1.4-2.3zm10 0C16 5.1 13 9.5 13 14.3c0 3 2 5.1 4.4 5.1 2.2 0 3.9-1.7 3.9-3.8 0-2-1.5-3.6-3.4-3.8-.3 0-.5 0-.8.1.5-2.6 2.7-5.4 5.6-7l-1.4-2.3z"/>
            </svg>
            <p class="text-white/80 text-sm sm:text-base leading-relaxed">
              A Bitcoin lending platform where you do not give up custody of your BTC. What a unique concept.
            </p>
            <p class="mt-3 text-sm text-white/50 font-medium">Antonio, Canada</p>
          </div>
          <!-- Testimonial 2 -->
          <div class="flex-1 bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-xl px-6 py-5">
            <svg class="w-6 h-6 text-secondary/60 mb-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11.3 2.6C6.1 5.1 3 9.5 3 14.3c0 3 2 5.1 4.4 5.1 2.2 0 3.9-1.7 3.9-3.8 0-2-1.5-3.6-3.4-3.8-.3 0-.5 0-.8.1.5-2.6 2.7-5.4 5.6-7l-1.4-2.3zm10 0C16 5.1 13 9.5 13 14.3c0 3 2 5.1 4.4 5.1 2.2 0 3.9-1.7 3.9-3.8 0-2-1.5-3.6-3.4-3.8-.3 0-.5 0-.8.1.5-2.6 2.7-5.4 5.6-7l-1.4-2.3z"/>
            </svg>
            <p class="text-white/80 text-sm sm:text-base leading-relaxed">
              I think this product is going very far.
            </p>
            <p class="mt-3 text-sm text-white/50 font-medium">Frederick, Denmark</p>
          </div>
        </div>

      </div>
    </section>

    <!-- Newsletter -->
    <section class="bg-transparent">
      <div class="max-w-screen-xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="max-w-lg mx-auto text-center">
          <h3 class="text-xl font-bold text-white mb-4">Stay Updated</h3>
          <form class="flex flex-col sm:flex-row gap-3 sm:justify-center" @submit.prevent="handleFooterSubscribe">
            <input
              v-model.trim="footerEmail"
              type="email"
              inputmode="email"
              placeholder="Enter your email"
              required
              class="flex-1 max-w-md rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
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
          <div v-if="footerSubscribeError" class="mt-2 text-sm text-red-300" aria-live="polite">
            {{ footerSubscribeError }}
          </div>
          <div v-else-if="footerSubscribeSuccess" class="mt-2 text-sm text-green-300" aria-live="polite">
            {{ footerSubscribeSuccess }}
          </div>
        </div>
      </div>
    </section>

    <!-- Partners Marquee -->
    <section class="w-full bg-transparent text-white pt-2 sm:pt-4 pb-4 px-4">
      <div class="max-w-screen-xl mx-auto text-center mb-3 px-2 sm:px-6">
        <h2 class="text-3xl md:text-4xl font-extrabold">Partners</h2>
      </div>
      <div class="marquee-container max-w-screen-xl mx-auto overflow-hidden">
        <div class="marquee-track flex items-center gap-12 sm:gap-16">
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
                class="h-12 sm:h-16 w-auto object-contain grayscale brightness-110 opacity-80 hover:grayscale-0 hover:brightness-100 hover:opacity-100 transition-all duration-200"
                loading="lazy"
                decoding="async"
              />
            </a>
          </template>
        </div>
      </div>
    </section>

    <!-- What is Cadena Bitcoin -->
    <section>
      <div class="rounded-xl bg-secondary mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div class="max-w-3xl">
              <h2 class="text-3xl sm:text-4xl md:text-[2.5rem] font-bold text-white leading-tight">
                What is Cadena Bitcoin?
              </h2>
              <p class="mt-6 text-white text-lg md:text-xl leading-relaxed">
                Cadena Bitcoin is a decentralized Bitcoin lending and borrowing marketplace. Whether you want to grow your Bitcoin holdings or generate fiat returns secured by Bitcoin, Cadena's innovative technology allows
                <span class="font-semibold underline underline-offset-4 decoration-2 decoration-white/80">users to always maintain custody of their Bitcoin.</span>
              </p>
            </div>
          </div>
          <div>
            <div class="yt">
              <iframe
                src="https://www.youtube-nocookie.com/embed/GSwoA__CH5I?rel=0&modestbranding=1&playsinline=1"
                title="What is Cadena Bitcoin?"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                loading="lazy"
                referrerpolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Articles -->
    <section class="bg-transparent text-white px-4 pt-12 pb-8 sm:px-[var(--g)] lg:px-[var(--g)] animated-section" :class="sectionInView[0] ? 'animate-in-right' : ''">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold">Featured Articles</h2>
          <p class="mt-4 text-white text-lg">Stay updated with our latest insights</p>
        </div>

        <div class="relative flex items-center justify-center">
          <button @click="scrollLeft" class="hidden sm:flex absolute left-0 z-10 bg-secondary hover:bg-secondary/80 text-white p-3 rounded-full shadow-md">◀</button>
          <div class="w-full overflow-visible sm:overflow-x-auto sm:overflow-y-visible px-2">
            <div class="article-track grid gap-6 sm:flex sm:gap-0 sm:space-x-6 transition-all duration-300 ease-in-out sm:justify-center snap-none sm:snap-x sm:snap-mandatory lg:snap-none">
              <template v-for="article in visibleArticles" :key="article.id">
                <router-link
                  v-if="article.internal"
                  :to="article.link"
                  class="flex-shrink-0 w-[280px] sm:w-[300px] bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:shadow-xl hover:ring-2 hover:ring-secondary hover:bg-white/10 hover:border-white/20 cursor-pointer snap-center"
                >
                  <picture>
                    <source type="image/avif" :srcset="`/img/${article.imageBase}-320.avif 320w, /img/${article.imageBase}-480.avif 480w, /img/${article.imageBase}-640.avif 640w`" />
                    <source type="image/webp" :srcset="`/img/${article.imageBase}-320.webp 320w, /img/${article.imageBase}-480.webp 480w, /img/${article.imageBase}-640.webp 640w`" />
                    <img
                      :src="`/img/${article.imageBase}-480.webp`"
                      :srcset="`/img/${article.imageBase}-320.webp 320w, /img/${article.imageBase}-480.webp 480w, /img/${article.imageBase}-640.webp 640w`"
                      sizes="(max-width: 640px) 280px, 300px"
                      width="300" height="192"
                      loading="lazy" decoding="async"
                      class="w-full h-48 object-cover transition-opacity duration-300 hover:opacity-90"
                      :alt="article.title"
                    />
                  </picture>
                  <div class="p-4">
                    <h3 class="text-xl font-semibold mb-2 text-white">{{ article.title }}</h3>
                    <p class="text-white/80 text-sm">{{ article.description }}</p>
                    <span class="inline-block text-white font-medium mt-3 hover:underline">Read more →</span>
                  </div>
                </router-link>

                <a
                  v-else
                  :href="article.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-shrink-0 w-[280px] sm:w-[300px] bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:shadow-xl hover:ring-2 hover:ring-secondary hover:bg-white/10 hover:border-white/20 cursor-pointer snap-center"
                >
                  <picture>
                    <source type="image/avif" :srcset="`/img/${article.imageBase}-320.avif 320w, /img/${article.imageBase}-480.avif 480w, /img/${article.imageBase}-640.avif 640w`" />
                    <source type="image/webp" :srcset="`/img/${article.imageBase}-320.webp 320w, /img/${article.imageBase}-480.webp 480w, /img/${article.imageBase}-640.webp 640w`" />
                    <img
                      :src="`/img/${article.imageBase}-480.webp`"
                      :srcset="`/img/${article.imageBase}-320.webp 320w, /img/${article.imageBase}-480.webp 480w, /img/${article.imageBase}-640.webp 640w`"
                      sizes="(max-width: 640px) 280px, 300px"
                      width="300" height="192"
                      loading="lazy" decoding="async"
                      class="w-full h-48 object-cover transition-opacity duration-300 hover:opacity-90"
                      :alt="article.title"
                    />
                  </picture>
                  <div class="p-4">
                    <h3 class="text-xl font-semibold mb-2 text-white">{{ article.title }}</h3>
                    <p class="text-white/80 text-sm">{{ article.description }}</p>
                    <span class="inline-block text-white font-medium mt-3 hover:underline">Read more →</span>
                  </div>
                </a>
                </template>
            </div>
          </div>
          <button @click="scrollRight" class="hidden sm:flex absolute right-0 z-10 bg-secondary hover:bg-secondary/80 text-white p-3 rounded-full shadow-md">▶</button>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="bg-transparent text-white px-4 pt-8 pb-20 sm:px-[var(--g)] lg:px-[var(--g)]">
      <div class="max-w-4xl mx-auto space-y-4">
        <div class="text-center">
          <h2 class="text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h2>
          <p class="mt-4 text-white text-lg">Everything you need to know about Cadena Bitcoin&apos;s loan product.</p>
        </div>

        <div class="space-y-3">
          <div v-for="(item, i) in faqs" :key="i" class="rounded-md border border-white/10 bg-dark overflow-hidden">
            <button
              class="w-full flex items-center justify-between gap-3 text-left p-4"
              @click="toggle(i)"
              :aria-expanded="isOpen(i)"
              :aria-controls="`faq-panel-${i}`"
            >
              <h3 class="text-lg font-medium">{{ item.q }}</h3>
              <svg class="size-5 shrink-0 transition-transform duration-300" :class="isOpen(i) ? '-rotate-180' : ''" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition @enter="onEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave" @leave="onLeave" @after-leave="onAfterLeave">
              <div v-show="isOpen(i)" :id="`faq-panel-${i}`" role="region" :aria-labelledby="`faq-header-${i}`" class="faq-panel">
                <div class="px-4 pt-3 pb-5 text-white/90 leading-relaxed">
                  {{ item.a }}
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="bg-secondary text-white py-12 px-6">
      <div class="max-w-4xl mx-auto text-center space-y-6">
        <h2 class="text-3xl md:text-4xl font-extrabold">
          Ready to Experience Decentralized Bitcoin Finance?
        </h2>
        <p class="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
          Whether you want to borrow against your Bitcoin or earn yield by providing liquidity, Cadena Bitcoin gives you the tools to take control — no KYC, no banks, no middlemen.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <router-link to="/btcusd" class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90">Borrow Bitcoin</router-link>
          <router-link to="/btcusd" class="inline-block rounded-full border-2 border-white text-white font-semibold px-8 py-4 text-lg transition hover:bg-white hover:text-secondary">Lend Bitcoin</router-link>
        </div>
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
/* ===== Unified horizontal rhythm for the hero ===== */
.hero-grid { --g: 24px; overflow: visible; }
@media (min-width: 1024px) { .hero-grid { --g: 32px; } }

.hero-shell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 60vh;
  padding-top: calc(var(--nav-h, 80px) + var(--info-h, 0px) + clamp(0.25rem, 1vw, 0.75rem));
  padding-bottom: clamp(1rem, 2vw, 1.5rem);
}
@media (min-width: 1024px) {
  .hero-shell {
    padding-top: calc(var(--nav-h, 80px) + var(--info-h, 0px) + clamp(0.25rem, 1vw, 1rem));
  }
}

/* ===== Background gradient ===== */
.bg-page-gradient {
  background-color: #000;
  background-image:
    radial-gradient(125% 75% at 50% 100%, rgba(103,56,228,0.58) 0%, rgba(103,56,228,0.36) 26%, rgba(103,56,228,0.16) 52%, rgba(0,0,0,0) 76%);
}
@supports (background: radial-gradient(in oklch, black, white)) {
  .bg-page-gradient {
    background-color: oklch(0 0 0);
    background-image:
      radial-gradient(in oklch 125% 75% at 50% 100%, oklch(from #6738e4 l c h / 0.60) 0%, oklch(from #6738e4 l c h / 0.36) 26%, oklch(from #6738e4 l c h / 0.16) 52%, oklch(0 0 0 / 0) 76%);
  }
}
@media (max-height: 800px) {
  .bg-page-gradient {
    background-image:
      radial-gradient(120% 60% at 50% 100%, rgba(103,56,228,0.52) 0%, rgba(103,56,228,0.30) 24%, rgba(103,56,228,0.12) 48%, rgba(103,56,228,0) 70%);
  }
}

/* Scroll-in */
.animated-section { opacity: 0; pointer-events: none; transition: opacity 1.2s cubic-bezier(.77,0,.18,1), transform 1.2s cubic-bezier(.77,0,.18,1); will-change: opacity, transform; }
.animate-in-left { opacity: 1; pointer-events: auto; transform: translateX(0); animation: slideInLeft 1.2s cubic-bezier(.77,0,.18,1); }
.animate-in-right { opacity: 1; pointer-events: auto; transform: translateX(0); animation: slideInRight 1.2s cubic-bezier(.77,0,.18,1); }
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-180px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(180px); } to { opacity: 1; transform: translateX(0); } }

/* Keep the left stack scaling crisp and anchored to top */
.scale-wrapper { width: 100%; transform-origin: top center; }

/* Enforce tabular numerals inside Rates50Mini so placeholders don't shift */
:deep(.rate) { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }

/* YouTube */
.yt { position: relative; width: 100%; aspect-ratio: 16 / 9; background: #000; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
.yt iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; display: block; }

/* FAQ */
.faq-panel { overflow: hidden; background: transparent; border: 0; }

/* Buttons — smaller */
.store-row {
  --badge-h: clamp(30px, 3.8vw, 56px);
}
.store-badge {
  height: var(--badge-h);
}
.app-store-badge {
  height: var(--badge-h);
  width: auto;
  display: block;
}
.apk-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: calc(var(--badge-h) * 0.14);
  padding-inline: calc(var(--badge-h) * 0.18);
  height: var(--badge-h);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: clamp(0.62rem, calc(var(--badge-h) * 0.22), 0.85rem);
  line-height: 1;
  border-radius: calc(var(--badge-h) * 0.26);
}
.apk-version {
  background: rgba(0,0,0,0.22);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 9999px;
  padding: 0.15rem 0.5rem;
  font-size: 0.65em;
  line-height: 1;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .store-row {
    --badge-h: clamp(34px, 5.5vw, 52px);
  }
}

.chart-base-scale { transform-origin: top left; }

@media (max-width: 1023px) {
  .hero-shell {
    padding-bottom: clamp(1.5rem, 4vw, 2.5rem);
  }
}

.marquee-container {
  mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
}
.marquee-track {
  animation: marquee-scroll 30s linear infinite;
  width: max-content;
}
.marquee-track:hover {
  animation-play-state: paused;
}
@keyframes marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation-play-state: paused; }
}

.article-track {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

@media (min-width: 640px) {
  .article-track {
    grid-template-columns: none;
  }
}
</style>
