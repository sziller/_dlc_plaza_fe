<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import TheFooter from '../../components/TheFooter.vue'
import MailingListModal from '../../components/MailingListModal.vue'
import { useAuth } from '../../composables/useAuth'
import { downloadApp } from '../../api/downloadApp'

// Store badge width sync
const appleBadgeRef = ref(null)
const apkBadgeRef = ref(null)

/* ---------- Media ---------- */
const videos = ['WfBMCMVsD1Q', 'yNbE83BF8Mk', 'Gr0H0MpUbhU']

/* ---------- Articles ---------- */
const articles = [
  { id: 1, title: 'Cadena Bitcoin – Decentralized Peer-to-Peer Bitcoin Finance', description: 'Understand what sets Cadena Bitcoin apart from other platforms.', imageBase: 'article1', link: '/article/cadena-decentralized-finance', internal: true },
  { id: 2, title: 'Cadena Bitcoin - Empowering Individual Financial Freedom', description: ' Learn how Cadena Bitcoin lets you use Bitcoin flexibly.', imageBase: 'article2', link: '/article/cadena-empowering-financial-freedom', internal: true },
  { id: 3, title: 'Cadena Bitcoin: Security', description: 'Cadena Bitcoin prioritizes self-sovereignty, decentralization, and Bitcoin\'s core security principles', imageBase: 'article3', link: '/article/cadena-bitcoin-security', internal: true },
  { id: 4, title: 'How Does it Work?', description: 'Cadena Bitcoin is a decentralized lending and borrowing product where users lock Bitcoin collateral in a DLC to facilitate loans. Here’s a breakdown of the key actions.', imageBase: 'article4', link: '/article/cadena-loan-lifecycle', internal: true },
  { id: 5, title: 'We need to talk about KYC', description: 'Identification is quietly becoming the default requirement for access to the internet.', imageBase: 'article6', link: '/article/we-need-to-talk-about-kyc', internal: true },
  { id: 6, title: 'How Cadena Bitcoin is Improving Bitcoin Borrowing and Lending', description: 'Cadena Bitcoin is redefining BTC lending by eliminating third parties and publishing all loans directly on the blockchain.', imageBase: 'article5', link: '/article/cadena-improving-btc', internal: true },
]
/* ---------- Auth / CTA ---------- */
const { isLoggedIn, setUserFromApi } = useAuth()
const heroCtaTo = computed(() => (isLoggedIn.value ? '/btcusd' : '/register'))
const heroCtaLabel = computed(() => (isLoggedIn.value ? 'Open the Dashboard' : 'Get Started Today'))
function onHeroCtaClick() {
  // placeholder for analytics/tracking when CTA is clicked
}

const showMailingList = ref(false)

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
  { q: 'What is the loan amount?', a: 'Loans are standard 0.1 Bitcoin.' },
  { q: 'Can I repay my loan early?', a: 'All loans settle at the end of the term (30 days, 90 days, 180 days or 1 year).' },
  { q: 'Are there monthly payments?', a: 'There are no payments. All loans settle at the end of the term.' },
  { q: 'What is the Loan To Value?', a: 'We offer 50% and 80% loan to value loans.' },
  { q: 'How is collateral managed?', a: 'Cadena Bitcoin prioritizes self-sovereignty, decentralization, and Bitcoin\'s core security principle: Your Keys, Your Coins. You control your private keys and funds. Cadena Bitcoin does not hold or access your private keys or seed phrase.' },
  { q: 'What currency can I get my loan in?', a: 'Loans are funded in Bitcoin and settled in Bitcoin.' },
  { q: 'How do I get a Bitcoin-backed loan?', a: 'Register online and download the signer app.' },
  { q: 'How long does it take to get a loan?', a: 'Minutes. Funding transactions are broadcast as soon as both peers sign the contract.' },
  { q: 'Is there a credit check?', a: 'No. Your bitcoin is your credit.' },
]
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
  syncStoreBadgeWidth()
}

