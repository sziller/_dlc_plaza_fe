<template>
  <div class="newsletter-root min-h-screen text-white">
    <div class="bg-fixed-gradient" aria-hidden="true"></div>

    <!-- HERO -->
    <section class="top-section" aria-labelledby="hero-title">
      <div class="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="text-center">
          <p class="eyebrow">Stay Informed</p>
          <h1 id="hero-title" class="section-title mt-2">The Bitcoin Education<br class="hidden sm:block"/> You Actually Need</h1>
          <p class="lead max-w-3xl mx-auto mt-4">
            Clear analysis, no hype. Actionable insights on Bitcoin lending, self-custody,
            and building real wealth — delivered straight to your inbox.
          </p>
        </div>

        <!-- PRIMARY SIGNUP FORM -->
        <div class="signup-card mt-10 max-w-lg mx-auto" v-reveal="{ delay: 60 }">
          <div class="signup-icon">
            <Mail class="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 class="text-xl font-bold text-white mb-1">Subscribe to Our Newsletter</h2>
          <p class="text-sm text-white/60 mb-5">Join thousands of Bitcoiners getting smarter every week.</p>

          <form @submit.prevent="submitEmail('top')" class="space-y-3">
            <input
              v-model="topEmail"
              type="email"
              placeholder="satoshi@example.com"
              class="email-input"
              autocomplete="email"
              aria-label="Email address"
            />
            <button type="submit" class="btn-primary w-full" :disabled="topLoading">
              <Loader2 v-if="topLoading" class="w-4 h-4 animate-spin" aria-hidden="true" />
              <Send v-else class="w-4 h-4" aria-hidden="true" />
              {{ topLoading ? 'Subscribing…' : 'Subscribe Now' }}
            </button>
          </form>

          <p v-if="topSuccess" class="msg msg-success mt-3">
            <CheckCircle class="w-4 h-4 shrink-0" aria-hidden="true" />
            You're in! Check your inbox for a welcome message.
          </p>
          <p v-if="topError" class="msg msg-error mt-3">
            <AlertCircle class="w-4 h-4 shrink-0" aria-hidden="true" />
            {{ topError }}
          </p>
        </div>
      </div>
    </section>

    <!-- VALUE PROPOSITION -->
    <section class="px-6 py-10 md:py-14" aria-labelledby="value-title">
      <div class="max-w-screen-xl mx-auto">
        <div class="text-center mb-12" v-reveal>
          <p class="eyebrow">What You'll Receive</p>
          <h2 id="value-title" class="section-title mt-2">Knowledge That Compounds</h2>
          <p class="lead max-w-2xl mx-auto mt-4">Every edition is designed to make you a more informed, confident Bitcoin holder.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="(card, i) in valueCards"
            :key="card.title"
            class="value-card"
            v-reveal="{ delay: 60 * (i + 1) }"
          >
            <div class="value-icon">
              <component :is="card.icon" class="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 class="text-lg font-bold text-white mb-1">{{ card.title }}</h3>
            <p class="text-sm text-white/65 leading-relaxed">{{ card.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SOCIAL PROOF / TOPICS -->
    <section class="px-6 py-10 md:py-14" aria-labelledby="topics-title">
      <div class="max-w-screen-xl mx-auto">
        <div class="text-center mb-12" v-reveal>
          <p class="eyebrow">Community</p>
          <h2 id="topics-title" class="section-title mt-2">Trusted by Bitcoiners Who Do<br class="hidden sm:block"/> Their Own Research</h2>
        </div>

        <div class="glass-card topics-grid" v-reveal="{ delay: 60 }">
          <div class="topics-left">
            <p class="text-sm text-white/70 leading-relaxed">
              Our subscribers include individual holders, family offices, and institutional
              investors who value signal over noise.
            </p>
            <div class="trust-signals">
              <div v-for="s in trustSignals" :key="s.text" class="trust-row">
                <span class="trust-row-icon">
                  <component :is="s.icon" class="w-4 h-4" aria-hidden="true" />
                </span>
                <span class="trust-row-text">{{ s.text }}</span>
              </div>
            </div>
          </div>
          <div class="topics-right">
            <p class="text-sm font-semibold text-white/90 mb-3">Topics We Cover</p>
            <div class="topic-chips">
              <div v-for="t in topics" :key="t.label" class="topic-chip">
                <component :is="t.icon" class="w-4 h-4 topic-chip-icon" aria-hidden="true" />
                <span>{{ t.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="w-full px-6 pb-16 md:pb-20" aria-labelledby="cta-title">
      <div class="max-w-3xl mx-auto text-center" v-reveal>
        <h2 id="cta-title" class="section-title">Start Learning Today</h2>
        <p class="lead max-w-xl mx-auto mt-3 mb-8">
          No spam, no fluff — just the Bitcoin education that matters. Unsubscribe anytime.
        </p>

        <form @submit.prevent="submitEmail('bottom')" class="cta-form">
          <input
            v-model="bottomEmail"
            type="email"
            placeholder="you@example.com"
            class="email-input flex-1"
            autocomplete="email"
            aria-label="Email address"
          />
          <button type="submit" class="btn-primary shrink-0" :disabled="bottomLoading">
            <Loader2 v-if="bottomLoading" class="w-4 h-4 animate-spin" aria-hidden="true" />
            <Send v-else class="w-4 h-4" aria-hidden="true" />
            {{ bottomLoading ? 'Subscribing…' : 'Subscribe' }}
          </button>
        </form>

        <p v-if="bottomSuccess" class="msg msg-success mt-4 justify-center">
          <CheckCircle class="w-4 h-4 shrink-0" aria-hidden="true" />
          You're in! Check your inbox for a welcome message.
        </p>
        <p v-if="bottomError" class="msg msg-error mt-4 justify-center">
          <AlertCircle class="w-4 h-4 shrink-0" aria-hidden="true" />
          {{ bottomError }}
        </p>
      </div>
    </section>
  </div>

  <TheFooter />
</template>

<script setup>
import { ref, markRaw, onMounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'
import { postContactEmail, isValidEmail } from '../api/publicContact'
import {
  Mail,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  TrendingUp,
  Shield,
  Rocket,
  FileCode2,
  Lock,
  Globe,
  Coins,
  BarChart3,
  KeyRound,
  Scale,
  Megaphone,
  Users,
  Pen,
  CalendarCheck,
} from 'lucide-vue-next'

// ── Value-prop cards ──
const valueCards = [
  { icon: markRaw(GraduationCap), title: 'Bitcoin Education', desc: 'Deep dives into how Bitcoin lending, DLCs, and self-custody actually work — written for humans.' },
  { icon: markRaw(TrendingUp),    title: 'Market Insights',    desc: 'Macro analysis and on-chain data that help you make informed decisions, not emotional ones.' },
  { icon: markRaw(Shield),        title: 'Security Best Practices', desc: 'Practical guides on key management, multisig setups, and protecting your stack.' },
  { icon: markRaw(Rocket),        title: 'Product Updates',    desc: 'Be the first to know about new Cadena features, rate changes, and platform improvements.' },
]

// ── Topics chip data ──
const topics = [
  { icon: markRaw(FileCode2), label: 'Discreet Log Contracts' },
  { icon: markRaw(Lock),      label: 'Self-Custody Practices' },
  { icon: markRaw(Globe),     label: 'Macro & Bitcoin Thesis' },
  { icon: markRaw(Coins),     label: 'Yield & Lending' },
  { icon: markRaw(BarChart3), label: 'On-Chain Analytics' },
  { icon: markRaw(KeyRound),  label: 'Security & Key Mgmt' },
  { icon: markRaw(Scale),     label: 'Regulatory Updates' },
  { icon: markRaw(Megaphone), label: 'Product & Roadmap' },
]

// ── Trust-signal rows ──
const trustSignals = [
  { icon: markRaw(Users),         text: 'Growing community of self-sovereign investors' },
  { icon: markRaw(Pen),           text: 'Written by practitioners, not marketers' },
  { icon: markRaw(CalendarCheck), text: 'Delivered weekly — no spam, ever' },
]

// ── Top form state ──
const topEmail   = ref('')
const topLoading = ref(false)
const topSuccess = ref(false)
const topError   = ref('')

// ── Bottom form state ──
const bottomEmail   = ref('')
const bottomLoading = ref(false)
const bottomSuccess = ref(false)
const bottomError   = ref('')

// ── Shared submit helper ──
async function submitEmail(which) {
  const email   = which === 'top' ? topEmail   : bottomEmail
  const loading = which === 'top' ? topLoading : bottomLoading
  const success = which === 'top' ? topSuccess : bottomSuccess
  const error   = which === 'top' ? topError   : bottomError

  error.value   = ''
  success.value = false

  if (!isValidEmail(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }

  loading.value = true
  try {
    await postContactEmail(email.value)
    success.value = true
    email.value   = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

// ── Scroll to top on mount ──
onMounted(() => { window.scrollTo(0, 0) })

// ── Reveal directive (identical to Contact.vue) ──
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
.newsletter-root { background: transparent; position: relative; }
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

/* ── Signup card (featured glass) ── */
.signup-card {
  padding: 2rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(103,56,228,0.5);
  border-radius: 1.25rem;
  text-align: center;
  box-shadow: 0 0 40px rgba(103,56,228,0.12);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.signup-card:hover {
  border-color: rgba(103,56,228,0.8);
  box-shadow: 0 0 60px rgba(103,56,228,0.18);
}
.signup-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 48px; height: 48px; margin: 0 auto 1rem;
  background: rgba(103,56,228,0.15);
  border: 1px solid rgba(103,56,228,0.4);
  border-radius: 0.75rem;
  color: #8387c3;
}

/* ── Email input ── */
.email-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(131,135,196,0.35);
  background: rgba(0,0,0,0.25);
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.email-input::placeholder { color: rgba(255,255,255,0.35); }
.email-input:focus {
  border-color: #6738e3;
  box-shadow: 0 0 0 3px rgba(103,56,228,0.25);
}

/* ── Buttons ── */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
  padding: 0.7rem 1.25rem; border-radius: 0.75rem;
  background: #6738e4; color: #fff; font-weight: 600; font-size: 0.9rem;
  transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
  border: none; cursor: pointer;
}
.btn-primary:hover:not(:disabled) { background: #7a4af0; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(103,56,228,0.4); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Messages ── */
.msg {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.85rem; font-weight: 500;
}
.msg-success { color: #86efac; }
.msg-error   { color: #fca5a5; }

/* ── Value cards ── */
.value-card {
  display: flex; flex-direction: column; gap: 0; padding: 2rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(131,135,196,0.3);
  border-radius: 1.25rem;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.value-card:hover {
  border-color: rgba(131,135,196,0.6);
  box-shadow: 0 16px 40px rgba(0,0,0,0.3);
  transform: translateY(-2px);
}
.value-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; margin-bottom: 1.25rem; flex-shrink: 0;
  background: rgba(103,56,228,0.15);
  border: 1px solid rgba(103,56,228,0.4);
  border-radius: 0.75rem;
  color: #8387c3;
}

/* ── Glass card ── */
.glass-card {
  position: relative;
  border-radius: 1.25rem;
  padding: 2rem;
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

/* ── Topics grid (inside glass card) ── */
.topics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  padding: 2.5rem;
}
@media (min-width: 768px) {
  .topics-grid { grid-template-columns: 1fr 1fr; }
}
/* ── Trust-signal rows (left column) ── */
.trust-signals {
  display: flex; flex-direction: column; gap: 0.75rem;
  margin-top: 1.25rem;
}
.trust-row {
  display: flex; align-items: center; gap: 0.65rem;
}
.trust-row-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; flex-shrink: 0;
  background: rgba(103,56,228,0.15);
  border: 1px solid rgba(103,56,228,0.4);
  border-radius: 0.5rem;
  color: #8387c3;
}
.trust-row-text {
  font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.85);
}

/* ── Topics right column ── */
.topics-right {
  padding-top: 2rem;
  border-top: 1px solid rgba(131,135,196,0.25);
}
@media (min-width: 768px) {
  .topics-right {
    padding-top: 0;
    border-top: none;
    padding-left: 2rem;
    border-left: 1px solid rgba(131,135,196,0.25);
  }
}

/* ── Topic chip grid (right column) ── */
.topic-chips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem 1rem;
}
.topic-chip {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.82rem; color: rgba(255,255,255,0.8);
}
.topic-chip-icon {
  color: #6738e3; flex-shrink: 0;
}

/* ── CTA inline form ── */
.cta-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 32rem;
  margin: 0 auto;
}
@media (min-width: 640px) {
  .cta-form { flex-direction: row; }
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

/* ── Misc ── */
:deep(h1), :deep(h2), :deep(p), :deep(a), :deep(span) { text-shadow: none; }
</style>
