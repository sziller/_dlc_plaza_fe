<template>
  <!-- Onboarding Section -->
  <section class="w-full bg-primary text-white pt-32" aria-labelledby="onboarding-title">
    <div class="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 space-y-10">
      <!-- Title OUTSIDE the card -->
      <h1 id="onboarding-title" class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-center lg:text-center">
        Personalized Onboarding
      </h1>

      <div class="bg-white text-secondary rounded-2xl shadow-xl border border-white/10 p-8 sm:p-10 space-y-8 text-center">
        <!-- Description INSIDE the card -->
        <p class="text-base md:text-lg lg:text-xl text-secondary/80 max-w-2xl mx-auto">
          We simplify the onboarding process and are here to answer any questions.
          With Cadena Bitcoin, expert knowledge is always just a phone call away.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-6">
          <a
            href="https://calendly.com/YOUR-CALENDLY-SLUG"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-xl px-6 py-4 w-full md:w-auto font-semibold bg-secondary text-white shadow-lg ring-1 ring-black/5 transition
                   hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/80"
            aria-label="Schedule via Calendly"
          >
            Schedule via Calendly
          </a>

          <a
            href="tel:+13058311410"
            class="inline-flex items-center justify-center rounded-xl px-6 py-4 w-full md:w-auto font-semibold bg-secondary text-white shadow-lg ring-1 ring-black/5 transition
                   hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/80"
            aria-label="Call us now at 305-831-1410"
          >
            Call Us Now: (305) 831-1410
          </a>

          <button
            type="button"
            @click="copyEmail"
            :disabled="copied"
            class="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 w-full md:w-auto font-semibold bg-secondary text-white shadow-lg ring-1 ring-black/5 transition
                   hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/80 disabled:opacity-70 disabled:cursor-not-allowed"
            :aria-label="copied ? 'Email copied to clipboard' : 'Copy email address to clipboard'"
          >
            <span v-if="!copied" class="inline-flex items-center gap-2">
              <span>Email us: info@cadenabitcoin.com</span>
              <Copy class="w-5 h-5" aria-hidden="true" />
            </span>
            <span v-else class="inline-flex items-center gap-2">
              <Check class="w-5 h-5" aria-hidden="true" />
              <span>Copied!</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Who we serve Section -->
  <section class="w-full bg-primary text-white px-6 py-16">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-extrabold mb-12 text-center">Who we serve.</h2>
      <div class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white text-secondary p-6 rounded-lg border border-white/10 text-center group shadow-sm">
            <User class="w-8 h-8 mx-auto mb-3 text-secondary/80 group-hover:text-secondary" aria-hidden="true" />
            <p class="text-xl font-semibold">Private Clients</p>
          </div>
          <div class="bg-white text-secondary p-6 rounded-lg border border-white/10 text-center group shadow-sm">
            <Users class="w-8 h-8 mx-auto mb-3 text-secondary/80 group-hover:text-secondary" aria-hidden="true" />
            <p class="text-xl font-semibold">Family Offices</p>
          </div>
          <div class="bg-white text-secondary p-6 rounded-lg border border-white/10 text-center group shadow-sm">
            <Building2 class="w-8 h-8 mx-auto mb-3 text-secondary/80 group-hover:text-secondary" aria-hidden="true" />
            <p class="text-xl font-semibold">Institutional Investors</p>
          </div>
        </div>
        <div class="bg-white text-secondary p-8 rounded-lg border border-white/10 text-center shadow-sm">
          <p class="text-2xl text-secondary/90">
            Get expert support and competitive rates for Bitcoin borrowing and lending.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Reach Out Section -->
  <section class="w-full bg-primary text-white px-6 py-0 pb-16">
    <div class="max-w-6xl mx-auto space-y-12">
      <h2 class="text-4xl font-extrabold text-center">Reach Out</h2>
      <div class="bg-white text-secondary p-10 rounded-lg border border-white/10 shadow-sm">
        <p class="text-2xl font-semibold mb-8 text-center">Find Us On Social Media</p>
        <div class="flex flex-wrap items-center justify-center gap-12">
          <a href="https://x.com/cadenabitcoin" target="_blank" rel="noopener noreferrer" aria-label="Visit us on X (Twitter)" class="flex flex-col items-center transition hover:opacity-80">
            <i-simple-icons-x class="w-20 h-20 mb-3" aria-hidden="true" />
            <span class="text-base font-medium">X</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Visit our GitHub" class="flex flex-col items-center transition hover:opacity-80">
            <i-simple-icons-github class="w-20 h-20 mb-3" aria-hidden="true" />
            <span class="text-base font-medium">GitHub</span>
          </a>
          <a href="https://youtube.com/@cadenabitcoin?si=VNgOLehpTTVFELbt" target="_blank" rel="noopener noreferrer" aria-label="Visit our YouTube" class="flex flex-col items-center transition hover:opacity-80">
            <i-simple-icons-youtube class="w-20 h-20 mb-3" aria-hidden="true" />
            <span class="text-base font-medium">YouTube</span>
          </a>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white text-secondary p-6 rounded-lg shadow-sm border border-white/10">
          <p class="text-xl font-semibold mb-2">Kevin Bell</p>
          <p class="text-sm text-secondary/70 mb-2">President</p>
          <p>
            <span class="font-medium">Email:</span>
            <a href="mailto:kevin@cadenabitcoin.com" class="underline hover:opacity-80">kevin@cadenabitcoin.com</a>
          </p>
          <p>
            <span class="font-medium">Phone:</span>
            <a href="tel:+13058311410" class="underline hover:opacity-80">305-831-1410</a>
          </p>
        </div>

        <div class="bg-white text-secondary p-6 rounded-lg shadow-sm border border-white/10">
          <p class="text-xl font-semibold mb-2">Sziller</p>
          <p class="text-sm text-secondary/70 mb-2">Chief Technology Officer</p>
          <p>
            <span class="font-medium">Email:</span>
            <a href="mailto:sziller@cadenabitcoin.com" class="underline hover:opacity-80">sziller@cadenabitcoin.com</a>
          </p>
        </div>
      </div>
    </div>
  </section>

  <TheFooter />
</template>

<script setup>
import TheFooter from '../components/TheFooter.vue'
import { onMounted, ref } from 'vue'
import { User, Users, Building2, Copy, Check } from 'lucide-vue-next'

const copied = ref(false)

function copyEmail() {
  const email = 'info@cadenabitcoin.com'
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email)
      .then(() => {
        copied.value = true
        setTimeout(() => (copied.value = false), 1500)
      })
      .catch(() => fallbackCopy(email))
  } else {
    fallbackCopy(email)
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'absolute'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } finally {
    document.body.removeChild(ta)
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
/* Iconify icons inherit currentColor; customize colors here if needed */
</style>