<template>
  <main class="min-h-screen w-full text-white pt-20 md:pt-32 relative">
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- Hero -->
    <section class="max-w-4xl mx-auto text-center px-6">
      <span class="inline-block text-sm font-semibold tracking-wide uppercase text-secondary mb-4 border border-secondary/40 rounded-full px-4 py-1">
        For Cadena Borrowers &amp; Lenders
      </span>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
        The price that settles<br>your loan. <span class="text-secondary">Explained.</span>
      </h1>
      <p class="text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
        Cadena loans are Discreet Log Contracts on Bitcoin. Your Bitcoin stays in a contract you co-sign.
        At maturity, one outside fact is needed: a BTC/USD price. This page explains the oracle that publishes
        that price — how the number is made, what announcements and attestations mean, and what you can check yourself.
      </p>

      <!-- Quick nav -->
      <div class="flex flex-wrap items-center justify-center gap-2 mt-8 text-sm">
        <a v-for="link in quickNav" :key="link.href" :href="link.href"
          class="rounded-full border border-white/15 px-4 py-1.5 text-white/70 hover:text-white hover:border-secondary/50 transition-colors">
          {{ link.label }}
        </a>
      </div>

      <!-- Live stat grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 text-left">
        <div class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div class="text-xs uppercase tracking-widest text-white/40 flex items-center gap-1.5">
            <span class="inline-block w-2 h-2 rounded-full animate-pulse" :class="statusDotClass"></span>
            BTC/USD now
          </div>
          <div class="text-2xl font-bold tabular-nums mt-1">{{ priceDisplay }}</div>
          <div class="text-xs text-white/40 mt-0.5">median of exchange feeds</div>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div class="text-xs uppercase tracking-widest text-white/40">Fresh sources</div>
          <div class="text-2xl font-bold tabular-nums mt-1">{{ freshDisplay }}</div>
          <div class="text-xs text-white/40 mt-0.5">updated within 2 min</div>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div class="text-xs uppercase tracking-widest text-white/40">Next attestation</div>
          <div class="text-2xl font-bold tabular-nums mt-1">{{ countdownDisplay }}</div>
          <div class="text-xs text-white/40 mt-0.5 break-all">{{ nextMeta }}</div>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div class="text-xs uppercase tracking-widest text-white/40">Last attested</div>
          <div class="text-2xl font-bold tabular-nums mt-1">{{ lastPriceDisplay }}</div>
          <div class="text-xs text-white/40 mt-0.5 break-all">{{ lastMeta }}</div>
        </div>
      </div>

      <!-- Overview video -->
      <div class="mt-10 rounded-2xl overflow-hidden border border-white/10 bg-black/30 aspect-video">
        <iframe
          class="w-full h-full block"
          src="https://www.youtube.com/embed/_jflwENHLTs"
          title="Cadena Oracle overview"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
      <p class="text-sm text-white/40 mt-3">Overview video — production upload in progress.</p>
    </section>

    <!-- Your loan -->
    <section id="role" class="max-w-4xl mx-auto px-6 mt-20">
      <div class="eyebrow-label">Why this matters for your loan</div>
      <h2 class="text-2xl md:text-3xl font-extrabold mb-4 leading-snug mt-2">
        The oracle's only job is to sign a price at maturity.
      </h2>
      <p class="text-white mb-8 leading-relaxed">
        It does not hold your Bitcoin, see your loan terms, or decide who wins. Borrower and lender already
        pre-signed every possible payout when the loan opened. The oracle's signature unlocks exactly one of those payouts.
      </p>
      <div class="grid sm:grid-cols-2 gap-4">
        <div v-for="(card, i) in roleCards" :key="i" class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h3 class="font-bold text-white mb-1.5">{{ card.title }}</h3>
          <p class="text-white/70 text-sm leading-relaxed">
            {{ card.desc }}
            <a v-if="card.href" :href="card.href" target="_blank" rel="noopener noreferrer" class="text-secondary hover:underline">{{ card.linkText }}</a>
          </p>
        </div>
      </div>
      <div class="note-box mt-6">
        Cadena's current policy is a <strong class="text-white">$1M maximum contract size</strong>. That is a
        product policy. It is <strong class="text-white">not</strong> certified "safe" by a rating, and it is not
        derived from a completed loss-vs-attack-cost study.
      </div>
    </section>

    <!-- How it works -->
    <section id="how" class="mt-20 py-16 border-t border-white/10 bg-white/[0.02]">
      <div class="max-w-4xl mx-auto px-6">
        <div class="eyebrow-label">Announcements &amp; attestations</div>
        <h2 class="text-2xl md:text-3xl font-extrabold mb-4 leading-snug mt-2">
          Two words you'll see on every event.
        </h2>
        <p class="text-white mb-8 leading-relaxed">
          Events run on a fixed <strong class="text-white">10-minute cadence</strong> (Unix times divisible by 600).
          An event ID looks like <code class="mono-chip">btcusd&lt;unix&gt;</code>. The last attested event and the
          next scheduled event are always 600 seconds apart on that grid.
        </p>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(step, i) in howSteps" :key="i" class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div class="w-7 h-7 rounded-full bg-secondary/20 text-secondary font-bold text-sm flex items-center justify-center mb-3">{{ i + 1 }}</div>
            <h3 class="font-bold text-white mb-1.5">{{ step.title }}</h3>
            <p class="text-white/70 text-sm leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
        <div class="note-box mt-6">
          Signing two different prices for the same announcement would expose the oracle's private key.
          Equivocation is publicly detectable.
        </div>
      </div>
    </section>

    <!-- The price -->
    <section id="price" class="max-w-4xl mx-auto px-6 mt-20">
      <div class="eyebrow-label">How the number is made</div>
      <h2 class="text-2xl md:text-3xl font-extrabold mb-4 leading-snug mt-2">
        Median of executed exchange prices — the method we keep.
      </h2>
      <p class="text-white mb-6 leading-relaxed">
        Cadena uses this aggregation today. The median of the listed exchange feeds is the live method.
      </p>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="rounded-xl border border-secondary/30 bg-secondary/[0.07] p-5">
          <span class="status-tag status-tag--live">LIVE</span>
          <h3 class="font-bold text-white mt-3 mb-1.5">Today</h3>
          <p class="text-white/70 text-sm leading-relaxed">
            At each event time the oracle takes the <strong class="text-white">median</strong> across 11 exchange
            feeds (BinanceUS, Bitfinex, Bitpanda, Bitstamp, Coinbase, Crypto.com, Gemini, HTX, Kraken, KuCoin USDT,
            KuCoin USDC). A median means one bad feed alone cannot set the result.
          </p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <span class="status-tag status-tag--draft">STATED APPROACH</span>
          <h3 class="font-bold text-white mt-3 mb-1.5">Executed-transaction basis</h3>
          <p class="text-white/70 text-sm leading-relaxed">
            Following common DeFi practice, feeds are intended to reflect <strong class="text-white">executed market
            transactions</strong> (exchange last-trade / ticker-style prints), not a Cadena-invented mid-quote.
            Confirm exact production websocket fields with the oracle operators; the public API returns per-source
            prices without labeling the tick type.
          </p>
        </div>
      </div>
    </section>

    <!-- Inspect -->
    <section id="inspect" class="mt-20 py-16 border-t border-white/10 bg-white/[0.02]">
      <div class="max-w-4xl mx-auto px-6">
        <div class="eyebrow-label">Resources you can use</div>
        <h2 class="text-2xl md:text-3xl font-extrabold mb-4 leading-snug mt-2">
          What you can inspect yourself.
        </h2>
        <p class="text-white mb-8 leading-relaxed">You do not need an account. The oracle API and the tools below are public.</p>

        <!-- Live sources table -->
        <div class="rounded-xl border border-white/10 bg-white/[0.03] p-5 overflow-x-auto">
          <h3 class="font-bold text-white mb-3">Live exchange sources</h3>
          <table class="w-full text-sm tabular-nums">
            <thead>
              <tr class="text-white/40 text-xs uppercase tracking-wide">
                <th class="text-left py-2 pr-3 font-medium">Source</th>
                <th class="text-right py-2 px-3 font-medium">Pair</th>
                <th class="text-right py-2 px-3 font-medium">Price</th>
                <th class="text-right py-2 px-3 font-medium">vs median</th>
                <th class="text-right py-2 pl-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!sources.length">
                <td colspan="5" class="py-4 text-white/50">{{ sourcesLoadError ? 'Oracle API unreachable from this browser.' : 'Loading…' }}</td>
              </tr>
              <tr v-for="s in sources" :key="s.source" class="border-t border-white/[0.06]" :class="s.stale ? 'text-red-400' : 'text-white/90'">
                <td class="text-left py-2 pr-3">{{ s.source }}</td>
                <td class="text-right py-2 px-3 font-mono">{{ s.symbol }}</td>
                <td class="text-right py-2 px-3">{{ usd(s.price) }}</td>
                <td class="text-right py-2 px-3">{{ deltaDisplay(s.delta_from_aggr) }}</td>
                <td class="text-right py-2 pl-3">{{ s.error ? 'error' : ago(s.ageSeconds) + ' ago' }}</td>
              </tr>
              <tr v-if="sources.length" class="border-t border-white/10 font-semibold text-white">
                <td class="text-left py-2 pr-3">Median</td>
                <td></td>
                <td class="text-right py-2 px-3">{{ priceDisplay }}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <p class="text-xs text-white/40 mt-3">
            Red rows haven't updated in over 2 minutes. The live median still includes them. A temporary source gap
            does not by itself prove settlement risk.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 mt-4">
          <div class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 class="font-bold text-white mb-2">Oracle public keys</h3>
            <p class="text-white/70 text-sm mb-1.5">Main signing key:</p>
            <div class="mono-box mb-3">{{ mainPublicKey || '—' }}</div>
            <p class="text-white/70 text-sm mb-1.5">All published keys:</p>
            <div class="mono-chip-list">{{ publicKeys.length ? publicKeys.join('\n') : '—' }}</div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 class="font-bold text-white mb-2">Open API</h3>
            <p class="text-white/70 text-sm mb-3">Query events, announcements, and attestations directly.</p>
            <pre class="mono-box whitespace-pre-wrap">GET {{ API_BASE }}oracle/oracle_info
