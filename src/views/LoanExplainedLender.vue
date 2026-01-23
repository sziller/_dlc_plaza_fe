<template>
  <div class="relative min-h-screen text-white">
    <div class="fixed inset-0 -z-10 bg-page-gradient"></div>

    <!-- HERO SECTION -->
    <section class="hero-shell bg-transparent text-white">
      <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div class="hero-grid sm:grid sm:grid-cols-12 gap-[var(--g)]">
          <!-- Left: Copy -->
          <div class="
            sm:col-span-5 lg:col-span-6
            min-[640px]:max-[900px]:col-span-12
            flex items-center justify-center p-0
            min-[640px]:max-[900px]:justify-center
          ">
            <div class="flex flex-col gap-5 sm:gap-6 items-center">
              <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white text-center">
                Earn Fixed Returns<br />on Bitcoin
              </h1>

              <!-- Checklist -->
              <ul class="flex flex-col gap-3 sm:gap-4 text-lg sm:text-xl">
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">Earn 10% APR fixed return.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">Guaranteed USD claim at maturity.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">No Bitcoin volatility exposure.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">Trustless DLC enforcement.</span>
                </li>
              </ul>

              <!-- CTA Button -->
              <div class="flex justify-center">
                <router-link
                  :to="ctaLink"
                  class="inline-flex items-center justify-center gap-3 sm:gap-4 rounded-full bg-secondary px-7 py-3 text-base md:text-lg font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none min-w-[200px]"
                >
                  Start Lending
                </router-link>
              </div>
            </div>
          </div>

          <!-- Right: Hero Image -->
          <div class="
            sm:col-span-7 lg:col-span-6
            hidden sm:flex
            min-[640px]:max-[900px]:hidden
            p-0 hero-right
            justify-center lg:justify-end
          ">
            <img
              src="/img/hero-loan-explained.png"
              alt="Bitcoin lending illustration"
              class="w-auto h-auto max-w-xs sm:max-w-sm lg:max-w-md object-contain"
              width="634"
              height="471"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS - 3 STEPS -->
    <section class="px-4 py-16 lg:py-20">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
          How It Works for Lenders
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold">1</span>
            </div>
            <h3 class="text-xl font-bold mb-3">Fund the Loan</h3>
            <p class="text-white/80">
              Provide Bitcoin to borrowers seeking liquidity. Your BTC is locked in a secure, non-custodial DLC smart contract.
            </p>
          </div>
          <!-- Step 2 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold">2</span>
            </div>
            <h3 class="text-xl font-bold mb-3">Lock In Your Return</h3>
            <p class="text-white/80">
              Your 10% APR is fixed from Day 1. You have a guaranteed claim on a fixed USD amount of Bitcoin at maturity.
            </p>
          </div>
          <!-- Step 3 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold">3</span>
            </div>
            <h3 class="text-xl font-bold mb-3">Automatic Settlement</h3>
            <p class="text-white/80">
              At maturity, the oracle reports the BTC price. You automatically receive your fixed USD claim in BTC. No action needed.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONCRETE EXAMPLE -->
    <section class="px-4 py-16 lg:py-20 bg-white/[0.02]">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          Lender Economics in Action
        </h2>
        <p class="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          A real example showing exactly how you earn fixed returns with Bitcoin-backed lending.
        </p>

        <div class="bg-secondary/20 border border-secondary/40 rounded-3xl p-6 sm:p-10">
          <!-- Example Header -->
          <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-10 text-center">
            <div class="bg-black/30 rounded-xl px-5 py-3">
              <div class="text-white/60 text-sm">You Lend</div>
              <div class="text-2xl font-bold">0.5 BTC</div>
            </div>
            <div class="bg-black/30 rounded-xl px-5 py-3">
              <div class="text-white/60 text-sm">BTC Price</div>
              <div class="text-2xl font-bold">${{ btcPriceFormatted }}</div>
            </div>
            <div class="bg-black/30 rounded-xl px-5 py-3">
              <div class="text-white/60 text-sm">Interest Rate</div>
              <div class="text-2xl font-bold">10% APR</div>
            </div>
          </div>

          <!-- Your Guaranteed Claim Highlight -->
          <div class="mb-8 text-center">
            <div class="inline-block bg-gradient-to-r from-secondary/20 to-purple-600/20 border border-secondary/40 rounded-2xl px-8 py-6">
              <p class="text-white/70 text-sm uppercase tracking-wide mb-2">Your Guaranteed Claim</p>
              <p class="text-3xl sm:text-4xl font-bold text-white mb-1">
                ${{ formatUSD(totalClaimUSD) }}
              </p>
              <p class="text-white/60 text-sm">USD worth of Bitcoin at maturity (no matter the price)</p>
            </div>
          </div>

          <!-- Lender Breakdown -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- What You Provide -->
            <div class="bg-black/20 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-secondary mb-4">What You Provide Today</h3>
              <div class="space-y-3 text-white/90">
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Claim at Maturity</span>
                  <span class="font-mono font-bold">0.500 BTC</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Claim Value Today</span>
                  <span class="font-mono font-bold">${{ formatUSD(totalClaimUSD) }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Discounted for 10% Return</span>
                  <span class="font-mono text-green-400">/ 1.10</span>
                </div>
                <div class="flex justify-between items-center py-3 bg-secondary/30 rounded-lg px-3 -mx-3">
                  <span class="font-bold">Your Investment</span>
                  <span class="font-mono font-bold text-xl">${{ formatUSD(investmentUSD) }}</span>
                </div>
              </div>
              <p class="text-xs text-white/50 mt-4 pt-4 border-t border-white/10">
                You invest less today to lock in a 0.5 BTC claim at maturity. Your 10% return is built into the claim.
              </p>
            </div>

            <!-- What You Get at Maturity -->
            <div class="bg-black/20 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-secondary mb-4">At Maturity (Guaranteed)</h3>
              <div class="space-y-4 text-white/90">
                <p>
                  You receive a guaranteed claim on <strong>{{ lenderClaimBTC.toFixed(3) }} BTC</strong> at settlement.
                </p>
                <p>
                  An oracle reports the BTC price. <strong>You get exactly {{ lenderClaimBTC.toFixed(3) }} BTC in value</strong>, regardless of the market price.
                </p>
                <div class="bg-secondary/20 border border-secondary/30 rounded-xl p-4 mt-4">
                  <p class="text-sm text-white/80">
                    <strong>Key insight:</strong> If Bitcoin crashes, you still get your {{ lenderClaimBTC.toFixed(3) }} BTC claim. If Bitcoin moons, borrowers capture the upside. You have zero volatility exposure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHAT LENDERS GET (BENEFITS) -->
    <section class="px-4 py-16 lg:py-20">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
          What You Get as a Lender
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">%</div>
            <h3 class="text-lg font-bold mb-2">Fixed 10% APR</h3>
            <p class="text-white/70 text-sm">
              Your return is locked in from Day 1. No variable rates, no surprises. Earn exactly 10% per annum.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x2248;</div>
            <h3 class="text-lg font-bold mb-2">No Volatility Exposure</h3>
            <p class="text-white/70 text-sm">
              Your USD claim is fixed. Bitcoin can moon or crash—your $55k claim stays $55k worth of BTC.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x1F6E1;</div>
            <h3 class="text-lg font-bold mb-2">Bitcoin-Backed Security</h3>
            <p class="text-white/70 text-sm">
              200% over-collateralization. Borrowers lock 1 BTC to borrow 0.5 BTC—you have significant protection.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x1F512;</div>
            <h3 class="text-lg font-bold mb-2">Trustless Enforcement</h3>
            <p class="text-white/70 text-sm">
              DLC smart contracts enforce settlement automatically. No company custody, no trust needed. Code is law.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x21BB;</div>
            <h3 class="text-lg font-bold mb-2">Fully Passive</h3>
            <p class="text-white/70 text-sm">
              Fund once, receive at maturity. No monitoring, no margin calls, no active management required.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">⛓️</div>
            <h3 class="text-lg font-bold mb-2">Native Bitcoin Security</h3>
            <p class="text-white/70 text-sm">
              On-chain settlement. No wrapped tokens, no sidechains, no cross-chain risk. Pure Bitcoin security.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SETTLEMENT SCENARIOS -->
    <section class="px-4 py-16 lg:py-20 bg-white/[0.02]">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          How Settlement Works
        </h2>
        <p class="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          See how you always receive your fixed {{ lenderClaimBTC.toFixed(3) }} BTC claim based on Bitcoin's price at maturity.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Scenario: BTC Doubles -->
          <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-emerald-400 text-2xl">&#x21C8;</span>
              <h3 class="text-lg font-bold text-emerald-400">If BTC Doubles to ${{ formatUSD(scenarios.double.price) }}</h3>
            </div>
            <div class="space-y-2 text-white/80">
              <div class="flex justify-between">
                <span>You receive:</span>
                <span class="font-mono">{{ scenarios.double.lenderBTC.toFixed(4) }} BTC (${{ formatUSD(totalClaimUSD) }})</span>
              </div>
              <div class="flex justify-between text-emerald-400 font-bold">
                <span>Borrower gets:</span>
                <span class="font-mono">{{ scenarios.double.borrowerBTC.toFixed(4) }} BTC</span>
              </div>
            </div>
          </div>

          <!-- Scenario: BTC Rises -->
          <div class="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-green-400 text-2xl">&#x2191;</span>
              <h3 class="text-lg font-bold text-green-400">If BTC Rises to ${{ formatUSD(scenarios.rise.price) }}</h3>
            </div>
            <div class="space-y-2 text-white/80">
              <div class="flex justify-between">
                <span>You receive:</span>
                <span class="font-mono">{{ scenarios.rise.lenderBTC.toFixed(4) }} BTC (${{ formatUSD(totalClaimUSD) }})</span>
              </div>
              <div class="flex justify-between text-green-400 font-bold">
                <span>Borrower gets:</span>
                <span class="font-mono">{{ scenarios.rise.borrowerBTC.toFixed(4) }} BTC</span>
              </div>
            </div>
          </div>

          <!-- Scenario: BTC Flat -->
          <div class="bg-white/5 border border-white/20 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-white/60 text-2xl">&#x2192;</span>
              <h3 class="text-lg font-bold">If BTC Stays at ${{ btcPriceFormatted }}</h3>
            </div>
            <div class="space-y-2 text-white/80">
              <div class="flex justify-between">
                <span>You receive:</span>
                <span class="font-mono">{{ scenarios.flat.lenderBTC.toFixed(4) }} BTC (${{ formatUSD(totalClaimUSD) }})</span>
              </div>
              <div class="flex justify-between font-bold">
                <span>Borrower gets:</span>
                <span class="font-mono">{{ scenarios.flat.borrowerBTC.toFixed(4) }} BTC</span>
              </div>
            </div>
          </div>

          <!-- Scenario: BTC Falls 25% -->
          <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-yellow-400 text-2xl">&#x2193;</span>
              <h3 class="text-lg font-bold text-yellow-400">If BTC Falls 25% to ${{ formatUSD(scenarios.drop.price) }}</h3>
            </div>
            <div class="space-y-2 text-white/80">
              <div class="flex justify-between">
                <span>You receive:</span>
                <span class="font-mono">{{ scenarios.drop.lenderBTC.toFixed(4) }} BTC (${{ formatUSD(totalClaimUSD) }})</span>
              </div>
              <div class="flex justify-between text-yellow-400 font-bold">
                <span>Borrower gets:</span>
                <span class="font-mono">{{ scenarios.drop.borrowerBTC.toFixed(4) }} BTC</span>
              </div>
            </div>
          </div>

          <!-- Scenario: BTC Crashes 50% -->
          <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-red-400 text-2xl">&#x2193;&#x2193;</span>
              <h3 class="text-lg font-bold text-red-400">If BTC Crashes 50% to ${{ formatUSD(scenarios.crash.price) }}</h3>
            </div>
            <div class="space-y-2 text-white/80">
              <div class="flex justify-between">
                <span>You receive:</span>
                <span class="font-mono">{{ scenarios.crash.lenderBTC.toFixed(4) }} BTC (entire collateral)</span>
              </div>
              <div class="flex justify-between text-red-400 font-bold">
                <span>Borrower gets:</span>
                <span class="font-mono">{{ scenarios.crash.borrowerBTC.toFixed(4) }} BTC</span>
              </div>
            </div>
            <p class="text-xs text-white/50 mt-3">
              Even in worst-case scenario, you receive your full ${{ formatUSD(totalClaimUSD) }} claim in BTC value.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- RISK DISCLOSURE -->
    <section class="px-4 py-16 lg:py-20 bg-white/[0.02]">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-8">
          Risk Disclosure
        </h2>
        <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
          <p class="text-white/90 mb-4">
            All lending carries risks. Key considerations for lenders:
          </p>

          <ul class="space-y-3 text-white/80 text-sm">
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold flex-shrink-0">•</span>
              <span><strong class="text-white">Smart Contract Risk:</strong> DLCs depend on Bitcoin script and oracle attestations. Potential bugs could affect settlement.</span>
            </li>
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold flex-shrink-0">•</span>
              <span><strong class="text-white">Oracle Risk:</strong> Settlement relies on price feeds. Oracle failure or manipulation could theoretically affect claims.</span>
            </li>
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold flex-shrink-0">•</span>
              <span><strong class="text-white">Bitcoin Crash Risk:</strong> If BTC crashes significantly, you receive your full claim in BTC, but that BTC is worth less in fiat terms.</span>
            </li>
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold flex-shrink-0">•</span>
              <span><strong class="text-white">Opportunity Cost:</strong> You forgo potential BTC appreciation. You earn 10% in USD terms but miss upside if BTC rallies significantly.</span>
            </li>
          </ul>

          <p class="text-white/60 text-xs mt-4 pt-4 border-t border-yellow-500/30">
            Disclaimer: Past performance is not indicative of future results. This is not financial advice. Only lend Bitcoin you can afford to lose. Consult a financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section class="px-4 py-16 lg:py-20">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p class="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          Common questions from potential Bitcoin lenders.
        </p>

        <div class="space-y-4">
          <div v-for="(item, idx) in faqItems" :key="item.id" class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              @click="toggleFaq(idx)"
              class="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.08] transition-colors"
            >
              <h3 class="text-lg font-bold text-white pr-4">{{ item.title }}</h3>
              <svg
                class="w-5 h-5 flex-shrink-0 text-secondary transition-transform"
                :class="{ 'rotate-180': openFaqIndex === idx }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            <div v-if="openFaqIndex === idx" class="px-6 pb-6 text-white/80 border-t border-white/10">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OSA0LTQgNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div class="max-w-4xl mx-auto relative text-center">
        <h2 class="text-3xl md:text-5xl font-extrabold mb-6">
          Ready to Earn Bitcoin-Backed Yield?
        </h2>
        <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-10">
          Lock in 10% APR returns with DLC-secured lending. Fixed, predictable, trustless.
        </p>
        <router-link
          :to="ctaLink"
          class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
        >
          <span>Start Lending Today</span>
          <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </router-link>
        <p class="text-white/60 text-sm mt-6">
          Questions? <router-link to="/faq" class="underline hover:text-white">Read our FAQ</router-link> or <router-link to="/contact" class="underline hover:text-white">contact us</router-link>.
        </p>
      </div>
    </section>
  </div>

  <TheFooter />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'
import { useAuth } from '../composables/useAuth'
import { getPrice } from '../api/price'

const { isLoggedIn, setUserFromApi } = useAuth()
const ctaLink = computed(() => isLoggedIn.value ? '/btcusd' : '/register')

// FAQ accordion state
const openFaqIndex = ref(0) // First item open by default
const toggleFaq = (idx) => {
  openFaqIndex.value = openFaqIndex.value === idx ? -1 : idx
}

// BTC Price fetching
const btcPriceRaw = ref(100000) // Default fallback
let priceIntervalId = null

async function fetchBTCPrice() {
  try {
    const raw = await getPrice()
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      btcPriceRaw.value = raw
    }
  } catch (err) {
    console.error('Failed to fetch BTC price:', err)
  }
}

