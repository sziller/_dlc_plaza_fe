<template>
  <!-- Gradient Wrapper -->
  <div class="min-h-screen text-white relative overflow-hidden">
    <!-- Background gradient + soft glows -->
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
    <div class="pointer-events-none absolute -z-10 blur-3xl opacity-50"
         style="inset:auto auto 10% -10%; width:50rem; height:20rem; background:radial-gradient(40% 60% at 50% 50%, #7c5cff55, transparent 70%)"></div>
    <div class="pointer-events-none absolute -z-10 blur-3xl opacity-40"
         style="inset:10% -10% auto auto; width:40rem; height:18rem; background:radial-gradient(40% 60% at 50% 50%, #16b1ff44, transparent 70%)"></div>

    <!-- Onboarding Section -->
    <section class="w-full pt-28 md:pt-32" aria-labelledby="onboarding-title">
      <div class="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 space-y-10">

        <!-- Eyebrow + Title + Lead -->
        <div class="text-center" v-reveal>
          

          <h1 id="onboarding-title" class="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Personalized Onboarding
          </h1>

          <p class="mt-4 text-base md:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto">
            As a Cadena Bitcoin client, expert knowledge is always just a chat, email, or phone call away.
            We simplify complexity and are available 24/7 for personalized onboarding and strategies to
            borrow Bitcoin or generate yield from Bitcoin.
          </p>
        </div>

        <!-- Contact Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- Call -->
          <div class="pro-card group" v-reveal="{ delay: 60 }">
            <div class="flex items-start gap-4">
              <div class="icon-wrap">
                <Phone class="w-5 h-5" aria-hidden="true" />
              </div>
              <div class="flex-1">
                <h4 class="text-2xl font-semibold">Call</h4>
                <p class="text-sm text-white/70 mt-1">Speak to our team anytime.</p>

                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href="tel:+13058311410"
                    class="btn-primary"
                    aria-label="Call (305) 831-1410"
                  >
                    (305) 831-1410
                  </a>

                  <button
                    @click="copyPhone"
                    class="btn-ghost"
                    :aria-label="copiedPhone ? 'Copied phone number' : 'Copy phone number'"
                  >
                    <component :is="copiedPhone ? Check : Copy" class="w-4 h-4" />
                    <span class="text-sm font-medium">{{ copiedPhone ? 'Copied' : 'Copy' }}</span>
                  </button>
                </div>

                <div class="mt-4 flex items-center gap-3 text-xs text-white/60">
                  <span class="inline-flex items-center gap-1">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-400/80"></span> Live support
                  </span>
                  <span>Response time: &lt; 24h</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="pro-card group" v-reveal="{ delay: 100 }">
            <div class="flex items-start gap-4">
              <div class="icon-wrap">
                <Mail class="w-5 h-5" aria-hidden="true" />
              </div>
              <div class="flex-1">
                <h4 class="text-2xl font-semibold">Email</h4>
                <p class="text-sm text-white/70 mt-1">Send us your questions or request onboarding.</p>

                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href="mailto:info@cadenabitcoin.com"
                    class="btn-primary"
                    aria-label="Email info@cadenabitcoin.com"
                  >
                    info@cadenabitcoin.com
                  </a>

                  <button
                    @click="copyEmail"
                    class="btn-ghost"
                    :aria-label="copiedEmail ? 'Copied email' : 'Copy email'"
                  >
                    <component :is="copiedEmail ? Check : Copy" class="w-4 h-4" />
                    <span class="text-sm font-medium">{{ copiedEmail ? 'Copied' : 'Copy' }}</span>
                  </button>
                </div>

                <div class="mt-4 flex items-center gap-3 text-xs text-white/60">
                  <span>Dedicated onboarding specialist</span>
                  <span aria-hidden="true">•</span>
                  <span>Secure &amp; private</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Who we serve -->
    <section class="w-full px-6 py-16 md:py-20">
      <div class="max-w-6xl mx-auto">
        <h2 class="reveal text-4xl font-extrabold mb-12 text-center" v-reveal>Who we serve.</h2>

        <div class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="reveal glass-tile card-tight text-center group" v-reveal="{ delay: 40 }">
              <User class="w-8 h-8 mx-auto mb-3 text-white/80 group-hover:text-white" aria-hidden="true" />
              <p class="text-xl font-semibold">Private Clients</p>
            </div>
            <div class="reveal glass-tile card-tight text-center group" v-reveal="{ delay: 90 }">
              <Users class="w-8 h-8 mx-auto mb-3 text-white/80 group-hover:text-white" aria-hidden="true" />
              <p class="text-xl font-semibold">Family Offices</p>
            </div>
            <div class="reveal glass-tile card-tight text-center group" v-reveal="{ delay: 140 }">
              <Building2 class="w-8 h-8 mx-auto mb-3 text-white/80 group-hover:text-white" aria-hidden="true" />
              <p class="text-xl font-semibold">Institutional Investors</p>
            </div>
          </div>

          <div class="reveal glass-card text-center" v-reveal="{ delay: 180 }">
            <p class="text-2xl text-white/90">
              Get expert support and competitive rates for Bitcoin borrowing and lending.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Reach Out -->
    <section class="w-full px-6 pb-16 md:pb-24">
      <div class="max-w-6xl mx-auto space-y-12">
        <h2 class="reveal text-4xl font-extrabold text-center" v-reveal>Reach Out</h2>

        <!-- Socials -->
        <div class="reveal glass-card" v-reveal="{ delay: 60 }">
          <p class="text-2xl font-semibold mb-8 text-center">Find Us On Social Media</p>
          <div class="flex flex-wrap items-center justify-center gap-10 md:gap-12">
            <a href="https://x.com/cadenabitcoin" target="_blank" rel="noopener noreferrer"
               aria-label="Visit us on X (Twitter)"
               class="social-tile">
              <i-simple-icons-x class="w-16 h-16 md:w-20 md:h-20" aria-hidden="true" />
              <span class="text-base font-medium">X</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer"
               aria-label="Visit our GitHub"
               class="social-tile">
              <i-simple-icons-github class="w-16 h-16 md:w-20 md:h-20" aria-hidden="true" />
              <span class="text-base font-medium">GitHub</span>
            </a>
            <a href="https://youtube.com/@cadenabitcoin?si=VNgOLehpTTVFELbt" target="_blank" rel="noopener noreferrer"
               aria-label="Visit our YouTube"
               class="social-tile">
              <i-simple-icons-youtube class="w-16 h-16 md:w-20 md:h-20" aria-hidden="true" />
              <span class="text-base font-medium">YouTube</span>
            </a>
          </div>
        </div>

        <!-- Contacts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="reveal glass-card" v-reveal="{ delay: 80 }">
            <p class="text-xl font-semibold mb-2">Kevin Bell</p>
            <p class="text-sm text-white/70 mb-2">President</p>
            <p>
              <span class="font-medium">Email:</span>
              <a href="mailto:kevin@cadenabitcoin.com" class="underline hover:opacity-80">kevin@cadenabitcoin.com</a>
            </p>
            <p class="mt-1">
              <span class="font-medium">Phone:</span>
              <a href="tel:+13058311410" class="underline hover:opacity-80">305-831-1410</a>
            </p>
          </div>

          <div class="reveal glass-card" v-reveal="{ delay: 120 }">
            <p class="text-xl font-semibold mb-2">Sziller</p>
            <p class="text-sm text-white/70 mb-2">Chief Technology Officer</p>
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
import { User, Users, Building2, Copy, Check, Phone, Mail } from 'lucide-vue-next'

