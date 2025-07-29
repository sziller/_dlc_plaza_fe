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
        href="https://calendly.com/your-calendly-link"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full max-w-md bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center transition-all duration-200"
      >
        Schedule via Calendly
      </a>

      <!-- Call Directly -->
      <a
        href="tel:+13058311410"
        class="w-full max-w-md bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center transition-all duration-200"
      >
        Call Us Now: (305) 831-1410
      </a>
    </div>
  </section>

  <!-- Who we serve Section (updated) -->
  <section class="w-full bg-tertiary text-white px-6 py-16">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-extrabold mb-12 text-center">Who we serve.</h2>

      <!-- Row of audiences across the screen -->
      <div class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-secondary p-6 rounded-lg border border-white/10 text-center">
            <p class="text-xl font-semibold">Private Clients</p>
          </div>
          <div class="bg-secondary p-6 rounded-lg border border-white/10 text-center">
            <p class="text-xl font-semibold">Family Offices</p>
          </div>
          <div class="bg-secondary p-6 rounded-lg border border-white/10 text-center">
            <p class="text-xl font-semibold">Institutional Investors</p>
          </div>
        </div>

        <!-- Single shared description along the bottom -->
        <div class="bg-secondary p-8 rounded-lg border border-white/10 text-center">
          <p class="text-2xl  text-white/90">
            Get expert support and competitive rates for Bitcoin borrowing and lending.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 💬 Contact / Info Section -->
  <section class="w-full bg-secondary text-white px-6 py-16">
    <div class="max-w-5xl mx-auto space-y-10">
      <h2 class="text-4xl font-extrabold border-white/20 pb-4">Reach Out</h2>

      <p class="text-lg leading-relaxed text-white/90">
        Follow us on <a href="#" class="underline">Social Media</a> for updates.<br />
        For general questions, email us at
        <a href="mailto:info@cadenabitcoin.com" class="underline">info@cadenabitcoin.com</a>.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Kevin Bell -->
        <div class="bg-tertiary p-6 rounded-lg shadow-sm border border-white/10">
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
        <div class="bg-tertiary p-6 rounded-lg shadow-sm border border-white/10">
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
// No JS needed for this simplified version
</script>

<style scoped>
</style>
