<template>
  <div class="sc-page">
    <div class="hero">
      <div class="hero-eyebrow">DLC Settlement Calculator</div>
      <h1>What's Your Payout<br>at Settlement?</h1>
      <p>Slide the BTC settlement price to see exactly what each side of a Cadena loan receives from the DLC when it matures — in BTC and USD, across every possible price scenario.</p>
    </div>

    <div class="calculator-container">
      <!-- Left: Loan setup -->
      <div class="panel">
        <div class="panel-title">Loan Setup</div>
        <div class="panel-subtitle">Set the terms at inception.</div>

        <div class="perspective-toggle">
          <button class="perspective-btn active" data-view="borrower">Borrower</button>
          <button class="perspective-btn" data-view="lender">Lender</button>
        </div>

        <div class="input-group">
          <div class="input-label">
            <span>Loan Amount (USD)</span>
            <span class="input-value" id="loanDisplay">$50,000</span>
          </div>
          <input type="range" id="loanSlider" min="1000" max="500000" step="1000" value="50000" />
          <div class="slider-labels"><span>$1K</span><span>$500K</span></div>
          <div class="preset-buttons" id="loanPresets">
            <button class="preset-btn" data-val="10000">$10K</button>
            <button class="preset-btn" data-val="25000">$25K</button>
            <button class="preset-btn active" data-val="50000">$50K</button>
            <button class="preset-btn" data-val="100000">$100K</button>
            <button class="preset-btn" data-val="250000">$250K</button>
          </div>
        </div>

        <div class="input-group">
          <div class="input-label">
            <span>Interest Rate</span>
            <span class="input-value" id="rateDisplay">8%</span>
          </div>
          <input type="range" id="rateSlider" min="2" max="18" step="0.5" value="8" />
          <div class="slider-labels"><span>2%</span><span>18%</span></div>
        </div>

        <div class="input-group">
          <div class="input-label">
            <span>BTC Price at Inception</span>
            <span class="input-value" id="inceptionDisplay">$71,512</span>
          </div>
          <input type="range" id="inceptionSlider" min="30000" max="200000" step="500" value="71512" />
          <div class="slider-labels"><span>$30K</span><span>$200K</span></div>
        </div>

        <div class="info-note">
          <strong>Fixed terms:</strong> 50% LTV, 1-year term, 1% Cadena fee, no liquidations.
        </div>

        <router-link class="cta-button" to="/register">
          Create Your Loan on Cadena →
        </router-link>
      </div>

      <!-- Right: Settlement + payout -->
      <div class="panel">
        <div class="panel-title">Settlement Price</div>
        <div class="panel-subtitle">Drag to see your payout at any final BTC price.</div>

        <div class="input-group">
          <div class="input-label">
            <span>BTC Price at Maturity</span>
            <span class="input-value settlement" id="settleDisplay">$71,512</span>
          </div>
          <input type="range" id="settleSlider" class="settlement-slider" min="-70" max="300" step="0.5" value="0" />
          <div class="settlement-labels">
            <span>−70%</span>
            <span>Flat</span>
            <span>+300%</span>
          </div>
          <div class="preset-buttons" id="settlePresets" style="justify-content: center; margin-top: 14px;">
            <button class="preset-btn" data-val="-50">−50%</button>
            <button class="preset-btn" data-val="-30">−30%</button>
            <button class="preset-btn active" data-val="0">Flat</button>
            <button class="preset-btn" data-val="30">+30%</button>
            <button class="preset-btn" data-val="50">+50%</button>
            <button class="preset-btn" data-val="100">+100%</button>
          </div>
        </div>

        <div class="payout-hero">
          <div class="payout-label" id="payoutLabel">You Receive (Borrower)</div>
          <div class="payout-value" id="payoutBtc">— BTC</div>
          <div class="payout-usd" id="payoutUsd">≈ $—</div>

          <div class="pnl-row">
            <div class="pnl-box">
              <div class="pnl-box-label">vs. BTC Locked</div>
              <div class="pnl-box-value" id="pnlBtc">—</div>
            </div>
            <div class="pnl-box">
              <div class="pnl-box-label">vs. USD Contributed</div>
              <div class="pnl-box-value" id="pnlUsd">—</div>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-title" id="chartTitle">Payout Curve — BTC Received vs. Settlement Price</div>
          <svg class="chart-svg" id="chart" viewBox="0 0 600 180" preserveAspectRatio="none"></svg>
          <div class="chart-legend">
            <span><span class="legend-dot" style="background: #7c3aed;"></span> Your BTC payout</span>
            <span><span class="legend-dot" style="background: #6b7280;"></span> Your BTC locked at inception</span>
            <span><span class="legend-dot" style="background: #fbbf24;"></span> Current settlement price</span>
          </div>
        </div>

        <div class="ref-table">
          <div class="ref-table-title" id="refTableTitle">Payout Reference Points</div>
          <div class="ref-row header">
            <span>Scenario</span>
            <span>BTC Price</span>
            <span>You Receive</span>
            <span>USD Value</span>
          </div>
          <div id="refRows"></div>
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
  let currentView = 'borrower'

  const $ = id => document.getElementById(id)

  const fmt = (n, dec = 0) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
  const fmtBtc = n => n.toFixed(4)

  function updateSliderFill(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100
    slider.style.setProperty('--fill', pct + '%')
  }

  function computePosition(loanAmount, rate, inceptionPrice) {
    const FEE = 0.01
    const interestUSD = loanAmount * rate
    const feeUSD = loanAmount * FEE
    const lenderContribUSD = loanAmount
    const borrowerContribUSD = loanAmount + 2 * interestUSD + feeUSD
    const repaymentUSD = loanAmount + interestUSD
    const lenderBTC = lenderContribUSD / inceptionPrice
    const borrowerBTC = borrowerContribUSD / inceptionPrice
    const totalBTC = lenderBTC + borrowerBTC
    return { interestUSD, feeUSD, lenderContribUSD, borrowerContribUSD, repaymentUSD, lenderBTC, borrowerBTC, totalBTC }
  }

  function dlcPayout(pos, settlePrice) {
    const lenderOutBTC = Math.min(pos.repaymentUSD / settlePrice, pos.totalBTC)
    const borrowerOutBTC = Math.max(pos.totalBTC - lenderOutBTC, 0)
    return {
      lenderBTC: lenderOutBTC,
      borrowerBTC: borrowerOutBTC,
      lenderUSD: lenderOutBTC * settlePrice,
      borrowerUSD: borrowerOutBTC * settlePrice
    }
  }

  function lerpColor(c1, c2, t) {
    const h = s => parseInt(s, 16)
    const r = Math.round(h(c1.slice(1,3)) + (h(c2.slice(1,3)) - h(c1.slice(1,3))) * t)
    const g = Math.round(h(c1.slice(3,5)) + (h(c2.slice(3,5)) - h(c1.slice(3,5))) * t)
    const b = Math.round(h(c1.slice(5,7)) + (h(c2.slice(5,7)) - h(c1.slice(5,7))) * t)
    return `rgb(${r},${g},${b})`
  }

  function getDotColor(settlePct) {
    // matches the slider gradient: red 0-18%, red→yellow 18-38%, yellow→green 38-62%, green 62-100%
    const pos = (settlePct + 70) / 370
    if (pos <= 0.18) return '#ef4444'
    if (pos <= 0.38) return lerpColor('#ef4444', '#eab308', (pos - 0.18) / 0.20)
    if (pos <= 0.62) return lerpColor('#eab308', '#22c55e', (pos - 0.38) / 0.24)
    return '#22c55e'
  }

  function renderChart(pos, inceptionPrice, currentSettlePrice) {
    const svg = $('chart')
    const W = 600, H = 180, PAD_L = 40, PAD_R = 10, PAD_T = 12, PAD_B = 28
    const plotW = W - PAD_L - PAD_R
    const plotH = H - PAD_T - PAD_B
    const pMin = inceptionPrice * 0.3
    const pMax = inceptionPrice * 4.0
    const steps = 120
    const points = []
    for (let i = 0; i <= steps; i++) {
      const p = pMin + (pMax - pMin) * (i / steps)
      const payout = dlcPayout(pos, p)
      const btcOut = currentView === 'borrower' ? payout.borrowerBTC : payout.lenderBTC
      points.push({ price: p, btc: btcOut })
    }
    const maxBtc = Math.max(...points.map(pt => pt.btc)) * 1.08
    const xOf = p => PAD_L + ((p - pMin) / (pMax - pMin)) * plotW
    const yOf = b => PAD_T + plotH - (b / maxBtc) * plotH
    const pathD = points.map((pt, i) =>
      `${i === 0 ? 'M' : 'L'} ${xOf(pt.price).toFixed(1)} ${yOf(pt.btc).toFixed(1)}`
    ).join(' ')
    const lockedBtc = currentView === 'borrower' ? pos.borrowerBTC : pos.lenderBTC
    const lockedY = yOf(lockedBtc)
    const currentPayout = dlcPayout(pos, currentSettlePrice)
    const currentBtc = currentView === 'borrower' ? currentPayout.borrowerBTC : currentPayout.lenderBTC
    const cx = xOf(currentSettlePrice)
    const cy = yOf(currentBtc)
    const inceptionX = xOf(inceptionPrice)
    const yTicks = [0, maxBtc / 2, maxBtc * 0.92]
    const settlePct = (currentSettlePrice / inceptionPrice - 1) * 100
    const dotColor = getDotColor(settlePct)
    svg.innerHTML = `
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${PAD_T + plotH}" stroke="#374151" stroke-width="0.5"/>
      <line x1="${PAD_L}" y1="${PAD_T + plotH}" x2="${W - PAD_R}" y2="${PAD_T + plotH}" stroke="#374151" stroke-width="0.5"/>
      <line x1="${inceptionX}" y1="${PAD_T}" x2="${inceptionX}" y2="${PAD_T + plotH}" stroke="#6b7280" stroke-width="0.8" stroke-dasharray="3,3"/>
      <text x="${inceptionX}" y="${PAD_T - 2}" fill="#6b7280" font-size="9" text-anchor="middle" font-family="Inter">Inception $${fmt(inceptionPrice)}</text>
      <line x1="${PAD_L}" y1="${lockedY}" x2="${W - PAD_R}" y2="${lockedY}" stroke="#6b7280" stroke-width="0.8" stroke-dasharray="4,4"/>
      <text x="${W - PAD_R - 4}" y="${lockedY - 3}" fill="#9ca3af" font-size="9" text-anchor="end" font-family="Inter">Locked ${fmtBtc(lockedBtc)} BTC</text>
      <path d="${pathD} L ${xOf(pMax)} ${PAD_T + plotH} L ${xOf(pMin)} ${PAD_T + plotH} Z" fill="url(#areaGrad)"/>
      <path d="${pathD}" stroke="#a78bfa" stroke-width="2.2" fill="none" stroke-linejoin="round"/>
      <line x1="${cx}" y1="${PAD_T}" x2="${cx}" y2="${PAD_T + plotH}" stroke="${dotColor}" stroke-width="1" stroke-dasharray="2,3" opacity="0.6"/>
      <circle cx="${cx}" cy="${cy}" r="6" fill="${dotColor}" stroke="#0a0a0f" stroke-width="2.5"/>
      ${yTicks.map(b => `<text x="${PAD_L - 5}" y="${yOf(b) + 3}" fill="#6b7280" font-size="9" text-anchor="end" font-family="Inter">${fmtBtc(b)}</text>`).join('')}
      <text x="${xOf(pMin)}" y="${H - 8}" fill="#6b7280" font-size="9" text-anchor="start" font-family="Inter">$${fmt(pMin / 1000)}K</text>
      <text x="${xOf((pMin + pMax) / 2)}" y="${H - 8}" fill="#6b7280" font-size="9" text-anchor="middle" font-family="Inter">$${fmt((pMin + pMax) / 2 / 1000)}K</text>
      <text x="${xOf(pMax)}" y="${H - 8}" fill="#6b7280" font-size="9" text-anchor="end" font-family="Inter">$${fmt(pMax / 1000)}K</text>
    `
  }

  function renderRefTable(pos, inceptionPrice, currentPct) {
    const scenarios = [
      { label: 'Bear −50%', pct: -50 },
      { label: 'Bear −30%', pct: -30 },
      { label: 'Bear −10%', pct: -10 },
      { label: 'Flat', pct: 0 },
      { label: 'Bull +30%', pct: 30 },
      { label: 'Bull +50%', pct: 50 },
      { label: 'Bull +100%', pct: 100 },
      { label: 'Bull +200%', pct: 200 }
    ]
    const rows = scenarios.map(s => {
      const price = inceptionPrice * (1 + s.pct / 100)
      const payout = dlcPayout(pos, price)
      const btc = currentView === 'borrower' ? payout.borrowerBTC : payout.lenderBTC
      const usd = currentView === 'borrower' ? payout.borrowerUSD : payout.lenderUSD
      const activeClass = Math.abs(s.pct - currentPct) < 0.5 ? 'active' : ''
      return `
        <div class="ref-row ${activeClass}">
          <span>${s.label}</span>
          <span>$${fmt(price)}</span>
          <span>${fmtBtc(btc)} BTC</span>
          <span>$${fmt(usd)}</span>
        </div>
      `
    }).join('')
    $('refRows').innerHTML = rows
  }

  function calculate() {
    const loanAmount = parseFloat($('loanSlider').value)
    const rate = parseFloat($('rateSlider').value) / 100
    const inceptionPrice = parseFloat($('inceptionSlider').value)
    const settlePct = parseFloat($('settleSlider').value)
    const settlePrice = inceptionPrice * (1 + settlePct / 100)

    $('loanDisplay').textContent = `$${fmt(loanAmount)}`
    $('rateDisplay').textContent = `${(rate * 100).toFixed(1)}%`
    $('inceptionDisplay').textContent = `$${fmt(inceptionPrice)}`
    $('settleDisplay').textContent = `$${fmt(settlePrice)} (${settlePct >= 0 ? '+' : ''}${settlePct.toFixed(0)}%)`

    const pos = computePosition(loanAmount, rate, inceptionPrice)
    const payout = dlcPayout(pos, settlePrice)

    if (currentView === 'borrower') {
      $('payoutLabel').textContent = 'You Receive (Borrower)'
      $('payoutBtc').textContent = `${fmtBtc(payout.borrowerBTC)} BTC`
      $('payoutUsd').textContent = `≈ $${fmt(payout.borrowerUSD)} at settlement`
      const btcDelta = payout.borrowerBTC - pos.borrowerBTC
      const usdDelta = payout.borrowerUSD - pos.borrowerContribUSD
      $('pnlBtc').textContent = (btcDelta >= 0 ? '+' : '−') + fmtBtc(Math.abs(btcDelta)) + ' BTC'
      $('pnlBtc').className = 'pnl-box-value ' + (btcDelta > 0.00005 ? 'pnl-positive' : btcDelta < -0.00005 ? 'pnl-negative' : 'pnl-neutral')
      $('pnlUsd').textContent = (usdDelta >= 0 ? '+$' : '−$') + fmt(Math.abs(usdDelta))
      $('pnlUsd').className = 'pnl-box-value ' + (usdDelta > 1 ? 'pnl-positive' : usdDelta < -1 ? 'pnl-negative' : 'pnl-neutral')
      $('chartTitle').textContent = 'Borrower BTC Payout vs. Settlement Price'
      $('refTableTitle').textContent = 'Borrower Payout — Reference Points'
    } else {
      $('payoutLabel').textContent = 'You Receive (Lender)'
      $('payoutBtc').textContent = `${fmtBtc(payout.lenderBTC)} BTC`
      $('payoutUsd').textContent = `≈ $${fmt(payout.lenderUSD)} at settlement`
      const btcDelta = payout.lenderBTC - pos.lenderBTC
      const usdDelta = payout.lenderUSD - pos.lenderContribUSD
      $('pnlBtc').textContent = (btcDelta >= 0 ? '+' : '−') + fmtBtc(Math.abs(btcDelta)) + ' BTC'
      $('pnlBtc').className = 'pnl-box-value ' + (btcDelta > 0.00005 ? 'pnl-positive' : btcDelta < -0.00005 ? 'pnl-negative' : 'pnl-neutral')
      $('pnlUsd').textContent = (usdDelta >= 0 ? '+$' : '−$') + fmt(Math.abs(usdDelta))
      $('pnlUsd').className = 'pnl-box-value ' + (usdDelta > 1 ? 'pnl-positive' : usdDelta < -1 ? 'pnl-negative' : 'pnl-neutral')
      $('chartTitle').textContent = 'Lender BTC Payout vs. Settlement Price'
      $('refTableTitle').textContent = 'Lender Payout — Reference Points'
    }

    renderChart(pos, inceptionPrice, settlePrice)
    renderRefTable(pos, inceptionPrice, settlePct)
    ;['loanSlider', 'rateSlider', 'inceptionSlider', 'settleSlider'].forEach(id => updateSliderFill($(id)))
  }

  async function fetchPrice() {
    let price = null
    try {
      price = await getPrice()
    } catch {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        const data = await res.json()
        price = data.bitcoin.usd
      } catch {}
    }
    if (price && Number.isFinite(price)) {
      $('inceptionSlider').value = Math.round(price / 500) * 500
    }
    calculate()
  }

  ;['loanSlider', 'rateSlider', 'inceptionSlider', 'settleSlider'].forEach(id => {
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

  wirePresets('loanPresets', 'loanSlider')
  wirePresets('settlePresets', 'settleSlider')

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

.sc-page {
  font-family: 'Inter', sans-serif;
  background: #0a0a0f;
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sc-page .hero {
  text-align: center;
  padding: 50px 20px 20px;
  max-width: 760px;
}

.sc-page .hero h1 {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #c4b5fd, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
}

.sc-page .hero p { font-size: 16px; color: #9ca3af; line-height: 1.6; }

.sc-page .calculator-container {
  width: 100%;
  max-width: 1080px;
  padding: 20px 20px 40px;
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 24px;
}

@media (max-width: 860px) {
  .sc-page .calculator-container { grid-template-columns: 1fr; }
}

.sc-page .panel {
  background: rgba(20, 20, 30, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  padding: 28px;
}

.sc-page .panel-title {
  font-size: 13px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: #7c3aed; margin-bottom: 8px;
}

.sc-page .panel-subtitle { font-size: 13px; color: #9ca3af; margin-bottom: 24px; }

.sc-page .input-group { margin-bottom: 24px; }

.sc-page .input-label {
  font-size: 14px; font-weight: 500; color: #d1d5db;
  margin-bottom: 10px;
  display: flex; justify-content: space-between; align-items: center;
}

.sc-page .input-value { font-weight: 700; color: #a78bfa; font-size: 16px; }

.sc-page .input-value.settlement {
  font-size: 20px;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sc-page input[type="range"] {
  -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px;
  background: linear-gradient(to right, #7c3aed var(--fill, 50%), #1f1f2e var(--fill, 50%));
  outline: none; cursor: pointer;
}

.sc-page input[type="range"].settlement-slider {
  height: 10px; border-radius: 5px;
  background: linear-gradient(to right,
    #ef4444 0%,
    #ef4444 18%,
    #eab308 38%,
    #22c55e 62%,
    #22c55e 100%);
}

.sc-page input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
  background: #a78bfa; border: 3px solid #0a0a0f;
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.5);
  cursor: pointer; transition: transform 0.15s;
}

.sc-page input[type="range"].settlement-slider::-webkit-slider-thumb {
  width: 28px; height: 28px;
  background: #ffffff;
  border: 3px solid #000000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.sc-page input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.12); }

.sc-page .slider-labels {
  display: flex; justify-content: space-between;
  font-size: 11px; color: #6b7280; margin-top: 6px;
}

.sc-page .settlement-labels {
  display: flex; justify-content: space-between;
  font-size: 11px; margin-top: 8px;
  font-weight: 600;
}

.sc-page .settlement-labels span:nth-child(1) { color: #ef4444; }
.sc-page .settlement-labels span:nth-child(2) { color: #eab308; }
.sc-page .settlement-labels span:nth-child(3) { color: #22c55e; }

.sc-page .preset-buttons { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }

.sc-page .preset-btn {
  padding: 6px 12px; border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  background: rgba(139, 92, 246, 0.08);
  color: #c4b5fd;
  font-size: 12px; font-weight: 500;
  cursor: pointer; transition: all 0.2s; font-family: inherit;
}

.sc-page .preset-btn:hover, .sc-page .preset-btn.active {
  background: #7c3aed; color: white; border-color: #7c3aed;
}

.sc-page .perspective-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  background: rgba(10, 10, 15, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  margin-bottom: 20px;
}

.sc-page .perspective-btn {
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

.sc-page .perspective-btn.active {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  box-shadow: 0 2px 12px rgba(124, 58, 237, 0.3);
}

.sc-page .payout-hero {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(139, 92, 246, 0.05));
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 22px;
  margin-bottom: 20px;
  text-align: center;
}

.sc-page .payout-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #a78bfa;
  margin-bottom: 8px;
  font-weight: 600;
}

.sc-page .payout-value {
  font-size: 44px;
  font-weight: 800;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
}

.sc-page .payout-usd { font-size: 18px; color: #c4b5fd; margin-top: 6px; font-weight: 600; }

.sc-page .pnl-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(139, 92, 246, 0.15);
}

.sc-page .pnl-box {
  text-align: center;
  padding: 8px;
  background: rgba(10, 10, 15, 0.4);
  border-radius: 8px;
}

.sc-page .pnl-box-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 600;
}

.sc-page .pnl-box-value { font-size: 16px; font-weight: 700; }

.sc-page .pnl-positive { color: #4ade80; }
.sc-page .pnl-negative { color: #f87171; }
.sc-page .pnl-neutral { color: #9ca3af; }

.sc-page .chart-container {
  background: rgba(10, 10, 15, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.sc-page .chart-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #7c3aed;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
}

.sc-page .chart-svg { width: 100%; height: 180px; display: block; }

.sc-page .chart-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 8px;
}

.sc-page .chart-legend span { display: flex; align-items: center; gap: 5px; }
.sc-page .legend-dot { width: 10px; height: 10px; border-radius: 50%; }

.sc-page .ref-table {
  margin-top: 16px;
  background: rgba(10, 10, 15, 0.4);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.sc-page .ref-table-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #7c3aed;
  font-weight: 600;
  padding: 10px 14px;
  background: rgba(124, 58, 237, 0.08);
}

.sc-page .ref-row {
  display: grid;
  grid-template-columns: 0.9fr 0.8fr 1fr 1fr;
  padding: 8px 14px;
  font-size: 12px;
  border-top: 1px solid rgba(139, 92, 246, 0.06);
}

.sc-page .ref-row.header {
  color: #6b7280;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  border-top: none;
}

.sc-page .ref-row span:nth-child(n+2) { text-align: right; }

.sc-page .ref-row.active { background: rgba(251, 191, 36, 0.1); color: #fbbf24; font-weight: 600; }

.sc-page .cta-button {
  display: block; width: 100%; padding: 14px; margin-top: 20px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white; border: none; border-radius: 12px;
  font-size: 15px; font-weight: 700; cursor: pointer;
  font-family: inherit; transition: all 0.2s;
  text-align: center; text-decoration: none;
}

.sc-page .cta-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
}

.sc-page .info-note {
  background: rgba(74, 222, 128, 0.06);
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-left: 3px solid #4ade80;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  color: #d1d5db;
  line-height: 1.5;
  margin-top: 16px;
}

.sc-page .info-note strong { color: #86efac; }

.sc-page .powered-by { text-align: center; padding: 20px; font-size: 12px; color: #4b5563; }
.sc-page .powered-by a { color: #7c3aed; text-decoration: none; }
</style>