// Formatted price for display
const btcPriceFormatted = computed(() =>
  btcPriceRaw.value.toLocaleString(undefined, { maximumFractionDigits: 0 })
)

// Loan constants (lender perspective)
const lenderClaimBTC = 0.5
const interestRate = 0.10
const totalClaimBTC = lenderClaimBTC // 0.5 (claim includes interest baked in)
const totalClaimUSD = computed(() => btcPriceRaw.value * totalClaimBTC)

// Discounted investment (what lender puts in today)
const investmentUSD = computed(() => totalClaimUSD.value / (1 + interestRate))

// Format USD helper
const formatUSD = (val) => val.toLocaleString(undefined, { maximumFractionDigits: 0 })

// Settlement scenarios (relative to current price)
const scenarios = computed(() => {
  const price = btcPriceRaw.value
  const claim = totalClaimUSD.value

  const double = {
    price: price * 2.0,
    lenderBTC: claim / (price * 2.0),
    borrowerBTC: 1 - (claim / (price * 2.0))
  }

  const rise = {
    price: price * 1.5,
    lenderBTC: claim / (price * 1.5),
    borrowerBTC: 1 - (claim / (price * 1.5))
  }

  const flat = {
    price: price,
    lenderBTC: totalClaimBTC,
    borrowerBTC: 1 - totalClaimBTC
  }

  const drop = {
    price: price * 0.75,
    lenderBTC: claim / (price * 0.75),
    borrowerBTC: 1 - (claim / (price * 0.75))
  }

  const crash = {
    price: claim, // Price where borrower's 1 BTC equals lender's claim
    lenderBTC: 1.0,
    borrowerBTC: 0
  }

  return { double, rise, flat, drop, crash }
})

