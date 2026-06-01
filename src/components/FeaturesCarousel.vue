<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const activeIndex = ref(0)
const progressKey  = ref(0)
const trackRef    = ref(null)
const isMobile    = ref(false)
let autoTimer = null

function updateMobile() {
  isMobile.value = window.innerWidth <= 767
}

function scrollToActive() {
  if (!isMobile.value || !trackRef.value) return
  const track = trackRef.value
  const card  = track.querySelectorAll('.fc-card')[activeIndex.value]
  if (!card) return
  track.scrollTo({
    left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
    behavior: 'smooth',
  })
}

const features = [
  {
    num: '1',
    icon: 'lock',
    title: 'True Self-Custody',
    desc: 'Your private keys never leave your hands. Bitcoin sits in on-chain DLC contracts — Cadena has zero ability to move, seize, or rehypothecate your collateral. The Signer App is open-source and verifiable.',
  },
  {
    num: '2',
    icon: 'scale',
    title: 'No Margin Calls',
    desc: 'Every settlement outcome is pre-signed at funding. No liquidation bots. No forced selling. No in-term recalls. Settlement is a single event at maturity.',
  },
  {
    num: '3',
    icon: 'chain',
    title: 'Fully On-Chain',
    desc: 'Every loan is enforced by Bitcoin script — no trusted third parties, no off-chain databases, no counterparty discretion. The contract is the law.',
  },
  {
    num: '4',
    icon: 'lightning',
    title: 'Funded Fast, Verified Properly',
    desc: 'Contract funding broadcasts on-chain within minutes of both parties signing. Onboarding via Sumsub KYC and Signer App setup happens once and reuses across every contract you fund.',
  },
  {
    num: '5',
    icon: 'shield',
    title: 'Regulated · Verifiable · Live',
    desc: "Registered Bitcoin Service Provider in El Salvador. KYC on-device via the open-sourced Signer App. An early contract settled on Bitcoin's mainnet May 9, 2026 — verify on-chain.",
  },
]

function cardOffset(i) {
  const n = features.length
  let offset = ((i - activeIndex.value) % n + n) % n
  if (offset > Math.floor(n / 2)) offset -= n
  return offset
}

function go(i) {
  activeIndex.value = ((i % features.length) + features.length) % features.length
  progressKey.value++
  restartTimer()
  scrollToActive()
}
function prev() { go(activeIndex.value - 1) }
function next() { go(activeIndex.value + 1) }

function restartTimer() {
  clearInterval(autoTimer)
  autoTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % features.length
    progressKey.value++
    scrollToActive()
  }, 8000)
}

onMounted(() => {
  updateMobile()
  window.addEventListener('resize', updateMobile)
  restartTimer()
})
onBeforeUnmount(() => {
  clearInterval(autoTimer)
  window.removeEventListener('resize', updateMobile)
})
</script>

