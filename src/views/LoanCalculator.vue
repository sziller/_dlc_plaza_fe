<template>
  <div class="lc-page">
    <div class="hero">
      <div class="hero-eyebrow">Loan Calculator</div>
      <h1>How Much Bitcoin Do You<br>Need for a Loan?</h1>
      <p>Set your loan amount and interest rate — see exactly what you lock, what you receive, and what settlement looks like across every price scenario.</p>
    </div>

    <div class="trust-banner">
      <div class="trust-item">No liquidations</div>
      <div class="trust-item">Fixed at inception</div>
      <div class="trust-item">Keep your keys</div>
      <div class="trust-item">1-year term</div>
    </div>

    <div class="calculator-container">
      <!-- Left: Inputs -->
      <div class="panel">
        <div class="panel-title">Loan Parameters</div>
        <div class="panel-subtitle">Adjust loan amount and interest rate below.</div>

        <div class="fixed-params">
          <div class="fixed-item">
            <div class="fixed-label">LTV</div>
            <div class="fixed-value">50%</div>
          </div>
          <div class="fixed-item">
            <div class="fixed-label">Term</div>
            <div class="fixed-value">1 Year</div>
          </div>
          <div class="fixed-item">
            <div class="fixed-label">Cadena Fee</div>
            <div class="fixed-value">1%</div>
          </div>
        </div>

        <div class="input-group">
          <div class="input-label">
            <span>Loan Amount (USD)</span>
            <span class="input-value" id="lc-loanDisplay">$50,000</span>
          </div>
          <div class="slider-wrapper">
            <input type="range" id="lc-loanSlider" min="1000" max="1000000" step="1000" value="50000" />
          </div>
          <div class="slider-labels"><span>$1K</span><span>$1M</span></div>
          <div class="preset-buttons" id="lc-loanPresets">
            <button class="preset-btn" data-val="10000">$10K</button>
            <button class="preset-btn" data-val="25000">$25K</button>
            <button class="preset-btn active" data-val="50000">$50K</button>
            <button class="preset-btn" data-val="100000">$100K</button>
            <button class="preset-btn" data-val="250000">$250K</button>
          </div>
        </div>

        <div class="input-group">
          <div class="input-label">
            <span>Annual Interest Rate</span>
            <span class="input-value" id="lc-rateDisplay">8%</span>
          </div>
          <div class="slider-wrapper">
            <input type="range" id="lc-rateSlider" min="2" max="18" step="0.5" value="8" />
          </div>
          <div class="slider-labels"><span>2%</span><span>18%</span></div>
          <div class="preset-buttons" id="lc-ratePresets">
            <button class="preset-btn" data-val="4">4%</button>
            <button class="preset-btn" data-val="6">6%</button>
            <button class="preset-btn active" data-val="8">8%</button>
            <button class="preset-btn" data-val="10">10%</button>
            <button class="preset-btn" data-val="12">12%</button>
          </div>
        </div>

        <router-link class="cta-button" to="/register">
          Create Your Loan on Cadena →
        </router-link>
      </div>

      <!-- Right: Results -->
      <div class="panel">
        <div class="panel-title">Your Position</div>
        <div class="panel-subtitle">Switch perspectives to see either side of the loan.</div>

        <div class="perspective-toggle">
          <button class="perspective-btn active" data-view="borrower">Borrower</button>
          <button class="perspective-btn" data-view="lender">Lender</button>
        </div>

        <div class="result-hero">
          <div class="result-hero-label" id="lc-heroLabel">You Retain</div>
          <div class="result-hero-value" id="lc-heroValue">Bitcoin exposure of $50,000</div>
          <div class="result-hero-sub" id="lc-heroSub"></div>
        </div>

        <div class="hero-note" id="lc-heroNote">
          <strong>Note:</strong> The Bitcoin is locked as collateral — there is NO disbursement. If you need USD, you will need to sell Bitcoin from your remaining stack to convert to USD.  At maturity, you repay loan + interest in Bitcoin automatically from the collateral. The borrower maintains the full upside of the Bitcoin collateral throughout the term.
        </div>

        <div id="lc-breakdownSection"></div>

        <div class="settlement-section">
          <div class="settlement-title" id="lc-settlementTitle">Final Settlement — Borrower Payout</div>
          <div class="settlement-sub">
            <strong style="color: #fbbf24;">No liquidations along the way.</strong>
            BTC price moves don't affect anything until maturity. At year-end, the DLC pays out based on the settlement price:
          </div>

          <div class="settlement-scenarios">
            <div class="scenario-card">
              <div class="scenario-label">BEAR −30%</div>
              <div class="scenario-price" id="lc-bearPrice">$50,058</div>
              <div class="scenario-payout" id="lc-bearPayout">— BTC</div>
              <div class="scenario-payout-usd" id="lc-bearPayoutUsd">≈ $—</div>
              <div class="scenario-outcome" id="lc-bearOutcome">—</div>
            </div>
            <div class="scenario-card" style="border-color: rgba(139, 92, 246, 0.3);">
              <div class="scenario-label">FLAT</div>
              <div class="scenario-price" id="lc-flatPrice">$71,512</div>
              <div class="scenario-payout" id="lc-flatPayout">— BTC</div>
              <div class="scenario-payout-usd" id="lc-flatPayoutUsd">≈ $—</div>
              <div class="scenario-outcome" id="lc-flatOutcome">—</div>
            </div>
            <div class="scenario-card">
              <div class="scenario-label">BULL +50%</div>
              <div class="scenario-price" id="lc-bullPrice">$107,268</div>
              <div class="scenario-payout" id="lc-bullPayout">— BTC</div>
              <div class="scenario-payout-usd" id="lc-bullPayoutUsd">≈ $—</div>
              <div class="scenario-outcome" id="lc-bullOutcome">—</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { getPrice } from '../api/price'
