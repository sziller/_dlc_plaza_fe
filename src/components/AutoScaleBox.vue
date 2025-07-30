<template>
  <div ref="outer" class="w-full h-full relative overflow-hidden">
    <div
      class="origin-top-left"
      :style="{
        width: baseWidth + 'px',
        height: baseHeight + 'px',
        transform: `scale(${scale})`
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  baseWidth:  { type: Number, required: true },  // natural content width
  baseHeight: { type: Number, required: true },  // natural content height
  maxScale:   { type: Number, default: 1 },      // never upscale by default
  minScale:   { type: Number, default: 0.5 },
})

const outer = ref(null)
const scale = ref(1)
let ro

function recompute () {
  if (!outer.value) return
  const cw = outer.value.clientWidth
  const ch = outer.value.clientHeight
  const s = Math.min(cw / props.baseWidth, ch / props.baseHeight, props.maxScale)
  scale.value = Math.max(props.minScale, s)
}

onMounted(() => {
  ro = new ResizeObserver(recompute)
  ro.observe(outer.value)
  recompute()
})

onBeforeUnmount(() => {
  if (ro) ro.disconnect()
})
</script>
