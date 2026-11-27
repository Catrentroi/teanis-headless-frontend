<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'

const props = defineProps<{ modelValue: boolean; videoUrl?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const close = () => emit('update:modelValue', false)
const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape' && props.modelValue) close() }

watch(() => props.modelValue, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
  open ? window.addEventListener('keydown', onKeydown) : window.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})

const isDirectVideo = computed(() => /\.(mp4|webm|ogg)$/i.test((props.videoUrl || '').trim()))
const embedUrl = computed(() => {
  const raw = (props.videoUrl || '').trim() || 'https://www.youtube.com/watch?v=w6K_U4Rixzo'
  const yt = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return yt?.[1] ? `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0` : raw
})
</script>

<template>
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
        v-if="modelValue"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 md:p-10"
        role="dialog"
        aria-modal="true"
        aria-label="Video giới thiệu Teanis"
        @click.self="close"
      >
        <div class="relative w-full max-w-[960px] flex flex-col items-end">
          <button
            type="button"
            class="mb-2 p-1.5 text-white/80 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-hidden"
            aria-label="Đóng video"
            @click="close"
          >
            <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="relative w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <video v-if="isDirectVideo" :src="embedUrl" controls autoplay class="w-full h-full object-cover" />
            <iframe v-else :src="embedUrl" title="Teanis Video" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
