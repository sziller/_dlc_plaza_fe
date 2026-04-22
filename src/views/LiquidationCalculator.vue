<template>
  <div class="liq-page">
    <div class="liq-hero">
      <div class="liq-eyebrow">Liquidation Risk Calculator</div>
      <h1>How likely is your Bitcoin loan to be <span class="hl">liquidated?</span></h1>
      <p class="lede">
        Watch 10,000 Monte Carlo simulations of Bitcoin's price run live over a one-year, 50% LTV loan. See the margin-call zone, the liquidation zone, and how a fixed-term, no-margin-call loan compares.
      </p>
    </div>

    <div class="wrap">
      <div class="quick-bar">
        <div class="qb-item">
          <span class="lbl">BTC price (live)</span>
          <span class="val live" id="qb_price">—</span>
        </div>
        <div class="qb-item">
          <span class="lbl">Loan term</span>
          <span class="val">1 year</span>
        </div>
        <div class="qb-item">
          <span class="lbl">Initial LTV</span>
          <span class="val">50%</span>
        </div>

        <div class="qb-controls">
          <div class="qb-field">
            <label for="liq-loan">Your loan size (USD)</label>
            <input id="liq-loan" type="number" value="50000" min="1000" step="1000" />
          </div>
          <div class="pill-group">
            <span class="glabel">Volatility</span>
            <div class="pill-row" id="volPresets">
              <span class="pill" data-vol="30">30% low</span>
              <span class="pill active" data-vol="40">40% base</span>
              <span class="pill" data-vol="50">50% high</span>
            </div>
          </div>
          <div class="pill-group">
            <span class="glabel">Drift (µ)</span>
            <div class="pill-row" id="driftPresets">
              <span class="pill active" data-drift="0">Zero (paper)</span>
              <span class="pill" data-drift="flat">Flat median</span>
              <span class="pill" data-drift="40">BTC historical +40%/yr</span>
            </div>
          </div>
          <button class="btn" id="runBtn">Run 10,000 simulations</button>
        </div>
      </div>

      <div class="note">
        <strong>Why does the median trend down?</strong> With zero drift (the paper's conservative assumption), each log-return has mean <code>−½σ²·dt</code>. The <em>mean</em> price stays at $100k, but the <em>median</em> drifts down by ~½σ² per year — roughly −8% at σ=40%, −12% at σ=50%. This is "volatility drag." Toggle drift above to see how it changes the picture.
      </div>

      <div class="chart-wrap">
        <div class="chart-head">
          <h2>10,000 simulated Bitcoin price paths</h2>
          <div class="sub" id="chartSub">—</div>
        </div>
        <canvas id="liq-chart" width="1600" height="780"></canvas>
        <div class="live-counter" id="liveCounter">
          <div class="lc-row"><span>Day</span><span class="mid" id="lc_day">0 / 365</span></div>
          <div class="lc-row"><span>Margin calls so far</span><span class="mid" id="lc_mc">0</span></div>
          <div class="lc-row"><span>Liquidations (MC loan)</span><span class="big" id="lc_liq">0</span></div>
        </div>
        <div class="legend">
          <span class="k"><span class="swatch" style="background: rgba(255,255,255,0.5)"></span>Sim paths</span>
          <span class="k"><span class="swatch" style="background: #f7931a"></span>Median</span>
          <span class="k"><span class="swatch" style="background: #ffb020; height:2px;"></span>Margin-call trigger (75% LTV)</span>
          <span class="k"><span class="swatch" style="background: #ff4d4d; height:2px;"></span>Liquidation — MC loan (85% LTV)</span>
          <span class="k"><span class="swatch" style="background: #7a5cff; height:2px;"></span>Liquidation — no-MC loan (at maturity)</span>
        </div>
      </div>

      <div class="stats">
        <div class="stat hero danger">
          <div class="lbl">Liquidation probability <span class="badge bad">Margin-call loan</span></div>
          <div class="num" id="s_liq_mc">—</div>
          <div class="desc">Likelihood Bitcoin touches the 85% LTV liquidation level at any point during the year, assuming the borrower does not meet the call.</div>
        </div>
        <div class="stat hero success">
          <div class="lbl">Liquidation probability <span class="badge good">No-margin-call loan</span></div>
          <div class="num" id="s_liq_nmc">—</div>
          <div class="desc">Likelihood Bitcoin ends below the collateral floor at maturity — path-independent, no intraday triggers.</div>
        </div>
      </div>

      <div class="stats sub">
        <div class="stat accent">
          <div class="lbl">Margin-call probability</div>
          <div class="num" id="s_mc">—</div>
          <div class="desc">Chance BTC touches the 75% LTV call trigger at any point during the term.</div>
        </div>
        <div class="stat warn">
          <div class="lbl">Conditional liquidation given call</div>
          <div class="num" id="s_cond">—</div>
          <div class="desc">Of borrowers who receive a call, share that go on to full liquidation.</div>
        </div>
      </div>

      <div class="compare-section">
        <h2>Side-by-side comparison</h2>
        <p>Both structures use an identical 50% initial LTV. The margin-call loan liquidates the first time BTC touches the 85% LTV level intraday; the no-margin-call loan only liquidates at maturity if BTC closes below the collateral floor.</p>
        <table class="compare">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Margin-call loan</th>
              <th>No-margin-call loan</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Trigger / liquidation price</td><td id="c_mc_price">—</td><td id="c_nmc_price">—</td></tr>
            <tr><td>Probability of liquidation</td><td id="c_mc_liq" class="bad">—</td><td id="c_nmc_liq" class="good">—</td></tr>
            <tr><td>Min BTC decline to liquidate</td><td id="c_mc_drop">—</td><td id="c_nmc_drop">—</td></tr>
            <tr><td>Path-dependent?</td><td class="bad">Yes — triggered intraday</td><td class="good">No — evaluated only at maturity</td></tr>
            <tr><td>Cash reserve required</td><td class="bad">Yes — ~⅔ of proceeds at risk</td><td class="good">None</td></tr>
          </tbody>
        </table>
      </div>

      <div class="foot-cta">
        <div>
          <h3>Want a Bitcoin loan with no margin calls?</h3>
          <p>Cadena Bitcoin offers fixed-term, no-margin-call financing against your Bitcoin. Keep your upside. Skip the 3am liquidation emails.</p>
        </div>
        <router-link class="btn" to="/register">Get Started — No Margin Calls</router-link>
      </div>

      <p class="disclaimer">
        Monte Carlo simulation uses geometric Brownian motion with zero drift, daily steps, 10,000 paths, seed 42, and an annualized volatility you select. Bitcoin price is fetched live; if unavailable, a fallback value is used. Results are illustrative and depend on the volatility assumption chosen; past or implied volatility is not a guarantee of future price behavior. This calculator is for informational and educational purposes only and does not constitute financial, investment, or legal advice.
      </p>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { getPrice } from '../api/price'
import TheFooter from '../components/TheFooter.vue'

let resizeHandler = null

onUnmounted(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})

