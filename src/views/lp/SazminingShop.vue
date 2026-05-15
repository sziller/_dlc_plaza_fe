<template>
  <div class="saz-page">

    <!-- ══════════════ HEADER ══════════════ -->
    <header class="saz-header">
      <img src="/img/partners/sazmining-logo.png" alt="Sazmining" class="saz-logo" />
      <span class="saz-badge">Bitcoin-Native Financing</span>
    </header>

    <!-- ══════════════ HERO ══════════════ -->
    <section class="saz-hero">
      <p class="saz-eyebrow">Sazmining × Cadena Bitcoin</p>
      <h1 class="saz-h1">Bitcoin-Native Mining Finance</h1>
      <p class="saz-sub">
        Get a running miner today. DLC settles at $5,000 in Bitcoin after 12 months.<br class="hidden sm:block" />
        Keep every sat you mine.
      </p>
    </section>

    <!-- ══════════════ MAIN GRID ══════════════ -->
    <section class="saz-grid">

      <!-- ── Rig Card ── -->
      <div class="saz-card">
        <div class="saz-rig-img">
          <span class="img-placeholder">&lt;image&gt;</span>
        </div>
        <div class="saz-card-body">
          <div class="rig-header">
            <div>
              <h2 class="rig-name">Bitmain Antminer S21 XP</h2>
              <p class="rig-spec">270 TH/s · 3,645 W · Air-cooled · Renewable</p>
            </div>
            <div class="rig-price-block">
              <p class="rig-price">$4,545</p>
              <p class="rig-price-btc">≈ 0.04329 BTC</p>
            </div>
          </div>

          <div class="rig-stats">
            <div class="stat-box">
              <p class="stat-label">Est. Monthly Revenue</p>
              <p class="stat-val accent">~$345</p>
            </div>
            <div class="stat-box">
              <p class="stat-label">Service Fee</p>
              <p class="stat-val">~$157</p>
            </div>
            <div class="stat-box">
              <p class="stat-label">Net Monthly</p>
              <p class="stat-val">~$188</p>
            </div>
          </div>

          <ul class="rig-perks">
            <li>First-year repair costs included</li>
            <li>Support resolved in under 12 hours</li>
            <li>20% more carbon-free energy than the network</li>
          </ul>

          <button class="btn-finance" @click="scrollToFinancing">
            Finance with Cadena – 1 Year Plan →
          </button>
        </div>
      </div>

      <!-- ── Financing Card ── -->
      <div class="saz-card financing-card" ref="financingCard">

        <!-- Cadena branding -->
        <div class="cadena-header">
          <img :src="cadenaLogo" alt="Cadena Bitcoin" class="cadena-logo" />
          <div>
            <p class="cadena-name">Cadena Bitcoin</p>
            <p class="cadena-desc">1-Year Bullet Loan · Fixed USD Settlement</p>
          </div>
        </div>

        <!-- Loan terms -->
        <div class="loan-terms">
          <div v-for="row in loanTerms" :key="row.label" class="term-row">
            <span class="term-label">{{ row.label }}</span>
            <span class="term-val" :class="{ accent: row.highlight }">{{ row.value }}</span>
          </div>
        </div>

        <!-- Key insight -->
        <div class="insight-box">
          <p class="insight-title">Only one number to remember</p>
          <p class="insight-body">
            Send <strong>0.10 BTC</strong> as collateral today. Cadena disburses
            <strong>0.04329 BTC</strong> directly to Sazmining. The DLC settles
            at <strong>$5,000 in Bitcoin</strong> automatically at the end of year one.
          </p>
        </div>

        <!-- CTA -->
        <router-link to="/register" class="btn-apply">
          Apply for Financing →
        </router-link>
        <p class="trust-line">Non-custodial · DLC-secured · No counterparty risk</p>
      </div>
    </section>

    <!-- ══════════════ HOW IT WORKS ══════════════ -->
    <section class="saz-steps">
      <h2 class="saz-section-title">How It Works</h2>
      <div class="steps-grid">
        <div v-for="(step, i) in steps" :key="i" class="step-item">
          <div class="step-num">{{ i + 1 }}</div>
          <div>
            <p class="step-title">{{ step.title }}</p>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════ WHY IT WORKS ══════════════ -->
    <section class="saz-why">
      <h2 class="saz-section-title">Why This Works</h2>
      <div class="why-grid">
        <div v-for="point in whyPoints" :key="point.title" class="why-card">
          <p class="why-title">{{ point.title }}</p>
          <p class="why-body">{{ point.body }}</p>
        </div>
      </div>
    </section>

    <!-- ══════════════ FOOTER ══════════════ -->
    <footer class="saz-footer">
      <p>
        Mining by
        <a href="https://www.sazmining.com" target="_blank" rel="noopener" class="footer-link">Sazmining</a>
        · Financing by
        <a href="/" class="footer-link">Cadena Bitcoin</a>
      </p>
      <p class="footer-legal">Bitcoin-backed loans involve risk. Mining rewards are not guaranteed. Not financial advice.</p>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import cadenaLogo from '../../assets/logos/cadena_bitcoin_logo_2.png'

