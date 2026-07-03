<template>
  <div class="alloc-page">
    <div class="alloc-hero">
      <div class="alloc-eyebrow">A tool from Endgame</div>
      <h1>How Much Bitcoin <span class="alloc-gradient">Should I Own?</span></h1>
      <p class="alloc-lede">The honest answer is almost certainly more than the 1–5% the industry recommends. Here is the math it skips, and what Bitcoin is actually replacing.</p>
    </div>

    <div class="alloc-wrap">

      <!-- ── Section 1: Kelly ── -->
      <div class="alloc-section-num">
        <span class="alloc-num">1</span>
        <h2>Kelly Criterion</h2>
      </div>

      <div class="alloc-card" style="margin-top:16px">
        <!-- Conviction -->
        <div class="alloc-slider-group">
          <div class="alloc-row-label">
            <span>Your conviction</span>
            <strong>{{ conv }}%</strong>
          </div>
          <div class="alloc-hint">The probability Bitcoin delivers the payoff below. At 60%, you think there is a 6-in-10 chance it works.</div>
          <input type="range" v-model.number="conv" min="50" max="75" step="1" class="alloc-range"
            :style="{ '--fill': ((conv - 50) / (75 - 50) * 100) + '%' }" />
        </div>

        <!-- Payoff -->
        <div class="alloc-slider-group">
          <div class="alloc-row-label">
            <span>The payoff if you're right</span>
            <strong>{{ pay }}&times;</strong>
          </div>
          <div class="alloc-hint">If it works, how many times your alternative does Bitcoin return. 3&times; means it triples what bonds would have.</div>
          <input type="range" v-model.number="pay" min="1.5" max="5" step="0.5" class="alloc-range"
            :style="{ '--fill': ((pay - 1.5) / (5 - 1.5) * 100) + '%' }" />
        </div>

        <!-- Kelly fraction -->
        <div class="alloc-row-label" style="margin-bottom:8px">Risk setting &nbsp;&#127922;</div>
        <div class="alloc-segs">
          <button
            v-for="f in KELLY_FRACS"
            :key="f.v"
            :class="['alloc-seg-btn', { active: frac === f.v }]"
            @click="frac = f.v"
          >{{ f.label }}</button>
        </div>
        <div class="alloc-hint">Half Kelly is the standard safety margin. Full Kelly maximizes growth but stings; quarter is conservative.</div>

        <!-- Net worth + BTC price -->
        <div class="alloc-two-col">
          <div>
            <label class="alloc-input-label">Your net worth ($)</label>
            <input type="number" v-model.number="nw" min="0" step="10000" class="alloc-num-input" />
          </div>
          <div>
            <label class="alloc-input-label">Bitcoin price ($, edit to today)</label>
            <input type="number" v-model.number="btcp" min="1" step="1000" class="alloc-num-input" />
          </div>
        </div>

        <!-- Output display -->
        <div class="alloc-out">
          <div class="alloc-out-big">{{ pInt(kellyAlloc) }}</div>
          <div class="alloc-out-cap">
            of net worth &nbsp;&middot;&nbsp;
            <strong>{{ fmtUSD(kellyUSD) }}</strong>
            &nbsp;&middot;&nbsp;
            <strong class="alloc-btc-color">{{ kellyBTC.toFixed(2) }} BTC</strong>
          </div>
          <div class="alloc-out-trio">
            Full <strong>{{ pInt(kellyFull) }}</strong>
            &nbsp;&middot;&nbsp; Half <strong>{{ pInt(kellyFull * 0.5) }}</strong>
            &nbsp;&middot;&nbsp; Quarter <strong>{{ pInt(kellyFull * 0.25) }}</strong>
          </div>
        </div>

        <!-- Bar comparison -->
        <div class="alloc-bars">
          <div class="alloc-bar-row">
            <div class="alloc-bar-label"><span>Industry norm</span><span class="alloc-bar-val">1–5%</span></div>
            <div class="alloc-bar-track"><div class="alloc-bar-fill norm" style="width:8%"></div></div>
          </div>
          <div class="alloc-bar-row">
            <div class="alloc-bar-label"><span>Your number</span><span class="alloc-bar-val">{{ pInt(kellyAlloc) }}</span></div>
            <div class="alloc-bar-track">
              <div class="alloc-bar-fill you" :style="{ width: Math.min(100, (kellyAlloc / 0.5) * 100) + '%' }"></div>
            </div>
          </div>
          <div class="alloc-underbet">The conventional sliver is a Kelly underbet for anyone who actually believes the thesis.</div>
        </div>
      </div>

      <!-- Caveats 1 -->
      <h2 class="alloc-h2">Before you act on that number</h2>
      <ul class="alloc-caveats">
        <li>Kelly punishes wrong inputs. Overstate your edge and it sizes you into ruin. Be honest about the probability.</li>
        <li>Discount the historical growth rate. A multi-trillion-dollar asset cannot repeat its small-base returns, so haircut the payoff.</li>
        <li>For most people, 5–25% is the realistic landing. The point is not "all in." It is that 1–5% is too small for real conviction.</li>
      </ul>

      <!-- ── Section 2: MPT ── -->
      <div class="alloc-section-num">
        <span class="alloc-num">2</span>
        <h2>Modern Portfolio Theory</h2>
      </div>

      <p class="alloc-body-p">Pick a time horizon and the risk level you are comfortable with, anchored to the classic stock and bond blends. The optimizer finds the mix of stocks, the safe asset, and Bitcoin that earns the most at that risk. Then flip the safe asset from today's bonds to a 9% Bitcoin-backed credit sleeve, the rate that exists in the free market, and watch the whole portfolio change.</p>

      <!-- Time horizon -->
      <div class="alloc-seg-label">Time horizon</div>
      <div class="alloc-segs">
        <button
          v-for="w in WINDOWS"
          :key="w"
          :class="['alloc-seg-btn', { active: currentWin === w }]"
          @click="currentWin = w"
        >{{ w }} year</button>
      </div>

      <!-- Risk level -->
      <div class="alloc-seg-label">Your risk level</div>
      <div class="alloc-segs">
        <button
          v-for="(lbl, i) in MIX_LABELS"
          :key="i"
          :class="['alloc-seg-btn', { active: currentMix === i }]"
          @click="currentMix = i"
        >{{ lbl }}</button>
      </div>

      <!-- Safe asset -->
      <div class="alloc-seg-label">The safe asset</div>
      <div class="alloc-segs">
        <button :class="['alloc-seg-btn', { active: currentMode === 'bonds' }]" @click="currentMode = 'bonds'">Bonds today</button>
        <button :class="['alloc-seg-btn', { active: currentMode === 'credit' }]" @click="currentMode = 'credit'">Include Bitcoin-backed credit (9%)</button>
      </div>
      <div class="alloc-hint">Bonds today pay a suppressed rate at real duration risk. The credit sleeve pays a market 9% at low risk, the difference between a rate set by a central bank and one set by a market.</div>

      <!-- MPT Results card -->
      <div class="alloc-card" style="margin-top:16px;padding:22px">
        <div class="alloc-callout" v-html="calloutHTML"></div>
        <div class="alloc-table-label">Your selected portfolio, before and after</div>
        <div style="overflow-x:auto">
          <table class="alloc-table">
            <thead>
              <tr>
                <th>Portfolio</th><th>Stocks</th><th>Bonds</th><th>Credit</th><th>Bitcoin</th><th>Return</th><th>Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Before: classic {{ MIX_LABELS[currentMix] }}</td>
                <td>{{ pInt(currentMixArr[0]) }}</td>
                <td>{{ pInt(currentMixArr[1]) }}</td>
                <td>0%</td>
                <td>0%</td>
                <td>{{ p1(classicRet) }}</td>
                <td>{{ p1(classicVol) }}</td>
              </tr>
              <tr class="alloc-hl-row">
                <td>After: optimized</td>
                <td>{{ pInt(optimized.we) }}</td>
                <td>{{ pInt(currentMode === 'bonds' ? optimized.wbd : 0) }}</td>
                <td>{{ pInt(currentMode === 'credit' ? optimized.wbd : 0) }}</td>
                <td>{{ pInt(optimized.wbtc) }}</td>
                <td>{{ p1(optimized.r) }}</td>
                <td>{{ p1(optimized.v) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="alloc-assump">Assumptions ({{ currentWin }}-year total return, real data through July 2026 via FMP and CryptoCompare; the 9% credit sleeve is a Cadena target at low, defined risk): stocks {{ p1(rawData.eq.r) }} return / {{ p1(rawData.eq.v) }} std dev; bonds {{ p1(rawData.bd.r) }} / {{ p1(rawData.bd.v) }}; Bitcoin-backed credit {{ p1(CREDIT.r) }} / {{ p1(CREDIT.v) }}; Bitcoin {{ p1(rawData.btc.r) }} / {{ p1(rawData.btc.v) }}. Correlations: stock-bond {{ rawData.eb }}, stock-Bitcoin {{ rawData.ebtc }}, bond-Bitcoin {{ rawData.bbtc }}.</p>
      </div>

      <ul class="alloc-caveats">
        <li>Stock, bond and Bitcoin figures are real trailing total returns, not forecasts. The 9% credit sleeve is Cadena's target net rate at low, defined, hedgeable risk, not a guaranteed return.</li>
        <li>Each optimized mix carries the same risk as the classic blend on its row, so the extra return is not bought with extra risk.</li>
      </ul>

      <!-- Prose -->
      <h2 class="alloc-h2">Allocation is only half the argument</h2>
      <p class="alloc-body-p">The other half is what Bitcoin replaces. Modern portfolio theory gave us the 60/40: equities for growth, bonds for the safe asset. The problem is that the safe asset is no longer safe. Stocks and bonds fell together in 2022, the model's worst year on record. Bonds spent much of the last fifteen years paying no real yield, and long Treasuries lost roughly 30% in 2022.</p>
      <p class="alloc-body-p">The deeper issue is the label. The economics and credit quality of sovereign debt have steadily deteriorated, yet we still call it risk-free. A government bond is a claim on an issuer whose fiscal path keeps worsening, repaid in a currency it can print at will. In a world where central banks stop buying the bonds to suppress the rate, the market clears far higher, and a 9% real yield on sound-money collateral is what the safe asset should actually pay.</p>

      <!-- Putting it together -->
      <h2 class="alloc-h2">Putting it together: your portfolio</h2>
      <p class="alloc-body-p">
        The optimized portfolio at your <strong>{{ MIX_LABELS[currentMix] }}</strong> risk level over
        <strong>{{ currentWin }}</strong> years, sized to your net worth, with the safe asset set to
        <strong>{{ currentMode === 'credit' ? 'a 9% credit sleeve' : 'bonds' }}</strong> above.
      </p>

      <div class="alloc-ports">
        <!-- Classic -->
        <div class="alloc-port-card">
          <h3 class="alloc-port-title old">A classic {{ MIX_LABELS[currentMix] }} (bonds)</h3>
          <div class="alloc-port-stack">
            <div class="alloc-port-seg">
              <span class="alloc-chip" style="background:#5b6b8a"></span>
              <span class="alloc-port-nm">Equities</span>
              <span class="alloc-port-pc">{{ Math.round(currentMixArr[0] * 100) }}% &middot; {{ fmtUSD(currentMixArr[0] * nw) }}</span>
            </div>
            <div class="alloc-port-seg">
              <span class="alloc-chip" style="background:#6a6a7a"></span>
              <span class="alloc-port-nm">Bonds</span>
              <span class="alloc-port-pc">{{ Math.round(currentMixArr[1] * 100) }}% &middot; {{ fmtUSD(currentMixArr[1] * nw) }}</span>
            </div>
          </div>
          <div class="alloc-port-footer">Return <strong>{{ p1(classicRet) }}</strong> at <strong>{{ p1(classicVol) }}</strong> risk</div>
        </div>
        <!-- Optimized -->
        <div class="alloc-port-card">
          <h3 class="alloc-port-title new">Your optimized portfolio</h3>
          <div class="alloc-port-stack">
            <div class="alloc-port-seg" v-for="seg in newPortSegs" :key="seg.nm">
              <span class="alloc-chip" :style="{ background: seg.c }"></span>
              <span class="alloc-port-nm">{{ seg.nm }}</span>
              <span class="alloc-port-pc">{{ Math.round(seg.w * 100) }}% &middot; {{ fmtUSD(seg.w * nw) }}</span>
            </div>
          </div>
          <div class="alloc-port-footer">Return <strong class="alloc-btc-color">{{ p1(optimized.r) }}</strong> at the same risk</div>
        </div>
      </div>

      <p class="alloc-note-p" v-html="modeNoteHTML"></p>
      <p class="alloc-note-p">
        Two lenses on Bitcoin sizing. This optimized portfolio holds
        <strong class="alloc-btc-color">{{ pInt(optimized.wbtc) }}</strong> in Bitcoin; your conviction-based Kelly number above was
        <strong>{{ pInt(kellyAlloc) }}</strong> ({{ fmtUSD(kellyUSD) }}, {{ kellyBTC.toFixed(2) }} BTC).
        One is bounded by risk, the other by conviction; the right answer sits between them.
      </p>

      <!-- CTAs -->
      <div class="alloc-cta-box">
        <p>This is the argument of <strong>Endgame</strong>, out now. And the 9% credit layer that replaces bonds is what we build at <strong>Cadena</strong>.</p>
        <div class="alloc-cta-btns">
          <a class="alloc-btn primary" href="https://cadenabitcoin.com/endgame">Read Endgame</a>
          <a class="alloc-btn secondary" href="https://cadenabitcoin.com">See Cadena</a>
        </div>
      </div>

      <div class="alloc-book-cta">
        <div class="alloc-book-h">See where Bitcoin fits in your portfolio. Let's talk.</div>
        <a class="alloc-book-btn" href="https://calendly.com/cadenabitcoin-info/30min">Book a meeting</a>
      </div>

      <div class="alloc-foot">For education, not investment advice. Stock, bond and Bitcoin figures use real trailing total-return data; past performance is not a forecast. The credit sleeve's 9% is a target at defined, hedgeable risk, not a guaranteed return. Bitcoin is volatile and you can lose money. It's just math.</div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TheFooter from '../components/TheFooter.vue'

const DATA = {
  1:  { eq: { r: .198, v: .132 }, bd: { r: .040,  v: .030 }, btc: { r: -.481, v: .334 }, eb: .35, ebtc: .50, bbtc: -.31 },
  3:  { eq: { r: .193, v: .131 }, bd: { r: .041,  v: .055 }, btc: { r: .272,  v: .498 }, eb: .54, ebtc: .40, bbtc: -.08 },
  5:  { eq: { r: .128, v: .159 }, bd: { r: -.002, v: .064 }, btc: { r: .077,  v: .554 }, eb: .62, ebtc: .51, bbtc:  .19 },
  10: { eq: { r: .150, v: .153 }, bd: { r: .013,  v: .051 }, btc: { r: .578,  v: .738 }, eb: .40, ebtc: .33, bbtc:  .15 },
}
const CREDIT = { r: .09, v: .02, eb: 0, bbtc: .10 }
const MIX = [[1, 0], [.8, .2], [.6, .4], [.4, .6], [.2, .8], [0, 1]]
const MIX_LABELS = ['All stocks', '80/20', '60/40', '40/60', '20/80', 'All bonds']
const KELLY_FRACS = [{ v: 1, label: 'Full Kelly' }, { v: 0.5, label: 'Half Kelly' }, { v: 0.25, label: 'Quarter Kelly' }]
const WINDOWS = [1, 3, 5, 10]

// Reactive inputs
const conv = ref(60)
const pay  = ref(3)
const frac = ref(0.5)
const nw   = ref(1000000)
const btcp = ref(60000)
const currentWin  = ref(10)
const currentMix  = ref(2)
const currentMode = ref('bonds')

// Portfolio math
function pret(w, D) {
  return w[0] * D.eq.r + w[1] * D.bd.r + w[2] * D.btc.r
}
function pvol(w, D) {
  const [se, sb, st] = [D.eq.v, D.bd.v, D.btc.v]
  return Math.sqrt(
    w[0]*w[0]*se*se + w[1]*w[1]*sb*sb + w[2]*w[2]*st*st +
    2 * (w[0]*w[1]*se*sb*D.eb + w[0]*w[2]*se*st*D.ebtc + w[1]*w[2]*sb*st*D.bbtc)
  )
}
function riskMatched(D, tv) {
  let best = { we: 0, wbd: 1, wbtc: 0, r: pret([0, 1, 0], D), v: pvol([0, 1, 0], D) }
  for (let i = 0; i <= 50; i++) {
    const we = i / 50
    for (let j = 0; j + i <= 50; j++) {
      const wbtc = j / 50
      const wbd  = 1 - we - wbtc
      const w    = [we, wbd, wbtc]
      const v    = pvol(w, D)
      if (v <= tv + 1e-6) {
        const r = pret(w, D)
        if (r > best.r) best = { we, wbd, wbtc, r, v }
      }
    }
  }
  return best
}

// Formatters
function pInt(x) { return Math.round(x * 100) + '%' }
function p1(x)   { return (x * 100).toFixed(1) + '%' }
function fmtUSD(x) {
  const s = x < 0 ? '-' : ''
  x = Math.abs(x)
  if (x >= 1e6) return s + '$' + (x / 1e6).toFixed(2) + 'M'
  if (x >= 1e3) return s + '$' + Math.round(x / 1e3) + 'k'
  return s + '$' + Math.round(x)
}

// Kelly computed
const kellyFull  = computed(() => {
  const p = conv.value / 100
  const b = pay.value
  return Math.max(0, (b * p - (1 - p)) / b)
})
const kellyAlloc = computed(() => kellyFull.value * frac.value)
const kellyUSD   = computed(() => kellyAlloc.value * nw.value)
const kellyBTC   = computed(() => kellyUSD.value / (btcp.value || 60000))

// Portfolio computed
const rawData = computed(() => DATA[currentWin.value])
const effData = computed(() => {
  const D = rawData.value
  if (currentMode.value === 'credit') {
    return { eq: D.eq, bd: { r: CREDIT.r, v: CREDIT.v }, btc: D.btc, eb: CREDIT.eb, ebtc: D.ebtc, bbtc: CREDIT.bbtc }
  }
  return D
})
const currentMixArr = computed(() => MIX[currentMix.value])
const classicRet    = computed(() => pret([currentMixArr.value[0], currentMixArr.value[1], 0], rawData.value))
const classicVol    = computed(() => pvol([currentMixArr.value[0], currentMixArr.value[1], 0], rawData.value))
const optimized     = computed(() => riskMatched(effData.value, classicVol.value))

const calloutHTML = computed(() => {
  const o = optimized.value
  const safeShort = currentMode.value === 'credit' ? 'Credit' : 'Bonds'
  return `At the <strong>${MIX_LABELS[currentMix.value]}</strong> risk level (${currentWin.value}-year data, ${safeShort.toLowerCase()} as the safe asset): the optimal mix is <strong>${pInt(o.we)}</strong> stocks, <strong>${pInt(o.wbd)}</strong> ${safeShort.toLowerCase()}, <strong style="color:#F7931A">${pInt(o.wbtc)}</strong> Bitcoin, earning <strong style="color:#F7931A">${p1(o.r)}</strong> versus <strong>${p1(classicRet.value)}</strong> for the classic ${MIX_LABELS[currentMix.value]} blend, at the same risk.`
})

const modeNoteHTML = computed(() => {
  const o = optimized.value
  if (currentMode.value === 'credit') {
    return `This is the Endgame portfolio. The safe asset now earns a real <strong style="color:#F7931A">9%</strong> on sound-money collateral instead of a suppressed bond rate, so the optimizer holds <strong>${pInt(o.wbd)}</strong> in the credit sleeve and lifts the whole return to <strong style="color:#F7931A">${p1(o.r)}</strong> at the same risk.`
  }
  return `This is today&rsquo;s world, with bonds as the safe asset. Flip the safe asset to the 9% credit sleeve above and watch the optimizer rebuild the portfolio.`
})

const newPortSegs = computed(() => {
  const o = optimized.value
  return [
    { nm: 'Equities',     w: o.we,   c: '#5b6b8a' },
    { nm: 'Bitcoin',      w: o.wbtc, c: '#F7931A' },
    { nm: currentMode.value === 'credit' ? 'Bitcoin-backed credit' : 'Bonds', w: o.wbd, c: currentMode.value === 'credit' ? '#E08A1E' : '#6a6a7a' },
  ]
})
</script>

<style>
.alloc-page {
  font-family: 'Inter', -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  background: #081123;
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  -webkit-font-smoothing: antialiased;
}

.alloc-hero {
  text-align: center;
  padding: 56px 24px 28px;
  max-width: 760px;
}

.alloc-eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .18em;
  color: #F7931A;
  background: rgba(247, 147, 26, 0.1);
  border: 1px solid rgba(247, 147, 26, 0.25);
  padding: 5px 16px;
  border-radius: 20px;
  margin-bottom: 18px;
}

.alloc-page h1 {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -.02em;
  color: #fff;
  margin-bottom: 16px;
}

.alloc-gradient {
  background: linear-gradient(90deg, #F7931A, #E08A1E);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.alloc-lede {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.65;
  max-width: 34em;
  margin: 0 auto;
}

.alloc-wrap {
  width: 100%;
  max-width: 800px;
  padding: 0 24px 60px;
}

/* Section numbers */
.alloc-section-num {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-top: 44px;
}
.alloc-num {
  font-size: 46px;
  font-weight: 800;
  color: #F7931A;
  line-height: .9;
  letter-spacing: -.02em;
}
.alloc-section-num h2 {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -.01em;
  color: #fff;
  margin: 0;
}

.alloc-h2 {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -.01em;
  margin-top: 44px;
  margin-bottom: 0;
}

/* Card */
.alloc-card {
  background: rgba(8, 17, 35, 0.9);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  padding: 26px;
  margin-top: 20px;
}

/* Slider groups */
.alloc-slider-group { margin-bottom: 24px; }

.alloc-row-label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 6px;
}
.alloc-row-label strong {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.alloc-hint {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.5;
}

.alloc-range {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, #7c3aed var(--fill, 50%), #0d1a30 var(--fill, 50%));
  outline: none;
  cursor: pointer;
  margin: 4px 0 0;
}
.alloc-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #a78bfa;
  border: 3px solid #081123;
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.5);
  cursor: pointer;
  transition: transform 0.15s;
}
.alloc-range::-webkit-slider-thumb:hover { transform: scale(1.15); }
.alloc-range::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #a78bfa;
  border: 3px solid #081123;
  cursor: pointer;
}

