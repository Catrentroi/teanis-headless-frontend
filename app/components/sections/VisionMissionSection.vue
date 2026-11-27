<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStoryMotion } from '~/composables/useStoryMotion'

if (import.meta.client) gsap.registerPlugin(ScrollTrigger)

interface Props {
  subtitle?: string
  title?: string
  description?: string
  visionTitle?: string
  visionText?: string
  visionIcon?: string
  missionTitle?: string
  missionItems?: string[]
  missionIcon?: string
  bgColor?: string
}

defineProps<Props>()

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null
const { prefersReducedMotion, revealMaskedLines } = useStoryMotion()

onMounted(() => {
  if (!sectionRef.value) return
  ctx = gsap.context(() => {
    revealMaskedLines('.vm-header', {
      trigger: sectionRef.value,
      start: 'top 82%'
    })

    if (prefersReducedMotion()) return

    const cards = [
      { sel: '.vision-card', fromX: -24 },
      { sel: '.mission-card', fromX: 24 }
    ]
    cards.forEach(({ sel, fromX }) => {
      const el = sectionRef.value?.querySelector(sel)
      if (!el) return
      gsap.fromTo(
        el,
        { x: fromX, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'center 60%',
            scrub: 0.6
          }
        }
      )
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="vision-mission"
    ref="sectionRef"
    class="pt-20 lg:pt-32 pb-8 lg:pb-10 relative overflow-hidden transition-colors duration-300"
    :style="{ backgroundColor: bgColor }"
  >
    <div class="max-w-[1400px] mx-auto px-[15px]">
      
      <!-- Section Header Badge & Subtitle (Figma node 1:837) -->
      <div class="vm-header flex flex-col items-center justify-center text-center mb-12 lg:mb-[100px]">
        <!-- 4 Cyan Squares Badge with Subtitle -->
        <div class="flex items-center justify-center gap-2.5 mb-6">
          <div class="vm-dot">
            <img src="/images/company/dot.svg" alt="dot" class="w-full h-full">
          </div>
          <span class="text-ds-24 font-bold text-[#141414] tracking-tight">
            {{ subtitle }}
          </span>
        </div>

        <!-- Optional Big Section Title (36px) -->
        <h2
          v-if="title"
          class="text-2xl sm:text-3xl lg:text-ds-36 font-semibold text-[#141414] max-w-[900px] mb-6"
        >
          {{ title }}
        </h2>

        <!-- Description under badge/title -->
        <p
          v-if="description"
          class="text-ds-16 sm:text-ds-18 text-[#141414] font-normal max-w-[700px]"
        >
          {{ description }}
        </p>
      </div>

      <!-- 2 Cards Grid: Tầm nhìn & Sứ mệnh (Figma node 1:840) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-[50px] w-full">
        
        <!-- Card 1: Tầm nhìn (Figma node 1:841) -->
        <div
          v-if="visionText"
          class="vision-card relative rounded-[20px] border border-[#e3eef8] px-5 py-6 md:px-6 md:py-7 lg:px-10 lg:py-8 overflow-hidden flex flex-col justify-center items-center text-center min-h-[180px] lg:min-h-[204px] shadow-2xs"
        >
          <!-- Eye Icon Watermark (Figma node 1:842) -->
          <img
            src="/images/values/vision-eye.svg"
            alt="Eye watermark"
            class="absolute right-0 top-0 h-full max-h-[170px] w-auto object-contain pointer-events-none select-none opacity-80 z-0"
          />

          <!-- Content overlay -->
          <div class="relative z-10 w-full flex flex-col items-center">
            <h3 class="text-2xl sm:text-3xl lg:text-ds-36 font-bold text-[#141414] mb-3 lg:mb-5">
              {{ visionTitle }}
            </h3>
            <p class="text-[#141414] text-ds-16 sm:text-ds-18 font-normal max-w-[480px]">
              {{ visionText }}
            </p>
          </div>
        </div>

        <!-- Card 2: Sứ mệnh (Figma node 1:850) -->
        <div
          v-if="missionItems && missionItems.length > 0"
          class="mission-card relative rounded-[20px] border border-[#e3eef8] px-5 py-6 md:px-6 md:py-7 lg:px-10 lg:py-8 overflow-hidden flex flex-col justify-center items-center text-center min-h-[180px] lg:min-h-[204px] shadow-2xs"
        >
          <!-- Target Icon Watermark (Figma node 1:851) -->
          <img
            src="/images/values/mission-target.svg"
            alt="Target watermark"
            class="absolute -scale-x-100 right-2 sm:right-4 top-1/2 -translate-y-1/2 h-[90%] max-h-[170px] w-auto object-contain pointer-events-none select-none opacity-80 z-0"
          />

          <!-- Content overlay -->
          <div class="relative z-10 w-full flex flex-col items-center">
            <h3 class="text-2xl sm:text-3xl lg:text-ds-36 font-bold text-[#141414] mb-3 lg:mb-5">
              {{ missionTitle }}
            </h3>
            <ul class="flex flex-col gap-2.5 max-w-[480px] text-center">
              <li
                v-for="item in missionItems"
                :key="item"
                class="mission-item flex items-start gap-2.5 text-[#141414] text-ds-16 sm:text-ds-18 font-normal justify-center"
              >
                <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#141414] shrink-0" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