const financingCard = ref(null)

function scrollToFinancing() {
  financingCard.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const loanTerms = [
  { label: 'Rig bundle price',              value: '$4,545.45  (≈ 0.04329 BTC)' },
  { label: 'Loan disbursed to Sazmining',   value: '0.04329 BTC',                highlight: true },
  { label: 'Collateral required',           value: '0.10 BTC — held in DLC' },
  { label: 'Term',                          value: '12 months · single bullet' },
  { label: 'Interest rate',                 value: '10% simple interest (fixed USD)' },
  { label: 'DLC settlement at maturity',     value: '$5,000 in BTC at spot price', highlight: true },
]

const steps = [
  {
    title: 'Select your rig bundle',
    desc: 'Choose the Bitmain S21 XP. Price shown in USD and BTC at current rate.',
  },
  {
    title: 'Cadena quote appears instantly',
    desc: 'See the exact terms: 0.04329 BTC disbursed to Sazmining today → DLC settles at $5,000 in BTC at month 12.',
  },
  {
    title: 'Send two Bitcoin payments',
    desc: '0.10 BTC to your Cadena DLC wallet as collateral. Cadena disburses 0.04329 BTC directly to Sazmining for the rigs.',
  },
  {
    title: 'Sazmining confirms & deploys',
    desc: 'Payment confirmed on-chain. Rig deployment begins at the data center — typically within days.',
  },
  {
    title: 'Mine for 12 months',
    desc: 'Mining rewards flow directly to your wallet every day. You own every sat you earn.',
  },
  {
    title: 'Day 365 settlement',
    desc: 'The DLC auto-executes on-chain. No action needed — the contract settles at $5,000 in BTC and your collateral is returned.',
  },
]

const whyPoints = [
  {
    title: 'One number to send',
    body: '0.10 BTC covers everything — collateral plus the rig is financed. No complex multi-step funding.',
  },
  {
    title: 'One settlement number',
    body: '$5,000 USD in Bitcoin. Fixed, simple, easy to plan around — and the DLC handles it automatically, no repayment to anyone.',
  },
  {
    title: 'Two income streams',
    body: 'Mining rewards for 12 months plus Bitcoin price appreciation on your collateral. Both work in your favour.',
  },
  {
    title: 'Zero counterparty risk',
    body: 'Your collateral sits in a Discreet Log Contract on Bitcoin\'s base layer. Cadena holds no keys, runs no pool.',
  },
]
</script>

<style scoped>
/* ─── Palette ───────────────────────────────────────
   white:   #ffffff
   teal:    #0e9f97
   yellow:  #fecf4e
   mist:    #e7f5f5
──────────────────────────────────────────────────── */

/* ─── Base ──────────────────────────────────────── */
.saz-page {
  min-height: 100vh;
  background: #ffffff;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ─── Header ────────────────────────────────────── */
.saz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  max-width: 1024px;
  margin: 0 auto;
}
.saz-logo { height: 32px; width: auto; }
.saz-badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0e9f97;
  border: 1px solid #0e9f97;
  border-radius: 999px;
  padding: 3px 12px;
}

/* ─── Hero ──────────────────────────────────────── */
.saz-hero {
  text-align: center;
  padding: 60px 24px 48px;
  max-width: 720px;
  margin: 0 auto;
}
.saz-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0e9f97;
  margin-bottom: 12px;
}
.saz-h1 {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 16px;
  color: #1a1a1a;
}
.saz-sub {
  font-size: 1.1rem;
  color: rgba(0, 0, 0, 0.55);
  line-height: 1.6;
}

/* ─── Grid ──────────────────────────────────────── */
.saz-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 20px 48px;
}
@media (min-width: 900px) {
  .saz-grid { grid-template-columns: 1fr 1fr; }
}

