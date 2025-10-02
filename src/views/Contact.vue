<template>
  <!-- Gradient Wrapper -->
  <div class="min-h-screen text-white relative overflow-hidden bg-page-gradient">
    <!-- Soft glows (no inline styles; CSP-safe) -->
    <div class="glow-purple" aria-hidden="true"></div>
    <div class="glow-cyan" aria-hidden="true"></div>

    <!-- Onboarding Section -->
    <section class="w-full pt-0 md:pt-0" aria-labelledby="onboarding-title">
      <div class="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 space-y-10">

        <!-- Eyebrow + Title + Lead -->
        <div class="text-center" v-reveal>
          <h1 id="onboarding-title" class="section-title">
            Personalized Onboarding
          </h1>

          <p class="lead max-w-4xl mx-auto">
            As a Cadena Bitcoin client, expert knowledge is always just a chat, email, or phone call away.
            We simplify complexity and are available 24/7 for personalized onboarding and strategies to
            borrow Bitcoin or generate yield from Bitcoin.
          </p>
        </div>

        <!-- Contact Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- Call -->
          <div class="pro-card group" v-reveal="{ delay: 60 }">
            <div class="flex items-start gap-4">
              <div class="icon-wrap">
                <Phone class="w-5 h-5" aria-hidden="true" />
              </div>
              <div class="flex-1">
                <h4 class="text-2xl font-semibold">Call</h4>
                <p class="text-sm text-white/70 mt-1">Speak to our team anytime.</p>

                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href="tel:+13058311410"
                    class="btn-primary"
                    aria-label="Call (305) 831-1410"
                  >
                    (305) 831-1410
                  </a>

                  <button
                    @click="copyPhone"
                    class="btn-ghost"
                    :aria-label="copiedPhone ? 'Copied phone number' : 'Copy phone number'"
                  >
                    <component :is="copiedPhone ? Check : Copy" class="w-4 h-4" />
                    <span class="text-sm font-medium">{{ copiedPhone ? 'Copied' : 'Copy' }}</span>
                  </button>
                </div>


                <div class="mt-4 flex items-center gap-3 text-xs text-white/60">
                  <span class="inline-flex items-center gap-1">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-400/80"></span> Live support
                  </span>
                  <span>Response time: &lt; 24h</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="pro-card group" v-reveal="{ delay: 100 }">
            <div class="flex items-start gap-4">
              <div class="icon-wrap">
                <Mail class="w-5 h-5" aria-hidden="true" />
              </div>
              <div class="flex-1">
                <h4 class="text-2xl font-semibold">Email</h4>
                <p class="text-sm text-white/70 mt-1">Send us your questions or request onboarding.</p>

                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href="mailto:info@cadenabitcoin.com"
                    class="btn-primary"
                    aria-label="Email info@cadenabitcoin.com"
                  >
                    info@cadenabitcoin.com
                  </a>

                  <button
                    @click="copyEmail"
                    class="btn-ghost"
                    :aria-label="copiedEmail ? 'Copied email' : 'Copy email'"
                  >
                    <component :is="copiedEmail ? Check : Copy" class="w-4 h-4" />
                    <span class="text-sm font-medium">{{ copiedEmail ? 'Copied' : 'Copy' }}</span>
                  </button>
                </div>


                <div class="mt-4 flex items-center gap-3 text-xs text-white/60">
                  <span>Dedicated onboarding specialist</span>
                  <span aria-hidden="true">•</span>
                  <span>Secure &amp; private</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Who we serve -->
    <section class="w-full px-6 py-16 md:py-20">
      <div class="max-w-6xl mx-auto space-y-10">
        <h2 class="section-title text-center" v-reveal>Who we serve.</h2>

        <div class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="reveal glass-tile card-tight text-center group" v-reveal="{ delay: 40 }">
              <User class="w-8 h-8 mx-auto mb-3 text-white/80 group-hover:text-white" aria-hidden="true" />
              <p class="text-xl font-semibold">Individual Investors</p>
            </div>
            <div class="reveal glass-tile card-tight text-center group" v-reveal="{ delay: 90 }">
              <Users class="w-8 h-8 mx-auto mb-3 text-white/80 group-hover:text-white" aria-hidden="true" />
              <p class="text-xl font-semibold">Family Offices</p>
            </div>
            <div class="reveal glass-tile card-tight text-center group" v-reveal="{ delay: 140 }">
              <Building2 class="w-8 h-8 mx-auto mb-3 text-white/80 group-hover:text-white" aria-hidden="true" />
              <p class="text-xl font-semibold">Institutional Investors</p>
            </div>
          </div>

          <div class="reveal glass-card text-center" v-reveal="{ delay: 180 }">
            <p class="text-2xl text-white/90">
              Get expert support and competitive rates for Bitcoin borrowing and lending.
            </p>
          </div>
        </div>
      </div>
    </section>
       <UseCasesAccordion :items="useCases" />

    <!-- Reach Out -->
    <section class="w-full px-6 pb-16 md:pb-24">
      <div class="max-w-6xl mx-auto space-y-12">
        <h2 class="section-title text-center" v-reveal>Reach Out</h2>

        <!-- Helpful prompt / CTA copy -->
       

        <!-- Socials -->
        <div class="reveal glass-card" v-reveal="{ delay: 60 }">
          <p class="text-2xl font-semibold mb-8 text-center">Find Us On Social Media</p>
          <div class="flex flex-wrap items-center justify-center gap-10 md:gap-12">
            <a
              href="https://x.com/cadenabitcoin"
              target="_blank"
              rel="noopener noreferrer nofollow"
              referrerpolicy="no-referrer"
              aria-label="Visit us on X (Twitter)"
              class="social-tile"
            >
              <i-simple-icons-x class="w-16 h-16 md:w-20 md:h-20" aria-hidden="true" />
              <span class="text-base font-medium">X</span>
            </a>

            <!-- Use your real GitHub org/user if available -->
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              referrerpolicy="no-referrer"
              aria-label="Visit our GitHub"
              class="social-tile"
            >
              <i-simple-icons-github class="w-16 h-16 md:w-20 md:h-20" aria-hidden="true" />
              <span class="text-base font-medium">GitHub</span>
            </a>

            <a
              href="https://youtube.com/@cadenabitcoin?si=VNgOLehpTTVFELbt"
              target="_blank"
              rel="noopener noreferrer nofollow"
              referrerpolicy="no-referrer"
              aria-label="Visit our YouTube"
              class="social-tile"
            >
              <i-simple-icons-youtube class="w-16 h-16 md:w-20 md:h-20" aria-hidden="true" />
              <span class="text-base font-medium">YouTube</span>
            </a>
          </div>
        </div>

        <!-- Contacts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="reveal glass-card" v-reveal="{ delay: 80 }">
            <div class="avatar-wrap mb-3">
              <img
                src="/img/kevinb-640.avif"
                srcset="/img/kevinb-640.avif 640w, /img/kevinb-960.avif 960w, /img/kevinb-1280.avif 1280w"
                sizes="(min-width: 768px) 192px, 160px"
                alt="Kevin Bell headshot"
                class="headshot"
                width="160" height="160"
                loading="lazy" decoding="async"
              />
            </div>
            <p class="text-xl font-semibold mb-1">Kevin Bell</p>
            <p class="text-sm text-white/70">President • CFA</p>
            <p class="mt-3 text-white/80 text-sm leading-relaxed">
              Kevin Bell, CFA — tradfi graduate, capital markets veteran, debt and currency dealer, and numbers ninja.
              Passionate about building efficient financial solutions that promote Bitcoin, freedom, decentralization,
              and individual empowerment.
            </p>
            <div class="mt-4 space-y-1">
              <p>
                <span class="font-medium">Email:</span>
                <a href="mailto:kevin@cadenabitcoin.com" class="underline hover:opacity-80">kevin@cadenabitcoin.com</a>
              </p>
              
            </div>
          </div>

          <div class="reveal glass-card" v-reveal="{ delay: 120 }">
            <div class="avatar-wrap mb-3">
              <img
                src="/img/Sz-640.avif"
                srcset="/img/Sz-640.avif 640w, /img/Sz-960.avif 960w, /img/Sz-1280.avif 1280w"
                sizes="(min-width: 768px) 192px, 160px"
                alt="Sziller headshot"
                class="headshot"
                width="160" height="160"
                loading="lazy" decoding="async"
              />
            </div>
            <p class="text-xl font-semibold mb-1">Sziller</p>
            <p class="text-sm text-white/70">Chief Technology Officer</p>
            <p class="mt-3 text-white/80 text-sm leading-relaxed">
              Sziller, an Engineer and M.Sc. Architect with decentralization and self-sufficiency on my mind.
              I’m interested in Engineering solutions for real-life problems accessible to anyone, with skunkswork
              philosophy. I strive to achieve optimal redundancy by cutting out as many middle-men as possible.
              I love solutions that work, even if rough on the edges.
            </p>
            <div class="mt-4 space-y-1">
              <p>
                <span class="font-medium">Email:</span>
                <a href="mailto:sziller@cadenabitcoin.com" class="underline hover:opacity-80">sziller@cadenabitcoin.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <TheFooter />
