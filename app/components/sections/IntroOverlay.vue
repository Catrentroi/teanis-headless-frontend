<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits<{ complete: [] }>()

const isVisible = ref(true)
const overlayRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null
let hasCompleted = false

function unlockScroll() {
  if (!import.meta.client) return
  document.documentElement.style.overflow = ''
  const { $lenis } = useNuxtApp() as { $lenis?: { start: () => void } }
  $lenis?.start()
}

function finishIntro() {
  if (hasCompleted) return
  hasCompleted = true
  unlockScroll()
  isVisible.value = false
  emit('complete')
}

function skipIntro() {
  ctx?.kill()
  finishIntro()
}

onMounted(() => {
  if (!import.meta.client || !overlayRef.value) return

  const { $lenis } = useNuxtApp() as { $lenis?: { stop: () => void } }
  $lenis?.stop()
  document.documentElement.style.overflow = 'hidden'

  ctx = gsap.context(() => {
    const lCyan = '.intro-block-cyan'
    const lBlue = '.intro-block-blue'
    const lOrange = '.intro-block-orange'
    const blocks = [lCyan, lBlue, lOrange]

    // Initial states (single set of 3 clean rounded rectangles — shared 3D stage perspective):
    gsap.set(lCyan, { x: -240, y: 0, rotation: 0, rotateY: 0, scaleX: 1, scaleY: 1, opacity: 0, scale: 0.92 })
    gsap.set(lBlue, { x: 58, y: -30, rotation: 0, rotateY: 0, scaleX: 1, scaleY: 1, opacity: 0, scale: 0.9 })
    gsap.set(lOrange, { x: 0, y: 42, rotation: 0, rotateY: 0, scaleX: 1, scaleY: 1, opacity: 0, scale: 0.9 })
    gsap.set('.wind-streak', { scaleX: 0.2, opacity: 0, x: -180 })

    const tl = gsap.timeline()

    // Phase 1 (0.0s -> 1.5s): Cyan bay từ trái vào giữa -> tách sang trái, Blue & Cam fade-in xếp 2 hàng ngang vuông vức
    tl.to(lCyan, { x: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out' }, 0.05)
      .to(lCyan, { x: -58, y: -30, duration: 0.6, ease: 'power2.inOut' }, 0.85)
      .to(lBlue, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.92)
      .to(lOrange, { y: 32, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 1.02)

    // Phase 2 (1.65s -> 3.2s): Lùi lấy đà & cùng xoay 1 góc 3D song song (shared perspective trên container) thành Logo Teanis
    tl.to(lCyan, { x: 24, y: -36, rotation: 0, rotateY: -26, scaleX: 1.08, scaleY: 1.06, duration: 1.5, ease: 'back.inOut(1.35)' }, 1.65)
      .to(lBlue, { x: -22, y: 2, rotation: 0, rotateY: -26, scaleX: 0.86, scaleY: 0.94, duration: 1.5, ease: 'back.inOut(1.35)' }, 1.7)
      .to(lOrange, { x: -2, y: 54, rotation: 0, rotateY: -26, scaleX: 0.48, scaleY: 0.74, duration: 1.5, ease: 'back.inOut(1.35)' }, 1.75)

    // Phase 3 (3.35s -> 4.5s): Luồng gió lướt trên mây + 3 khối bay hẳn ra ngoài khung hình + mây tản mở ra HeroSection
    tl.to('.wind-streak', {
      x: '130vw',
      scaleX: 2.4,
      opacity: 0.95,
      duration: 0.85,
      stagger: { each: 0.04, from: 'random' },
      ease: 'power2.in'
    }, 3.35)
      .to(lCyan, { x: '85vw', y: '-75vh', rotation: 36, scale: 1.65, duration: 0.8, ease: 'power3.in' }, 3.42)
      .to(lBlue, { x: '-85vw', y: '-30vh', rotation: -32, scale: 1.6, duration: 0.8, ease: 'power3.in' }, 3.45)
      .to(lOrange, { x: '75vw', y: '80vh', rotation: 40, scale: 1.6, duration: 0.8, ease: 'power3.in' }, 3.48)
      .to('.intro-cloud-left', { x: '-110vw', y: '-15vh', scale: 1.6, opacity: 0, duration: 1.0, ease: 'power2.inOut' }, 3.45)
      .to('.intro-cloud-right', { x: '110vw', y: '15vh', scale: 1.6, opacity: 0, duration: 1.0, ease: 'power2.inOut' }, 3.45)
      .to('.intro-cloud-center', { scale: 2.5, opacity: 0, duration: 0.95, ease: 'power2.out' }, 3.55)
      .to(overlayRef.value, { scale: 1.25, opacity: 0, duration: 0.9, ease: 'power2.inOut', onComplete: finishIntro }, 3.65)
  }, overlayRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  unlockScroll()
})
</script>

<template>
  <div
    v-if="isVisible"
    ref="overlayRef"
    class="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#d8faf5] via-[#baf5ed] to-[#a7f2e7] select-none origin-center"
    aria-hidden="true"
  >
    <!-- Multi-layered Cloud Banks (pure radial-gradient, zero expensive CSS blur filter) -->
    <div
      class="intro-cloud-left pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 w-[80vw] max-w-[920px] h-[90vh] will-change-transform"
      style="background: radial-gradient(circle, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 72%);"
    />
    <div
      class="intro-cloud-right pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 w-[80vw] max-w-[920px] h-[90vh] will-change-transform"
      style="background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0) 72%);"
    />
    <div
      class="intro-cloud-center pointer-events-none absolute inset-0 will-change-transform"
      style="background: radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(230,251,248,0.45) 42%, rgba(255,255,255,0) 72%);"
    />

    <!-- Wind Streaks (Ventus speed lines) -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden z-20">
      <div
        v-for="(top, i) in ['18%', '28%', '38%', '46%', '54%', '62%', '72%', '82%']"
        :key="i"
        class="wind-streak absolute left-0 h-[3px] rounded-full opacity-0"
        :style="{
          top,
          width: `${140 + (i % 3) * 80}px`,
          background: i % 2 === 0 ? 'linear-gradient(90deg, transparent, #ffffff, transparent)' : 'linear-gradient(90deg, transparent, #00D1BC, transparent)'
        }"
      />
    </div>

    <!-- Center Stage: Shared 3D perspective container so all 3 blocks stay parallel -->
    <div
      class="relative z-10 flex items-center justify-center w-[260px] h-[200px]"
      style="perspective: 220px;"
    >
      <div class="intro-block-orange opacity-0 absolute w-[104px] h-[52px] rounded-[8px] bg-[#F97C00]" />
      <div class="intro-block-blue opacity-0 absolute w-[104px] h-[52px] rounded-[8px] bg-[#0709A2]" />
      <div class="intro-block-cyan opacity-0 absolute w-[104px] h-[52px] rounded-[8px] bg-[#00D1BC]" />
    </div>

    <!-- Subtle Skip button -->
    <button
      type="button"
      class="absolute bottom-8 right-8 z-30 px-4 py-1.5 rounded-full text-xs font-medium text-[#141414]/60 hover:text-[#141414] bg-white/70 hover:bg-white transition-colors cursor-pointer"
      @click="skipIntro"
    >
      Skip
    </button>
  </div>
</template>