/* Segment buttons */
.alloc-segs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.alloc-seg-btn {
  flex: 1;
  min-width: 74px;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.25);
  color: rgba(255,255,255,0.5);
  font-weight: 600;
  font-size: 13px;
  padding: 10px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: .15s;
  font-family: inherit;
}
.alloc-seg-btn:hover { background: rgba(139, 92, 246, 0.15); color: #c4b5fd; }
.alloc-seg-btn.active { background: #7c3aed; color: #fff; border-color: #7c3aed; }

.alloc-seg-label {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  margin-top: 16px;
  margin-bottom: 8px;
}

/* Two-col inputs */
.alloc-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}
.alloc-input-label {
  display: block;
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 6px;
}
.alloc-num-input {
  width: 100%;
  background: rgba(13, 26, 48, 0.9);
  border: 1px solid rgba(139, 92, 246, 0.2);
  color: #e0e0e0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
}
.alloc-num-input:focus { outline: none; border-color: rgba(139, 92, 246, 0.5); }

/* Output box */
.alloc-out {
  background: linear-gradient(160deg, rgba(30, 26, 18, 0.8), rgba(25, 25, 34, 0.8));
  border: 1px solid rgba(58, 44, 18, 0.8);
  border-radius: 14px;
  padding: 24px;
  margin-top: 20px;
  text-align: center;
}
.alloc-out-big {
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -.02em;
  color: #F7931A;
  line-height: 1;
}
.alloc-out-cap {
  font-size: 14px;
  color: rgba(255,255,255,0.45);
  margin-top: 8px;
}
.alloc-out-cap strong { color: #e9e9ef; }
.alloc-btc-color { color: #F7931A; }
.alloc-out-trio {
  font-size: 13px;
  color: rgba(255,255,255,0.35);
  margin-top: 10px;
}
.alloc-out-trio strong { color: #e9e9ef; }

/* Bars */
.alloc-bars { margin-top: 20px; }
.alloc-bar-row { margin: 12px 0; }
.alloc-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 5px;
  color: rgba(255,255,255,0.5);
}
.alloc-bar-val { font-weight: 700; color: #e0e0e0; }
.alloc-bar-track {
  height: 24px;
  background: rgba(13, 26, 48, 0.8);
  border-radius: 7px;
  overflow: hidden;
  border: 1px solid rgba(139, 92, 246, 0.1);
}
.alloc-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width .5s cubic-bezier(.2,.7,.2,1);
}
.alloc-bar-fill.norm { background: #3a3a4a; }
.alloc-bar-fill.you  { background: linear-gradient(90deg, #F7931A, #E08A1E); }
.alloc-underbet {
  text-align: center;
  font-size: 14px;
  color: #d9c9a6;
  margin-top: 14px;
  font-weight: 600;
}

/* Caveats */
.alloc-caveats { list-style: none; margin-top: 16px; padding: 0; }
.alloc-caveats li {
  position: relative;
  padding: 12px 0 12px 32px;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  line-height: 1.55;
}
.alloc-caveats li:first-child { border-top: none; }
.alloc-caveats li::before {
  content: "!";
  position: absolute;
  left: 0;
  top: 12px;
  width: 20px;
  height: 20px;
  background: rgba(42, 35, 19, 0.8);
  color: #F7931A;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Body prose */
.alloc-body-p {
  font-size: 15px;
  color: rgba(255,255,255,0.55);
  line-height: 1.7;
  margin-top: 14px;
}

/* MPT callout */
.alloc-callout {
  font-size: 14px;
  color: #d9c9a6;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.55;
}

.alloc-table-label {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 8px;
}

/* Table */
.alloc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.alloc-table th,
.alloc-table td {
  padding: 8px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  text-align: right;
}
.alloc-table th:first-child,
.alloc-table td:first-child { text-align: left; color: rgba(255,255,255,0.4); }
.alloc-table thead th { color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(139, 92, 246, 0.2); font-weight: 700; }
.alloc-hl-row td { color: #F7931A; font-weight: 700; }

.alloc-assump {
  font-size: 11.5px;
  color: #6b7280;
  margin-top: 14px;
  line-height: 1.6;
}

/* Ports */
.alloc-ports {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 20px;
}
.alloc-port-card {
  background: rgba(8, 17, 35, 0.9);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 14px;
  padding: 18px;
}
.alloc-port-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 14px;
}
.alloc-port-title.old { color: rgba(255,255,255,0.35); }
.alloc-port-title.new { color: #F7931A; }
.alloc-port-stack { display: flex; flex-direction: column; gap: 10px; }
.alloc-port-seg {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.alloc-chip {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  flex-shrink: 0;
}
.alloc-port-nm { color: rgba(255,255,255,0.6); }
.alloc-port-pc { margin-left: auto; color: rgba(255,255,255,0.45); text-align: right; font-size: 12.5px; }
.alloc-port-footer {
  font-size: 12.5px;
  color: rgba(255,255,255,0.35);
  margin-top: 14px;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
  padding-top: 10px;
}
.alloc-port-footer strong { color: #e9e9ef; }

.alloc-note-p {
  font-size: 13.5px;
  color: rgba(255,255,255,0.4);
  margin-top: 14px;
  line-height: 1.6;
}

/* CTAs */
.alloc-cta-box {
  background: linear-gradient(160deg, rgba(28, 24, 17, 0.9), rgba(23, 23, 31, 0.9));
  border: 1px solid rgba(58, 44, 18, 0.7);
  border-radius: 16px;
  padding: 28px;
  margin-top: 44px;
  text-align: center;
}
.alloc-cta-box p { font-size: 16px; color: rgba(255,255,255,0.7); }
.alloc-cta-btns { display: flex; gap: 12px; justify-content: center; margin-top: 18px; flex-wrap: wrap; }
.alloc-btn {
  padding: 13px 24px;
  border-radius: 11px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: all .2s;
}
.alloc-btn.primary { background: #7c3aed; color: #fff; }
.alloc-btn.primary:hover { background: #6d28d9; box-shadow: 0 6px 20px rgba(124,58,237,.4); }
.alloc-btn.secondary { background: transparent; color: #fff; border: 1px solid rgba(139,92,246,.35); }
.alloc-btn.secondary:hover { background: rgba(139,92,246,.1); }

.alloc-book-cta {
  margin-top: 36px;
  text-align: center;
  padding: 36px 24px;
  border-radius: 16px;
  background: radial-gradient(120% 120% at 50% 0%, rgba(47, 33, 9, 0.9), rgba(19, 16, 25, 0.9));
  border: 1px solid rgba(74, 52, 16, 0.8);
}
.alloc-book-h {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 18px;
  letter-spacing: -.01em;
}
.alloc-book-btn {
  display: inline-block;
  background: linear-gradient(90deg, #F7931A, #E08A1E);
  color: #111;
  font-weight: 800;
  font-size: 17px;
  padding: 16px 40px;
  border-radius: 12px;
  text-decoration: none;
  animation: alloc-glow 2.2s ease-in-out infinite;
}
@keyframes alloc-glow {
  0%, 100% { box-shadow: 0 0 16px rgba(247,147,26,.45); }
  50%       { box-shadow: 0 0 40px rgba(247,147,26,.95); }
}

.alloc-foot {
  font-size: 12px;
  color: rgba(255,255,255,0.25);
  margin-top: 28px;
  text-align: center;
  line-height: 1.65;
}

/* Responsive */
@media (max-width: 600px) {
  .alloc-page h1 { font-size: 30px; }
  .alloc-ports { grid-template-columns: 1fr; }
  .alloc-two-col { grid-template-columns: 1fr; }
  .alloc-out-big { font-size: 44px; }
}
</style>
