<template>
  <!-- Gradient Wrapper -->
  <div class="min-h-screen text-white ">
     <div
  class="fixed inset-0 -z-10"
  style="background: linear-gradient(
    to bottom,
    #000000 0%,
    #000000 56%,
    #0a051f 66%,
    #1b0a3c 76%,
    #35157a 88%,
    #6738e4 100%
  );">
</div>
    <!-- Onboarding Section -->
   <section class="w-full pt-32" aria-labelledby="onboarding-title">
  <div class="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 space-y-8">
    <!-- Title -->
    <h1
      id="onboarding-title"
      class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-center"
    >
      Personalized Onboarding
    </h1>

    <!-- Card 1: Description -->
    <div class="bg-white text-secondary rounded-2xl shadow-xl border border-white/10 p-6 sm:p-10 text-center">
      <p class="text-base md:text-lg lg:text-xl text-secondary/80 max-w-4xl mx-auto">
        As a Cadena Bitcoin client, expert knowledge is always just a chat, email, or phone call away.
        We simplify complexity and are available 24/7 for personalized onboarding and strategies to
        borrow Bitcoin or generate yield from Bitcoin.
      </p>
    </div>

    <!-- Card 2 + Card 3: Call and Email -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Call box -->
      <div class="bg-white text-secondary rounded-2xl shadow-xl border border-white/10 p-6 sm:p-10 text-center">
        <h4 class="text-2xl font-semibold mb-4">Call</h4>
        <a
          href="tel:+13058311410"
          class="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-secondary text-white shadow-lg ring-1 ring-black/5 transition
                 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/80 whitespace-nowrap"
          aria-label="Call (305) 831-1410"
        >
          <Phone class="w-5 h-5" aria-hidden="true" />
          <span class="font-semibold">(305) 831-1410</span>
        </a>
      </div>

      <!-- Email box -->
      <div class="bg-white text-secondary rounded-2xl shadow-xl border border-white/10 p-6 sm:p-10 text-center">
        <h4 class="text-2xl font-semibold mb-4">Email</h4>
        <a
          href="mailto:info@cadenabitcoin.com"
          class="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-secondary text-white shadow-lg ring-1 ring-black/5 transition
                 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/80 whitespace-nowrap"
          aria-label="Email info@cadenabitcoin.com"
        >
          <Mail class="w-5 h-5" aria-hidden="true" />
          <span class="font-semibold">info@cadenabitcoin.com</span>
        </a>
      </div>
    </div>
  </div>
</section>



    <!-- Who we serve Section -->
    <section class="w-full px-6 py-16">
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
    <section class="w-full px-6 pb-16">
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

   
  </div> 
  <TheFooter />
</template>


<script setup>
import TheFooter from '../components/TheFooter.vue'
import { onMounted, ref } from 'vue'
import { User, Users, Building2, Copy, Check } from 'lucide-vue-next'
import { Phone, Mail } from 'lucide-vue-next'
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