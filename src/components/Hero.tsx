import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { MM, gsap, useGSAP } from '../lib/gsapSetup'
import { useReducedMotion } from '../lib/motionPrefs'
import MagneticButton from './ui/MagneticButton'
import './Hero.css'

// One continuous bore, perfectly symmetric about the viewport center so the
// CTA nests dead-center in the bowl. Shared by the drawn line, the
// dash-march overlay, and the traveling drill head.
const BORE_PATH =
  'M -60 470 H 200 C 390 470 470 604 720 604 C 970 604 1050 470 1240 470 H 1500'

function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MM.full, () => {
        const tl = gsap.timeline()
        tl.fromTo(
          '.hero-bore-draw',
          { strokeDasharray: 1700, strokeDashoffset: 1700 },
          { strokeDashoffset: 0, duration: 1.9, ease: 'power2.inOut' },
          0,
        )
          .fromTo(
            '.hero-grade',
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 1.3, ease: 'power3.inOut' },
            0,
          )
          .fromTo(
            '.hero-line > span',
            { yPercent: 112 },
            { yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.12 },
            0.4,
          )
          .fromTo(
            '.hero-cta',
            { y: 18, scale: 0.94, autoAlpha: 0 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: 'power3.out' },
            1.15,
          )
          .fromTo('.hero-march', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.7)
          .fromTo('.hero-head', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1.8)
      })

      mm.add(MM.lite, () => {
        gsap.fromTo(
          '.hero-line > span',
          { yPercent: 112 },
          { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.1 },
        )
      })
    },
    { scope: sectionRef },
  )

  return (
    <section id="top" ref={sectionRef} className="hero theme-dark" aria-labelledby="hero-title">
      <svg
        className="hero-field"
        viewBox="0 0 1440 810"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* grade line — the surface everything works beneath */}
        <line className="hero-grade" x1="0" y1="470" x2="1440" y2="470" />

        {/* surface ticks where the bore enters and exits — mirrored about center */}
        {[200, 1240].map((x) => (
          <g key={x} className="hero-tick">
            <line x1={x} y1="462" x2={x} y2="478" />
            <rect x={x - 3.5} y="463" width="7" height="7" />
          </g>
        ))}

        {/* the bore: drawn once, then a slow dash march keeps it alive */}
        <path className="hero-bore-draw" d={BORE_PATH} />
        <path className="hero-march" d={BORE_PATH} />

        {/* drill head endlessly walking the line */}
        {!reduced && (
          <g className="hero-head">
            <path d="M 11 0 L -7 -7 L -3 0 L -7 7 Z" fill="var(--red)" />
            <animateMotion dur="14s" repeatCount="indefinite" rotate="auto" path={BORE_PATH} />
          </g>
        )}
      </svg>

      <div className="hero-top container">
        <h1 id="hero-title" aria-label="Drilling the future, one line at a time.">
          <span className="hero-line" aria-hidden="true">
            <span>Drilling the future,</span>
          </span>
          <span className="hero-line" aria-hidden="true">
            <span>
              <em className="hero-accent">one line</em> at a time.
            </span>
          </span>
        </h1>
      </div>

      {/* primary CTA nests in the divot of the bore curve */}
      <div className="hero-cta">
        <span className="hero-cta-echo" aria-hidden="true" />
        <span className="hero-cta-echo hero-cta-echo-2" aria-hidden="true" />
        <MagneticButton>
          <a className="cta-major" href="#contact">
            <span className="cta-major-label">
              <span className="cta-major-text">Start a Project</span>
              <span className="cta-major-text" aria-hidden="true">
                Start a Project
              </span>
            </span>
            <span className="cta-major-chip" aria-hidden="true">
              <ArrowUpRight />
              <ArrowUpRight />
            </span>
          </a>
        </MagneticButton>
      </div>
    </section>
  )
}

export default Hero
