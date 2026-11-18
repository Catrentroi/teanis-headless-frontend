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

const cardList = computed(() => (props.values && props.values.length > 0 ? props.values : defaultValues))

// Find cards by symbol (case-insensitive) with fallback to index
const cardS = computed(() => cardList.value.find(v => v.symbol?.toUpperCase() === 'S') || cardList.value[0])
const cardF = computed(() => cardList.value.find(v => v.symbol?.toUpperCase() === 'F') || cardList.value[1])
const cardP = computed(() => cardList.value.find(v => v.symbol?.toUpperCase() === 'P') || cardList.value[2])
const cardB = computed(() => cardList.value.find(v => v.symbol?.toUpperCase() === 'B') || cardList.value[3])
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

          <!-- Card 1: Steadfastness (S) - Top Left (Figma node 1:872) -->
          <div
            v-if="cardS"
            class="group relative w-full aspect-[684/284] min-h-[200px] sm:min-h-[240px] lg:min-h-[284px] flex items-center transition-all duration-300 cursor-pointer"
          >
            <!-- Default BG: White Card with faint 'S' -->
            <img
              src="/images/values/card-s.webp"
              alt="Steadfastness"
              class="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 transition-opacity duration-300 ease-out group-hover:opacity-0"
            />

            <!-- Hover BG: Navy Blue Card S-C.svg with white vector illustration -->
            <img
              src="/images/values/card-s-hover.svg"
              alt="Steadfastness Hover"
              class="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
            />

            <!-- Content on the left (Figma: left-[40px], top-[calc(50%+41.89px)]) -->
            <div class="relative z-10 flex flex-col gap-1.5 sm:gap-2 pl-6 sm:pl-10 lg:pl-[40px] pr-20 sm:pr-28 lg:pr-[200px] max-w-[500px]">
              <h3 class="text-xl sm:text-2xl lg:text-ds-36 font-bold text-[#141414] group-hover:text-white transition-colors duration-300">
                {{ cardS.title }}
              </h3>
              <p class="text-ds-16 sm:text-ds-18 font-normal text-[#141414] group-hover:text-white/90 transition-colors duration-300">
                {{ cardS.desc }}
              </p>
            </div>
          </div>

          <!-- Card 2: Flexibility (F) - Top Right (Figma node 1:873) -->
          <div
            v-if="cardF"
            class="group relative w-full aspect-[684/284] min-h-[200px] sm:min-h-[240px] lg:min-h-[284px] flex items-center transition-all duration-300 cursor-pointer"
          >
            <!-- Default BG: White Card with faint 'F' -->
            <img
              src="/images/values/card-f.webp"
              alt="Flexibility"
              class="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 transition-opacity duration-300 ease-out group-hover:opacity-0"
            />

            <!-- Hover BG: Mint Cyan Card F-C.svg with white vector illustration -->
            <img
              src="/images/values/card-f-hover.svg"
              alt="Flexibility Hover"
              class="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
            />

            <!-- Content indented to the right (Figma: left-[277px], top-[calc(50%+42.41px)]) -->
            <div class="relative z-10 flex flex-col gap-1.5 sm:gap-2 pl-24 sm:pl-36 lg:pl-[277px] pr-6 sm:pr-10 max-w-[620px]">
              <h3 class="text-xl sm:text-2xl lg:text-ds-36 font-bold text-[#141414] group-hover:text-white transition-colors duration-300">
                {{ cardF.title }}
              </h3>
              <p class="text-ds-16 sm:text-ds-18 font-normal text-[#141414] group-hover:text-white/90 transition-colors duration-300">
                {{ cardF.desc }}
              </p>
            </div>
          </div>

          <!-- Card 3: Passion (P) - Bottom Left (Figma node 1:874) -->
          <div
            v-if="cardP"
            class="group relative w-full aspect-[684/284] min-h-[200px] sm:min-h-[240px] lg:min-h-[284px] flex items-center transition-all duration-300 cursor-pointer"
          >
            <!-- Default BG: White Card with faint 'P' -->
            <img
              src="/images/values/card-p.webp"
              alt="Passion"
              class="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 transition-opacity duration-300 ease-out group-hover:opacity-0"
            />

            <!-- Hover BG: Orange Card P-C.svg with white vector illustration -->
            <img
              src="/images/values/card-p-hover.svg"
              alt="Passion Hover"
              class="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
            />

            <!-- Content on the left (Figma: left-[40px], top-[calc(50%-3.12px)]) -->
            <div class="relative z-10 flex flex-col gap-1.5 sm:gap-2 pl-6 sm:pl-10 lg:pl-[40px] pr-20 sm:pr-28 lg:pr-[200px] max-w-[500px]">
              <h3 class="text-xl sm:text-2xl lg:text-ds-36 font-bold text-[#141414] group-hover:text-white transition-colors duration-300">
                {{ cardP.title }}
              </h3>
              <p class="text-ds-16 sm:text-ds-18 font-normal text-[#141414] group-hover:text-white/90 transition-colors duration-300">
                {{ cardP.desc }}
              </p>
            </div>
          </div>

          <!-- Card 4: Breakthrough (B) - Bottom Right (Figma node 1:875) -->
          <div
            v-if="cardB"
            class="group relative w-full aspect-[684/284] min-h-[200px] sm:min-h-[240px] lg:min-h-[284px] flex items-center transition-all duration-300 cursor-pointer"
          >
            <!-- Default BG: White Card with faint 'B' -->
            <img
              src="/images/values/card-b.webp"
              alt="Breakthrough"
              class="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 transition-opacity duration-300 ease-out group-hover:opacity-0"
            />

            <!-- Hover BG: Light Blue Card B-C.svg with dark blue vector illustration -->
            <img
              src="/images/values/card-b-hover.svg"
              alt="Breakthrough Hover"
              class="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
            />

            <!-- Content indented to the right (Figma: left-[277px], top-[calc(50%-2.59px)]) -->
            <div class="relative z-10 flex flex-col gap-1.5 sm:gap-2 pl-24 sm:pl-36 lg:pl-[277px] pr-6 sm:pr-10 max-w-[620px]">
              <h3 class="text-xl sm:text-2xl lg:text-ds-36 font-bold text-[#141414] group-hover:text-[#0709A2] transition-colors duration-300">
                {{ cardB.title }}
              </h3>
              <p class="text-ds-16 sm:text-ds-18 font-normal text-[#141414] group-hover:text-[#0709A2] transition-colors duration-300">
                {{ cardB.desc }}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>