// FAQ items
const faqItems = [
  {
    id: 'faq-1',
    title: 'How is my 10% APR guaranteed?',
    content: `The interest is calculated and locked into the DLC smart contract at creation. Your claim on a fixed USD amount of Bitcoin at maturity includes both the principal and 10% return at the initial price. The smart contract enforces this automatically—no counterparty can change it.`,
    open: true
  },
  {
    id: 'faq-2',
    title: 'What if Bitcoin crashes below my claim value?',
    content: `You receive the entire borrower collateral. For example, if your claim is $46,916 and BTC drops to $40,000, you'd receive all 1 BTC collateral (worth $40,000). While less than your claim in USD terms, you still receive the maximum possible value.`
  },
  {
    id: 'faq-3',
    title: 'Can I withdraw early?',
    content: `Current loan terms are fixed-duration (typically 30-90 days). Early withdrawal is not supported in this initial version. Future iterations may include secondary markets where you can transfer your loan position to other lenders.`
  }
]

onMounted(() => {
  setUserFromApi()
  window.scrollTo(0, 0)
  fetchBTCPrice()
  priceIntervalId = setInterval(fetchBTCPrice, 30_000)
})

onUnmounted(() => {
  if (priceIntervalId) clearInterval(priceIntervalId)
})
</script>

<style scoped>
/* Background gradient (same as home page) */
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

.hero-shell {
  padding-top: clamp(1rem, 5vw, 3.75rem);
}

@media (min-width: 1024px) {
  .hero-shell {
    padding-top: clamp(2rem, 4vw, 4.5rem);
  }
}

.hero-grid {
  --g: 24px;
  overflow: visible;
}

@media (min-width: 1024px) {
  .hero-grid {
    --g: 32px;
  }
}
</style>
