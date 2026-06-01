<template>
  <div class="contact-root min-h-screen text-white">
    <div class="bg-fixed-gradient" aria-hidden="true"></div>

    <!-- ONBOARDING -->
    <section class="top-section" aria-labelledby="onboarding-title">
      <div class="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="text-center">
          <h1 id="onboarding-title" class="section-title">Personalized Onboarding</h1>
          <p class="lead max-w-3xl mx-auto mt-4">
            Expert knowledge is always just a chat, email, or phone call away. We simplify complexity
            and are available 24/7 for personalized onboarding and strategies to borrow Bitcoin or generate yield from Bitcoin.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <!-- Book Demo -->
          <div class="c-card">
            <div class="c-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            </div>
            <div>
              <h4 class="c-card-title">Book a Demo</h4>
              <p class="c-card-desc">Schedule a 30-minute meeting with the Cadena team.</p>
              <a
                href="https://calendly.com/cadenabitcoin-info/30min?month=2026-01"
                class="btn-primary mt-5 inline-flex items-center gap-2"
                target="_blank" rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
                Schedule a Meeting
              </a>
            </div>
          </div>

          <!-- Email -->
          <div class="c-card">
            <div class="c-card-icon">
              <Mail class="w-5 h-5" aria-hidden="true" />
            </div>
            <div class="flex-1">
              <h4 class="c-card-title">Email</h4>
              <p class="c-card-desc">Send us your questions or request onboarding.</p>
              <div class="mt-5 flex flex-wrap items-center gap-3">
                <a href="mailto:info@cadenabitcoin.com" class="btn-primary" aria-label="Email info@cadenabitcoin.com">
                  info@cadenabitcoin.com
                </a>
                <button @click="copyEmail" class="btn-ghost" :aria-label="copiedEmail ? 'Copied' : 'Copy email'">
                  <component :is="copiedEmail ? Check : Copy" class="w-4 h-4" />
                  <span class="text-sm font-medium">{{ copiedEmail ? 'Copied' : 'Copy' }}</span>
                </button>
              </div>
              <p class="mt-4 text-xs text-white/60">Dedicated onboarding specialist · Secure &amp; private</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHO WE SERVE -->
    <section class="px-6 py-10 md:py-14" aria-labelledby="serve-title">
      <div class="max-w-screen-xl mx-auto">
        <div class="text-center mb-3" v-reveal>
          <p class="eyebrow">Who We Serve</p>
          <h2 id="serve-title" class="section-title mt-2">Built for every<br class="hidden sm:block"/> Bitcoin investor</h2>
          <p class="lead max-w-2xl mx-auto mt-4">Get expert support and competitive rates for Bitcoin borrowing and lending — regardless of portfolio size.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          <!-- Individual -->
          <div class="serve-card" v-reveal="{ delay: 60 }">
            <div class="serve-icon">
              <User class="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 class="serve-title">Individual Investors</h3>
            <p class="serve-desc">Bitcoin holders looking to access liquidity or earn fixed yield without surrendering self-custody.</p>
            <ul class="serve-list">
              <li>Borrow from $1,000 USD — no credit check</li>
              <li>Up to 50% LTV with no margin calls</li>
              <li>Earn ~11% APY lending your idle stack</li>
            </ul>
            <router-link to="/btcusd" class="serve-cta">Get Started →</router-link>
          </div>

          <!-- Family Offices -->
          <div class="serve-card serve-card-featured" v-reveal="{ delay: 120 }">
            <div class="serve-icon">
              <Users class="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 class="serve-title">Family Offices</h3>
            <p class="serve-desc">Sophisticated investors managing significant Bitcoin holdings across multiple strategies and beneficiaries.</p>
            <ul class="serve-list">
              <li>Dedicated relationship manager</li>
              <li>Multi-strategy borrowing &amp; lending</li>
              <li>Priority matching &amp; competitive rates</li>
            </ul>
            <a href="mailto:info@cadenabitcoin.com" class="serve-cta">Contact Us →</a>
          </div>

          <!-- Institutional -->
          <div class="serve-card" v-reveal="{ delay: 180 }">
            <div class="serve-icon">
              <Building2 class="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 class="serve-title">Institutional Investors</h3>
            <p class="serve-desc">Funds, treasuries, and regulated entities requiring bespoke terms, scale, and compliance-ready documentation.</p>
            <ul class="serve-list">
              <li>Custom loan sizes &amp; terms</li>
              <li>White-glove onboarding process</li>
              <li>API access &amp; reporting on request</li>
            </ul>
            <a
              href="https://calendly.com/cadenabitcoin-info/30min?month=2026-01"
              target="_blank" rel="noopener"
              class="serve-cta"
            >Book a Call →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- USE CASES -->
    <section class="px-6 py-10 md:py-14" aria-labelledby="usecases-title">
      <div class="max-w-screen-xl mx-auto">
        <div class="text-center mb-12" v-reveal>
          <p class="eyebrow">Real Scenarios</p>
          <h2 id="usecases-title" class="section-title mt-2">Use Cases</h2>
          <p class="lead max-w-2xl mx-auto mt-4">See how different Bitcoin investors use Cadena to achieve their financial goals.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Mini Saylor -->
          <div class="uc-card" v-reveal="{ delay: 60 }">
            <div class="uc-tag uc-tag-borrow">Borrower</div>
            <h3 class="uc-title">Leverage Your Conviction</h3>
            <p class="uc-persona">The "Mini Saylor" — Corporate Bitcoin Strategy</p>
            <p class="uc-desc">Amplify your BTC exposure without selling your stack or depleting business capital. Just like MicroStrategy's strategy, but truly non-custodial.</p>
            <ul class="uc-list">
              <li>Increase exposure up to 5× your current stack</li>
              <li>No taxable event — your original stack stays intact</li>
              <li>True self-custody throughout the loan term</li>
            </ul>
            <router-link to="/btcusd" class="btn-primary mt-auto inline-flex">Get Started →</router-link>
          </div>

          <!-- Dividend Debbie -->
          <div class="uc-card" v-reveal="{ delay: 100 }">
            <div class="uc-tag uc-tag-lend">Lender</div>
            <h3 class="uc-title">Earn Fixed Bitcoin Yield</h3>
            <p class="uc-persona">"Dividend Debbie" — Stable Bitcoin Yield</p>
            <p class="uc-desc">Put your idle Bitcoin to work earning ~11% APY with mathematical security. Predictable, Bitcoin-denominated returns — no bank counterparty risk.</p>
            <ul class="uc-list">
              <li>~10–11% APY denominated in Bitcoin</li>
              <li>Your keys, your coins — maintain full custody</li>
              <li>Secured by on-chain DLC collateral</li>
            </ul>
            <router-link to="/btcusd" class="btn-primary mt-auto inline-flex">Start Lending →</router-link>
          </div>

          <!-- Boat Liquidity -->
          <div class="uc-card" v-reveal="{ delay: 140 }">
            <div class="uc-tag uc-tag-borrow">Borrower</div>
            <h3 class="uc-title">Access Liquidity Without Selling</h3>
            <p class="uc-persona">"Borrowing for the Boat" — Liquidity Without Selling</p>
            <p class="uc-desc">Need $50K for a big purchase? Borrow against your Bitcoin and keep every sat. No capital gains, no missed upside.</p>
            <ul class="uc-list">
              <li>Access up to 50% of your BTC value as liquidity</li>
              <li>No margin calls — collateral only matters at settlement</li>
              <li>Keep full BTC price upside throughout the term</li>
            </ul>
            <router-link to="/btcusd" class="btn-primary mt-auto inline-flex">Borrow Now →</router-link>
          </div>

          <!-- Yield Arber -->
          <div class="uc-card" v-reveal="{ delay: 180 }">
            <div class="uc-tag uc-tag-both">Borrower &amp; Lender</div>
            <h3 class="uc-title">Advanced Yield Strategies</h3>
            <p class="uc-persona">"Yield Arber" — Advanced Bitcoin Strategies</p>
            <p class="uc-desc">Sophisticated investors can capture spread between Cadena lending rates and cheaper fiat borrowing — all while maintaining maximum Bitcoin exposure.</p>
            <ul class="uc-list">
              <li>Capture rate spreads while staying long BTC</li>
              <li>Maximize capital efficiency across positions</li>
              <li>Minimize counterparty risk with full on-chain custody</li>
            </ul>
            <a
              href="https://calendly.com/cadenabitcoin-info/30min?month=2026-01"
              target="_blank" rel="noopener"
              class="btn-primary mt-auto inline-flex"
            >Explore Opportunities →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- REACH OUT -->
    <section class="w-full px-6 pb-16 md:pb-20" aria-labelledby="reach-title">
      <div class="max-w-6xl mx-auto space-y-8">
        <h2 id="reach-title" class="section-title text-center" v-reveal>Reach Out</h2>

        <!-- Socials -->
        <div class="glass-card" v-reveal="{ delay: 60 }">
          <p class="text-2xl font-semibold mb-8 text-center">Find Us On Social Media</p>
          <div class="flex flex-wrap items-center justify-center gap-10 md:gap-12">
            <a href="https://x.com/cadenabitcoin" target="_blank" rel="noopener noreferrer nofollow" referrerpolicy="no-referrer" aria-label="Visit us on X (Twitter)" class="social-tile">
              <i-simple-icons-x class="w-16 h-16 md:w-20 md:h-20" aria-hidden="true"></i-simple-icons-x>
              <span class="text-base font-medium">X</span>
            </a>
            <a href="https://github.com/CadenaWizard/cryptlib" target="_blank" rel="noopener noreferrer nofollow" referrerpolicy="no-referrer" aria-label="Visit our GitHub repository" class="social-tile">
              <i-simple-icons-github class="w-16 h-16 md:w-20 md:h-20" aria-hidden="true"></i-simple-icons-github>
              <span class="text-base font-medium">GitHub</span>
            </a>
            <a href="https://youtube.com/@cadenabitcoin?si=VNgOLehpTTVFELbt" target="_blank" rel="noopener noreferrer nofollow" referrerpolicy="no-referrer" aria-label="Visit our YouTube" class="social-tile">
              <i-simple-icons-youtube class="w-16 h-16 md:w-20 md:h-20" aria-hidden="true"></i-simple-icons-youtube>
              <span class="text-base font-medium">YouTube</span>
            </a>
            <a href="https://discord.gg/RPUa6q7cs" target="_blank" rel="noopener noreferrer nofollow" referrerpolicy="no-referrer" aria-label="Join our Discord" class="social-tile">
              <i-simple-icons-discord class="w-16 h-16 md:w-20 md:h-20" aria-hidden="true"></i-simple-icons-discord>
              <span class="text-base font-medium">Discord</span>
            </a>
          </div>
        </div>

        <!-- Team -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="glass-card" v-reveal="{ delay: 80 }">
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
            <p class="text-sm" style="color:rgba(255,255,255,0.7)">President · CFA</p>
            <p class="mt-3 text-sm leading-relaxed" style="color:rgba(255,255,255,0.8)">
              Kevin Bell, CFA — tradfi graduate, capital markets veteran, debt and currency dealer, and numbers ninja.
              Passionate about building efficient financial solutions that promote Bitcoin, freedom, decentralization,
              and individual empowerment.
            </p>
            <div class="mt-4">
              <p><span class="font-medium">Email:</span> <a href="mailto:kevin@cadenabitcoin.com" class="underline hover:opacity-80">kevin@cadenabitcoin.com</a></p>
            </div>
          </div>

          <div class="glass-card" v-reveal="{ delay: 120 }">
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
            <p class="text-sm" style="color:rgba(255,255,255,0.7)">Chief Technology Officer</p>
            <p class="mt-3 text-sm leading-relaxed" style="color:rgba(255,255,255,0.8)">
              Sziller, an Engineer and M.Sc. Architect with decentralization and self-sufficiency on my mind.
              I'm interested in Engineering solutions for real-life problems accessible to anyone, with skunkswork
              philosophy. I strive to achieve optimal redundancy by cutting out as many middle-men as possible.
              I love solutions that work, even if rough on the edges.
            </p>
            <div class="mt-4">
              <p><span class="font-medium">Email:</span> <a href="mailto:sziller@cadenabitcoin.com" class="underline hover:opacity-80">sziller@cadenabitcoin.com</a></p>
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
import { User, Users, Building2, Copy, Check, Mail } from 'lucide-vue-next'

