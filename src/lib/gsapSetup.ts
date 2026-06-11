import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, MotionPathPlugin)
gsap.defaults({ ease: 'power3.out', duration: 0.9 })

export { gsap, ScrollTrigger, SplitText, useGSAP }

/** Media conditions shared by every gsap.matchMedia() block. */
export const MM = {
  full: '(prefers-reduced-motion: no-preference) and (min-width: 761px)',
  lite: '(prefers-reduced-motion: no-preference) and (max-width: 760px)',
} as const
