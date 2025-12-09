<template>
  <div class="min-h-screen mt-0 text-white relative overflow-hidden bg-black">
    <section class="bg-secondary px-4 py-6 lg:py-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          DLC Bitcoin Loans: Discreet Log Contracts Explained
        </h1>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-6 py-8">
      <picture>
        <source type="image/avif" srcset="/img/article14-640.avif 640w, /img/article14-960.avif 960w, /img/article14-1280.avif 1280w" />
        <source type="image/webp" srcset="/img/article14-640.webp 640w, /img/article14-960.webp 960w, /img/article14-1280.webp 1280w" />
        <img src="/img/article14-960.webp" alt="DLC Bitcoin loans explained" class="w-full rounded-lg" loading="eager" decoding="async" />
      </picture>
    </section>

    <section class="px-10 py-5 lg:py-14 max-w-[1100px] mx-auto space-y-6 text-lg leading-relaxed text-white/90">
      <p>Discreet Log Contracts (DLCs) represent the most significant advancement in Bitcoin-native smart contracts since the blockchain's inception. By enabling trustless, oracle-attested agreements settled directly on Bitcoin's base layer, DLCs make truly decentralized Bitcoin lending possible. This technical deep dive explains how DLCs work and why they're revolutionizing Bitcoin finance.</p>

      <div class="space-y-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">What Are Discreet Log Contracts?</h2>
          <p>Discreet Log Contracts are a type of smart contract that executes on Bitcoin without requiring changes to the protocol or creating new tokens. First proposed by Tadge Dryja (co-creator of the Lightning Network) in 2018, DLCs use cryptographic signatures to create conditional payments based on external data (oracle attestations) while keeping the contract details private from the blockchain.</p>
          <p class="mt-4">Unlike Ethereum smart contracts that execute code on a virtual machine, DLCs use Bitcoin's native scripting language combined with Schnorr signatures to create contracts that settle automatically when oracles sign predefined outcomes. This makes them more secure, more private, and more Bitcoin-native than alternative approaches.</p>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">How DLCs Enable Trustless Bitcoin Lending</h2>
          <p>In a DLC-based Bitcoin loan on Cadena:</p>
          <ol class="list-decimal list-inside space-y-3 mt-4 ml-4">
            <li><strong>Contract creation:</strong> Borrower and lender agree on terms (loan amount, interest rate, collateral, liquidation price)</li>
            <li><strong>Bitcoin locking:</strong> Borrower's collateral goes into a DLC that can only be spent based on oracle price signatures</li>
            <li><strong>Oracle setup:</strong> Both parties select a trusted oracle that will attest to Bitcoin's price at specific times</li>
            <li><strong>Automatic settlement:</strong> When the loan term ends or liquidation triggers, the oracle signs the price, and the DLC settles automatically—returning Bitcoin to the borrower or liquidating to the lender</li>
          </ol>
          <p class="mt-4">Critically, neither Cadena nor any third party can interfere with this process. The contract is enforced by Bitcoin's consensus rules and cryptographic signatures, not by trust in a company.</p>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">DLCs vs Smart Contracts: Technical Comparison</h2>
          <p>DLCs differ fundamentally from Ethereum-style smart contracts:</p>
          <ul class="list-disc list-inside space-y-3 mt-4 ml-4">
            <li><strong>Execution layer:</strong> DLCs settle on Bitcoin L1; Ethereum contracts run on EVM</li>
            <li><strong>Privacy:</strong> DLC details are private between parties; Ethereum contracts are fully public</li>
            <li><strong>Security model:</strong> DLCs inherit Bitcoin's security; Ethereum contracts have additional attack surfaces</li>
            <li><strong>Oracle dependency:</strong> DLCs require oracle signatures; Ethereum contracts can include oracle or on-chain data</li>
            <li><strong>Complexity limit:</strong> DLCs handle binary/multi-outcome events well; Ethereum supports arbitrary computation</li>
          </ul>
          <p class="mt-4">For Bitcoin lending, DLCs are superior because they don't require wrapping Bitcoin, bridging to other chains, or trusting contract code that could have vulnerabilities.</p>
        </div>
      </div>

      <ComparisonTable
        title="DLC Security vs Other Contract Models"
        subtitle="Why DLCs are the safest option for Bitcoin lending"
        :features="[
          { feature: 'Settles on Bitcoin blockchain', cadena: true, traditional: false, defi: false },
          { feature: 'No wrapped tokens', cadena: true, traditional: true, defi: false },
          { feature: 'Private contract details', cadena: true, traditional: true, defi: false },
          { feature: 'No smart contract bugs', cadena: true, traditional: true, defi: false },
          { feature: 'Trustless execution', cadena: true, traditional: false, defi: true },
          { feature: 'Oracle-attested settlement', cadena: true, traditional: false, defi: 'Sometimes' }
        ]"
        cta-text="Try DLC Lending"
      />

      <div class="space-y-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Oracle Architecture and Trust</h2>
          <p>DLCs rely on oracles to attest to real-world data (like Bitcoin's price). Cadena uses a multi-oracle system where multiple independent data sources must agree on the price, reducing single points of failure. Oracles cannot steal funds—they can only sign price data that triggers the contract's predefined outcomes.</p>
          <p class="mt-4">This oracle model is significantly more secure than centralized platforms where the company itself determines liquidation prices and controls user funds.</p>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">The Future of Bitcoin DeFi</h2>
          <p>DLCs enable Bitcoin-native DeFi without compromising on decentralization or security. As the technology matures, we'll see DLCs power not just lending, but options, futures, prediction markets, and more—all settled on Bitcoin's blockchain without altcoins, wrapped tokens, or centralized intermediaries.</p>
        </div>
      </div>

      <div class="bg-white/5 border border-secondary/30 rounded-lg p-6 my-8">
        <h3 class="text-xl font-bold text-secondary mb-4">Related Resources</h3>
        <ul class="space-y-2">
          <li><router-link to="/article/bitcoin-collateral-loan" class="text-white hover:text-secondary transition flex items-start"><span class="text-secondary mr-2">→</span><span>Bitcoin Collateral Loans: Everything You Need to Know</span></router-link></li>
          <li><router-link to="/article/unlock-bitcoin-liquidity" class="text-white hover:text-secondary transition flex items-start"><span class="text-secondary mr-2">→</span><span>Unlock Bitcoin Liquidity: Borrow vs Sell in 2026</span></router-link></li>
          <li><router-link to="/article/borrow-against-bitcoin" class="text-white hover:text-secondary transition flex items-start"><span class="text-secondary mr-2">→</span><span>How to Borrow Against Bitcoin Without Selling</span></router-link></li>
          <li><router-link to="/knowledge-hub" class="text-white hover:text-secondary transition flex items-start"><span class="text-secondary mr-2">→</span><span>Knowledge Hub</span></router-link></li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Conclusion</h2>
        <p>DLCs represent the future of Bitcoin finance—enabling complex financial contracts without sacrificing Bitcoin's security, privacy, or decentralization. Cadena Bitcoin is proud to be at the forefront of this revolution, bringing DLC-powered lending to Bitcoin holders worldwide.</p>
      </div>
    </section>

    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div class="max-w-5xl mx-auto relative">
        <!-- Main CTA Card -->
        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Experience DLC-Powered Lending
          </h2>
          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
            The most secure way to borrow against Bitcoin. Trustless, transparent, settled on-chain.
          </p>

          <router-link
            :to="isLoggedIn ? '/btcusd' : '/register'"
            class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span>Start with DLCs</span>
            <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
          <router-link
            to="/article/peer-to-peer-bitcoin-loans"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span class="text-2xl transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Peer-to-Peer Bitcoin Loans</span>
          </router-link>

          <router-link
            to="/article/bitcoin-backed-loans"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span>Bitcoin Backed Loans</span>
            <span class="text-2xl transform group-hover:translate-x-1 transition-transform">→</span>
          </router-link>
        </div>
      </div>
    </section>
  </div>

  <TheFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'
import ComparisonTable from '../components/ComparisonTable.vue'
import { useAuth } from '../composables/useAuth'

const { isLoggedIn, setUserFromApi } = useAuth()

onMounted(() => {
  setUserFromApi()
  window.scrollTo(0, 0)
})
</script>
