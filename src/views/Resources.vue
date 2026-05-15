<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Hero Section (Purple BG) -->
    <section class="bg-secondary px-4 py-12 lg:py-16 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          Knowledge Hub
        </h1>
        <p class="text-xl text-white/90 max-w-2xl mx-auto">
          Learn everything about Bitcoin-backed loans, decentralized lending,
          and how to unlock liquidity from your Bitcoin holdings.
        </p>
      </div>
    </section>

    <!-- Resource Grid (3 columns on large screens) -->
    <section class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="article in articles"
          :key="article.id"
          class="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-secondary/50 group"
        >
          <!-- Image -->
          <router-link :to="article.link">
            <picture>
              <source type="image/avif" :srcset="`/img/${article.imageBase}-640.avif`" />
              <source type="image/webp" :srcset="`/img/${article.imageBase}-640.webp`" />
              <img
                :src="`/img/${article.imageBase}-640.webp`"
                :alt="article.title"
                class="w-full h-48 object-cover"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </router-link>

          <!-- Card Content -->
          <div class="p-6">
            <router-link :to="article.link">
              <h2 class="text-xl font-bold mb-3 group-hover:text-secondary transition">
                {{ article.title }}
              </h2>
            </router-link>
            <p class="text-white/70 mb-4 line-clamp-3">{{ article.description }}</p>
            <router-link
              :to="article.link"
              class="inline-flex items-center text-secondary hover:text-white font-medium transition"
            >
              Read More
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </article>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-secondary py-16 px-6">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-extrabold mb-6">
          Ready to Borrow Against Your Bitcoin?
        </h2>
        <p class="text-lg text-white/90 mb-8">
          Access instant liquidity without selling your Bitcoin.
          Decentralized, non-custodial, and secured by DLCs.
        </p>
        <router-link
          :to="isLoggedIn ? '/btcusd' : '/register'"
          class="inline-block bg-white text-secondary hover:bg-white/90 px-8 py-4 rounded-full font-semibold text-lg transition"
        >
          Get Started Today
        </router-link>
      </div>
    </section>
  </div>

  <TheFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'
import { useAuth } from '../composables/useAuth'

const { isLoggedIn, setUserFromApi } = useAuth()

const articles = [
  {
    id: 1,
    title: 'Cadena & Decentralized Finance',
    description: 'What makes Cadena Bitcoin different from centralized lenders and sidechains.',
    imageBase: 'article14',
    link: '/article/cadena-decentralized-finance'
  },
  {
    id: 4,
    title: 'Security & Self-Sovereignty',
    description: 'Security model: self-sovereignty, decentralization, and core Bitcoin principles.',
    imageBase: 'article10',
    link: '/article/cadena-bitcoin-security'
  },
  {
    id: 7,
    title: 'How to Borrow Against Bitcoin: Complete Guide',
    description: 'Learn how to borrow against Bitcoin without selling. Complete guide to Bitcoin collateral loans, loan-to-value ratios, and DLC-secured borrowing.',
    imageBase: 'article7',
    link: '/article/borrow-against-bitcoin'
  },
  {
    id: 2,
    title: 'Improving Bitcoin Borrowing & Lending',
    description: 'How Cadena improves Bitcoin lending by removing intermediaries.',
    imageBase: 'article7',
    link: '/article/cadena-improving-btc'
  },
  {
    id: 8,
    title: 'Bitcoin Collateral Loans: Everything You Need to Know',
    description: 'Understand Bitcoin collateral loans, loan-to-value ratios, collateral management, and how DLCs secure your Bitcoin while borrowing.',
    imageBase: 'article8',
    link: '/article/bitcoin-collateral-loan'
  },
  {
    id: 5,
    title: 'Cadena Loan Lifecycle',
    description: 'Step-by-step breakdown of Cadena Bitcoin loan lifecycle.',
    imageBase: 'article8',
    link: '/article/cadena-loan-lifecycle'
  },
  {
    id: 10,
    title: 'Non-Custodial Bitcoin Borrowing: Your Keys, Your Coins',
    description: 'Borrow against Bitcoin while maintaining self-custody. Learn how DLC-based non-custodial loans protect your keys and coins.',
    imageBase: 'article10',
    link: '/article/non-custodial-bitcoin-borrowing'
  },
  {
    id: 3,
    title: 'Empowering Individual Financial Freedom',
    description: 'How Cadena lets you use Bitcoin flexibly while keeping self-custody.',
    imageBase: 'article16',
    link: '/article/cadena-empowering-financial-freedom'
  },
  {
    id: 12,
    title: 'Peer-to-Peer Bitcoin Loans: Direct Lending Without Banks',
    description: 'Discover P2P Bitcoin lending. Connect directly with lenders, get competitive rates, and settle on-chain with DLCs.',
    imageBase: 'article12',
    link: '/article/peer-to-peer-bitcoin-loans'
  },
{
    id: 14,
    title: 'DLC Bitcoin Loans: Discreet Log Contracts Explained',
    description: 'Deep dive into Discreet Log Contract loans. Learn how DLCs enable self-enforcing Bitcoin lending with oracle attestations.',
    imageBase: 'article14',
    link: '/article/dlc-bitcoin-loans'
  },
  {
    id: 15,
    title: 'Bitcoin Backed Loans 2026: Market Overview & Best Options',
    description: 'Complete market overview of Bitcoin-backed loans. Compare providers, understand risks, and choose the safest BTC lending solution.',
    imageBase: 'article15',
    link: '/article/bitcoin-backed-loans'
  },
  {
    id: 16,
    title: 'Unlock Bitcoin Liquidity: Borrow vs Sell in 2026',
    description: 'Discover strategies to unlock Bitcoin liquidity without selling. Tax implications, strategic borrowing, and maintaining long-term gains.',
    imageBase: 'article16',
    link: '/article/unlock-bitcoin-liquidity'
  },
  {
    id: 17,
    title: 'Cadena Bitcoin Presentation',
    description: 'Slide deck overview of Cadena Bitcoin\'s non-custodial lending model and DLC security.',
    imageBase: 'article10',
    link: '/article/cadena-bitcoin-presentation'
  },
  {
    id: 18,
    title: 'Cadena Bitcoin Loan Walkthrough Presentation',
    description: 'Step-by-step DLC loan walkthrough from offer to execution using Cadena.',
    imageBase: 'article12',
    link: '/article/cadena-bitcoin-loan-walkthrough'
  }
]

onMounted(() => {
  setUserFromApi()
  window.scrollTo(0, 0)
})
</script>