const copiedEmail = ref(false)
const copied = ref(false)

function copyEmail() { copyToClipboard('info@cadenabitcoin.com', copiedEmail) }

function copyToClipboard(text, flagRef) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => flash(flagRef)).catch(() => fallbackCopy(text, flagRef))
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
  try { document.execCommand('copy'); flash(flagRef) } finally { document.body.removeChild(ta) }
}
function flash(flagRef) {
  flagRef.value = true
  copied.value = true
  setTimeout(() => { flagRef.value = false; copied.value = false }, 1500)
}

onMounted(() => { window.scrollTo(0, 0) })

const vReveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    const d = Number(binding?.value?.delay ?? 0)
    const delay = Number.isFinite(d) && d >= 0 && d <= 2000 ? d : 0
    el.style.transitionDelay = `${delay}ms`
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('in'); io.unobserve(el) }
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 })
    io.observe(el)
  }
}
</script>

<style scoped>
/* ── Page background ── */
.contact-root { background: transparent; position: relative; }
.bg-fixed-gradient {
  position: fixed; inset: 0; z-index: -10; pointer-events: none;
  background-color: #081123;
  background-image: radial-gradient(
    110% 60% at 50% 100%,
    rgba(103,56,228,0.45) 0%,
    rgba(103,56,228,0.22) 35%,
    rgba(103,56,228,0.08) 60%,
    transparent 80%
  );
}