</template>

<script setup>
import TheFooter from '../components/TheFooter.vue'
import { onMounted, ref } from 'vue'
import { User, Users, Building2, Copy, Check, Phone, Mail } from 'lucide-vue-next'
import UseCasesAccordion from '../components/UseCasesAccordion.vue'
/** Copy states */
const copiedEmail = ref(false)
const copiedPhone = ref(false)
/** Legacy single-flag (kept for backward compatibility if another part of the page uses it) */
const copied = ref(false)

/** Copy helpers (no eval/innerHTML, clipboard feature-detected) */
function copyEmail() {
  copyToClipboard('info@cadenabitcoin.com', copiedEmail)
}
function copyPhone() {
  copyToClipboard('+13058311410', copiedPhone)
}
function copyToClipboard(text, flagRef) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => flash(flagRef))
      .catch(() => fallbackCopy(text, flagRef))
  } else {
    fallbackCopy(text, flagRef)
  }
}
function fallbackCopy(text, flagRef) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'absolute'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
    flash(flagRef)
  } finally {
    document.body.removeChild(ta)
  }
}
function flash(flagRef) {
  flagRef.value = true
  copied.value = true
  setTimeout(() => {
    flagRef.value = false
    copied.value = false
  }, 1500)
}

onMounted(() => {
  window.scrollTo(0, 0)
})

