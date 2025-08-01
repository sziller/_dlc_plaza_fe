<template>
<section
  class="w-full bg-primary text-white"
  aria-labelledby="onboarding-title"
>
  <div class="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 py-10 md:py-12 lg:py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      <!-- 🧾 Left: Title & Description (lowered) -->
      <div class="space-y-5 mt-8 md:mt-12 lg:mt-24 xl:mt-28">
        <h1 id="onboarding-title" class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
          Personalized Onboarding
        </h1>
        <p class="text-base md:text-lg lg:text-xl text-white/90 max-w-prose">
          We simplify the onboarding process and are here to answer any questions.
          With Cadena Bitcoin, expert knowledge is always just a phone call away.
        </p>
      </div>

      <!-- 📅 Right: CTAs (already spaced from top) -->
      <div
        class="rounded-2xl bg-secondary backdrop-blur-sm border border-white/10 p-6 sm:p-8 lg:p-10 shadow-xl
               mt-6 md:mt-8 lg:mt-20 xl:mt-24"
        aria-labelledby="cta-title"
      >
        <h2 id="cta-title" class="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
          Get Started Today
        </h2>

        <div class="flex flex-col gap-4 md:gap-5">
          <!-- Schedule with Calendly -->
          <a
            href="https://calendly.com/YOUR-CALENDLY-SLUG"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-xl w-full py-4 px-6 font-semibold bg-white text-secondary shadow-lg ring-1 ring-black/5 transition
                   hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Schedule via Calendly"
          >
            Schedule via Calendly
          </a>

          <!-- Call Directly -->
          <a
            href="tel:+13058311410"
            class="inline-flex items-center justify-center rounded-xl w-full py-4 px-6 font-semibold bg-white text-secondary shadow-lg ring-1 ring-black/5 transition
                   hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Call us now at 305-831-1410"
          >
            Call Us Now: (305) 831-1410
          </a>

          <!-- ✉️ Email CTA (copy to clipboard) -->
          <button
            type="button"
            @click="copyEmail"
            :disabled="copied"
            class="inline-flex items-center justify-center gap-2 rounded-xl w-full py-4 px-6 font-semibold bg-white text-secondary shadow-lg ring-1 ring-black/5 transition
                   hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:opacity-70 disabled:cursor-not-allowed"
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
  </div>
</section>




 <!-- Who we serve Section (cards now white) -->
  <section class="w-full bg-primary text-white px-6 py-16">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-extrabold mb-12 text-center">Who we serve.</h2>

      <!-- Row of audiences -->
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

        <!-- Single shared description -->
        <div class="bg-white text-secondary p-8 rounded-lg border border-white/10 text-center shadow-sm">
          <p class="text-2xl text-secondary/90">
            Get expert support and competitive rates for Bitcoin borrowing and lending.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 💬 Contact / Info Section (boxes are white; removed General Questions box; socials big & centered) -->
  <section class="w-full bg-primary text-white px-6 py-0 pb-16">
    <div class="max-w-6xl mx-auto space-y-12">
      <h2 class="text-4xl font-extrabold text-center">Reach Out</h2>

      <!-- Socials: single large centered card -->
      <div class="bg-white text-secondary p-10 rounded-lg border border-white/10 shadow-sm">
        <p class="text-2xl font-semibold mb-8 text-center">Find Us On Social Media</p>
        <div class="flex flex-wrap items-center justify-center gap-12">
          <a
            href="https://x.com/cadenabitcoin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit us on X (Twitter)"
            class="flex flex-col items-center transition hover:opacity-80"
          >
            <i-simple-icons-x class="w-20 h-20 mb-3" aria-hidden="true" />
            <span class="text-base font-medium">X</span>
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our GitHub"
            class="flex flex-col items-center transition hover:opacity-80"
          >
            <i-simple-icons-github class="w-20 h-20 mb-3" aria-hidden="true" />
            <span class="text-base font-medium">GitHub</span>
          </a>
          <a
            href="https://youtube.com/@cadenabitcoin?si=VNgOLehpTTVFELbt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our YouTube"
            class="flex flex-col items-center transition hover:opacity-80"
          >
            <i-simple-icons-youtube class="w-20 h-20 mb-3" aria-hidden="true" />
            <span class="text-base font-medium">YouTube</span>
          </a>
        </div>
      </div>

      <!-- Contacts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Kevin Bell -->
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

        <!-- Sziller -->
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
