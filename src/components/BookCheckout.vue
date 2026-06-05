<template>
  <div class="bc-wrap">
    <form class="bc-form" @submit.prevent="submit">
      <div class="bc-form-row">
        <div class="bc-field">
          <label class="bc-label">First name</label>
          <input class="bc-input" v-model="form.firstName" required placeholder="Kevin" autocomplete="given-name" />
        </div>
        <div class="bc-field">
          <label class="bc-label">Last name</label>
          <input class="bc-input" v-model="form.lastName" required placeholder="Bell" autocomplete="family-name" />
        </div>
      </div>

      <div class="bc-form-row">
        <div class="bc-field">
          <label class="bc-label">Email</label>
          <input class="bc-input" v-model="form.email" type="email" required placeholder="you@example.com" autocomplete="email" />
        </div>
        <div class="bc-field">
          <label class="bc-label">Phone</label>
          <input class="bc-input" v-model="form.phone" type="tel" required placeholder="+1 555 000 0000" autocomplete="tel" />
        </div>
      </div>

      <div class="bc-field">
        <label class="bc-label">Street address</label>
        <input class="bc-input" v-model="form.street1" required placeholder="123 Bitcoin Street" autocomplete="address-line1" />
      </div>
      <div class="bc-field">
        <label class="bc-label">Apt, suite, etc. <span class="bc-optional">(optional)</span></label>
        <input class="bc-input" v-model="form.street2" placeholder="Unit 4B" autocomplete="address-line2" />
      </div>

      <div class="bc-form-row">
        <div class="bc-field">
          <label class="bc-label">City</label>
          <input class="bc-input" v-model="form.city" required placeholder="San Francisco" autocomplete="address-level2" />
        </div>
        <div class="bc-field">
          <label class="bc-label">State / Province <span class="bc-optional">(optional)</span></label>
          <input class="bc-input" v-model="form.state" placeholder="CA" maxlength="4" autocomplete="address-level1" />
        </div>
      </div>

      <div class="bc-form-row">
        <div class="bc-field">
          <label class="bc-label">Postal code</label>
          <input class="bc-input" v-model="form.postcode" required placeholder="94105" autocomplete="postal-code" />
        </div>
        <div class="bc-field">
          <label class="bc-label">Country code <span class="bc-hint">(2-letter, e.g. US)</span></label>
          <input
            class="bc-input bc-input--upper"
            v-model="form.country"
            required
            placeholder="US"
            maxlength="2"
            autocomplete="country"
            @input="form.country = form.country.toUpperCase()"
          />
        </div>
      </div>

      <!-- Order summary -->
      <div class="bc-summary">
        <div class="bc-qty-row">
          <span class="bc-qty-label">Quantity</span>
          <div class="bc-qty-ctrl">
            <button type="button" class="bc-qty-btn" @click="decQty" :disabled="form.quantity <= 1">−</button>
            <span class="bc-qty-val">{{ form.quantity }}</span>
            <button type="button" class="bc-qty-btn" @click="incQty">+</button>
          </div>
        </div>
        <div class="bc-summary-line">
          <span class="bc-summary-desc">Book × {{ form.quantity }}</span>
          <span class="bc-summary-total bc-summary-subtle">$22.99 BTC / $34.99 card + shipping</span>
        </div>
        <div class="bc-summary-line">
          <span class="bc-summary-desc">Shipping</span>
          <span class="bc-summary-total bc-summary-subtle">
            <span v-if="shippingLoading" class="bc-shipping-calc">calculating…</span>
            <span v-else-if="shippingCost !== null">${{ shippingCost.toFixed(2) }}</span>
            <span v-else class="bc-shipping-calc">enter address above</span>
          </span>
        </div>
        <div class="bc-summary-line bc-summary-line--total">
          <span class="bc-summary-desc">Bitcoin total</span>
          <span class="bc-summary-total">${{ totalBtc }}</span>
        </div>
        <div class="bc-summary-line bc-summary-line--total">
          <span class="bc-summary-desc">Card total</span>
          <span class="bc-summary-total">${{ totalCard }}</span>
        </div>
      </div>

      <div v-if="error" class="bc-error">{{ error }}</div>

      <div class="bc-btn-row">
        <button type="submit" class="bc-pay-btn bc-pay-btn--btc" :disabled="loadingBtc || loadingCard">
          <svg class="bc-btc-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11.5 2C6.25 2 2 6.25 2 11.5S6.25 21 11.5 21 21 16.75 21 11.5 16.75 2 11.5 2zm1.41 9.07c.87.35 1.59 1.07 1.59 2.18 0 1.47-1.16 2.3-2.75 2.5v1.25h-1v-1.23c-.37-.03-.76-.08-1.17-.16v-1.14c.44.1.9.17 1.17.17h.83c.73 0 1.17-.3 1.17-.8 0-.46-.28-.73-1.2-1.01l-.93-.29C9.55 13.2 8.88 12.52 8.88 11.4c0-1.3 1.02-2.15 2.62-2.37V7.75h1v1.27c.32.03.66.08 1 .15v1.12c-.35-.07-.73-.12-1-.12H12c-.64 0-1.04.26-1.04.72 0 .42.24.65 1.07.93l.88.29z"/>
          </svg>
          <span>{{ loadingBtc ? 'Redirecting…' : `Pay with Lightning · $${totalBtc} USD` }}</span>
        </button>

        <button type="button" class="bc-pay-btn bc-pay-btn--card" :disabled="loadingBtc || loadingCard" @click="submitCard">
          <svg v-if="!loadingCard" class="bc-btc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <span>{{ loadingCard ? 'Redirecting…' : shippingCost === null ? `Pay with Card · $${totalCard} USD + shipping` : `Pay with Card · $${totalCard} USD` }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street1: '',
  street2: '',
  city: '',
  state: '',
  postcode: '',
  country: '',
  quantity: 1,
})

