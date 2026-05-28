<template>
  <div class="saz-page">

    <!-- ══════════════ HEADER ══════════════ -->
    <header class="saz-header">
      <div class="saz-header-left">
        <img src="/img/partners/sazmining-logo.png" alt="Sazmining" class="saz-logo" />
        <span class="saz-x">×</span>
        <img :src="cadenaLogo" alt="Cadena Bitcoin" class="cadena-logo-sm" />
        <span class="saz-badge">Bitcoin-Native Mining Finance</span>
      </div>
      <router-link to="/" class="back-link">Back to Cadena Bitcoin →</router-link>
    </header>

    <!-- ══════════════ HERO ══════════════ -->
    <section class="saz-hero">
      <p class="saz-eyebrow">Sazmining × Cadena Bitcoin</p>
      <h1 class="saz-h1">Buy a mining rig today.<br />Keep your Bitcoin stack.</h1>
      <p class="saz-sub">
        Pay Sazmining directly in Bitcoin for a running miner. Cadena's Discreet Log Contract
        preserves your original Bitcoin position through the 12-month term.
        No surrender of stack, no margin calls, no custodian.
      </p>
      <a href="#financing" class="btn-hero">Finance with Cadena →</a>
    </section>

    <!-- ══════════════ THE RIG ══════════════ -->
    <section class="saz-section">
      <div class="saz-container">
        <div class="rig-layout">

          <!-- Image -->
          <div class="rig-img-wrap">
            <div class="rig-img-placeholder">Antminer S21 XP</div>
          </div>

          <!-- Spec block -->
          <div class="rig-spec-block">
            <h2 class="rig-name">Bitmain Antminer S21 XP</h2>
            <p class="rig-tagline">270 TH/s · 3,645 W · Air-cooled · Renewable energy</p>

            <div class="rig-stats">
              <div class="stat-row">
                <span class="stat-label">Rig bundle price</span>
                <span class="stat-val accent">$4,545 <span class="stat-btc">≈ 0.04329 BTC at current spot</span></span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Est. monthly mining revenue</span>
                <span class="stat-val">~$345</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Sazmining service fee</span>
                <span class="stat-val">~$157/month <span class="stat-btc">hosting, electricity, repairs</span></span>
              </div>
              <div class="stat-row stat-row--highlight">
                <span class="stat-label">Net monthly to your wallet</span>
                <span class="stat-val">~$188</span>
              </div>
            </div>

            <ul class="rig-perks">
              <li>First-year repair costs included</li>
              <li>Support resolved in under 12 hours</li>
              <li>20% more carbon-free energy than the network</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════ HOW THE FINANCING WORKS ══════════════ -->
    <section class="saz-section saz-section--alt" id="financing">
      <div class="saz-container">
        <h2 class="saz-section-title">How the financing works</h2>
        <div class="steps-grid">

          <div class="step-card">
            <div class="step-num">1</div>
            <div>
              <p class="step-title">You pay Sazmining directly in Bitcoin</p>
              <p class="step-desc">
                Send the rig bundle price (≈ 0.04329 BTC) directly to Sazmining.
                Sazmining confirms payment on-chain and begins deploying your rig at
                their data center — typically within days.
              </p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-num">2</div>
            <div>
              <p class="step-title">You commit collateral to Cadena</p>
              <p class="step-desc">
                Separately, commit Bitcoin as collateral to a Cadena Discreet Log Contract
                on Bitcoin's base layer. The collateral pool covers a USD-denominated loan
                equal to the rig's purchase price.
                <strong>You keep your keys throughout. Cadena holds no key at any point.</strong>
              </p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-num">3</div>
            <div>
              <p class="step-title">The contract settles itself at month 12</p>
              <p class="step-desc">
                At maturity, the pre-signed Contract Execution Transaction broadcasts on-chain.
                The lender's USD-denominated target is paid in Bitcoin at the maturity price.
                You receive the residual back to self-custody.
                <strong>No margin calls during the term. No active repayment step.</strong>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════ INDICATIVE ECONOMICS ══════════════ -->
    <section class="saz-section">
      <div class="saz-container">
        <h2 class="saz-section-title">Indicative economics</h2>
        <div class="econ-box">
          <table class="econ-table">
            <tbody>
              <tr v-for="row in economics" :key="row.item" :class="{ 'econ-row--highlight': row.highlight }">
                <td class="econ-item">{{ row.item }}</td>
                <td class="econ-val">{{ row.value }}</td>
              </tr>
            </tbody>
          </table>
          <div class="econ-disclosure">
            Rates are determined by the Cadena marketplace at the time of match and can change with supply
            and demand. The economics above are indicative. Mining revenue, electricity costs, and BTC price
            all vary and are not guaranteed. Sazmining's service fee covers hosting, electricity, and
            first-year repairs. Mining rewards flow daily to your self-custody wallet, net of Sazmining's
            revenue share.
          </div>
        </div>

        <div class="econ-cta">
          <router-link to="/register" class="btn-apply">Get started →</router-link>
        </div>
      </div>
    </section>

    <!-- ══════════════ TWO INCOME STREAMS ══════════════ -->
    <section class="saz-section saz-section--alt">
      <div class="saz-container">
        <h2 class="saz-section-title">Two income streams</h2>
        <div class="streams-grid">
          <div class="stream-card">
            <p class="stream-title">Mining rewards for 12 months</p>
            <p class="stream-body">
              Bitcoin mined daily flows directly to your self-custody wallet (net of
              Sazmining's revenue share). You own every sat you earn.
            </p>
          </div>
          <div class="stream-card">
            <p class="stream-title">Bitcoin position preserved through collateral</p>
            <p class="stream-body">
              Your locked collateral is what brings the Bitcoin back at maturity.
              The Cadena contract structurally reconstructs your stack over the term.
            </p>
          </div>
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
        · Cadena Bitcoin S.A. de C.V., El Salvador BSP registered
      </p>
      <p class="footer-legal">
        Bitcoin-backed loans involve risk. Mining rewards are not guaranteed.
        Not financial advice. KYC required via Sumsub through the Cadena Signer App.
      </p>
    </footer>

  </div>
</template>

<script setup>
import cadenaLogo from '../../assets/logos/cadena_bitcoin_logo_2.png'

const economics = [
  { item: 'Rig bundle price (today)',      value: '$4,545 (≈ 0.04329 BTC)' },
  { item: 'Cadena loan amount',            value: '$4,545 — matches purchase price' },
  { item: 'Collateral commitment',         value: '≈ 0.10 BTC (sized for 50% LTV protection)' },
  { item: 'Term',                          value: '12 months · single settlement at maturity' },
  { item: 'Indicative rate',              value: '~12% annualized · rates clear at the marketplace' },
  { item: 'Cadena platform fee',           value: '1% (borrower side)' },
  { item: 'Estimated settlement',          value: '~$5,136 in Bitcoin at maturity spot price', highlight: true },
]
</script>

<style scoped>
/* ─── Palette ─────────────────────────
   teal:   #0e9f97
   yellow: #fecf4e
   mist:   #e7f5f5
   dark:   #1a1a1a
──────────────────────────────────────── */

.saz-page {
  min-height: 100vh;
  background: #ffffff;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ─── Header ─────────────────────────── */
.saz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  max-width: 1080px;
  margin: 0 auto;
  gap: 16px;
}
.saz-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.saz-logo { height: 28px; width: auto; }
.cadena-logo-sm { height: 26px; width: auto; }
.saz-x { font-size: 1rem; color: rgba(0,0,0,0.3); font-weight: 300; }
.saz-badge {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0e9f97;
  border: 1px solid #0e9f97;
  border-radius: 999px;
  padding: 3px 12px;
}
.back-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(0,0,0,0.4);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
}
.back-link:hover { color: #0e9f97; }

/* ─── Hero ───────────────────────────── */
.saz-hero {
  text-align: center;
  padding: 72px 24px 56px;
  max-width: 760px;
  margin: 0 auto;
}
.saz-eyebrow {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0e9f97;
  margin-bottom: 16px;
}
.saz-h1 {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 20px;
  color: #1a1a1a;
}
.saz-sub {
  font-size: 1.05rem;
  color: rgba(0,0,0,0.55);
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 620px;
  margin-left: auto;
  margin-right: auto;
}
.btn-hero {
  display: inline-block;
  background: #fecf4e;
  color: #1a1a1a;
  font-weight: 800;
  font-size: 1rem;
  padding: 15px 36px;
  border-radius: 12px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.btn-hero:hover { opacity: 0.85; }

/* ─── Sections ───────────────────────── */
.saz-section {
  padding: 64px 0;
}
.saz-section--alt {
  background: #e7f5f5;
}
.saz-container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}
.saz-section-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: 40px;
  color: #1a1a1a;
}

