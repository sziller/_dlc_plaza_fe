<script setup>
import { ref, computed, onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'
import { useAuth } from '../composables/useAuth'
import { postContactEmail, isValidEmail } from '../api/publicContact'
const videos = [
  'Psuh8mml91o',
  'D7HDDxh0Wjo',
  'l_cy-tWM_lA',
]

const articles = [
  {
    id: 1,
    title: 'Cadena Bitcoin – Decentralized Peer-to-Peer Bitcoin Finance',
    description: 'Understand what sets Cadena Bitcoin apart from other platforms.',
    imageBase: 'article1',
    link: '/article/cadena-vs-others',
    internal: true,
  },
  {
    id: 2,
    title: 'Cadena Bitcoin - Empowering Individual Financial Freedom',
    description: ' Learn how Cadena Bitcoin lets you use Bitcoin flexibly.',
    imageBase: 'article2',
    link: '/article/cadena-empowering-financial-freedom',
    internal: true,
  },
  {
    id: 3,
    title: 'Cadena Bitcoin: Security',
    description: 'Cadena Bitcoin prioritizes self-sovereignty, decentralization, and Bitcoin\'s core security principles',
    imageBase: 'article3',
    link: '/article/cadena-loan-lifecycle',
    internal: true,
  },
  {
    id: 4,
    title: 'How Does it Work?',
    description: 'Cadena Bitcoin is a decentralized lending and borrowing product where users lock Bitcoin collateral in a DLC to facilitate loans. Here’s a breakdown of the key actions.',
    imageBase: 'article4',
    link: '/article/cadena-bitcoin-security',
    internal: true,
  },
  {
    id: 5,
    title: 'We need to talk about KYC',
    description: 'Identification is quietly becoming the default requirement for access to the internet.',
    imageBase: 'article6',
    link: '/article/we-need-to-talk-about-kyc',
    internal: true,
  },
  {
    id: 6,
    title: 'How Cadena Bitcoin is Improving Bitcoin Borrowing and Lending',
    description: 'Cadena Bitcoin is redefining BTC lending by eliminating third parties and publishing all loans directly on the blockchain.',
    imageBase: 'article5',
    link: '/article/cadena-improving-btc',
    internal: true,
  },
]

const { isLoggedIn, setUserFromApi } = useAuth()
const currentIndex = ref(0)
const isMobile = ref(false)
const ctaEmail = ref('')
const sectionInView = ref([false, false, false])

function handleScroll() {
  const sections = document.querySelectorAll('.animated-section')
  sections.forEach((section, idx) => {
    const rect = section.getBoundingClientRect()
    if (!sectionInView.value[idx] && rect.top < window.innerHeight - 100) {
      sectionInView.value[idx] = true
    }
  })
}
async function onHeroCtaClick() {
  if (!isLoggedIn.value && isValidEmail(ctaEmail.value)) {
    postContactEmail(ctaEmail.value) // fire-and-forget
  }
}
onMounted(() => {
  setUserFromApi()
  const updateIsMobile = () => { isMobile.value = window.innerWidth < 640 }
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

const visibleArticles = computed(() => {
  if (isMobile.value) return articles
  const result = []
  const len = articles.length
  for (let i = 0; i < 3; i++) result.push(articles[(currentIndex.value + i) % len])
  return result
})

function scrollLeft() {
  if (isMobile.value) return
  const len = articles.length
  currentIndex.value = (currentIndex.value - 1 + len) % len
}

function scrollRight() {
  if (isMobile.value) return
  const len = articles.length
  currentIndex.value = (currentIndex.value + 1) % len
}

const heroCtaTo = computed(() =>
  isLoggedIn.value
    ? '/btcusd'
    : (ctaEmail.value ? `/register?email=${encodeURIComponent(ctaEmail.value)}` : '/register')
)

const heroCtaLabel = computed(() =>
  isLoggedIn.value ? 'Open the Dashboard' : 'Get Started Today'
)

/* ---- Smooth FAQ (always animates open/close) ---- */
const faqs = [
  { q: 'What is the loan amount?', a: 'Loans are standard 0.1 Bitcoin.' },
  { q: 'Can I repay my loan early?', a: 'All loans settle at the end of the term (30 days, 90 days, 180 days or 1 year).' },
  { q: 'Are there monthly payments?', a: 'There are no payments. All loans settle at the end of the term.' },
  { q: 'What is the Loan To Value?', a: 'We offer 50% and 80% loan to value loans.' },
  { q: 'How is collateral managed?', a: 'Cadena Bitcoin prioritizes self-sovereignty, decentralization, and Bitcoin’s core security principle: Your Keys, Your Coins. You control your private keys and funds. Cadena Bitcoin does not hold or access your private keys or seed phrase.' },
  { q: 'What currency can I get my loan in?', a: 'Loans are funded in Bitcoin and settled in Bitcoin.' },
  { q: 'How do I get a Bitcoin-backed loan?', a: 'Register online and download the signer app.' },
  { q: 'How long does it take to get a loan?', a: 'Minutes. Funding transactions are broadcast as soon as both peers sign the contract.' },
  { q: 'Is there a credit check?', a: 'No. Your bitcoin is your credit.' },
]

// allow multiple open; use a Set of indexes
const openSet = ref(new Set([0]))

function isOpen(i) { return openSet.value.has(i) }
function toggle(i) {
  const s = new Set(openSet.value)
  if (s.has(i)) s.delete(i); else s.add(i)
  openSet.value = s
}


// Transition hooks for reliable height animation
function onEnter(el) {
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.willChange = 'height, opacity'
  // force reflow
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
  el.style.willChange = 'height, opacity'
  // force reflow
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

<template>
  <!-- Page wrapper with global gradient background -->
  <div class="relative min-h-screen mt-0 text-white">
    <!-- Full-page gradient layer (moved to CSS class) -->
    <div class="fixed inset-0 -z-10 bg-page-gradient"></div>

    <!-- Hero Section (no animation) -->
    <section class="overflow-hidden bg-transparent text-white sm:grid sm:grid-cols-2 pt-1">
      <!-- Left: Text -->
      <div class="flex items-center justify-center p-10 md:p-12 lg:px-20 lg:py-24">
        <div class="w-full max-w-2xl text-center sm:text-left">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
            Unlock your Bitcoin's potential.
          </h2>
          <p class="mt-6 text-white text-xl md:text-xl leading-relaxed">
            Access loans without selling your Bitcoin or earn yield secured by 
            Bitcoin.  Better rates, your keys, no sidechains.
          </p>
          <!-- Longer email input field with smaller button below -->
<div class="mt-8 flex flex-col items-center gap-4 w-full">
  <input
    v-if="!isLoggedIn"
    v-model="ctaEmail"
    type="email"
    placeholder="Enter your email address"
    class="w-full px-6 py-4 rounded-full text-black bg-white focus:outline-none focus:ring-2 focus:ring-secondary text-lg"
  />
  <router-link
    :to="heroCtaTo"
    class="inline-block rounded-full bg-secondary px-8 py-4 text-base md:text-lg font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none mt-2 w-auto min-w-[180px] max-w-[300px]"
    @click="onHeroCtaClick"
  >
    {{ heroCtaLabel }}
  </router-link>
</div>

        </div>
      </div>

      <!-- Right: iPhone mockup (hover-grow + link to /signerapp) -->
      <div class="relative hidden sm:flex flex-col justify-center items-center bg-transparent px-6 py-14 z-10 phone-col">
        <div class="[perspective:1100px]">
          <div class="transform-gpu translate-y-6 md:translate-y-8 lg:translate-y-10">
            <router-link to="/signerapp" class="group block cursor-pointer select-none" aria-label="Open Signer App page">
              <picture>
                <source type="image/avif" srcset="/img/iPhoneSC-640.avif 640w, /img/iPhoneSC-960.avif 960w" />
                <source type="image/webp" srcset="/img/iPhoneSC-640.webp 640w, /img/iPhoneSC-960.webp 960w" />
                <img
                  src="/img/iPhoneSC-960.webp"
                  srcset="/img/iPhoneSC-640.webp 640w, /img/iPhoneSC-960.webp 960w"
                  sizes="(max-width: 768px) 300px, (max-width: 1024px) 360px, 420px"
                  width="420" height="840"
                  fetchpriority="high" loading="eager" decoding="async"
                  class="block w-[300px] md:w-[360px] lg:w-[420px] h-auto transform transition-transform duration-300 group-hover:scale-105 will-change-transform"
                  alt="App preview on iPhone" draggable="false"
                />
              </picture>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Satoshi Quote (animate in from left) -->
    <section
      class="w-full bg-transparent text-white py-12 px-6 sm:px-8 lg:px-12 text-center animated-section"
      :class="sectionInView[0] ? 'animate-in-left' : ''"
    >
      <blockquote class="text-2xl md:text-3xl font-semibold leading-tight max-w-5xl mx-auto">
        “The main benefits are lost if a trusted third party is still required.”
      </blockquote>
      <cite class="block mt-4 text-white text-lg">— Satoshi Nakamoto</cite>
    </section>

    <!-- What is Cadena Bitcoin (no animation) -->
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
                <span class="font-semibold underline underline-offset-4 decoration-2 decoration-white/80">users to always maintain custody of their Bitcoin</span>
              </p>
            </div>
          </div>
          <div>
            <div class="yt">
              <iframe
                src="https://www.youtube-nocookie.com/embed/0v_okPUvHvQ?rel=0&modestbranding=1&playsinline=1"
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

    <!-- Featured Articles (animate in from right) -->
    <section
      class="bg-transparent text-white px-4 pt-20 pb-8 sm:px-6 lg:px-8 animated-section"
      :class="sectionInView[1] ? 'animate-in-right' : ''"
    >
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold">Featured Articles</h2>
          <p class="mt-4 text-white text-lg">Stay updated with our latest insights</p>
        </div>

        <div class="relative flex items-center justify-center">
          <!-- Left Arrow (hidden on mobile) -->
          <button
            @click="scrollLeft"
            class="hidden sm:flex absolute left-0 z-10 bg-secondary hover:bg-secondary/80 text-white p-3 rounded-full shadow-md"
          >
            ◀
          </button>

          <!-- Carousel Scroll Wrapper (NO max-w limit here!) -->
          <div class="w-full overflow-x-auto sm:overflow-visible px-2">
            <div class="flex space-x-6 transition-all duration-300 ease-in-out sm:justify-center snap-x snap-mandatory sm:snap-none">
              <template v-for="article in visibleArticles" :key="article.id">
                <!-- internal -->
                <router-link
                  v-if="article.internal"
                  :to="article.link"
                  class="flex-shrink-0 w-[280px] sm:w-[300px] bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:shadow-xl hover:ring-2 hover:ring-secondary hover:bg-white/10 hover:border-white/20 hover:shadow-lg cursor-pointer snap-center"
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

                <!-- external -->
                <a
                  v-else
                  :href="article.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-shrink-0 w-[280px] sm:w-[300px] bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:shadow-xl hover:ring-2 hover:ring-secondary hover:bg-white/10 hover:border-white/20 hover:shadow-lg cursor-pointer snap-center"
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

          <!-- Right Arrow (hidden on mobile) -->
          <button
            @click="scrollRight"
            class="hidden sm:flex absolute right-0 z-10 bg-secondary hover:bg-secondary/80 text-white p-3 rounded-full shadow-md"
          >
            ▶
          </button>
        </div>
      </div>
    </section>

    <!-- Latest Videos -->
    <section class="bg-transparent text-white pt-8 pb-8 px-6 animated-section" :class="sectionInView[2] ? 'animate-in-left' : ''">
      <div class="max-w-6xl mx-auto space-y-12">
        <div class="text-center space-y-4">
          <h2 class="text-3xl md:text-4xl font-extrabold">Latest Videos</h2>
          <p class="text-white text-lg max-w-2xl mx-auto">
            Explore our latest updates, tutorials, and overviews about Cadena Bitcoin and our protocol innovations.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="id in videos" :key="id" class="yt">
            <iframe
              :src="`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ (smooth transitions always) -->
    <section class="bg-transparent text-white px-4 pt-8 pb-20 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-4">
        <div class="text-center">
          <h2 class="text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h2>
          <p class="mt-4 text-white text-lg">
            Everything you need to know about Cadena Bitcoin’s loan product.
          </p>
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
              <svg
                class="size-5 shrink-0 transition-transform duration-300"
                :class="isOpen(i) ? '-rotate-180' : ''"
                xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
>
  <div
    v-show="isOpen(i)"
    :id="`faq-panel-${i}`"
    role="region"
    :aria-labelledby="`faq-header-${i}`"
    class="faq-panel"
  >
    <!-- just spacing and text, no box look -->
    <div class="px-4 pt-3 pb-5 text-white/90 leading-relaxed">
      {{ item.a }}
    </div>
  </div>
</transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section (no animation for footer) -->
    <section class="bg-secondary text-white py-12 px-6">
      <div class="max-w-4xl mx-auto text-center space-y-6">
        <h2 class="text-3xl md:text-4xl font-extrabold">
          Ready to Experience Decentralized Bitcoin Finance?
        </h2>
        <p class="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
          Whether you want to borrow against your Bitcoin or earn yield by providing liquidity, Cadena Bitcoin gives you the tools to take control — no KYC, no banks, no middlemen.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <router-link
            :to="isLoggedIn ? '/btcusd' : '/register'"
            class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90"
          >
            Borrow Bitcoin
          </router-link>

          <router-link
            :to="isLoggedIn ? '/btcusd' : '/register'"
            class="inline-block rounded-full border-2 border-white text-white font-semibold px-8 py-4 text-lg transition hover:bg-white hover:text-secondary"
          >
            Lend Bitcoin
          </router-link>
        </div>
      </div>
    </section>
  </div>

  <TheFooter />
</template>

<style scoped>
/* ===== No inline styles; CSP-friendly ===== */

/* Page gradient moved from style= to a class */
.bg-page-gradient{
  background-color: #000; /* solid black base */
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

/* Keep the glow lower on short screens */
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

/* Soft glow behind the phone */
.phone-col::before{
  content:"";
  position:absolute; inset:0; margin:auto;
  width:560px; height:560px; border-radius:9999px;
  filter:blur(80px); opacity:.85;
  background: radial-gradient(55% 55% at 50% 50%,
    rgba(103,56,228,.70) 0%,
    rgba(103,56,228,.40) 35%,
    rgba(53,21,122,.30) 60%,
    rgba(0,0,0,0) 75%);
  pointer-events:none;
}
@media (min-width:1024px){ .phone-col::before{ width:680px; height:680px; } }

/* Animation classes for scroll-ins */
.animated-section {
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 1.2s cubic-bezier(.77,0,.18,1),
    transform 1.2s cubic-bezier(.77,0,.18,1);
  will-change: opacity, transform;
}
.animate-in-left {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
  animation: slideInLeft 1.2s cubic-bezier(.77,0,.18,1);
}
.animate-in-right {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
  animation: slideInRight 1.2s cubic-bezier(.77,0,.18,1);
}
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-180px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(180px); } to { opacity: 1; transform: translateX(0); } }

/* Hide scrollbar if needed */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.scale-wrapper { width: 100%; transform-origin: top center; }
@media (max-width: 640px) {
  .scale-wrapper { transform: scale(calc(100vw / 640)); }
}

/* Fix for top cut-off: add top padding to main container, not body */
section.bg-primary { padding-top: 5.5rem !important; }

/* YouTube container */
.yt{
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
}
.yt iframe{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

/* FAQ panel default styles (Vue transition drives height) */
.faq-panel{
  overflow: hidden;
  will-change: height, opacity;
  /* no background, no border — looks like before */
  background: transparent;
  border: 0;
}

/* Summary hover polish */
button[aria-expanded]{
  transition: background-color 200ms ease, border-color 200ms ease;
}
button[aria-expanded]:hover{
  background-color: color-mix(in oklch, #0b0b0b 92%, #ffffff 8%);
}
</style>
