<script setup lang="ts">
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

// Default fallback items matching Figma node 1:825
const defaultItems: TimelineItem[] = [
  {
    year: '2015',
    title: '',
    desc: 'Suga thành lập, hoạt động trong lĩnh vực công nghệ.'
  },
  {
    year: '2019',
    title: '',
    desc: 'Mở rộng nhiều lĩnh vực kinh doanh. Hình thành Suga Group.'
  },
  {
    year: '2023',
    title: '',
    desc: 'Hợp nhất các team kỹ thuật thành Bộ phận phần mềm.'
  },
  {
    year: '2024',
    title: '',
    desc: 'Teanis Technologies chính thức ra đời.'
  }
]

const displayItems = computed(() => {
  if (props.items && props.items.length > 0) {
    return props.items
  }
  return defaultItems
})

// Visual configuration matching exact Figma specifications (node 1:825 / 1:830)
const milestoneConfigs = [
  {
    graphic: '/images/timeline/graphic-2015.svg',
    cardWidth: 'w-[307px]',
    cardHeight: 'h-[344px]',
    graphicBox: 'w-[120px] h-[342px] top-[31.17px] left-0',
    textBox: 'left-[81.44px] top-0 w-[220px]',
    accentColor: '#00D1BC'
  },
  {
    graphic: '/images/timeline/graphic-2019.svg',
    cardWidth: 'w-[311px]',
    cardHeight: 'h-[353px]',
    graphicBox: 'w-[140px] h-[353px] top-[31.17px] left-0',
    textBox: 'left-[91.44px] top-0 w-[220px]',
    accentColor: '#0709A2'
  },
  {
    graphic: '/images/timeline/graphic-2023.svg',
    cardWidth: 'w-[322px]',
    cardHeight: 'h-[358px]',
    graphicBox: 'w-[160px] h-[365px] top-[31.46px] left-[1.31px]',
    textBox: 'left-[102.75px] top-0 w-[220px]',
    accentColor: '#00D1BC'
  },
  {
    graphic: '/images/timeline/graphic-2024.svg',
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
    class="timeline-section py-20 lg:py-32 relative overflow-hidden transition-colors duration-300"
    :style="{ backgroundColor: bgColor || '#FFFFFF' }"
  >
    <!-- Standard 1400px container matching Figma node 1:825 -->
    <div class="max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0 w-full">

      <!-- Header Section (Figma node 1:826) -->
      <div class="timeline-header flex flex-col gap-8 mb-16 lg:mb-[100px]">
        <!-- Title Badge with Dot Shape (Figma node 1:827) -->
        <div class="flex items-center gap-2.5">
          <img
            src="/images/timeline/dot-shape.svg"
            alt="Icon"
            class="w-6 h-6.5 object-contain shrink-0"
          />
          <h2 class="text-ds-24 font-bold text-[#141414] tracking-tight">
            {{ title || 'Lịch sử hình thành' }}
          </h2>
        </div>

        <!-- Description Paragraph (Figma node 1:828) -->
        <p class="text-[#141414] text-ds-18 font-normal max-w-[800px]">
          {{ description || 'Teanis Technologies chính thức thành lập năm 2024, tiền thân là Bộ phận phát triển phần mềm thuộc Suga với hơn 10 năm kinh nghiệm hoạt động trong lĩnh vực.' }}
        </p>
      </div>

      <!-- Timeline Track Body (Figma node 1:830) -->
      <!-- Supports horizontal scroll on tablet/mobile while maintaining pristine layout -->
      <div class="timeline-track w-full overflow-x-auto xl:overflow-visible pb-10 xl:pb-0 scrollbar-none">
        <div class="relative min-w-[1360px] xl:min-w-0 xl:w-full h-[400px] flex items-end justify-between">

          <!-- Background Horizontal Runway Line (Figma node 1:831) -->
          <div
            class="timeline-runway absolute h-[30px] left-[50px] w-[calc(100%-20px)] xl:w-[1500px] top-[325px] pointer-events-none select-none z-0"
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
            v-for="(item, index) in displayItems"
            :key="item.year || index"
            :class="[
              'timeline-item relative shrink-0 z-10',
              milestoneConfigs[index % 4].cardWidth,
              milestoneConfigs[index % 4].cardHeight
            ]"
            :data-milestone="item.year"
            :data-index="index"
          >
            <!-- Pin Graphic Container (Dot + Line + 3D Diamond Base) -->
            <div
              :class="[
                'timeline-graphic absolute pointer-events-none select-none',
                milestoneConfigs[index % 4].graphicBox
              ]"
            >
              <img
                :src="milestoneConfigs[index % 4].graphic"
                :alt="`Cột mốc ${item.year}`"
                class="w-full h-full object-contain"
              />
            </div>

            <!-- Milestone Text Container (Year + Description) -->
            <div
              :class="[
                'timeline-content absolute flex flex-col items-start gap-1 select-text',
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
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
