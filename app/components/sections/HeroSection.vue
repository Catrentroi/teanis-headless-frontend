<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InlineSvg from '~/components/ui/InlineSvg.vue'

interface Props {
  badge?: string
  title?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  illustration?: string
  bgColor?: string
  bgImage?: string
  hashtags?: string[]
  introDone?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  introDone: true
})

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null
let observer: IntersectionObserver | null = null

// Format title into 2 lines with white highlight on "GROWTH" matching Figma node 1:2539
const titleLines = computed(() => {
  if (!props.title) return null
  const upper = props.title.toUpperCase().trim()

  if (upper.includes('SHAPE UP') && upper.includes('GROWTH')) {
    return {
      line1: 'SHAPE UP',
      line2Prefix: 'FOR ',
      line2Highlight: 'GROWTH'
    }
  }

  const words = props.title.trim().split(/\s+/)
  if (words.length > 2) {
    const last = words.pop()
    const mid = words.pop()
    return {
      line1: words.join(' '),
      line2Prefix: mid + ' ',
      line2Highlight: last
    }
  }

  return {
    line1: props.title,
    line2Prefix: '',
    line2Highlight: ''
  }
})

const illustrationSrc = computed(() => {
  if (!props.illustration || props.illustration.includes('illustation.svg')) {
    return '/images/illustation.svg'
  }
  return props.illustration
})

let cachedSvg: SVGSVGElement | null = null
const isHeroVisible = ref(true)
let isSectionVisible = true

// Danh sách các tween đang chạy vĩnh viễn - để pause/resume với IntersectionObserver
const idleTweens: gsap.core.Tween[] = []

// Tự động nhóm các path của 2 người nếu SVG nạp từ WordPress chưa có thẻ <g>
function wrapSvgGroup(svg: SVGSVGElement, id: string, prefixes: string[]) {
  if (svg.querySelector(`#${id}`)) return
  const els = prefixes.map(d => svg.querySelector(`path[d*="${d}"]`)).filter(Boolean) as Element[]
  if (!els.length) return
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.id = id
  els[0].parentNode?.insertBefore(g, els[0])
  els.forEach(el => g.appendChild(el))
}

function ensureSvgGroups(svg: SVGSVGElement) {
  wrapSvgGroup(svg, 'person-left-upper', ['M298.239', 'M267.332', 'M209.689', 'M261.074', 'M172.714', 'M171.387', 'M197.933', 'M181.247', 'M185.797', 'M196.795', 'M230.926', 'M208.93', 'M172.524', 'M244.578'])
  wrapSvgGroup(svg, 'person-right-upper', ['M652.249', 'M629.874', 'M653.766', 'M619.066', 'M618.497', 'M640.682', 'M633.287', 'M627.788', 'M659.833', 'M635.942', 'M637.459', 'M623.048'])
}

