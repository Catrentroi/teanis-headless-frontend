import gsap from 'gsap'

/**
 * Shared scrollytelling helpers for GSAP sections.
 */
export function useStoryMotion() {
  // Keep scrollytelling active across Windows/browser power-saving profiles
  const prefersReducedMotion = (): boolean => false

  const getHeaderOffset = (extra = 16): number => {
    if (!import.meta.client) return 88
    const header = document.querySelector('header')
    return (header?.offsetHeight ?? 72) + extra
  }

  const revealMaskedLines = (
    targets: gsap.TweenTarget,
    options?: {
      trigger?: Element | string | null
      start?: string
      stagger?: number
      duration?: number
      y?: number
    }
  ) => {
    const resolved = gsap.utils.toArray(targets)
    if (resolved.length === 0) return null

    if (prefersReducedMotion()) {
      return gsap.set(resolved, { opacity: 1, y: 0 })
    }

    const scrollTrigger = options?.trigger
      ? {
          trigger: options.trigger,
          start: options.start ?? 'top 85%',
          once: true
        }
      : undefined

    return gsap.fromTo(
      resolved,
      {
        opacity: 0,
        y: options?.y ?? 32
      },
      {
        opacity: 1,
        y: 0,
        duration: options?.duration ?? 1.3,
        stagger: options?.stagger ?? 0.18,
        ease: 'power2.inOut',
        clearProps: 'transform',
        scrollTrigger
      }
    )
  }

  return {
    prefersReducedMotion,
    getHeaderOffset,
    revealMaskedLines
  }
}