GET {{ API_BASE }}price_info/current/BTCUSD
GET {{ API_BASE }}event/next_event?definition=BTCUSD
GET {{ API_BASE }}event/event/btcusd{unix_time}</pre>
          </div>
        </div>

        <!-- Lookup tool -->
        <div class="rounded-xl border border-white/10 bg-white/[0.03] p-5 mt-4">
          <h3 class="font-bold text-white mb-1.5">Look up any announcement or attestation</h3>
          <p class="text-white/70 text-sm mb-3">
            Enter an event ID, or a date and time (rounded down to the nearest 10 minutes on the 600-second grid).
          </p>
          <div class="flex flex-wrap gap-2">
            <input
              v-model="lookupQuery"
              @keydown.enter="lookup"
              type="text"
              placeholder="btcusd1793993400  or  2026-11-06 14:30"
              class="flex-1 min-w-[220px] rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-secondary/50"
            />
            <button
              type="button"
              @click="lookup"
              class="rounded-lg bg-secondary hover:bg-secondary/90 text-white font-semibold text-sm px-4 py-2 transition"
            >Look up</button>
          </div>
          <div v-if="lookupError" class="text-sm text-red-400 mt-3">{{ lookupError }}</div>
          <div v-else-if="lookupResult" class="mt-4 text-sm">
            <table class="w-full">
              <tr class="border-b border-white/[0.06]"><td class="py-1.5 pr-4 text-white/50">Event</td><td class="py-1.5 font-mono break-all">{{ lookupResult.event_id }}</td></tr>
              <tr class="border-b border-white/[0.06]"><td class="py-1.5 pr-4 text-white/50">Time</td><td class="py-1.5">{{ local(lookupResult.time_utc) }} (10-min grid)</td></tr>
              <tr class="border-b border-white/[0.06]"><td class="py-1.5 pr-4 text-white/50">Signer</td><td class="py-1.5 font-mono break-all">{{ lookupResult.signer_public_key }}</td></tr>
              <tr>
                <td class="py-1.5 pr-4 text-white/50">Status</td>
                <td class="py-1.5">
                  <span v-if="lookupResult.has_outcome" class="text-green-400 font-semibold">Attested {{ usd(lookupResult.outcome_value) }}</span>
                  <span v-else>Announced, awaiting attestation</span>
                </td>
              </tr>
            </table>
            <details class="mt-3">
              <summary class="cursor-pointer text-white/60 hover:text-white text-xs">Raw announcement/attestation JSON (nonces &amp; signatures)</summary>
              <pre class="mono-box whitespace-pre-wrap mt-2 max-h-72 overflow-auto text-xs">{{ JSON.stringify(lookupResult, null, 2) }}</pre>
            </details>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 mt-4">
          <div class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 class="font-bold text-white mb-2">Status</h3>
            <p :class="statusOperational ? 'text-green-400' : 'text-red-400'" class="font-semibold">
              ● {{ statusOperational ? 'Operational' : 'Unreachable' }}
            </p>
            <p v-if="statusOperational" class="text-white/70 text-sm mt-1.5">
              {{ totalEventCount.toLocaleString() }} events total. Oracle clock: {{ oracleClockDisplay }}
            </p>
            <p class="text-white/70 text-sm mt-2"><span class="text-white font-semibold">{{ futureEventCount.toLocaleString() }}</span> future events are already announced.</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 class="font-bold text-white mb-2">How settlement stays mechanical</h3>
            <ul class="space-y-1.5 text-sm text-white/70">
              <li><span class="status-tag status-tag--live">LIVE</span> Signatures are never held — payouts are pre-signed.</li>
              <li><span class="status-tag status-tag--live">LIVE</span> No liquidations mid-loan — one attestation at maturity.</li>
              <li><span class="status-tag status-tag--live">LIVE</span> Median of listed exchange feeds on a 10-minute grid.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="max-w-4xl mx-auto px-6 mt-20 pb-16">
      <div class="eyebrow-label">FAQ</div>
      <h2 class="text-2xl md:text-3xl font-extrabold mb-6 leading-snug mt-2">Common questions from Cadena users.</h2>
      <div class="space-y-3">
        <div v-for="(item, i) in faqs" :key="i" class="rounded-md border border-white/10 bg-dark overflow-hidden">
          <button
            class="w-full flex items-center justify-between gap-3 text-left p-4"
            @click="toggleFaq(i)"
            :aria-expanded="openFaqs.has(i)"
            :aria-controls="`oracle-faq-panel-${i}`"
          >
            <h3 class="text-base font-medium">{{ item.q }}</h3>
            <svg class="size-5 shrink-0 transition-transform duration-300" :class="openFaqs.has(i) ? '-rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-show="openFaqs.has(i)" :id="`oracle-faq-panel-${i}`" class="px-4 pb-4 text-white/70 text-sm leading-relaxed" v-html="item.a"></div>
        </div>
      </div>
    </section>

    <!-- Closing links -->
    <section class="max-w-4xl mx-auto px-6 pb-16 text-center text-sm text-white/50">
      <p>
        Live oracle site &amp; API: <a href="https://oracle.purabitcoin.com/" target="_blank" rel="noopener noreferrer" class="text-secondary hover:underline">oracle.purabitcoin.com</a>
        &middot; Oracle disclaimer: <a href="https://oracle.purabitcoin.com/disclaimer.html" target="_blank" rel="noopener noreferrer" class="text-secondary hover:underline">disclaimer</a>
      </p>
      <p class="mt-2">Prices from public exchange APIs, published best-effort.</p>
    </section>
  </main>

  <TheFooter />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TheFooter from '../components/TheFooter.vue'

