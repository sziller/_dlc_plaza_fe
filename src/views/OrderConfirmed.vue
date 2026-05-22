<template>
  <div class="oc-page">
    <div class="oc-container">
      <div class="oc-icon">✓</div>
      <h1 class="oc-title">Order confirmed</h1>
      <p class="oc-lead">
        Your Bitcoin payment has been received. Your copy of <em>Endgame</em> is being sent to print.
      </p>

      <div class="oc-card">
        <div class="oc-step">
          <div class="oc-step-num">1</div>
          <div class="oc-step-text">
            <strong>Payment received</strong><br />
            Your invoice has been settled on-chain.
          </div>
        </div>
        <div class="oc-step">
          <div class="oc-step-num">2</div>
          <div class="oc-step-text">
            <strong>Print job created</strong><br />
            Lulu is printing and binding your copy.
          </div>
        </div>
        <div class="oc-step">
          <div class="oc-step-num">3</div>
          <div class="oc-step-text">
            <strong>Shipping notification</strong><br />
            You'll receive tracking information by email once your order ships.
          </div>
        </div>
      </div>

      <p class="oc-note">
        Questions? Email <a href="mailto:noah@cadenabitcoin.com">noah@cadenabitcoin.com</a> with your order details.
      </p>

      <div class="oc-actions">
        <RouterLink to="/endgame" class="oc-btn-primary">← Back to Endgame</RouterLink>
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
  max-width: 560px;
  margin: 0 auto;
  padding: 96px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.oc-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(247, 147, 26, 0.15);
  border: 2px solid #f7931a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #f7931a;
  margin-bottom: 28px;
}

.oc-title {
  font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.oc-lead {
  font-size: 17px;
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 36px;
  max-width: 420px;
}
.oc-lead em { color: #f0f0f0; font-style: italic; }

.oc-card {
  background: #0d1a2e;
  border: 1px solid #2e3a4e;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
  margin-bottom: 28px;
}

.oc-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.oc-step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f7931a;
  color: #000;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.oc-step-text {
  font-size: 15px;
  line-height: 1.6;
  color: #ccc;
}
.oc-step-text strong { color: #f0f0f0; font-weight: 600; }

.oc-note {
  font-size: 14px;
  color: #666;
  margin-bottom: 36px;
}
.oc-note a { color: #f7931a; text-decoration: none; }
.oc-note a:hover { text-decoration: underline; }

.oc-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.oc-btn-primary {
  display: inline-block;
  padding: 13px 22px;
  background: #f7931a;
  color: #000;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s, transform 0.1s;
}
.oc-btn-primary:hover { background: #f5a623; transform: translateY(-1px); }

.oc-btn-secondary {
  display: inline-block;
  padding: 13px 22px;
  background: transparent;
  color: #f0f0f0;
  border: 1px solid #2e3a4e;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
}
.oc-btn-secondary:hover { border-color: #888; background: #0d1a2e; }
</style>