onMounted(() => {
  // ------------ Seeded PRNG (mulberry32) ------------
  function mulberry32(seed) {
    let t = seed >>> 0
    return function() {
      t = (t + 0x6D2B79F5) >>> 0
      let r = t
      r = Math.imul(r ^ (r >>> 15), r | 1)
      r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296
    }
  }

  function makeRandn(rand) {
    let spare = null
    return function() {
      if (spare !== null) { const v = spare; spare = null; return v }
      let u, v, s
      do { u = rand()*2 - 1; v = rand()*2 - 1; s = u*u + v*v } while (s >= 1 || s === 0)
      const m = Math.sqrt(-2.0 * Math.log(s) / s)
      spare = v * m
      return u * m
    }
  }

  // ------------ Simulation ------------
  function simulate({ S0, vol, drift, T_days, n_paths, seed, mcPrice, liqPrice }) {
    const rand = mulberry32(seed)
    const randn = makeRandn(rand)
    const dt = 1/365
    const sqdt = Math.sqrt(dt)
    const muTerm = (drift - 0.5*vol*vol) * dt
    const volTerm = vol * sqdt
    const steps = T_days + 1
    const paths = new Float32Array(n_paths * steps)
    const mins = new Float32Array(n_paths)
    const ends = new Float32Array(n_paths)
    const mcHitDay  = new Int16Array(n_paths)
    const liqHitDay = new Int16Array(n_paths)
    for (let i = 0; i < n_paths; i++) { mcHitDay[i] = -1; liqHitDay[i] = -1 }

    for (let i = 0; i < n_paths; i++) {
      let S = S0, mn = S0
      paths[i*steps] = S0
      for (let t = 1; t < steps; t++) {
        S = S * Math.exp(muTerm + volTerm * randn())
        paths[i*steps + t] = S
        if (S < mn) mn = S
        if (mcHitDay[i]  === -1 && S <= mcPrice)  mcHitDay[i]  = t
        if (liqHitDay[i] === -1 && S <= liqPrice)  liqHitDay[i] = t
      }
      mins[i] = mn
      ends[i] = S
    }
    return { paths, mins, ends, mcHitDay, liqHitDay, steps }
  }

  function percentilesPerStep(paths, n_paths, steps, qs) {
    const out = qs.map(() => new Float32Array(steps))
    const col = new Float32Array(n_paths)
    for (let t = 0; t < steps; t++) {
      for (let i = 0; i < n_paths; i++) col[i] = paths[i*steps + t]
      const sorted = Array.from(col).sort((a,b) => a - b)
      qs.forEach((q, qi) => {
        const idx = Math.min(n_paths - 1, Math.max(0, Math.floor(q * (n_paths - 1))))
        out[qi][t] = sorted[idx]
      })
    }
    return out
  }

  // ------------ Formatting ------------
  const fmt$ = (n) => {
    if (!isFinite(n)) return '—'
    if (Math.abs(n) >= 1000) return '$' + Math.round(n).toLocaleString()
    return '$' + n.toFixed(0)
  }
  const fmtPct = (x, digits = 1) => (x * 100).toFixed(digits) + '%'
  function shortNum(n) {
    if (n >= 1e6) return (n/1e6).toFixed(1) + 'M'
    if (n >= 1e3) return (n/1e3).toFixed(n >= 1e4 ? 0 : 1) + 'k'
    return n.toFixed(0)
  }
  function logTicks(lo, hi, count) {
    const lgLo = Math.log10(lo), lgHi = Math.log10(hi)
    const out = []
    for (let i = 0; i <= count; i++) {
      const v = Math.pow(10, lgLo + (i/count)*(lgHi - lgLo))
      const mag = Math.pow(10, Math.floor(Math.log10(v)))
      const rounded = Math.round(v / mag) * mag
      if (!out.includes(rounded)) out.push(rounded)
    }
    return out
  }

  // ------------ Price fetch ------------
  async function fetchBtcPrice() {
    try {
      const p = await getPrice()
      if (isFinite(p) && p > 1000) return p
    } catch {}
    try {
      const r = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot', { cache: 'no-store' })
      if (r.ok) {
        const j = await r.json()
        const p = Number(j?.data?.amount)
        if (isFinite(p) && p > 1000) return p
      }
    } catch {}
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', { cache: 'no-store' })
      if (r.ok) {
        const j = await r.json()
        const p = Number(j?.bitcoin?.usd)
        if (isFinite(p) && p > 1000) return p
      }
    } catch {}
    return null
  }

  // ------------ DOM refs ------------
  const $ = id => document.getElementById(id)
  const els = {
    runBtn:      $('runBtn'),
    volPresets:  $('volPresets'),
    driftPresets:$('driftPresets'),
    loan:        $('liq-loan'),
    canvas:      $('liq-chart'),
    chartSub:    $('chartSub'),
    qb_price:    $('qb_price'),
    liveCounter: $('liveCounter'),
    lc_day:      $('lc_day'),
    lc_mc:       $('lc_mc'),
    lc_liq:      $('lc_liq'),
    s_liq_mc:    $('s_liq_mc'),
    s_liq_nmc:   $('s_liq_nmc'),
    s_mc:        $('s_mc'),
    s_cond:      $('s_cond'),
    c_mc_price:  $('c_mc_price'),
    c_nmc_price: $('c_nmc_price'),
    c_mc_liq:    $('c_mc_liq'),
    c_nmc_liq:   $('c_nmc_liq'),
    c_mc_drop:   $('c_mc_drop'),
    c_nmc_drop:  $('c_nmc_drop'),
  }

  const FIXED = { iLTV: 0.50, T_days: 365, mcLTV: 0.75, liqLTV: 0.85, nPaths: 10000, seed: 42 }
  let state = { btcPrice: 100000, vol: 0.40, loan: 50000, driftMode: '0', animating: false }

  function resolveDrift() {
    if (state.driftMode === 'flat') return 0.5 * state.vol * state.vol
    if (state.driftMode === '40') return 0.40
    return 0
  }

  function derivedLevels() {
    const btc = state.loan / (FIXED.iLTV * state.btcPrice)
    const mcPrice  = state.loan / (FIXED.mcLTV  * btc)
    const liqPrice = state.loan / (FIXED.liqLTV * btc)
    const nmcPrice = state.loan / btc
    return { btc, mcPrice, liqPrice, nmcPrice }
  }

  // ------------ Canvas ------------
  function setupCanvas() {
    const c = els.canvas
    const rect = c.getBoundingClientRect()
    const w = Math.max(600, Math.floor(rect.width))
    const h = Math.round(w * 0.50)
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = w * dpr
    c.height = h * dpr
    c.style.height = h + 'px'
    const ctx = c.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return { ctx, w, h }
  }

  let chart = null

  function buildChart(result, params) {
    const { ctx, w, h } = setupCanvas()
    const { paths, steps } = result
    const n = result.mins.length
    let lo = Infinity, hi = -Infinity
    const sampleN = Math.min(2000, n)
    const stepI = Math.max(1, Math.floor(n/sampleN))
    for (let i = 0; i < n; i += stepI) {
      const offset = i * steps
      for (let t = 0; t < steps; t += 8) {
        const v = paths[offset + t]
        if (v < lo) lo = v
        if (v > hi) hi = v
      }
    }
    lo = Math.max(lo, params.S0 * 0.05)
    hi = Math.min(hi, params.S0 * 6)
    lo = Math.min(lo, params.nmcPrice * 0.85)
    hi = Math.max(hi, params.S0 * 1.2)

    const padL = 64, padR = 16, padT = 14, padB = 30
    const plotW = w - padL - padR
    const plotH = h - padT - padB
    const xOf = (t) => padL + (t / (steps - 1)) * plotW
    const yOf = (p) => padT + plotH - ((Math.log(p) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * plotH

    chart = { ctx, w, h, padL, padR, padT, padB, plotW, plotH, lo, hi, xOf, yOf, steps, n, paths, params }
    drawBackground()
  }

  function drawBackground() {
    const { ctx, w, h, padL, padR, padT, padB, plotW, plotH, lo, hi, xOf, yOf, steps, params } = chart
    ctx.fillStyle = '#0b0e13'
    ctx.fillRect(0, 0, w, h)
    const liqY = yOf(params.liqPrice)
    ctx.fillStyle = 'rgba(255,77,77,0.08)'
    ctx.fillRect(padL, liqY, plotW, (h - padB) - liqY)
    const mcY = yOf(params.mcPrice)
    ctx.fillStyle = 'rgba(255,176,32,0.06)'
    ctx.fillRect(padL, mcY, plotW, liqY - mcY)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.font = '11px -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.fillStyle = '#6b7587'
    logTicks(lo, hi, 6).forEach(v => {
      const y = yOf(v)
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke()
      ctx.fillText('$' + shortNum(v), 6, y + 3)
    })
    const months = Math.max(1, Math.round(params.T_days / 30))
    for (let m = 0; m <= months; m++) {
      const t = Math.round((m/months) * (steps - 1))
      const x = xOf(t)
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, h - padB); ctx.stroke()
      ctx.fillText(m + 'mo', x - 10, h - padB + 16)
    }
  }

  function drawOverlays() {
    const { ctx, w, padL, padR, xOf, yOf, steps, n, paths, params } = chart
    const pct = percentilesPerStep(paths, n, steps, [0.05, 0.5, 0.95])
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(247,147,26,0.95)'
    ctx.beginPath()
    for (let t = 0; t < steps; t++) {
      const x = xOf(t), y = yOf(pct[1][t])
      if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(247,147,26,0.35)'
    for (const qi of [0, 2]) {
      ctx.beginPath()
      for (let t = 0; t < steps; t++) {
        const x = xOf(t), y = yOf(pct[qi][t])
        if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
    drawHLine(padL, w - padR, yOf(params.mcPrice),  'rgba(255,176,32,0.95)', [6,4], 'MC trigger: ' + fmt$(params.mcPrice))
    drawHLine(padL, w - padR, yOf(params.liqPrice), 'rgba(255,77,77,0.95)',  [6,4], 'Liq (MC loan): ' + fmt$(params.liqPrice))
    drawHLine(padL, w - padR, yOf(params.nmcPrice), 'rgba(122,92,255,0.95)', [2,4], 'Liq (no-MC): ' + fmt$(params.nmcPrice))
    drawHLine(padL, w - padR, yOf(params.S0),       'rgba(255,255,255,0.35)', [1,3], 'Start: ' + fmt$(params.S0))
  }

  function drawHLine(x0, x1, y, color, dash, label) {
    const ctx = chart.ctx
    ctx.save()
    ctx.setLineDash(dash); ctx.strokeStyle = color; ctx.lineWidth = 1.4
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke()
    ctx.setLineDash([])
    if (label) {
      ctx.fillStyle = color
      ctx.font = '11px -apple-system, Segoe UI, Roboto, sans-serif'
      const tw = ctx.measureText(label).width
      ctx.fillText(label, x1 - tw - 6, y - 4)
    }
    ctx.restore()
  }

  // ------------ Animation ------------
  function animate(result) {
    return new Promise(resolve => {
      const { ctx, xOf, yOf, steps, n, paths } = chart
      const { mcHitDay, liqHitDay } = result
      const totalFrames = 55
      const stepsPerFrame = Math.max(1, Math.ceil((steps - 1) / totalFrames))
      let t0 = 0, mcCum = 0, liqCum = 0
      els.liveCounter.classList.add('on')
      const heroIdxs = []
      const sortedByEnd = Array.from({length: n}, (_, i) => i).sort((a,b) => result.ends[a] - result.ends[b])
      for (let q = 0.05; q <= 0.95; q += 0.09) heroIdxs.push(sortedByEnd[Math.floor(q * (n-1))])

      function drawFrame() {
        const t1 = Math.min(steps - 1, t0 + stepsPerFrame)
        ctx.strokeStyle = 'rgba(235,240,255,0.07)'; ctx.lineWidth = 1
        ctx.beginPath()
        for (let i = 0; i < n; i++) {
          const offset = i * steps
          ctx.moveTo(xOf(t0), yOf(paths[offset + t0]))
          for (let t = t0 + 1; t <= t1; t++) ctx.lineTo(xOf(t), yOf(paths[offset + t]))
        }
        ctx.stroke()
        ctx.strokeStyle = 'rgba(255,220,180,0.55)'; ctx.lineWidth = 1.1
        ctx.beginPath()
        for (const i of heroIdxs) {
          const offset = i * steps
          ctx.moveTo(xOf(t0), yOf(paths[offset + t0]))
          for (let t = t0 + 1; t <= t1; t++) ctx.lineTo(xOf(t), yOf(paths[offset + t]))
        }
        ctx.stroke()
        for (let i = 0; i < n; i++) {
          if (mcHitDay[i]  > t0 && mcHitDay[i]  <= t1) mcCum++
          if (liqHitDay[i] > t0 && liqHitDay[i] <= t1) liqCum++
        }
        els.lc_day.textContent = t1 + ' / ' + (steps - 1)
        els.lc_mc.textContent  = mcCum.toLocaleString()
        els.lc_liq.textContent = liqCum.toLocaleString()
        t0 = t1
        if (t0 < steps - 1) requestAnimationFrame(drawFrame)
        else { drawOverlays(); resolve() }
      }
      requestAnimationFrame(drawFrame)
    })
  }

  // ------------ Run ------------
  async function run() {
    if (state.animating) return
    state.animating = true
    els.runBtn.disabled = true
    await new Promise(r => requestAnimationFrame(() => r()))

    const { btc, mcPrice, liqPrice, nmcPrice } = derivedLevels()
    const result = simulate({
      S0: state.btcPrice, vol: state.vol, drift: resolveDrift(),
      T_days: FIXED.T_days, n_paths: FIXED.nPaths, seed: FIXED.seed,
      mcPrice, liqPrice,
    })

    let mcHit = 0, liqHit = 0, nmcLiq = 0
    for (let i = 0; i < result.mins.length; i++) {
      if (result.mcHitDay[i]  !== -1) mcHit++
      if (result.liqHitDay[i] !== -1) liqHit++
      if (result.ends[i] < nmcPrice) nmcLiq++
    }
    const nn = result.mins.length
    const pMC  = mcHit  / nn
    const pLiq = liqHit / nn
    const pNMC = nmcLiq / nn
    const pCond = mcHit > 0 ? liqHit / mcHit : 0

    buildChart(result, { S0: state.btcPrice, T_days: FIXED.T_days, mcPrice, liqPrice, nmcPrice })
    const driftLabel = state.driftMode === 'flat' ? `µ=½σ² (${(resolveDrift()*100).toFixed(1)}%)` : state.driftMode === '40' ? 'µ=+40%' : 'µ=0'
    els.chartSub.textContent = `GBM · σ=${Math.round(state.vol*100)}% · ${driftLabel} · 1y · 10,000 paths · seed 42 · collateral ${btc.toFixed(4).replace(/0+$/,'').replace(/\.$/,'')} BTC`
    els.lc_day.textContent = '0 / 365'; els.lc_mc.textContent = '0'; els.lc_liq.textContent = '0'

    await animate(result)

    els.s_liq_mc.textContent  = fmtPct(pLiq)
    els.s_liq_nmc.textContent = fmtPct(pNMC)
    els.s_mc.textContent      = fmtPct(pMC)
    els.s_cond.textContent    = fmtPct(pCond)
    els.c_mc_price.innerHTML  = 'Call: ' + fmt$(mcPrice) + '<br/>Liq: ' + fmt$(liqPrice)
    els.c_nmc_price.innerHTML = 'Liq: ' + fmt$(nmcPrice)
    els.c_mc_liq.textContent  = fmtPct(pLiq)
    els.c_nmc_liq.textContent = fmtPct(pNMC)
    els.c_mc_drop.textContent  = ((1 - liqPrice / state.btcPrice)*100).toFixed(1) + '% from origination'
    els.c_nmc_drop.textContent = ((1 - nmcPrice / state.btcPrice)*100).toFixed(1) + '% at maturity'

    state.animating = false
    els.runBtn.disabled = false
  }

  // ------------ Events ------------
  els.volPresets.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill')
    if (!pill) return
    document.querySelectorAll('#volPresets .pill').forEach(p => p.classList.remove('active'))
    pill.classList.add('active')
    state.vol = Number(pill.dataset.vol) / 100
    run()
  })
  els.driftPresets.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill')
    if (!pill) return
    document.querySelectorAll('#driftPresets .pill').forEach(p => p.classList.remove('active'))
    pill.classList.add('active')
    state.driftMode = String(pill.dataset.drift)
    run()
  })
  els.loan.addEventListener('change', () => {
    const v = Math.max(1000, Number(els.loan.value) || 50000)
    els.loan.value = v
    state.loan = v
    run()
  })
  els.runBtn.addEventListener('click', run)

  let resizeT
  resizeHandler = () => { clearTimeout(resizeT); resizeT = setTimeout(run, 200) }
  window.addEventListener('resize', resizeHandler)

  // ------------ Init ------------
  els.qb_price.textContent = 'loading…'
  fetchBtcPrice().then(p => {
    state.btcPrice = p ? Math.round(p) : 100000
    els.qb_price.textContent = fmt$(state.btcPrice)
    run()
  })
})
</script>