import TheFooter from '../components/TheFooter.vue'

onMounted(() => {
  let btcPrice = 71512
  let currentView = 'borrower'

  const $ = id => document.getElementById(id)
  const fmt = (n, dec = 0) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })

  function updateSliderFill(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100
    slider.style.setProperty('--fill', pct + '%')
  }

  function calculate() {
    const loanAmount = parseFloat($('lc-loanSlider').value)
    const rate = parseFloat($('lc-rateSlider').value) / 100
    const FEE = 0.01

    const interestUSD = loanAmount * rate
    const feeUSD = loanAmount * FEE
    const lenderContribUSD = loanAmount
    const borrowerContribUSD = loanAmount + (2 * interestUSD) + feeUSD
    const repaymentUSD = loanAmount + interestUSD
    const btcExposureUSD = loanAmount

    const lenderBTC = lenderContribUSD / btcPrice
    const borrowerBTC = borrowerContribUSD / btcPrice
    const totalBTC = lenderBTC + borrowerBTC

    $('lc-loanDisplay').textContent = `$${fmt(loanAmount)}`
    $('lc-rateDisplay').textContent = `${(rate * 100).toFixed(1)}%`

    const bearPrice = btcPrice * 0.7
    const flatPrice = btcPrice
    const bullPrice = btcPrice * 1.5

    function dlcPayout(settlePrice) {
      const lenderOutBTC = Math.min(repaymentUSD / settlePrice, totalBTC)
      const borrowerOutBTC = Math.max(totalBTC - lenderOutBTC, 0)
      return {
        lenderBTC: lenderOutBTC,
        borrowerBTC: borrowerOutBTC,
        lenderUSD: lenderOutBTC * settlePrice,
        borrowerUSD: borrowerOutBTC * settlePrice
      }
    }

    const bear = dlcPayout(bearPrice)
    const flat = dlcPayout(flatPrice)
    const bull = dlcPayout(bullPrice)

    if (currentView === 'borrower') {
      $('lc-heroLabel').textContent = 'You Retain'
      $('lc-heroValue').textContent = `Bitcoin exposure of $${fmt(btcExposureUSD)}`
      $('lc-heroSub').innerHTML = `No disbursement — your BTC stays productive as collateral`
      $('lc-heroNote').style.display = 'block'

      $('lc-breakdownSection').innerHTML = `
        <div class="breakdown-title">You Lock (Borrower Collateral)</div>
        <div class="breakdown-row">
          <span class="breakdown-label">Loan principal (matching the lender)</span>
          <span class="breakdown-value">$${fmt(loanAmount)}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">2× Interest buffer<small>$${fmt(interestUSD)} interest × 2</small></span>
          <span class="breakdown-value">$${fmt(2 * interestUSD)}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">1% Cadena fee</span>
          <span class="breakdown-value">$${fmt(feeUSD)}</span>
        </div>
        <div class="breakdown-row highlight-row">
          <span class="breakdown-label" style="color: #c4b5fd; font-weight: 600;">Your total BTC locked</span>
          <span class="breakdown-value" style="color: #fbbf24;">${borrowerBTC.toFixed(4)} BTC<small>= $${fmt(borrowerContribUSD)}</small></span>
        </div>
        <div class="breakdown-title">Your Obligations at Maturity</div>
        <div class="breakdown-row">
          <span class="breakdown-label">Repay in BTC<small>Loan principal + interest</small></span>
          <span class="breakdown-value">$${fmt(repaymentUSD)}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">Lender collateral (for reference)</span>
          <span class="breakdown-value" style="color: #9ca3af;">${lenderBTC.toFixed(4)} BTC<small>= $${fmt(lenderContribUSD)}</small></span>
        </div>
      `

      $('lc-settlementTitle').textContent = 'Final Settlement — Borrower Payout'
      $('lc-bearPayout').textContent = `${bear.borrowerBTC.toFixed(4)} BTC`
      $('lc-bearPayoutUsd').textContent = `≈ $${fmt(bear.borrowerUSD)}`
      $('lc-bearOutcome').innerHTML = `Repay $${fmt(repaymentUSD)}. <strong style="color:#4ade80;">No liquidation</strong> through the drawdown.`
      $('lc-flatPayout').textContent = `${flat.borrowerBTC.toFixed(4)} BTC`
      $('lc-flatPayoutUsd').textContent = `≈ $${fmt(flat.borrowerUSD)}`
      $('lc-flatOutcome').innerHTML = `Repay $${fmt(repaymentUSD)}. Used $${fmt(loanAmount)} cash for 1 year.`
      $('lc-bullPayout').textContent = `${bull.borrowerBTC.toFixed(4)} BTC`
      $('lc-bullPayoutUsd').textContent = `≈ $${fmt(bull.borrowerUSD)}`
      $('lc-bullOutcome').innerHTML = `Repay $${fmt(repaymentUSD)}. <strong style="color:#fbbf24;">Keeps 100% of BTC upside.</strong>`
    } else {
      $('lc-heroLabel').textContent = 'You Earn'
      $('lc-heroValue').textContent = `$${fmt(interestUSD)} yield`
      $('lc-heroSub').innerHTML = `<strong style="color:#4ade80;">${(rate * 100).toFixed(1)}%</strong> paid in BTC on $${fmt(loanAmount)} deployed`
      $('lc-heroNote').style.display = 'none'

      $('lc-breakdownSection').innerHTML = `
        <div class="breakdown-title">You Lock (Lender Collateral)</div>
        <div class="breakdown-row highlight-row">
          <span class="breakdown-label" style="color: #c4b5fd; font-weight: 600;">Your BTC deployed</span>
          <span class="breakdown-value" style="color: #fbbf24;">${lenderBTC.toFixed(4)} BTC<small>= $${fmt(lenderContribUSD)}</small></span>
        </div>
        <div class="breakdown-title">Your Return at Maturity</div>
        <div class="breakdown-row">
          <span class="breakdown-label">Principal returned<small>In BTC, valued in USD at settlement</small></span>
          <span class="breakdown-value">$${fmt(loanAmount)}</span>
        </div>
        <div class="breakdown-row">
          <span class="breakdown-label">Interest earned</span>
          <span class="breakdown-value" style="color: #4ade80;">$${fmt(interestUSD)}</span>
        </div>
        <div class="breakdown-row highlight-row">
          <span class="breakdown-label" style="color: #c4b5fd; font-weight: 600;">Total USD value owed to you</span>
          <span class="breakdown-value" style="color: #fbbf24;">$${fmt(repaymentUSD)}</span>
        </div>
        <div class="breakdown-title">Counterparty (for reference)</div>
        <div class="breakdown-row">
          <span class="breakdown-label">Borrower BTC locked<small>Principal match + 2× interest + 1% fee</small></span>
          <span class="breakdown-value" style="color: #9ca3af;">${borrowerBTC.toFixed(4)} BTC<small>= $${fmt(borrowerContribUSD)}</small></span>
        </div>
      `

      $('lc-settlementTitle').textContent = 'Final Settlement — Lender Payout'
      $('lc-bearPayout').textContent = `${bear.lenderBTC.toFixed(4)} BTC`
      $('lc-bearPayoutUsd').textContent = `≈ $${fmt(bear.lenderUSD)}`
      $('lc-bearOutcome').innerHTML = `Receive <strong style="color:#fbbf24;">more BTC</strong> to make you whole in USD terms.`
      $('lc-flatPayout').textContent = `${flat.lenderBTC.toFixed(4)} BTC`
      $('lc-flatPayoutUsd').textContent = `≈ $${fmt(flat.lenderUSD)}`
      $('lc-flatOutcome').innerHTML = `Earned <strong style="color:#4ade80;">+${(rate * 100).toFixed(1)}%</strong> in BTC vs. deployment.`
      $('lc-bullPayout').textContent = `${bull.lenderBTC.toFixed(4)} BTC`
      $('lc-bullPayoutUsd').textContent = `≈ $${fmt(bull.lenderUSD)}`
      $('lc-bullOutcome').innerHTML = `Still paid $${fmt(repaymentUSD)} — BTC needed is less.`
    }

    $('lc-bearPrice').textContent = `BTC @ $${fmt(bearPrice)}`
    $('lc-flatPrice').textContent = `BTC @ $${fmt(flatPrice)}`
    $('lc-bullPrice').textContent = `BTC @ $${fmt(bullPrice)}`

    ;['lc-loanSlider', 'lc-rateSlider'].forEach(id => updateSliderFill($(id)))
  }

  async function fetchPrice() {
    try {
      btcPrice = await getPrice()
    } catch {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        const data = await res.json()
        btcPrice = data.bitcoin.usd
      } catch {}
    }
    calculate()
  }

  ;['lc-loanSlider', 'lc-rateSlider'].forEach(id => {
    $(id).addEventListener('input', calculate)
  })

  function wirePresets(containerId, sliderId) {
    const container = $(containerId)
    if (!container) return
    container.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $(sliderId).value = btn.dataset.val
        container.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        calculate()
      })
    })
  }

  wirePresets('lc-loanPresets', 'lc-loanSlider')
  wirePresets('lc-ratePresets', 'lc-rateSlider')

  document.querySelectorAll('.perspective-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.perspective-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      currentView = btn.dataset.view
      calculate()
    })
  })

  fetchPrice()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.lc-page {
  font-family: 'Inter', sans-serif;
  background: #081123;
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lc-page .hero {
  text-align: center;
  padding: 56px 20px 28px;
  max-width: 760px;
}

.lc-page .hero-eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #6738e3;
  background: rgba(103, 56, 227, 0.1);
  border: 1px solid rgba(103, 56, 227, 0.25);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.lc-page .hero h1 {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.15;
  color: #ffffff;
  margin-bottom: 16px;
}

.lc-page .hero p { font-size: 16px; color: rgba(255,255,255,0.55); line-height: 1.7; }

.lc-page .trust-banner {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 16px 20px 24px;
}

.lc-page .trust-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 600;
}

