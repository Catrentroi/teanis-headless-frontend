<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PhilosophyElementsGrid from './PhilosophyElementsGrid.vue'

if (import.meta.client) gsap.registerPlugin(ScrollTrigger)

interface Props {
  subtitle?: string
  title?: string
  intro?: string
  brandLogo?: string
  storyText?: string
  symbolTitle?: string
  symbolDesc?: string
  symbolIcon?: string
  symbolVideo?: string
  closingText?: string
  bgColor?: string
}

const props = defineProps<Props>()

// Hỗ trợ WYSIWYG Editor: Tự động xử lý HTML từ WordPress Editor
const formattedStoryHtml = computed(() => {
  if (!props.storyText) return ''
  // Nếu đã chứa các thẻ HTML (do WYSIWYG sinh ra)
  if (/<(p|br|div|h[1-6]|strong|b)/i.test(props.storyText)) {
    return props.storyText
  }
  // Dự phòng trường hợp là text thuần: tự bọc từng dòng vào thẻ <p>
  return props.storyText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => `<p>${line}</p>`)
    .join('')
})

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

const unionShapes = [
  { src: '/images/philosophy/Union.svg', pos: 'left-[calc(50%-860px)] bottom-[950px] lg:bottom-[1050px]' },
  { src: '/images/philosophy/Union-1.svg', pos: 'left-[calc(50%-588px)] bottom-[1100px] lg:bottom-[1200px]' },
  { src: '/images/philosophy/Union-2.svg', pos: 'left-[calc(50%+208px)] bottom-[820px] lg:bottom-[900px]' },
  { src: '/images/philosophy/Union-3.svg', pos: 'left-[calc(50%+480px)] bottom-[980px] lg:bottom-[1060px]' }
]

