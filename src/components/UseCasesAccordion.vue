<template>
  <section class="w-full px-6 py-5 md:py-8" aria-labelledby="usecases-title">
    <div class="max-w-6xl mx-auto space-y-8">
      <h2 id="usecases-title" class="section-title text-center">Use cases</h2>

      <div class="hc-wrap" ref="wrapRef">
        <!-- Tabs / cards -->
        <div
          class="hc-list"
          role="tablist"
          aria-label="Use case list"
          @keydown="onKeydown"
        >
          <button
            v-for="(uc, idx) in items"
            :key="uc.id ?? idx"
            class="pro-card hc-card group"
            :class="{ 'is-active': active === idx }"
            role="tab"
            :id="tabId(idx)"
            :tabindex="active === null ? (idx === 0 ? 0 : -1) : (active === idx ? 0 : -1)"
            :aria-selected="active === idx ? 'true' : 'false'"
            :aria-controls="panelId"
            @click="onClick(idx)"
            v-reveal="{ delay: idx * 60 }"
          >
            <div class="hc-title">{{ uc.title }}</div>

            <ChevronDown
              class="chev w-5 h-5 shrink-0 ml-auto transition-transform duration-200"
              :class="{ 'rotate-180': active === idx }"
              aria-hidden="true"
            />
          </button>
        </div>

        <!-- Expanding panel (auto-height, buttery) -->
        <transition v-bind="autoHeight">
          <div
            v-if="active !== null"
            class="pro-card hc-panel is-panel"
            role="tabpanel"
            :id="panelId"
            :aria-labelledby="tabId(active)"
            key="hc-panel"
          >
            <div class="hc-panel-header md:hidden">
              <span class="hc-title">{{ items[active].title }}</span>
            </div>

            <div class="mt-2 text-white leading-relaxed">
              <div v-if="typeof items[active].content === 'string'" v-html="items[active].content" />
              <component v-else :is="items[active].content" />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  items: { type: Array, default: () => [] }, // [{ id?, title, content, open? }]
})

/** Active index (respects any {open:true}) */
const initial = Math.max(0, props.items.findIndex(i => i?.open === true))
const active = ref(initial >= 0 ? initial : null)

/** Stable ids for a11y */
const uid = Math.random().toString(36).slice(2)
const panelId = `uc-panel-${uid}`
const tabId = (i) => `uc-tab-${uid}-${i}`

/** Wrap ref + layout shift lock */
const wrapRef = ref(null)
let ro // ResizeObserver
let locking = false

function lockLayoutShiftStart() {
  if (!wrapRef.value) return { top: 0 }
  return { top: wrapRef.value.getBoundingClientRect().top }
}
function lockLayoutShiftEnd(before) {
  if (!wrapRef.value) return
  const afterTop = wrapRef.value.getBoundingClientRect().top
  const delta = afterTop - before.top
  if (delta !== 0) {
    // hard jump so it feels anchored (no smooth)
    window.scrollTo(0, window.scrollY + delta)
  }
}

/** Toggle with layout-shift lock */
async function onClick(i) {
  if (locking) return
  locking = true
  const before = lockLayoutShiftStart()

  toggle(i)

  // Let Vue flush & transition set initial styles
  await nextTick()
  await new Promise(r => requestAnimationFrame(r))
  await new Promise(r => requestAnimationFrame(r)) // Safari/iOS settle

  lockLayoutShiftEnd(before)
  locking = false
}

function toggle(i) {
  active.value = active.value === i ? null : i
}

function focusTab(i) {
  const el = document.getElementById(tabId(i))
  if (el && el.focus) el.focus({ preventScroll: true })
}

/** Keyboard: Left/Right/Home/End, Space/Enter */
function onKeydown(e) {
  const count = props.items.length
  if (!count) return
  const idx = active.value === null ? 0 : active.value

  switch (e.key) {
    case 'ArrowRight':
    case 'Right': {
      e.preventDefault()
      const next = (idx + 1) % count
      active.value = next
      focusTab(next)
      break
    }
    case 'ArrowLeft':
    case 'Left': {
      e.preventDefault()
      const prev = (idx - 1 + count) % count
      active.value = prev
      focusTab(prev)
      break
    }
    case 'Home': {
      e.preventDefault()
      active.value = 0
      focusTab(0)
      break
    }
    case 'End': {
      e.preventDefault()
      active.value = count - 1
      focusTab(count - 1)
      break
    }
    case ' ':
    case 'Enter': {
      e.preventDefault()
      active.value = active.value === idx ? null : idx
      break
    }
  }
}