/** Intersection-based reveal directive (static delays only) */
const vReveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    const d = Number(binding?.value?.delay ?? 0)
    // clamp & sanitize delay (defense-in-depth)
    const delay = Number.isFinite(d) && d >= 0 && d <= 2000 ? d : 0
    el.style.transitionDelay = `${delay}ms`
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('in')
        io.unobserve(el)
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 })
    io.observe(el)
  }
}
const useCases = [
  {
    title: '“Mini Saylor” — Corporate Bitcoin Strategy',
    teaser: 'Amplify BTC exposure without selling or draining cash.',

    content: `
      <p class="text-white/80">You're a Bitcoin maximalist who believes BTC will outperform long-term, but you want to add exposure without selling your stack or depleting cash.</p>

      <p class="mt-4 font-semibold text-white">Meet Alex: The Bitcoin Entrepreneur</p>
      <p class="text-white/80">“I run a tech company and hold 5 BTC personally. I’m convinced Bitcoin will hit $500K, but I don’t want to sell or use all my business capital to buy more.”</p>

      <p class="mt-4 font-semibold text-white">The Cadena Solution — Leverage Your Conviction, Keep Your Keys</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>Decide how much additional exposure you want.</li>
        <li>Borrow additional Bitcoin based on risk tolerance and objectives.</li>
        <li>Use borrowed Bitcoin to increase your total position.</li>
        <li>Loan is settled in Bitcoin at term end (30, 90, 180 days, or 1 year).</li>
      </ul>

      <p class="mt-4 font-semibold text-white">The Process</p>
      <ol class="list-decimal pl-5 space-y-1 text-white/80">
        <li>Register on Cadena and download the signer app.</li>
        <li>Borrow additional Bitcoin at market rates (execute online, sign in app).</li>
        <li>Amplify your Bitcoin exposure without selling.</li>
        <li>Settle the loan in Bitcoin at maturity.</li>
      </ol>

      <p class="mt-4 font-semibold text-white">The Outcome</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>✅ Increase your exposure from 0.05 BTC up to 5× stack leverage.</li>
        <li>✅ No taxable event — you never sold your original stack.</li>
        <li>✅ True self-custody throughout.</li>
        <li>✅ No KYC or banks — pure peer-to-peer Bitcoin finance.</li>
      </ul>

      <p class="mt-4 italic text-white/75">“Just like MicroStrategy’s strategy, but truly decentralized.”</p>

      <a href="/register" class="btn-primary mt-5 inline-flex" aria-label="Get Started">Get Started →</a>
    `,
  },
  {
    title: '“Dividend Debbie” — Stable Bitcoin Yield',
    teaser: 'Predictable BTC-denominated yield with custody intact.',
    content: `
      <p class="text-white/80">You want steady returns above traditional savings, without bank counterparty risk—while staying aligned with Bitcoin’s long-term upside.</p>

      <p class="mt-4 font-semibold text-white">Meet Debbie: The Yield Seeker</p>
      <p class="text-white/80">“I have 10 BTC sitting idle. Banks offer 0.5% while taking huge risks with my money. I want steady Bitcoin-denominated returns with real security.”</p>

      <p class="mt-4 font-semibold text-white">The Cadena Solution — Earn Yield, Keep Control</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>Lend your Bitcoin on Cadena’s marketplace to earn fixed returns.</li>
        <li>Your Bitcoin is secured by math and Bitcoin collateral on-chain.</li>
        <li>No counterparty risk — borrower collateral protects your principal.</li>
        <li>You understand the risk of BTC moving below the loan-to-value over the term.</li>
      </ul>

      <p class="mt-4 font-semibold text-white">The Process</p>
      <ol class="list-decimal pl-5 space-y-1 text-white/80">
        <li>Register and download Cadena’s signer app.</li>
        <li>Choose lending terms (30, 90, 180 days, or 1 year).</li>
        <li>Set your desired yield rate; use a market or limit order.</li>
        <li>Match with borrowers.</li>
        <li>Earn Bitcoin-denominated returns.</li>
      </ol>

      <p class="mt-4 font-semibold text-white">The Outcome</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>✅ Predictable yield — fiat-style yield, denominated in Bitcoin.</li>
        <li>✅ Your keys, your coins — maintain custody.</li>
        <li>✅ No bank risk — peer-to-peer with mathematical security.</li>
      </ul>

      <p class="mt-4 italic text-white/75">“Like being a preferred shareholder in MicroStrategy, but with better security.”</p>

      <a href="/register" class="btn-primary mt-5 inline-flex" aria-label="Start Lending">Start Lending →</a>
    `,
  },
  {
    title: '“Borrowing for the Boat” — Liquidity Without Selling',
    teaser: 'Access $50K without selling BTC or triggering tax.',
    content: `
      <p class="text-white/80">You need $50,000 for a purchase but don’t want to sell BTC, miss potential upside, or trigger a taxable event.</p>

      <p class="mt-4 font-semibold text-white">Meet Captain Mike: The Bitcoin HODLer</p>
      <p class="text-white/80">“I need $50K for my dream boat, but selling Bitcoin feels like selling Amazon in 1999. There has to be a better way.”</p>

      <p class="mt-4 font-semibold text-white">The Cadena Solution — Access Liquidity, Keep Your Bitcoin</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>Use your Bitcoin as collateral for a Bitcoin loan.</li>
        <li>Borrow Bitcoin to maintain your desired exposure.</li>
        <li>Convert borrowed Bitcoin to USD for your purchase.</li>
        <li>Repay the loan by buying back Bitcoin at maturity.</li>
      </ul>

      <p class="mt-4 font-semibold text-white">The Process (example)</p>
      <ol class="list-decimal pl-5 space-y-1 text-white/80">
        <li>Borrow 0.5 BTC for 1 year (assuming BTCUSD = $100,000).</li>
        <li>Convert borrowed BTC to USD on your exchange of choice.</li>
        <li>Buy your boat with the proceeds.</li>
        <li>At term end, buy back $50,000 worth of Bitcoin and repay the loan.</li>
      </ol>

      <p class="mt-4 font-semibold text-white">The Outcome</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>✅ Get your boat without selling your stack.</li>
        <li>✅ Maintain upside — you still own your original BTC.</li>
        <li>✅ True self-custody — your keys, your control.</li>
        <li>• Conservative risk management: 50% LTV gives a wide buffer.</li>
        <li>• No margin calls: collateral only matters at final settlement.</li>
      </ul>

      <p class="mt-4 italic text-white/75">“Enjoy life today while staying positioned for Bitcoin’s future.”</p>

      <a href="/register" class="btn-primary mt-5 inline-flex" aria-label="Borrow Now">Borrow Now →</a>
    `,
  },
  {
    title: '“Yield Arber” — Advanced Bitcoin Strategies',
    teaser: 'Capture spreads while keeping BTC exposure.',
    content: `
      <p class="text-white/80">You’re sophisticated with capital and want to maximize returns by arbitraging between BTC lending rates and other opportunities—without sacrificing exposure.</p>

      <p class="mt-4 font-semibold text-white">Meet Sarah: The Yield Arbitrageur</p>
      <p class="text-white/80">“I see Cadena lenders earning ~10% while I can borrow fiat at ~5%, or have savings sitting idle. I want to increase the dollar value of my BTC position by earning yield on my stack.”</p>

      <p class="mt-4 font-semibold text-white">The Cadena Solution — The Spread Play</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>Lend Bitcoin on Cadena while borrowing fiat elsewhere at lower rates.</li>
        <li>✅ Maximize capital efficiency.</li>
        <li>✅ Maintain Bitcoin exposure.</li>
        <li>✅ Keep full custody — minimize counterparty risk.</li>
      </ul>

      <p class="mt-4 font-semibold text-white">Risk Considerations</p>
      <ul class="list-disc pl-5 space-y-1 text-white/80">
        <li>Leverage involves risk.</li>
        <li>Understand settlement mechanics.</li>
        <li>Plan for multiple BTC price scenarios.</li>
      </ul>

      <p class="mt-4 italic text-white/75">“For those who understand Bitcoin deeply and want to maximize every satoshi.”</p>

      <a href="/register" class="btn-primary mt-5 inline-flex" aria-label="Explore Opportunities">Explore Opportunities →</a>
    `,
  },
]
</script>

