<template>
  <main class="min-h-screen text-white pt-[150px] px-4 sm:px-6 pb-24 relative">
    <div class="fixed inset-0 -z-10 bg-page-gradient" />

    <div class="max-w-2xl mx-auto space-y-10">

      <!-- Header -->
      <div class="text-center space-y-3">
        <p class="text-xs font-semibold uppercase tracking-widest text-secondary">Getting started</p>
        <h1 class="text-4xl font-bold">Fund your Cadena wallet</h1>
        <p class="text-white/60 text-lg leading-relaxed">
          To borrow against your Bitcoin, you need to send BTC to your Cadena deposit address.
          Follow the steps below — it takes about 5 minutes.
        </p>
      </div>

      <!-- Steps -->
      <div class="space-y-4">

        <!-- Step 1 -->
        <div class="step-card">
          <div class="step-num">1</div>
          <div class="step-body">
            <h2 class="step-title">Download the Cadena Signer App</h2>
            <p class="step-desc">
              The Signer App is a free, lightweight app that holds your Bitcoin keys and generates your deposit address. Your keys never leave your phone.
            </p>
            <div class="flex items-start gap-6 pt-3 flex-wrap">
              <!-- iOS -->
              <div class="flex flex-col items-center gap-2">
                <div class="p-2 bg-white rounded-xl">
                  <img v-if="appStoreQR" :src="appStoreQR" alt="App Store QR" class="w-24 h-24 block" />
                  <div v-else class="w-24 h-24 bg-gray-100 animate-pulse rounded" />
                </div>
                <div style="height:52px;display:flex;align-items:center">
                  <a href="https://apps.apple.com/us/app/cadena-bitcoin/id6753348211" target="_blank" rel="noopener" style="display:inline-block;line-height:0">
                    <img src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1760227200" alt="Download on the App Store" style="height:40px;width:auto;object-fit:contain" />
                  </a>
                </div>
              </div>
              <!-- Android -->
              <div class="flex flex-col items-center gap-2">
                <div class="p-2 bg-white rounded-xl">
                  <img v-if="playStoreQR" :src="playStoreQR" alt="Google Play QR" class="w-24 h-24 block" />
                  <div v-else class="w-24 h-24 bg-gray-100 animate-pulse rounded" />
                </div>
                <a href="https://play.google.com/store/apps/details?id=com.cadenabitcoin.mobile.signer" target="_blank" rel="noopener" style="display:inline-block;line-height:0">
                  <img src="/img/google-play-badge.png" alt="Get it on Google Play" style="height:52px;width:auto;object-fit:contain" />
                </a>
              </div>
              <p class="text-xs text-white/40 self-center">Scan with your phone camera to download</p>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="step-card">
          <div class="step-num">2</div>
          <div class="step-body">
            <h2 class="step-title">Sign in and set up your wallet</h2>
            <p class="step-desc">Open the Signer App and sign in with your Cadena account. Then:</p>
            <ul class="step-list">
              <li>
                <span class="list-bullet">→</span>
                <span><strong class="text-white">New user:</strong> Tap <em>Create wallet</em>. The app generates a 12-word seed phrase — write it down and store it somewhere safe. This is the only backup of your Bitcoin keys.</span>
              </li>
              <li>
                <span class="list-bullet">→</span>
                <span><strong class="text-white">Returning user:</strong> Tap <em>Restore wallet</em> and enter your 12-word seed phrase to recover your existing wallet.</span>
              </li>
            </ul>
            <div class="tip-box">
              <svg class="w-4 h-4 shrink-0 text-amber-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
              <p class="text-xs text-amber-100/80 leading-relaxed"><strong class="text-amber-200">Never share your seed phrase with anyone</strong>, including Cadena support. Anyone with your 12 words controls your Bitcoin.</p>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="step-card">
          <div class="step-num">3</div>
          <div class="step-body">
            <h2 class="step-title">Find your deposit address</h2>
            <p class="step-desc">
              Your Bitcoin deposit address is available in two places:
            </p>
            <ul class="step-list">
              <li>
                <span class="list-bullet">→</span>
                <span><strong class="text-white">On this website:</strong> go to your <router-link to="/my-profile" class="text-secondary underline underline-offset-2 hover:text-white transition">Profile page</router-link> and scroll to <strong class="text-white">Add Funds</strong> — you'll see your address and a QR code.</span>
              </li>
              <li>
                <span class="list-bullet">→</span>
                <span><strong class="text-white">In the Signer App:</strong> tap the <strong class="text-white">Deposit</strong> button to view your address and QR code directly on your phone.</span>
              </li>
            </ul>
            <router-link
              to="/my-profile"
              class="inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-full border border-white/10 hover:bg-white/[0.06] text-xs font-semibold text-white transition"
            >
              Go to my profile →
            </router-link>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="step-card">
          <div class="step-num">4</div>
          <div class="step-body">
            <h2 class="step-title">Send Bitcoin to your address</h2>
            <p class="step-desc">
              From your exchange (Coinbase, Kraken, River, etc.) or personal wallet, initiate a Bitcoin withdrawal to your Cadena deposit address. Make sure you're sending on the <strong class="text-white">Bitcoin mainnet</strong> — not Ethereum, not Lightning, not Testnet.
            </p>
            <ul class="step-list">
              <li><span class="list-bullet">·</span><span><strong class="text-white">Minimum:</strong> 0.001 BTC recommended to cover network fees and meet collateral requirements.</span></li>
              <li><span class="list-bullet">·</span><span><strong class="text-white">Confirmations:</strong> Your balance will appear after 1–3 Bitcoin network confirmations (typically 10–30 minutes).</span></li>
              <li><span class="list-bullet">·</span><span><strong class="text-white">Double-check the address</strong> before sending. Bitcoin transactions are irreversible.</span></li>
            </ul>
          </div>
        </div>

        <!-- Step 5 -->
        <div class="step-card">
          <div class="step-num">5</div>
          <div class="step-body">
            <h2 class="step-title">Create your first loan</h2>
            <p class="step-desc">
              Once your wallet balance shows up, head to the
              <router-link to="/allocate_liquidity" class="text-secondary underline underline-offset-2 hover:text-white transition">BTCUSD market</router-link>
              to create a Bitcoin-backed loan. Select your collateral amount, loan term, and interest rate — the DLC contract is set up automatically on-chain.
            </p>
            <router-link
              to="/allocate_liquidity"
              class="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-sm font-semibold text-white transition"
            >
              Go to BTCUSD market
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
            </router-link>
          </div>
        </div>

      </div>

      <!-- FAQ strip -->
      <div class="space-y-3 pt-4">
        <h2 class="text-sm font-semibold uppercase tracking-widest text-white/40">Common questions</h2>

        <details class="faq-item">
          <summary class="faq-q">What if I already have a wallet and 12-word seed phrase?</summary>
          <p class="faq-a">In the Signer App, tap <em>Restore wallet</em> and enter your existing 12-word phrase. Your Bitcoin keys and address will be restored exactly as before.</p>
        </details>

        <details class="faq-item">
          <summary class="faq-q">Can I send from an exchange?</summary>
          <p class="faq-a">Yes. Go to your exchange's withdrawal page, paste your Cadena deposit address, and send BTC. Make sure the network is <strong class="text-white">Bitcoin (BTC)</strong> — not ERC-20 or any other chain.</p>
        </details>

        <details class="faq-item">
          <summary class="faq-q">How long does it take to arrive?</summary>
          <p class="faq-a">On-chain Bitcoin transactions require 1–3 confirmations, which typically takes 10–30 minutes depending on network congestion and the fee you pay.</p>
        </details>

        <details class="faq-item">
          <summary class="faq-q">Is Cadena custodial?</summary>
          <p class="faq-a">No. Cadena is fully non-custodial. Your private keys live only on your phone in the Signer App. Cadena cannot access or move your Bitcoin without your cryptographic signature.</p>
        </details>
      </div>

      <!-- CTA -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <router-link to="/my-profile" class="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/10 hover:bg-white/[0.06] text-sm font-semibold text-white transition">
          View my deposit address
        </router-link>
        <a href="https://calendly.com/cadenabitcoin-info/30min" target="_blank" rel="noopener" class="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-secondary hover:bg-secondary/80 text-sm font-semibold text-white transition">
          Book a call with our team
        </a>
      </div>

    </div>
  </main>
  <TheFooter />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'
