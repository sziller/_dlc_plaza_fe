<template>
  <main class="min-h-screen w-full text-white pt-20 md:pt-32 relative">
    <!-- Background: same as Home -->
    <div class="absolute inset-0 -z-10 bg-page-gradient"></div>

    <!-- Top Title -->
    <div class="max-w-4xl mx-auto text-center mb-16 px-6">
      <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
        Cadena Bitcoin FAQ
      </h1>
      <p class="text-tertiary text-lg">
        Everything you need to know about Cadena Bitcoin's loan product.
      </p>
    </div>

    <!-- FAQ Accordion -->
    <section class="max-w-4xl mx-auto px-6 pb-20 space-y-3">
      <div v-for="(item, i) in faqs" :key="i" class="rounded-md border border-white/10 bg-dark overflow-hidden">
        <button
          class="w-full flex items-center justify-between gap-3 text-left p-4"
          @click="toggle(i)"
          :aria-expanded="isOpen(i)"
          :aria-controls="`faq-panel-${i}`"
        >
          <h3 class="text-lg font-medium">{{ item.q }}</h3>
          <svg class="size-5 shrink-0 transition-transform duration-300" :class="isOpen(i) ? '-rotate-180' : ''" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <transition @enter="onEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave" @leave="onLeave" @after-leave="onAfterLeave">
          <div v-show="isOpen(i)" :id="`faq-panel-${i}`" role="region" class="faq-panel">
            <div class="px-4 pt-3 pb-5 text-white/90 leading-relaxed">
              {{ item.a }}
            </div>
          </div>
        </transition>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})

const faqs = [
  { q: 'What is the loan amount?', a: 'Loans are in any $1,000 USD denomination.' },
  { q: 'Can I repay my loan early?', a: 'All loans settle at the end of the 365 day term.' },
  { q: 'Are there monthly payments?', a: 'There are no payments. All loans settle at the end of the term.' },
  { q: 'What is the Loan To Value?', a: 'Loans are 50% value loans.' },
  { q: 'How is collateral managed?', a: 'You control your private keys and funds. Cadena Bitcoin does not hold or access your private keys or seed phrase. Bitcoin is locked in smart contracts onchain.' },
  { q: 'What currency can I get my loan in?', a: 'Loans are funded in Bitcoin and settled in Bitcoin.' },
  { q: 'How long does it take to get a loan?', a: 'Minutes. Funding transactions are broadcast as soon as the contracts are signed.' },
  { q: 'Is there a credit check?', a: 'No. Your bitcoin is your credit.' },
  { q: 'How do I get a Bitcoin-backed loan?', a: 'Register online at cadenabitcoin.com and get started in minutes.' },
]

const openSet = ref(new Set([0]))
const isOpen = (i) => openSet.value.has(i)
function toggle(i) {
  const s = new Set(openSet.value)
  s.has(i) ? s.delete(i) : s.add(i)
  openSet.value = s
}

function onEnter(el) {
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.willChange = 'height,opacity'
  void el.offsetHeight
  el.style.transition = 'height 300ms cubic-bezier(.22,.61,.36,1), opacity 220ms ease-out'
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
}
function onAfterEnter(el) {
  el.style.transition = ''
  el.style.height = 'auto'
  el.style.willChange = ''
}
function onBeforeLeave(el) {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  el.style.willChange = 'height,opacity'
  void el.offsetHeight
}
function onLeave(el) {
  el.style.transition = 'height 300ms cubic-bezier(.22,.61,.36,1), opacity 200ms ease-in'
  el.style.height = '0px'
  el.style.opacity = '0'
}
function onAfterLeave(el) {
  el.style.transition = ''
  el.style.willChange = ''
}
</script>

<style scoped>
/* Page background: black base + bottom-anchored purple glow */
.bg-page-gradient{
  background-color: #000;
  background-image:
    radial-gradient(
      125% 75% at 50% 100%,
      rgba(103,56,228,0.58) 0%,
      rgba(103,56,228,0.36) 26%,
      rgba(103,56,228,0.16) 52%,
      rgba(0,0,0,0) 76%
    );
}

@supports (background: radial-gradient(in oklch, black, white)) {
  .bg-page-gradient{
    background-color: oklch(0 0 0);
    background-image:
      radial-gradient(
        in oklch 125% 75% at 50% 100%,
        oklch(from #6738e4 l c h / 0.60) 0%,
        oklch(from #6738e4 l c h / 0.36) 26%,
        oklch(from #6738e4 l c h / 0.16) 52%,
        oklch(0 0 0 / 0) 76%
      );
  }
}

@media (max-height: 800px){
  .bg-page-gradient{
    background-image:
      radial-gradient(
        120% 60% at 50% 100%,
        rgba(103,56,228,0.52) 0%,
        rgba(103,56,228,0.30) 24%,
        rgba(103,56,228,0.12) 48%,
        rgba(0,0,0,0) 70%
      );
  }
}

.faq-panel { overflow: hidden; background: transparent; border: 0; }
</style>

<!-- smooth scroll must be global, not scoped -->
<style>
html { scroll-behavior: smooth; }
</style>