const API_BASE = 'https://oracle.purabitcoin.com/api/v0/'
const SLOT = 600

async function apiGet(path) {
  const res = await fetch(API_BASE + path, { cache: 'no-store' })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

const floorSlot = (t) => Math.floor(Number(t) / SLOT) * SLOT

function usd(v) {
  if (v == null || !Number.isFinite(Number(v))) return '—'
  return '$' + Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })
}
function ago(s) {
  if (!Number.isFinite(s)) return '—'
  if (s < 120) return Math.round(s) + 's'
  if (s < 7200) return Math.round(s / 60) + 'm'
  if (s < 172800) return (s / 3600).toFixed(1) + 'h'
  return (s / 86400).toFixed(1) + 'd'
}
function local(t) {
  if (!Number.isFinite(t)) return '—'
  return new Date(t * 1000).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })
}
function deltaDisplay(d) {
  if (d == null || !Number.isFinite(Number(d))) return '—'
  const n = Number(d)
  return (n >= 0 ? '+' : '') + n.toFixed(2)
}

/* ---- Quick nav ---- */
const quickNav = [
  { href: '#role', label: 'Your loan' },
  { href: '#how', label: 'How it works' },
  { href: '#price', label: 'The price' },
  { href: '#inspect', label: 'Inspect' },
  { href: '#faq', label: 'FAQ' },
]

