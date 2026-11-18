<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const navLinks = [
  { label: 'Giới thiệu', href: '/', active: true },
  { label: 'Portfolio', href: '#', active: false },
  { label: 'Nghề nghiệp', href: '#', active: false },
  { label: 'Life at Teanis', href: '#', active: false },
]

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <!-- Sticky Header Wrapper matching Figma node 1:2479 (nav-sticky) -->
  <header class="fixed top-0 left-0 right-0 z-50 pt-4 sm:pt-5 px-4 sm:px-6 pointer-events-none transition-all duration-300">
    <!-- Centered 1400px floating white navbar matching Figma node 1:2480 (Nav) -->
    <nav class="pointer-events-auto w-full max-w-[1400px] mx-auto bg-white rounded-[16px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.15)] h-[84px] sm:h-[100px] flex items-center justify-between px-6 sm:px-8 lg:px-10">

      <!-- Logo (Figma node 1:2481) -->
      <a href="/" class="shrink-0 flex items-center">
        <img
          src="/images/Teanis_horizontal.svg"
          alt="Teanis"
          class="h-10 sm:h-12 w-auto object-contain"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        />
        <span class="text-2xl font-black tracking-tight text-[#141414] hidden">
          TEA<span class="text-[#00d1bc]">NIS</span>
        </span>
      </a>

      <!-- Desktop Nav Links (Figma node 1:2530) -->
      <div class="hidden lg:flex items-center gap-8">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          :class="[
            'text-ds-18 font-normal transition-colors duration-200',
            link.active
              ? 'text-[#00d1bc] font-medium'
              : 'text-[#141414] hover:text-[#00d1bc]'
          ]"
        >
          {{ link.label }}
        </a>
      </div>

      <!-- CTA Button (desktop) matching Figma node 1:2535 (_buttonLP/primary) -->
      <div class="hidden sm:block">
        <NuxtLink
          to="/contact"
          class="bg-[#0709a2] hover:bg-[#060882] text-white rounded-[8px] pl-5 pr-1 py-1 h-[50px] inline-flex items-center gap-3 sm:gap-5 transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
        >
          <span class="text-ds-20 font-normal whitespace-nowrap">Get in touch</span>
          <div class="size-[42px] rounded-[4px] flex items-center justify-center shrink-0">
            <svg class="size-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>
        </NuxtLink>
      </div>

      <!-- Hamburger (mobile) -->
      <button
        class="lg:hidden p-2.5 rounded-lg text-gray-700 hover:text-[#0709a2] hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
        @click="toggleMenu"
      >
        <svg v-show="!isMenuOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-show="isMenuOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Mobile Dropdown Menu -->
    <div
      v-show="isMenuOpen"
      class="pointer-events-auto max-w-[1400px] mx-auto mt-2 bg-white rounded-[16px] shadow-xl p-6 lg:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <a
        v-for="link in navLinks"
        :key="link.label"
        :href="link.href"
        :class="[
          'text-ds-18 py-2 transition-colors',
          link.active ? 'text-[#00d1bc] font-bold' : 'text-[#141414] hover:text-[#00d1bc]'
        ]"
        @click="isMenuOpen = false"
      >
        {{ link.label }}
      </a>
      <div class="pt-2 border-t border-gray-100">
        <NuxtLink
          to="/contact"
          class="w-full bg-[#0709a2] hover:bg-[#060882] text-white rounded-[8px] py-3 px-5 flex items-center justify-between"
          @click="isMenuOpen = false"
        >
          <span class="text-ds-18 font-normal">Get in touch</span>
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
