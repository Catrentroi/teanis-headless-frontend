<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VideoModal from '~/components/ui/VideoModal.vue'

if (import.meta.client) gsap.registerPlugin(ScrollTrigger)

interface Props {
  subtitle?: string
  title?: string
  phonetic?: string
  audioUrl?: string
  companyName?: string
  description?: string
  pillarsTitle?: string
  pillars?: Array<{ icon?: string; title: string }>
  commitmentsTitle?: string
  commitments?: string[]
  profileNote?: string
  videoPoster?: string
  videoUrl?: string
  ctaText?: string
  ctaLink?: string
  bgColor?: string
  bgImage?: string
}

const props = defineProps<Props>()

const isVideoOpen = ref(false)
const isVideoInView = ref(false)
const playAudio = () => { new Audio(props.audioUrl).play().catch(() => {}) }
const openVideo = () => { isVideoOpen.value = true }

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!sectionRef.value) return
  const { revealMaskedLines, prefersReducedMotion } = useStoryMotion()

  ctx = gsap.context(() => {
    if (!prefersReducedMotion()) {
      // Wind/wave sweep across the section from Hero teal into white
      const windSweep = sectionRef.value?.querySelector('.company-wind-sweep')
      if (windSweep) {
        gsap.fromTo(
          windSweep,
          { xPercent: -10, opacity: 1 },
          {
            xPercent: 115,
            opacity: 0,
            duration: 1.25,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: sectionRef.value,
              start: 'top 82%',
              once: true
            }
          }
        )
      }

      // Layered Video Card Entrance (Hướng A: 5 layers + 10+ badge + Play button)
      const videoCard = sectionRef.value?.querySelector('.video-card-container')
      if (videoCard) {
        const videoTl = gsap.timeline({
          scrollTrigger: {
            trigger: videoCard,
            start: 'top 76%',
            once: true
          }
        })
        videoTl
          .fromTo('.video-layer-bg', { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', clearProps: 'transform' }, 0)
          .fromTo('.video-layer-frame', { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', clearProps: 'transform' }, 0)
          .fromTo('.video-layer-poster', { scale: 0.93, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out', clearProps: 'transform' }, 0.18)
          .fromTo(['.experience-badge__one', '.experience-badge__ring', '.experience-badge__ring-inner'], { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'back.out(1.4)', clearProps: 'transform' }, 0.36)
          .fromTo('.experience-badge__plus', { scale: 0.5, rotation: -45, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.7)', clearProps: 'transform' }, 0.5)
          .fromTo('.experience-badge__copy', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', clearProps: 'transform' }, 0.56)
          .fromTo('.video-play-btn', { scale: 0.65, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.6)', clearProps: 'transform' }, 0.66)

        // Pause play-button pulse when scrolled outside viewport
        ScrollTrigger.create({
          trigger: videoCard,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => { isVideoInView.value = true },
          onEnterBack: () => { isVideoInView.value = true },
          onLeave: () => { isVideoInView.value = false },
          onLeaveBack: () => { isVideoInView.value = false }
        })
      }
    }

    revealMaskedLines('.info-reveal', {
      trigger: sectionRef.value,
      start: 'top 78%'
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="company-info"
    ref="sectionRef"
    class="py-20 lg:pt-32 lg:pb-[100px] relative overflow-hidden transition-colors duration-300"
    :style="{
      backgroundColor: bgColor,
      backgroundImage: bgImage ? `url(${bgImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }"
  >
    <!-- Wind/Wave Transition Sweep from Hero -->
    <div
      class="company-wind-sweep pointer-events-none absolute inset-y-0 -left-[15%] w-[130%] z-20 -skew-x-12 bg-gradient-to-r from-[#17c8b7]/25 via-[#baf5ed]/65 to-transparent opacity-0"
      aria-hidden="true"
    />

    <!-- Max-width 1400px Container matching Figma node 1:664 / 1:666 -->
    <div class="max-w-[1400px] mx-auto px-[15px] w-full">

      <!-- Section Title Badge (Figma node 1:665) -->
      <div class="info-reveal flex items-center mb-[36px] gap-[10px]">
        <div class="shrink-0">
          <img src="/images/company/dot.svg" alt="dot" class="w-full h-full">
        </div>
        <span class="text-ds-24 font-bold text-[#141414]">
          {{ subtitle }}
        </span>
      </div>

      <!-- 2-column layout matching Figma node 1:666 (Company Overview) -->
      <div class="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-[32px]">

        <!-- Left Column: Details (Figma node 1:667 — w: 684px, pt: 40px, pr: 40px) -->
        <div class="w-full lg:w-[684px] lg:shrink-0 lg:pt-[40px] lg:pr-[40px]">

          <!-- Brand Title & Phonetic (Figma node 1:668 — mb: 40px to content) -->
          <div class="info-reveal mb-[40px]">
            <h2 class="text-2xl sm:text-3xl lg:text-ds-36 font-medium text-[#141414] mb-[12px]">
              <span class="text-[#00d1bc]">Teanis</span> Technologies
            </h2>

            <div class="flex items-center gap-[20px] text-ds-18 text-[#141414]">
              <span>Teanis phát âm <span class="text-[#00d1bc]">“ti-a-nis”</span>.</span>
              <button
                type="button"
                class="w-8 h-8 inline-flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer shrink-0"
                aria-label="Phát âm thương hiệu"
                @click="playAudio"
              >
                <img src="/images/company/sound-icon.webp" alt="Phát âm" class="w-6 h-6 object-contain" />
              </button>
            </div>
          </div>

          <!-- Content Container (Figma node 1:675 — pr: 82px => 562px text width) -->
          <div class="lg:pr-[82px]">
            <!-- Description paragraph (Figma node 1:676 — mb: 24px) -->
            <p v-if="description" class="info-reveal text-[#141414] text-ds-18 font-normal leading-[1.5] mb-[24px]">
              {{ description }}
            </p>

            <!-- 3 Pillars Row with custom intro title (Figma node 1:678 — mb: 24px) -->
            <div v-if="pillarsTitle || pillars?.length" class="info-reveal mb-[24px]">
              <p v-if="pillarsTitle" class="text-[#141414] text-ds-18 font-normal leading-[1.5] mb-[10px]">
                {{ pillarsTitle }}
              </p>

              <div v-if="pillars?.length" class="flex flex-wrap items-center gap-6 lg:gap-[10px]">
                <div
                  v-for="(pillar, idx) in pillars"
                  :key="pillar.title || idx"
                  class="flex items-center gap-[16px] py-[8px] lg:flex-1"
                >
                  <img
                    v-if="pillar.icon"
                    :src="pillar.icon"
                    :alt="pillar.title"
                    class="w-10 h-10 object-contain shrink-0"
                  />
                  <span class="text-ds-18 font-medium text-[#141414] whitespace-nowrap">
                    {{ pillar.title }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Commitments List with custom intro title (Figma node 1:767) -->
            <div v-if="commitmentsTitle || commitments?.length" class="info-reveal">
              <p v-if="commitmentsTitle" class="text-[#141414] text-ds-18 font-normal leading-[1.5] mb-[10px]">
                {{ commitmentsTitle }}
              </p>

              <ul v-if="commitments?.length" class="pl-1">
                <li
                  v-for="item in commitments"
                  :key="item"
                  class="flex items-start text-[#141414] text-ds-18 font-normal leading-[1.5] mb-[10px] last:mb-0"
                >
                  <span class="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#141414] shrink-0 mr-[12px]" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Column: Video & 10+ Experience Fixed Layers Card (Figma node 1:772 / 1:776 — w: 683px, align left so 734px card overflows right) -->
        <div class="w-full lg:w-[683px] lg:shrink-0 flex flex-col items-start">

          <!-- Layered Video Card Container (Figma 1:776 — 734x504) -->
          <div
            class="video-card-container group/video relative w-full lg:w-[734px] max-w-none aspect-[735/504] flex items-center justify-center"
          >

            <!-- Layer 1: Background Mint Tilted Shape (Figma node 1:777 / 1:778) -->
            <img
              src="/images/company/card-bg-shape.webp"
              alt="Decorative Shape"
              class="video-layer-bg absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0"
            />

            <!-- Layer 2: Main Video Poster Box (Pre-cropped WebP/PNG with transparent corners) -->
            <div class="video-layer-poster absolute left-[7.62%] top-[0.4%] w-[85.17%] h-[84.52%] z-10 flex items-center justify-center">
              <picture class="w-full h-full block transition-transform duration-500 ease-out group-hover/video:scale-[1.03]">
                <source :srcset="videoPoster" type="image/webp" />
                <img
                  :src="videoPoster"
                  alt="Teanis Team Video"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-contain pointer-events-none select-none"
                  @error="(e: any) => { e.target.src = '/images/company/video-poster.webp' }"
                />
              </picture>

              <!-- Layer 3: "10+ YEAR OF EXPERIENCE" — Figma 1:781 @ vector 627×431 -->
              <div
                class="experience-badge absolute inset-0 z-20 pointer-events-none select-none"
                aria-hidden="true"
              >
                <img
                  src="/images/company/exp-1.svg"
                  alt="10 years experience icon part 1"
                  class="experience-badge__one"
                />
                <img
                  src="/images/company/exp-ring.svg"
                  alt="10 years experience ring outer"
                  class="experience-badge__ring"
                />
                <img
                  src="/images/company/exp-ring-inner.svg"
                  alt="10 years experience ring inner"
                  class="experience-badge__ring-inner"
                />
                <img
                  src="/images/company/exp-plus.svg"
                  alt="10 years experience plus sign"
                  class="experience-badge__plus"
                />
                <div class="experience-badge__copy">
                  <p class="mb-0">YEAR OF</p>
                  <p>EXPERIENCE</p>
                </div>
              </div>

              <!-- Layer 4: Bottom-Left Play Video Button (Figma node 1:796) -->
              <button
                type="button"
                class="video-play-btn absolute bottom-[4.5%] left-[3.2%] z-30 w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-hidden"
                aria-label="Phát video giới thiệu"
                @click="openVideo"
              >
                <span
                  v-if="isVideoInView"
                  class="video-play-pulse absolute inset-0 rounded-full bg-[#00d1bc]/40 pointer-events-none"
                  aria-hidden="true"
                />
                <img src="/images/company/play-icon.webp" alt="Play" class="relative z-10 w-[100%] h-[100%] object-contain" />
              </button>
            </div>

            <!-- Layer 5: Outer Cyan Border Frame (Figma node 1:804) -->
            <img
              src="/images/company/card-border-frame.webp"
              alt="Frame"
              class="video-layer-frame absolute right-0 bottom-0 w-[96.05%] h-[88.89%] object-contain pointer-events-none select-none z-20 transition-transform duration-500 ease-out group-hover/video:translate-x-1 group-hover/video:translate-y-1"
            />
          </div>

          <!-- Below Card Row: Note & "View Profile" CTA Button (Figma node 1:773) -->
          <div v-if="profileNote || ctaText" class="w-full flex flex-col sm:flex-row items-center justify-center gap-[20px] mt-[45px] py-[10px] pl-[20px] pr-[10px]">
            <span v-if="profileNote" class="text-[#141414] text-ds-18 font-normal text-center sm:text-left">
              {{ profileNote }}
            </span>

            <a
              v-if="ctaText && ctaLink"
              :href="ctaLink"
              target="_blank"
              rel="noopener noreferrer"
              class="border border-[#0709a2] hover:bg-[#0709a2] h-[50px] text-[#0709a2] hover:text-white rounded-[8px] px-5 py-1 text-ds-20 font-medium inline-flex items-center gap-3 transition-colors duration-200 shrink-0 shadow-2xs"
            >
              <span>{{ ctaText }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>

    <!-- Video Lightbox Modal Overlay -->
    <VideoModal v-model="isVideoOpen" :video-url="videoUrl" />
  </section>
</template>

<style scoped>
@keyframes playPulse {
  0% { transform: scale(1); opacity: 0.65; }
  75%, 100% { transform: scale(1.65); opacity: 0; }
}
.video-play-pulse {
  animation: playPulse 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Figma frame 1:779 (627×431) — absolute % positions scale with video poster */
.experience-badge {
  container-type: size;
}

.experience-badge__one {
  position: absolute;
  left: 24.58%;
  top: 25.51%;
  width: 13.19%;
  height: auto;
}

.experience-badge__ring {
  position: absolute;
  left: 39.31%;
  top: 34.66%;
  width: 24.28%;
  height: auto;
}

.experience-badge__ring-inner {
  position: absolute;
  left: 39.31%;
  top: 34.66%;
  width: 14.75%;
  height: auto;
}

.experience-badge__plus {
  position: absolute;
  left: 63.22%;
  top: 30.77%;
  width: 11.45%;
  height: auto;
}

.experience-badge__copy {
  position: absolute;
  left: 39.4%;
  top: 48.26%;
  width: 36.22%;
  color: #fff;
  font-weight: 400;
  font-size: 8.35cqh;
  line-height: 1.5;
  letter-spacing: -0.5px;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
