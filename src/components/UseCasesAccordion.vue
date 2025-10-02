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

        <!-- Active title OUTSIDE the card when expanded -->
        <div v-if="active !== null" class="hc-active-title" aria-live="polite">
          <h3 class="hc-title-out">{{ items[active].title }}</h3>
        </div>

        <!-- Expanding panel (auto-height, smoother) -->
        <transition v-bind="autoHeight">
          <div
            v-if="active !== null"
            class="pro-card hc-panel is-panel"
            role="tabpanel"
            :id="panelId"
            :aria-labelledby="tabId(active)"
            key="hc-panel"
          >
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
const firstOpen = props.items.findIndex(i => i?.open === true)
const active = ref(firstOpen >= 0 ? firstOpen : null)

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
  if (delta !== 0) window.scrollTo(0, window.scrollY + delta)
}

/** Toggle with layout-shift lock */
async function onClick(i) {
  if (locking) return
  locking = true
  const before = lockLayoutShiftStart()

  toggle(i)

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

/** Auto-height transition — smoother (longer + slight translate) */
// Replace your existing autoHeight with this
const autoHeight = {
  onBeforeEnter(el) {
    el.style.height = '0px'
    el.style.opacity = '0'
    el.style.transform = 'translateY(-6px)'
    el.style.overflow = 'hidden'
    el.__ro && el.__ro.disconnect()
    el.__ro = null
  },
  onEnter(el, done) {
    // Smooth, springy-ish curve + slightly longer height tween
    const heightEase = 'cubic-bezier(.22,.61,.36,1)'
    el.style.transition = `height 420ms ${heightEase}, opacity 360ms ease, transform 420ms ${heightEase}`

    // Live-track changes to scrollHeight during the animation
    const ro = new ResizeObserver(() => {
      // update target height as content grows (e.g., fonts/images/slots finish)
      el.style.height = el.scrollHeight + 'px'
    })
    ro.observe(el)
    el.__ro = ro

    // Kick it off
    requestAnimationFrame(() => {
      el.style.height = el.scrollHeight + 'px'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })

    const end = (evt) => {
      if (evt.propertyName !== 'height') return
      ro.disconnect()
      el.__ro = null

      // Prevent the "auto" snap: temporarily remove height transition
      const prev = el.style.transition
      el.style.transition = 'opacity 200ms ease, transform 200ms ease'
      el.style.height = 'auto'

      // Let styles settle, then restore transition for future cycles
      requestAnimationFrame(() => {
        el.style.transition = prev
        el.style.overflow = '' // cleanup
        done()
      })

      el.removeEventListener('transitionend', end)
    }
    el.addEventListener('transitionend', end)
  },
  onBeforeLeave(el) {
    // Lock current height as the start point
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
    el.style.overflow = 'hidden'
    if (el.__ro) { el.__ro.disconnect(); el.__ro = null }
  },
  onLeave(el, done) {
    const heightEase = 'cubic-bezier(.22,.61,.36,1)'
    el.style.transition = `height 340ms ${heightEase}, opacity 260ms ease, transform 340ms ${heightEase}`
    requestAnimationFrame(() => {
      el.style.height = '0px'
      el.style.opacity = '0'
      el.style.transform = 'translateY(-6px)'
    })
    const end = (evt) => {
      if (evt.propertyName !== 'height') return
      el.removeEventListener('transitionend', end)
      done()
    }
    el.addEventListener('transitionend', end)
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
  if ('ResizeObserver' in window && wrapRef.value) {
    let lastTop = wrapRef.value.getBoundingClientRect().top
    ro = new ResizeObserver(() => {
      if (!wrapRef.value) return
      const nowTop = wrapRef.value.getBoundingClientRect().top
      const delta = nowTop - lastTop
      if (delta !== 0 && !locking) window.scrollTo(0, window.scrollY + delta)
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
.pro-card,
.hc-card{
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: 1rem 1.1rem;
  text-align: left;
  border-radius: 1rem;
  color: #fff;
  background: #0A1123;
  border: 1px solid #8387C4;
  box-shadow: 0 12px 30px rgba(0,0,0,.25);
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease, opacity .18s ease;
}
.pro-card::before,
.hc-card::before { content: none !important; }

/* Hide the title INSIDE the active card (keep layout space) */
.hc-card.is-active .hc-title{
  opacity: 0;
}

/* Hover/focus */
.hc-card:hover{
  transform: translateY(-2px);
  border-color: #A4A8D6;
  box-shadow: 0 16px 36px rgba(0,0,0,.28);
}
.hc-card:focus-visible{
  outline: 2px solid #A4A8D6;
  outline-offset: 2px;
}

.hc-title{
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.15;
  font-size: clamp(1rem, .7vw + .9rem, 1.25rem);
  color: #fff;
}

/* ---- Active title OUTSIDE the cards ---- */
.hc-active-title{
  margin-top: .25rem;
  margin-bottom: .25rem;
}
.hc-title-out{
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.15;
  font-size: clamp(1.2rem, 1vw + 1.1rem, 1.6rem);
  color: #A4A8D6; /* accent pop */
}

/* ---- Panel below the row ---- */
.hc-panel{
  padding: 1.25rem;
  border-radius: 1.1rem;
  background: #0A1123;
  border: 1px solid #8387C4;
  color: #fff;
  box-shadow: 0 12px 30px rgba(0,0,0,.25);
}
.hc-panel::before { content: none !important; }

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

/* Chevron accent when active */
.chev { color: #fff; }
.hc-panel {
  contain: layout paint;   /* isolates layout/paint during the transition */
  will-change: height, opacity, transform;
}
</style>