.lc-page .trust-item::before {
  content: "✓";
  color: #4ade80;
  font-weight: 800;
  font-size: 16px;
}

.lc-page .calculator-container {
  width: 100%;
  max-width: 1080px;
  padding: 0 20px 40px;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 24px;
}

@media (max-width: 860px) {
  .lc-page .calculator-container { grid-template-columns: 1fr; }
}

.lc-page .panel {
  background: rgba(8, 17, 35, 0.9);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  padding: 28px;
}

.lc-page .panel-title {
  font-size: 13px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: #7c3aed; margin-bottom: 8px;
}

.lc-page .panel-subtitle { font-size: 13px; color: #9ca3af; margin-bottom: 24px; }

.lc-page .fixed-params {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 28px;
  padding: 14px;
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 10px;
}

.lc-page .fixed-item { text-align: center; }

.lc-page .fixed-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6b7280;
  margin-bottom: 4px;
}

.lc-page .fixed-value { font-size: 16px; font-weight: 700; color: #c4b5fd; }

.lc-page .input-group { margin-bottom: 28px; }

.lc-page .input-label {
  font-size: 14px; font-weight: 500; color: #d1d5db;
  margin-bottom: 10px;
  display: flex; justify-content: space-between; align-items: center;
}

.lc-page .input-value { font-weight: 700; color: #a78bfa; font-size: 16px; }

.lc-page .slider-wrapper { position: relative; margin-bottom: 8px; }

.lc-page input[type="range"] {
  -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px;
  background: linear-gradient(to right, #7c3aed var(--fill, 50%), #0d1a30 var(--fill, 50%));
  outline: none; cursor: pointer;
}

.lc-page input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
  background: #a78bfa; border: 3px solid #081123;
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.5);
  cursor: pointer; transition: transform 0.15s;
}

.lc-page input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); }

