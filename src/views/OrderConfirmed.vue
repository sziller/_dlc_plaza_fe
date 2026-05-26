<template>
  <div class="oc-page">
    <div class="oc-container">

      <div class="oc-check">
        <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="oc-check-circle" cx="26" cy="26" r="24" stroke="#f7931a" stroke-width="2"/>
          <path class="oc-check-mark" d="M15 26.5L22.5 34L37 19" stroke="#f7931a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <h1 class="oc-title">Order confirmed</h1>

      <p class="oc-lead">
        Your copy of <em>Endgame</em> is on its way to print.<br />
        You'll get a shipping confirmation by email once it's on its way.
      </p>

      <p class="oc-note">
        Questions? <a href="mailto:noah@cadenabitcoin.com">noah@cadenabitcoin.com</a>
      </p>

      <div class="oc-actions">
        <RouterLink to="/endgame" class="oc-btn-primary">Back to Endgame</RouterLink>
        <a href="/endgame.pdf" class="oc-btn-secondary">Download PDF</a>
      </div>

    </div>
    <TheFooter />
  </div>
</template>

<script setup>
import TheFooter from '../components/TheFooter.vue'
</script>

<style scoped>
.oc-page {
  background: #081123;
  color: #f0f0f0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.oc-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 120px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Animated checkmark */
.oc-check {
  width: 72px;
  height: 72px;
  margin-bottom: 32px;
}

.oc-check svg {
  width: 100%;
  height: 100%;
}

.oc-check-circle {
  stroke-dasharray: 151;
  stroke-dashoffset: 151;
  animation: draw-circle 0.5s ease forwards;
}

.oc-check-mark {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: draw-check 0.35s ease forwards 0.45s;
}

@keyframes draw-circle {
  to { stroke-dashoffset: 0; }
}

@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}

.oc-title {
  font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.oc-lead {
  font-size: 17px;
  color: #999;
  line-height: 1.7;
  margin-bottom: 32px;
}

.oc-lead em {
  color: #f0f0f0;
  font-style: italic;
}

.oc-note {
  font-size: 14px;
  color: #555;
  margin-bottom: 40px;
}

.oc-note a {
  color: #f7931a;
  text-decoration: none;
}

.oc-note a:hover {
  text-decoration: underline;
}

.oc-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.oc-btn-primary {
  display: inline-block;
  padding: 13px 24px;
  background: #f7931a;
  color: #000;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s, transform 0.1s;
}

.oc-btn-primary:hover {
  background: #f5a623;
  transform: translateY(-1px);
}

.oc-btn-secondary {
  display: inline-block;
  padding: 13px 24px;
  background: transparent;
  color: #f0f0f0;
  border: 1px solid #2e3a4e;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.15s;
}

.oc-btn-secondary:hover {
  border-color: #666;
}
</style>
