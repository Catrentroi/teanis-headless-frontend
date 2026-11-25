<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ValueCard {
  symbol?: string
  title: string
  desc: string
}

interface Props {
  subtitle?: string
  title?: string
  values?: ValueCard[]
  bgColor?: string
}

const props = defineProps<Props>()

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null
let wheelTween: gsap.core.Tween | null = null

// Default fallback items from Figma node 1:861
const defaultValues: ValueCard[] = [
  { symbol: 'S', title: 'Steadfastness', desc: 'Kiên định trong mục tiêu, lý tưởng.' },
  { symbol: 'F', title: 'Flexibility', desc: 'Linh hoạt trong cách làm, quá trình.' },
  { symbol: 'P', title: 'Passion', desc: 'Nhiệt huyết, đam mê trong phẩm chất.' },
  { symbol: 'B', title: 'Breakthrough', desc: 'Đột phá trong kết quả, thành tựu.' }
]

const visualConfigs = [
  { symbol: 'S', bg: '/images/values/card-s.webp', hoverBg: '/images/values/card-s-hover.svg', pad: 'pl-6 sm:pl-10 lg:pl-[40px] pr-20 sm:pr-28 lg:pr-[200px] max-w-[500px]', isDarkHover: true },
  { symbol: 'F', bg: '/images/values/card-f.webp', hoverBg: '/images/values/card-f-hover.svg', pad: 'pl-24 sm:pl-36 lg:pl-[277px] pr-6 sm:pr-10 max-w-[620px]', isDarkHover: true },
  { symbol: 'P', bg: '/images/values/card-p.webp', hoverBg: '/images/values/card-p-hover.svg', pad: 'pl-6 sm:pl-10 lg:pl-[40px] pr-20 sm:pr-28 lg:pr-[200px] max-w-[500px]', isDarkHover: true },
  { symbol: 'B', bg: '/images/values/card-b.webp', hoverBg: '/images/values/card-b-hover.svg', pad: 'pl-24 sm:pl-36 lg:pl-[277px] pr-6 sm:pr-10 max-w-[620px]', isDarkHover: false }
]

const cards = computed(() => {
  const list = props.values && props.values.length > 0 ? props.values : defaultValues
  return visualConfigs.map((cfg, idx) => {
    const data = list.find(v => v.symbol?.toUpperCase() === cfg.symbol) || list[idx] || defaultValues[idx]
    return { ...cfg, ...data }
  })
})

onMounted(() => {
  if (!sectionRef.value) return
  ctx = gsap.context(() => {
    const wheel = sectionRef.value?.querySelector('.center-arrows-wheel')
    if (wheel) {
      wheelTween = gsap.to(wheel, {
        rotation: 360,
        transformOrigin: '50% 50%',
        repeat: -1,
        duration: 24,
        ease: 'none',
        paused: true
      })
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const dx = isMobile ? 50 : 120
    const dy = isMobile ? 80 : 150

    // Khởi tạo trạng thái ban đầu và tuần tự 4 thẻ S -> F -> P -> B
    const steps = [
      { sel: '.value-card-s', prev: null, x: -dx, y: dy, hoverColor: '#ffffff' },
      { sel: '.value-card-f', prev: '.value-card-s', x: dx, y: dy, hoverColor: '#ffffff' },
      { sel: '.value-card-p', prev: '.value-card-f', x: -dx, y: -dy, hoverColor: '#ffffff' },
      { sel: '.value-card-b', prev: '.value-card-p', x: dx, y: -dy, hoverColor: '#0709A2' }
    ] as const

    steps.forEach(s => gsap.set(s.sel, { x: s.x, y: s.y, opacity: 0, scale: 0.9 }))
    gsap.set('.center-arrows-wrapper', { scale: 0.3, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: '+=2400',
        pin: true,
        pinSpacing: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress >= 0.88) {
            wheelTween?.play()
            gsap.set('.value-card .card-hover-bg, .value-card .card-title, .value-card .card-desc', {
              clearProps: 'opacity,color'
            })
          } else {
            wheelTween?.pause()
          }
        }
      }
    })

    steps.forEach((s, idx) => {
      const t = idx * 1.6
      const hoverBg = `${s.sel} .card-hover-bg`
      const textEls = `${s.sel} .card-title, ${s.sel} .card-desc`

      if (s.prev) tl.to(s.prev, { opacity: 0.2, duration: 0.3, ease: 'power1.out' }, t)
      tl.to(s.sel, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, t)
      tl.to(hoverBg, { opacity: 1, duration: 0.35, ease: 'power1.inOut' }, t + 0.4)
      tl.to(textEls, { color: s.hoverColor, duration: 0.35 }, t + 0.4)
      tl.to(hoverBg, { opacity: 0, duration: 0.35, ease: 'power1.inOut' }, t + 0.75)
      tl.to(textEls, { color: '#141414', duration: 0.35 }, t + 0.75)
      tl.to(s.sel, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' }, t + 1.1)
    })

    // Bước 5: Cả 4 thẻ sáng rõ 100% -> Vòng tròn xuất hiện & xoay
    tl.to('.value-card', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 6.4)
    tl.to('.center-arrows-wrapper', { scale: 1, opacity: 0.65, duration: 0.6, ease: 'back.out(1.4)' }, 6.5)
    tl.to({}, { duration: 0.5 }, 7.1)
  }, sectionRef.value)
})