/* ---- Live price + sources ---- */
const price = ref(null)
const sources = ref([])
const sourcesLoadError = ref(false)
const priceDisplay = computed(() => usd(price.value))
const freshDisplay = computed(() => {
  if (!sources.value.length) return '—'
  const fresh = sources.value.filter((s) => !s.stale).length
  return `${fresh} / ${sources.value.length}`
})
const statusDotClass = computed(() => (sourcesLoadError.value ? 'bg-red-500' : 'bg-green-400'))

async function fetchPrices() {
  try {
    const p = await apiGet('price_info/current/BTCUSD')
    const now = Date.now() / 1000
    const list = p.aggr_sources || []
    price.value = p.price
    sources.value = list.map((f) => {
      const ageSeconds = now - (f.claimed_time || f.retrieve_time)
      return { ...f, ageSeconds, stale: !!f.error || ageSeconds > 120 }
    })
    sourcesLoadError.value = false
  } catch (e) {
    sourcesLoadError.value = true
    console.debug('Oracle price fetch failed:', e)
  }
}

/* ---- Attestation cadence (next/last) ---- */
const nextT = ref(null)
const lastT = ref(null)
const lastPrice = ref(null)
const nextMeta = ref('10-minute schedule')
const lastMeta = ref('prior 10-minute event')
const countdownSeconds = ref(null)
const lastPriceDisplay = computed(() => (lastPrice.value == null ? (lastT.value != null ? 'pending' : '—') : usd(lastPrice.value)))
const countdownDisplay = computed(() => {
  if (countdownSeconds.value == null) return '—'
  const s = Math.max(0, countdownSeconds.value)
  return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0')
})

