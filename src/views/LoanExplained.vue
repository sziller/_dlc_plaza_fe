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
                Borrow Against<br />Your Bitcoin
              </h1>

              <!-- Checklist -->
              <ul class="flex flex-col gap-3 sm:gap-4 text-lg sm:text-xl">
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">Get liquidity today.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">No liquidations.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">No margin calls.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-white">No banks.</span>
                </li>
              </ul>

              <!-- CTA Button -->
              <div class="flex justify-center">
                <router-link
                  :to="ctaLink"
                  class="inline-flex items-center justify-center gap-3 sm:gap-4 rounded-full bg-secondary px-7 py-3 text-base md:text-lg font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none min-w-[200px]"
                >
                  Get Started
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
          How It Works
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold">1</span>
            </div>
            <h3 class="text-xl font-bold mb-3">Lock</h3>
            <p class="text-white/80">
              Lock your Bitcoin as collateral in a secure, non-custodial smart contract. You keep your keys.
            </p>
          </div>
          <!-- Step 2 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold">2</span>
            </div>
            <h3 class="text-xl font-bold mb-3">Receive</h3>
            <p class="text-white/80">
              Get liquidity upfront. Interest is deducted at the start, so there are no monthly payments.
            </p>
          </div>
          <!-- Step 3 -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold">3</span>
            </div>
            <h3 class="text-xl font-bold mb-3">Settle</h3>
            <p class="text-white/80">
              At maturity, the lender gets their fixed claim. You automatically get back the rest of your Bitcoin.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONCRETE EXAMPLE -->
    <section class="px-4 py-16 lg:py-20 bg-white/[0.02]">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          See It In Action
        </h2>
        <p class="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          A real example showing exactly how a Cadena loan works from start to finish.
        </p>

        <div class="bg-secondary/20 border border-secondary/40 rounded-3xl p-6 sm:p-10">
          <!-- Example Header -->
          <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-10 text-center">
            <div class="bg-black/30 rounded-xl px-5 py-3">
              <div class="text-white/60 text-sm">Collateral</div>
              <div class="text-2xl font-bold">1 BTC</div>
            </div>
            <div class="bg-black/30 rounded-xl px-5 py-3">
              <div class="text-white/60 text-sm">BTC Price</div>
              <div class="text-2xl font-bold">${{ btcPriceFormatted }}</div>
            </div>
            <div class="bg-black/30 rounded-xl px-5 py-3">
              <div class="text-white/60 text-sm">Loan-to-Value</div>
              <div class="text-2xl font-bold">50%</div>
            </div>
          </div>

          <!-- Liquidity Highlight -->
          <div class="mb-8 text-center">
            <div class="inline-block bg-gradient-to-r from-secondary/20 to-purple-600/20 border border-secondary/40 rounded-2xl px-8 py-6">
              <p class="text-white/70 text-sm uppercase tracking-wide mb-2">You Receive Today</p>
              <p class="text-3xl sm:text-4xl font-bold text-white mb-1">
                ${{ formatUSD(borrowerReceivesUSD) }}
              </p>
              <p class="text-white/60 text-sm">worth of liquidity at current prices</p>
            </div>
          </div>

          <!-- Loan Breakdown -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- What You Get -->
            <div class="bg-black/20 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-secondary mb-4">What You Get Today</h3>
              <div class="space-y-3 text-white/90">
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Loan Amount (50% of 1 BTC)</span>
                  <span class="font-mono font-bold">0.500 BTC</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Minus Interest (10% APR)</span>
                  <span class="font-mono text-white/60">-0.050 BTC</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span>Minus Cadena Fee</span>
                  <span class="font-mono text-white/60">-0.005 BTC</span>
                </div>
                <div class="flex justify-between items-center py-3 bg-secondary/30 rounded-lg px-3 -mx-3">
                  <span class="font-bold">You Receive</span>
                  <span class="font-mono font-bold text-xl">0.445 BTC</span>
                </div>
              </div>
            </div>

            <!-- Lender's Claim -->
            <div class="bg-black/20 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-secondary mb-4">At Maturity</h3>
              <div class="space-y-4 text-white/90">
                <p>
                  The lender has a fixed claim on <strong>${{ formatUSD(lenderClaimUSD) }} worth of Bitcoin</strong> at settlement.
                </p>
                <p>
                  An oracle reports the BTC price. The lender gets exactly ${{ formatUSD(lenderClaimUSD) }} in BTC value. <strong>You get back whatever is left.</strong>
                </p>
                <div class="bg-secondary/20 border border-secondary/30 rounded-xl p-4 mt-4">
                  <p class="text-sm text-white/80">
                    <strong>Key insight:</strong> If Bitcoin's price goes up, you keep more of your collateral. If it goes down, the lender takes more, but there are no margin calls or liquidations during the loan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHAT YOU GET (BENEFITS) -->
    <section class="px-4 py-16 lg:py-20">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
          What You Get as a Borrower
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">$</div>
            <h3 class="text-lg font-bold mb-2">Immediate Liquidity</h3>
            <p class="text-white/70 text-sm">
              Receive Bitcoin you can sell, spend, or use however you want. No waiting.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x2191;</div>
            <h3 class="text-lg font-bold mb-2">Keep Your Upside</h3>
            <p class="text-white/70 text-sm">
              Your collateral stays exposed to Bitcoin's price. If BTC moons, you benefit.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x2717;</div>
            <h3 class="text-lg font-bold mb-2">No Liquidations</h3>
            <p class="text-white/70 text-sm">
              No margin calls. No forced selling. Your loan runs to maturity no matter what.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x21BB;</div>
            <h3 class="text-lg font-bold mb-2">Automatic Settlement</h3>
            <p class="text-white/70 text-sm">
              No repayment actions needed. The contract settles automatically at maturity.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x1F511;</div>
            <h3 class="text-lg font-bold mb-2">Your Keys, Your Coins</h3>
            <p class="text-white/70 text-sm">
              Truly non-custodial. Cadena never takes possession of your Bitcoin.
            </p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <div class="text-secondary text-3xl mb-4">&#x26D3;</div>
            <h3 class="text-lg font-bold mb-2">On-Chain Security</h3>
            <p class="text-white/70 text-sm">
              Secured by DLC technology on the Bitcoin blockchain. No sidechains or wrapped tokens.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SETTLEMENT SCENARIOS -->
    <section class="px-4 py-16 lg:py-20 bg-white/[0.02]">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          What Happens at Settlement?
        </h2>
        <p class="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          See how your loan settles based on Bitcoin's price at maturity. Lender always gets their ${{ formatUSD(lenderClaimUSD) }} worth of BTC. You get the rest.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Scenario: BTC Rises -->
          <div class="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-green-400 text-2xl">&#x2191;</span>
              <h3 class="text-lg font-bold text-green-400">If BTC Rises to ${{ formatUSD(scenarios.rise.price) }}</h3>
            </div>
            <div class="space-y-2 text-white/80">
              <div class="flex justify-between">
                <span>Lender gets:</span>
                <span class="font-mono">{{ scenarios.rise.lenderBTC.toFixed(3) }} BTC (${{ formatUSD(lenderClaimUSD) }})</span>
              </div>
              <div class="flex justify-between text-green-400 font-bold">
                <span>You get back:</span>
                <span class="font-mono">{{ scenarios.rise.borrowerBTC.toFixed(3) }} BTC (${{ formatUSD(scenarios.rise.borrowerUSD) }})</span>
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
                <span>Lender gets:</span>
                <span class="font-mono">{{ scenarios.flat.lenderBTC.toFixed(3) }} BTC (${{ formatUSD(lenderClaimUSD) }})</span>
              </div>
              <div class="flex justify-between font-bold">
                <span>You get back:</span>
                <span class="font-mono">{{ scenarios.flat.borrowerBTC.toFixed(3) }} BTC (${{ formatUSD(scenarios.flat.borrowerUSD) }})</span>
              </div>
            </div>
          </div>

          <!-- Scenario: BTC Falls -->
          <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-yellow-400 text-2xl">&#x2193;</span>
              <h3 class="text-lg font-bold text-yellow-400">If BTC Falls to ${{ formatUSD(scenarios.drop.price) }}</h3>
            </div>
            <div class="space-y-2 text-white/80">
              <div class="flex justify-between">
                <span>Lender gets:</span>
                <span class="font-mono">{{ scenarios.drop.lenderBTC.toFixed(3) }} BTC (${{ formatUSD(lenderClaimUSD) }})</span>
              </div>
              <div class="flex justify-between text-yellow-400 font-bold">
                <span>You get back:</span>
                <span class="font-mono">{{ scenarios.drop.borrowerBTC.toFixed(3) }} BTC (${{ formatUSD(scenarios.drop.borrowerUSD) }})</span>
              </div>
            </div>
          </div>

          <!-- Scenario: BTC Crashes -->
          <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-red-400 text-2xl">&#x2193;&#x2193;</span>
              <h3 class="text-lg font-bold text-red-400">If BTC Falls to ${{ formatUSD(scenarios.crash.price) }}</h3>
            </div>
            <div class="space-y-2 text-white/80">
              <div class="flex justify-between">
                <span>Lender gets:</span>
                <span class="font-mono">{{ scenarios.crash.lenderBTC.toFixed(3) }} BTC (${{ formatUSD(lenderClaimUSD) }})</span>
              </div>
              <div class="flex justify-between text-red-400 font-bold">
                <span>You get back:</span>
                <span class="font-mono">{{ scenarios.crash.borrowerBTC.toFixed(3) }} BTC ($0)</span>
              </div>
            </div>
            <p class="text-xs text-white/50 mt-3">
              Even in this scenario, there are no margin calls or forced liquidations during the loan term.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="bg-gradient-to-br from-secondary via-secondary to-purple-700 text-white py-20 px-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div class="max-w-4xl mx-auto relative text-center">
        <h2 class="text-3xl md:text-5xl font-extrabold mb-6">
          Ready to Unlock Your Bitcoin's Value?
        </h2>
        <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-10">
          Get liquidity without selling. Keep your upside. No liquidations, no banks, no middlemen.
        </p>
        <router-link
          :to="ctaLink"
          class="inline-flex items-center gap-3 rounded-full bg-white text-secondary font-bold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
        >
          <span>Create Your Account</span>
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