onMounted(() => {
  if (!sectionRef.value) return
  ctx = gsap.context(() => {
    // 1. Water Drop & Glass Cup Expansion (Scroll-driven, centered in viewport)
    const impactY = typeof window !== 'undefined' && window.innerWidth < 1024 ? 520 : 640

    gsap.set('.philosophy-cup-bg', {
      transformOrigin: `50% ${impactY}px`,
      clipPath: `circle(0% at 50% ${impactY}px)`,
      scale: 0.94,
      opacity: 0
    })
    gsap.set('.water-drop-item', { y: 40, opacity: 0, scale: 0.75 })
    gsap.set(['.water-ripple-1', '.water-ripple-2', '.water-ripple-3', '.water-splash-glow'], {
      scale: 0.1,
      opacity: 0
    })

    const waterTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 65%',
        end: '+=850',
        scrub: 1
      }
    })

    // Giai đoạn 1 (0 -> 0.5): Giọt nước xuất hiện & rơi xuyên suốt theo scroll tới vị trí cố định
    waterTl.to('.water-drop-item', { opacity: 1, scale: 1, duration: 0.12, ease: 'power1.out' }, 0)
    waterTl.to('.water-drop-item', { y: impactY, duration: 0.5, ease: 'none' }, 0)

    // Giai đoạn 2 (0.5 -> 0.75): Chạm điểm cố định -> tan hòa & bắn vũng nước lan tỏa
    waterTl.to('.water-drop-item', { scaleX: 2.2, scaleY: 0.15, opacity: 0, duration: 0.08, ease: 'power1.out' }, 0.5)
    waterTl.fromTo('.water-splash-glow', { scale: 0.15, opacity: 0.95 }, { scale: 2.3, opacity: 0, duration: 0.28, ease: 'power2.out' }, 0.49)
    waterTl.fromTo('.water-ripple-1', { scale: 0.1, opacity: 0.85, borderWidth: '2px' }, { scale: 2.5, opacity: 0, borderWidth: '0.5px', duration: 0.35, ease: 'power2.out' }, 0.5)
    waterTl.fromTo('.water-ripple-2', { scale: 0.1, opacity: 0.65 }, { scale: 3.3, opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.53)
    waterTl.fromTo('.water-ripple-3', { scale: 0.1, opacity: 0.45 }, { scale: 4.2, opacity: 0, duration: 0.45, ease: 'power2.out' }, 0.56)

    // Giai đoạn 3 (0.52 -> 1.0): Background chiếc ly loang mượt từ tâm bằng clip-path + fade
    waterTl.to(
      '.philosophy-cup-bg',
      {
        clipPath: `circle(150% at 50% ${impactY}px)`,
        scale: 1,
        opacity: 1,
        duration: 0.48,
        ease: 'power2.out'
      },
      0.52
    )

    // 2. Monogram background shapes fade in and float along scroll centered in viewport
    const unionEls = sectionRef.value?.querySelectorAll('.monogram-union-shape')
    if (unionEls && unionEls.length > 0) {
      const unionTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#monogram-block',
          start: 'top 50%',
          end: 'center center',
          scrub: 1
        }
      })
      unionEls.forEach((shape, idx) => {
        const yDist = idx % 2 === 0 ? 50 : 35
        unionTl.fromTo(
          shape,
          { opacity: 0, y: yDist, scale: 0.85 },
          { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 1 },
          idx * 0.15
        )
      })
    }

    // 3. Frame.svg with union shapes fades in smoothly as monogram approaches center screen
    const bottomFrame = sectionRef.value?.querySelector('.philosophy-bottom-frame')
    if (bottomFrame) {
      gsap.fromTo(
        bottomFrame,
        { opacity: 0, y: 60 },
        {
          scrollTrigger: {
            trigger: '#monogram-block',
            start: 'top 50%',
            end: 'center center',
            scrub: 1
          },
          opacity: 1,
          y: 0,
          ease: 'power2.out'
        }
      )
    }
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="brand-philosophy"
    ref="sectionRef"
    class="py-20 lg:pt-32 lg:pb-[60px] relative overflow-visible transition-colors duration-300"
    :style="{ backgroundColor: bgColor || '#FFFFFF' }"
  >
    <!-- Water Drop & Fluid Expansion Effect Wrapper -->
    <div class="water-drop-effect-wrapper absolute inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <!-- Water Drop Item (Đồng màu xám bạc khói tinh khiết với background) -->
      <div class="water-drop-item absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none">
        <svg width="40" height="56" viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-[0_4px_16px_rgba(113,113,122,0.35)]">
          <path d="M20 0C20 0 0 28 0 38C0 47.941 8.954 56 20 56C31.046 56 40 47.941 40 38C40 28 20 0 20 0Z" fill="url(#water_drop_grad)" stroke="rgba(255, 255, 255, 0.7)" stroke-width="0.8" />
          <ellipse cx="14" cy="34" rx="4.5" ry="8" fill="white" fill-opacity="0.65" transform="rotate(-18 14 34)" />
          <defs>
            <linearGradient id="water_drop_grad" x1="20" y1="0" x2="20" y2="56" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FFFFFF" stop-opacity="0.95" />
              <stop offset="0.4" stop-color="#E4E4E7" stop-opacity="0.9" />
              <stop offset="0.85" stop-color="#A1A1AA" stop-opacity="0.85" />
              <stop offset="1" stop-color="#71717A" stop-opacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- Water Impact Ripples at bottom of cup (Tông xám khói thủy tinh cùng background) -->
      <div class="water-ripples-container absolute top-[520px] lg:top-[640px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div class="water-splash-glow absolute w-64 h-32 rounded-[100%] bg-radial from-white/90 via-[#A1A1AA]/30 to-transparent blur-xl"></div>
        <div class="water-ripple water-ripple-1 absolute w-[360px] h-[120px] rounded-[100%] border-2 border-[#71717A]/75"></div>
        <div class="water-ripple water-ripple-2 absolute w-[540px] h-[180px] rounded-[100%] border border-[#A1A1AA]/55"></div>
        <div class="water-ripple water-ripple-3 absolute w-[720px] h-[240px] rounded-[100%] border border-[#D4D4D8]/40"></div>
      </div>
    </div>

    <!-- Background Layers (Thứ tự Figma: Frame1 -> Vector -> Union -> Frame) -->
    <div class="philosophy-bg-layers absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
      <div class="philosophy-cup-bg absolute inset-0 pointer-events-none">
        <!-- 1. Frame1: Top luminosity texture / wave (1920x1339) -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1920px] max-w-none h-[1339px] pointer-events-none">
          <img
            src="/images/philosophy/Frame1.svg"
            alt="Luminosity wave texture"
            class="grayscale w-full h-full object-cover object-top mix-blend-luminosity"
          />
        </div>

        <!-- 2. Vector: Mid wave curve (1920x1008) -->
        <div class="absolute top-[520px] lg:top-[650px] left-1/2 -translate-x-1/2 w-[1920px] max-w-none h-[1008px] pointer-events-none">
          <img
            src="/images/philosophy/Vector.svg"
            alt="Mid wave decorative background"
            class="w-full h-full object-contain"
          />
        </div>
      </div>

      <!-- 3. Union: 4 cụm khối bo góc quanh khu vực Monogram -->
      <div
        v-for="(u, idx) in unionShapes"
        :key="idx"
        :class="['monogram-union-shape hidden md:block absolute w-[340px] lg:w-[408px] h-auto pointer-events-none', u.pos]"
      >
        <img :src="u.src" alt="Teanis geometric shape" class="w-full h-auto object-contain" />
      </div>
    </div>

    <!-- Nền đáy Figma (mốc = đáy section): Frame 1:918 từ -1317 đến -75px, gradient 1:938 từ -614 đến +566px (tràn xuống Pre-Footer) -->
    <div
      class="absolute inset-x-0 bottom-[-566px] h-[1883px] z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <img
        src="/images/philosophy/Frame.svg"
        alt=""
        class="philosophy-bottom-frame absolute top-0 left-1/2 -translate-x-1/2 w-[1860px] h-[1242px] max-w-none"
      />
      <img
        src="/images/philosophy/overlay-gradient.png"
        alt=""
        class="absolute top-[703px] left-1/2 -translate-x-1/2 w-[1920px] h-[1180px] max-w-none"
      />
    </div>

    <div class="max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0 w-full relative z-10">

      <!-- Header: Tiêu đề phụ (kèm dot) + Tiêu đề chính + Đoạn mở đầu -->
      <div class="flex flex-col items-center text-center mb-[50px] lg:mb-[100px]">
        <!-- Tiêu đề phụ (Có icon dot bên cạnh — Figma 1:916 gap 100px) -->
        <div v-if="subtitle || title" class="flex items-center justify-center gap-2.5 mb-8 lg:mb-[100px]">
          <img
            src="/images/philosophy/dot-shape.svg"
            alt="Icon"
            class="w-6 h-6.5 object-contain shrink-0"
          />
          <span class="text-ds-24 font-bold text-[#141414] tracking-tight">
            {{ subtitle || title }}
          </span>
        </div>

        <!-- Tiêu đề chính (Figma 1:994) -->
        <h2
          v-if="title && subtitle"
          class="text-2xl sm:text-3xl lg:text-ds-36 font-semibold text-[#141414] w-full mx-auto mb-10"
        >
          {{ title }}
        </h2>

        <!-- Đoạn văn mở đầu -->
        <p
          v-if="intro"
          class="text-[#141414] text-ds-16 lg:text-ds-18 font-normal max-w-full mx-auto whitespace-pre-line text-center"
        >
          {{ intro }}
        </p>
      </div>

      <!-- 4 Thẻ Nguyên Tố (Local SVG Cards + GSAP Interactive Animation) -->
      <PhilosophyElementsGrid />



      <!-- Logo Teanis lớn ở giữa -->
      <div v-if="brandLogo" class="w-full flex items-center justify-center mb-[50px] lg:mb-[260px]">
        <img
          :src="brandLogo"
          alt="Teanis Brand Logo"
          class="w-full max-w-[500px] sm:max-w-[700px] lg:max-w-[888px] h-auto object-contain select-none pointer-events-none"
          @error="(e: any) => { e.target.src = '/images/philosophy/teanis-brand-logo.svg' }"
        />
      </div>

      <!-- Câu chuyện diễn giải (Figma 1:1005 — 20px/34px, chữ nhấn mạnh màu #0709a2) -->
      <div
        v-if="formattedStoryHtml"
        class="max-w-full mx-auto text-[#141414] text-ds-16 sm:text-[20px] sm:leading-[34px] font-normal mb-5 text-left [&_p]:mb-5 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_b]:font-semibold [&_strong]:text-[#0709a2] [&_b]:text-[#0709a2] [&_h3]:text-[#0709a2] [&_h3]:text-ds-24 [&_h3]:font-semibold [&_h4]:text-[#0709a2] [&_h4]:text-ds-24 [&_h4]:font-semibold"
        v-html="formattedStoryHtml"
      />

      <!-- Khối Monogram & Hệ giá trị (Figma 1:1006 — p: 100px, gap: 116px) -->
      <div
        v-if="symbolVideo || symbolIcon || symbolTitle || symbolDesc"
        id="monogram-block"
        class="w-full mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-[116px] items-center justify-between py-12 lg:p-[100px] mb-5 lg:mb-[20px]"
      >
        <!-- Khối hộp icon Monogram (Trái) -->
        <div
          v-if="symbolVideo || symbolIcon"
          class="bg-[#b0f3eb] rounded-[32px] sm:rounded-[40px] size-[280px] sm:size-[380px] lg:size-[460px] xl:size-[500px] shrink-0 flex items-center justify-center p-8 select-none overflow-hidden"
        >
          <video
            v-if="symbolVideo"
            :src="symbolVideo"
            :poster="symbolIcon || undefined"
            class="w-full h-full max-w-[300px] max-h-[444px] object-contain"
            autoplay
            loop
            muted
            playsinline
            disablepictureinpicture
          />
          <img
            v-else
            :src="symbolIcon"
            alt="Monogram Symbol"
            class="w-full h-full max-w-[300px] max-h-[444px] object-contain"
            @error="(e: any) => { e.target.src = '/images/philosophy/monogram-symbol.svg' }"
          />
        </div>

        <!-- Text Monogram (Phải — Figma 1:1010: gap 16px) -->
        <div class="flex-1 flex flex-col gap-4 text-left">
          <h3
            v-if="symbolTitle"
            class="text-2xl sm:text-3xl lg:text-ds-36 font-semibold text-[#141414]"
          >
            {{ symbolTitle }}
          </h3>
          <p
            v-if="symbolDesc"
            class="text-[#141414] text-ds-16 lg:text-ds-18 font-normal"
          >
            {{ symbolDesc }}
          </p>
        </div>
      </div>

      <!-- Đoạn text kết luận (Dưới khối Monogram) -->
      <div v-if="closingText" class="max-w-full mx-auto text-center">
        <p class="text-[#141414] text-ds-16 lg:text-ds-18 font-normal">
          {{ closingText }}
        </p>
      </div>

      <!-- Slogan kết luận cố định bằng code từ local (Figma 1:1015 — py: 60px) -->
      <div class="py-8 lg:py-[60px] text-center select-none lg:pb-[100px]">
        <p class="text-4xl sm:text-6xl lg:text-ds-82 font-normal uppercase">
          <span class="text-[#141414]">SHAPE UP FOR <span class="text-[#00D1BC]">GROWTH</span></span>
        </p>
      </div>

    </div>
  </section>
</template>
