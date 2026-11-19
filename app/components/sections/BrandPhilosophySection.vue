<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import gsap from 'gsap'
import { RoughEase } from 'gsap/EasePack'

if (import.meta.client) {
  gsap.registerPlugin(RoughEase)
}

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

// GSAP Animations cho 4 thẻ nguyên tố
const cardsContainerRef = ref<HTMLElement | null>(null)
const terraCardRef = ref<HTMLElement | null>(null)
const aquaCardRef = ref<HTMLElement | null>(null)
const ignisCardRef = ref<HTMLElement | null>(null)
const ventusCardRef = ref<HTMLElement | null>(null)

let terraTl: gsap.core.Timeline | null = null
let aquaTl: gsap.core.Timeline | null = null
let ignisTweens: (gsap.core.Tween | gsap.core.Timeline)[] = []
let ventusTl: gsap.core.Timeline | null = null

// 1. TERRA: 3 mảng phía sau ngã lần lượt ra 3 phía khi hover
function onTerraEnter() {
  if (!terraCardRef.value) return
  gsap.to(terraCardRef.value, {
    scale: 1.04,
    y: -6,
    boxShadow: '0 20px 35px -5px rgba(7, 9, 162, 0.45)',
    duration: 0.35,
    ease: 'power2.out'
  })

  terraTl?.kill()
  terraTl = gsap.timeline({ defaults: { ease: 'back.out(1.5)', duration: 0.45 } })

  // 3 mảng lần lượt ngã ra 3 phía tương ứng
  // Mảng 1: góc trên bên trái
  terraTl.to('.terra-layer-1', {
    x: -20,
    y: -16,
    rotation: -5,
    fillOpacity: 0.35,
    transformOrigin: 'bottom right'
  }, 0)
  // Mảng 2: góc trên bên phải
  terraTl.to('.terra-layer-2', {
    x: 10,
    y: -16,
    rotation: 5,
    fillOpacity: 0.35,
    transformOrigin: 'bottom left'
  }, 0.08)
  // Mảng 3: mảng dưới đáy ngã xuống dưới
  terraTl.to('.terra-layer-3', {
    x: -30,
    y: 40,
    rotation: 8,
    scale: 1.04,
    fillOpacity: 0.35,
    transformOrigin: 'top center'
  }, 0.16)
}

function onTerraLeave() {
  if (!terraCardRef.value) return
  terraTl?.kill()

  gsap.to(terraCardRef.value, {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    duration: 0.35,
    ease: 'power2.out'
  })

  // Đưa cả 3 mảng êm dịu trở về vị trí ban đầu
  gsap.to(['.terra-layer-1', '.terra-layer-2', '.terra-layer-3'], {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    fillOpacity: 0.2,
    duration: 0.35,
    ease: 'power2.out',
    stagger: 0.04
  })
}

// 2. AQUA: Giọt teardrop — neo tại đỉnh nhọn (theo aqua-card.svg), phần bầu đung đưa
function onAquaEnter() {
  if (!aquaCardRef.value) return
  gsap.to(aquaCardRef.value, {
    scale: 1.04,
    y: -6,
    boxShadow: '0 20px 35px -5px rgba(0, 209, 188, 0.5)',
    duration: 0.35,
    ease: 'power2.out'
  })
  aquaTl?.kill()
  gsap.killTweensOf(['.aqua-wave-1', '.aqua-wave-2', '.aqua-wave-3'])

  // Đỉnh nhọn mỗi path ≈ tip trong viewBox 393.683×462.509
  const drops = [
    { sel: '.aqua-wave-1', origin: '30% 27%', duration: 1.55, delay: 0, rotation: 2.2 },
    { sel: '.aqua-wave-2', origin: '77% 1%', duration: 1.28, delay: 0.38, rotation: -1.6 },
    { sel: '.aqua-wave-3', origin: '81% 62%', duration: 1.42, delay: 0.72, rotation: 1.5 }
  ] as const

  aquaTl = gsap.timeline()
  aquaTl.add(() => {
    drops.forEach(({ sel, origin, duration, delay, rotation }) => {
      gsap.set(sel, { transformOrigin: origin })
      gsap.to(sel, {
        rotation,
        scaleY: 1.05,
        scaleX: 0.98,
        y: -5,
        fillOpacity: 0.56,
        duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay
      })
    })
  }, 0)
}

function onAquaLeave() {
  if (!aquaCardRef.value) return
  aquaTl?.kill()
  aquaTl = null
  gsap.killTweensOf(['.aqua-wave-1', '.aqua-wave-2', '.aqua-wave-3'])
  gsap.to(aquaCardRef.value, {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    duration: 0.35,
    ease: 'power2.out'
  })
  gsap.to(['.aqua-wave-1', '.aqua-wave-2', '.aqua-wave-3'], {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    rotation: 0,
    fillOpacity: 0.4,
    duration: 0.4,
    ease: 'power2.out'
  })
}