<template>
  <div class="fc-root">
    <!-- Shared SVG gradient definitions -->
    <svg width="0" height="0" style="position:absolute;overflow:hidden;">
      <defs>
        <linearGradient id="fc-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c4b5fd"/>
          <stop offset="100%" stop-color="#6738e3"/>
        </linearGradient>
      </defs>
    </svg>

    <!-- Section header -->
    <div class="fc-header reveal">
      <span class="fc-eyebrow">Advantages</span>
      <h2 class="fc-heading">Why Cadena</h2>
      <p class="fc-sub">Most Bitcoin lenders take your coins. We never touch them.</p>
    </div>

    <!-- Card track -->
    <div class="fc-track" ref="trackRef">
      <div
        v-for="(feat, i) in features"
        :key="i"
        class="fc-card"
        :class="{
          'fc-card--active':    i === activeIndex,
          'fc-card--mob-prev':  isMobile && cardOffset(i) === -1,
          'fc-card--mob-next':  isMobile && cardOffset(i) === 1,
        }"
        :style="isMobile ? { '--card-offset': cardOffset(i) } : {}"
        @click="go(i)"
      >
        <!-- Number badge (all cards) -->
        <div class="fc-num">
          <svg class="fc-num-ring" viewBox="0 0 38 38">
            <circle cx="19" cy="19" r="16" class="fc-num-track-bloom" />
            <circle cx="19" cy="19" r="16" class="fc-num-track" />
            <circle v-if="i === activeIndex" cx="19" cy="19" r="16" class="fc-num-progress" :key="progressKey" stroke="url(#fc-icon-grad)" />
          </svg>
          <span>{{ feat.num }}</span>
        </div>

        <!-- Spacer: collapses when active, expands when inactive to push content to center -->
        <div class="fc-spacer" />

        <!-- Icon + Title -->
        <div class="fc-main">
          <div class="fc-icon">
            <svg v-if="feat.icon === 'lock'" viewBox="0 0 24 24" fill="none" stroke="url(#fc-icon-grad)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <svg v-else-if="feat.icon === 'scale'" viewBox="0 0 24 24" fill="none" stroke="url(#fc-icon-grad)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 4-1 6-2 2 1 4 2 6 2h2"/>
            </svg>
            <svg v-else-if="feat.icon === 'chain'" viewBox="0 0 24 24" fill="none" stroke="url(#fc-icon-grad)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <svg v-else-if="feat.icon === 'lightning'" viewBox="0 0 24 24" fill="none" stroke="url(#fc-icon-grad)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <svg v-else-if="feat.icon === 'shield'" viewBox="0 0 24 24" fill="none" stroke="url(#fc-icon-grad)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <Transition name="fc-title-swap" mode="out-in">
            <h3 :key="i === activeIndex ? 'active' : 'inactive'" class="fc-title">{{ feat.title }}</h3>
          </Transition>
        </div>

        <!-- Description — active card only -->
        <Transition name="fc-desc">
          <p v-if="i === activeIndex" class="fc-desc-text">{{ feat.desc }}</p>
        </Transition>

        <!-- Bottom spacer: balances top spacer to keep content centered -->
        <div class="fc-spacer" />
      </div>
    </div>

    <!-- Mobile arrows -->
    <div class="fc-mobile-controls">
      <button class="fc-arrow" aria-label="Previous" @click="prev">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button class="fc-arrow" aria-label="Next" @click="next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>

    <div class="fc-footer">
      <router-link to="/security" class="fc-footer-link">Read more about the risk model →</router-link>
    </div>
  </div>
</template>

<style scoped>
/* ── Root ────────────────────────────────────────────────────────── */
.fc-root { width: 100%; }

/* ── Header ──────────────────────────────────────────────────────── */
.fc-header { text-align: center; margin-bottom: 3rem; }

.fc-eyebrow {
  display: inline-block;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #6738e3;
  margin-bottom: 0.6rem;
}
.fc-heading {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.75rem;
}
.fc-sub {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.7);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ── Track ───────────────────────────────────────────────────────── */
.fc-track {
  display: flex;
  gap: 8px;
  align-items: stretch;
  height: 260px;
}

/* ── Card ────────────────────────────────────────────────────────── */
.fc-card {
  flex: 1;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.025);
  border-radius: 14px;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 0;
  overflow: hidden;
  position: relative;
  transition:
    flex 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.6s ease,
    border-color 0.6s ease;
}
.fc-card:not(.fc-card--active):hover {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.12);
}
.fc-card--active {
  flex: 2.2;
  background: rgba(103, 56, 228, 0.09);
  border-color: rgba(103, 56, 228, 0.32);
  cursor: default;
}

/* ── Spacers (push content to vertical center when inactive) ─────── */
.fc-spacer {
  flex: 1;
  transition: flex 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.fc-card--active .fc-spacer { flex: 0; }

/* ── Icon + Title group ──────────────────────────────────────────── */
.fc-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.65rem;
}
.fc-card--active .fc-main {
  align-items: flex-start;
  text-align: left;
}

/* ── Number badge with ring progress ─────────────────────────────── */
.fc-num {
  position: absolute;
  top: 1.5rem;
  right: 1.1rem;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: #c4b5fd;
  font-family: monospace;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}
.fc-num span { position: relative; z-index: 1; }
.fc-num-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  filter:
    drop-shadow(0 0 4px rgba(103, 56, 227, 0.7))
    drop-shadow(0 0 10px rgba(196, 181, 253, 0.3));
}
.fc-num-track-bloom {
  fill: none;
  stroke: rgba(103, 56, 228, 0.1);
  stroke-width: 7;
}
.fc-num-track {
  fill: none;
  stroke: rgba(103, 56, 228, 0.28);
  stroke-width: 2.5;
}
.fc-num-progress {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 100.5;
  stroke-dashoffset: 100.5;
  animation: fc-ring 8s linear forwards;
}
@keyframes fc-ring {
  from { stroke-dashoffset: 100.5; }
  to   { stroke-dashoffset: 0; }
}

/* ── Icon ────────────────────────────────────────────────────────── */
.fc-icon {
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  position: relative;
  filter:
    drop-shadow(0 0 5px rgba(103, 56, 227, 0.5))
    drop-shadow(0 0 12px rgba(196, 181, 253, 0.2));
  transition:
    width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    height 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    filter 0.6s ease;
}
.fc-card--active .fc-icon {
  width: 2rem;
  height: 2rem;
  filter:
    drop-shadow(0 0 7px rgba(103, 56, 227, 0.85))
    drop-shadow(0 0 20px rgba(196, 181, 253, 0.35));
}
.fc-icon::before {
  content: '';
  position: absolute;
  inset: -55%;
  background: radial-gradient(circle, rgba(103, 56, 227, 0.13) 0%, transparent 65%);
  border-radius: 50%;
  pointer-events: none;
}
.fc-icon svg { width: 100%; height: 100%; }

