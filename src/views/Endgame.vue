<template>
  <div class="endgame-page">
    <header class="hero">
      <div class="container">
        <div class="eyebrow">A New Book by Kevin Bell</div>
        <h1 class="title">Endgame</h1>
        <p class="subtitle">Bitcoin, Sovereign Debt, and the Return of Sound Capital</p>
        <p class="author">By <strong>Kevin Bell</strong> &nbsp;·&nbsp; Founder, Cadena Bitcoin</p>

        <div class="charitable-banner">
          <strong>50% of proceeds fund kids' surf programs at
            <a href="https://surfdojo.org" target="_blank" rel="noopener noreferrer">SurfDojo</a>
            (Playa Hermosa, Costa Rica) and
            <a href="https://www.bitcoinbeach.com" target="_blank" rel="noopener noreferrer">Bitcoin Beach</a>
            (El Zonte, El Salvador).
          </strong>
          Pay in Bitcoin.
        </div>

        <div class="cta-row">
          <a href="/endgame.pdf" class="btn btn-primary">Download free PDF</a>
        </div>
      </div>
    </header>

    <section id="about">
      <div class="container">
        <h2 class="section-title">What this book is</h2>
        <p>
          <em>Endgame</em> is a serious framework for allocating in a Bitcoin-anchored monetary order. It is written for people who already understand what Bitcoin is and want a rigorous way to think about why it matters and how to position around it — financial professionals, sophisticated individual investors, and the intellectually curious reader who is looking for an argument rather than a price target.
        </p>
        <p>
          It builds on the work of Saifedean Ammous, Lyn Alden, and Jeff Booth, and pushes into territory they have not fully developed: the Hayekian epistemic critique of central banking, the death of the 60/40 portfolio, the case that sovereign debt is not actually risk-free, the Bitcoin yield curve as the missing civilizational primitive, and the synthetic risk-free rate that cryptographic credit infrastructure makes possible for the first time in fifty years.
        </p>
        <p>
          It is ~33,000 words. Nineteen chapters across four parts. It does not predict the price of Bitcoin in any year. It does not tell you Bitcoin is inevitable. It gives you a framework that, applied honestly, produces decisions you can defend.
        </p>

        <h3>What you will find in it</h3>
        <ul>
          <li><strong>Part I — The Diagnosis.</strong> Hayek's knowledge problem applied to money, the Cantillon engine, the productivity capture of the post-1971 era, and the COVID-era expansion as the cleanest natural experiment in modern monetary history.</li>
          <li><strong>Part II — The Anchor.</strong> Why Bitcoin's exogenous supply is the structural response, the evolutionary case versus gold, and the rules-over-discretion argument from constitutional political economy.</li>
          <li><strong>Part III — The Allocation.</strong> The death of 60/40, position sizing through Kelly with errors-of-omission framing, paper Bitcoin versus self-custody as different risk profiles, and Bitcoin-collateralized credit as the replacement for sovereign debt.</li>
          <li><strong>Part IV — Completing the System.</strong> Time value of money on Bitcoin via DLC-enforced credit, the synthetic risk-free rate construction, the emergence of a market-discovered Bitcoin yield curve, and what the cost-of-capital reframing means for sovereigns, households, and everyone in between.</li>
        </ul>
      </div>
    </section>

    <section id="charitable">
      <div class="container">
        <h2 class="section-title">Where the money goes</h2>
        <p>
          Half of every dollar this book earns is split between two organizations that teach kids to surf — one in Playa Hermosa, Costa Rica, and one in El Zonte, El Salvador. The flow is automatic. Bitcoin payments split on receipt; cash payments are reconciled and transferred quarterly. Quarterly updates are published below.
        </p>

        <div class="charity-grid">
          <div class="charity-card">
            <div class="charity-name">
              <a href="https://surfdojo.org" target="_blank" rel="noopener noreferrer" class="charity-link">SurfDojo →</a>
            </div>
            <div class="charity-loc">Playa Hermosa, Costa Rica</div>
            <p class="charity-desc">Through surfing, mentorship, and community, SurfDojo empowers youth in Costa Rica to grow with confidence, resilience, and purpose. The program is built on the philosophy that the ocean is more than a playground — it is a teacher. Donations fund scholarships, transportation, and equipment for kids who would not otherwise have access.</p>
            <div style="margin-top:14px;font-size:13px"><a href="https://surfdojo.org" target="_blank" rel="noopener noreferrer">surfdojo.org →</a></div>
          </div>

          <div class="charity-card">
            <div class="charity-name">
              <a href="https://www.bitcoinbeach.com" target="_blank" rel="noopener noreferrer" class="charity-link">Bitcoin Beach →</a>
            </div>
            <div class="charity-loc">El Zonte, El Salvador</div>
            <p class="charity-desc">The original Bitcoin community geographic instance, where Bitcoin works as money in daily life. Funds support the kids' surf programs (including <em>Surf Para Todas</em>) that provide instruction, equipment, and water time to local children — built on the same principle: the ocean as teacher, sound money as foundation.</p>
            <div style="margin-top:14px;font-size:13px"><a href="https://www.bitcoinbeach.com" target="_blank" rel="noopener noreferrer">bitcoinbeach.com →</a></div>
          </div>
        </div>

        <div class="donate-grid">
          <div class="donate-card">
            <div class="donate-label">Bitcoin</div>
            <img class="donate-qr" :src="btcQrUrl" alt="Bitcoin QR code" width="180" height="180" loading="lazy" decoding="async" />
            <div class="donate-addr-row">
              <span class="donate-addr-text" :class="{ expanded: btcExpanded }">
                <template v-if="!btcExpanded">{{ btcAddress.slice(0, 24) }}…</template>
                <template v-else>{{ btcAddress }}</template>
              </span>
              <div class="addr-icons">
                <button class="addr-icon" @click="btcExpanded = !btcExpanded" :title="btcExpanded ? 'Hide' : 'Show full address'">
                  <svg v-if="!btcExpanded" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
                <button class="addr-icon" @click="copy(btcAddress, 'btc')" :title="copied === 'btc' ? 'Copied!' : 'Copy address'">
                  <svg v-if="copied !== 'btc'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <p class="muted" style="margin-top:24px;font-size:14px">
          The 50% to charities is split evenly between the two programs. The remaining 50% is retained by the author to cover production, distribution, and the indefinite horizon of writing more.
        </p>
      </div>
    </section>

    <section id="download">
      <div class="container">
        <h2 class="section-title">Read it free</h2>
        <p>
          The PDF is free. No email gate, no paywall. If the framework changes how you allocate, send the price of a paperback to the surf programs above. If it does not, send nothing. Either way, read it.
        </p>
        <div class="cta-row" style="margin-top:8px">
          <a href="/endgame.pdf" class="btn btn-primary">Download PDF</a>
          <a href="#buy" class="btn btn-secondary" @click.prevent="scrollToBuy">Order physical copy →</a>
        </div>
        <p class="pricing-note" style="margin-top:24px">
          <strong>Suggested donation:</strong> 21,000 sats in Bitcoin — splits automatically. 50% to surf programs, 50% to author.
        </p>
      </div>
    </section>

    <section id="buy">
      <div class="container">
        <h2 class="section-title">Order a physical copy</h2>
        <p>
          $29 in Bitcoin · $45 by card · Printed on demand via Lulu Press · Shipped worldwide.
          50% of the cover price goes to the surf programs above.
        </p>
        <div class="buy-layout">
          <BookCheckout />
        </div>
      </div>
    </section>

    <section id="excerpt">
      <div class="container">
        <h2 class="section-title">Excerpt</h2>
        <p class="muted">From Chapter 18: Everyone Has a Cost of Capital</p>
        <blockquote>
          Everyone has a cost of capital. Households have one. Corporations have one. Sovereigns have one. Whether they admit it or not, it determines what they can build, fund, finance, and forego. The current monetary regime distorts this price signal across the entire structure of capital users, in a hierarchy almost nobody questions. This hierarchy is not a function of true credit risk. It is a function of distance from the central bank's spigot.
        </blockquote>
        <p>
          <a href="/endgame.pdf">Read the full chapter →</a>
        </p>
      </div>
    </section>

    <section id="author">
      <div class="container">
        <h2 class="section-title">About the author</h2>
        <p>
          <strong>Kevin Bell</strong> is the founder of <a href="https://cadenabitcoin.com">Cadena Bitcoin</a>, a non-custodial Bitcoin lending and borrowing marketplace built on Discreet Log Contracts. The thesis of this book is also the thesis the company is built on: that the existing monetary system is epistemically broken, that Bitcoin is the response, and that a market-discovered yield curve denominated against Bitcoin collateral is what completes that response.
        </p>
        <p>
          He lives in Playa Hermosa, Costa Rica, and likes to surf, play with dogs, and think about numbers when he is not working. The book is dedicated to the ocean — more than a playground, a teacher of confidence, resilience, and purpose — and to the Bitcoin community in El Zonte that proved sound money is not a thought experiment.
        </p>
      </div>
    </section>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TheFooter from '../components/TheFooter.vue'
