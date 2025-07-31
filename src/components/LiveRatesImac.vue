<template>
  <!-- Clickable screen -->
  <router-link
    to="/btcusd"
    class="imac-click block"
    aria-label="Open BTCUSD live rates"
  >
    <div class="device device-imac mx-auto cursor-pointer">
      <div class="device-frame">
        <div class="device-content bg-dark text-white flex items-center justify-center">
          <div class="imac-inner">
            <table class="rates-table">
              <colgroup>
                <col style="width: 40%">
                <col style="width: 30%">
                <col style="width: 30%">
              </colgroup>

              <thead>
                <tr>
                  <th class="th text-left">Term</th>
                  <th class="th text-center bg-secondary rounded">50% LTV</th>
                  <th class="th text-center bg-secondary rounded">80% LTV</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(term, index) in terms" :key="term.label">
                  <td class="td text-left font-semibold">{{ term.label }}</td>

                  <!-- 50% LTV -->
                  <td class="td text-center bg-white/10 rounded">
                    <span :class="flashActive.has(`${index}-ltv50`) ? 'text-secondary flash-text' : ''">
                      {{ term.ltv50 }}
                    </span>
                  </td>

                  <!-- 80% LTV -->
                  <td class="td text-center bg-white/10 rounded">
                    <span :class="flashActive.has(`${index}-ltv80`) ? 'text-secondary flash-text' : ''">
                      {{ term.ltv80 }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- keep your shell bits -->
      <div class="device-stripe"></div>
      <div class="device-header"></div>
      <div class="device-sensors"></div>
      <div class="device-btns"></div>
      <div class="device-power"></div>
    </div>
  </router-link>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const terms = [
  { label: '1 Month',  ltv50: '5.1%  -   5.2%', ltv80: '9.8%   –   9.9%' },
  { label: '3 Months', ltv50: '6.2% – 6.3%',    ltv80: '11.2% – 13.3%' },
  { label: '6 Months', ltv50: '7.2% – 7.5%',    ltv80: '*' },
  { label: '1 Year',   ltv50: '8.0% – 8.2%',    ltv80: '*' },
]

// --- Flash behavior (tweak as you like)
const initialDelayMs   = 1000    // wait before first flash
const intervalMs       = 30000   // flash every 30s
const flashProbability = 0.25    // 25% chance each cell is picked per cycle
const flashes          = 3       // how many on/off blinks
const perStateMs       = 180     // ms for each on/off state

const flashActive = ref(new Set())
let intervalHandle = null
let initialTimer = null

function pickRandomCells () {
  const picks = []
  for (let i = 0; i < terms.length; i++) {
    const candidates = ['ltv50', 'ltv80']
    candidates.forEach((key) => {
      if (Math.random() < flashProbability) picks.push(`${i}-${key}`)
    })
  }
  if (picks.length === 0 && terms.length > 0) {
    picks.push(`0-ltv50`)
  }
  return picks
}

function tripleFlash () {
  const targets = pickRandomCells()
  const periods = flashes * 2 // on/off pairs

  for (let k = 0; k <= periods; k++) {
    setTimeout(() => {
      const next = new Set(flashActive.value)
      targets.forEach((id) => {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      })
      flashActive.value = next
    }, k * perStateMs)
  }
  setTimeout(() => {
    flashActive.value = new Set()
  }, (periods + 1) * perStateMs)
}

function startFlashing () {
  stopFlashing()
  initialTimer = setTimeout(tripleFlash, initialDelayMs)
  intervalHandle = setInterval(tripleFlash, intervalMs)
}

function stopFlashing () {
  if (initialTimer) { clearTimeout(initialTimer); initialTimer = null }
  if (intervalHandle) { clearInterval(intervalHandle); intervalHandle = null }
  flashActive.value = new Set()
}

onMounted(startFlashing)
onUnmounted(stopFlashing)
</script>


<style scoped>
/* Flash effect */
.flash-text {
  animation: flashPop 0.18s ease-in-out;
}

@keyframes flashPop {
  0%   { transform: scale(1);   filter: brightness(1);   }
  50%  { transform: scale(1.07); filter: brightness(1.2); }
  100% { transform: scale(1);   filter: brightness(1);   }
}

/* Keep within the iMac screen */
.device-content {
  min-height: 220px;
  max-height: 300px;
  border-radius: 6px;
  overflow: hidden;
}

/* Hard cap the table width so cells don't fill the whole screen */
.imac-inner {
  max-width: 520px;          /* fits inside the iMac viewport */
  width: 100%;
  padding: 6px 8px;
}

/* Table sizing & behavior */
.rates-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 6px 6px;   /* compact gaps */
  table-layout: fixed;       /* enforce colgroup widths */
  font-size: 11px;           /* small text */
  line-height: 1.15;
}

/* Cells */
.th {
  padding: 6px 6px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}