function animateSvgPaths(svg: SVGSVGElement) {
  ensureSvgGroups(svg)
  idleTweens.length = 0

  // 1. Mũi tên, mây, badge, icon trôi bồng bềnh liên tục
  const floaters = [
    svg.querySelector('#float-arrow-blue') || svg.querySelector('path[d*="M661.498"]'),
    svg.querySelector('#float-cloud-cyan') || svg.querySelector('path[d*="M566.633"]'),
    svg.querySelector('#float-cloud-gold') || svg.querySelector('path[d*="M803.115"]'),
    svg.querySelector('#float-layer-box'),
    svg.querySelector('#float-like-badge'),
    svg.querySelector('#float-check-badge')
  ].filter(Boolean) as Element[]

  if (floaters.length > 0) {
    const tFloat = gsap.to(floaters, {
      y: -14,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: { each: 0.28, from: 'random' }
    })
    idleTweens.push(tFloat)
  }

  // 1.5. Đồ thị
  const chart = svg.querySelector('#float-pie-chart')
  if (chart) {
    const tChart = gsap.to(chart, {
      scale: 1.06,
      rotation: 6,
      transformOrigin: '50% 50%',
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    idleTweens.push(tChart)
  }

  // 2. Bánh răng xoay tròn liên tục
  const gears = svg.querySelectorAll('path[fill="#4CEFE1"]')
  if (gears.length > 0) {
    const tGears = gsap.to(gears, {
      rotation: 360,
      transformOrigin: '50% 50%',
      repeat: -1,
      duration: 4,
      ease: 'none'
    })
    idleTweens.push(tGears)
  }

  // 3. Người bên trái lắc lư quanh hông (treo khung tranh)
  const personLeft = svg.querySelector('#person-left-upper')
  if (personLeft) {
    const tLeft = gsap.to(personLeft, {
      rotation: 9,
      svgOrigin: '195 395',
      duration: 2.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    idleTweens.push(tLeft)
  }

  // 4. Người bên phải lắc lư quanh eo (với tay lên màn hình video)
  const personRight = svg.querySelector('#person-right-upper')
  if (personRight) {
    const tRight = gsap.to(personRight, {
      rotation: -6,
      svgOrigin: '636 385',
      duration: 2,
      delay: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    idleTweens.push(tRight)
  }

  // Nếu section đang ngoài viewport hoặc đang chờ intro thì pause để tiết kiệm tài nguyên
  if (!isSectionVisible || !props.introDone) {
    idleTweens.forEach(t => t.pause())
  }
}

function setupIntersectionObserver() {
  if (!sectionRef.value || typeof IntersectionObserver === 'undefined') return

  observer = new IntersectionObserver(
    ([entry]) => {
      isSectionVisible = entry.isIntersecting
      isHeroVisible.value = entry.isIntersecting
      const shouldRun = isSectionVisible && props.introDone
      idleTweens.forEach(t => (shouldRun ? t.resume() : t.pause()))
    },
    { threshold: 0.05 }
  )
  observer.observe(sectionRef.value)
}

function onSvgLoaded(svg: SVGSVGElement) {
  cachedSvg = svg
  if (ctx) {
    ctx.add(() => animateSvgPaths(svg))
  }
}

// Subtle mouse parallax on desktop (> 1024px)
function onHeroMouseMove(e: MouseEvent) {
  if (!sectionRef.value || window.innerWidth < 1024) return
  const xRatio = (e.clientX / window.innerWidth - 0.5) * 2
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 2

  gsap.to('.hero-illustration', {
    x: xRatio * -14,
    y: yRatio * -10,
    duration: 0.8,
    ease: 'power1.out',
    overwrite: 'auto'
  })
}

function onHeroMouseLeave() {
  gsap.to('.hero-illustration', {
    x: 0,
    y: 0,
    duration: 1,
    ease: 'power2.out',
    overwrite: 'auto'
  })
}

onMounted(() => {
  if (!sectionRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Choreographed entrance timeline (waits for introDone if intro overlay is active)
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      paused: !props.introDone
    })
    const addEntrance = (selector: string, vars: gsap.TweenVars, position?: gsap.Position) => {
      if (sectionRef.value?.querySelector(selector)) {
        tl.from(selector, vars, position)
      }
    }
    addEntrance('.hero-badge', { y: -24, opacity: 0, duration: 0.7 })
    addEntrance('.hero-title-line', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15 }, '-=0.4')
    addEntrance('.hero-desc', { y: 20, opacity: 0, duration: 0.7 }, '-=0.4')
    addEntrance('.hero-cta', { scale: 0.9, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' }, '-=0.4')
    addEntrance('.hero-illustration', { opacity: 0, x: 45, scale: 0.96, duration: 1 }, '-=0.7')

    if (!props.introDone) {
      const stopWatch = watch(
        () => props.introDone,
        (done) => {
          if (done) {
            tl.play()
            if (isSectionVisible) idleTweens.forEach(t => t.resume())
            stopWatch()
          }
        }
      )
    }

    if (cachedSvg) {
      animateSvgPaths(cachedSvg)
    }
  }, sectionRef.value)

  setupIntersectionObserver()
})

onUnmounted(() => {
  observer?.disconnect()
  idleTweens.forEach(t => t.kill())
  idleTweens.length = 0
  ctx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative overflow-hidden flex flex-col justify-between pt-[130px] sm:pt-[160px] lg:pt-[120px] min-h-[600px] lg:min-h-[840px]"
    :style="{
      backgroundColor: bgColor || (!bgImage ? '#20e9d6' : undefined),
      backgroundImage: bgImage ? `url(${bgImage})` : (bgColor ? undefined : 'linear-gradient(180deg, #20e9d6 0%, #17c8b7 100%)'),
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }"
    @mousemove="onHeroMouseMove"
    @mouseleave="onHeroMouseLeave"
  >
    <!-- Background "Tech" vector watermark matching Figma node 1:2472 (1170x283, built-in opacity 0.2) -->
    <img
      src="/images/Tech.svg"
      alt=""
      aria-hidden="true"
      class="absolute right-0 bottom-[52px] lg:bottom-[64px] w-[580px] sm:w-[860px] lg:w-[1171px] translate-y-16 max-w-none h-auto select-none pointer-events-none"
    />

    <!-- Soft ambient glow positioned above "SHAPE UP FOR GROWTH" (radial gradient, no expensive blur filter) -->
    <div
      class="absolute top-[12%] left-[4%] w-[460px] h-[460px] rounded-full pointer-events-none"
      style="background: radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%);"
    />

    <!-- Row 1: Main Content Container (max-w: 1400px) matching Figma node 1:2536 -->
    <div class="relative z-10 max-w-[1400px] mx-auto px-[15px] w-full flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-[87px] my-10 lg:my-[65px]">

      <!-- Left Column: Content section matching Figma node 1:2537 -->
      <div class="hero-content relative z-20 flex-1 w-full lg:max-w-[597px]">
        <div v-if="badge" class="hero-badge mb-4">
          <span class="inline-flex items-center px-3.5 py-1 rounded-full bg-white/40 text-[#0709a2] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            {{ badge }}
          </span>
        </div>

        <h1 v-if="title" class="font-bold text-5xl sm:text-6xl lg:text-[74px] xl:text-ds-82 uppercase text-[#141414]">
          <template v-if="titleLines">
            <span class="hero-title-line block">{{ titleLines.line1 }}</span>
            <span class="hero-title-line block">
              {{ titleLines.line2Prefix }}<span v-if="titleLines.line2Highlight" class="text-white">{{ titleLines.line2Highlight }}</span>
            </span>
          </template>
          <template v-else>
            <span class="hero-title-line block">{{ title }}</span>
          </template>
        </h1>

        <p v-if="description" class="hero-desc text-[#141414] text-ds-16 sm:text-ds-18 mt-4 sm:mt-5 lg:mt-0 max-w-[572px] font-normal">
          {{ description }}
        </p>

        <!-- CTA Button matching Figma node 1:2541 (_buttonLP/primary) -->
        <div v-if="ctaText" class="hero-cta mt-8 lg:mt-10">
          <a
            :href="ctaLink || '/contact'"
            class="bg-[#0709a2] hover:bg-[#060882] text-white rounded-[8px] pl-5 pr-1 py-1 h-[50px] inline-flex items-center gap-3 sm:gap-5 transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
          >
            <span class="text-ds-18 sm:text-ds-20 font-normal whitespace-nowrap">{{ ctaText }}</span>
            <div class="size-[42px] rounded-[4px] flex items-center justify-center shrink-0">
              <img
                src="/images/footer/arrow-up-right.svg"
                alt=""
                class="size-6"
              />
            </div>
          </a>
        </div>
      </div>

      <!-- Right Column: Tech Illustration matching Figma node 1:2542 (overlays behind text on mobile/tablet, breaks out on desktop) -->
      <div class="hero-illustration absolute right-0 top-1/2 -translate-y-1/2 z-0 opacity-35 sm:opacity-45 pointer-events-none flex items-center justify-end w-[85%] max-w-[520px] lg:static lg:translate-y-0 lg:z-auto lg:opacity-100 lg:pointer-events-auto lg:flex-1 lg:justify-start lg:w-[760px] xl:w-[892px] lg:max-w-none lg:shrink-0 lg:mr-[-120px] xl:mr-[-180px] 2xl:mr-[-240px]">
        <InlineSvg
          :src="illustrationSrc"
          alt="Hero Illustration"
          class="w-full lg:w-[760px] xl:w-[892px] h-auto [&_svg]:overflow-visible"
          @loaded="onSvgLoaded"
        />
      </div>
    </div>

    <!-- Row 2: Full-width Hashtags Marquee inside Hero matching Figma node 1:2697/1:2698 -->
    <div
      v-if="hashtags && hashtags.length > 0"
      class="w-full py-6 lg:py-[30px] overflow-hidden select-none relative z-10"
    >
      <div
        class="marquee-track flex gap-4 whitespace-nowrap animate-marquee"
        :class="{ 'marquee-paused': !isHeroVisible || !introDone }"
      >
        <div v-for="loop in 4" :key="loop" class="flex gap-4 items-center shrink-0">
          <span
            v-for="item in hashtags"
            :key="item"
            class="bg-[#baf8f3] text-[#48494d] px-4 py-2 rounded-[4px] text-ds-16 font-medium shadow-2xs hover:bg-[#a3f5ee] transition-colors"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 35s linear infinite;
}
.animate-marquee:hover,
.animate-marquee.marquee-paused {
  animation-play-state: paused;
}
</style>
