<template>
  <section class="min-h-screen w-full bg-primary text-white flex flex-col md:flex-row">
    <!-- 🧾 Left Side: Title & Description -->
    <div class="md:w-1/2 w-full flex flex-col justify-center items-start p-8">
      <h1 class="text-4xl md:text-6xl font-extrabold mb-4">Personalized Onboarding</h1>
      <p class="text-lg md:text-xl text-white/90 max-w-lg">
        We simplify the onboarding process and are here to answer any questions.
        With Cadena Bitcoin, expert knowledge is always just a phone call away.
      </p>
    </div>

    <!-- 📅 Right Side: CTA Buttons -->
    <div class="md:w-1/2 w-full bg-secondary p-8 flex flex-col items-center justify-center gap-8">
      <h2 class="text-2xl md:text-3xl font-semibold mb-4">Get Started Today</h2>

      <!-- Schedule with Calendly -->
      <a
        href="https://calendly.com/cadenabitcoin-info"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full max-w-md bg-primary hover:bg-primary/50 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center transition-all duration-200"
        aria-label="Schedule via Calendly"
      >
        Schedule via Calendly
      </a>

      <!-- Call Directly -->
      <a
        href="tel:+13058311410"
        class="w-full max-w-md bg-primary hover:bg-primary/50 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center transition-all duration-200"
        aria-label="Call us now at 305-831-1410"
      >
        Call Us Now: (305) 831-1410
      </a>

      <!-- ✉️ Email CTA (copy to clipboard, with icon; no 'Copy' word) -->
      <button
        type="button"
        @click="copyEmail"
        :disabled="copied"
        class="w-full max-w-md bg-primary hover:bg-primary/50 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center transition-all duration-200"
        :aria-label="copied ? 'Email copied to clipboard' : 'Copy email address to clipboard'"
      >
        <span v-if="!copied" class="inline-flex items-center justify-center gap-2">
          <span>Email us: info@cadenabitcoin.com</span>
          <Copy class="w-5 h-5" aria-hidden="true" />
        </span>
        <span v-else class="inline-flex items-center justify-center gap-2">
          <Check class="w-5 h-5" aria-hidden="true" />
          <span>Copied!</span>
        </span>
      </button>
    </div>
  </section>

  <!-- Who we serve Section (with Lucide icons) -->
  <section class="w-full bg-secondary text-white px-6 py-16">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-extrabold mb-12 text-center">Who we serve.</h2>

      <!-- Row of audiences across the screen -->
      <div class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-primary p-6 rounded-lg border border-white/10 text-center group">
            <User class="w-8 h-8 mx-auto mb-3 text-white/90 group-hover:text-white" aria-hidden="true" />
            <p class="text-xl font-semibold">Private Clients</p>
          </div>
          <div class="bg-primary p-6 rounded-lg border border-white/10 text-center group">
            <Users class="w-8 h-8 mx-auto mb-3 text-white/90 group-hover:text-white" aria-hidden="true" />
            <p class="text-xl font-semibold">Family Offices</p>
          </div>
          <div class="bg-primary p-6 rounded-lg border border-white/10 text-center group">
            <Building2 class="w-8 h-8 mx-auto mb-3 text-white/90 group-hover:text-white" aria-hidden="true" />
            <p class="text-xl font-semibold">Institutional Investors</p>
          </div>
        </div>

        <!-- Single shared description along the bottom -->
        <div class="bg-primary p-8 rounded-lg border border-white/10 text-center">
          <p class="text-2xl text-white/90">
            Get expert support and competitive rates for Bitcoin borrowing and lending.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 💬 Contact / Info Section -->
  <section class="w-full bg-secondary text-white px-6 py-10">
    <div class="max-w-5xl mx-auto space-y-10">
      <h2 class="text-4xl font-extrabold border-white/20 text-center pb-1">Reach Out</h2>

      <!-- Social & Email boxes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Socials (single card with linked icons and text) -->
        <div class="bg-primary p-6 rounded-lg border border-white/10 shadow-sm text-center">
          <p class="text-xl font-semibold mb-6">Find Us On Social Media</p>
          <div class="flex items-center justify-around gap-8">
            <!-- Iconify Simple Icons -->
            <a
              href="https://x.com/cadenabitcoin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit us on X (Twitter)"
              class="flex flex-col items-center transition hover:text-secondary"
            >
              <i-simple-icons-x class="w-12 h-12 mb-2" aria-hidden="true" />
              <span class="text-sm font-medium">X</span>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our GitHub"
              class="flex flex-col items-center transition hover:text-secondary"
            >
              <i-simple-icons-github class="w-12 h-12 mb-2" aria-hidden="true" />
              <span class="text-sm font-medium">GitHub</span>
            </a>
            <a
              href="https://youtube.com/@cadenabitcoin?si=VNgOLehpTTVFELbt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our YouTube"
              class="flex flex-col items-center transition hover:text-secondary"
            >
              <i-simple-icons-youtube class="w-12 h-12 mb-2" aria-hidden="true" />
              <span class="text-sm font-medium">YouTube</span>
            </a>
          </div>
        </div>

        <!-- Info Email (card, like the contacts below) -->
        <div class="bg-primary p-6 rounded-lg shadow-sm border border-white/10">
          <p class="text-xl font-semibold mb-2">For General Questions</p>
          <p>
            <span class="font-medium">Email: </span>
            <a href="mailto:info@cadenabitcoin.com" class="underline hover:text-white">info@cadenabitcoin.com</a>
          </p>
        </div>
      </div>

      <!-- Existing contacts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <!-- Kevin Bell -->
        <div class="bg-primary p-6 rounded-lg shadow-sm border border-white/10">
          <p class="text-xl font-semibold mb-2">Kevin Bell</p>
          <p class="text-sm text-white/70 mb-2">President</p>
          <p>
            <span class="font-medium">Email:</span>
            <a href="mailto:kevin@cadenabitcoin.com" class="underline hover:text-white">kevin@cadenabitcoin.com</a>
          </p>
          <p>
            <span class="font-medium">Phone:</span>
            <a href="tel:+13058311410" class="underline hover:text-white">305-831-1410</a>
          </p>
        </div>

        <!-- Sziller -->
        <div class="bg-primary p-6 rounded-lg shadow-sm border border-white/10">
          <p class="text-xl font-semibold mb-2">Sziller</p>
          <p class="text-sm text-white/70 mb-2">Chief Technology Officer</p>
          <p>
            <span class="font-medium">Email:</span>
            <a href="mailto:sziller@cadenabitcoin.com" class="underline hover:text-white">sziller@cadenabitcoin.com</a>
          </p>
        </div>
      </div>
    </div>
  </section>

  <TheFooter/>
</template>

<script setup>
import TheFooter from '../components/TheFooter.vue'
import { onMounted, ref } from 'vue'
import { User, Users, Building2, Copy, Check } from 'lucide-vue-next' // Social icons removed; using Iconify Simple Icons

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
/* Iconify icons inherit currentColor; adjust link color if you want brand hues per-platform.
   Example (optional):
   a[aria-label*="GitHub"] { color: #ffffff; }
   a[aria-label*="YouTube"] { color: #ff0000; }
   a[aria-label*="X (Twitter)"] { color: #000000; }
*/
</style>
