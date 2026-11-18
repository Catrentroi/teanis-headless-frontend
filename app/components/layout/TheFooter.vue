<script setup lang="ts">
interface FooterLink {
  label: string
  href: string
  isExternal?: boolean
}

const companyLinks: FooterLink[] = [
  { label: 'Giới thiệu', href: '/#about' },
  {
    label: 'Portfolio',
    href: 'https://docs.google.com/presentation/d/e/2PACX-1vSsYfVWZIePxGwn2ZQ8lqBJ0sw56XkKGWAYA4GRfVgyzezW30NpwPHGZJjV5md65996R6yi9Ov2o5Vu/pub?start=false&loop=false&delayms=5000',
    isExternal: true
  },
  {
    label: 'Tuyển dụng',
    href: 'https://www.linkedin.com/company/teanis-technologies/posts/?feedView=all',
    isExternal: true
  },
  {
    label: 'Life at Teanis',
    href: 'https://www.facebook.com/teanis.technologies',
    isExternal: true
  },
  { label: 'Bài viết', href: '/#blog' }
]

const serviceLinks: FooterLink[] = [
  { label: 'Solution Consultant', href: '/#services' },
  { label: 'IoT Solutions', href: '/#services' },
  { label: 'Enterprise Solutions', href: '/#services' },
  { label: 'AI Solutions', href: '/#services' }
]

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/teanis.technologies',
    icon: '/images/footer/facebook.svg',
    iconClass: 'w-[14px] h-auto'
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/teanis-technologies/posts/?feedView=all',
    icon: '/images/footer/linkedin.svg',
    iconClass: 'w-[22px] h-auto'
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@teanistechnologies',
    icon: '/images/footer/youtube.svg',
    iconClass: 'w-[26px] h-auto'
  }
]
</script>

<template>
  <footer
    id="site-footer"
    class="relative bg-[#0709a2] text-white pt-36 sm:pt-44 md:pt-48 lg:pt-[220px] pb-[20px] lg:pb-[28px] overflow-hidden"
  >
    <!-- Background overlay / watermark (horizontal_02) -->
    <div
      class="absolute h-[240px] sm:h-[300px] lg:h-[328px] left-0 mix-blend-overlay opacity-25 overflow-hidden top-[200px] sm:top-[250px] lg:top-[294px] w-full pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      <img
        src="/images/footer/horizontal_02.svg"
        alt="Footer watermark background pattern"
        class="w-full h-full object-cover object-left max-w-none"
      />
    </div>

    <!-- Main Footer Container -->
    <div
      class="max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0 flex flex-col gap-14 sm:gap-20 lg:gap-[91px] relative z-10"
    >
      <!-- Top Section -->
      <div
        class="flex flex-col lg:flex-row justify-between items-start gap-12 sm:gap-16 lg:gap-20 xl:gap-[300px]"
      >
        <!-- Left: Brand, Description & Socials -->
        <div class="flex flex-col items-start max-w-[480px]">
          <!-- Logo -->
          <NuxtLink to="/" class="inline-block" aria-label="Teanis Homepage">
            <img
              src="/images/footer/logo-white.svg"
              alt="Teanis"
              class="h-[36px] w-[140px] object-contain"
            />
          </NuxtLink>

          <!-- Short Description -->
          <p class="mt-3 text-white text-ds-16 font-normal">
            Dẫn đầu trong việc mang đến giải pháp công nghệ đổi mới, bền vững cho khách hàng trên toàn cầu.
          </p>

          <!-- Socials -->
          <div class="mt-8 lg:mt-[40px] flex items-center gap-5 sm:gap-[41px]">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.name"
              class="size-[60px] rounded-[10px] bg-white/20 hover:bg-[#00d1bc] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center shrink-0 shadow-sm"
            >
              <img
                :src="social.icon"
                :alt="social.name"
                :class="social.iconClass"
              />
            </a>
          </div>
        </div>

        <!-- Right: Navigation Columns -->
        <div
          class="flex flex-row flex-wrap sm:flex-nowrap items-start gap-12 sm:gap-20 lg:gap-[215px] w-full lg:w-auto"
        >
          <!-- Cột Công ty -->
          <div class="flex flex-col items-start min-w-[130px]">
            <h3 class="text-ds-24 text-[#00d1bc] font-normal mb-2">
              Công ty
            </h3>
            <div class="w-[30px] h-[2px] bg-white/50 rounded-full mb-5"></div>
            <ul class="flex flex-col gap-4">
              <li v-for="item in companyLinks" :key="item.label">
                <a
                  v-if="item.isExternal"
                  :href="item.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-ds-18 text-white hover:text-[#00d1bc] transition-colors duration-200"
                >
                  {{ item.label }}
                </a>
                <NuxtLink
                  v-else
                  :to="item.href"
                  class="text-ds-18 text-white hover:text-[#00d1bc] transition-colors duration-200"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Cột Dịch vụ -->
          <div class="flex flex-col items-start min-w-[180px]">
            <h3 class="text-ds-24 text-[#00d1bc] font-normal mb-2">
              Dịch vụ
            </h3>
            <div class="w-[30px] h-[2px] bg-white/50 rounded-full mb-5"></div>
            <ul class="flex flex-col gap-5">
              <li v-for="item in serviceLinks" :key="item.label">
                <a
                  v-if="item.isExternal"
                  :href="item.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-ds-18 text-white hover:text-[#00d1bc] transition-colors duration-200"
                >
                  {{ item.label }}
                </a>
                <NuxtLink
                  v-else
                  :to="item.href"
                  class="text-ds-18 text-white hover:text-[#00d1bc] transition-colors duration-200"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white text-ds-16 sm:text-ds-18 font-normal pt-8 sm:pt-10"
      >
        <p>
          © 2025. All rights reserved.
        </p>

        <div class="flex items-center gap-8 sm:gap-[55px]">
          <a
            href="#"
            class="hover:text-[#00d1bc] transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            class="hover:text-[#00d1bc] transition-colors duration-200"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