function syncStoreBadgeWidth() {
  try {
    const el = appleBadgeRef?.value
    const apk = apkBadgeRef?.value
    if (!el || !apk) return
    const w = el.getBoundingClientRect().width
    if (w > 0) apk.style.width = w + 'px'
  } catch (_) {}
}
async function onDownloadApkClick() {
  try {
    await downloadApp()
  } catch (err) {
    console.error('APK download failed', err)
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

  try {
    if (appleBadgeRef?.value) {
      const ob = new ResizeObserver(syncStoreBadgeWidth)
      ob.observe(appleBadgeRef.value)
      window.__badgeRO = ob
    }
  } catch (_) {}
  syncStoreBadgeWidth()

  window.addEventListener('resize', handleLayoutChange)
  window.addEventListener('orientationchange', handleLayoutChange)
  window.addEventListener('focus', handleLayoutChange)

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => { handleLayoutChange(); syncStoreBadgeWidth(); }).catch(() => {})
  }
})

onBeforeUnmount(() => {
  if (updateIsMobile) window.removeEventListener('resize', updateIsMobile)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleLayoutChange)
  window.removeEventListener('orientationchange', handleLayoutChange)
  window.removeEventListener('focus', handleLayoutChange)
  if (ro) { try { ro.disconnect() } catch {} }
  try { window.__badgeRO?.disconnect?.(); delete window.__badgeRO } catch (_) {}
})
</script>

