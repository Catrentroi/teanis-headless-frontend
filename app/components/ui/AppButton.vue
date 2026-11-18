<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline'
    href?: string
    tag?: 'button' | 'a'
  }>(),
  {
    variant: 'primary',
    tag: 'button',
  }
)
</script>

<template>
  <component
    :is="href ? 'a' : tag"
    :href="href"
    :class="[
      'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      variant === 'primary'
        ? 'bg-[#1E3A5F] text-white hover:bg-[#2a5080] focus-visible:ring-[#1E3A5F]'
        : 'border-2 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white focus-visible:ring-[#1E3A5F]',
    ]"
  >
    <slot />
  </component>
</template>
