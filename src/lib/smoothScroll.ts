import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsapSetup'

let current: Lenis | null = null

export function getLenis() {
  return current
}

/**
 * Create the Lenis singleton wired into GSAP's ticker.
 * Returns a destroy function; the caller's effect cleanup MUST run it
 * (StrictMode mounts effects twice — a leaked ticker callback would
 * double scroll speed).
 */
export function initSmoothScroll() {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.1, syncTouch: false })
  const tick = (time: number) => lenis.raf(time * 1000)

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  current = lenis

  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    if (current === lenis) current = null
  }
}
