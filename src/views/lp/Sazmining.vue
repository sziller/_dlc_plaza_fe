<template>
  <div class="relative min-h-screen text-white">
    <div class="fixed inset-0 -z-10 bg-page-gradient"></div>

    <!-- HERO SECTION -->
    <section class="hero-shell bg-transparent text-white">
      <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <!-- Co-Branded Logos -->
        <div class="flex items-center justify-center gap-4 sm:gap-6 mb-8 pt-8">
          <img
            :src="cadenaLogo"
            alt="Cadena Bitcoin Logo"
            class="h-10 sm:h-12 w-auto"
          />
          <span class="text-white/40 text-2xl font-light">+</span>
          <img
            src="/img/partners/sazmining-logo.png"
            alt="Sazmining Logo"
            class="h-10 sm:h-12 w-auto"
          />
        </div>

        <div class="hero-grid sm:grid sm:grid-cols-12 gap-[var(--g)]">
          <!-- Left: Copy -->
          <div class="
            sm:col-span-12 lg:col-span-12
            flex items-center justify-center p-0
          ">
            <div class="flex flex-col gap-5 sm:gap-6 items-center text-center">
              <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
                Leverage Your Bitcoin<br />to Mine More Bitcoin
              </h1>
              <p class="text-xl sm:text-2xl text-white/80 max-w-2xl">
                Get liquidity from your BTC, buy mining rigs, deploy to 100% renewable facilities
              </p>

              <!-- Checklist -->
              <ul class="flex flex-col gap-3 sm:gap-4 text-lg sm:text-xl text-left mt-4">
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">Self-custodial BTC loans (no platform custody)</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">50% LTV, 3-year term, 10-11% APR</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">100% hydroelectric-powered mining</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">Keep your BTC upside + earn mining rewards</span>
                </li>
              </ul>

              <!-- CTA Button -->
              <div class="flex justify-center mt-4">
                <router-link
                  :to="ctaLink"
                  class="inline-flex items-center justify-center gap-3 sm:gap-4 rounded-full bg-secondary px-7 py-3 text-base md:text-lg font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none min-w-[200px]"
                >
                  Start Mining
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- THE PROBLEM SECTION -->
    <section class="px-4 py-16 lg:py-20">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          Most Miners Leave Money on the Table
        </h2>
        <p class="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          Traditional approaches force painful trade-offs
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Pain Point 1 -->
          <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">&#x1F4B8;</span>
            </div>
            <h3 class="text-xl font-bold mb-3 text-red-400">Sell BTC on KYC Exchanges</h3>
            <p class="text-white/80">
              Miss Bitcoin's upside potential. Every sat sold is future gains lost.
            </p>
          </div>
          <!-- Pain Point 2 -->
          <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">&#x1F512;</span>
            </div>
            <h3 class="text-xl font-bold mb-3 text-red-400">Pay Cash Upfront for Rigs</h3>
            <p class="text-white/80">
              Capital locked up in hardware. Opportunity cost of not holding BTC.
            </p>
          </div>
          <!-- Pain Point 3 -->
          <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">&#x1F4B3;</span>
            </div>
            <h3 class="text-xl font-bold mb-3 text-red-400">High-Interest Fiat Loans</h3>
            <p class="text-white/80">
              Expensive debt burden eating into mining profits.
            </p>
          </div>
        </div>
        <div class="mt-12 text-center">
          <p class="text-white/60 text-lg italic">
            Result: Miners either miss Bitcoin's upside or mining opportunities
          </p>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS - 5-STEP FLYWHEEL -->
    <section class="px-4 py-16 lg:py-20 bg-white/[0.02]">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          How It Works
        </h2>
        <p class="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          The Cadena + Sazmining flywheel in 5 simple steps
        </p>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <!-- Step 1 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative">
            <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold">1</span>
            </div>
            <h3 class="text-lg font-bold mb-2">Lock Bitcoin with Cadena</h3>
            <p class="text-white/80 text-sm">
              1 BTC collateral stays on-chain in DLC, receive ~${{ formatUSD(loanAmount) }} loan (50% LTV)
            </p>
            <div class="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-secondary text-2xl z-10">&#x2192;</div>
          </div>
          <!-- Step 2 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative">
            <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold">2</span>
            </div>
            <h3 class="text-lg font-bold mb-2">Buy Mining Rigs</h3>
            <p class="text-white/80 text-sm">
              Purchase 5x Antminer S21 Hydro (${{ formatUSD(equipmentCostUSD) }}), remaining covers setup
            </p>
            <div class="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-secondary text-2xl z-10">&#x2192;</div>
          </div>
          <!-- Step 3 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative">
            <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold">3</span>
            </div>
            <h3 class="text-lg font-bold mb-2">Deploy to Sazmining</h3>
            <p class="text-white/80 text-sm">
              Ship to Paraguay (Itaipu Dam), 100% renewable hydro, operational in 2-4 weeks
            </p>
            <div class="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-secondary text-2xl z-10">&#x2192;</div>
          </div>
          <!-- Step 4 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative">
            <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold">4</span>
            </div>
            <h3 class="text-lg font-bold mb-2">Mine Clean Bitcoin</h3>
            <p class="text-white/80 text-sm">
              Generate ~{{ miningYields.total }} BTC over 3 years, weekly payouts, 85% to you / 15% hosting
            </p>
            <div class="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-secondary text-2xl z-10">&#x2192;</div>
          </div>
          <!-- Step 5 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-xl font-bold">5</span>
            </div>
            <h3 class="text-lg font-bold mb-2">Repay with Gains</h3>
            <p class="text-white/80 text-sm">
              Use BTC appreciation + mining yields to repay, keep the difference
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ECONOMICS EXAMPLE -->
    <section class="px-4 py-16 lg:py-20">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          Economics Example
        </h2>
        <p class="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          Real numbers at today's BTC price of ${{ btcPriceFormatted }}
        </p>

        <div class="bg-secondary/20 border border-secondary/40 rounded-3xl p-6 sm:p-10">
          <!-- Example Header -->
          <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10 text-center">
            <div class="bg-black/30 rounded-xl px-5 py-3">
              <div class="text-white/60 text-sm">Collateral</div>
              <div class="text-2xl font-bold">{{ collateralBTC }} BTC</div>
            </div>
            <div class="bg-black/30 rounded-xl px-5 py-3">
              <div class="text-white/60 text-sm">Loan Amount</div>
              <div class="text-2xl font-bold">${{ formatUSD(loanAmount) }}</div>
            </div>
            <div class="bg-black/30 rounded-xl px-5 py-3">
              <div class="text-white/60 text-sm">Equipment</div>
              <div class="text-2xl font-bold">5x S21 Hydro</div>
            </div>
          </div>

          <!-- Breakdown -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Loan Allocation -->
            <div class="bg-black/20 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-secondary mb-4">Loan Allocation</h3>
              <div class="space-y-3 text-white/90">
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Equipment (5x Antminer S21 Hydro)</span>
                  <span class="font-mono font-bold">${{ formatUSD(equipmentCostUSD) }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Setup & Shipping Reserve</span>
                  <span class="font-mono font-bold">${{ formatUSD(setupReserveUSD) }}</span>
                </div>
                <div class="flex justify-between items-center py-3 bg-secondary/30 rounded-lg px-3 -mx-3">
                  <span class="font-bold">Total Loan</span>
                  <span class="font-mono font-bold text-xl">${{ formatUSD(loanAmount) }}</span>
                </div>
              </div>
            </div>

            <!-- Mining Projections -->
            <div class="bg-black/20 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-secondary mb-4">3-Year Mining Projection</h3>
              <div class="space-y-3 text-white/90">
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Year 1 (after 15% Sazmining share)</span>
                  <span class="font-mono font-bold">{{ miningYields.year1 }} BTC</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Year 2 (difficulty adjustment)</span>
                  <span class="font-mono font-bold">{{ miningYields.year2 }} BTC</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Year 3 (post-2028 halving)</span>
                  <span class="font-mono font-bold">{{ miningYields.year3 }} BTC</span>
                </div>
                <div class="flex justify-between items-center py-3 bg-green-500/30 rounded-lg px-3 -mx-3">
                  <span class="font-bold">Total Mined</span>
                  <span class="font-mono font-bold text-xl text-green-400">{{ miningYields.total }} BTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICE SCENARIOS TABLE -->
    <section class="px-4 py-16 lg:py-20 bg-white/[0.02]">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          Outcomes at Different BTC Prices
        </h2>
        <p class="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          How your position looks at loan maturity depending on Bitcoin's price
        </p>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-white/20">
                <th class="text-left py-4 px-4 text-white/60 font-medium">BTC Price</th>
                <th class="text-right py-4 px-4 text-white/60 font-medium">Collateral Owed</th>
                <th class="text-right py-4 px-4 text-white/60 font-medium">You Keep</th>
                <th class="text-right py-4 px-4 text-white/60 font-medium">Mined BTC</th>
                <th class="text-right py-4 px-4 text-white/60 font-medium">Total BTC</th>
                <th class="text-right py-4 px-4 text-white/60 font-medium">Dollar Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="scenario in priceScenarios" :key="scenario.price" class="border-b border-white/10 hover:bg-white/5">
                <td class="py-4 px-4 font-bold">${{ formatUSD(scenario.price) }}</td>
                <td class="py-4 px-4 text-right font-mono text-red-400">{{ formatBtcValue(scenario.collateralOwed) }} BTC</td>
                <td class="py-4 px-4 text-right font-mono text-green-400">{{ formatBtcValue(scenario.youKeep) }} BTC</td>
                <td class="py-4 px-4 text-right font-mono text-blue-400">{{ miningYields.total }} BTC</td>
                <td class="py-4 px-4 text-right font-mono font-bold">{{ formatBtcValue(scenario.totalBTC) }} BTC</td>
                <td class="py-4 px-4 text-right font-mono font-bold text-secondary">${{ formatUSD(scenario.dollarValue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          <div v-for="scenario in priceScenarios" :key="scenario.price" class="bg-white/5 border border-white/10 rounded-xl p-4">
            <div class="text-lg font-bold mb-3">${{ formatUSD(scenario.price) }} BTC</div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-white/60">Collateral Owed:</span>
                <span class="font-mono text-red-400 ml-2">{{ formatBtcValue(scenario.collateralOwed) }}</span>
              </div>
              <div>
                <span class="text-white/60">You Keep:</span>
                <span class="font-mono text-green-400 ml-2">{{ formatBtcValue(scenario.youKeep) }}</span>
              </div>
              <div>
                <span class="text-white/60">Mined:</span>
                <span class="font-mono text-blue-400 ml-2">{{ miningYields.total }}</span>
              </div>
              <div>
                <span class="text-white/60">Total:</span>
                <span class="font-mono font-bold ml-2">{{ formatBtcValue(scenario.totalBTC) }}</span>
              </div>
              <div class="col-span-2 mt-2 pt-2 border-t border-white/10">
                <span class="text-white/60">Value:</span>
                <span class="font-mono font-bold text-secondary ml-2">${{ formatUSD(scenario.dollarValue) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Insight -->
        <div class="mt-8 bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
          <p class="text-green-400 font-bold mb-2">Key Insight</p>
          <p class="text-white/90">
            In all scenarios, you've built a mining operation that continues generating ~0.05 BTC annually after the loan term. The equipment is yours, debt-free.
          </p>
        </div>
      </div>
    </section>

    <!-- WHY THIS PARTNERSHIP -->
    <section class="px-4 py-16 lg:py-20">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
          Why This Partnership
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x1F512;</div>
            <h3 class="text-lg font-bold mb-2">Self-Custodial Loans</h3>
            <p class="text-white/70 text-sm">
              Your BTC never leaves the blockchain via DLC. No platform custody, no counterparty risk.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x1F4A7;</div>
            <h3 class="text-lg font-bold mb-2">100% Renewable Energy</h3>
            <p class="text-white/70 text-sm">
              Itaipu Dam hydroelectric in Paraguay. Clean, sustainable Bitcoin mining at scale.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x1F6E1;</div>
            <h3 class="text-lg font-bold mb-2">No Liquidations</h3>
            <p class="text-white/70 text-sm">
              Fixed-term DLC contracts, not margin positions. Your collateral is safe from market volatility.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x2699;</div>
            <h3 class="text-lg font-bold mb-2">Turnkey Operation</h3>
            <p class="text-white/70 text-sm">
              Sazmining handles hosting, maintenance, and everything operational. You just collect rewards.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x1F4B8;</div>
            <h3 class="text-lg font-bold mb-2">Weekly Payouts</h3>
            <p class="text-white/70 text-sm">
              Mining proceeds sent directly to your wallet every week. Instant liquidity.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x1F3C6;</div>
            <h3 class="text-lg font-bold mb-2">Own Your Equipment</h3>
            <p class="text-white/70 text-sm">
              Mining rigs are yours outright, debt-free after the loan term ends.
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
            This strategy involves multiple risk factors you should understand:
          </p>

          <ul class="space-y-3 text-white/80 text-sm">
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold flex-shrink-0">1.</span>
              <span><strong class="text-white">Smart Contract Risk:</strong> DLCs depend on Bitcoin script and oracle attestations. Potential bugs could affect loan settlement.</span>
            </li>
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold flex-shrink-0">2.</span>
              <span><strong class="text-white">Mining Difficulty Risk:</strong> Hashrate projections are estimates. Network difficulty increases could reduce mining yields.</span>
            </li>
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold flex-shrink-0">3.</span>
              <span><strong class="text-white">Hardware Depreciation Risk:</strong> ASICs lose value over time as newer, more efficient models are released.</span>
            </li>
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold flex-shrink-0">4.</span>
              <span><strong class="text-white">BTC Price Risk:</strong> Repayment amount in BTC varies with price. A significant price drop means repaying more of your collateral.</span>
            </li>
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold flex-shrink-0">5.</span>
              <span><strong class="text-white">Hosting Counterparty Risk:</strong> You rely on Sazmining facilities for operation. Facility issues could affect mining uptime.</span>
            </li>
          </ul>

          <p class="text-white/60 text-xs mt-4 pt-4 border-t border-yellow-500/30">
            Disclaimer: This is not financial advice. Mining projections are estimates based on current conditions. Only invest what you can afford to lose. Consult a financial advisor before making investment decisions.
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
          Common questions about the Cadena + Sazmining partnership
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
          Ready to Put Your Bitcoin to Work?
        </h2>
        <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-10">
          Unlock liquidity, build a mining operation, stack more sats.
        </p>
        <router-link
          :to="ctaLink"
          class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
        >
          <span>Get Started</span>
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
import { ref, computed, onMounted } from 'vue'
import TheFooter from '../../components/TheFooter.vue'
import { useAuth } from '../../composables/useAuth'
import { useBtcPrice } from '../../composables/useBtcPrice'
import { formatBtcValue } from '../../functions/amount_formatting'
import cadenaLogo from '../../assets/logos/cadena_bitcoin_logo_2.png'

const { isLoggedIn, setUserFromApi } = useAuth()
const ctaLink = computed(() => isLoggedIn.value ? '/btcusd' : '/register')

// FAQ accordion state
const openFaqIndex = ref(0)
const toggleFaq = (idx) => {
  openFaqIndex.value = openFaqIndex.value === idx ? -1 : idx
}

// BTC Price (shared singleton)
const { btcPriceUsd } = useBtcPrice()
const btcPriceRaw = computed(() => btcPriceUsd.value ?? 100000)

// Formatted price for display
const btcPriceFormatted = computed(() =>
  btcPriceRaw.value.toLocaleString(undefined, { maximumFractionDigits: 0 })
)

// Constants for Sazmining economics
const collateralBTC = 1.0
const ltvRatio = 0.50
const equipmentCostUSD = 34000
const setupReserveUSD = 3565

// Mining projections (conservative)
const miningYields = {
  year1: 0.117,
  year2: 0.101,
  year3: 0.051,
  total: 0.269
}

// Loan calculations
const loanAmount = computed(() => btcPriceRaw.value * collateralBTC * ltvRatio)

// Format USD helper
const formatUSD = (val) => val.toLocaleString(undefined, { maximumFractionDigits: 0 })

// Total loan repayment (principal + 3 years of 10.5% APR compounded)
const totalRepayment = computed(() => {
  const principal = loanAmount.value
  const rate = 0.105 // 10.5% APR
  const years = 3
  return principal * Math.pow(1 + rate, years)
})

// Price scenarios
const priceScenarios = computed(() => {
  const repayment = totalRepayment.value
  const minedBTC = miningYields.total

  return [
    { price: 150000 },
    { price: 100000 },
    { price: 70000 }
  ].map(s => {
    const collateralOwed = repayment / s.price
    const youKeep = Math.max(0, collateralBTC - collateralOwed)
    const totalBTC = youKeep + minedBTC
    const dollarValue = totalBTC * s.price
    return { ...s, collateralOwed, youKeep, totalBTC, dollarValue }
  })
})

// FAQ items
const faqItems = [
  {
    id: 'faq-1',
    title: 'How does the DLC keep my Bitcoin safe?',
    content: `Your Bitcoin is locked in a Discreet Log Contract (DLC) on the Bitcoin blockchain. It never leaves the chain or goes into platform custody. The DLC uses pre-signed transactions that can only execute based on oracle price attestations at maturity. No one - not Cadena, not Sazmining - can access your collateral outside the contract terms.`
  },
  {
    id: 'faq-2',
    title: 'What happens if Bitcoin crashes during the loan term?',
    content: `Unlike margin loans, there are no liquidations. Your collateral stays locked until maturity regardless of price movements. At maturity, you repay a fixed USD amount in BTC. If Bitcoin is worth less, you repay more BTC from your collateral. If Bitcoin is worth more, you repay less BTC and keep the difference.`
  },
  {
    id: 'faq-3',
    title: 'Can I visit or verify my mining equipment?',
    content: `Yes, Sazmining facilities in Paraguay are open for visits by appointment. You can verify your specific machines, serial numbers, and operational status. Sazmining also provides real-time monitoring dashboards showing your hashrate, uptime, and mining output.`
  },
  {
    id: 'faq-4',
    title: 'What are the ongoing costs after the loan?',
    content: `Sazmining takes a 15% revenue share from mining output - that's it. There are no additional electricity costs, maintenance fees, or hidden charges. After your loan term ends, you continue mining with the same 85/15 split. Equipment maintenance, repairs, and facility costs are all covered by Sazmining's share.`
  }
]

onMounted(() => {
  setUserFromApi()
  window.scrollTo(0, 0)
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