function setCadenceLabels() {
  if (nextT.value == null || lastT.value == null) return
  const d = nextT.value - lastT.value
  const ok = d === SLOT
  nextMeta.value = (ok ? '' : '⚠ ') + `event btcusd${nextT.value} · ${local(nextT.value)}` + (ok ? '' : ' · unexpected spacing')
  lastMeta.value = (ok ? '' : '⚠ ') + `event btcusd${lastT.value} · ${local(lastT.value)}` + (ok ? ' · 10 min before next' : ' · expected 600s before next')
}

async function findLastAttested(beforeUtc) {
  let t = floorSlot(beforeUtc)
  for (let i = 0; i < 6; i++) {
    try {
      const e = await apiGet('event/event/btcusd' + t)
      if (e && e.has_outcome) return e
    } catch {
      // keep walking backward
    }
    t -= SLOT
  }
  return null
}

/* ---- Oracle keys + status ---- */
const mainPublicKey = ref('')
const publicKeys = ref([])
const statusOperational = ref(null)
const futureEventCount = ref(0)
const totalEventCount = ref(0)
const oracleClockUtc = ref(null)
const oracleClockDisplay = computed(() => (oracleClockUtc.value != null ? local(oracleClockUtc.value) : '—'))

async function fetchMeta() {
  try {
    const info = await apiGet('oracle/oracle_info')
    mainPublicKey.value = info.main_public_key
    publicKeys.value = Array.isArray(info.public_keys) ? info.public_keys : []
  } catch {
    // leave key fields blank
  }

  try {
    const s = await apiGet('oracle/oracle_status')
    futureEventCount.value = s.future_event_count || 0
    totalEventCount.value = s.total_event_count || 0
    oracleClockUtc.value = s.current_time_utc
    statusOperational.value = true
  } catch {
    statusOperational.value = false
  }

  try {
    const n = await apiGet('event/next_event?definition=BTCUSD')
    nextT.value = floorSlot(n.time_utc)
    const last = await findLastAttested(nextT.value - SLOT)
    if (last) {
      lastT.value = floorSlot(last.time_utc || Number(String(last.event_id).replace(/\D/g, '')))
      lastPrice.value = last.outcome_value
    } else {
      lastT.value = nextT.value - SLOT
      lastPrice.value = null
    }
    setCadenceLabels()
    countdownSeconds.value = Math.max(0, nextT.value - Date.now() / 1000)
  } catch (e) {
    console.debug('Oracle meta fetch failed:', e)
  }
}

