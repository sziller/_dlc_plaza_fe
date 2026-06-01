<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const containerRef = ref(null)

let renderer, scene, camera, chainGroup
let animFrameId
let chainPhase = 0
const links = []

const LINK_COUNT = 16   // must be even for correct rotation parity on wrap
const SPACING    = 0.84
const TOTAL_SPAN = LINK_COUNT * SPACING
const SPEED      = 0.028
let resizeObserver = null

function createLinkCurve(halfLen, endRadius, N = 22) {
  const pts = []
  for (let i = 0; i <= N; i++) {
    const a = Math.PI - (Math.PI * i / N)
    pts.push(new THREE.Vector3(endRadius * Math.cos(a), halfLen + endRadius * Math.sin(a), 0))
  }
  for (let i = 0; i <= N; i++) {
    const a = -(Math.PI * i / N)
    pts.push(new THREE.Vector3(endRadius * Math.cos(a), -halfLen + endRadius * Math.sin(a), 0))
  }
  return new THREE.CatmullRomCurve3(pts, true)
}

function makeChainLink(isRotated) {
  const curve = createLinkCurve(0.40, 0.28)
  const geo = new THREE.TubeGeometry(curve, 100, 0.08, 10, true)
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x9966ff),
    metalness: 0.92,
    roughness: 0.10,
    emissive: new THREE.Color(0x3311aa),
    emissiveIntensity: 0.20,
  })
  const mesh = new THREE.Mesh(geo, mat)
  if (isRotated) mesh.rotation.y = Math.PI / 2
  return mesh
}

function init() {
  const el = containerRef.value
  if (!el) return
  const w = el.clientWidth || 210
  const h = el.clientHeight || 600

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(w, h)
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  el.appendChild(renderer.domElement)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 100)
  camera.position.set(0, 0, 4.0)
  camera.lookAt(0, 0, 0)

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.5)
  keyLight.position.set(2, 5, 3)
  scene.add(keyLight)

  const ambient = new THREE.AmbientLight(0xffffff, 0.35)
  scene.add(ambient)

  const rimLight = new THREE.DirectionalLight(0xcc99ff, 2.5)
  rimLight.position.set(-3, 0, -3)
  scene.add(rimLight)

  const fillPt = new THREE.PointLight(0x6633cc, 1.4, 20)
  fillPt.position.set(0, 0, 3)
  scene.add(fillPt)

  chainGroup = new THREE.Group()
  chainGroup.scale.set(0.55, 0.55, 0.55)  // smaller
  chainGroup.rotation.y = 0.30
  chainGroup.rotation.z = 0.82   // steep angle toward upper-left / center
  chainGroup.position.x = 0.9   // start right, travel toward center as it rises

  for (let i = 0; i < LINK_COUNT; i++) {
    const link = makeChainLink(i % 2 === 1)
    link.position.y = i * SPACING - TOTAL_SPAN / 2
    links.push(link)
    chainGroup.add(link)
  }

  scene.add(chainGroup)

  resizeObserver = new ResizeObserver(() => {
    const w2 = el.clientWidth
    const h2 = el.clientHeight
    if (!w2 || !h2) return
    camera.aspect = w2 / h2
    camera.updateProjectionMatrix()
    renderer.setSize(w2, h2)
  })
  resizeObserver.observe(el)
}

function animate() {
  animFrameId = requestAnimationFrame(animate)

  chainPhase = (chainPhase + SPEED) % TOTAL_SPAN

  for (let i = 0; i < LINK_COUNT; i++) {
    // Each link scrolls upward; wrap back to bottom when it exits the top
    let y = (i * SPACING - TOTAL_SPAN / 2) + chainPhase
    y = ((y + TOTAL_SPAN / 2) % TOTAL_SPAN + TOTAL_SPAN) % TOTAL_SPAN - TOTAL_SPAN / 2
    links[i].position.y = y
  }

  renderer.render(scene, camera)
}

onMounted(() => {
  init()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animFrameId)
  resizeObserver?.disconnect()
  renderer?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="w-full h-full" />
</template>
