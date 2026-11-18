<script setup lang="ts">
interface Props {
  items?: string[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="items && items.length > 0" class="bg-white border-b border-gray-100 py-6 overflow-hidden select-none">
    <div class="marquee-track flex gap-4 whitespace-nowrap animate-marquee">
      <div v-for="loop in 4" :key="loop" class="flex gap-4 items-center shrink-0">
        <span
          v-for="item in items"
          :key="item"
          class="bg-[#baf8f3] text-[#48494d] px-4 py-2 rounded text-ds-16 font-medium shadow-2xs hover:bg-[#a6f4ee] transition-colors"
        >
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