/* ── Title ───────────────────────────────────────────────────────── */
.fc-title {
  font-weight: 700;
  color: #fff;
  line-height: 1.25;
  font-size: 1.3rem;
  text-align: center;
}
.fc-card--active .fc-title {
  text-align: left;
  font-size: 1.15rem;
}

.fc-title-swap-enter-active {
  transition: opacity 0.4s ease 0.15s, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s;
}
.fc-title-swap-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fc-title-swap-enter-from { opacity: 0; transform: translateY(6px); }
.fc-title-swap-leave-to   { opacity: 0; transform: translateY(-4px); }

/* ── Description ─────────────────────────────────────────────────── */
.fc-desc-text {
  position: absolute;
  top: calc(50% + 3rem);
  transform: translateY(-50%);
  left: 1.4rem;
  right: 1.4rem;
  font-size: 1.02rem;
  color: #fff;
  line-height: 1.65;
}

.fc-desc-enter-active { transition: opacity 0.4s ease 0.59s; }
.fc-desc-leave-active { transition: opacity 0.15s ease; }
.fc-desc-enter-from   { opacity: 0; }
.fc-desc-leave-to     { opacity: 0; }


/* ── Footer link ─────────────────────────────────────────────────── */
.fc-footer { text-align: center; margin-top: 2rem; }
.fc-footer-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #6738e3;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
  border-radius: 0.75rem;
  transition: background-color 0.15s, box-shadow 0.15s;
}
.fc-footer-link:hover {
  background-color: #7a4af0;
  box-shadow: 0 0 20px rgba(103, 56, 228, 0.4);
}

/* ── Mobile ──────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .fc-card--active { flex: 3; }
  .fc-title { font-size: 1.1rem; }
  .fc-card--active .fc-title { font-size: 1rem; }
  .fc-desc-text { font-size: 0.9rem; }
}

@media (max-width: 900px) {
  .fc-card--active { flex: 4.5; }
  .fc-title { font-size: 0.95rem; }
  .fc-card--active .fc-title { font-size: 0.88rem; }
  .fc-desc-text { font-size: 0.82rem; }
}

@media (min-width: 520px) and (max-width: 767px) {
  .fc-title { font-size: 1.15rem; }
  .fc-card--active .fc-title { font-size: 1.05rem; }
  .fc-desc-text { font-size: 0.95rem; }
}

.fc-mobile-controls { display: none; }

@media (max-width: 767px) {
  .fc-track {
    position: relative;
    overflow: hidden;
    height: 320px;
    min-height: unset;
    gap: 0;
    padding: 0;
    align-items: stretch;
  }

  /* All cards: absolute, full-height, positioned by offset */
  .fc-card {
    position: absolute;
    width: 66%;
    left: 17%;
    top: 0;
    bottom: 0;
    flex: none;
    opacity: 0;
    pointer-events: none;
    overflow: hidden;
    transform: translateX(calc(var(--card-offset, 0) * 100%));
    transition:
      transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 0.4s ease,
      background 0.4s ease,
      border-color 0.4s ease;
  }

  /* Active card: full content */
  .fc-card--active {
    opacity: 1;
    pointer-events: auto;
  }

  /* Edge cards: icon only, no circle/title/spacers */
  .fc-card--mob-prev,
  .fc-card--mob-next {
    opacity: 0.55;
    pointer-events: auto;
    padding: 1.4rem 0.6rem 0.6rem;
    justify-content: flex-start;
    cursor: pointer;
  }
  .fc-card--mob-prev .fc-num,
  .fc-card--mob-next .fc-num,
  .fc-card--mob-prev .fc-title,
  .fc-card--mob-next .fc-title,
  .fc-card--mob-prev .fc-spacer,
  .fc-card--mob-next .fc-spacer,
  .fc-card--mob-prev .fc-desc-text,
  .fc-card--mob-next .fc-desc-text { display: none; }

  /* Icon at the near (visible) edge of each side card */
  .fc-card--mob-next .fc-main { align-items: flex-start; }
  .fc-card--mob-prev .fc-main { align-items: flex-end; }
  .fc-card--mob-prev .fc-icon,
  .fc-card--mob-next .fc-icon { width: 2rem; height: 2rem; }

  .fc-mobile-controls {
    display: flex;
    gap: 6px;
    margin-top: 1rem;
  }
  .fc-arrow {
    width: 36px;
    height: 36px;
    border: 1px solid rgba(255,255,255,0.14);
    background: transparent;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }
  .fc-arrow svg { width: 16px; height: 16px; }
}
</style>