/** Auto-height transition (smooth open/close) */
const autoHeight = {
  onBeforeEnter(el) {
    el.style.height = '0px'
    el.style.opacity = '0'
    el.style.overflow = 'hidden'
    el.style.willChange = 'height, opacity'
  },
  onEnter(el, done) {
    const target = el.scrollHeight
    el.style.transition = 'height 320ms cubic-bezier(.2,.65,.2,1), opacity 220ms ease'
    requestAnimationFrame(() => {
      el.style.height = target + 'px'
      el.style.opacity = '1'
      const end = () => {
        el.style.height = ''
        el.style.overflow = ''
        el.style.willChange = ''
        el.style.opacity = ''  // clear any fractional value
        el.removeEventListener('transitionend', end)
        done()
      }
      el.addEventListener('transitionend', end)
    })
  },
  onBeforeLeave(el) {
    el.style.height = el.scrollHeight + 'px'
    el.style.overflow = 'hidden'
    el.style.willChange = 'height, opacity'
  },
  onLeave(el, done) {
    el.style.transition = 'height 260ms cubic-bezier(.2,.65,.2,1), opacity 200ms ease'
    requestAnimationFrame(() => {
      el.style.height = '0px'
      el.style.opacity = '0'
      const end = () => {
        el.style.willChange = ''
        el.removeEventListener('transitionend', end)
        done()
      }
      el.addEventListener('transitionend', end)
    })
  },
}

/** Reveal directive */
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
defineExpose({ vReveal })

onMounted(() => {
  // Fallback guard: if any resize nudges layout during/after transition, re-anchor.
  if ('ResizeObserver' in window && wrapRef.value) {
    let lastTop = wrapRef.value.getBoundingClientRect().top
    ro = new ResizeObserver(() => {
      if (!wrapRef.value) return
      const nowTop = wrapRef.value.getBoundingClientRect().top
      const delta = nowTop - lastTop
      if (delta !== 0 && !locking) {
        window.scrollTo(0, window.scrollY + delta)
      }
      lastTop = wrapRef.value.getBoundingClientRect().top
    })
    ro.observe(wrapRef.value)
  }
})
onBeforeUnmount(() => {
  if (ro && wrapRef.value) ro.disconnect()
})
</script>

<style scoped>
/* ---- Title ---- */
.section-title{
  margin-top: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-size: clamp(2rem, 4vw + 1rem, 3.5rem);
}

/* ---- Layout ---- */
.hc-wrap { display: grid; gap: 1rem; overflow-anchor: none; }

/* Row of cards: grid on md+, horizontal scroll (snap) on mobile */
.hc-list{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
  gap: .75rem;
}
@media (max-width: 767px){
  .hc-list{
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(84%, 1fr);
    overflow-x: auto;
    gap: .75rem;
    padding-bottom: .25rem;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
  .hc-card{ scroll-snap-align: start; }
}

/* ---- Cards (tabs) ---- */
.hc-card{
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: 1rem 1.1rem;
  text-align: left;
  border-radius: 1rem;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
  color: #fff;
}
.hc-card:focus-visible{
  outline: 2px solid rgba(255,255,255,.9);
  outline-offset: 2px;
}
.hc-title{
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.15;
  font-size: clamp(1rem, .7vw + .9rem, 1.25rem);
  color: #fff;
}

/* Active highlight */
.hc-card.is-active{
  border-color: rgba(103,56,228,.55);
  background: #0b0b0f; /* solid to avoid tint */
  box-shadow: 0 14px 36px rgba(103,56,228,.20), 0 10px 24px rgba(0,0,0,.25);
}

/* ---- Panel below the row ---- */
.hc-panel{
  padding: 1.25rem;
  border-radius: 1.1rem;
  background: #1a1330; /* solid dark, no milk-glass */
  border: 1px solid rgba(103,56,228,.38);
  color: #fff;
}

/* Keep decorative gradient UNDER the content */
.pro-card,
.hc-panel { position: relative; color: #fff; }
.pro-card::before,
.hc-panel.is-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(151, 107, 217, 0.28), rgba(255,255,255,0.08));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  pointer-events: none;
  z-index: 0; /* <- under content */
}
.pro-card > *,
.hc-panel > * { position: relative; z-index: 1; }

/* Remove glass blur on cards so text stays crisp */
.pro-card {
  background: #0b0b0f;           /* solid */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: 1px solid rgba(255,255,255,.16);
  box-shadow: 0 12px 30px rgba(0,0,0,.25);
}

/* Subtle hover */
.hc-card:hover{
  transform: translateY(-2px);
  background: #111118;
  border-color: rgba(255,255,255,.22);
  box-shadow: 0 16px 36px rgba(0,0,0,.28);
}

/* Panel header and nested content inherit white */
.hc-panel-header{ display:flex; align-items:center; gap:.5rem; margin-bottom:.25rem; }
.hc-panel .hc-title{
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.15;
  font-size: clamp(1.1rem, .9vw + 1rem, 1.4rem);
}
.hc-panel * { color: inherit; }

/* ---- Reveal animation ---- */
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
.reveal.in { opacity: 1; transform: none; filter: none; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; opacity: 1; transform: none; filter: none; }
}
</style>