<template>
  <!-- Page wrapper with global gradient background -->
  <div class="relative min-h-screen text-white">
    <div class="fixed inset-0 -z-10 bg-page-gradient"></div>

    <!-- Simplified Hero Section -->
    <section class="hero-shell bg-transparent text-white">
      <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div
          ref="heroRef"
          class="hero-grid sm:grid sm:grid-cols-12 items-center gap-[var(--g)] pt-[0px]"
        >
          <!-- Left: Simplified copy + CTA (tablet: full width, centered) -->
          <div
            class="
              sm:col-span-5 lg:col-span-6
              min-[640px]:max-[900px]:col-span-12
              flex p-0 sm:items-start
              min-[640px]:max-[900px]:justify-center
              lg:-mt-20 xl:-mt-28
            "
          >
            <div
              class="
                w-full max-w-none flex flex-col gap-5 sm:gap-6 scale-wrapper chart-base-scale
                text-center sm:text-left
                min-[640px]:max-[900px]:items-center  min-[640px]:max-[900px]:text-center
              "
              ref="leftStackRef"
              :style="{
                transform: heroStackScaleAmount === 1 ? 'none' : `scale(${heroStackScaleAmount.toFixed(3)})`,
                transformOrigin: heroStackOrigin
              }"
            >
              <!-- Simplified Hero Content -->
              <div class="space-y-4 sm:space-y-6">
                <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                  Access Dollars Instantly<br />Without Selling Your Bitcoin
                </h1>
                <p class="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl">
                  Securely borrow dollars using your bitcoin as collateral—save in bitcoin, spend in dollars, and move money globally.
                </p>
              </div>

              <!-- Primary CTA -->
              <div class="flex flex-col sm:flex-row gap-4 items-center sm:items-start w-full">
                <router-link
                  :to="heroCtaTo"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-secondary px-8 py-4 text-lg font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none whitespace-nowrap"
                  @click="onHeroCtaClick"
                >
                  {{ heroCtaLabel }}
                </router-link>
              </div>

              <!-- Lender link -->
              <p class="text-white/70 text-sm pt-2">
                Looking to lend?
                <router-link to="/register" class="text-secondary hover:underline font-medium">
                  Click here
                </router-link>
              </p>
              <p class="text-white/70 text-sm">
                Want email updates?
                <button
                  type="button"
                  class="text-secondary underline font-medium hover:text-secondary/80"
                  @click="showMailingList = true"
                >
                  Join our mailing list
                </button>
              </p>

              <!-- Store buttons: show on phone + tablet (<901px), hide on desktop -->
              <div class="mt-6 flex items-center justify-center gap-3 sm:gap-4 min-[901px]:hidden store-row">
                <a
                  href="https://apps.apple.com/app/cadena-bitcoin/id6753348211?itscg=30200&itsct=apps_box_badge&mttnsubad=6753348211"
                  target="_blank" rel="noopener" aria-label="Download on the App Store"
                  class="inline-block" style="line-height:0"
                >
                  <img
                    src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1760227200"
                    alt="Download on the App Store"
                    width="240" height="80"
                    class="app-store-badge store-badge"
                    decoding="async" loading="lazy"
                  />
                </a>

                <button
                  type="button"
                  class="apk-badge store-badge"
                  aria-label="Download Android APK v101"
                  @click="onDownloadApkClick"
                >
                  <span class="apk-version">v101</span>
                  Download APK
                </button>
              </div>
              <!-- /Store buttons -->
            </div>
          </div>

          <!-- Right: Phone column -->
          <div
            class="
              sm:col-span-7 lg:col-span-6
              hidden sm:flex
              min-[640px]:max-[900px]:hidden
              p-0 hero-right
              lg:-mt-6 xl:-mt-10
            "
          >
            <div class="flex items-start justify-end w-full">
              <div class="flex flex-col items-center ml-auto">
                <router-link to="/signerapp" class="group block cursor-pointer select-none" aria-label="Open Signer App page">
                  <picture class="block">
                    <source type="image/avif" :srcset="`
                      /img/File-portrait-640.avif 640w,
                      /img/File-portrait-960.avif 960w,
                      /img/File-portrait-1280.avif 1280w
                    `" />
                    <source type="image/webp" :srcset="`
                      /img/File-portrait-640.webp 640w,
                      /img/File-portrait-960.webp 960w,
                      /img/File-portrait-1280.webp 1280w
                    `" />
                    <img
                      src="/img/File-portrait-960.webp"
                      :srcset="`
                        /img/File-portrait-640.webp 640w,
                        /img/File-portrait-960.webp 960w,
                        /img/File-portrait-1280.webp 1280w
                      `"
                      :style="{
                        maxHeight: ((clampedPhoneH - 100) * heroPhoneScale) + 'px',
                        height: ((clampedPhoneH - 60) * heroPhoneScale) + 'px',
                        width: Math.round(((clampedPhoneH - 60) * 0.46) * heroPhoneScale) + 'px'
                      }"
                      width="420" height="840"
                      fetchpriority="high" loading="eager" decoding="async"
                      class="block object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      alt="Cadena Signer App preview"
                      draggable="false"
                    />
                  </picture>
                </router-link>

                <!-- Desktop-only store buttons (≥901px) under phone -->
                <div class="mt-8 hidden min-[901px]:flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full store-row">
                  <a
                    href="https://apps.apple.com/app/cadena-bitcoin/id6753348211?itscg=30200&itsct=apps_box_badge&mttnsubad=6753348211"
                    target="_blank" rel="noopener" aria-label="Download on the App Store"
                    class="inline-block" style="line-height:0"
                  >
                    <img
                      src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1760227200"
                      alt="Download on the App Store"
                      width="240" height="80"
                      class="app-store-badge store-badge" ref="appleBadgeRef" decoding="async" loading="lazy"
                    />
                  </a>

                  <button
                    type="button"
                    class="apk-badge store-badge"
                    ref="apkBadgeRef"
                    aria-label="Download Android APK v101"
                    @click="onDownloadApkClick"
                  >
                    <span class="apk-version">v101</span>
                    Download APK
                  </button>
                </div>
                <!-- /Desktop-only store buttons -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 21Rates Graphic -->
    <section class="partners-section w-full bg-transparent text-white pt-6 pb-4 px-4 sm:px-[var(--g)] lg:px-[var(--g)]">
      <div class="max-w-screen-xl mx-auto text-center mb-6 px-2 sm:px-6">
        <h2 class="text-3xl md:text-4xl font-extrabold">Partners</h2>
      </div>
      <div class="partner-grid max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10 sm:gap-y-12 items-center px-2 sm:px-6">
        <a
          href="https://21rates.com/companies/1067/cadena-bitcoin"
          target="_blank"
          rel="noopener"
          class="block press-logo"
          aria-label="View Cadena Bitcoin on 21Rates"
        >
          <picture class="press-figure press-figure--medium">
            <source
              type="image/avif"
              srcset="
                /img/21rates-640.avif 640w,
                /img/21rates-960.avif 960w
              "
              sizes="(max-width: 640px) 70vw, 320px"
            />
            <source
              type="image/webp"
              srcset="
                /img/21rates-640.webp 640w,
                /img/21rates-960.webp 960w
              "
              sizes="(max-width: 640px) 70vw, 480px"
            />
            <img
              src="/img/21rates-640.webp"
              alt="21Rates"
              class="w-auto h-full object-contain"
              loading="lazy"
              decoding="async"
              width="402"
              height="82"
            />
          </picture>
        </a>
        <a
          href="https://sv25.adoptingbitcoin.org/"
          target="_blank"
          rel="noopener"
          class="block press-logo"
          aria-label="View Cadena Bitcoin on Adopting Bitcoin"
        >
          <picture class="press-figure press-figure--tall">
            <source
              type="image/avif"
              srcset="
                /img/adopting-640.avif 640w,
                /img/adopting-960.avif 960w
              "
              sizes="(max-width: 640px) 70vw, 320px"
            />
            <source
              type="image/webp"
              srcset="
                /img/adopting-640.webp 640w,
                /img/adopting-960.webp 960w
              "
              sizes="(max-width: 640px) 70vw, 320px"
            />
            <img
              src="/img/adopting-640.webp"
              alt="Adopting Bitcoin"
              class="w-auto h-full object-contain"
              loading="lazy"
              decoding="async"
              width="1048"
              height="330"
            />
          </picture>
        </a>
        <a
          href="https://surfdojo.org/"
          target="_blank"
          rel="noopener"
          class="block press-logo"
          aria-label="Visit Surfdojo"
        >
          <picture class="press-figure press-figure--medium">
            <source
              type="image/avif"
              srcset="
                /img/surfdojo-640.avif 640w,
                /img/surfdojo-960.avif 960w
              "
              sizes="(max-width: 640px) 70vw, 320px"
            />
            <source
              type="image/webp"
              srcset="
                /img/surfdojo-640.webp 640w,
                /img/surfdojo-960.webp 960w
              "
              sizes="(max-width: 640px) 70vw, 320px"
            />
            <img
              src="/img/surfdojo-640.webp"
              alt="Surfdojo"
              class="w-auto h-full object-contain"
              loading="lazy"
              decoding="async"
              width="558"
              height="149"
            />
          </picture>
        </a>
        <a
          href="https://bitcointreasuries.net/directory#C"
          target="_blank"
          rel="noopener"
          class="block press-logo"
          aria-label="View Cadena Bitcoin on Bitcoin Treasuries"
        >
          <picture class="press-figure press-figure--short">
            <source
              type="image/avif"
              srcset="
                /img/treasuries-640.avif 640w,
                /img/treasuries-960.avif 960w
              "
              sizes="(max-width: 640px) 70vw, 320px"
            />
            <source
              type="image/webp"
              srcset="
                /img/treasuries-640.webp 640w,
                /img/treasuries-960.webp 960w
              "
              sizes="(max-width: 640px) 70vw, 320px"
            />
            <img
              src="/img/treasuries-640.webp"
              alt="Bitcoin Treasuries"
              class="w-auto h-full object-contain"
              loading="lazy"
              decoding="async"
              width="509"
              height="53"
            />
          </picture>
        </a>
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
    <section class="bg-transparent text-white px-4 pt-20 pb-8 sm:px-[var(--g)] lg:px-[var(--g)] animated-section" :class="sectionInView[0] ? 'animate-in-right' : ''">
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
          <router-link :to="isLoggedIn ? '/btcusd' : '/register'" class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90">Borrow Bitcoin</router-link>
          <router-link :to="isLoggedIn ? '/btcusd' : '/register'" class="inline-block rounded-full border-2 border-white text-white font-semibold px-8 py-4 text-lg transition hover:bg-white hover:text-secondary">Lend Bitcoin</router-link>
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
  padding-top: clamp(1rem, 5vw, 3.75rem);
}
@media (min-width: 1024px) {
  .hero-shell {
    padding-top: clamp(2rem, 4vw, 4.5rem);
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
    padding-bottom: clamp(4rem, 12vw, 6.5rem);
  }
}

.partners-section {
  margin-top: 1rem;
}
.partner-grid {
  width: 100%;
}

.press-logo {
  text-align: center;
}
.press-figure {
  --logo-h: clamp(50px, 14vw, 96px);
  height: var(--logo-h);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 0 auto;
  filter: grayscale(1) brightness(1.1);
  opacity: 0.78;
  transition: filter 180ms ease, opacity 180ms ease;
}
.press-figure--medium { --logo-h: clamp(62px, 18vw, 130px); }
.press-figure--tall { --logo-h: clamp(100px, 26vw, 220px); }
.press-figure--short { --logo-h: clamp(42px, 10vw, 74px); }
.press-logo:hover .press-figure,
.press-logo:focus-visible .press-figure {
  filter: grayscale(0) brightness(1);
  opacity: 1;
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