/* ─── Cards ─────────────────────────────────────── */
.saz-card {
  background: #e7f5f5;
  border: 1px solid rgba(14, 159, 151, 0.2);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.saz-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.financing-card { padding: 28px; }

/* ─── Rig Card ──────────────────────────────────── */
.saz-rig-img {
  background: #cce9e8;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.img-placeholder {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;
}

.rig-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 12px; }
.rig-name { font-size: 1.15rem; font-weight: 700; margin-bottom: 4px; color: #1a1a1a; }
.rig-spec { font-size: 0.75rem; color: rgba(0, 0, 0, 0.45); }
.rig-price-block { text-align: right; flex-shrink: 0; }
.rig-price { font-size: 1.6rem; font-weight: 800; color: #0e9f97; line-height: 1; }
.rig-price-btc { font-size: 0.72rem; color: rgba(0, 0, 0, 0.4); margin-top: 2px; }

.rig-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; }
.stat-box {
  background: #ffffff;
  border: 1px solid rgba(14, 159, 151, 0.25);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}
.stat-label { font-size: 0.65rem; color: rgba(0, 0, 0, 0.45); margin-bottom: 4px; line-height: 1.3; }
.stat-val { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
.stat-val.accent { color: #0e9f97; }

.rig-perks { list-style: none; padding: 0; margin: 0 0 24px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.rig-perks li {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.55);
  padding-left: 16px;
  position: relative;
}
.rig-perks li::before { content: '✓'; position: absolute; left: 0; color: #0e9f97; font-weight: 700; }

.btn-finance {
  width: 100%;
  background: #fecf4e;
  color: #1a1a1a;
  font-weight: 800;
  font-size: 0.95rem;
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: auto;
}
.btn-finance:hover { opacity: 0.85; }

/* ─── Financing Card ────────────────────────────── */
.cadena-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.cadena-logo { height: 36px; width: auto; }
.cadena-name { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
.cadena-desc { font-size: 0.7rem; color: rgba(0, 0, 0, 0.4); margin-top: 2px; }

.loan-terms { display: flex; flex-direction: column; gap: 2px; margin-bottom: 20px; }
.term-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  gap: 12px;
}
.term-row:last-child { border-bottom: none; }
.term-label { font-size: 0.8rem; color: rgba(0, 0, 0, 0.5); flex-shrink: 0; }
.term-val { font-size: 0.85rem; font-weight: 600; text-align: right; color: #1a1a1a; }
.term-val.accent {
  color: #1a1a1a;
  font-weight: 800;
  background: #fecf4e;
  border-radius: 6px;
  padding: 2px 8px;
}

.insight-box {
  background: #ffffff;
  border: 1px solid rgba(14, 159, 151, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}
.insight-title { font-size: 0.75rem; font-weight: 700; color: #0e9f97; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
.insight-body { font-size: 0.85rem; color: rgba(0, 0, 0, 0.7); line-height: 1.55; }

.btn-apply {
  display: block;
  width: 100%;
  background: #0e9f97;
  color: #ffffff;
  font-weight: 800;
  font-size: 1rem;
  padding: 15px 20px;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  transition: opacity 0.2s;
  margin-bottom: 10px;
}
.btn-apply:hover { opacity: 0.88; }
.trust-line { font-size: 0.7rem; color: rgba(0, 0, 0, 0.3); text-align: center; }

/* ─── How It Works ──────────────────────────────── */
.saz-steps {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px 64px;
}
.saz-section-title {
  font-size: 1.75rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 36px;
  color: #1a1a1a;
}
.steps-grid { display: flex; flex-direction: column; gap: 20px; }
.step-item { display: flex; gap: 16px; align-items: flex-start; }
.step-num {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  background: #0e9f97;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
  margin-top: 2px;
}
.step-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 3px; color: #1a1a1a; }
.step-desc { font-size: 0.82rem; color: rgba(0, 0, 0, 0.55); line-height: 1.55; }

/* ─── Why It Works ──────────────────────────────── */
.saz-why {
  background: #e7f5f5;
  padding: 56px 24px;
}
.saz-why .saz-section-title { margin-bottom: 36px; }
.why-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 860px;
  margin: 0 auto;
}
@media (max-width: 600px) { .why-grid { grid-template-columns: 1fr; } }
.why-card {
  background: #ffffff;
  border: 1px solid rgba(14, 159, 151, 0.2);
  border-radius: 14px;
  padding: 20px;
}
.why-title { font-size: 0.9rem; font-weight: 700; color: #0e9f97; margin-bottom: 6px; }
.why-body { font-size: 0.82rem; color: rgba(0, 0, 0, 0.55); line-height: 1.55; }

/* ─── Footer ────────────────────────────────────── */
.saz-footer {
  text-align: center;
  padding: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.35);
  background: #ffffff;
}
.footer-link { color: #0e9f97; text-decoration: none; }
.footer-link:hover { text-decoration: underline; }
.footer-legal { margin-top: 6px; font-size: 0.7rem; color: rgba(0, 0, 0, 0.25); }

/* ─── Accent util ───────────────────────────────── */
.accent { color: #0e9f97; }
</style>