/** Copy states */
const copiedEmail = ref(false)
const copiedPhone = ref(false)

/** Legacy single-flag (kept for backward compatibility if another part of the page uses it) */
const copied = ref(false)

/** Copy helpers */
function copyEmail() {
  copyToClipboard('info@cadenabitcoin.com', copiedEmail)
}
function copyPhone() {
  copyToClipboard('+13058311410', copiedPhone)
}
function copyToClipboard(text, flagRef) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => flash(flagRef))
      .catch(() => fallbackCopy(text, flagRef))
  } else {
    fallbackCopy(text, flagRef)
  }
}
function fallbackCopy(text, flagRef) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'absolute'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
    flash(flagRef)
  } finally {
    document.body.removeChild(ta)
  }
}
/** Flip both the granular flag and the legacy 'copied' for 1.5s */
function flash(flagRef) {
  flagRef.value = true
  copied.value = true
  setTimeout(() => {
    flagRef.value = false
    copied.value = false
  }, 1500)
}

onMounted(() => {
  window.scrollTo(0, 0)
})

/** Intersection-based reveal directive (stagger-friendly)
 *  Usage: v-reveal or v-reveal="{ delay: 120 }"
 */
const vReveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    const delay = binding?.value?.delay ?? 0
    el.style.transitionDelay = `${delay}ms`
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('in')
        io.unobserve(el)
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 })
    io.observe(el)
  }
}
</script>

