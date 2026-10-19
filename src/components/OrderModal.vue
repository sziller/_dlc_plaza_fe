<!-- OrderModal.vue -->
<template>
  <div
    class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    @click.self="closeSelf"
  >
    <div
      class="bg-dark text-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-6 relative overflow-y-auto max-h-[90vh]"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="descId"
      :aria-busy="loading || allocationLoading ? 'true' : 'false'"
      ref="dialogRef"
      @keydown.tab.prevent="onTab"
      @keydown.esc.prevent="closeSelf"
    >
      <!-- Close Button -->
      <button
        type="button"
        @click="closeSelf"
        :disabled="loading || allocationLoading"
        class="absolute top-4 right-4 text-white hover:text-secondary text-xl font-bold disabled:opacity-50 z-10"
        aria-label="Close dialog"
      >
        ×
      </button>

      <!-- Step 1: Order Entry -->
      <div v-if="step === 1">
        <h2 :id="titleId" class="text-2xl font-bold text-center mb-4">
          Leave an order to {{ actionType }} Bitcoin
        </h2>

        <div
          v-if="notice?.text"
          :class="notice?.type === 'error' ? 'bg-red-500/15 border-red-500/40' : 'bg-green-500/15 border-green-500/40'"
          class="border rounded p-3 text-sm mb-3"
          role="status"
          aria-live="polite"
        >
          {{ notice.text }}
        </div>

        <div v-if="marketIsZeroish">
          <label class="block mb-1 font-semibold">Order Type</label>
          <div class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 flex items-center justify-between">
            <span>Limit Order</span>
            <span class="text-xs px-2 py-1 rounded bg-secondary/20 border border-secondary/40">required</span>
          </div>
          <p class="text-xs text-white/70 mt-1">No market quote. Set your own rate.</p>
        </div>

        <div v-else>
          <label class="block mb-1 font-semibold">Order Type</label>
          <div class="flex space-x-2">
            <button
              type="button"
              @click="orderType = 'market'"
              :class="orderType === 'market' ? 'bg-secondary text-white' : 'bg-white/10 text-white/70'"
              class="flex-1 px-4 py-2 rounded font-medium transition-colors"
            >
              Market Order
            </button>
            <button
              type="button"
              @click="orderType = 'limit'"
              :class="orderType === 'limit' ? 'bg-secondary text-white' : 'bg-white/10 text-white/70'"
              class="flex-1 px-4 py-2 rounded font-medium transition-colors"
            >
              Limit Order
            </button>
          </div>
          <p class="text-xs text-white/70 mt-1">
            Market executes at current rate. Limit lets you adjust relative to market.
          </p>
        </div>

        <!-- Rate Control -->
        <div class="mt-4">
          <label class="block mb-1 font-semibold">Rate for term</label>

          <div v-if="orderType === 'market'" class="w-full px-4 py-2 rounded bg-white/10 border border-white/20">
            {{ marketRateStr || '*' }}
          </div>

          <div v-else class="w-full rounded bg-white/10 border border-white/20 p-3">
            <div class="flex items-center justify-between gap-3">
              <button
                type="button"
                aria-label="Decrease rate"
                @click="decrement"
                @pointerdown.prevent="startHold(-1)"
                @pointerup="stopHold"
                @pointerleave="stopHold"
                :disabled="minusDisabled"
                class="px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
              >−</button>

              <input
                type="text"
                inputmode="decimal"
                pattern="[0-9]*[.]?[0-9]*"
                v-model="rateInput"
                @input="onRateInput"
                @focus="onRateFocus"
                @blur="onRateBlur"
                class="w-32 text-center px-3 py-2 rounded bg-white/10 border border-white/20 focus:outline-none font-bold tabular-nums"
                aria-label="Rate percentage"
                :aria-describedby="rateHelpId"
              />

              <button
                type="button"
                aria-label="Increase rate"
                @click="increment"
                @pointerdown.prevent="startHold(1)"
                @pointerup="stopHold"
                @pointerleave="stopHold"
                :disabled="plusDisabled"
                class="px-3 py-2 rounded bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
              >+</button>
            </div>
            <p :id="rateHelpId" class="text-xs text-white/70 mt-2 text-center">
              {{ marketIsZeroish
                ? 'No market quote. Choose your rate.'
                : (isBorrower ? 'You can move down or back up to market.' : 'You can move up or back down to market.')
              }}
              Tick: {{ STEP.toFixed(RATE_DECIMALS) }}%.
            </p>

            <div class="mt-3 text-center">
              <div class="text-xs text-white/70">Annualized yield</div>
              <div class="mt-1 font-semibold tabular-nums">
                {{ annualizedYield(termRateStr, termDays) }}
              </div>
            </div>
          </div>

          <div v-if="orderType === 'market'" class="mt-3 text-center">
            <div class="text-xs text-white/70">Annualized yield</div>
            <div class="mt-1 font-semibold tabular-nums">
              {{ annualizedYield(termRateStr, termDays) }}
            </div>
          </div>
        </div>

        <!-- Review Button -->
        <div class="text-center mt-6">
          <button
            type="button"
            @click="handleReviewOrder"
            :disabled="loading"
            class="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review Order
          </button>
        </div>
      </div>

      <!-- Step 2: Review + Confirm (or Funding Screen) -->
      <div v-else-if="step === 2">

        <!-- Funding Screen: shown when insufficient collateral -->
        <div v-if="showFundingScreen" class="space-y-5">
          <h2 :id="titleId" class="text-2xl font-bold text-center mb-2">Insufficient Collateral</h2>

          <p class="text-sm text-white/70 text-center">
            Your wallet doesn't have enough BTC to complete this order.
          </p>

          <!-- Shortfall breakdown -->
          <div class="p-4 rounded-lg bg-secondary/10 border border-secondary/30 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-white/70">Collateral required</span>
              <span class="font-mono text-white">{{ Number.isFinite(computedCollateralBtc) ? formatBtcValue(computedCollateralBtc) : '0' }} BTC</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-white/70">Your balance</span>
              <span class="font-mono text-white">{{ formatSatsToBtc(allocationResult?.available_btc_liquidity ?? 0) }} BTC</span>
            </div>
            <div class="border-t border-white/10 pt-2 flex justify-between text-sm font-semibold">
              <span class="text-white/70">Shortfall</span>
              <span class="font-mono text-white">{{ formatSatsToBtc(collateralShortfall) }} BTC</span>
            </div>
          </div>

          <!-- Insufficient balance notice (shown after failed recheck) -->
          <div
            v-if="notice?.text && notice?.type === 'error'"
            class="bg-red-500/15 border border-red-500/40 rounded p-3 text-sm text-white/90"
            role="status"
            aria-live="polite"
          >
            {{ notice.text }}
          </div>

          <!-- Deposit instructions -->
          <div class="text-center">
            <p class="text-sm text-white/80 mb-3">Send BTC to your Cadena address:</p>

            <!-- QR Code -->
            <div v-if="topupLoading" class="flex justify-center mb-3">
              <div class="bg-white/5 rounded-lg p-3 w-full max-w-[260px] aspect-square overflow-hidden flex items-center justify-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="h-6 w-6 rounded-full border-3 border-white/30 border-t-white animate-spin"></div>
                  <span class="text-sm text-white/60">Loading address…</span>
                </div>
              </div>
            </div>
            <div v-else-if="qrDataUri" class="flex justify-center mb-3">
              <div class="bg-white rounded-lg p-3 w-full max-w-[260px] aspect-square overflow-hidden flex items-center justify-center">
                <img :src="qrDataUri" alt="Deposit QR code" class="w-full h-full block object-contain" />
              </div>
            </div>

            <!-- Address + Copy -->
            <div v-if="topupLoading" class="bg-white/5 border border-white/10 rounded-lg p-3">
              <div class="flex items-center gap-2 justify-center">
                <span class="text-xs text-white/50">Loading address…</span>
              </div>
            </div>
            <div v-else-if="topupAddress" class="bg-white/5 border border-white/10 rounded-lg p-3">
              <div class="flex items-center gap-2">
                <p class="text-xs text-white font-mono break-all select-all flex-1">{{ topupAddress }}</p>
                <button
                  type="button"
                  @click="copyAddress"
                  class="shrink-0 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
                  :class="addressCopied ? 'text-green-400' : 'text-white'"
                >
                  {{ addressCopied ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>

            <!-- Error state: both endpoints failed -->
            <div v-if="!topupLoading && !qrDataUri && !topupAddress && topupError" class="bg-red-500/15 border border-red-500/40 rounded-lg p-3">
              <p class="text-sm text-white/90">{{ topupError }}</p>
            </div>
          </div>

          <!-- Check Balance & Continue -->
          <button
            type="button"
            @click="handleRetryOrder"
            :disabled="loading"
            class="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Balance &amp; Continue
          </button>

          <!-- Cancel -->
          <div class="text-center">
            <button
              type="button"
              @click="closeSelf"
              class="text-white/60 hover:text-white text-sm underline"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- Auth Prompt: shown when unauthenticated user tries to confirm -->
        <div v-else-if="showAuthPrompt" class="space-y-5 text-center">
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center">
              <svg class="w-8 h-8 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
          </div>

          <h2 :id="titleId" class="text-2xl font-bold">You're One Step Away</h2>
          <p class="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
            Your order is ready to go. Log in or create a free account to lock in your rate and complete your {{ actionType?.toLowerCase() }} order.
          </p>

          <div class="flex flex-col gap-3 pt-2">
            <router-link
              to="/login"
              class="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
              @click="closeSelf"
            >
              Log In
            </router-link>
            <router-link
              to="/register"
              class="w-full border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
              @click="closeSelf"
            >
              Create Free Account
            </router-link>
          </div>

          <p class="text-white/50 text-xs">No liqudiations · Bitcoin native · Globally accessible</p>
        </div>

        <!-- Normal Review content (hidden when funding screen is active) -->
        <template v-else>
        <h2 :id="titleId" class="text-2xl font-bold text-center mb-4">Review Your Order</h2>

        <div
          v-if="notice?.text"
          :class="notice?.type === 'error' ? 'bg-red-500/15 border-red-500/40' : 'bg-green-500/15 border-green-500/40'"
          class="border rounded p-3 text-sm mb-3"
          role="status"
          aria-live="polite"
        >
          {{ notice.text }}
        </div>

        <ul class="space-y-2 text-sm text-white/90">
          <li><span class="font-semibold text-white">Role:</span> {{ actionType }}</li>
          <li><span class="font-semibold text-white">Amount:</span> {{ formatAmountDisplay(amountBtc, amountUsd) }}</li>
          <!-- FIAT → BTC conversion breakdown -->
          <li v-if="fiatToBtcBreakdown" class="text-xs text-white/60 pl-4 -mt-1">
            {{ fiatToBtcBreakdown.fiatAmount.toLocaleString('en-US', { style: 'currency', currency: fiatLabel, maximumFractionDigits: 0 }) }}
            ÷ {{ fiatToBtcBreakdown.oraclePrice.toLocaleString('en-US', { style: 'currency', currency: fiatLabel, maximumFractionDigits: 0 }) }}/BTC
            = {{ formatBtcValue(fiatToBtcBreakdown.btcResult) }} BTC
          </li>
          <li><span class="font-semibold text-white">Loan Duration:</span> {{ loanDuration }}</li>
          <li><span class="font-semibold text-white">LTV:</span> {{ ltvDisplayStr }}</li>
          <li><span class="font-semibold text-white">Price Feed:</span> {{ oracleDisplayStr }}</li>
          <li><span class="font-semibold text-white">Interest Rate for Term:</span> {{ reviewTermRateStr }}</li>
          <li><span class="font-semibold text-white">Cadena Fee:</span> {{ displayFee }}</li>
          <li><span class="font-semibold text-white">Annualized Yield:</span> {{ reviewAnnualizedYieldWithFee }}</li>
        </ul>

        <!-- Collateral Breakdown Block -->
        <div v-if="allocationLoading" class="flex flex-col items-center gap-3 py-6">
          <div class="h-6 w-6 rounded-full border-3 border-white/30 border-t-white animate-spin"></div>
          <div class="text-sm text-white/80">Calculating collateral…</div>
        </div>
        <div v-else class="mt-4 space-y-3">
          <!-- Borrower breakdown -->
          <template v-if="isBorrower">
            <div class="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden text-sm">
              <div class="px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span class="text-xs font-bold uppercase tracking-widest text-white/40">You Lock (Borrower Collateral)</span>
              </div>
              <div class="divide-y divide-white/[0.05]">
                <div class="flex justify-between items-center px-4 py-2.5">
                  <span class="text-white/60">Loan principal</span>
                  <span class="font-semibold tabular-nums text-white">{{ usdFmt(breakdownPrincipalUsd) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-2.5">
                  <span class="text-white/60">2× Interest buffer <span class="text-white/35 text-xs">({{ usdFmt(breakdownInterestUsd) }} × 2)</span></span>
                  <span class="font-semibold tabular-nums text-white">{{ usdFmt(breakdownInterestUsd * 2) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-2.5">
                  <span class="text-white/60">1% Cadena fee</span>
                  <span class="font-semibold tabular-nums text-white">{{ usdFmt(breakdownFeeUsd) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3 bg-secondary/[0.08]">
                  <span class="font-bold text-white">Your total BTC locked</span>
                  <div class="text-right">
                    <div class="font-black text-white tabular-nums">
                      {{ Number.isFinite(breakdownTotalBtc) ? formatBtcValue(breakdownTotalBtc) : '—' }} BTC
                    </div>
                    <div v-if="btcPrice && Number.isFinite(breakdownTotalBtc)" class="text-xs text-white/50 tabular-nums">
                      = {{ usdFmt(breakdownTotalBtc * btcPrice) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="allocationResult" class="flex justify-between items-center text-xs px-1">
              <span class="text-white/40">Available in your wallet</span>
              <span class="tabular-nums" :class="isCollateralCovered ? 'text-green-400' : 'text-red-400'">
                {{ formatSatsToBtc(allocationResult.available_btc_liquidity) }} BTC
                <span v-if="isCollateralCovered"> ✓</span>
              </span>
            </div>
          </template>

          <!-- Lender breakdown -->
          <template v-else>
            <div class="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden text-sm">
              <div class="px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span class="text-xs font-bold uppercase tracking-widest text-white/40">You Lock (Lender Collateral)</span>
              </div>
              <div class="divide-y divide-white/[0.05]">
                <div class="flex justify-between items-center px-4 py-2.5">
                  <span class="text-white/60">USD deployed</span>
                  <span class="font-semibold tabular-nums text-white">{{ usdFmt(breakdownPrincipalUsd) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-2.5">
                  <span class="text-white/60">Yield you earn</span>
                  <span class="font-semibold tabular-nums text-green-400">+{{ usdFmt(breakdownInterestUsd) }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3 bg-secondary/[0.08]">
                  <span class="font-bold text-white">Your BTC deployed</span>
                  <div class="text-right">
                    <div class="font-black text-white tabular-nums">
                      {{ Number.isFinite(breakdownTotalBtc) ? formatBtcValue(breakdownTotalBtc) : '—' }} BTC
                    </div>
                    <div v-if="btcPrice && Number.isFinite(breakdownTotalBtc)" class="text-xs text-white/50 tabular-nums">
                      = {{ usdFmt(breakdownTotalBtc * btcPrice) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="allocationResult" class="flex justify-between items-center text-xs px-1">
              <span class="text-white/40">Available in your wallet</span>
              <span class="tabular-nums" :class="isCollateralCovered ? 'text-green-400' : 'text-red-400'">
                {{ formatSatsToBtc(allocationResult.available_btc_liquidity) }} BTC
                <span v-if="isCollateralCovered"> ✓</span>
              </span>
            </div>
          </template>
        </div>

        <div class="flex justify-end items-center mt-6">
          <button
            type="button"
            @click="submitOrder"
            :disabled="loading || allocationLoading"
            class="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
        </template>
      </div>

      <!-- Result Screen -->
      <div v-else-if="showResult">
        <h2 :id="titleId" class="text-2xl font-bold text-center mb-4">Order Submitted</h2>

        <div class="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
          <svg class="w-5 h-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          <span class="text-sm text-green-400 font-semibold">Your order has been submitted successfully</span>
        </div>

        <!-- Insufficient collateral: deposit instructions -->
        <div v-if="!isCollateralCovered" class="space-y-4">
          <div class="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
            <p class="text-sm font-semibold text-white mb-2">Send BTC to complete your order</p>
            <p class="text-xs text-white/70 mb-3">
              You need to deposit <span class="font-semibold text-white">{{ formatSatsToBtc(collateralShortfall) }} BTC</span> to cover your collateral requirement.
            </p>

            <!-- QR Code -->
            <div v-if="topupQrSvg" class="flex justify-center mb-3">
              <div class="bg-white rounded-lg p-2 inline-block" v-html="topupQrSvg"></div>
            </div>

            <!-- Address -->
            <div v-if="topupAddress" class="bg-white/5 border border-white/10 rounded-lg p-3">
              <p class="text-xs text-white/60 mb-1">Deposit address</p>
              <p class="text-xs text-white font-mono break-all select-all">{{ topupAddress }}</p>
            </div>
          </div>

          <button
            type="button"
            @click="$emit('recheckBalance')"
            :disabled="loading"
            class="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Balance &amp; Continue
          </button>
        </div>

        <!-- Sufficient collateral + paired -->
        <div v-else-if="isPaired" class="space-y-4">
          <div class="p-4 rounded-lg bg-secondary/10 border border-secondary/30 text-center">
            <p class="text-sm font-semibold text-white">Sign in to the Cadena app to complete your transaction</p>
          </div>
        </div>

        <!-- Sufficient collateral + not paired -->
        <div v-else class="space-y-4">
          <div class="p-4 rounded-lg bg-secondary/10 border border-secondary/30 text-center">
            <p class="text-sm font-semibold text-white mb-2">Download the Cadena app and sign your transaction</p>
            <a
              href="https://cadenabitcoin.com/register?step=3"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block mt-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Get the Cadena App
            </a>
          </div>
        </div>

        <!-- Close button -->
        <div class="text-center mt-6">
          <button
            type="button"
            @click="closeSelf"
            class="text-white hover:text-secondary text-sm underline"
          >
            Close
          </button>
        </div>
      </div>

      <!-- Loading overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl"
        aria-hidden="true"
      >
        <div class="flex flex-col items-center gap-3">
          <div class="h-8 w-8 rounded-full border-4 border-white/30 border-t-white animate-spin"></div>
          <div class="text-sm text-white/80">Submitting…</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, toRefs } from 'vue'
import { isSignerAuthCode } from '../lib/authCode'
import { formatBtcValue, satsForm } from '../functions/amount_formatting'

const props = defineProps({
  rate: String,
  actionType: String,
  termDays: { type: Number, default: 90 },
  loading: { type: Boolean, default: false },
  notice:  { type: Object,  default: () => ({ type: '', text: '' }) },
  ltv: { type: Number, default: 0.5 },
  contractSize: { type: String, default: '0.10' },
  skipToReview: { type: Boolean, default: false },
  btcPrice: { type: Number, default: null },
  requestedUsd: { type: Number, default: null },
  allocationResult: { type: Object, default: null },
  allocationLoading: { type: Boolean, default: false },
  balanceCheckResult: { type: Object, default: null },
  balanceLoading: { type: Boolean, default: false },
  topupAddress: { type: String, default: '' },
  topupQrSvg: { type: String, default: '' },
  topupLoading: { type: Boolean, default: false },
  topupError: { type: String, default: '' },
  userAuthCode: { type: Number, default: 0 },
  showFundingScreen: { type: Boolean, default: false },
  showAuthPrompt: { type: Boolean, default: false },
  oracleId:     { type: String, default: '' },
  oracleLabel:  { type: String, default: '' },
  fiatCurrency: { type: String, default: 'USD' },
})
const emit = defineEmits(['close', 'submit', 'confirm', 'review', 'checkBalance', 'recheckBalance', 'retryOrder'])

const { loading, notice, termDays, actionType, rate, ltv, contractSize,
        allocationResult, allocationLoading, balanceCheckResult, balanceLoading, skipToReview, showFundingScreen, showAuthPrompt, topupLoading, topupError } = toRefs(props)

const orderType = ref(props.skipToReview ? 'limit' : 'market')
const step = ref(props.skipToReview ? 2 : 1)
const rateWasEdited = ref(false)
const showResult = ref(false)
const isBorrower = computed(() => (actionType.value || '').toLowerCase() === 'borrow')
const isSuccess = computed(() => notice.value?.type === 'success')
const isPaired = computed(() => isSignerAuthCode(props.userAuthCode))
const collateralShortfall = computed(() => {
  if (!allocationResult.value) return 0
  const diff = computedCollateralSats.value - allocationResult.value.available_btc_liquidity
  return Math.max(0, diff)
})
const isCollateralCovered = computed(() => !!allocationResult.value?.is_covered)

// Funding screen helpers
const addressCopied = ref(false)
const retryLoading = ref(false)
const qrDataUri = computed(() => {
  if (!props.topupQrSvg) return ''
  return 'data:image/svg+xml;base64,' + btoa(props.topupQrSvg)
})

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(props.topupAddress)
    addressCopied.value = true
    setTimeout(() => { addressCopied.value = false }, 2000)
  } catch {
    // Fallback: no-op
  }
}

async function handleRetryOrder() {
  retryLoading.value = true
  emit('retryOrder')
  // Parent will handle the async work; loading state is controlled by parent's modalLoading
  retryLoading.value = false
}

watch(notice, (n) => {
  if (n?.type === 'success' && step.value === 2) {
    showResult.value = true
    step.value = 0
  }
})

const RATE_DECIMALS = 4
const ANNUAL_DECIMALS = 2
const STEP = 0.1
const FEE_PCT = 0.01
const RATE_MIN = 0
const RATE_MAX = 25

const titleId = `order-modal-title-${Math.random().toString(36).slice(2)}`
const descId  = `order-modal-desc-${Math.random().toString(36).slice(2)}`
const rateHelpId = `order-modal-ratehelp-${Math.random().toString(36).slice(2)}`
const dialogRef = ref(null)

let lastFocus = null
const focusSel =
  'button, [href], select, textarea, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])'

onMounted(() => {
  lastFocus = document.activeElement
  document.body.classList.add('overflow-hidden')
  setTimeout(() => {
    const el = dialogRef.value
    const target = el && el.querySelector(focusSel)
    target?.focus?.()
  }, 0)
  // When skipping to review (step 2), trigger allocation immediately
  if (props.skipToReview) {
    emit('review', buildConfirmPayload())
  }
})
onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus()
})

function getFocusable() {
  const root = dialogRef.value
  if (!root) return []
  return Array.from(root.querySelectorAll(focusSel))
    .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null)
}
function onTab(e) {
  const nodes = getFocusable()
  if (!nodes.length) return
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  const active = document.activeElement
  if (e.shiftKey) {
    if (active === first || !nodes.includes(active)) last.focus()
    else nodes[nodes.indexOf(active) - 1]?.focus()
  } else {
    if (active === last || !nodes.includes(active)) first.focus()
    else nodes[nodes.indexOf(active) + 1]?.focus()
  }
}
function closeSelf() { emit('close') }

function isYearish(days) {
  const d = Number(days)
  return Number.isFinite(d) && d >= 360 && d <= 366
}
function displayDays(days) {
  return isYearish(days) ? 365 : Math.round(Number(days) || 0)
}

function toNum(rateStr) {
  const m = rateStr?.match(/([\d.]+)/)
  return m ? parseFloat(m[1]) : NaN
}
function roundRate(n) { return Number.isNaN(n) ? NaN : parseFloat(n.toFixed(RATE_DECIMALS)) }
function fmt(n) { return Number.isNaN(n) ? '*' : `${n.toFixed(RATE_DECIMALS)}%` }
function fmtReview(n) { return Number.isNaN(n) ? '*' : `${n.toFixed(2)}%` }
function formatBtc(n) {
  const x = Number(n)
  return Number.isFinite(x) ? `${formatBtcValue(x)} BTC` : '*'
}
function roundBtc(n) {
  const x = Number(n)
  return Number.isFinite(x) ? Number(x.toFixed(8)) : NaN
}
function formatSatsToBtc(sats) {
  if (!Number.isFinite(sats)) return '0'
  return satsForm(sats)
}

const marketRateNum = computed(() => {
  const n = toNum(rate.value)
  return Number.isNaN(n) ? 0 : n
})
const marketRateStr = computed(() => fmt(marketRateNum.value))
const marketIsZeroish = computed(() => {
  const raw = (rate.value || '').trim()
  const n = toNum(rate.value)
  return raw === '*' || Number.isNaN(n) || n === 0
})
watch(marketIsZeroish, (zr) => { if (zr) orderType.value = 'limit' }, { immediate: true })

const rateNum = ref(props.skipToReview ? toNum(props.rate) || marketRateNum.value : marketRateNum.value)
const rateInput = ref('')
const rateInputFocused = ref(false)

watch(orderType, () => { rateNum.value = marketRateNum.value })
watch(marketRateNum, (n) => { rateNum.value = n })
watch(rateNum, (n) => {
  if (!rateInputFocused.value) {
    rateInput.value = Number.isNaN(n) ? '' : n.toFixed(RATE_DECIMALS)
  }
}, { immediate: true })
watch(rateInput, (s) => {
  if (!rateInputFocused.value) return
  if (s.trim() === '') {
    rateNum.value = NaN
    return
  }
  const parsed = parseFloat(s)
  if (Number.isFinite(parsed)) {
    rateNum.value = roundRate(clampRate(parsed))
  }
})

function onRateInput(e) {
  let v = String(e.target.value || '')
  v = v.replace(/[^\d.]/g, '')
  const parts = v.split('.')
  if (parts.length > 1) {
    const intPart = parts.shift() || '0'
    let frac = parts.join('')
    if (frac.length > RATE_DECIMALS) frac = frac.slice(0, RATE_DECIMALS)
    v = intPart + '.' + frac
  } else {
    v = parts[0]
  }
  if (v.startsWith('.')) v = '0' + v
  rateInput.value = v
}
function onRateFocus() { rateInputFocused.value = true }
function onRateBlur() {
  rateInputFocused.value = false
  const parsed = parseFloat(rateInput.value)
  if (Number.isFinite(parsed)) {
    const clamped = roundRate(clampRate(parsed))
    rateNum.value = clamped
    rateInput.value = clamped.toFixed(RATE_DECIMALS)
  } else {
    const fallback = Number.isNaN(rateNum.value) ? 0 : rateNum.value
    const clamped = roundRate(clampRate(fallback))
    rateNum.value = clamped
    rateInput.value = clamped.toFixed(RATE_DECIMALS)
  }
}

function clampRate(val) {
  if (!Number.isFinite(val)) return Number.isNaN(val) ? NaN : val
  return Math.min(Math.max(val, RATE_MIN), RATE_MAX)
}

const plusDisabled = computed(() => {
  if (orderType.value !== 'limit') return true
  const current = Number.isFinite(rateNum.value) ? rateNum.value : 0
  return current >= RATE_MAX
})
const minusDisabled = computed(() => {
  if (orderType.value !== 'limit') return true
  const current = Number.isFinite(rateNum.value) ? rateNum.value : 0
  return current <= RATE_MIN
})
function increment() { incrementBy(STEP) }
function decrement() { decrementBy(STEP) }
function incrementBy(delta) {
  if (orderType.value !== 'limit') return
  const base = Number.isFinite(rateNum.value) ? rateNum.value : 0
  rateNum.value = Math.min(RATE_MAX, roundRate(base + delta))
  if (rateInputFocused.value || rateInput.value.trim() === '') {
    rateInput.value = rateNum.value.toFixed(RATE_DECIMALS)
  }
}
function decrementBy(delta) {
  if (orderType.value !== 'limit') return
  const base = Number.isFinite(rateNum.value) ? rateNum.value : 0
  rateNum.value = Math.max(RATE_MIN, roundRate(base - delta))
  if (rateInputFocused.value || rateInput.value.trim() === '') {
    rateInput.value = rateNum.value.toFixed(RATE_DECIMALS)
  }
}

const HOLD_START_DELAY = 500
const HOLD_INTERVAL = 120
let holdTimer = null
let holdInfo = { dir: 0, startedAt: 0 }
function startHold(dir) {
  if (orderType.value !== 'limit') return
  if (dir > 0 && plusDisabled.value) return
  if (dir < 0 && minusDisabled.value) return
  stopHold()
  holdInfo = { dir, startedAt: Date.now() }
  holdTimer = setTimeout(tickHold, HOLD_START_DELAY)
  window.addEventListener('pointerup', stopHold, { once: true })
  window.addEventListener('blur', stopHold, { once: true })
}
function tickHold() {
  const heldMs = Date.now() - holdInfo.startedAt
  const mult = heldMs >= 3500 ? 4 : heldMs >= 1800 ? 2 : 1
  const delta = STEP * mult
  if (holdInfo.dir > 0) {
    incrementBy(delta)
    if (plusDisabled.value) return stopHold()
  } else {
    decrementBy(delta)
    if (minusDisabled.value) return stopHold()
  }
  holdTimer = setTimeout(tickHold, HOLD_INTERVAL)
}
function stopHold() {
  if (holdTimer) { clearTimeout(holdTimer); holdTimer = null }
}
onUnmounted(stopHold)

const loanDuration = computed(() => `${displayDays(termDays.value)} Days`)

const termRateStr = computed(() =>
  orderType.value === 'market' ? marketRateStr.value : fmt(rateNum.value)
)
const termRateDecimal = computed(() => {
  const m = termRateStr.value?.match(/([\d.]+)%/)
  return m ? parseFloat(m[1]) / 100 : NaN
})
function annualizedYield(rateStr, days) {
  if (!rateStr || rateStr === '*' || !Number.isFinite(days) || days <= 0) return '*'
  const m = rateStr.match(/([\d.]+)%/)
  if (!m) return '*'
  const r = parseFloat(m[1])
  if (isYearish(days)) return `${r.toFixed(ANNUAL_DECIMALS)}%`
  const annual = r * (360 / days)
  return `${annual.toFixed(ANNUAL_DECIMALS)}%`
}

const reviewTermRateStr = computed(() =>
  orderType.value === 'market' ? fmtReview(marketRateNum.value) : fmtReview(rateNum.value)
)

/* ==== Fee & Yield logic (role-aware) ==== */
const displayFee = computed(() => isBorrower.value ? '1.00%' : '0.00%')

const reviewAnnualizedYieldWithFee = computed(() => {
  const r = orderType.value === 'market' ? marketRateNum.value : rateNum.value
  if (Number.isNaN(r) || !Number.isFinite(termDays.value) || termDays.value <= 0) return '*'
  const base = isYearish(termDays.value) ? r : r * (360 / termDays.value)
  const withFee = isBorrower.value ? base + 1 : base
  return `${withFee.toFixed(2)}%`
})

/* ==== amount from contract size ==== */
const amountBtc = computed(() => {
  const n = Number(contractSize.value)
  if (Number.isFinite(n) && n > 0) return n
  return 0.1
})

const amountUsd = computed(() => {
  if (props.btcPrice && Number.isFinite(props.btcPrice)) {
    return Number(amountBtc.value) * props.btcPrice
  }
  return null
})

const fiatToBtcBreakdown = computed(() => {
  const fiat = props.requestedUsd
  const price = props.btcPrice
  if (!Number.isFinite(fiat) || !Number.isFinite(price) || price <= 0) return null
  return { fiatAmount: fiat, oraclePrice: price, btcResult: fiat / price }
})

const ltvDisplayStr = computed(() => {
  const v = Number(props.ltv)
  if (!Number.isFinite(v) || v <= 0) return '—'
  return v <= 1 ? `${(v * 100).toFixed(0)}%` : `${v}%`
})

const oracleDisplayStr = computed(() => props.oracleLabel || props.oracleId || '—')

const fiatLabel = computed(() => props.fiatCurrency || 'USD')

function formatAmountDisplay(btc, usd) {
  const btcStr = formatBtc(btc)
  const cur = props.fiatCurrency || 'USD'
  if (props.requestedUsd != null && Number.isFinite(props.requestedUsd)) {
    const usdStr = props.requestedUsd.toLocaleString('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 })
    return usdStr
  }
  if (usd != null && Number.isFinite(usd)) {
    const usdStr = usd.toLocaleString('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 })
    return usdStr
  }
  return btcStr
}

const ltvRatio = computed(() => {
  let v = Number(ltv.value)
  if (!Number.isFinite(v)) return NaN
  if (v > 1) v = v / 100
  if (v < 0) v = 0
  if (v > 1) v = 1
  return v
})

const lenderContributionBtcNum = computed(() => {
  const L = Number(amountBtc.value)
  const l = ltvRatio.value
  const r = termRateDecimal.value
  if (!Number.isFinite(L) || !Number.isFinite(l) || !Number.isFinite(r)) return NaN
  const denom = 1 + r
  if (denom <= 0) return NaN
  return roundBtc(L * l / denom)
})
const borrowerContributionBtcNum = computed(() => {
  const L = Number(amountBtc.value)
  const lenderC = lenderContributionBtcNum.value
  if (!Number.isFinite(L) || !Number.isFinite(lenderC)) return NaN
  const fee = roundBtc(L * FEE_PCT)
  return roundBtc((L - lenderC) + fee)
})

const lenderContributionPct = computed(() => {
  const l = ltvRatio.value
  const r = termRateDecimal.value
  if (!Number.isFinite(l) || !Number.isFinite(r)) return NaN
  return Number(((l / (1 + r)) * 100).toFixed(2))
})
const borrowerContributionPct = computed(() => {
  const lenderP = lenderContributionPct.value
  if (!Number.isFinite(lenderP)) return NaN
  return Number((100 - lenderP + (FEE_PCT * 100)).toFixed(2))
})

const collateralContribution = computed(() => {
  const val = isBorrower.value ? borrowerContributionBtcNum.value : lenderContributionBtcNum.value
  return formatBtc(val)
})

const computedCollateralBtc = computed(() => {
  const price = props.btcPrice
  const principal = props.requestedUsd
  if (!Number.isFinite(principal) || !Number.isFinite(price) || price <= 0) return NaN

  const L = principal / price                       // LOAN in BTC from requested USD
  const r = termRateDecimal.value                   // interest as fraction
  const ltv = ltvRatio.value                        // LTV as fraction
  if (!Number.isFinite(L) || !Number.isFinite(r) || !Number.isFinite(ltv) || ltv <= 0) return NaN

  if (isBorrower.value) {
    // principal + 2× interest buffer + 1% fee
    return roundBtc(L * (1 + 2 * r + FEE_PCT))
  }

  // Lender: deploys principal only
  return roundBtc(L)
})

const computedCollateralSats = computed(() => {
  const btc = computedCollateralBtc.value
  return Number.isFinite(btc) ? Math.round(btc * 1e8) : 0
})

/* ==== Collateral breakdown ==== */
const breakdownPrincipalUsd = computed(() => props.requestedUsd ?? 0)
const breakdownInterestUsd  = computed(() => {
  const p = breakdownPrincipalUsd.value
  const r = termRateDecimal.value
  return Number.isFinite(p) && Number.isFinite(r) ? p * r : 0
})
const breakdownFeeUsd = computed(() => breakdownPrincipalUsd.value * FEE_PCT)
const breakdownTotalBtc = computed(() => computedCollateralBtc.value)
const usdFmt = (n) =>
  Number.isFinite(n) ? n.toLocaleString('en-US', { style: 'currency', currency: fiatLabel.value, maximumFractionDigits: 0 }) : '—'

/* ==== Collateral Requirement Text ==== */
const collateralRequirementText = computed(() => {
  const val = computedCollateralBtc.value
  if (!Number.isFinite(val)) return 'Collateral requirement unavailable.'
  return `To complete the loan, you are required to contribute ${formatBtcValue(val)} Bitcoin collateral.`
})

/* ==== Edit Rate Flow ==== */

/* ==== Review Handler (triggers allocation API call) ==== */
function handleReviewOrder() {
  step.value = 2
  emit('review', buildConfirmPayload())
}

/* ==== Confirm Handler ==== */
function buildConfirmPayload() {
  const finalRateStr = termRateStr.value
  const m = finalRateStr.match(/([\d.]+)/)
  const rateNumeric = m ? parseFloat(m[1]) : NaN

  return {
    action: actionType.value,
    rate: finalRateStr,
    rateNumeric,
    durationDays: displayDays(termDays.value),
    amountUsd: props.requestedUsd,
    ltvUsed: ltvRatio.value,
    rateWasEdited: rateWasEdited.value,
    oracleId: props.oracleId,
    fiatCurrency: props.fiatCurrency,
    btcPrice: props.btcPrice,
  }
}

/* ==== Final Submit ==== */
function submitOrder () {
  const finalRateStr = termRateStr.value
  const m = finalRateStr.match(/([\d.]+)/)
  const rateNumeric = m ? parseFloat(m[1]) : NaN

  const lenderBtc = lenderContributionBtcNum.value
  const borrowerBtc = borrowerContributionBtcNum.value
  const lenderPct = lenderContributionPct.value
  const borrowerPct = borrowerContributionPct.value

  emit('submit', {
    action: actionType.value,
    orderType: orderType.value,
    rate: finalRateStr,
    rateNumeric,
    duration: loanDuration.value,
    durationDays: displayDays(termDays.value),
    annualizedYield: annualizedYield(finalRateStr, termDays.value),
    amount: formatBtc(amountBtc.value),
    amountNumeric: Number(amountBtc.value),
    ltvUsed: ltvRatio.value,
    feePct: displayFee.value,
    collateralContribution: collateralContribution.value,
    collateralContributionBtcNum: isBorrower.value ? borrowerBtc : lenderBtc,
    collateralContributionPct: Number.isFinite(isBorrower.value ? borrowerPct : lenderPct)
      ? `${(isBorrower.value ? borrowerPct : lenderPct).toFixed(2)}%`
      : null,
    lenderContributionBtcNum: lenderBtc,
    borrowerContributionBtcNum: borrowerBtc,
    rateWasEdited: rateWasEdited.value,
    oracleId: props.oracleId,
    fiatCurrency: props.fiatCurrency,
    btcPrice: props.btcPrice,
  })
}
</script>