/* ─── Rig Layout ─────────────────────── */
.rig-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: start;
}
@media (min-width: 800px) {
  .rig-layout { grid-template-columns: 1fr 1fr; }
}
.rig-img-wrap {
  background: #cce9e8;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rig-img-placeholder {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(0,0,0,0.3);
  letter-spacing: 0.05em;
}
.rig-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 6px;
}
.rig-tagline {
  font-size: 0.8rem;
  color: rgba(0,0,0,0.45);
  margin-bottom: 24px;
}
.rig-stats {
  border: 1px solid rgba(14,159,151,0.2);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(14,159,151,0.12);
  gap: 12px;
}
.stat-row:last-child { border-bottom: none; }
.stat-row--highlight { background: #fefbec; }
.stat-label { font-size: 0.8rem; color: rgba(0,0,0,0.5); flex-shrink: 0; }
.stat-val { font-size: 0.85rem; font-weight: 700; color: #1a1a1a; text-align: right; }
.stat-val.accent { color: #0e9f97; font-size: 1rem; }
.stat-btc { font-size: 0.72rem; font-weight: 400; color: rgba(0,0,0,0.35); display: block; }
.rig-perks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rig-perks li {
  font-size: 0.82rem;
  color: rgba(0,0,0,0.55);
  padding-left: 18px;
  position: relative;
}
.rig-perks li::before { content: '✓'; position: absolute; left: 0; color: #0e9f97; font-weight: 700; }

/* ─── Steps ──────────────────────────── */
.steps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}
@media (min-width: 700px) {
  .steps-grid { grid-template-columns: repeat(3, 1fr); }
}
.step-card {
  background: #ffffff;
  border: 1px solid rgba(14,159,151,0.2);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.step-num {
  width: 34px;
  height: 34px;
  background: #0e9f97;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
}
.step-title { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
.step-desc { font-size: 0.8rem; color: rgba(0,0,0,0.55); line-height: 1.6; }
.step-desc strong { color: #1a1a1a; display: block; margin-top: 8px; }

/* ─── Economics ──────────────────────── */
.econ-box {
  background: #e7f5f5;
  border: 1px solid rgba(14,159,151,0.25);
  border-radius: 16px;
  overflow: hidden;
  max-width: 720px;
  margin: 0 auto 32px;
}
.econ-table {
  width: 100%;
  border-collapse: collapse;
}
.econ-table tr {
  border-bottom: 1px solid rgba(14,159,151,0.15);
}
.econ-table tr:last-child { border-bottom: none; }
.econ-row--highlight { background: #fefbec; }
.econ-item {
  padding: 14px 20px;
  font-size: 0.82rem;
  color: rgba(0,0,0,0.55);
  width: 55%;
}
.econ-val {
  padding: 14px 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: right;
}
.econ-row--highlight .econ-val { color: #0e9f97; }
.econ-disclosure {
  padding: 16px 20px;
  font-size: 0.72rem;
  color: rgba(0,0,0,0.4);
  line-height: 1.65;
  border-top: 1px solid rgba(14,159,151,0.15);
  background: #ffffff;
}
.econ-cta { text-align: center; }
.btn-apply {
  display: inline-block;
  background: #0e9f97;
  color: #ffffff;
  font-weight: 800;
  font-size: 1rem;
  padding: 15px 40px;
  border-radius: 12px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.btn-apply:hover { opacity: 0.88; }

/* ─── Two income streams ─────────────── */
.streams-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}
@media (min-width: 600px) {
  .streams-grid { grid-template-columns: 1fr 1fr; }
}
.stream-card {
  background: #ffffff;
  border: 1px solid rgba(14,159,151,0.2);
  border-radius: 14px;
  padding: 24px;
}
.stream-title { font-size: 0.95rem; font-weight: 700; color: #0e9f97; margin-bottom: 10px; }
.stream-body { font-size: 0.82rem; color: rgba(0,0,0,0.55); line-height: 1.6; }

/* ─── Footer ─────────────────────────── */
.saz-footer {
  text-align: center;
  padding: 28px 24px;
  border-top: 1px solid rgba(0,0,0,0.07);
  font-size: 0.78rem;
  color: rgba(0,0,0,0.35);
  background: #ffffff;
}
.footer-link { color: #0e9f97; text-decoration: none; }
.footer-link:hover { text-decoration: underline; }
.footer-legal { margin-top: 8px; font-size: 0.7rem; color: rgba(0,0,0,0.25); }
</style>