/* ---- Lookup tool ---- */
const lookupQuery = ref('')
const lookupResult = ref(null)
const lookupError = ref('')

async function lookup() {
  const q = lookupQuery.value.trim()
  lookupError.value = ''
  lookupResult.value = null
  if (!q) {
    lookupError.value = 'Enter an event ID or a date/time.'
    return
  }

  let id
  if (/^btcusd\d+$/.test(q)) {
    id = 'btcusd' + floorSlot(q.replace(/\D/g, ''))
  } else {
    const d = new Date(q.replace(' ', 'T'))
    if (isNaN(d)) {
      lookupError.value = 'Enter an event ID or a date/time.'
      return
    }
    id = 'btcusd' + floorSlot(d.getTime() / 1000)
  }

  try {
    lookupResult.value = await apiGet('event/event/' + id)
  } catch (e) {
    lookupError.value = `Not found (${e?.message || e}).`
  }
}

/* ---- Content data ---- */
const roleCards = [
  {
    title: 'What you lock in when you open',
    desc: "You and the other party build the contract around a future oracle event (a specific 10-minute slot). You both sign the full set of settlement transactions up front. Nobody holds a signature back to use later.",
  },
  {
    title: 'What happens at maturity',
    desc: "When that event's time arrives, the oracle attests a BTC/USD price. That attestation unlocks the matching pre-signed payout. Settlement is mechanical: one published number, one unlocked path.",
  },
  {
    title: 'No liquidations mid-loan',
    desc: 'Cadena loans are attested once, at maturity. There are no liquidations or margin calls along the way, so a brief wick cannot force a close before the agreed date.',
  },
  {
    title: 'Who runs it today',
    desc: 'The DLCP Oracle is operated today by Cadena’s engineering team and publishes at ',
    href: 'https://oracle.purabitcoin.com/',
    linkText: 'oracle.purabitcoin.com',
  },
]

const howSteps = [
  { title: 'Announce', desc: 'Long before maturity, the oracle publishes the event: time, public key, and one-time nonces. Your contract locks onto that announcement.' },
  { title: 'Commit', desc: 'Borrower and lender sign every possible payout against that announcement. The outcomes are fixed; only the attested price selects which one pays.' },
  { title: 'Attest', desc: 'At the event time the oracle signs the BTC/USD price, digit by digit (7 decimal digits, whole dollars).' },
  { title: 'Settle', desc: 'The signature unlocks exactly one pre-signed payout. The oracle never touches funds and never sees who is in the contract.' },
]