/* ── Top section (accounts for fixed nav) ── */
.top-section {
  padding-top: calc(var(--nav-h, 80px) + 2.5rem);
  padding-bottom: 3rem;
}

/* ── Typography ── */
.section-title {
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-size: clamp(2rem, 4vw + 0.5rem, 3.2rem);
  color: #fff;
}
.eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6738e3;
}
.lead {
  font-size: clamp(1rem, 0.5vw + 0.9rem, 1.2rem);
  color: rgba(255,255,255,0.8);
  line-height: 1.65;
}

/* ── Base card ── */
.c-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.75rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(131,135,196,0.35);
  border-radius: 1.25rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.c-card:hover {
  border-color: rgba(131,135,196,0.65);
  box-shadow: 0 12px 32px rgba(0,0,0,0.3);
}
.c-card-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 42px; height: 42px; flex-shrink: 0;
  background: rgba(103,56,228,0.12);
  border: 1px solid rgba(103,56,228,0.35);
  border-radius: 0.75rem;
  color: #8387c3;
}
.c-card-title { font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem; }
.c-card-desc { font-size: 0.9rem; color: rgba(255,255,255,0.65); }

/* ── Who We Serve cards ── */
.serve-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 2rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(131,135,196,0.3);
  border-radius: 1.25rem;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.serve-card:hover {
  border-color: rgba(131,135,196,0.6);
  box-shadow: 0 16px 40px rgba(0,0,0,0.3);
  transform: translateY(-2px);
}
.serve-card-featured {
  border-color: rgba(103,56,228,0.5);
  background: rgba(103,56,228,0.06);
}
.serve-card-featured:hover { border-color: rgba(103,56,228,0.8); }
.serve-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; margin-bottom: 1.25rem; flex-shrink: 0;
  background: rgba(103,56,228,0.15);
  border: 1px solid rgba(103,56,228,0.4);
  border-radius: 0.75rem;
  color: #8387c3;
}
.serve-title { font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.6rem; }
.serve-desc { font-size: 0.875rem; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 1.25rem; }
.serve-list {
  list-style: none; padding: 0; margin: 0 0 1.5rem 0;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.serve-list li {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.8);
  padding-left: 1.1rem;
  position: relative;
}
.serve-list li::before {
  content: '→';
  position: absolute; left: 0;
  color: #6738e3;
  font-size: 0.75rem;
}
.serve-cta {
  margin-top: auto;
  display: inline-flex;
  font-size: 0.85rem;
  font-weight: 600;
  color: #8387c3;
  transition: color 0.15s;
  text-decoration: none;
}
.serve-cta:hover { color: #fff; }

/* ── Use Case cards ── */
.uc-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 2rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(131,135,196,0.3);
  border-left: 3px solid #6738e3;
  border-radius: 1.25rem;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.uc-card:hover {
  border-color: rgba(131,135,196,0.6);
  border-left-color: #8b5cf6;
  box-shadow: 0 16px 40px rgba(0,0,0,0.3);
  transform: translateY(-2px);
}
.uc-tag {
  display: inline-flex;
  align-self: flex-start;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: 0.35rem;
  margin-bottom: 1rem;
}
.uc-tag-borrow { background: rgba(103,56,228,0.2); color: #a78bfa; border: 1px solid rgba(103,56,228,0.4); }
.uc-tag-lend   { background: rgba(34,197,94,0.15); color: #86efac; border: 1px solid rgba(34,197,94,0.3); }
.uc-tag-both   { background: rgba(251,191,36,0.12); color: #fde68a; border: 1px solid rgba(251,191,36,0.25); }
.uc-title { font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 0.3rem; }
.uc-persona { font-size: 0.75rem; font-weight: 600; color: #6738e3; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.85rem; }
.uc-desc { font-size: 0.875rem; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 1.25rem; }
.uc-list {
  list-style: none; padding: 0; margin: 0 0 1.75rem 0;
  display: flex; flex-direction: column; gap: 0.5rem;
  flex: 1;
}
.uc-list li {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.8);
  padding-left: 1.1rem;
  position: relative;
}
.uc-list li::before {
  content: '✓';
  position: absolute; left: 0;
  color: #6738e3;
  font-size: 0.75rem;
  font-weight: 700;
}

/* ── Buttons ── */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
  padding: 0.625rem 1.1rem; border-radius: 0.75rem;
  background: #6738e4; color: #fff; font-weight: 600; font-size: 0.9rem;
  transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
  text-decoration: none;
}
.btn-primary:hover { background: #7a4af0; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(103,56,228,0.4); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 0.9rem; border-radius: 0.75rem;
  background: rgba(255,255,255,0.04);
  color: #fff; font-size: 0.9rem;
  border: 1px solid rgba(131,135,196,0.4);
  transition: border-color 0.15s, transform 0.15s;
  text-decoration: none;
}
.btn-ghost:hover { border-color: rgba(131,135,196,0.75); transform: translateY(-1px); }

/* ── Social tiles ── */
.social-tile {
  display: flex; flex-direction: column; align-items: center;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  transition: color 0.2s, transform 0.2s;
}
.social-tile:hover { color: #fff; transform: translateY(-2px); }

/* ── Headshots ── */
.headshot {
  width: 160px; height: 160px; border-radius: 9999px; object-fit: cover;
  border: 1px solid rgba(131,135,196,0.4);
  background: #0A1123;
}

/* ── Reveal animation ── */
.reveal {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.65s cubic-bezier(.2,.65,.2,1), transform 0.65s cubic-bezier(.2,.65,.2,1);
  will-change: opacity, transform;
}
.reveal.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; opacity: 1; transform: none; }
}

/* ── Glass card (original Reach Out style) ── */
.glass-card {
  position: relative;
  border-radius: 1.25rem;
  padding: 1.5rem;
  background: #0A1123;
  border: 1px solid #8387C4;
  box-shadow: 0 12px 30px rgba(0,0,0,0.25);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.glass-card:hover {
  transform: translateY(-2px);
  border-color: #A4A8D6;
  box-shadow: 0 16px 36px rgba(0,0,0,0.28);
}

/* ── Headshots ── */
.avatar-wrap { display: flex; justify-content: center; }
.headshot {
  width: 160px; height: 160px; border-radius: 9999px; object-fit: cover; display: block;
  box-shadow: 0 12px 28px rgba(0,0,0,0.45);
  border: 1px solid #8387C4;
  background: #0A1123;
}
@media (min-width: 768px) { .headshot { width: 192px; height: 192px; } }

/* ── Misc ── */
:deep(h1), :deep(h2), :deep(p), :deep(a), :deep(span) { text-shadow: none; }
</style>