<style scoped>
/* ===== Page background (kept) ===== */
.bg-page-gradient{
  background-color: #000;
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

/* Soft glows (unchanged) */
.glow-purple,
.glow-cyan{
  position: absolute;
  pointer-events: none;
  z-index: -1;
  filter: blur(48px);
}
.glow-purple{
  left: -10%;
  bottom: 10%;
  width: 50rem;
  height: 20rem;
  opacity: .5;
  background: radial-gradient(40% 60% at 50% 50%, rgba(124,92,255,0.33), transparent 70%);
}
.glow-cyan{
  right: -10%;
  top: 10%;
  width: 40rem;
  height: 18rem;
  opacity: .4;
  background: radial-gradient(40% 60% at 50% 50%, rgba(22,177,255,0.27), transparent 70%);
}

/* ===== Type ===== */
.section-title{
  margin-top: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-size: clamp(2rem, 4vw + 1rem, 3.5rem);
}
.lead{
  margin-top: 1rem;
  font-size: clamp(1rem, 0.5vw + 0.9rem, 1.25rem);
  color: rgba(255,255,255,0.8);
}

/* ===== Cards: solid #0A1123 with #8387C4 accents ===== */
.pro-card,
.glass-card,
.glass-tile {
  position: relative;
  border-radius: 1.25rem;
  padding: 1.25rem;
  background: #0A1123;             /* ← solid */
  border: 1px solid #8387C4;       /* ← accent */
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  /* remove glass */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
/* remove gradient border layer entirely */
.pro-card::before,
.glass-card::before,
.glass-tile::before {
  content: none !important;
}
.pro-card:hover,
.glass-card:hover,
.glass-tile:hover {
  transform: translateY(-2px);
  border-color: #A4A8D6;           /* lighter accent on hover */
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
}

/* Social tiles: keep as plain icons (no card look) */
.social-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .75rem;
  text-align: center;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  padding: 0 !important;
}
.social-tile::before { content: none !important; }
.social-tile:hover {
  transform: none !important;
  background: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

/* Icon puck: match card background, accent border */
.icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px; height: 44px;
  border-radius: 0.875rem;
  background: #0A1123;
  border: 1px solid #8387C4;
  transition: transform .18s ease, border-color .18s ease;
}
.pro-card:hover .icon-wrap,
.glass-card:hover .icon-wrap,
.glass-tile:hover .icon-wrap {
  transform: translateY(-1px);
  border-color: #A4A8D6;
}

/* Buttons */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  padding: .625rem 1rem; border-radius: .75rem;
  background: #6738e4; color: white; font-weight: 600;
  box-shadow: 0 6px 14px rgba(103,56,228,.35);
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(103,56,228,.45); }
.btn-primary:focus-visible { outline: 2px solid rgba(255,255,255,.9); outline-offset: 2px; }