onUnmounted(() => {
  wheelTween?.kill()
  ctx?.revert()
})
</script>

<template>
  <section
    id="core-values"
    ref="sectionRef"
    class="py-14 lg:pt-[56px] lg:pb-[128px] min-h-screen flex flex-col justify-center relative overflow-hidden transition-colors duration-300"
    :style="{ backgroundColor: bgColor || '#F0F0F0' }"
  >
    <div class="max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0 w-full relative">

      <!-- Section Title (Figma node 1:862)s -->
      <div class="text-center mb-[20px]">
        <h2 class="text-3xl sm:text-4xl lg:text-ds-36 font-bold text-[#141414] tracking-tight">
          {{ title || 'Giá trị cốt lõi' }}
        </h2>
      </div>

      <!-- Container holding center arrows + 4 Cards (Figma node 1:863) -->
      <div class="relative w-full">

        <!-- Background Circular Arrows Cycle (Figma node 1:864) -->
        <div class="center-arrows-wrapper absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <img
            src="/images/values/circle-arrows.webp"
            alt="Core Values Cycle"
            class="center-arrows-wheel xl:w-full max-w-none aspect-[672/674] object-contain opacity-65"
          />
        </div>

        <!-- 4 Service Cards Grid (Figma node 1:871) -->
        <!-- Exact gap from Figma: gap-x-[31px] gap-y-[23px] -->
        <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-x-[31px] lg:gap-y-[23px] w-full max-w-[1400px] mx-auto">

          <div
            v-for="card in cards"
            :key="card.symbol"
            :class="[
              'value-card',
              `value-card-${card.symbol?.toLowerCase()}`,
              'group relative w-full aspect-[684/284] min-h-[200px] sm:min-h-[240px] lg:min-h-[284px] flex items-center cursor-pointer'
            ]"
          >
            <!-- Default BG -->
            <img
              :src="card.bg"
              :alt="card.title"
              class="card-default-bg absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 transition-opacity duration-300 ease-out group-hover:opacity-0"
            />

            <!-- Hover BG -->
            <img
              :src="card.hoverBg"
              :alt="`${card.title} Hover`"
              class="card-hover-bg absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
            />

            <!-- Content -->
            <div :class="['relative z-10 flex flex-col gap-1.5 sm:gap-2', card.pad]">
              <h3 :class="['card-title text-xl sm:text-2xl lg:text-ds-36 font-bold text-[#141414] transition-colors duration-300', card.isDarkHover ? 'group-hover:text-white' : 'group-hover:text-[#0709A2]']">
                {{ card.title }}
              </h3>
              <p :class="['card-desc text-ds-16 sm:text-ds-18 font-normal text-[#141414] transition-colors duration-300', card.isDarkHover ? 'group-hover:text-white/90' : 'group-hover:text-[#0709A2]']">
                {{ card.desc }}
              </p>
            </div>
          </div>



        </div>

      </div>

    </div>
  </section>
</template>
