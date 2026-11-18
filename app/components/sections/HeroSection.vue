<script setup lang="ts">
import { computed, onMounted } from 'vue'
import gsap from 'gsap'

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
}

const props = defineProps<Props>()

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

onMounted(() => {
  gsap.from('.hero-content', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' })
  gsap.from('.hero-illustration', { opacity: 0, x: 40, duration: 1, delay: 0.2, ease: 'power2.out' })
})
</script>

<template>
  <section
    class="relative overflow-hidden flex flex-col justify-between pt-[130px] sm:pt-[150px] lg:pt-[170px]"
    :style="{
      backgroundColor: bgColor || (!bgImage ? '#20e9d6' : undefined),
      backgroundImage: bgImage ? `url(${bgImage})` : (bgColor ? undefined : 'linear-gradient(180deg, #20e9d6 0%, #17c8b7 100%)'),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '840px'
    }"
  >
    <!-- Background "Tech" vector watermark matching Figma node 1:2472 -->
    <div
      class="absolute right-[-20px] bottom-[80px] lg:bottom-[90px] select-none pointer-events-none opacity-20 font-black text-[200px] sm:text-[280px] lg:text-[360px] text-white leading-none tracking-tight pr-6"
    >
      Tech
    </div>

    <!-- Soft ambient glow -->
    <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/25 blur-3xl pointer-events-none" />

    <!-- Row 1: Main Content Container (max-w: 1400px) matching Figma node 1:2536 -->
    <div class="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0 w-full flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-[87px] my-auto">

      <!-- Left Column: Content section matching Figma node 1:2537 -->
      <div class="hero-content flex-1 w-full lg:max-w-[597px]">
        <div v-if="badge" class="mb-4">
          <span class="inline-flex items-center px-3.5 py-1 rounded-full bg-white/40 text-[#0709a2] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            {{ badge }}
          </span>
        </div>

        <h1 v-if="title" class="font-bold text-5xl sm:text-6xl lg:text-[74px] xl:text-ds-82 uppercase tracking-tight text-[#141414]">
          <template v-if="titleLines">
            <span class="block">{{ titleLines.line1 }}</span>
            <span class="block">
              {{ titleLines.line2Prefix }}<span v-if="titleLines.line2Highlight" class="text-white">{{ titleLines.line2Highlight }}</span>
            </span>
          </template>
          <template v-else>
            {{ title }}
          </template>
        </h1>

        <p v-if="description" class="text-[#141414] text-ds-16 sm:text-ds-18 mt-8 max-w-[572px] font-normal">
          {{ description }}
        </p>

        <!-- CTA Button matching Figma node 1:2541 (_buttonLP/primary) -->
        <div v-if="ctaText" class="mt-8 lg:mt-10">
          <a
            :href="ctaLink || '/contact'"
            class="bg-[#0709a2] hover:bg-[#060882] text-white rounded-[8px] pl-5 pr-1 py-1 h-[50px] inline-flex items-center gap-3 sm:gap-5 transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
          >
            <span class="text-ds-18 sm:text-ds-20 font-normal whitespace-nowrap">{{ ctaText }}</span>
            <div class="size-[42px] rounded-[4px] flex items-center justify-center shrink-0">
              <svg class="size-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </a>
        </div>
      </div>

      <!-- Right Column: Tech Illustration matching Figma node 1:2542 -->
      <div class="hero-illustration flex-1 flex items-center justify-center relative w-full lg:max-w-[740px] xl:max-w-[892px]">
        <img
          :src="illustration || '/images/illustation.svg'"
          alt="Hero Illustration"
          class="w-full max-w-[560px] lg:max-w-[700px] xl:max-w-[892px] h-auto object-contain filter drop-shadow-xl"
          @error="(e: any) => { e.target.src = '/images/illustation.svg' }"
        />
      </div>
    </div>

    <!-- Row 2: Full-width Hashtags Marquee inside Hero matching Figma node 1:2697/1:2698 -->
    <div
      v-if="hashtags && hashtags.length > 0"
      class="w-full mt-12 lg:mt-16 py-6 lg:py-[30px] overflow-hidden select-none relative z-10"
    >
      <div class="marquee-track flex gap-4 whitespace-nowrap animate-marquee">
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
.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