.btn-ghost {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .6rem .9rem; border-radius: .75rem;
  background: #0A1123;             /* solid */
  color: white;
  border: 1px solid #8387C4;       /* accent */
  transition: transform .15s ease, border-color .15s ease;
}
.btn-ghost:hover { transform: translateY(-1px); border-color: #A4A8D6; }
.btn-ghost:focus-visible { outline: 2px solid rgba(255,255,255,.85); outline-offset: 2px; }

/* Tighter padding option */
.card-tight { padding: 1rem; }

/* ===== Scroll reveal ===== */
.reveal {
  opacity: 0;
  transform: translateY(14px) scale(0.995);
  filter: blur(6px);
  transition:
    opacity .7s cubic-bezier(.2,.65,.2,1),
    transform .7s cubic-bezier(.2,.65,.2,1),
    filter .6s ease;
  will-change: opacity, transform, filter;
}
.reveal.in { opacity: 1; transform: none; filter: none; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; opacity: 1; transform: none; filter: none; }
  .pro-card, .btn-primary, .btn-ghost, .icon-wrap { transition: none; }
}

/* Neutralize text glow */
:deep(h1), :deep(h2), :deep(p), :deep(a), :deep(span) { text-shadow: 0 0 0 transparent; }

/* ===== Headshots ===== */
.avatar-wrap{ display:flex; justify-content:center; }
.headshot{
  width:160px; height:160px; border-radius:9999px; object-fit:cover; display:block;
  box-shadow:0 12px 28px rgba(0,0,0,.45);
  border: 1px solid #8387C4;       /* accent ring */
  background: #0A1123;             /* solid chip behind image */
}
@media (min-width: 768px){
  .headshot{ width:192px; height:192px; }
}
/* ============ Global spacing tokens (scoped to this page) ============ */
.bg-page-gradient{
  --space-1: .25rem;
  --space-2: .5rem;
  --space-3: .75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  --section-pad-y-sm: var(--space-12);
  --section-pad-y-md: var(--space-16);
  --stack-gap:        var(--space-8);   /* default vertical rhythm */
  --grid-gap:         var(--space-6);   /* default grid gap */
  --card-pad:         var(--space-5);   /* card internal padding */
}