<style>
.liq-page {
  --liq-bg:     #0b0e13;
  --liq-bg-2:   #121722;
  --liq-bg-3:   #1a2131;
  --liq-fg:     #e8ecf3;
  --liq-dim:    #9aa4b8;
  --liq-muted:  #6b7587;
  --liq-accent: #7c3aed;
  --liq-acc2:   #a78bfa;
  --liq-danger: #ff4d4d;
  --liq-warn:   #ffb020;
  --liq-ok:     #3ecf8e;
  --liq-border: #242c3d;
  --liq-shadow: 0 10px 40px rgba(0,0,0,0.35);

  background: var(--liq-bg);
  color: var(--liq-fg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

.liq-page a { color: var(--liq-acc2); text-decoration: none; }
.liq-page a:hover { text-decoration: underline; }

.liq-page .liq-hero {
  text-align: center;
  padding: 56px 24px 32px;
  max-width: 860px;
  margin: 0 auto;
}

.liq-page .liq-eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--liq-accent);
  background: rgba(103, 56, 227, 0.1);
  border: 1px solid rgba(103, 56, 227, 0.25);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.liq-page h1 {
  font-size: clamp(26px, 3vw, 38px);
  line-height: 1.15;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
  color: #ffffff;
}

.liq-page h1 .hl { color: var(--liq-accent); }
.liq-page .lede { color: var(--liq-dim); font-size: 16px; max-width: 820px; margin: 0 auto; line-height: 1.55; }

.liq-page .wrap { max-width: 1280px; margin: 0 auto; padding: 8px 24px 80px; }

.liq-page .quick-bar { display: flex; flex-wrap: wrap; align-items: stretch; gap: 12px; background: var(--liq-bg-2); border: 1px solid var(--liq-border); border-radius: 14px; padding: 14px; box-shadow: var(--liq-shadow); margin-bottom: 20px; }
.liq-page .qb-item { display: flex; flex-direction: column; gap: 4px; padding: 6px 14px; border-right: 1px solid var(--liq-border); min-width: 150px; }
.liq-page .qb-item:last-of-type { border-right: none; }
.liq-page .qb-item .lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--liq-muted); }
.liq-page .qb-item .val { font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; }
.liq-page .qb-item .val.live::after { content: '●'; color: var(--liq-ok); font-size: 10px; margin-left: 6px; vertical-align: middle; animation: liq-pulse 1.8s ease-in-out infinite; }
@keyframes liq-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
.liq-page .qb-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; flex: 1; justify-content: flex-end; padding: 4px 10px; }
.liq-page .qb-field { display: flex; flex-direction: column; gap: 2px; }
.liq-page .qb-field label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--liq-muted); }
.liq-page .qb-field input[type="number"] { width: 140px; background: var(--liq-bg-3); border: 1px solid var(--liq-border); color: var(--liq-fg); padding: 7px 9px; border-radius: 7px; font-size: 14px; font-variant-numeric: tabular-nums; font-family: inherit; }
.liq-page .qb-field input:focus { outline: none; border-color: var(--liq-accent); }
.liq-page .pill-row { display: flex; gap: 6px; flex-wrap: wrap; }
.liq-page .pill-group { display: flex; flex-direction: column; gap: 4px; }
.liq-page .pill-group .glabel { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--liq-muted); }
.liq-page .pill { background: var(--liq-bg-3); border: 1px solid var(--liq-border); color: var(--liq-dim); padding: 7px 12px; border-radius: 999px; font-size: 13px; cursor: pointer; user-select: none; transition: background 0.1s; font-weight: 500; }
.liq-page .pill:hover { border-color: var(--liq-muted); color: var(--liq-fg); }
.liq-page .pill.active { background: var(--liq-accent); color: white; border-color: var(--liq-accent); font-weight: 700; }
.liq-page .btn { background: var(--liq-accent); color: white; border: none; padding: 10px 18px; border-radius: 9px; font-weight: 700; font-size: 14px; cursor: pointer; transition: transform 0.05s ease, background 0.15s ease; font-family: inherit; text-decoration: none; display: inline-block; }
.liq-page .btn:hover { background: #6d28d9; text-decoration: none; }
.liq-page .btn:active { transform: scale(0.98); }
.liq-page .btn:disabled { opacity: 0.5; cursor: not-allowed; }

.liq-page .chart-wrap { position: relative; background: var(--liq-bg-2); border: 1px solid var(--liq-border); border-radius: 14px; padding: 16px; box-shadow: var(--liq-shadow); }
.liq-page .chart-head { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.liq-page .chart-head h2 { margin: 0; font-size: 16px; font-weight: 600; }
.liq-page .chart-head .sub { font-size: 12px; color: var(--liq-muted); font-variant-numeric: tabular-nums; }
.liq-page canvas { display: block; width: 100%; height: auto; background: var(--liq-bg); border-radius: 10px; }
.liq-page .live-counter { position: absolute; left: 28px; top: 48px; background: rgba(11,14,19,0.78); backdrop-filter: blur(6px); border: 1px solid var(--liq-border); border-radius: 10px; padding: 10px 14px; font-size: 12px; color: var(--liq-dim); min-width: 200px; pointer-events: none; opacity: 0; transition: opacity 0.2s; }
.liq-page .live-counter.on { opacity: 1; }
.liq-page .live-counter .lc-row { display: flex; justify-content: space-between; align-items: baseline; font-variant-numeric: tabular-nums; gap: 14px; }
.liq-page .live-counter .lc-row + .lc-row { margin-top: 4px; }
.liq-page .live-counter .big { font-size: 18px; font-weight: 700; color: var(--liq-danger); }
.liq-page .live-counter .mid { font-size: 13px; color: var(--liq-fg); font-weight: 600; }
.liq-page .legend { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 10px; font-size: 12px; color: var(--liq-dim); }
.liq-page .legend .k { display: inline-flex; align-items: center; gap: 6px; }
.liq-page .legend .swatch { width: 14px; height: 3px; border-radius: 2px; }

.liq-page .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 20px; }
.liq-page .stats.sub { grid-template-columns: 1fr 1fr; margin-top: 12px; }
@media (max-width: 720px) { .liq-page .stats, .liq-page .stats.sub { grid-template-columns: 1fr; } }
.liq-page .stat { background: var(--liq-bg-2); border: 1px solid var(--liq-border); border-radius: 12px; padding: 16px; }
.liq-page .stat.hero { padding: 22px; }
.liq-page .stat .lbl { color: var(--liq-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.liq-page .stat.hero .lbl { font-size: 12px; }
.liq-page .stat .badge { padding: 2px 7px; border-radius: 999px; font-size: 10px; font-weight: 700; }
.liq-page .stat .badge.bad { background: rgba(255,77,77,0.15); color: var(--liq-danger); }
.liq-page .stat .badge.good { background: rgba(62,207,142,0.15); color: var(--liq-ok); }
.liq-page .stat .num { font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.liq-page .stat.hero .num { font-size: 42px; }
.liq-page .stat .desc { color: var(--liq-muted); font-size: 12px; margin-top: 6px; line-height: 1.4; }
.liq-page .stat.danger .num { color: var(--liq-danger); }
.liq-page .stat.warn .num { color: var(--liq-warn); }
.liq-page .stat.success .num { color: var(--liq-ok); }
.liq-page .stat.accent .num { color: var(--liq-accent); }

.liq-page .compare-section { margin-top: 28px; }
.liq-page .compare-section h2 { font-size: 20px; margin: 0 0 6px; }
.liq-page .compare-section p { color: var(--liq-dim); margin: 0 0 14px; font-size: 14px; }
.liq-page table.compare { width: 100%; border-collapse: collapse; background: var(--liq-bg-2); border: 1px solid var(--liq-border); border-radius: 12px; overflow: hidden; }
.liq-page table.compare th, .liq-page table.compare td { text-align: left; padding: 12px 14px; font-size: 14px; border-bottom: 1px solid var(--liq-border); font-variant-numeric: tabular-nums; }
.liq-page table.compare th { background: var(--liq-bg-3); font-weight: 600; color: var(--liq-dim); text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em; }
.liq-page table.compare td.good { color: var(--liq-ok); font-weight: 600; }
.liq-page table.compare td.bad { color: var(--liq-danger); font-weight: 600; }
.liq-page table.compare tr:last-child td { border-bottom: none; }

.liq-page .foot-cta { margin-top: 32px; background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.03)); border: 1px solid rgba(124,58,237,0.3); border-radius: 14px; padding: 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.liq-page .foot-cta h3 { margin: 0 0 4px; font-size: 18px; }
.liq-page .foot-cta p { margin: 0; color: var(--liq-dim); font-size: 14px; max-width: 640px; }
.liq-page .foot-cta .btn { padding: 14px 22px; }

.liq-page .disclaimer { margin-top: 24px; color: var(--liq-muted); font-size: 11px; line-height: 1.6; }
.liq-page .note { margin: -8px 0 20px; background: rgba(124,58,237,0.06); border: 1px solid rgba(124,58,237,0.22); border-radius: 10px; padding: 12px 14px; color: var(--liq-dim); font-size: 13px; line-height: 1.55; }
.liq-page .note strong { color: var(--liq-fg); }
.liq-page .note code { background: var(--liq-bg-3); padding: 1px 6px; border-radius: 4px; font-size: 12px; color: var(--liq-acc2); }
</style>
