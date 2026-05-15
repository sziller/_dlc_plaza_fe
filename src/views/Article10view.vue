<template>
  <div class="min-h-screen mt-0 text-white relative overflow-hidden bg-black">
    <!-- HERO TITLE SECTION -->
    <section class="bg-secondary px-4 py-6 lg:py-10 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          Non-Custodial Bitcoin Borrowing: Your Keys, Your Coins
        </h1>
      </div>
    </section>

    <!-- FEATURED IMAGE SECTION -->
    <section class="max-w-5xl mx-auto px-6 py-8">
      <picture>
        <source type="image/avif" :srcset="getImageSrcset('avif')" />
        <source type="image/webp" :srcset="getImageSrcset('webp')" />
        <img
          :src="`/img/article7-960.webp`"
          alt="How to borrow against Bitcoin without selling"
          class="w-full rounded-lg"
          loading="eager"
          decoding="async"
        />
      </picture>
    </section>

    <!-- ARTICLE CONTENT -->
    <section class="px-10 py-5 lg:py-14 max-w-[1100px] mx-auto space-y-6 text-lg leading-relaxed text-white/90">
      <p>
        Bitcoin holders face a common dilemma: you need liquidity, but selling means losing future gains and triggering capital gains tax events.
        Borrowing against Bitcoin solves this by turning your holdings into collateral while you maintain ownership and upside exposure.
        In this comprehensive guide, you'll learn exactly how Bitcoin-backed borrowing works, the risks to avoid, and why Cadena's DLC-based approach
        is the safest option in 2025.
      </p>

      <div class="space-y-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">What Does It Mean to Borrow Against Bitcoin?</h2>
          <p>
            Borrowing against Bitcoin means using your BTC as collateral to secure a loan, typically in USD or stablecoins, without selling your Bitcoin.
            The lender locks your Bitcoin in a secure contract, provides you with liquidity, and returns your Bitcoin when you repay the loan plus interest.
            This mechanism allows you to access cash for immediate needs while maintaining exposure to Bitcoin's price appreciation.
          </p>
          <p class="mt-4">
            Unlike traditional loans that require credit checks, employment verification, and weeks of paperwork, Bitcoin collateral loans can be
            approved instantly. The Bitcoin itself serves as the credit assessment—if you have the collateral, you qualify for the loan.
            Rates typically range from 4.9% to 15% APR depending on the loan-to-value (LTV) ratio you choose.
          </p>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">How Bitcoin-Backed Loans Work: Step-by-Step</h2>
          <p>
            The process of borrowing against Bitcoin involves several key steps:
          </p>
          <ol class="list-decimal list-inside space-y-3 mt-4 ml-4">
            <li><strong>Choose your loan parameters:</strong> Decide how much USD you need and what LTV ratio you're comfortable with (typically 30-70% of your Bitcoin's value).</li>
            <li><strong>Lock your collateral:</strong> Your Bitcoin is secured in a smart contract or DLC (Discreet Log Contract) that neither party can access unilaterally.</li>
            <li><strong>Receive funds:</strong> USD or stablecoins are transferred to your account, usually within minutes to hours.</li>
            <li><strong>Monitor your position:</strong> Track Bitcoin's price and your collateral ratio to avoid liquidation if BTC price drops significantly.</li>
            <li><strong>Repay and unlock:</strong> When you repay the principal plus interest, your Bitcoin is automatically released back to your control.</li>
          </ol>
          <p class="mt-4">
            On Cadena Bitcoin, this entire process happens through Discreet Log Contracts on the Bitcoin blockchain itself—no wrapped tokens,
            no sidechains, and no custody transfer to a third party.
          </p>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Understanding Loan-to-Value (LTV) Ratios</h2>
          <p>
            The loan-to-value ratio determines how much you can borrow relative to your Bitcoin collateral. For example:
          </p>
          <ul class="list-disc list-inside space-y-2 mt-4 ml-4">
            <li><strong>50% LTV:</strong> If you deposit 1 BTC worth $50,000, you can borrow $25,000</li>
            <li><strong>70% LTV:</strong> Same 1 BTC gets you $35,000 in liquidity</li>
            <li><strong>30% LTV:</strong> More conservative—only $15,000 borrowed, much safer from liquidation</li>
          </ul>
          <p class="mt-4">
            Higher LTV ratios give you more liquidity but increase liquidation risk if Bitcoin's price drops. Lower LTV ratios provide a larger
            safety buffer but require more collateral to borrow the same amount. Most experienced borrowers choose 40-50% LTV as the sweet spot
            between liquidity and security.
          </p>
        </div>
      </div>

      <div class="space-y-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Cadena's DLC-Based Approach: Non-Custodial Security</h2>
          <p>
            Cadena Bitcoin uses <router-link to="/article/dlc-bitcoin-loans" class="text-secondary underline hover:text-white transition">Discreet Log Contracts (DLCs)</router-link>
            to enable truly non-custodial Bitcoin borrowing. Unlike centralized platforms where you send your Bitcoin to a company's wallet
            (think BlockFi, Celsius—many of which failed), DLCs lock your Bitcoin in a smart contract that settles automatically based on
            oracle price data.
          </p>
          <p class="mt-4">
            This means Cadena never takes custody of your Bitcoin. You never give up your keys. The contract is enforced by Bitcoin's
            blockchain itself, not by trust in a company. If the company disappears tomorrow, your Bitcoin remains secured in the contract
            and can be recovered.
          </p>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Tax Benefits: Borrow vs. Sell</h2>
          <p>
            One of the most compelling reasons to borrow against Bitcoin rather than selling is tax efficiency. When you sell Bitcoin,
            you trigger a taxable event and owe capital gains tax (up to 37% federally in the US, plus state taxes). If you bought Bitcoin
            at $10,000 and it's now worth $50,000, selling $25,000 worth means paying tax on ~$20,000 in gains.
          </p>
          <p class="mt-4">
            <strong>Example comparison:</strong>
          </p>
          <div class="bg-white/5 border border-secondary/30 rounded-lg p-6 my-4">
            <p><strong>Scenario:</strong> You need $25,000 cash and own 1 BTC worth $50,000</p>
            <p class="mt-3"><strong>Option 1 - Sell:</strong> Sell 0.5 BTC → Pay $5,000-7,500 in capital gains tax → Net $17,500-20,000 in pocket</p>
            <p class="mt-3"><strong>Option 2 - Borrow (50% LTV at 7% APR):</strong> Borrow $25,000 against 1 BTC → Pay $1,750/year in interest → Keep full $25,000 + maintain Bitcoin exposure</p>
          </div>
          <p>
            You avoid the immediate tax hit, keep your Bitcoin for future appreciation, and only pay interest on the loan. If Bitcoin doubles again,
            your 1 BTC is now worth $100,000—value you would have lost by selling.
          </p>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Common Use Cases for Bitcoin-Backed Loans</h2>
          <p>
            Bitcoin holders use collateral loans for various strategic purposes:
          </p>
          <ul class="list-disc list-inside space-y-3 mt-4 ml-4">
            <li><strong>Real estate down payments:</strong> Access cash for property purchases without selling Bitcoin during a bull market</li>
            <li><strong>Business capital:</strong> Fund business operations or expansions while maintaining long-term Bitcoin holdings</li>
            <li><strong>Emergency liquidity:</strong> Cover unexpected expenses without disrupting your investment strategy</li>
            <li><strong>Tax-loss harvesting arbitrage:</strong> Borrow against Bitcoin in profitable years, repay in loss years to optimize taxes</li>
            <li><strong>Leverage trading:</strong> Experienced traders borrow against holdings to increase trading capital (high risk)</li>
          </ul>
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Risks and How to Mitigate Them</h2>
          <p>
            Bitcoin collateral loans carry risks that every borrower should understand:
          </p>
          <ul class="list-disc list-inside space-y-3 mt-4 ml-4">
            <li><strong>Liquidation risk:</strong> If Bitcoin's price drops too much, your collateral may be liquidated to repay the lender.
            <em>Mitigation: Choose conservative LTV ratios (30-50%), add more collateral if price drops, or use platforms with grace periods.</em></li>
            <li><strong>Counterparty risk (centralized platforms):</strong> Companies can freeze withdrawals, go bankrupt, or misuse your funds.
            <em>Mitigation: Use non-custodial platforms like Cadena that never take possession of your Bitcoin.</em></li>
            <li><strong>Interest accumulation:</strong> Loan costs compound over time. <em>Mitigation: Have a clear repayment plan and timeline.</em></li>
            <li><strong>Smart contract bugs:</strong> Technical vulnerabilities in DLCs or contracts. <em>Mitigation: Use audited protocols with proven track records.</em></li>
          </ul>
        </div>
      </div>

      <!-- RELATED RESOURCES SECTION -->
      <div class="bg-white/5 border border-secondary/30 rounded-lg p-6 my-8">
        <h3 class="text-xl font-bold text-secondary mb-4">Related Resources</h3>
        <ul class="space-y-2">
          <li v-for="link in relatedArticles" :key="link.to">
            <router-link :to="link.to" class="text-white hover:text-secondary transition flex items-start">
              <span class="text-secondary mr-2">→</span>
              <span>{{ link.text }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-4">Conclusion: The Smart Way to Access Bitcoin Liquidity</h2>
        <p>
          Borrowing against Bitcoin is a powerful financial tool that lets you access liquidity without sacrificing long-term gains or triggering tax events.
          By understanding LTV ratios, choosing non-custodial platforms like Cadena Bitcoin, and managing your collateral carefully, you can unlock
          your Bitcoin's value while maintaining full exposure to future appreciation.
        </p>
        <p class="mt-4">
          The key is choosing a platform that prioritizes security, transparency, and self-custody. Cadena's DLC-based approach ensures your Bitcoin
          remains under your control while still providing the liquidity you need.
        </p>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div class="max-w-5xl mx-auto relative">
        <!-- Main CTA Card -->
        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h2 class="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Ready to Borrow Against Your Bitcoin?
          </h2>
          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
            Get instant liquidity with rates starting at 4.9%. Non-custodial, DLC-secured, and self-enforcing.
            Your Bitcoin, your keys, your control.
          </p>

          <router-link
            :to="isLoggedIn ? '/btcusd' : '/register'"
            class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span>Start Borrowing Now</span>
            <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
          <router-link
            to="/article/bitcoin-collateral-loan"
            class="flex items-center gap-2 text-white/90 hover:text-white transition-all text-base font-medium group"
          >
            <span class="text-2xl transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Bitcoin Collateral Loans</span>
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

const { isLoggedIn, setUserFromApi} = useAuth()

const relatedArticles = [
  { to: '/article/bitcoin-collateral-loan', text: 'Bitcoin Collateral Loans: Everything You Need to Know' },
  { to: '/article/non-custodial-bitcoin-borrowing', text: 'Non-Custodial Bitcoin Borrowing Guide' },
  { to: '/article/unlock-bitcoin-liquidity', text: 'Unlock Bitcoin Liquidity Without Selling' },
  { to: '/article/dlc-bitcoin-loans', text: 'Understanding DLC Bitcoin Loans' },
  { to: '/knowledge-hub', text: 'Browse Knowledge Hub' }
]

function getImageSrcset(format) {
  return `/img/article7-640.${format} 640w, /img/article7-960.${format} 960w, /img/article7-1280.${format} 1280w`
}

onMounted(() => {
  setUserFromApi()
  window.scrollTo(0, 0)
})
</script>