const loadingBtc = ref(false)
const loadingCard = ref(false)
const error = ref('')
const shippingCost = ref(null)
const shippingLoading = ref(false)

const BASE_BTC = 22.99
const BASE_CARD = 34.99

const totalBtc = computed(() => {
  const shipping = shippingCost.value ?? 0
  return (BASE_BTC * form.value.quantity + shipping).toFixed(2)
})
const totalCard = computed(() => {
  const shipping = shippingCost.value ?? 0
  return (BASE_CARD * form.value.quantity + shipping).toFixed(2)
})

function incQty() { form.value.quantity++ }
function decQty() { if (form.value.quantity > 1) form.value.quantity-- }

const base = import.meta.env.VITE_BOOK_API || ''

let shippingDebounce = null
watch(
  () => [form.value.street1, form.value.city, form.value.postcode, form.value.country, form.value.quantity],
  ([street1, city, postcode, country]) => {
    if (!street1 || !city || !postcode || !country) return
    clearTimeout(shippingDebounce)
    shippingDebounce = setTimeout(async () => {
      shippingLoading.value = true
      try {
        const { data } = await axios.post(`${base}/api/get-shipping-cost`, {
          quantity: form.value.quantity,
          shipping: {
            street1,
            city,
            postcode,
            country_code: country,
            state_code: form.value.state || undefined,
            phone: form.value.phone || undefined,
          },
        })
        shippingCost.value = data.shippingCost
      } catch {
        shippingCost.value = null
      } finally {
        shippingLoading.value = false
      }
    }, 600)
  }
)

async function validateAddress() {
  try {
    await axios.post(`${base}/api/validate-address`, {
      shipping: {
        country_code: form.value.country,
        postcode: form.value.postcode,
        state_code: form.value.state || undefined,
        city: form.value.city,
        street1: form.value.street1,
        phone_number: form.value.phone,
      },
    })
  } catch (err) {
    throw new Error(err.response?.data?.error || 'We can\'t ship to this address. Please check your details.')
  }
}

async function submit() {
  loadingBtc.value = true
  error.value = ''
  try {
    await validateAddress()
    const { data } = await axios.post(`${base}/api/create-invoice`, {
      quantity: form.value.quantity,
      contact_email: form.value.email,
      shipping: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        street1: form.value.street1,
        street2: form.value.street2 || undefined,
        city: form.value.city,
        state: form.value.state || undefined,
        postcode: form.value.postcode,
        country: form.value.country,
        phone: form.value.phone,
      },
    })
    window.location.href = data.checkoutUrl
  } catch (err) {
    error.value = err.message || err.response?.data?.error || 'Something went wrong. Please try again.'
    loadingBtc.value = false
  }
}

