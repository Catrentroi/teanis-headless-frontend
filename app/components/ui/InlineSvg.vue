<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  src?: string
  alt?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'loaded', svgElement: SVGSVGElement): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const rawSvg = ref<string>('')

async function fetchSvg(url: string) {
  if (!url) {
    rawSvg.value = ''
    return
  }

  try {
    // Thêm timestamp để trình duyệt không dùng cache cũ của file SVG
    const cacheBuster = url.includes('?') ? `&t=${Date.now()}` : `?t=${Date.now()}`
    const res = await fetch(`${url}${cacheBuster}`, { cache: 'no-cache' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    rawSvg.value = text

    await nextTick()
    const svgEl = containerRef.value?.querySelector('svg')
    if (svgEl) {
      svgEl.setAttribute('class', 'w-full h-auto max-h-full block')
      emit('loaded', svgEl)
    }
  } catch (err) {
    console.warn('[InlineSvg] Error loading SVG:', err)
  }
}

watch(
  () => props.src,
  (newSrc) => {
    if (import.meta.client && newSrc) {
      fetchSvg(newSrc)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div ref="containerRef" class="inline-svg-wrapper flex items-center justify-center w-full">
    <img
      v-if="!rawSvg && src"
      :src="src"
      :alt="alt || 'Illustration'"
      class="w-full h-auto object-contain"
    />
    <div
      v-else-if="rawSvg"
      class="w-full h-auto flex items-center justify-center"
      v-html="rawSvg"
    />
  </div>
</template>

<style scoped>
.inline-svg-wrapper :deep(svg) {
  width: 100%;
  height: auto;
  max-height: 100%;
  display: block;
  transform: translateZ(0);
}
</style>
