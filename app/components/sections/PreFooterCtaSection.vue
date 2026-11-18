<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  illustration?: string
  heading?: string
  subheading?: string
  buttonText?: string
  buttonLink?: string
  bgColor?: string
}

const props = defineProps<Props>()

const resolvedIllustration = computed(() => {
  return props.illustration || '/images/footer/illustrator-layer2.svg'
})

const defaultHeading = "Let’s Talk About Business Solutions With Us"
const currentHeading = computed(() => props.heading || defaultHeading)

const isWithUsSplit = computed(() => {
  return currentHeading.value.includes('With Us')
})

const headingBeforeWithUs = computed(() => {
  if (!isWithUsSplit.value) return currentHeading.value
  return currentHeading.value.replace('With Us', '').trim()
})

const cardBgColor = computed(() => {
  // If bgColor is #F8FAFC (ACF default placeholder) or white, fallback to Figma design mint color #20e9d6
  if (
    !props.bgColor ||
    props.bgColor.toLowerCase() === '#f8fafc' ||
    props.bgColor.toLowerCase() === '#ffffff'
  ) {
    return '#20e9d6'
  }
  return props.bgColor
})
</script>

<template>
  <section
    id="cta-section"
    class="relative bg-white overflow-visible z-20"
  >
    <!-- Illustration Container (Green ground fills down to bottom border) -->
    <div class="w-full overflow-hidden block">
      <img
        :src="resolvedIllustration"
        alt="Teanis Business Solutions Collaboration"
        class="w-full min-h-[360px] sm:min-h-[460px] md:min-h-[560px] lg:min-h-0 h-auto object-cover object-bottom block select-none pointer-events-none"
      />
    </div>

    <!-- Overlapping CTA Card Banner (Positioned exactly on the boundary between Illustration and Footer) -->
    <div
      class="absolute left-0 right-0 bottom-0 translate-y-1/2 z-30 px-6 sm:px-8 xl:px-0 pointer-events-none"
    >
      <div
        class="pointer-events-auto max-w-[1400px] mx-auto relative overflow-hidden rounded-[24px] sm:rounded-[32px] px-6 py-8 sm:px-12 sm:py-12 lg:px-[100px] lg:py-[72px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 lg:gap-[56px] shadow-2xl transition-colors duration-300"
        :style="{
          backgroundColor: cardBgColor
        }"
      >
        <!-- Background Frame Wave Overlay from Figma -->
        <div
          class="absolute inset-0 pointer-events-none overflow-hidden select-none"
          aria-hidden="true"
        >
          <img
            src="/images/footer/cta-frame-overlay.svg"
            alt="CTA background pattern"
            class="absolute right-0 bottom-0 w-full h-full object-cover object-right-bottom opacity-70 sm:opacity-100 -scale-y-100 rotate-180 pointer-events-none"
          />
        </div>

        <!-- Left: Heading & Subheading -->
        <div class="relative z-10 max-w-3xl">
          <h2
            class="text-3xl sm:text-4xl lg:text-ds-48 font-medium tracking-tight text-[#141414]"
          >
            <template v-if="isWithUsSplit">
              <span class="block sm:inline">{{ headingBeforeWithUs }}</span>
              <span class="text-white font-medium ml-1 sm:ml-2">With Us</span>
            </template>
            <template v-else>
              {{ currentHeading }}
            </template>
          </h2>
        </div>

        <!-- Right: CTA Button -->
        <div class="relative z-10 shrink-0 self-start">
          <NuxtLink
            :to="buttonLink || '/#contact'"
            class="bg-[#0709a2] hover:bg-[#050780] text-white font-normal text-ds-18 sm:text-ds-20 h-[50px] pl-5 pr-1 py-1 rounded-[8px] flex items-center gap-3 sm:gap-5 transition-all hover:scale-105 active:scale-95 shadow-md shrink-0 group select-none"
          >
            <span>{{ buttonText || 'Get in touch' }}</span>
            <span
              class="size-[42px] rounded-[4px] flex items-center justify-center shrink-0"
            >
              <img
                src="/images/footer/arrow-up-right.svg"
                alt="Arrow right"
                class="size-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