import TheFooter from '../components/TheFooter.vue'

const APP_STORE_URL  = 'https://apps.apple.com/us/app/cadena-bitcoin/id6753348211'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.cadenabitcoin.mobile.signer'

const appStoreQR = ref<string | null>(null)
const playStoreQR = ref<string | null>(null)

onMounted(async () => {
  const opts = { width: 192, margin: 1, color: { dark: '#000000', light: '#ffffff' } }
  ;[appStoreQR.value, playStoreQR.value] = await Promise.all([
    QRCode.toDataURL(APP_STORE_URL, opts),
    QRCode.toDataURL(PLAY_STORE_URL, opts),
  ])
})
</script>

<style scoped>
.step-card {
  display: flex;
  gap: 16px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.025);
}

.step-num {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(103,56,227,0.2);
  border: 1px solid rgba(103,56,227,0.4);
  color: #a78bfa;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.step-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; }

.step-title { font-size: 17px; font-weight: 700; color: #fff; }

.step-desc { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.65; }

.step-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.step-list li {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: rgba(255,255,255,0.65);
  line-height: 1.6;
}

.list-bullet {
  color: rgba(103,56,227,0.7);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2px;
}

.tip-box {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(251,191,36,0.07);
  border: 1px solid rgba(251,191,36,0.18);
}

.faq-item {
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.02);
  overflow: hidden;
}

.faq-q {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  padding: 14px 18px;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  user-select: none;
  transition: color 0.15s;
}

.faq-q:hover { color: #fff; }

.faq-q::after {
  content: '+';
  font-size: 18px;
  color: rgba(103,56,227,0.7);
  flex-shrink: 0;
  transition: transform 0.2s;
}

details[open] .faq-q::after { content: '−'; }

.faq-a {
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  line-height: 1.65;
  padding: 0 18px 14px;
  margin: 0;
}
</style>
