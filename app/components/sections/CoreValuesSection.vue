<script setup lang="ts">
import { computed } from 'vue'

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
</script>

<template>
  <section
    id="core-values"
    class="pt-10 lg:pt-14 pb-20 lg:pb-32 relative overflow-hidden transition-colors duration-300"
    :style="{ backgroundColor: bgColor || '#F0F0F0' }"
  >
    <div class="max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0 relative">

      <!-- Section Title (Figma node 1:862) -->
      <div class="text-center mb-10 lg:mb-[100px]">
        <h2 class="text-3xl sm:text-4xl lg:text-ds-36 font-bold text-[#141414] tracking-tight">
          {{ title || 'Giá trị cốt lõi' }}
        </h2>
      </div>

      <!-- Container holding center arrows + 4 Cards (Figma node 1:863) -->
      <div class="relative w-full">

        <!-- Background Circular Arrows Cycle (Figma node 1:864) -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <img
            src="/images/values/circle-arrows.webp"
            alt="Core Values Cycle"
            class=" xl:w-full max-w-none aspect-[672/674] object-contain opacity-65"
          />
        </div>

        <!-- 4 Service Cards Grid (Figma node 1:871) -->
        <!-- Exact gap from Figma: gap-x-[31px] gap-y-[23px] -->
        <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-x-[31px] lg:gap-y-[23px] w-full max-w-[1399px] mx-auto">

          <div
            v-for="card in cards"
            :key="card.symbol"
            class="group relative w-full aspect-[684/284] min-h-[200px] sm:min-h-[240px] lg:min-h-[284px] flex items-center transition-all duration-300 cursor-pointer"
          >
            <!-- Default BG -->
            <img
              :src="card.bg"
              :alt="card.title"
              class="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 transition-opacity duration-300 ease-out group-hover:opacity-0"
            />

            <!-- Hover BG -->
            <img
              :src="card.hoverBg"
              :alt="`${card.title} Hover`"
              class="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
            />

            <!-- Content -->
            <div :class="['relative z-10 flex flex-col gap-1.5 sm:gap-2', card.pad]">
              <h3 :class="['text-xl sm:text-2xl lg:text-ds-36 font-bold text-[#141414] transition-colors duration-300', card.isDarkHover ? 'group-hover:text-white' : 'group-hover:text-[#0709A2]']">
                {{ card.title }}
              </h3>
              <p :class="['text-ds-16 sm:text-ds-18 font-normal text-[#141414] transition-colors duration-300', card.isDarkHover ? 'group-hover:text-white/90' : 'group-hover:text-[#0709A2]']">
                {{ card.desc }}
              </p>
            </div>
          </div>



        </div>

      </div>

    </div>
  </section>
</template>