// Loan calculations (50% LTV, 10% interest, 0.005 BTC fee)
const loanNotionalBTC = 0.5
const interestBTC = 0.05
const feeBTC = 0.005
const borrowerReceivesBTC = loanNotionalBTC - interestBTC - feeBTC // 0.445

// USD values based on current price
const lenderClaimUSD = computed(() => btcPriceRaw.value * 0.5)
const borrowerReceivesUSD = computed(() => borrowerReceivesBTC * btcPriceRaw.value)

// Format USD helper
const formatUSD = (val) => val.toLocaleString(undefined, { maximumFractionDigits: 0 })

// Settlement scenarios (relative to current price)
const scenarios = computed(() => {
  const price = btcPriceRaw.value
  const claim = lenderClaimUSD.value

  const rise = {
    price: price * 1.5,
    lenderBTC: claim / (price * 1.5),
    borrowerBTC: 1 - (claim / (price * 1.5)),
    borrowerUSD: (1 - (claim / (price * 1.5))) * (price * 1.5)
  }

  const flat = {
    price: price,
    lenderBTC: 0.5,
    borrowerBTC: 0.5,
    borrowerUSD: 0.5 * price
  }

  const drop = {
    price: price * 0.7,
    lenderBTC: claim / (price * 0.7),
    borrowerBTC: 1 - (claim / (price * 0.7)),
    borrowerUSD: (1 - (claim / (price * 0.7))) * (price * 0.7)
  }

  const crash = {
    price: price * 0.5,
    lenderBTC: 1,
    borrowerBTC: 0,
    borrowerUSD: 0
  }

  return { rise, flat, drop, crash }
})

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
