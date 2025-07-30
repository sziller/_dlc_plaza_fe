<template>
  <div class="device device-imac mx-auto">
    <div class="device-frame">
      <div class="device-content bg-dark text-white flex items-center justify-center">
        <!-- Constrained inner area so the table can't sprawl -->
        <div class="imac-inner">
          <table class="rates-table">
            <colgroup>
              <!-- Term | 50% LTV (2 cols) | spacer | 80% LTV (2 cols) -->
              <col style="width: 26%">
              <col style="width: 16%">
              <col style="width: 16%">
              <col style="width: 4%">
              <col style="width: 16%">
              <col style="width: 16%">
            </colgroup>

            <thead>
              <tr>
                <th class="th text-left">Term</th>
                <th class="th text-center bg-secondary rounded">50% LTV</th>
                <th class="th text-center bg-secondary rounded">—</th>
                <th class="th"></th>
                <th class="th text-center bg-secondary rounded">80% LTV</th>
                <th class="th text-center bg-secondary rounded">—</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="term in terms" :key="term.label">
                <td class="td text-left font-semibold">{{ term.label }}</td>
                <td class="td text-center bg-white/10 rounded">{{ term.ltv50a }}</td>
                <td class="td text-center bg-white/10 rounded">{{ term.ltv50b }}</td>
                <td class="td spacer"></td>
                <td class="td text-center bg-white/10 rounded">{{ term.ltv80a }}</td>
                <td class="td text-center bg-white/10 rounded">{{ term.ltv80b }}</td>
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
</template>

<script setup>
const terms = [
  { label: '1 Month',  ltv50a: '5.1%', ltv50b: '5.2%', ltv80a: '9.8%',  ltv80b: '9.9%' },
  { label: '3 Months', ltv50a: '6.2%', ltv50b: '6.3%', ltv80a: '11.2%', ltv80b: '13.3%' },
  { label: '6 Months', ltv50a: '7.2%', ltv50b: '7.5%', ltv80a: '*',    ltv80b: '*' },
  { label: '1 Year',   ltv50a: '8.0%', ltv50b: '8.2%', ltv80a: '*',    ltv80b: '*' },
]
</script>

<style scoped>
/* Keep within the iMac screen */
.device-content {
  min-height: 220px;
  max-height: 300px;
  border-radius: 6px;
  overflow: hidden;
}

/* Hard cap the table width so cells don't fill the whole screen */
.imac-inner {
  max-width: 520px;          /* <— adjust to your iMac screen width */
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

/* Tiny spacer column */
.spacer { padding: 0; background: transparent; }

/* Minimal utility fallbacks (if Tailwind not present) */
.bg-dark { background: #0b0d12; }
.bg-secondary { background: #263549; }
.bg-white\/10 { background: rgba(255,255,255,0.08); }
.text-white { color: #fff; }
.text-white\/90 { color: rgba(255,255,255,.9); }
.rounded { border-radius: 4px; }
.text-left { text-align: left; }
.text-center { text-align: center; }
.font-semibold { font-weight: 600; }
</style>
