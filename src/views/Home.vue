<script setup>
import { ref, computed } from 'vue'
import LiveRatesImac from '../components/LiveRatesImac.vue'
import TheFooter from '../components/TheFooter.vue'
import article1Img from '../assets/images/article1.png'
import article2Img from '../assets/images/article2.png'
import article3Img from '../assets/images/article3.png'
import article4Img from '../assets/images/article4.png'
import article5Img from '../assets/images/article5.png'
const videos = [
  'https://www.youtube.com/embed/SsBfTfVnjGc?si=GrrW6LD5ffZQI2kZ',
  'https://www.youtube.com/embed/D7HDDxh0Wjo?si=yevbggjIbKbycl1u',
  'https://www.youtube.com/embed/l_cy-tWM_lA?si=wDY0PSdvfX_ePYLW',
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
  }
,
  {
   id: 4,
   title: 'How Does it Work?',
   description: 'Cadena Bitcoin is a decentralized lending and borrowing product where users lock Bitcoin collateral in a DLC to facilitate loans. Here’s a breakdownof the key actions.',
   image: article4Img,
   link: '/article/cadena-bitcoin-security',
   internal: true,
 }
,
  {
   id: 5,
   title: 'We need to talk about KYC',
   description: 'Identification is quietly becoming the default requirement for access to the internet.',
   image: article1Img,
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
 }

,
]

const currentIndex = ref(0)
const visibleArticles = computed(() => {
  const result = []
  const len = articles.length
  for (let i = 0; i < 3; i++) {
    result.push(articles[(currentIndex.value + i) % len])
  }
  return result
})

function scrollLeft() {
  const len = articles.length
  currentIndex.value = (currentIndex.value - 1 + len) % len
}

function scrollRight() {
  const len = articles.length
  currentIndex.value = (currentIndex.value + 1) % len
}
</script>
<template>
  <section class="py-12 bg-primary"></section>

  <!-- Hero Section -->
  <section class="overflow-hidden bg-primary text-white sm:grid sm:grid-cols-2">
    <div class="flex items-center justify-center p-8 md:p-12 lg:px-16 lg:py-24">
      <div class="w-full max-w-xl text-center sm:text-left">
        <h2 class="text-3xl md:text-4xl font-extrabold leading-tight">
          Unlock your Bitcoin's potential.
        </h2>
        <p class="mt-6 text-white text-lg leading-relaxed">
          Get a Bitcoin loan for liquidity or to leverage your Bitcoin exposure. Give a Bitcoin loan to generate fiat yield. 
          No KYC, no credit checks, no hassle. Just Bitcoin.
        </p>
        <div class="mt-10 flex justify-center sm:justify-start">
          <router-link
            to="/register"
            class="inline-block rounded-full bg-secondary px-12 py-4 text-lg md:text-xl font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none"
          >
            Get Started Today
          </router-link>
        </div>
      </div>
    </div>
    <div class="hidden sm:flex justify-center items-center bg-gradient-to-tr from-secondary/10 to-transparent px-6 py-12">
      <LiveRatesImac />
    </div>
  </section>

  <!-- What is Cadena Bitcoin -->
  <section>
    <div class="rounded-xl bg-secondary mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div class="max-w-3xl">
            <h2 class="text-3xl sm:text-4xl font-bold text-white leading-tight">
              What is Cadena Bitcoin?
            </h2>
            <p class="mt-6 text-white text-lg leading-relaxed">
              Cadena Bitcoin’s product enables peer-to-peer lending and borrowing using Bitcoin as collateral through 
              Discreet Log Contracts (DLCs). Cadena Bitcoin lets you use Bitcoin flexibly—whether you want to grow your
              Bitcoin holdings, access fiat without losing Bitcoin exposure, or generate fiat returns secured by Bitcoin.
            </p>
          </div>
        </div>
        <div>
          <div class="rounded overflow-hidden aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/0v_okPUvHvQ?si=JnqpZ5rSgdyengyt"
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

   <section class="bg-primary text-white px-4 py-20 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-extrabold">Featured Articles</h2>
        <p class="mt-4 text-tertiary text-lg">Stay updated with our latest insights</p>
      </div>

      <div class="relative flex items-center justify-center">
        <!-- Left Arrow -->
        <button
          @click="scrollLeft"
          class="absolute left-0 z-10 bg-secondary hover:bg-secondary/80 text-white p-3 rounded-full shadow-md"
        >
          ◀
        </button>

        <!-- Carousel Container -->
        <div class="w-full max-w-5xl overflow-visible px-2">
          <div class="flex justify-center transition-all duration-300 ease-in-out space-x-6">
            <component
              v-for="article in visibleArticles"
              :key="article.id"
              :is="article.internal ? 'router-link' : 'a'"
              :to="article.internal ? article.link : undefined"
              :href="!article.internal ? article.link : undefined"
              class="flex-shrink-0 w-[300px] bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:shadow-xl hover:ring-2 hover:ring-secondary hover:bg-white/10 hover:border-white/20 hover:shadow-lg cursor-pointer"
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

        <!-- Right Arrow -->
        <button
          @click="scrollRight"
          class="absolute right-0 z-10 bg-secondary hover:bg-secondary/80 text-white p-3 rounded-full shadow-md"
        >
          ▶
        </button>
      </div>
    </div>
  </section>
  <!-- Latest Videos -->
  <section class="bg-primary text-white py-20 px-6">
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
<section class="bg-primary text-white px-4 py-20 sm:px-6 lg:px-8">
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
        <p class="px-4 pt-4 text-white">All loans settle after a standard 30 day term.</p>
      </details>

      <details class="group [&_summary::-webkit-details-marker]:hidden">
        <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
          <h2 class="text-lg font-medium">Are there monthly payments?</h2>
          <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
               xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <p class="px-4 pt-4 text-white">There are no payments. All loans settle after 30 days.</p>
      </details>

      <details class="group [&_summary::-webkit-details-marker]:hidden">
        <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-dark p-4 text-white cursor-pointer">
          <h2 class="text-lg font-medium">What is the Loan To Value?</h2>
          <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
               xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <p class="px-4 pt-4 text-white">80%</p>
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

  <!-- ... FAQ Section ... (unchanged) -->

  <section class="bg-secondary text-white py-20 px-6">
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
</template>

<style scoped>
/* Optional: hide scrollbar if needed */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>