/* ============ Sections: unify vertical padding ============ */
.bg-page-gradient section{
  padding-block: var(--section-pad-y-sm) !important;
}
@media (min-width: 768px){
  .bg-page-gradient section{
    padding-block: var(--section-pad-y-md) !important;
  }
}

/* ============ Wrappers: consistent vertical rhythm inside ============ */
/* Applies to both max-width wrappers you use */
.bg-page-gradient .max-w-screen-xl > * + *,
.bg-page-gradient .max-w-6xl > * + *{
  margin-top: var(--stack-gap) !important;
}

/* ============ Grids: consistent gaps ============ */
.bg-page-gradient .grid{
  row-gap: var(--grid-gap) !important;
  column-gap: var(--grid-gap) !important;
}

/* ============ Cards: consistent internal padding ============ */
.bg-page-gradient .pro-card,
.bg-page-gradient .glass-card,
.bg-page-gradient .glass-tile{
  padding: var(--card-pad) !important;
}

/* ============ Headings & lead: predictable spacing ============ */
.bg-page-gradient .section-title{
  margin-bottom: var(--space-4) !important;
}
.bg-page-gradient .lead{
  margin-top: var(--space-3) !important;
  margin-bottom: 0 !important;
}

/* Subtitles in contact cards */
.bg-page-gradient h4{
  margin: 0 0 var(--space-2) 0 !important;
}

