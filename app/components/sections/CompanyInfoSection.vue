<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

function playAudio() {
  const src = props.audioUrl || '/audio/sound.mp3'
  if (src) {
    const audio = new Audio(src)
    audio.play().catch(err => {
      console.warn('Không thể phát âm thanh:', err)
    })
  }
}

// Video Lightbox Modal State & Logic
const isVideoOpen = ref(false)

function openVideo() {
  isVideoOpen.value = true
}

function closeVideo() {
  isVideoOpen.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isVideoOpen.value) {
    closeVideo()
  }
}

watch(isVideoOpen, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  }
})

const sectionRef = ref<HTMLElement | null>(null)
const videoCardRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

function onCardMouseMove(e: MouseEvent) {
  if (!videoCardRef.value || window.innerWidth < 1024) return
  const rect = videoCardRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  gsap.to(videoCardRef.value, {
    rotateY: x * 8,
    rotateX: -y * 8,
    transformPerspective: 1000,
    duration: 0.4,
    ease: 'power1.out'
  })
}

function onCardMouseLeave() {
  if (!videoCardRef.value) return
  gsap.to(videoCardRef.value, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power2.out' })
}

onMounted(() => {
  if (!sectionRef.value) return
  ctx = gsap.context(() => {
    gsap.from('.info-reveal', {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        toggleActions: 'play pause resume reverse'
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
  }
  ctx?.revert()
})

const isDirectVideo = computed(() => {
  const url = (props.videoUrl || '').toLowerCase().trim()
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')
})

const embedUrl = computed(() => {
  const rawUrl = (props.videoUrl || '').trim() || 'https://www.youtube.com/watch?v=w6K_U4Rixzo'

  // Match YouTube URLs (watch, share youtu.be, embed)
  const ytMatch = rawUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
  }

  return rawUrl
})

const defaultPillars = [
  { title: 'KIẾN TẠO', icon: '/images/company/kien-tao.svg' },
  { title: 'HIỆU QUẢ', icon: '/images/company/hieu-qua.webp' },
  { title: 'ĐỒNG HÀNH', icon: '/images/company/dong-hanh.svg' }
]
const displayPillars = computed(() => (props.pillars && props.pillars.length > 0 ? props.pillars : defaultPillars))

const defaultCommitments = [
  'Tạo ra các sản phẩm công nghệ sáng tạo mang lại giá trị cho cộng đồng.',
  'Cung cấp giải pháp công nghệ hiệu quả cho đối tác và khách hàng.',
  'Đồng hành để cùng nhau mở ra cơ hội bứt phá kinh doanh trong kỷ nguyên số.'
]
const displayCommitments = computed(() => (props.commitments && props.commitments.length > 0 ? props.commitments : defaultCommitments))
</script>

<template>
  <section
    id="company-info"
    ref="sectionRef"
    class="py-20 lg:pt-32 lg:pb-[100px] relative overflow-hidden transition-colors duration-300"
    :style="{
      backgroundColor: bgColor || '#FFFFFF',
      backgroundImage: bgImage ? `url(${bgImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }"
  >
    <!-- Max-width 1400px Container matching Figma node 1:664 / 1:666 -->
    <div class="max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0 w-full">

      <!-- Section Title Badge (Figma node 1:665) -->
      <div class="info-reveal flex items-center mb-[36px] gap-[10px]">
        <div class="shrink-0">
          <img src="/images/company/dot.svg" alt="dot" class="w-full h-full">
        </div>
        <span class="text-ds-24 font-bold text-[#141414]">
          {{ subtitle || 'Về chúng tôi' }}
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
            <p class="info-reveal text-[#141414] text-ds-18 font-normal leading-[1.5] mb-[24px]">
              {{ description || 'Chúng tôi là một công ty hoạt động trong lĩnh vực công nghệ, chuyên phát triển các sản phẩm phần mềm, ứng dụng di động, giải pháp chuyển đổi số doanh nghiệp, IoT và dịch vụ outsourcing chất lượng cao.' }}
            </p>

            <!-- 3 Pillars Row with custom intro title (Figma node 1:678 — mb: 24px) -->
            <div class="info-reveal mb-[24px]">
              <p class="text-[#141414] text-ds-18 font-normal leading-[1.5] mb-[10px]">
                {{ pillarsTitle || 'Tạo ra các sản phẩm công nghệ sáng tạo mang lại giá trị cho cộng đồng, khách hàng với phương châm chính:' }}
              </p>

              <div class="flex flex-wrap items-center gap-6 lg:gap-[10px]">
                <div
                  v-for="(pillar, idx) in displayPillars"
                  :key="pillar.title || idx"
                  class="flex items-center gap-[16px] py-[8px] lg:flex-1"
                >
                  <img
                    :src="pillar.icon || (idx === 0 ? '/images/company/kien-tao.svg' : idx === 1 ? '/images/company/hieu-qua.webp' : '/images/company/dong-hanh.svg')"
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
            <div class="info-reveal">
              <p class="text-[#141414] text-ds-18 font-normal leading-[1.5] mb-[10px]">
                {{ commitmentsTitle || 'Chúng tôi luôn nỗ lực nhằm:' }}
              </p>

              <ul class="pl-1">
                <li
                  v-for="item in displayCommitments"
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

          <!-- Layered Video Card Container with 3D Tilt (Figma 1:776 — 734x504) -->
          <div
            ref="videoCardRef"
            class="video-card-container info-reveal relative w-full lg:w-[734px] max-w-none aspect-[735/504] flex items-center justify-center transition-transform duration-200"
            @mousemove="onCardMouseMove"
            @mouseleave="onCardMouseLeave"
          >

            <!-- Layer 1: Background Mint Tilted Shape (Figma node 1:777 / 1:778) -->
            <img
              src="/images/company/card-bg-shape.webp"
              alt="Decorative Shape"
              class="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0"
            />

            <!-- Layer 2: Main Video Poster Box (Pre-cropped WebP/PNG with transparent corners) -->
            <div class="absolute left-[7.62%] top-[0.4%] w-[85.17%] h-[84.52%] z-10 flex items-center justify-center">
              <picture class="w-full h-full block">
                <source :srcset="videoPoster || '/images/company/video-poster.webp'" type="image/webp" />
                <img
                  :src="videoPoster || '/images/company/video-poster.webp'"
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
                class="absolute bottom-[4.5%] left-[3.2%] z-30 w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer focus:outline-hidden"
                aria-label="Phát video giới thiệu"
                @click="openVideo"
              >
                <img src="/images/company/play-icon.webp" alt="Play" class="w-[100%] h-[100%] object-contain" />
              </button>
            </div>

            <!-- Layer 5: Outer Cyan Border Frame (Figma node 1:804) -->
            <img
              src="/images/company/card-border-frame.webp"
              alt="Frame"
              class="absolute right-0 bottom-0 w-[96.05%] h-[88.89%] object-contain pointer-events-none select-none z-20"
            />
          </div>

          <!-- Below Card Row: Note & "View Profile" CTA Button (Figma node 1:773) -->
          <div class="w-full flex flex-col sm:flex-row items-center justify-center gap-[20px] mt-[45px] py-[10px] pl-[20px] pr-[10px]">
            <span class="text-[#141414] text-ds-18 font-normal text-center sm:text-left">
              {{ profileNote || 'Tải profile để khám phá Teanis' }}
            </span>

            <a
              :href="(ctaLink && ctaLink !== '#') ? ctaLink : 'https://docs.google.com/presentation/d/e/2PACX-1vSsYfVWZIePxGwn2ZQ8lqBJ0sw56XkKGWAYA4GRfVgyzezW30NpwPHGZJjV5md65996R6yi9Ov2o5Vu/pub?start=false&loop=false&delayms=5000'"
              target="_blank"
              rel="noopener noreferrer"
              class="border border-[#0709a2] hover:bg-[#0709a2] h-[50px] text-[#0709a2] hover:text-white rounded-[8px] px-5 py-1 text-ds-20 font-medium inline-flex items-center gap-3 transition-colors duration-200 shrink-0 shadow-2xs"
            >
              <span>{{ ctaText || 'View Profile' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>

    <!-- Video Lightbox Modal Overlay (Teleport to body) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isVideoOpen"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="Video giới thiệu Teanis"
          @click.self="closeVideo"
        >
          <!-- Video Modal Wrapper -->
          <div class="relative w-full max-w-[960px] flex flex-col items-end">
            <!-- Close Button (X) at Top-Right Corner -->
            <button
              type="button"
              class="mb-2 p-1.5 text-white/80 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-hidden"
              aria-label="Đóng video"
              @click="closeVideo"
            >
              <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Video Player Frame with 16:9 Aspect Ratio -->
            <div class="relative w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <!-- Direct MP4 Video Player -->
              <video
                v-if="isDirectVideo"
                :src="embedUrl"
                controls
                autoplay
                class="w-full h-full object-cover"
              />
              <!-- YouTube / Video Embed Iframe -->
              <iframe
                v-else
                :src="embedUrl"
                title="Teanis Video"
                class="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
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