.lc-page .slider-labels {
  display: flex; justify-content: space-between;
  font-size: 11px; color: #6b7280; margin-top: 4px;
}

.lc-page .preset-buttons { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }

.lc-page .preset-btn {
  padding: 6px 14px; border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  background: rgba(139, 92, 246, 0.08);
  color: #c4b5fd;
  font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.2s; font-family: inherit;
}

.lc-page .preset-btn:hover, .lc-page .preset-btn.active {
  background: #7c3aed; color: white; border-color: #7c3aed;
}

.lc-page .perspective-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  background: rgba(8, 17, 35, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  margin-bottom: 20px;
}

.lc-page .perspective-btn {
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 9px;
  transition: all 0.2s;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.lc-page .perspective-btn.active {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  box-shadow: 0 2px 12px rgba(124, 58, 237, 0.3);
}

.lc-page .result-hero {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(139, 92, 246, 0.05));
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.lc-page .result-hero-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #a78bfa;
  margin-bottom: 6px;
  font-weight: 600;
}

.lc-page .result-hero-value {
  font-size: 38px;
  font-weight: 800;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
}

.lc-page .result-hero-sub { font-size: 13px; color: #9ca3af; margin-top: 8px; }

.lc-page .hero-note {
  background: rgba(74, 222, 128, 0.06);
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-left: 3px solid #4ade80;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 12.5px;
  color: #d1d5db;
  line-height: 1.55;
  margin-bottom: 20px;
}

.lc-page .hero-note strong { color: #86efac; }

.lc-page .breakdown-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #7c3aed;
  margin: 20px 0 12px;
  font-weight: 600;
}

.lc-page .breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(139, 92, 246, 0.08);
  font-size: 14px;
}

