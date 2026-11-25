<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Metric {
  value: string
  label: string
  sublabel?: string
}

const props = defineProps<{
  metrics?: Metric[]
  bgColor?: string
}>()

const sectionRef = ref<HTMLElement | null>(null)
const displayValues = ref<string[]>([])
let ctx: gsap.Context | null = null

function extractNumber(val: string): { num: number; suffix: string; prefix: string } {
  const match = val.match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/)
  if (match) {
    return { prefix: match[1] || '', num: parseFloat(match[2]), suffix: match[3] || '' }
  }
  return { prefix: '', num: 0, suffix: val }
}

onMounted(() => {
  if (!props.metrics || props.metrics.length === 0 || !sectionRef.value) return
  displayValues.value = props.metrics.map(() => '0')

  ctx = gsap.context(() => {
    // 1. Staggered card entrance (fade-in only, reverses on scroll up)
    gsap.from('.metric-card', {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 82%',
        toggleActions: 'play pause resume reverse'
      },
      opacity: 0,
      stagger: 0.15,
      duration: 0.85,
      ease: 'power3.out'
    })

    // 2. Rolling Odometer Counter with freeze & reset on leave
    const counterTweens: gsap.core.Tween[] = []
    function runCounters() {
      counterTweens.forEach(t => t.kill())
      counterTweens.length = 0
      props.metrics?.forEach((metric, i) => {
        const { prefix, num, suffix } = extractNumber(metric.value)
        if (!num) {
          displayValues.value[i] = metric.value
          return
        }
        const obj = { val: 0 }
        const tw = gsap.to(obj, {
          val: num,
          duration: 2,
          ease: 'power3.out',
          onUpdate() {
            const current = Number.isInteger(num) ? Math.round(obj.val) : obj.val.toFixed(1)
            displayValues.value[i] = `${prefix}${current}${suffix}`
          },
          onComplete() {
            displayValues.value[i] = metric.value
          }
        })
        counterTweens.push(tw)
      })
    }

    ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 82%',
      onEnter: runCounters,
      onLeave: () => counterTweens.forEach(t => t.pause()),
      onEnterBack: () => counterTweens.forEach(t => t.resume()),
      onLeaveBack: () => {
        counterTweens.forEach(t => t.kill())
        displayValues.value = props.metrics?.map(() => '0') || []
      }
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    v-if="metrics && metrics.length > 0"
    ref="sectionRef"
    class="py-16 lg:py-20 transition-colors duration-300"
    :style="{ backgroundColor: bgColor || '#F0F0F0' }"
  >
    <div class="max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 xl:grid-cols-none xl:flex xl:justify-between xl:gap-0">
        <div
          v-for="(metric, index) in metrics"
          :key="index"
          class="metric-card flex flex-col items-center justify-center py-6 px-4 xl:py-0 xl:px-0 xl:w-[200px] xl:min-h-[140px] text-center"
        >
          <span class="text-4xl sm:text-5xl lg:text-6xl xl:text-[90px] xl:leading-[135px] xl:tracking-normal font-bold text-[#141414] tracking-tight leading-none">
            {{ displayValues[index] || metric.value }}
          </span>

          <span class="mt-3 text-[#141414] font-bold text-ds-16 sm:text-ds-20">
            {{ metric.label }}
          </span>

          <span v-if="metric.sublabel" class="mt-1 text-xs text-gray-500">
            {{ metric.sublabel }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