import BookCheckout from '../components/BookCheckout.vue'

const btcAddress = 'bc1qvt3ytuvch7p5ukqhlxmds2frydk5y7hc8vv2s8c0ax3lmn8jyyqqhef36t'
const btcQrUrl = computed(() =>
  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&ecc=M&data=${encodeURIComponent('bitcoin:' + btcAddress)}`
)

const btcExpanded = ref(false)
const copied = ref('')

function copy(text, key) {
  navigator.clipboard.writeText(text)
  copied.value = key
  setTimeout(() => { copied.value = '' }, 2000)
}

function scrollToBuy() {
  document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
  .endgame-page {
    --bg: #081123;
    --surface: #0d1a2e;
    --surface-2: #112038;
    --border: #2e2e2e;
    --text: #f0f0f0;
    --text-muted: #888888;
    --accent: #ffffff;
    --accent-hover: #cccccc;
    --accent-soft: rgba(255, 255, 255, 0.05);
    --max-width: 760px;
    --serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
    --sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;

    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    font-size: 17px;
    min-height: 100vh;
  }

  .container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 24px;
  }

  /* HERO */
  .hero {
    padding: 96px 0 72px;
    border-bottom: 1px solid var(--border);
  }
  .eyebrow {
    color: var(--accent);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 600;
    margin-bottom: 20px;
  }
  h1.title {
    font-family: var(--serif);
    font-size: clamp(40px, 7vw, 64px);
    line-height: 1.05;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 24px;
  }
  .subtitle {
    font-family: var(--serif);
    font-style: italic;
    font-size: clamp(20px, 3vw, 26px);
    color: var(--text);
    line-height: 1.35;
    margin-bottom: 32px;
    max-width: 600px;
  }
  .author {
    font-size: 15px;
    color: var(--text-muted);
    margin-bottom: 40px;
  }
  .author strong { color: var(--text); font-weight: 600; }
  .charitable-banner {
    background: var(--accent-soft);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 18px 22px;
    margin-top: 32px;
    font-size: 15px;
    line-height: 1.5;
  }
  .charitable-banner strong { color: var(--accent); font-weight: 600; }
  .charitable-banner a { color: var(--accent); text-decoration: underline; }
  .cta-row {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 36px;
  }
  .btn {
    display: inline-block;
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.15s ease;
    border: 1px solid transparent;
    font-family: var(--sans);
    cursor: pointer;
  }
  .btn-primary {
    background: var(--accent);
    color: #000000;
  }
  .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
  .btn-secondary {
    background: transparent;
    color: var(--text);
    border-color: var(--border);
  }
  .btn-secondary:hover { border-color: var(--text-muted); background: var(--surface); }

  /* SECTIONS */
  section {
    padding: 72px 0;
    border-bottom: 1px solid var(--border);
  }
  section:last-of-type { border-bottom: none; }
  h2.section-title {
    font-family: var(--serif);
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 28px;
    letter-spacing: -0.01em;
  }
  h3 {
    font-family: var(--sans);
    font-size: 18px;
    font-weight: 600;
    margin: 28px 0 12px;
    color: var(--text);
  }
  p {
    margin-bottom: 18px;
    color: var(--text);
  }
  p.muted { color: var(--text-muted); }
  ul {
    margin: 0 0 18px 22px;
    color: var(--text);
  }
  li { margin-bottom: 8px; }
  em { color: var(--text); font-style: italic; }
  blockquote {
    border-left: 3px solid var(--accent);
    padding: 4px 0 4px 22px;
    margin: 28px 0;
    font-family: var(--serif);
    font-style: italic;
    font-size: 19px;
    color: var(--text);
  }

  /* PRICING */
  .pricing-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 28px;
  }
  @media (min-width: 700px) {
    .pricing-grid { grid-template-columns: 1fr 1fr; }
  }
  .price-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 26px;
  }
  .price-card.featured { border-color: var(--accent); background: linear-gradient(180deg, var(--accent-soft), var(--surface)); }
  .price-tier {
    font-size: 12px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .price-name {
    font-family: var(--serif);
    font-size: 22px;
    margin-bottom: 12px;
  }
  .price-rows {
    margin: 18px 0;
    font-size: 15px;
  }
  .price-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }
  .price-row:last-child { border-bottom: none; }
  .price-row .label { color: var(--text-muted); }
  .price-row .amount { font-family: var(--mono); color: var(--text); font-weight: 600; }
  .price-row .amount.fiat { color: var(--text-muted); text-decoration: line-through; }
  .price-row .amount.btc { color: var(--accent); }
  .pricing-note {
    background: var(--surface-2);
    border-radius: 8px;
    padding: 16px 20px;
    margin-top: 24px;
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.6;
  }
  .pricing-note strong { color: var(--accent); font-weight: 600; }

  /* DONATE */
  .donate-grid {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }
  .donate-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .donate-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #f97316;
  }
  .donate-qr {
    border-radius: 8px;
    background: #fff;
    padding: 8px;
    display: block;
  }
  .donate-addr-row {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    width: 100%;
    min-width: 0;
  }
  .donate-addr-text {
    font-family: var(--mono);
    font-size: 11px;
    color: #f97316;
    flex: 1;
    min-width: 0;
    line-height: 1.5;
    white-space: nowrap;
  }
  .donate-addr-text.expanded {
    white-space: normal;
    word-break: break-all;
  }
  .addr-icons {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
    padding-top: 1px;
  }
  .addr-icon {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    padding: 2px;
    display: flex;
    align-items: center;
    transition: color 0.15s;
  }
  .addr-icon:hover { color: var(--text); }
  .addr-icon svg { width: 14px; height: 14px; }

  /* CHARITY */
  .charity-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 24px;
  }
  @media (min-width: 700px) { .charity-grid { grid-template-columns: 1fr 1fr; } }
  .charity-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 24px;
  }
  .charity-name {
    font-family: var(--serif);
    font-size: 20px;
    margin-bottom: 8px;
  }
  .charity-link {
    color: var(--text);
    text-decoration: none;
    border-bottom: 1px solid var(--accent);
  }
  .charity-loc {
    color: var(--text-muted);
    font-size: 13px;
    margin-bottom: 14px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .charity-desc { font-size: 15px; margin-bottom: 16px; color: var(--text); }
  .addr-block {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 14px;
    font-family: var(--mono);
    font-size: 12px;
    color: #f7931a;
    word-break: break-all;
    margin-bottom: 8px;
  }
  .addr-label {
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }

  /* ENDORSEMENTS */
  .endorsement {
    background: var(--surface);
    border-left: 3px solid var(--accent);
    padding: 22px 24px;
    margin-bottom: 16px;
    border-radius: 0 8px 8px 0;
  }
  .endorsement p { font-family: var(--serif); font-style: italic; font-size: 17px; margin-bottom: 12px; }
  .endorsement cite { font-style: normal; color: var(--text-muted); font-size: 14px; }
  .endorsement cite strong { color: var(--text); font-weight: 600; }

  /* BUY SECTION */
  .buy-layout {
    max-width: 560px;
    margin-top: 28px;
  }

  /* MISC */
  a { color: var(--accent); }
  a:hover { color: var(--accent-hover); }
  .mono-text { font-family: var(--mono); color: var(--text); }
  .placeholder {
    color: var(--text-muted);
    font-size: 13px;
    font-style: italic;
    padding: 8px 0;
    display: block;
  }
</style>
