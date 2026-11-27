<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface TimelineItem {
  year: string
  title?: string
  desc: string
  icon?: string
}

interface Props {
  subtitle?: string
  title?: string
  description?: string
  items?: TimelineItem[]
  bgColor?: string
}

const props = defineProps<Props>()

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
let ctx: gsap.Context | null = null

function updateScrollButtons() {
  const el = trackRef.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 4
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

function scrollTrack(dir: -1 | 1) {
  const el = trackRef.value
  if (!el) return
  el.scrollBy({ left: dir * 320, behavior: 'smooth' })
}

onMounted(() => {
  updateScrollButtons()
  window.addEventListener('resize', updateScrollButtons)
  if (!sectionRef.value) return
  gsap.registerPlugin(ScrollTrigger)
  const { getHeaderOffset, prefersReducedMotion, revealMaskedLines } = useStoryMotion()
  if (prefersReducedMotion()) return

  ctx = gsap.context(() => {
    revealMaskedLines('.timeline-header > *', {
      trigger: '.timeline-header',
      start: 'top 82%'
    })
    const items = sectionRef.value?.querySelectorAll('.timeline-item')
    if (!items || items.length === 0) return

    const mm = gsap.matchMedia()

    // Desktop (>= 1280px, khi không dùng thanh scroll ngang/button): giữ nguyên pin + scrub
    mm.add('(min-width: 1280px)', () => {
      const stepDuration = 1.2

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: () => `top ${getHeaderOffset(-80)}px`,
          end: '+=1600',
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })

      // 1. Runway line draws itself from left to right across the sequence
      tl.fromTo(
        '.timeline-runway',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, ease: 'none', duration: items.length * stepDuration },
        0
      )

      // 2. Sequential milestone reveals: Line first, then Disc & Text, then next milestone
      items.forEach((item, idx) => {
        const line = item.querySelector('.timeline-line')
        const disc = item.querySelector('.timeline-disc')
        const content = item.querySelector('.timeline-content')
        const startTime = idx * stepDuration

        if (idx > 0) {
          const prevItem = items[idx - 1]
          if (prevItem) {
            tl.to(prevItem, { opacity: 0.45, scale: 0.98, duration: 0.35, ease: 'power2.out' }, startTime)
          }
        }
        tl.to(item, { opacity: 1, scale: 1.02, duration: 0.35, ease: 'power2.out' }, startTime)

        // Step A: Line appears first (draws down from top)
        if (line) {
          tl.fromTo(
            line,
            { scaleY: 0, opacity: 0, transformOrigin: 'top center' },
            { scaleY: 1, opacity: 1, ease: 'power2.out', duration: 0.6 },
            startTime
          )
        }

        // Step B: Disc and Text appear next together
        if (disc) {
          tl.fromTo(
            disc,
            { scale: 0, opacity: 0, transformOrigin: 'center 82%' },
            { scale: 1, opacity: 1, ease: 'back.out(1.4)', duration: 0.5 },
            startTime + 0.45
          )
        }

        if (content) {
          tl.fromTo(
            content,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power2.out', duration: 0.5 },
            startTime + 0.5
          )
        }
      })

      // 3. Restore all milestones at sequence end
      tl.to(items, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, items.length * stepDuration)
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollButtons)
  ctx?.revert()
})

// Visual configuration matching exact Figma specifications (node 1:825 / 1:830)
const milestoneConfigs = [
  {
    lineGraphic: '/images/timeline/line-2015.svg',
    discGraphic: '/images/timeline/disc-2015.svg',
    cardWidth: 'w-[307px]',
    cardHeight: 'h-[344px]',
    graphicBox: 'w-[120px] h-[342px] top-[31.17px] left-0',
    textBox: 'left-[81.44px] top-0 w-[220px]',
    accentColor: '#00D1BC'
  },
  {
    lineGraphic: '/images/timeline/line-2019.svg',
    discGraphic: '/images/timeline/disc-2019.svg',
    cardWidth: 'w-[311px]',
    cardHeight: 'h-[353px]',
    graphicBox: 'w-[140px] h-[353px] top-[31.17px] left-0',
    textBox: 'left-[91.44px] top-0 w-[220px]',
    accentColor: '#0709A2'
  },
  {
    lineGraphic: '/images/timeline/line-2023.svg',
    discGraphic: '/images/timeline/disc-2023.svg',
    cardWidth: 'w-[322px]',
    cardHeight: 'h-[358px]',
    graphicBox: 'w-[160px] h-[365px] top-[31.46px] left-[1.31px]',
    textBox: 'left-[102.75px] top-0 w-[220px]',
    accentColor: '#00D1BC'
  },
  {
    lineGraphic: '/images/timeline/line-2024.svg',
    discGraphic: '/images/timeline/disc-2024.svg',
    cardWidth: 'w-[331px]',
    cardHeight: 'h-[365px]',
    graphicBox: 'w-[180px] h-[374px] top-[31.19px] left-0',
    textBox: 'left-[111.44px] top-0 w-[220px]',
    accentColor: '#0709A2'
  }
]
</script>

<template>
  <section
    id="timeline"
    ref="sectionRef"
    class="timeline-section min-h-screen flex flex-col justify-center py-20 lg:py-[128px] relative overflow-hidden transition-colors duration-300"
    :style="{ backgroundColor: bgColor }"
  >
    <!-- Standard 1400px container matching Figma node 1:825 -->
    <div class="max-w-[1400px] mx-auto px-[15px] w-full">

      <!-- Header Section (Figma node 1:826 — gap: 24px, mb: 100px to track) -->
      <div v-if="title || description" class="timeline-header flex flex-col gap-[24px] mb-12 lg:mb-[100px]">
        <!-- Title Badge with Dot Shape (Figma node 1:827) -->
        <div v-if="title" class="flex items-center gap-2.5">
          <img
            src="/images/timeline/dot-shape.svg"
            alt="Icon"
            class="w-6 h-6.5 object-contain shrink-0"
          />
          <h2 class="text-ds-24 font-bold text-[#141414] tracking-tight">
            {{ title }}
          </h2>
        </div>

        <!-- Description Paragraph (Figma node 1:828) -->
        <p v-if="description" class="text-[#141414] text-ds-18 font-normal max-w-[800px]">
          {{ description }}
        </p>
      </div>

      <!-- Mobile/Tablet Horizontal Scroll Controls -->
      <div v-if="items?.length" class="flex xl:hidden items-center justify-end gap-4 mb-4">
        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            :disabled="!canScrollLeft"
            class="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-[#141414] transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-default hover:border-[#0709a2] hover:text-[#0709a2]"
            aria-label="Xem cột mốc trước"
            @click="scrollTrack(-1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            :disabled="!canScrollRight"
            class="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-[#141414] transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-default hover:border-[#0709a2] hover:text-[#0709a2]"
            aria-label="Xem cột mốc tiếp theo"
            @click="scrollTrack(1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Timeline Track Body (Figma node 1:830 — gap-x: 38px, items-end) -->
      <!-- Supports horizontal scroll on tablet/mobile while maintaining pristine layout -->
      <div
        v-if="items?.length"
        ref="trackRef"
        class="timeline-track timeline-scrollbar w-full overflow-x-auto overflow-y-hidden xl:overflow-visible pb-6 xl:pb-0"
        @scroll="updateScrollButtons"
      >
        <div class="relative min-w-[1385px] xl:min-w-0 xl:w-full min-h-[415px] flex items-end gap-[38px]">

          <!-- Background Horizontal Runway Line (Figma node 1:831 — left: 50.65px, top: 325.25px, w: 1617px) -->
          <div
            class="timeline-runway absolute h-[30px] left-[50px] w-[calc(100%-20px)] xl:w-[1617px] top-[325px] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <img
              src="/images/timeline/timeline-line.svg"
              alt="Timeline Track"
              class="w-full h-full object-fill opacity-90"
            />
          </div>

          <!-- 4 Milestone Items (Figma node 1:832, 1:833, 1:834, 1:835) -->
          <div
            v-for="(item, index) in items"
            :key="item.year || index"
            :class="[
              'timeline-item relative shrink-0 z-10',
              milestoneConfigs[index % 4].cardWidth,
              milestoneConfigs[index % 4].cardHeight
            ]"
            :data-milestone="item.year"
            :data-index="index"
          >
            <!-- Pin Graphic Container: Split into Disc (bottom) and Line (top) -->
            <div
              :class="[
                'timeline-graphic absolute pointer-events-none select-none',
                milestoneConfigs[index % 4].graphicBox
              ]"
            >
              <!-- Part 2: Disc at bottom -->
              <img
                :src="milestoneConfigs[index % 4].discGraphic"
                :alt="`Cột mốc ${item.year} đĩa`"
                class="timeline-disc absolute inset-0 w-full h-full object-contain"
              />
              <!-- Part 1: Line pin on top -->
              <img
                :src="milestoneConfigs[index % 4].lineGraphic"
                :alt="`Cột mốc ${item.year} đường line`"
                class="timeline-line absolute inset-0 w-full h-full object-contain"
              />
            </div>

            <!-- Milestone Text Container (Year + Description — Figma: flex-col items-start, no gap) -->
            <div
              :class="[
                'timeline-content absolute flex flex-col items-start select-text',
                milestoneConfigs[index % 4].textBox
              ]"
            >
              <!-- Year Number -->
              <h3 class="text-ds-36 font-bold text-[#141414] tracking-tight">
                {{ item.year }}
              </h3>

              <!-- Optional Milestone Title (if provided in CMS) -->
              <p
                v-if="item.title"
                class="text-[#141414] text-ds-18 font-medium mb-2"
              >
                {{ item.title }}
              </p>

              <!-- Description -->
              <p class="text-[#141414] text-ds-18 font-normal">
                {{ item.desc }}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Thin visible horizontal scrollbar on mobile/tablet so users know more milestones exist */
.timeline-scrollbar::-webkit-scrollbar {
  height: 5px;
}
.timeline-scrollbar::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 9999px;
}
.timeline-scrollbar::-webkit-scrollbar-thumb {
  background: #00d1bc;
  border-radius: 9999px;
}
.timeline-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #00d1bc #e5e7eb;
}
</style>