.lc-page .breakdown-row:last-child { border: none; }
.lc-page .breakdown-label { color: #9ca3af; }
.lc-page .breakdown-label small { color: #6b7280; font-size: 11px; display: block; margin-top: 2px; }
.lc-page .breakdown-value { color: #e5e7eb; font-weight: 600; text-align: right; }
.lc-page .breakdown-value small { color: #6b7280; font-weight: 400; font-size: 11px; display: block; }

.lc-page .highlight-row {
  background: rgba(139, 92, 246, 0.08);
  margin: 0 -14px;
  padding: 12px 14px !important;
  border-radius: 8px;
  border-bottom: none !important;
}

.lc-page .settlement-section {
  background: rgba(245, 158, 11, 0.04);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

.lc-page .settlement-title {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #fbbf24;
  margin-bottom: 8px;
  font-weight: 600;
}

.lc-page .settlement-sub { font-size: 13px; color: #9ca3af; margin-bottom: 16px; }

.lc-page .settlement-scenarios {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.lc-page .scenario-card {
  background: rgba(8, 17, 35, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 8px;
  padding: 14px 10px;
  text-align: center;
}

.lc-page .scenario-label {
  font-size: 11px; color: #9ca3af; margin-bottom: 4px;
  font-weight: 700; letter-spacing: 1px;
}

.lc-page .scenario-price { font-size: 12px; color: #6b7280; margin-bottom: 10px; }

.lc-page .scenario-payout {
  font-size: 18px; font-weight: 800; color: #fbbf24; line-height: 1.1;
}

.lc-page .scenario-payout-usd { font-size: 11px; color: #9ca3af; margin-top: 2px; }

.lc-page .scenario-outcome {
  font-size: 12px; font-weight: 500; color: #c4b5fd;
  line-height: 1.4; margin-top: 10px; padding-top: 10px;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.lc-page .cta-button {
  display: block; width: 100%; padding: 16px; margin-top: 24px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white; border: none; border-radius: 12px;
  font-size: 16px; font-weight: 700; cursor: pointer;
  font-family: inherit; transition: all 0.2s;
  text-align: center; text-decoration: none;
}

.lc-page .cta-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
}
</style>