// 3. IGNIS: Neo đáy ngọn (ignis-card.svg) — vươn chậm + flicker opacity riêng
function onIgnisEnter() {
  if (!ignisCardRef.value) return

  ignisTweens.forEach(t => t.kill())
  ignisTweens = []
  gsap.killTweensOf(['.ignis-flame-1', '.ignis-flame-2', '.ignis-flame-3', ignisCardRef.value])

  gsap.to(ignisCardRef.value, {
    scale: 1.04,
    y: -6,
    boxShadow: '0 20px 35px -5px rgba(249, 124, 0, 0.65)',
    duration: 0.35,
    ease: 'power2.out',
    onComplete: () => {
      if (!ignisCardRef.value) return
      ignisTweens.push(
        gsap.fromTo(
          ignisCardRef.value,
          { boxShadow: '0 20px 35px -5px rgba(249, 124, 0, 0.65)' },
          {
            boxShadow: '0 26px 46px -4px rgba(255, 165, 45, 0.78)',
            duration: 0.35,
            repeat: -1,
            yoyo: true,
            ease: 'power2.out',
          }
        )
      )
    }
  })

  const flames = [
    { sel: '.ignis-flame-1', origin: '24% 99%', delay: 0, sway: 3 },
    { sel: '.ignis-flame-2', origin: '66% 94%', delay: 0.14, sway: -2.5 },
    { sel: '.ignis-flame-3', origin: '38% 98%', delay: 0.08, sway: 2 }
  ] as const

  flames.forEach(({ sel, origin, delay, sway }, index) => {
    const isCore = index === 1
    gsap.set(sel, { transformOrigin: origin })

    const morphTl = gsap.timeline({ repeat: -1, yoyo: true, delay })
    morphTl
      .to(sel, {
        scaleY: isCore ? 1.1 : 1.07,
        scaleX: isCore ? 0.93 : 0.95,
        skewX: sway,
        y: isCore ? -7 : -4,
        duration: isCore ? 0.55 : 0.5,
        ease: 'sine.inOut'
      })
      .to(sel, {
        scaleY: isCore ? 1.05 : 1.03,
        scaleX: isCore ? 0.96 : 0.97,
        skewX: -sway * 0.75,
        y: isCore ? -3 : -1,
        duration: isCore ? 0.48 : 0.44,
        ease: 'sine.inOut'
      })

    const glowTween = gsap.to(sel, {
      fillOpacity: isCore ? 0.62 : 0.38,
      duration: 'random(0.16, 0.28)',
      repeat: -1,
      yoyo: true,
      repeatRefresh: true,
      ease: RoughEase.config({ strength: 1.15, points: 8, randomize: true }),
      delay: delay + 0.05
    })

    ignisTweens.push(morphTl, glowTween)
  })
}

function onIgnisLeave() {
  if (!ignisCardRef.value) return

  ignisTweens.forEach(t => t.kill())
  ignisTweens = []
  gsap.killTweensOf(['.ignis-flame-1', '.ignis-flame-2', '.ignis-flame-3', ignisCardRef.value])

  gsap.to(ignisCardRef.value, {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    duration: 0.35,
    ease: 'power2.out'
  })

  gsap.to(['.ignis-flame-1', '.ignis-flame-2', '.ignis-flame-3'], {
    scaleY: 1,
    scaleX: 1,
    skewX: 0,
    rotation: 0,
    x: 0,
    y: 0,
    fillOpacity: 0.2,
    duration: 0.4,
    ease: 'power2.out'
  })
}

