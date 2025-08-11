<script setup>
import { ref, computed, onMounted } from 'vue'
import LiveRatesImac from '../components/LiveRatesImac.vue'
import TheFooter from '../components/TheFooter.vue'
import article1Img from '../assets/images/article1.png'
import article2Img from '../assets/images/article2.png'
import article3Img from '../assets/images/article3.png'
import article4Img from '../assets/images/article4.png'
import article5Img from '../assets/images/article5.png'
import article6Img from '../assets/images/article6.png'
const videos = [
  'https://www.youtube.com/embed/SsBfTfVnjGc?si=GrrW6LD5ffZQI2kZ&rel=0&modestbranding=1&iv_load_policy=3',
  'https://www.youtube.com/embed/D7HDDxh0Wjo?si=yevbggjIbKbycl1u&rel=0&modestbranding=1&iv_load_policy=3',
  'https://www.youtube.com/embed/l_cy-tWM_lA?si=wDY0PSdvfX_ePYLW&rel=0&modestbranding=1&iv_load_policy=3',
]

const articles = [
  {
    id: 1,
    title: 'Cadena Bitcoin – Decentralized Peer-to-Peer Bitcoin Finance',
    description: 'Understand what sets Cadena Bitcoin apart from other platforms.',
    image: article1Img,
    link: '/article/cadena-vs-others',
    internal: true,
  },
  {
    id: 2,
    title: 'Cadena Bitcoin - Empowering Individual Financial Freedom',
    description: ' Learn how Cadena Bitcoin lets you use Bitcoin flexibly.',
    image: article2Img,
    link: '/article/cadena-empowering-financial-freedom',
    internal: true,
  },
  {
    id: 3,
    title: 'Cadena Bitcoin: Security',
    description: 'Cadena Bitcoin prioritizes self-sovereignty, decentralization, and Bitcoin\'s core security principles',
    image: article3Img,
    link: '/article/cadena-loan-lifecycle',
    internal: true,
  },
  {
    id: 4,
    title: 'How Does it Work?',
    description: 'Cadena Bitcoin is a decentralized lending and borrowing product where users lock Bitcoin collateral in a DLC to facilitate loans. Here’s a breakdown of the key actions.',
    image: article4Img,
    link: '/article/cadena-bitcoin-security',
    internal: true,
  },
  {
    id: 5,
    title: 'We need to talk about KYC',
    description: 'Identification is quietly becoming the default requirement for access to the internet.',
    image: article6Img,
    link: '/article/we-need-to-talk-about-kyc',
    internal: true,
  },
  {
    id: 6,
    title: 'How Cadena Bitcoin is Improving Bitcoin Borrowing and Lending',
    description: 'Cadena Bitcoin is redefining BTC lending by eliminating third parties and publishing all loans directly on the blockchain.',
    image: article5Img,
    link: '/article/cadena-improving-btc',
    internal: true,
  },
]

const currentIndex = ref(0)
const isMobile = ref(false)
const ctaEmail = ref('')

// Animation state for each section
const sectionInView = ref([false, false, false])

function handleScroll() {
  const sections = document.querySelectorAll('.animated-section')
  sections.forEach((section, idx) => {
    const rect = section.getBoundingClientRect()
    // Only animate in when scrolling down and section enters viewport
    if (!sectionInView.value[idx] && rect.top < window.innerHeight - 100) {
      sectionInView.value[idx] = true
    }
  })
}

onMounted(() => {
  const updateIsMobile = () => {
    isMobile.value = window.innerWidth < 640
  }
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  window.addEventListener('scroll', handleScroll)
  // Initial check
  handleScroll()
})

const visibleArticles = computed(() => {
  if (isMobile.value) {
    // Show all articles on mobile
    return articles
  } else {
    // Show rotating 3 on desktop
    const result = []
    const len = articles.length
    for (let i = 0; i < 3; i++) {
      result.push(articles[(currentIndex.value + i) % len])
    }
    return result
  }
})

