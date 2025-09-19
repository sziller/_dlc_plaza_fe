<template>
  <section class="w-full px-6 py-5 md:py-5" aria-labelledby="usecases-title">
    <div class="max-w-6xl mx-auto space-y-8">
      <h2 id="usecases-title" class="section-title text-center">Use cases</h2>

      <!-- Stacked list, consistent spacing -->
      <ul class="space-y-4">
        <li v-for="(uc, idx) in items" :key="uc.id ?? idx">
          <details
            class="pro-card group reveal"
            :open="uc.open === true"
            v-reveal="{ delay: idx * 60 }"
          >
            <summary
              class="flex items-start justify-between gap-4 cursor-pointer list-none select-none"
              :aria-controls="`uc-panel-${idx}`"
            >
              <div>
                <!-- ⬇️ Bigger title -->
                <h3 class="uc-title">{{ uc.title }}</h3>
                <p class="teaser text-sm text-white/70 mt-1">{{ uc.teaser }}</p>
              </div>
              <ChevronDown
                class="chev w-5 h-5 shrink-0 transition-transform duration-200"
                aria-hidden="true"
              />
            </summary>

            <div
              class="mt-4 text-white/90 leading-relaxed"
              :id="`uc-panel-${idx}`"
            >
              <!-- Render HTML strings properly -->
              <div v-if="typeof uc.content === 'string'" v-html="uc.content" />
              <component v-else :is="uc.content" />
            </div>
          </details>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'

defineProps({
  // [{ id?, title, teaser, content, open? }, ...]
  items: { type: Array, default: () => [] },
})

/** Local reveal directive (mirrors your page’s behavior) */
const vReveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    const d = Number(binding?.value?.delay ?? 0)
    const delay = Number.isFinite(d) && d >= 0 && d <= 2000 ? d : 0
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
/* Title style to match the page */
.section-title{
  margin-top: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-size: clamp(2rem, 4vw + 1rem, 3.5rem);
}

/* ⬇️ Bigger per-item titles */
.uc-title{
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.15;
  /* ~text-2xl to text-3xl across breakpoints */
  font-size: clamp(1.5rem, 1.1vw + 1.2rem, 2rem);
  margin: 0;
}

/* Clamp teaser to a single line */
.teaser{
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Rotate chevron when open */
details[open] .chev { transform: rotate(180deg); }

/* Tidy summary marker + focus */
summary::-webkit-details-marker { display: none; }
summary { outline: none; }

/* Glass card look — matches your global “pro-card” */
.pro-card {
  position: relative;
  border-radius: 1.25rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: saturate(120%) blur(10px);
  -webkit-backdrop-filter: saturate(120%) blur(10px);
  box-shadow: 0 12px 30px rgba(0,0,0,.25);
  border: 1px solid rgba(255,255,255,.16);
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
}
.pro-card::before{
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(151, 107, 217, 0.28), rgba(255,255,255,0.08));
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
.pro-card:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,.10);
  border-color: rgba(255,255,255,.22);
  box-shadow: 0 16px 36px rgba(0,0,0,.28);
}

/* Reveal animation (matched to page) */
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
@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; opacity: 1; transform: none; filter: none; }
}

/* Ensure CTAs inside v-html look right even with scoped styles elsewhere */
:global(.btn-primary){
  display: inline-flex; align-items: center; justify-content: center;
  padding: .625rem 1rem; border-radius: .75rem;
  background: #6738e4; color: white; font-weight: 600;
  box-shadow: 0 6px 14px rgba(103,56,228,.35);
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
:global(.btn-primary:hover){ transform: translateY(-1px); box-shadow: 0 8px 18px rgba(103,56,228,.45); }
:global(.btn-primary:focus-visible){ outline: 2px solid rgba(255,255,255,.9); outline-offset: 2px; }

:global(.btn-ghost){
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .6rem .9rem; border-radius: .75rem;
  background: rgba(255,255,255,0.10); color: white;
  border: 1px solid rgba(255,255,255,0.18);
  transition: transform .15s ease, background .15s ease, border-color .15s ease;
}
:global(.btn-ghost:hover){ transform: translateY(-1px); background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.24); }
:global(.btn-ghost:focus-visible){ outline: 2px solid rgba(255,255,255,.85); outline-offset: 2px; }
</style>