.td {
  padding: 6px 6px;
  text-align: center;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Minimal utility fallbacks (if Tailwind not present) */
.bg-dark { background: #0b0d12; }
.bg-secondary { background: #6738e4; }
.bg-white\/10 { background: rgba(255,255,255,0.08); }
.text-white { color: #fff; }
.text-white\/90 { color: rgba(255,255,255,.9); }
.rounded { border-radius: 4px; }
.text-left { text-align: left; }
.text-center { text-align: center; }
.font-semibold { font-weight: 600; }
/* Force real table layout (prevents stacked rows/cells) */
.rates-table { display: table; width: 100%; }
.rates-table thead { display: table-header-group; }
.rates-table tbody { display: table-row-group; }
.rates-table tr { display: table-row; }
.rates-table th, 
.rates-table td { display: table-cell; }

/* Keep your existing spacing/width rules */
.rates-table {
  border-collapse: separate;
  border-spacing: 6px 6px;
  table-layout: fixed;
}

/* Optional: ensure the table can’t get squeezed below its design width */
.imac-inner { min-width: 320px; } /* adjust if needed */
/* Full‑screen table overrides */
/* Make the iMac device fill the viewport */
.device.device-imac {
       /* full window height */
  max-height: 100vh;
}

/* Let the inner frame and content consume that height */
.device-frame {
  height: 100%;
}

.device-content {
  height: 100%;
  max-height: 100%;
  border-radius: 6px;     /* keep your rounded corners */
  overflow: hidden;       /* clip to the device viewport */
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

/* Constrain the inner container and allow scrolling inside */
.imac-inner {
  width: 100%;
  max-width: none;        /* allow full width inside device */
  height: 100%;
  max-height: 100%;
  padding: 12px 16px;
  overflow: auto;         /* scroll inside the iMac, not the page */
}

/* Optional: let the table try to fill the height;
   the .imac-inner scroll will prevent spillover */
.rates-table {
  width: 100%;
  height: 100%;
  table-layout: fixed;
}

/* Keep header visible while scrolling (optional) */
.rates-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  /* ensure a solid background for sticky header */
  background: #6738e4; /* matches .bg-secondary */
}

/* Wrapping so cells use available width nicely */
.th, .td {
  white-space: normal;
  text-overflow: clip;
}
/* Kill the baseline gap caused by inline-block devices */
:global(.device.device-imac) {
  display: block !important;      /* don't be inline-block */ /* just in case */
  line-height: 0 !important;      /* remove baseline space */
  font-size: 0 !important;        /* belt-and-suspenders for inline gaps */
  margin-bottom: 0 !important;    /* reclaim any reserved space */
  padding-bottom: 0 !important;
}

/* If the stand uses pseudo-elements, make sure they're gone */
:global(.device.device-imac::before),
:global(.device.device-imac::after) {
  content: none !important;
  display: none !important;
}

/* Optional: ensure the page itself isn't adding a gap */
:global(html, body) { margin: 0; }

/* Bigger, cleaner numbers only in the data cells */
.rates-table tbody td:nth-child(2),
.rates-table tbody td:nth-child(3) {
  font-size: clamp(12px, 1.6vw, 18px); /* responsive */
  line-height: 1.2;
  font-variant-numeric: tabular-nums;  /* aligns digits neatly */
  letter-spacing: 0.2px;
}
/* Header text a bit larger */
.rates-table thead th {
  font-size: clamp(12px, 1.7vw, 16px);
  line-height: 1.2;
}

/* First (Term) column larger */
.rates-table tbody td:first-child {
  font-size: clamp(12px, 1.6vw, 16px);
  line-height: 1.2;
}

/* (Optional) if you want the whole table up one notch as a base */
.rates-table {
  font-size: clamp(12px, 1.4vw, 14px); /* base size */
}
 /* Clickable wrapper */
.imac-click {
  outline: none; /* no outline border */
  -webkit-tap-highlight-color: transparent;
}

/* Smooth animation without shadows */
.imac-click .device.device-imac,
.imac-click .device-frame,
.imac-click .device-content {
  transition: transform 180ms ease, filter 180ms ease;
  transform-origin: center center;
  will-change: transform, filter;
  box-shadow: none !important; /* ensure no shadows */
  border: 0;                   /* ensure no borders */
}

/* Hover / focus: pop slightly, no shadow/border */
.imac-click:hover .device.device-imac,
.imac-click:focus-visible .device.device-imac {
  transform: scale(1.02);
  filter: brightness(1.03);
  box-shadow: none !important;
}

/* Press feedback: subtle press, still no shadow/border */
.imac-click:active .device.device-imac {
  transform: scale(0.995);
  filter: brightness(0.98);
  box-shadow: none !important;
}

/* Remove any focus ring/border on the frame */
.imac-click:focus-visible .device-frame {
  box-shadow: none !important;
  border: 0 !important;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .imac-click .device.device-imac,
  .imac-click .device-frame,
  .imac-click .device-content {
    transition: none;
  }
}

</style>