function scrollLeft() {
  if (isMobile.value) return // Disable arrow click on mobile
  const len = articles.length
  currentIndex.value = (currentIndex.value - 1 + len) % len
}

function scrollRight() {
  if (isMobile.value) return // Disable arrow click on mobile
  const len = articles.length
  currentIndex.value = (currentIndex.value + 1) % len
}
</script>

<template>
   <!-- Page wrapper with global gradient background -->
  <div class="relative min-h-screen text-white">
    <!-- Full-page gradient layer -->
    <div class="fixed inset-0 -z-10 bg-gradient-to-b from-primary via-primary to-secondary"></div>

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
          Bitcoin.  Free Markets =  Better Rates. 
        </p>
        <!-- Longer email input field with smaller button below -->
        <div class="mt-8 flex flex-col items-center gap-4 w-full">
          <input
            v-model="ctaEmail"
            type="email"
            placeholder="Enter your email address"
            class="w-full px-6 py-4 rounded-full text-black bg-white focus:outline-none focus:ring-2 focus:ring-secondary text-lg"
          />
          <router-link
            :to="ctaEmail ? `/register?email=${encodeURIComponent(ctaEmail)}` : '/register'"
            class="inline-block rounded-full bg-secondary px-8 py-4 text-base md:text-lg font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none mt-2"
            style="width: auto; min-width: 180px; max-width: 300px;"
          >
            Get Started Today
          </router-link>
        </div>
      </div>
    </div>

    <!-- Right: iMac + Badge -->
    <div class="relative hidden sm:flex flex-col justify-center items-center bg-transparent px-6 py-24 z-10">
      <!-- Increased py-24 for more top/bottom space -->
      <LiveRatesImac class="block pb-0 py-0" />
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
    <cite class="block mt-4 text-secondary text-lg">— Satoshi Nakamoto</cite>
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
              Cadena Bitcoin is a decentralized Bitcoin lending and borrowing marketplace. 
              Whether you want to grow your Bitcoin holdings or generate fiat returns secured by Bitcoin, Cadena's innovative technology 
              allows <span class="font-semibold underline underline-offset-4 decoration-2 decoration-white/80">users to always maintain custody of their Bitcoin</span>
            </p>
          </div>
        </div>
        <div>
          <div class="rounded overflow-hidden aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/0v_okPUvHvQ?si=JnqpZ5rSgdyengyt&rel=0&modestbranding=1&iv_load_policy=3"
              title="Cadena Bitcoin Video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="w-full h-full"
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
        <p class="mt-4 text-tertiary text-lg">Stay updated with our latest insights</p>
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
          <div
            class="flex space-x-6 transition-all duration-300 ease-in-out sm:justify-center snap-x snap-mandatory sm:snap-none"
          >
            <component
              v-for="article in visibleArticles"
              :key="article.id"
              :is="article.internal ? 'router-link' : 'a'"
              :to="article.internal ? article.link : undefined"
              :href="!article.internal ? article.link : undefined"
              class="flex-shrink-0 w-[280px] sm:w-[300px] bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:shadow-xl hover:ring-2 hover:ring-secondary hover:bg-white/10 hover:border-white/20 hover:shadow-lg cursor-pointer snap-center"
            >
              <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover transition-opacity duration-300 hover:opacity-90" />
              <div class="p-4">
                <h3 class="text-xl font-semibold mb-2 text-white hover:text-secondary transition-colors duration-300">
                  {{ article.title }}
                </h3>
                <p class="text-white/80 text-sm">{{ article.description }}</p>
                <span class="inline-block text-secondary font-medium mt-3 hover:underline">Read more →</span>
              </div>
            </component>
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

  <!-- Latest Videos (animate in from left) -->
  <section
    class="bg-transparent text-white pt-8 pb-8 px-6 animated-section"
    :class="sectionInView[2] ? 'animate-in-left' : ''"
  >
    <div class="max-w-6xl mx-auto space-y-12">
      <div class="text-center space-y-4">
        <h2 class="text-3xl md:text-4xl font-extrabold">Latest Videos</h2>
        <p class="text-white text-lg max-w-2xl mx-auto">
          Explore our latest updates, tutorials, and overviews about Cadena Bitcoin and our protocol innovations.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(video, index) in videos"
          :key="index"
          class="rounded-xl overflow-hidden shadow-lg border border-secondary aspect-w-16 aspect-h-9"
        >
          <iframe
            :src="video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ (no animation) -->
  <section class="bg-transparent text-white px-4 pt-8 pb-20 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto space-y-12">
      <!-- Heading -->
      <div class="text-center">
        <h2 class="text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h2>
        <p class="mt-4 text-tertiary text-lg">
          Everything you need to know about Cadena Bitcoin’s loan product.
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="space-y-4">
        <details class="group [&_summary::-webkit-details-marker]:hidden" open>
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
            <h2 class="text-lg font-medium">What is the loan amount?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p class="px-4 pt-4 text-white">Loans are standard 0.1 Bitcoin.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
            <h2 class="text-lg font-medium">Can I repay my loan early?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p class="px-4 pt-4 text-white">All loans settle at the end of the term (30 days, 90 days, 180 days or 1 
year).</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
            <h2 class="text-lg font-medium">Are there monthly payments?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p class="px-4 pt-4 text-white">There are no payments.  All loans settle at the end of the term.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
            <h2 class="text-lg font-medium">What is the Loan To Value?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p class="px-4 pt-4 text-white">We offer 50% and 80% loan to value loans.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
            <h2 class="text-lg font-medium">How is collateral managed?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p class="px-4 pt-4 text-white">
            Cadena Bitcoin prioritizes self-sovereignty, decentralization, and Bitcoin’s core security principle: Your Keys, Your Coins.
            You control your private keys and funds. Cadena Bitcoin does not hold or access your private keys or seed phrase.
          </p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
            <h2 class="text-lg font-medium">What currency can I get my loan in?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p class="px-4 pt-4 text-white">Loans are funded in Bitcoin and settled in Bitcoin.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
            <h2 class="text-lg font-medium">How do I get a Bitcoin-backed loan?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p class="px-4 pt-4 text-white">Register online and download the signer app.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
            <h2 class="text-lg font-medium">How long does it take to get a loan?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p class="px-4 pt-4 text-white">
            Minutes. Funding transactions are broadcast as soon as both peers sign the contract.
          </p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
            <h2 class="text-lg font-medium">What happens if my collateral drops in value?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p class="px-4 pt-4 text-white">
            Nothing happens with the collateral until it is divided on final settlement.
          </p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
            <h2 class="text-lg font-medium">Is there a credit check?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p class="px-4 pt-4 text-white">No. Your bitcoin is your credit.</p>
        </details>
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
          to="/register"
          class="inline-block rounded-full bg-white text-secondary font-semibold px-8 py-4 text-lg transition hover:bg-white/90"
        >
          Borrow Bitcoin
        </router-link>
        <router-link
          to="/register"
          class="inline-block rounded-full border-2 border-white text-white font-semibold px-8 py-4 text-lg transition hover:bg-white hover:text-secondary"
        >
          Lend Bitcoin
        </router-link>
      </div>
    </div>
  </section>

  <TheFooter />
  </div>
</template>

<style scoped>
/* Animation classes */
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
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-180px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(180px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Optional: hide scrollbar if needed */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scale-wrapper {
  width: 100%;
  transform-origin: top center;
}

@media (max-width: 640px) {
  .scale-wrapper {
    transform: scale(calc(100vw / 640));
  }
}

/* Fix for top cut-off: add top padding to main container, not body */
section.bg-primary {
  padding-top: 5.5rem !important; /* Adjust as needed for your navbar height */
}
</style>