/* ============ Stacks inside cards/panels ============ */
.bg-page-gradient .pro-card > * + *,
.bg-page-gradient .glass-card > * + *,
.bg-page-gradient .glass-tile > * + *{
  margin-top: var(--space-4) !important;
}

/* ============ Lists & paragraphs ============ */
.bg-page-gradient p{ margin: 0; }
.bg-page-gradient p + p,
.bg-page-gradient p + ul,
.bg-page-gradient p + ol,
.bg-page-gradient ul + p,
.bg-page-gradient ol + p{
  margin-top: var(--space-3) !important;
}
.bg-page-gradient ul,
.bg-page-gradient ol{
  margin: 0;
  padding-left: 1.25rem;
}
.bg-page-gradient li + li{
  margin-top: .35em;
}

/* ============ Button rows ============ */
.bg-page-gradient .pro-card .flex.flex-wrap.items-center.gap-3{
  gap: var(--space-3) !important;
  margin-top: var(--space-4) !important;
}

/* ============ “Who we serve” tiles spacing ============ */
.bg-page-gradient .card-tight{
  padding: var(--space-4) !important;
}
.bg-page-gradient .glass-card.text-center p.text-2xl{
  margin: 0 !important;
}

/* ============ Social block ============ */
.bg-page-gradient .social-tile{
  margin: 0 !important;
}
.bg-page-gradient .glass-card .flex.flex-wrap.items-center.justify-center{
  gap: var(--space-10) !important;
}

/* ============ Avatar blocks ============ */
.bg-page-gradient .avatar-wrap{ margin-bottom: var(--space-3) !important; }
.bg-page-gradient .headshot{ margin: 0; }
.bg-page-gradient .reveal.glass-card p.text-xl{ margin-bottom: var(--space-1) !important; }
.bg-page-gradient .reveal.glass-card p.text-sm.text-white\/70{ margin: 0 0 var(--space-3) 0 !important; }

/* ============ UseCasesAccordion spacing ============ */
/* The component already normalizes itself; just ensure outer margin matches */
.bg-page-gradient :is(UseCasesAccordion, .usecases-accordion){
  display: block;
  margin-block: var(--stack-gap) !important;
}

/* ============ Footer top spacing ============ */
.bg-page-gradient + TheFooter,
TheFooter{
  margin-top: var(--space-12) !important;
}

</style>

