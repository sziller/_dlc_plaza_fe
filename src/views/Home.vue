<script setup>
import LiveRatesImac from '../components/LiveRatesImac.vue';
const videos = [
  'https://www.youtube.com/embed/Psuh8mml91o?si=XRhe6RtETvYUOhEJ',
  'https://www.youtube.com/embed/XdyEtPCpIto?si=XAQd9Vo3jupFqh-z',
  'https://www.youtube.com/embed/WIY28lp5iig?si=dbhrXZoHkOMwk2Rr',
];
</script>

<template>
  <section class="py-12 bg-primary"></section>
  <section class="overflow-hidden bg-primary text-white sm:grid sm:grid-cols-2">
    <!-- Left: Hero Text -->
    <div class="p-8 md:p-12 lg:px-16 lg:py-24">
      <div class="mx-auto max-w-xl text-center sm:text-left">
        <h2 class="text-3xl font-extrabold md:text-4xl leading-tight">
          Unlock your Bitcoin's potential.
        </h2>

        <p class="hidden md:block mt-4 text-white text-lg leading-relaxed">
          Get a Bitcoin loan for liquidity or to leverage your Bitcoin exposure. Give a Bitcoin loan to generate fiat yield. 
          No KYC, no credit checks, no hassle. Just Bitcoin.
        </p>

        <div class="mt-10 flex justify-center sm:justify-center">
          <router-link
            to="/borrow"
            class="inline-block rounded-full bg-secondary px-16 py-5 text-lg md:text-xl font-semibold text-white transition hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 focus:outline-none"
          >
            Get Started Today
          </router-link>
        </div>

        
      </div>
    </div>

    <!-- Right: Device mockup with live rates -->
    <div class="hidden sm:flex justify-center items-center bg-gradient-to-tr from-secondary/10 to-transparent px-6 py-12">
      <LiveRatesImac />
    </div>
  </section>
  <section>
  <div class="rounded-xl bg-secondary mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
      
      <!-- Left Text Block -->
      <div class="md:col-span-1">
        <div class="max-w-lg md:max-w-none">
          <h2 class="text-2xl font-semibold text-white sm:text-3xl">
            What is Cadena Bitcoin?
          </h2>
          <p class="mt-4 text-white">
            Cadena Bitcoin’s product enables peer-to-peer lending and borrowing using Bitcoin as collateral through 
            Discreet Log Contracts (DLCs). Cadena Bitcoin lets you use Bitcoin flexibly—whether you want to grow your
            Bitcoin holdings, access fiat without losing Bitcoin exposure, or generate fiat returns secured by Bitcoin.
          </p>
        </div>
      </div>

      <!-- Right YouTube Video Embed -->
      <div class="md:col-span-3">
        <div class="rounded overflow-hidden aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.youtube.com/embed/0v_okPUvHvQ?si=JnqpZ5rSgdyengyt"
            title="Cadena Bitcoin Video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</section>

  <section class="bg-primary text-white py-20 px-6">
    <div class="max-w-6xl mx-auto space-y-12">
      <!-- Section Heading -->
      <div class="text-center space-y-4">
        <h2 class="text-3xl md:text-4xl font-extrabold">
          Latest Videos
        </h2>
        <p class="text-white text-lg max-w-2xl mx-auto">
          Explore our latest updates, tutorials, and overviews about Cadena Bitcoin and our protocol innovations.
        </p>
      </div>

      <!-- Video Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(video, index) in videos"
          :key="index"
          class="rounded-xl overflow-hidden shadow-lg border border-secondary aspect-w-16 aspect-h-9"
        >
          <iframe
            :src="video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
  <section class="bg-dark text-white px-4 py-20 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto space-y-12">
      <!-- Heading -->
      <div class="text-center">
        <h2 class="text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h2>
        <p class="mt-4 text-tertiary text-lg">
          Everything you need to know about Cadena Bitcoin’s loan product.
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="space-y-4">
        <details class="group [&_summary::-webkit-details-marker]:hidden" open>
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-white/5 p-4 text-white">
            <h2 class="text-lg font-medium">What is the loan amount?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="px-4 pt-4 text-tertiary">Loans are standard 0.1 Bitcoin.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-white/5 p-4 text-white">
            <h2 class="text-lg font-medium">Can I repay my loan early?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="px-4 pt-4 text-tertiary">All loans settle after a standard 30 day term.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-white/5 p-4 text-white">
            <h2 class="text-lg font-medium">Are there monthly payments?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="px-4 pt-4 text-tertiary">There are no payments. All loans settle after 30 days.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-white/5 p-4 text-white">
            <h2 class="text-lg font-medium">What is the Loan To Value?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="px-4 pt-4 text-tertiary">80%</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-white/5 p-4 text-white">
            <h2 class="text-lg font-medium">How is collateral managed?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="px-4 pt-4 text-tertiary">
            Cadena Bitcoin prioritizes self-sovereignty, decentralization, and Bitcoin’s core security principle: Your Keys, Your Coins. You control your private keys and funds. Cadena Bitcoin does not hold or access your private keys or seed phrase.
            Your wallet balance and liquid balance on your Cadena address are displayed in your Dashboard.
          </p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-white/5 p-4 text-white">
            <h2 class="text-lg font-medium">What currency can I get my loan in?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="px-4 pt-4 text-tertiary">Loans are funded in Bitcoin and settled in Bitcoin.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-white/5 p-4 text-white">
            <h2 class="text-lg font-medium">How do I get a Bitcoin-backed loan?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="px-4 pt-4 text-tertiary">Register online and download the signer app.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-white/5 p-4 text-white">
            <h2 class="text-lg font-medium">How long does it take to get a loan?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="px-4 pt-4 text-tertiary">Minutes. Funding transactions are broadcast as soon as both peers sign the contract.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-white/5 p-4 text-white">
            <h2 class="text-lg font-medium">What happens if my collateral drops in value?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="px-4 pt-4 text-tertiary">Nothing happens with the collateral until it is divided on final settlement.</p>
        </details>

        <details class="group [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-white/5 p-4 text-white">
            <h2 class="text-lg font-medium">Is there a credit check?</h2>
            <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <p class="px-4 pt-4 text-tertiary">No. Your bitcoin is your credit.</p>
        </details>
      </div>
    </div>
  </section>
</template>
