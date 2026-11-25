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

const PRE_FOOTER_ILLUSTRATION = '/images/footer/cta-frame.svg'

const resolvedIllustration = computed(() => {
  const raw = props.illustration?.trim()
  if (
    !raw ||
    raw.includes('/images/illustation.svg') ||
    raw.includes('illustrator-layer2.svg')
  ) {
    return PRE_FOOTER_ILLUSTRATION
  }
  return raw
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
    class="relative z-10 overflow-visible bg-transparent"
  >
    <!-- Figma 1:1018: cta-frame bắt đầu 186px (trên 1920) phía trên đáy Philosophy, đè lên gradient -->
    <div class="cta-wave-frame relative w-full leading-[0] -mt-[9.7vw]">
      <img
        :src="resolvedIllustration"
        alt="Teanis Business Solutions Collaboration"
        class="block h-auto w-full select-none object-cover object-bottom pointer-events-none"
        @error="(e: any) => { e.target.src = PRE_FOOTER_ILLUSTRATION }"
      />
    </div>

    <!-- CTA card: chồng mép dưới minh họa, không bị footer cắt (padding-bottom section) -->
    <div
      class="pointer-events-none absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 px-6 sm:px-8 xl:px-0"
    >
      <div
        class="cta-card-box pointer-events-auto relative mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 overflow-hidden rounded-[24px] px-6 py-8 shadow-2xl transition-colors duration-300 sm:flex-row sm:items-center sm:rounded-[32px] sm:px-12 sm:py-12 lg:gap-[56px] lg:px-[100px] lg:py-[72px] md:flex-row md:items-center"
        :style="{ backgroundColor: cardBgColor }"
      >
        <div
          class="pointer-events-none absolute inset-0 overflow-hidden select-none"
          aria-hidden="true"
        >
          <img
            src="/images/footer/cta-frame-overlay.svg"
            alt=""
            class="pointer-events-none absolute bottom-0 right-0 h-full w-full -scale-y-100 rotate-180 object-cover object-right-bottom opacity-70 sm:opacity-100"
          />
        </div>

        <div class="relative z-10 max-w-3xl">
          <h2 class="text-3xl font-medium tracking-tight text-[#141414] sm:text-4xl lg:text-ds-48">
            <template v-if="isWithUsSplit">
              <span class="block sm:inline">{{ headingBeforeWithUs }}</span>
              <span class="ml-1 font-medium text-white sm:ml-2">With Us</span>
            </template>
            <template v-else>
              {{ currentHeading }}
            </template>
          </h2>
        </div>

        <div class="relative z-10 shrink-0 self-start">
          <NuxtLink
            :to="buttonLink || '/#contact'"
            class="group inline-flex h-[50px] shrink-0 select-none items-center gap-3 rounded-[8px] bg-[#0709a2] py-1 pl-5 pr-1 text-white shadow-md transition-all hover:scale-105 hover:bg-[#050780] active:scale-95 sm:gap-5"
          >
            <span class="text-ds-18 font-normal sm:text-ds-20">{{ buttonText || 'Get in touch' }}</span>
            <span class="flex size-[42px] shrink-0 items-center justify-center rounded-[4px]">
              <img
                src="/images/footer/arrow-up-right.svg"
                alt=""
                class="size-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>