async function submitCard() {
  loadingCard.value = true
  error.value = ''
  try {
    await validateAddress()
    const { data } = await axios.post(`${base}/api/create-stripe-session`, {
      quantity: form.value.quantity,
      contact_email: form.value.email,
      shipping: {
        name: `${form.value.firstName} ${form.value.lastName}`.trim(),
        street1: form.value.street1,
        street2: form.value.street2 || undefined,
        city: form.value.city,
        state_code: form.value.state || undefined,
        country_code: form.value.country,
        postcode: form.value.postcode,
        phone_number: form.value.phone,
      },
    })
    window.location.href = data.checkoutUrl
  } catch (err) {
    error.value = err.message || err.response?.data?.error || 'Something went wrong. Please try again.'
    loadingCard.value = false
  }
}
</script>

<style scoped>
.bc-wrap {
  width: 100%;
}


.bc-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bc-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 560px) {
  .bc-form-row { grid-template-columns: 1fr; }
}

.bc-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bc-label {
  font-size: 13px;
  font-weight: 500;
  color: #aaa;
  letter-spacing: 0.01em;
}

.bc-optional {
  font-weight: 400;
  color: #666;
}

.bc-hint {
  font-weight: 400;
  color: #666;
  font-size: 12px;
}

.bc-input {
  background: #0d1a2e;
  border: 1px solid #2e3a4e;
  border-radius: 7px;
  color: #f0f0f0;
  font-size: 15px;
  padding: 10px 14px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
  box-sizing: border-box;
}
.bc-input::placeholder { color: #444; }
.bc-input:focus { border-color: #f7931a; }
.bc-input--upper { text-transform: uppercase; }

/* Order summary */
.bc-summary {
  background: #0d1a2e;
  border: 1px solid #2e3a4e;
  border-radius: 10px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 4px;
}

.bc-qty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bc-qty-label {
  font-size: 14px;
  color: #aaa;
  font-weight: 500;
}

.bc-qty-ctrl {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid #2e3a4e;
  border-radius: 7px;
  overflow: hidden;
}

.bc-qty-btn {
  background: #112038;
  border: none;
  color: #f0f0f0;
  font-size: 18px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
  line-height: 1;
}
.bc-qty-btn:hover:not(:disabled) { background: #1a2e48; }
.bc-qty-btn:disabled { color: #444; cursor: not-allowed; }

.bc-qty-val {
  min-width: 40px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #f0f0f0;
  background: #081123;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #2e3a4e;
  border-right: 1px solid #2e3a4e;
}

.bc-summary-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 12px;
  border-top: 1px solid #2e3a4e;
}

.bc-summary-line--total .bc-summary-desc {
  color: #f0f0f0;
  font-weight: 600;
}

.bc-summary-desc {
  font-size: 14px;
  color: #aaa;
}

.bc-summary-total {
  font-size: 17px;
  font-weight: 700;
  color: #f0f0f0;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
}

.bc-summary-subtle {
  font-size: 14px;
  font-weight: 400;
  color: #aaa;
}

.bc-shipping-calc {
  font-style: italic;
  color: #555;
  font-family: inherit;
  font-size: 13px;
}

/* Error */
.bc-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #fca5a5;
  font-size: 14px;
}

/* Pay buttons */
.bc-btn-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.bc-pay-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: none;
  border-radius: 9px;
  padding: 16px 28px;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  width: 100%;
}
.bc-pay-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.bc-pay-btn--btc {
  background: #f7931a;
  color: #000;
}
.bc-pay-btn--btc:hover:not(:disabled) {
  background: #f5a623;
  transform: translateY(-1px);
}

.bc-pay-btn--card {
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
}
.bc-pay-btn--card:hover:not(:disabled) {
  background: #2a2a2a;
  transform: translateY(-1px);
}

.bc-btc-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
</style>