const faqs = [
  { q: 'Does the oracle hold my Bitcoin?', a: 'No. Funds sit in the DLC you co-signed. The oracle only publishes a price signature. It never custodies coins and never sees your loan.' },
  { q: 'Can someone change my outcome after I open?', a: 'No. Outcomes are pre-signed when the loan opens. At maturity the attested price selects which already-signed path unlocks. Nobody holds a discretionary signature to rewrite your payout.' },
  { q: 'What if the price looks wrong for a minute?', a: 'Your loan does not liquidate on a wick. Settlement uses the attested price at the maturity event you contracted for — one shot on that 10-minute slot.' },
  { q: 'What if the oracle never attests?', a: 'The white-paper design includes a timelocked refund after 48 hours. Whether every live Cadena contract already carries that path is <strong class="text-white">to confirm</strong> before you rely on it.' },
  { q: 'Is the oracle software open source?', a: 'This page does <strong class="text-white">not</strong> claim that the live signing code is open source. You get public inputs and checkable outputs (sources, keys, announcements, attestations). Keeping the signing binary unpublished is a deployment choice; it is not, by itself, a proof of security.' },
  { q: 'Where else can I read?', a: 'Live oracle site and API: <a href="https://oracle.purabitcoin.com/" target="_blank" rel="noopener noreferrer" class="text-secondary hover:underline">oracle.purabitcoin.com</a> &middot; Cadena product: <a href="https://cadenabitcoin.com/" class="text-secondary hover:underline">cadenabitcoin.com</a> &middot; Oracle disclaimer: <a href="https://oracle.purabitcoin.com/disclaimer.html" target="_blank" rel="noopener noreferrer" class="text-secondary hover:underline">disclaimer</a>' },
]
const openFaqs = ref(new Set([0]))
function toggleFaq(i) {
  const s = new Set(openFaqs.value)
  s.has(i) ? s.delete(i) : s.add(i)
  openFaqs.value = s
}

/* ---- Lifecycle ---- */
let pricesIntervalId = null
let countdownIntervalId = null

onMounted(() => {
  window.scrollTo(0, 0)
  fetchPrices()
  fetchMeta()
  pricesIntervalId = setInterval(fetchPrices, 15000)
  countdownIntervalId = setInterval(() => {
    if (nextT.value == null) return
    const s = Math.max(0, nextT.value - Date.now() / 1000)
    countdownSeconds.value = s
    if (s <= 0) {
      nextT.value = null
      setTimeout(fetchMeta, 2000)
    }
  }, 1000)
})

onUnmounted(() => {
  if (pricesIntervalId) clearInterval(pricesIntervalId)
  if (countdownIntervalId) clearInterval(countdownIntervalId)
})
</script>

<style scoped>
.bg-page-gradient {
  background-color: #000;
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,
      rgba(103,56,228,0.58) 0%,
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%
    );
}
@supports (background: radial-gradient(in oklch, black, white)) {
  .bg-page-gradient {
    background-color: oklch(0 0 0);
    background-image:
      radial-gradient(
        in oklch 125% 75% at 50% 100%,
        oklch(from #6738e4 l c h / 0.60) 0%,
        oklch(from #6738e4 l c h / 0.36) 26%,
        oklch(from #6738e4 l c h / 0.16) 52%,
        oklch(0 0 0 / 0) 76%
      );
  }
}
@media (max-height: 800px) {
  .bg-page-gradient {
    background-image:
      radial-gradient(
        120% 60% at 50% 100%,
        rgba(103,56,228,0.52) 0%,
        rgba(103,56,228,0.30) 24%,
        rgba(103,56,228,0.12) 48%,
        rgba(0,0,0,0) 70%
      );
  }
}

.eyebrow-label {
  color: var(--secondary, #6738e4);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.note-box {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  padding: 0.9rem 1.1rem;
  border: 1px dashed rgba(255,255,255,0.15);
  border-radius: 0.6rem;
}

.mono-chip {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
  background: rgba(103,56,228,0.15);
  border-radius: 4px;
  padding: 1px 6px;
}

.mono-box {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8rem;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 10px 12px;
  word-break: break-all;
  color: rgba(255,255,255,0.8);
}

.mono-chip-list {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  white-space: pre-line;
  word-break: break-all;
}

.status-tag {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 99px;
}
.status-tag--live { background: rgba(39,194,129,0.15); color: #27c281; }
.status-tag--draft { background: rgba(154,160,168,0.15); color: #c5cad1; }
</style>

<!-- smooth scroll must be global, not scoped -->
<style>
html { scroll-behavior: smooth; }
</style>