<style scoped>
/* ===== Unify all boxes to the pro-card look ===== */
.pro-card,
.glass-card,
.glass-tile,
.social-tile {
  position: relative;
  border-radius: 1.25rem; /* ~rounded-2xl */
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
}
.pro-card::before,
.glass-card::before,
.glass-tile::before,
.social-tile::before {
  /* gradient ring */
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.08));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  pointer-events: none;
}
.pro-card:hover,
.glass-card:hover,
.glass-tile:hover,
.social-tile:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.10);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
}

/* Icon puck (lifts on any card hover) */
.icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px; height: 44px;
  border-radius: 0.875rem; /* rounded-xl */
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  transition: transform .18s ease, background .18s ease;
}
.pro-card:hover .icon-wrap,
.glass-card:hover .icon-wrap,
.glass-tile:hover .icon-wrap,
.social-tile:hover .icon-wrap {
  transform: translateY(-1px);
  background: rgba(255,255,255,0.16);
}

/* Primary + ghost buttons */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  padding: .625rem 1rem; border-radius: .75rem;
  background: #6738e4; color: white; font-weight: 600;
  box-shadow: 0 6px 14px rgba(103,56,228,.35);
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(103,56,228,.45); }
.btn-primary:focus-visible { outline: 2px solid rgba(255,255,255,.9); outline-offset: 2px; }

.btn-ghost {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .6rem .9rem; border-radius: .75rem;
  background: rgba(255,255,255,0.10); color: white;
  border: 1px solid rgba(255,255,255,0.18);
  transition: transform .15s ease, background .15s ease, border-color .15s ease;
}
.btn-ghost:hover { transform: translateY(-1px); background: rgba(255,255,255,0.14); }

/* Social tiles keep vertical layout with same shell */
.social-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .75rem;
  text-align: center;
}

/* Tighter padding option for small tiles */
.card-tight { padding: 1rem; }

/* ===== Scroll reveal ===== */
.reveal {
  opacity: 0;
  transform: translateY(14px) scale(0.995);
  filter: blur(6px);
  transition:
    opacity .7s cubic-bezier(.2,.65,.2,1),
    transform .7s cubic-bezier(.2,.65,.2,1),
    filter .6s ease;
  will-change: opacity, transform, filter;
}
.reveal.in {
  opacity: 1;
  transform: none;
  filter: none;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; opacity: 1; transform: none; filter: none; }
  .pro-card, .btn-primary, .btn-ghost, .social-tile, .icon-wrap { transition: none; }
}

/* Tweak default gradient shadows for legibility */
:deep(h1), :deep(h2), :deep(p), :deep(a), :deep(span) { text-shadow: 0 0 0 transparent; }
</style>
