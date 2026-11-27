import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({ ignoreMobileResize: true })

  // Prevent accidental browser zoom (Ctrl+Wheel / Ctrl +/-/0) from shifting ScrollTrigger layout
  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) e.preventDefault()
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0', '_'].includes(e.key)) {
      e.preventDefault()
    }
  }
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKeyDown)

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  return {
    provide: {
      gsap,
      ScrollTrigger,
      lenis
    }
  }
})