// 4. VENTUS: Làn gió vút qua mạnh mẽ, luân chuyển cuồn cuộn
function onVentusEnter() {
  if (!ventusCardRef.value) return
  gsap.to(ventusCardRef.value, {
    scale: 1.04,
    y: -6,
    boxShadow: '0 20px 35px -5px rgba(188, 224, 245, 0.9)',
    duration: 0.35,
    ease: 'power2.out'
  })

  // Dọn dẹp tween trước đó nếu có
  ventusTl?.kill()
  gsap.killTweensOf(['.ventus-top-stream', '.ventus-bottom-stream', '.ventus-wind-path', '.ventus-wisp'])

  ventusTl = gsap.timeline()

  // 1. Pha "Vút" tức thì (Initial Gust Sweep): Gió tăng tốc vút sang phải cực nhanh
  ventusTl
    .to('.ventus-top-stream', {
      x: 20,
      y: -8,
      rotation: -3,
      scaleX: 1.06,
      duration: 0.3,
      ease: 'power3.out'
    }, 0)
    .to('.ventus-bottom-stream', {
      x: -20,
      y: 30,
      rotation: -3,
      scaleX: 1.05,
      duration: 0.32,
      ease: 'power3.out'
    }, 0.04)
    .to('.ventus-wind-path', {
      fillOpacity: 0.78,
      duration: 0.25,
      ease: 'power2.out'
    }, 0)
    .to('.ventus-wisp', {
      x: 0,
      fillOpacity: 0.85,
      duration: 0.28,
      ease: 'power3.out'
    }, 0)

  // 2. Pha lượn sóng liên tục (Continuous Gusting Breeze): Gió tiếp tục cuộn nhịp nhàng dập dờn
  ventusTl.add(() => {
    gsap.to('.ventus-top-stream', {
      x: '+=12',
      y: '-=6',
      rotation: '+=2',
      duration: 0.85,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    gsap.to('.ventus-bottom-stream', {
      x: '+=10',
      y: '+=4',
      rotation: '-=2',
      duration: 1.05,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.1
    })
    gsap.to('.ventus-wisp', {
      x: '+=8',
      duration: 0.55,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }, 0.2)
}

function onVentusLeave() {
  if (!ventusCardRef.value) return
  ventusTl?.kill()
  ventusTl = null
  gsap.killTweensOf(['.ventus-top-stream', '.ventus-bottom-stream', '.ventus-wind-path', '.ventus-wisp'])

  gsap.to(ventusCardRef.value, {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    duration: 0.35,
    ease: 'power2.out'
  })

  // Toàn bộ các lọn gió lướt êm dịu trở về trạng thái ban đầu
  gsap.to(['.ventus-top-stream', '.ventus-bottom-stream'], {
    x: 0,
    y: 0,
    rotation: 0,
    scaleX: 1,
    duration: 0.45,
    ease: 'power2.out'
  })
  gsap.to('.ventus-wind-path', {
    x: 0,
    y: 0,
    fillOpacity: 0.6,
    duration: 0.4,
    ease: 'power2.out'
  })
}

onUnmounted(() => {
  terraTl?.kill()
  aquaTl?.kill()
  ignisTweens.forEach(t => t.kill())
  ignisTweens = []
  ventusTl?.kill()
  gsap.killTweensOf(['.aqua-wave-1', '.aqua-wave-2', '.aqua-wave-3'])
  gsap.killTweensOf(['.ignis-flame-1', '.ignis-flame-2', '.ignis-flame-3'])
  gsap.killTweensOf([ignisCardRef.value, aquaCardRef.value].filter(Boolean))
  gsap.killTweensOf(['.ventus-top-stream', '.ventus-bottom-stream', '.ventus-wind-path', '.ventus-wisp'])
})
</script>

<template>
  <section
    id="brand-philosophy"
    class="py-20 lg:pt-32 lg:pb-[60px] relative overflow-visible transition-colors duration-300"
    :style="{ backgroundColor: bgColor || '#FFFFFF' }"
  >
    <!-- Background Layers (Thứ tự Figma: Frame1 -> Vector -> Union -> Frame) -->
    <div class="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
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

      <!-- 3. Union: 4 cụm khối bo góc quanh khu vực Monogram -->
      <!-- Union 1 (Xa bên trái) -->
      <div class="hidden md:block absolute left-[calc(50%-860px)] bottom-[950px] lg:bottom-[1050px] w-[340px] lg:w-[408px] h-auto pointer-events-none">
        <img src="/images/philosophy/Union.svg" alt="Teanis geometric shape" class="w-full h-auto object-contain" />
      </div>

      <!-- Union 2 (Gần bên trái) -->
      <div class="hidden md:block absolute left-[calc(50%-588px)] bottom-[1100px] lg:bottom-[1200px] w-[340px] lg:w-[408px] h-auto pointer-events-none">
        <img src="/images/philosophy/Union-1.svg" alt="Teanis geometric shape" class="w-full h-auto object-contain" />
      </div>

      <!-- Union 3 (Gần bên phải) -->
      <div class="hidden md:block absolute left-[calc(50%+208px)] bottom-[820px] lg:bottom-[900px] w-[340px] lg:w-[408px] h-auto pointer-events-none">
        <img src="/images/philosophy/Union-2.svg" alt="Teanis geometric shape" class="w-full h-auto object-contain" />
      </div>

      <!-- Union 4 (Xa bên phải) -->
      <div class="hidden md:block absolute left-[calc(50%+480px)] bottom-[980px] lg:bottom-[1060px] w-[340px] lg:w-[408px] h-auto pointer-events-none">
        <img src="/images/philosophy/Union-3.svg" alt="Teanis geometric shape" class="w-full h-auto object-contain" />
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
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[1860px] h-[1242px] max-w-none"
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
        <!-- Tiêu đề phụ (Có icon dot bên cạnh) -->
        <div v-if="subtitle || title" class="flex items-center justify-center gap-2.5 mb-8">
          <img
            src="/images/philosophy/dot-shape.svg"
            alt="Icon"
            class="w-6 h-6.5 object-contain shrink-0"
          />
          <span class="text-ds-24 font-bold text-[#141414] tracking-tight">
            {{ subtitle || title }}
          </span>
        </div>

        <!-- Tiêu đề chính -->
        <h2
          v-if="title && subtitle"
          class="text-2xl sm:text-3xl lg:text-ds-36 font-semibold text-[#141414] max-w-[1000px] mx-auto mb-10"
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
      <div
        ref="cardsContainerRef"
        class="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 w-full mb-[50px] lg:mb-[260px] lg:py-[60px]"
      >
        <!-- 1. TERRA Card -->
        <div
          ref="terraCardRef"
          class="element-card relative w-full aspect-square rounded-[20px] bg-[#0709a2] overflow-hidden flex items-center justify-center cursor-pointer select-none transition-shadow duration-300 shadow-md"
          @mouseenter="onTerraEnter"
          @mouseleave="onTerraLeave"
        >
          <!-- Pattern SVG -->
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 397.227 490.217"
            class="absolute inset-0 w-full h-full pointer-events-none"
          >
            <g class="terra-group" style="transform-box: fill-box;">
              <path
                class="terra-layer-1"
                style="transform-box: fill-box;"
                d="M111.661 256.791C141.238 256.791 158.035 263.834 170.304 268.987C179.432 272.851 184.471 274.913 198.128 274.913C211.784 274.913 216.823 272.766 225.952 268.987C231.648 266.582 238.294 263.748 246.765 261.429L228.654 225.787V32.7215L159.057 0L125.61 98.2505L16.4315 134.923L0 270.103C17.7461 277.403 35.6381 276.201 52.873 268.901C65.1419 263.748 82.0116 256.705 111.515 256.705L111.661 256.791Z"
                fill="white"
                fill-opacity="0.2"
              />
              <path
                class="terra-layer-2"
                style="transform-box: fill-box;"
                d="M379.513 245.714L334.308 210.244L319.118 103.062L259.234 50.2433V215.826L280.047 256.793C332.263 255.419 341.246 274.914 371.188 274.914C377.249 274.914 381.631 274.485 385.428 273.712L379.44 245.628L379.513 245.714Z"
                fill="white"
                fill-opacity="0.2"
              />
              <path
                class="terra-layer-3"
                style="transform-box: fill-box;"
                d="M284.737 292.771C260.492 292.771 247.639 298.182 236.319 302.906C226.022 307.2 217.186 310.979 198.198 310.979C179.21 310.979 170.374 307.286 160.077 302.906C148.757 298.182 135.977 292.771 111.659 292.771C87.3399 292.771 74.5599 298.182 63.2404 302.906C53.9657 306.856 45.7864 310.206 30.2312 310.893V359.159L53.6736 400.469H115.237L161.026 490.217H237.634L246.689 479.568L278.968 403.733L366.165 369.551V310.807C350.61 310.206 342.43 306.771 333.156 302.82C321.836 298.096 309.056 292.686 284.737 292.686V292.771Z"
                fill="white"
                fill-opacity="0.2"
              />
            </g>
          </svg>
          <span class="relative z-10 font-bold text-3xl sm:text-4xl lg:text-ds-48 text-white tracking-tight uppercase">
            TERRA
          </span>
        </div>

        <!-- 2. AQUA Card -->
        <div
          ref="aquaCardRef"
          class="element-card relative w-full aspect-square rounded-[20px] bg-[#00d1bc] overflow-hidden flex items-center justify-center cursor-pointer select-none transition-shadow duration-300 shadow-md"
          @mouseenter="onAquaEnter"
          @mouseleave="onAquaLeave"
        >
          <!-- Pattern SVG -->
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 393.683 462.509"
            class="absolute inset-0 w-full h-full pointer-events-none"
          >
            <g class="aqua-group" style="transform-box: fill-box;">
              <path
                class="aqua-wave-1"
                d="M127.212 131.068C125.288 128.481 122.232 126.952 118.95 126.952C115.668 126.952 112.612 128.481 110.688 131.068C110.405 131.421 82.9029 168.816 55.7968 213.384C18.7876 274.298 0 319.396 0 347.384C0 410.885 53.3634 462.509 118.95 462.509C184.537 462.509 237.9 410.885 237.9 347.384C237.9 319.396 219.113 274.298 182.103 213.384C154.997 168.757 127.495 131.421 127.212 131.068Z"
                fill="white"
                fill-opacity="0.4"
              />
              <path
                class="aqua-wave-2"
                d="M309.929 3.1143C308.473 1.15674 306.161 0 303.677 0C301.194 0 298.882 1.15674 297.426 3.1143C297.212 3.38124 276.402 31.6769 255.891 65.4004C227.888 111.492 213.672 145.616 213.672 166.793C213.672 214.843 254.05 253.905 303.677 253.905C353.305 253.905 393.683 214.843 393.683 166.793C393.683 145.616 379.467 111.492 351.464 65.4004C330.953 31.6324 310.143 3.38124 309.929 3.1143Z"
                fill="white"
                fill-opacity="0.4"
              />
              <path
                class="aqua-wave-3"
                d="M314.604 287.447C315.252 286.525 316.282 285.979 317.387 285.979C318.493 285.979 319.522 286.525 320.17 287.447C320.265 287.573 329.529 300.907 338.659 316.798C351.125 338.518 357.453 354.599 357.453 364.578C357.453 387.22 339.479 405.628 317.387 405.628C295.296 405.628 277.321 387.22 277.321 364.578C277.321 354.599 283.65 338.518 296.115 316.798C305.246 300.886 314.509 287.573 314.604 287.447Z"
                fill="white"
                fill-opacity="0.4"
              />
            </g>
          </svg>
          <span class="relative z-10 font-bold text-3xl sm:text-4xl lg:text-ds-48 text-[#0709a2] tracking-tight uppercase">
            AQUA
          </span>
        </div>

        <!-- 3. IGNIS Card -->
        <div
          ref="ignisCardRef"
          class="element-card relative w-full aspect-square rounded-[20px] bg-[#f97c00] overflow-hidden flex items-center justify-center cursor-pointer select-none transition-shadow duration-300 shadow-md"
          @mouseenter="onIgnisEnter"
          @mouseleave="onIgnisLeave"
        >
          <!-- Pattern SVG -->
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 417.078 509.731"
            class="absolute inset-0 w-full h-full pointer-events-none"
          >
            <g class="ignis-group" style="transform-box: fill-box;">
              <path
                class="ignis-flame-1"
                style="transform-box: fill-box;"
                d="M175.334 318.579C173.085 316.724 169.887 316.775 167.638 318.631C165.439 320.486 164.739 323.681 165.989 326.36C173.185 342.696 175.134 360.99 171.586 378.562C115.913 323.32 140.601 224.585 140.851 223.554C141.451 221.132 140.651 218.504 138.702 216.958C136.753 215.412 134.154 215.206 132.005 216.34C57.5418 257.307 52.1444 331.307 55.4928 371.605C48.4962 366.195 42.9489 359.135 39.2007 350.993C37.3516 347.231 36.0023 343.263 35.1527 339.14C34.7029 336.564 32.754 334.554 30.2552 334.09C27.7564 333.626 25.2575 334.812 23.9082 337.027C-0.180044 377.171 -6.077 412.728 6.26697 442.72C27.3567 493.788 93.2743 508.99 96.0729 509.608C96.4727 509.711 96.9226 509.763 97.3723 509.711C99.8211 509.711 102.07 508.165 103.02 505.846C104.119 503.012 103.169 499.765 100.671 498.065C81.0802 484.1 67.087 463.281 61.2898 439.473C73.9336 449.625 84.6285 452.562 93.874 448.594C109.366 441.895 113.214 416.644 114.064 401.597C162.59 434.784 150.646 493.376 150.046 496.004C149.297 499.405 151.396 502.806 154.694 503.579C156.143 503.94 157.643 503.682 158.942 502.96C201.022 479.72 223.76 451.635 226.609 419.479C231.357 365.267 177.533 320.537 175.234 318.631L175.334 318.579Z"
                fill="white"
                fill-opacity="0.2"
              />
              <path
                class="ignis-flame-2"
                style="transform-box: fill-box;"
                d="M361.391 152.885C358.963 150.882 355.509 150.938 353.081 152.941C350.706 154.944 349.951 158.394 351.3 161.288C359.071 178.927 361.175 198.68 357.344 217.655C297.229 158.005 323.887 51.3909 324.157 50.278C324.804 47.6628 323.941 44.8249 321.836 43.1554C319.732 41.4859 316.924 41.2633 314.604 42.4876C234.195 86.7321 228.366 166.645 231.982 210.165C224.426 204.321 218.435 196.697 214.387 187.904C212.39 183.841 210.933 179.556 210.016 175.104C209.53 172.321 207.425 170.151 204.726 169.65C202.027 169.149 199.328 170.43 197.871 172.823C171.85 216.175 165.48 254.57 178.811 286.96C201.585 342.115 272.76 358.533 275.783 359.201C276.215 359.312 276.7 359.368 277.186 359.312C279.831 359.312 282.26 357.643 283.286 355.138C284.473 352.078 283.448 348.572 280.749 346.735C259.593 331.654 244.482 309.17 238.221 283.454C251.874 294.417 263.424 297.589 273.411 293.304C290.139 286.07 294.296 258.801 295.213 242.551C347.616 278.39 334.717 341.67 334.069 344.508C333.26 348.181 335.527 351.854 339.091 352.689C340.656 353.078 342.276 352.8 343.679 352.021C389.123 326.922 413.682 296.592 416.758 261.867C421.876 203.322 363.766 154.999 361.283 152.941L361.391 152.885Z"
                fill="white"
                fill-opacity="0.2"
              />
              <path
                class="ignis-flame-3"
                style="transform-box: fill-box;"
                d="M124.591 73.162C122.993 71.8438 120.721 71.8803 119.123 73.1986C117.56 74.5169 117.063 76.7801 117.95 78.6811C123.064 90.2872 124.449 103.284 121.928 115.77C82.3732 76.5218 99.9135 6.37258 100.091 5.64099C100.517 3.92429 99.9492 2.05739 98.5646 0.96068C97.1799 -0.136034 95.3337 -0.282245 93.807 0.521995C40.8988 29.6339 37.0644 82.2138 39.4431 110.846C34.4727 107.011 30.5318 101.972 27.869 96.2023C26.5554 93.5358 25.5968 90.7248 24.9932 87.8033C24.6737 85.9774 23.2891 84.5532 21.5139 84.2245C19.7387 83.8958 17.9635 84.7358 17.0049 86.3061C-0.107771 114.832 -4.29707 140.096 4.47209 161.407C19.4543 197.697 66.2869 208.501 68.2751 208.939C68.5592 209.012 68.8787 209.049 69.1982 209.012C70.9379 209.012 72.5355 207.917 73.2101 206.273C73.9912 204.264 73.3166 201.964 71.5414 200.758C57.6243 190.838 47.6834 176.044 43.565 159.106C52.5473 166.301 60.145 168.383 66.7129 165.571C77.7188 160.824 80.4526 142.882 81.0561 132.19C115.536 155.772 107.051 197.409 106.625 199.272C106.092 201.682 107.583 204.093 109.927 204.641C110.956 204.896 112.022 204.714 112.945 204.202C142.845 187.69 158.999 167.734 161.023 144.887C164.396 106.402 126.153 74.5501 124.52 73.1986L124.591 73.162Z"
                fill="white"
                fill-opacity="0.2"
              />
            </g>
          </svg>
          <span class="relative z-10 font-bold text-3xl sm:text-4xl lg:text-ds-48 text-white tracking-tight uppercase">
            IGNIS
          </span>
        </div>

        <!-- 4. VENTUS Card -->
        <div
          ref="ventusCardRef"
          class="element-card relative w-full aspect-square rounded-[20px] bg-[#cee2f3] overflow-hidden flex items-center justify-center cursor-pointer select-none transition-shadow duration-300 shadow-md"
          @mouseenter="onVentusEnter"
          @mouseleave="onVentusLeave"
        >
          <!-- Pattern SVG (Gồm đầy đủ cả 2 lọn gió: trên và dưới) -->
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 407.214 374.953"
            class="absolute inset-0 w-full h-full pointer-events-none"
          >
            <!-- Lọn gió phía trên (Vector_2) -->
            <g class="ventus-top-stream" style="transform-box: fill-box;">
              <path
                class="ventus-wind-path ventus-top-main"
                d="M405.837 51.6873C407.053 47.0312 408.015 41.4105 406.233 34.5926C404.451 28.6726 400.831 24.3822 395.713 22.1538C384.655 17.3979 368.959 23.0518 362.879 27.1426C361.719 27.8743 360.984 29.4042 361.182 31.0006C361.578 34.4595 364.321 34.3597 365.82 34.3597C390.311 33.7278 391.612 39.0824 391.64 39.0824C391.697 40.0469 391.386 42.4415 390.283 44.7696C390.198 44.9359 390.141 45.1022 390.085 45.2685C389.745 46.3328 389.18 47.3638 388.303 48.8936C388.02 49.5588 387.426 50.3237 386.861 51.1219L386.323 51.8536C383.099 55.9444 378.886 59.1705 373.767 61.4986C364.887 65.5229 353.829 67.5184 339.915 67.5184H339.632C334.231 67.4186 327.811 67.1193 321.335 66.2545C320.175 66.0882 319.016 65.9552 317.856 65.7889C315.933 65.5561 314.038 65.3233 312.002 64.9242L308.806 64.3588C306.77 64.0262 304.762 63.6271 302.387 63.3278C288.586 61.0995 274.276 61.4986 259.938 64.4586C245.939 67.4186 232.619 72.1745 220.232 78.7265C207.392 85.3116 195.458 93.6594 184.796 103.67C171.844 116.209 163.246 128.548 158.58 141.319C157.958 143.081 158.495 145.077 159.824 146.075C160.362 146.474 160.927 146.64 161.55 146.64C162.454 146.64 163.388 146.174 164.01 145.276C171.391 135.099 180.724 126.552 193.28 118.371C203.235 111.785 214.378 106.098 227.415 101.043C253.886 91.2649 277.981 88.0388 299.163 91.4977L308.778 92.9278C311.437 93.3934 314.18 93.6594 316.895 93.9588L319.157 94.1916C326.312 94.8235 333.297 94.9899 340.056 94.6906C346.759 94.2249 353.97 93.5596 361.154 91.6306C368.676 89.8679 375.775 86.9745 382.251 82.9502C390.424 77.895 396.363 71.9417 400.492 64.6581L400.916 63.8599C401.878 62.0972 402.896 60.268 403.575 58.3057C404.451 56.1439 405.3 53.7494 405.752 51.4213V51.654L405.837 51.6873Z"
                fill="white"
                fill-opacity="0.6"
              />
              <path
                class="ventus-wind-path ventus-wisp"
                d="M245.43 23.319L240.707 24.9155C230.13 28.5076 217.771 33.1639 206.091 40.3147C199.332 44.5054 194.156 48.7294 189.716 53.5521C183.522 60.3703 179.817 67.4214 178.658 74.5722C178.403 76.1687 179.054 77.7983 180.241 78.5966C180.722 78.9292 181.316 79.0955 181.825 79.0955C182.589 79.0955 183.381 78.7629 184.003 78.131C187.962 73.9403 192.346 70.9136 197.804 68.4856C202.245 66.4568 207.081 64.6275 213.557 62.5654C217.997 61.1352 222.494 59.8381 227.019 58.541C233.637 56.612 240.481 54.6164 247.41 52.2217C253.632 49.9933 259.232 47.9644 265.228 44.9045C268.423 43.2083 271.563 41.5121 274.843 38.8181C284.346 31.1018 285.025 22.9865 284.657 18.8956C283.922 11.8445 279.057 5.42533 271.874 2.19914C264.21 -1.25987 252.642 -1.55917 243.196 8.15265C241.98 9.41651 241.754 11.5118 242.574 13.1083C243.451 14.7048 245.119 15.3367 246.618 14.5717C251.681 12.0107 260.816 14.0729 263.361 16.1682C262.626 16.8334 260.901 18.0308 256.998 19.3944C253.293 20.7581 249.362 22.0551 245.374 23.3855L245.459 23.319H245.43Z"
                fill="white"
                fill-opacity="0.6"
              />
              <path
                class="ventus-wind-path ventus-top-curl"
                d="M381.207 154.189C379.482 144.877 374.929 138.458 371.167 133.868C367.604 129.545 363.334 125.687 357.989 121.829C355.868 120.132 353.605 118.869 351.371 117.671L343.311 113.315C343.311 113.315 343.028 113.215 342.887 113.148L331.433 109.224C330.472 108.924 329.51 108.758 328.492 108.592L327.389 108.359C308.073 104.435 287.513 106.264 266.162 113.913C245.743 121.297 227.87 131.74 213.107 144.977C211.863 146.107 211.467 148.103 212.146 149.733C212.824 151.395 214.408 152.227 215.907 151.728C231.999 146.573 251.116 140.753 270.658 137.261C290.228 133.502 307.791 133.236 323.006 136.363C323.43 136.462 323.911 136.529 324.363 136.595C324.9 136.695 325.466 136.762 325.862 136.895L334.742 139.722L340.935 142.715C342.717 143.58 344.414 144.378 346.196 145.542C349.731 147.637 353.153 150.198 356.009 152.992C358.752 155.652 360.732 158.38 361.382 160.475C361.92 162.238 362.005 163.767 360.704 166.029C359.403 168.457 356.659 170.752 353.407 172.115C350.127 173.645 346.563 173.945 343.17 172.98C339.974 172.182 336.835 169.588 334.346 165.53C333.441 164.067 331.801 163.535 330.387 164.333C328.973 165.065 328.209 166.894 328.549 168.657C329.906 175.707 333.752 181.96 338.871 185.352C343.65 188.811 348.854 189.776 353.209 189.776C354.51 189.776 355.755 189.676 356.886 189.543C363.786 188.478 369.64 185.286 374.278 180.164C380.076 174.244 382.96 163.368 381.122 154.322L381.264 154.156L381.207 154.189Z"
                fill="white"
                fill-opacity="0.6"
              />
              <path
                class="ventus-wind-path ventus-wisp"
                d="M180.926 0.933653C154.369 2.69641 140.851 18.4948 141.728 46.6325C141.784 48.6281 143.142 50.2245 144.81 50.3243C146.168 50.424 147.469 50.424 148.713 50.424C160.874 50.424 170.207 46.4329 176.486 38.6834C183.019 30.568 185.762 18.6278 184.348 4.25962C184.15 2.23078 182.651 0.734132 180.926 0.86717V0.933653Z"
                fill="white"
                fill-opacity="0.6"
              />
            </g>

            <!-- Lọn gió phía dưới (Vector) -->
            <g class="ventus-bottom-stream" style="transform-box: fill-box;">
              <path
                class="ventus-wind-path ventus-bottom-main"
                d="M273.031 210.251C274.288 205.439 275.282 199.629 273.44 192.582C271.598 186.463 267.857 182.028 262.566 179.725C251.137 174.809 234.913 180.653 228.628 184.881C227.43 185.638 226.67 187.219 226.874 188.869C227.284 192.444 230.119 192.341 231.668 192.341C256.983 191.688 258.327 197.223 258.357 197.223C258.415 198.219 258.094 200.695 256.954 203.101C256.866 203.273 256.807 203.445 256.749 203.617C256.398 204.717 255.814 205.782 254.907 207.364C254.615 208.051 254.001 208.842 253.417 209.667L252.861 210.423C249.529 214.652 245.173 217.986 239.882 220.393C230.704 224.552 219.274 226.615 204.892 226.615H204.6C199.017 226.512 192.381 226.202 185.687 225.308C184.489 225.136 183.29 224.999 182.092 224.827C180.104 224.586 178.146 224.346 176.041 223.933L172.738 223.349C170.633 223.005 168.558 222.593 166.102 222.283C151.837 219.98 137.046 220.392 122.226 223.452C107.756 226.511 93.9884 231.427 81.185 238.2C67.914 245.006 55.5782 253.635 44.558 263.982C31.17 276.942 22.2836 289.696 17.4604 302.896C16.8173 304.718 17.3727 306.781 18.7466 307.812C19.302 308.225 19.8867 308.397 20.5298 308.397C21.4652 308.397 22.4298 307.915 23.0729 306.987C30.7023 296.468 40.3486 287.633 53.3274 279.177C63.6169 272.37 75.1341 266.492 88.6097 261.266C115.97 251.16 140.876 247.825 162.77 251.4L172.709 252.878C175.456 253.36 178.292 253.635 181.098 253.944L183.436 254.185C190.832 254.838 198.052 255.01 205.039 254.7C211.966 254.219 219.42 253.531 226.845 251.538C234.621 249.716 241.958 246.725 248.652 242.565C257.1 237.34 263.238 231.187 267.506 223.658L267.944 222.833C268.938 221.011 269.991 219.12 270.692 217.092C271.598 214.858 272.475 212.383 272.943 209.976V210.217L273.031 210.251Z"
                fill="white"
                fill-opacity="0.6"
              />
              <path
                class="ventus-wind-path ventus-wisp"
                d="M107.231 180.929L102.349 182.579C91.4163 186.292 78.6417 191.105 66.5687 198.496C59.5821 202.828 54.2325 207.194 49.643 212.179C43.241 219.226 39.4117 226.514 38.2131 233.906C37.95 235.556 38.6224 237.24 39.8501 238.065C40.3471 238.409 40.961 238.581 41.4871 238.581C42.2764 238.581 43.095 238.237 43.7381 237.584C47.8307 233.252 52.3617 230.124 58.0036 227.614C62.5931 225.517 67.5917 223.627 74.2859 221.495C78.8755 220.017 83.5234 218.676 88.2006 217.335C95.041 215.342 102.115 213.279 109.277 210.804C115.708 208.5 121.497 206.403 127.694 203.24C130.997 201.487 134.242 199.734 137.633 196.949C147.455 188.974 148.157 180.586 147.777 176.357C147.016 169.069 141.989 162.434 134.564 159.099C126.642 155.524 114.685 155.215 104.922 165.253C103.665 166.559 103.431 168.725 104.279 170.375C105.185 172.025 106.909 172.679 108.459 171.888C113.691 169.241 123.134 171.372 125.765 173.538C125.004 174.226 123.221 175.463 119.187 176.873C115.358 178.282 111.294 179.623 107.173 180.998L107.26 180.929H107.231Z"
                fill="white"
                fill-opacity="0.6"
              />
              <path
                class="ventus-wind-path ventus-bottom-curl"
                d="M247.573 316.199C245.79 306.574 241.083 299.939 237.196 295.195C233.512 290.726 229.098 286.739 223.574 282.751C221.381 280.998 219.043 279.691 216.734 278.454L208.402 273.951C208.402 273.951 208.11 273.847 207.964 273.779L196.125 269.722C195.132 269.413 194.138 269.241 193.085 269.069L191.945 268.828C171.98 264.772 150.729 266.663 128.659 274.569C107.554 282.201 89.0798 292.995 73.821 306.677C72.5348 307.846 72.1255 309.909 72.827 311.593C73.5286 313.312 75.1656 314.171 76.7149 313.656C93.3476 308.327 113.108 302.311 133.307 298.702C153.535 294.817 171.688 294.542 187.414 297.774C187.853 297.877 188.35 297.945 188.818 298.014C189.373 298.117 189.957 298.186 189.367 298.324L199.545 301.246L205.947 304.34C207.789 305.233 209.543 306.058 211.384 307.262C215.038 309.427 218.575 312.074 221.528 314.962C224.363 317.712 226.409 320.531 227.081 322.697C227.637 324.519 227.725 326.1 226.38 328.437C225.035 330.947 222.2 333.319 218.838 334.728C215.447 336.31 211.764 336.619 208.256 335.622C204.953 334.797 201.709 332.116 199.136 327.922C198.201 326.409 196.505 325.859 195.044 326.684C193.582 327.441 192.793 329.331 193.144 331.153C194.547 338.441 198.522 344.904 203.813 348.41C208.753 351.985 214.132 352.982 218.633 352.982C219.978 352.982 221.264 352.879 222.434 352.742C229.566 351.642 235.617 348.342 240.411 343.048C246.403 336.928 249.385 325.687 247.485 316.337L247.631 316.165L247.573 316.199Z"
                fill="white"
                fill-opacity="0.6"
              />
              <path
                class="ventus-wind-path ventus-wisp"
                d="M40.5577 157.791C13.1083 159.613 -0.864775 175.943 0.0414334 205.027C0.0998984 207.089 1.50296 208.739 3.22768 208.842C4.63084 208.946 5.97555 208.946 7.26178 208.946C19.8318 208.946 29.4785 204.82 35.9681 196.81C42.7208 188.422 45.5565 176.08 44.0949 161.229C43.8902 159.132 42.3408 157.585 40.5577 157.722V157.791Z"
                fill="white"
                fill-opacity="0.6"
              />
            </g>
          </svg>
          <span class="relative z-10 font-bold text-3xl sm:text-4xl lg:text-ds-48 text-[#0709a2] tracking-tight uppercase">
            VENTUS
          </span>
        </div>
      </div>

      <!-- Logo Teanis lớn ở giữa -->
      <div v-if="brandLogo" class="w-full flex items-center justify-center mb-[50px] lg:mb-[260px]">
        <img
          :src="brandLogo"
          alt="Teanis Brand Logo"
          class="w-full max-w-[500px] sm:max-w-[700px] lg:max-w-[888px] h-auto object-contain select-none pointer-events-none"
          @error="(e: any) => { e.target.src = '/images/philosophy/teanis-brand-logo.svg' }"
        />
      </div>

      <!-- Câu chuyện diễn giải (Hỗ trợ WYSIWYG Editor: Tự do format bôi đậm & margin-bottom 1.25rem) -->
      <div
        v-if="formattedStoryHtml"
        class="max-w-full mx-auto text-[#141414] text-ds-16 sm:text-ds-18 font-normal lg:mb-5 text-left [&_p]:mb-5 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_b]:font-bold [&_strong]:text-[#141414]"
        v-html="formattedStoryHtml"
      />

      <!-- Khối Monogram & Hệ giá trị -->
      <div
        v-if="symbolVideo || symbolIcon || symbolTitle || symbolDesc"
        class="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-[116px] items-center justify-between py-12 lg:py-[100px] lg:mb-5"
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

        <!-- Text Monogram (Phải) -->
        <div class="flex-1 flex flex-col gap-4 lg:gap-8 text-left">
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

      <!-- Slogan kết luận cố định bằng code từ local -->
      <div class="py-8 lg:py-14 text-center select-none">
        <p class="text-4xl sm:text-6xl lg:text-ds-82 font-normal uppercase">
          <span class="text-[#141414]">SHAPE UP FOR <span class="text-[#00D1BC]">GROWTH</span></span>
        </p>
      </div>

    </div>
  </section>
</template>
