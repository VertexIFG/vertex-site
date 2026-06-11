import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '../../lib/gsapSetup'

/**
 * Magnetic hover shell for primary CTAs: the child drifts toward the pointer
 * (max ±10px) and snaps back with a mechanical elastic release.
 */
function MagneticButton({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLSpanElement | null>(null)

  useGSAP(
    () => {
      const fine = window.matchMedia('(pointer: fine)').matches
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const shell = shellRef.current
      if (!fine || reduced || !shell) return
      const inner = shell.firstElementChild as HTMLElement | null
      if (!inner) return

      const toX = gsap.quickTo(inner, 'x', { duration: 0.3, ease: 'power3' })
      const toY = gsap.quickTo(inner, 'y', { duration: 0.3, ease: 'power3' })

      const onMove = (event: MouseEvent) => {
        const rect = shell.getBoundingClientRect()
        const relX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
        const relY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)
        toX(gsap.utils.clamp(-10, 10, relX * 10))
        toY(gsap.utils.clamp(-8, 8, relY * 8))
      }

      const onLeave = () => {
        gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      }

      shell.addEventListener('mousemove', onMove, { passive: true })
      shell.addEventListener('mouseleave', onLeave)
      return () => {
        shell.removeEventListener('mousemove', onMove)
        shell.removeEventListener('mouseleave', onLeave)
      }
    },
    { scope: shellRef },
  )

  return (
    <span ref={shellRef} className="magnetic-shell" style={{ display: 'inline-block' }}>
      {children}
    </span>
  )
}

export default MagneticButton
