import { useRef } from 'react'
import { MM, gsap, useGSAP } from '../lib/gsapSetup'
import './BoreChapter.css'

/**
 * SECTION A–A′ — the real HDD story in section view.
 * A rig on the surface, a road to bore under, located utilities marked with
 * surface paint, then the two true passes: the pilot bore steers out to
 * daylight, and the reamer pulls the product line back home.
 */

const GRADE_Y = 318
const BLADE_BOTTOM = 758

const BORE_D =
  'M 150 320 C 250 438 340 568 600 600 C 800 624 920 568 1040 488 C 1130 428 1220 348 1290 320'

// [x, y, radius, color, label] — existing utilities in section
const UTILITIES = [
  [430, 478, 17, 'var(--apwa-comm)', 'Telecom'],
  [690, 540, 19, 'var(--apwa-gas)', 'Gas'],
  [1010, 402, 17, 'var(--apwa-water)', 'Water'],
] as const

// deterministic soil speckle field (no Math.random — visual tests)
const SPECKLES = Array.from({ length: 34 }, (_, i) => ({
  x: 180 + ((i * 157) % 1080),
  y: GRADE_Y + 28 + ((i * 97) % 360),
}))

// pilot pass spans progress 0.16→0.50; ream+pullback 0.50→0.84
const PILOT = { at: 0.16, dur: 0.34 }
const REAM = { at: 0.5, dur: 0.34 }
// utility positions as fractions along the bore (by x)
const UTILITY_TS = [0.246, 0.474, 0.754]

function BoreChapter() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return
      const borePath = section.querySelector<SVGPathElement>('.bore-line:not(.bore-line-glow)')
      if (!borePath) return
      const boreLength = borePath.getTotalLength()

      const setFinalState = () => {
        gsap.set(['.bore-line', '.bore-core'], { strokeDasharray: boreLength, strokeDashoffset: 0 })
        gsap.set('.bore-grade-line', { strokeDasharray: 1200, strokeDashoffset: 0 })
        gsap.set('.bore-blade', { scaleY: 1, opacity: 1 })
        gsap.set('.bore-svg', { yPercent: 0 })
        gsap.set(
          [
            '.bore-earth', '.bore-road', '.bore-rig', '.bore-utility', '.bore-mark',
            '.bore-cleared', '.bore-stamp', '.bore-ticks', '.bore-current', '.bore-cut-tag',
            '.bore-phase-3',
          ],
          { opacity: 1 },
        )
        gsap.set(['.bore-head', '.bore-reamer', '.bore-pilot', '.bore-phase-1', '.bore-phase-2'], {
          opacity: 0,
        })
      }

      const mm = gsap.matchMedia()

      mm.add(MM.full, () => {
        section.dataset.static = 'false'

        // approach: grade draws, then the cut blades plunge to A / A′
        const approach = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 98%', end: 'top 4%', scrub: 0.6 },
        })
        approach
          .fromTo(
            '.bore-grade-line',
            { strokeDasharray: 1200, strokeDashoffset: 1200 },
            { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' },
            0,
          )
          .fromTo(
            '.bore-blade',
            { scaleY: 0, transformOrigin: 'top center', opacity: 1 },
            { scaleY: 1, duration: 0.4, ease: 'power2.inOut', stagger: 0.14 },
            0.3,
          )
          .fromTo(
            '.bore-cut-tag',
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.18, stagger: 0.14 },
            0.62,
          )

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=260%',
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
          },
        })

        // the drawing rises to center stage as the heading steps aside
        tl.fromTo('.bore-svg', { yPercent: 0 }, { yPercent: -13, duration: 0.26, ease: 'power1.inOut' }, 0.02)
          .fromTo('.bore-ticks', { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0)
          // the earth itself, the road above the route, the rig on the surface
          .fromTo('.bore-earth', { opacity: 0 }, { opacity: 1, duration: 0.07 }, 0.02)
          .fromTo('.bore-road', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.05)
          .fromTo('.bore-rig', { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.06, ease: 'power2.out' }, 0.07)
          // locates: utilities pop + APWA paint marks land on the surface
          .fromTo(
            '.bore-utility',
            { opacity: 0, scale: 0.5, transformOrigin: 'center center' },
            { opacity: 1, scale: 1, duration: 0.05, stagger: 0.02, ease: 'power2.out' },
            0.09,
          )
          .fromTo(
            '.bore-mark',
            { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' },
            { opacity: 1, scaleY: 1, duration: 0.04, stagger: 0.02, ease: 'power2.out' },
            0.1,
          )
          .fromTo('.bore-phase-1', { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0.15)
          // PASS 1 — pilot bore steers out beneath everything
          .fromTo(
            '.bore-pilot',
            { strokeDasharray: boreLength, strokeDashoffset: boreLength, opacity: 1 },
            { strokeDashoffset: 0, duration: PILOT.dur },
            PILOT.at,
          )
          .fromTo('.bore-head', { opacity: 0 }, { opacity: 1, duration: 0.015 }, PILOT.at)
          .to(
            '.bore-head',
            {
              duration: PILOT.dur,
              motionPath: { path: '.bore-pilot', align: '.bore-pilot', alignOrigin: [0.5, 0.5], autoRotate: true },
            },
            PILOT.at,
          )
          .to('.bore-head', { opacity: 0, duration: 0.015 }, PILOT.at + PILOT.dur)
          .to('.bore-phase-1', { opacity: 0, duration: 0.02 }, REAM.at - 0.01)
          .fromTo('.bore-phase-2', { opacity: 0 }, { opacity: 1, duration: 0.03 }, REAM.at)
          // PASS 2 — the reamer pulls the product line back from daylight
          .fromTo('.bore-reamer', { opacity: 0 }, { opacity: 1, duration: 0.015 }, REAM.at)
          .to(
            '.bore-reamer',
            {
              duration: REAM.dur,
              motionPath: {
                path: '.bore-pilot',
                align: '.bore-pilot',
                alignOrigin: [0.5, 0.5],
                start: 1,
                end: 0,
              },
            },
            REAM.at,
          )
          .to('.bore-reamer-teeth', { rotation: -720, transformOrigin: 'center center', duration: REAM.dur }, REAM.at)
          .fromTo(
            '.bore-line',
            { strokeDasharray: boreLength, strokeDashoffset: -boreLength },
            { strokeDashoffset: 0, duration: REAM.dur },
            REAM.at,
          )
          .fromTo(
            '.bore-core',
            { strokeDasharray: boreLength, strokeDashoffset: -boreLength },
            { strokeDashoffset: 0, duration: REAM.dur },
            REAM.at + 0.012,
          )
          .to('.bore-reamer', { opacity: 0, duration: 0.015 }, REAM.at + REAM.dur)
          .to('.bore-pilot', { opacity: 0, duration: 0.03 }, 0.86)
          .to('.bore-phase-2', { opacity: 0, duration: 0.02 }, 0.88)
          // the installed path comes alive
          .fromTo('.bore-current', { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.9)
          .fromTo('.bore-stamp', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0.92)
          .fromTo('.bore-phase-3', { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0.93)

        // clearance pings while the pilot passes beneath each utility
        UTILITY_TS.forEach((t, index) => {
          const at = PILOT.at + PILOT.dur * t
          tl.fromTo(
            `.bore-ring-${index}`,
            { opacity: 0.9, scale: 1, transformOrigin: 'center center' },
            { opacity: 0, scale: 2.1, duration: 0.06, ease: 'power1.out' },
            at,
          ).fromTo(
            `.bore-cleared-${index}`,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.035, ease: 'power2.out' },
            at + 0.015,
          )
        })

        gsap.fromTo(
          '.bore-overlay',
          { autoAlpha: 1, y: 0 },
          {
            autoAlpha: 0,
            y: -40,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: '+=40%', scrub: true },
          },
        )

        return () => {
          section.dataset.static = 'true'
          setFinalState()
        }
      })

      mm.add('(prefers-reduced-motion: reduce), (max-width: 760px)', () => {
        section.dataset.static = 'true'
        setFinalState()
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="bore"
      ref={sectionRef}
      className="bore-section theme-dark"
      aria-labelledby="bore-title"
      data-static="true"
    >
      <div className="bore-sticky">
        <svg className="bore-svg" viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <filter id="bore-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="bore-earth-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#171b22" stopOpacity="0.9" />
              <stop offset="0.55" stopColor="#13161c" stopOpacity="0.45" />
              <stop offset="1" stopColor="#0a0b0d" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* the earth: a real mass below grade, fading into the field */}
          <g className="bore-earth">
            <rect x="0" y={GRADE_Y} width="1440" height={820 - GRADE_Y} fill="url(#bore-earth-fill)" />
            {SPECKLES.map((s, i) => (
              <circle key={i} className="bore-speckle" cx={s.x} cy={s.y} r="1.4" />
            ))}
          </g>

          {/* section-cut blades plunging to A / A′ */}
          {[
            [150, 'A'],
            [1290, 'A′'],
          ].map(([x, tag]) => (
            <g key={tag}>
              <line className="bore-blade" x1={x as number} y1={GRADE_Y + 14} x2={x as number} y2={BLADE_BOTTOM} />
              <g className="bore-cut-tag">
                <rect x={(x as number) - 16} y={BLADE_BOTTOM + 12} width="32" height="26" />
                <text className="bore-mono" x={x as number} y={BLADE_BOTTOM + 31} textAnchor="middle">
                  {tag}
                </text>
              </g>
            </g>
          ))}

          {/* the road we bore beneath */}
          <g className="bore-road">
            <rect x="560" y={GRADE_Y - 13} width="320" height="13" />
            <line className="bore-road-dash" x1="574" y1={GRADE_Y - 6.5} x2="866" y2={GRADE_Y - 6.5} />
            <text className="bore-mono bore-dim" x="720" y={GRADE_Y - 26} textAnchor="middle">
              ROADWAY — STAYS OPEN
            </text>
          </g>

          {/* the rig: the machine on the surface that does all of this */}
          <g className="bore-rig">
            <rect className="bore-rig-track" x="84" y={GRADE_Y - 9} width="72" height="9" />
            <rect className="bore-rig-body" x="90" y={GRADE_Y - 31} width="54" height="22" />
            <rect className="bore-rig-cab" x="90" y={GRADE_Y - 41} width="19" height="10" />
            <line className="bore-rig-mast" x1="110" y1={GRADE_Y - 36} x2="152" y2={GRADE_Y + 3} />
            <line className="bore-rig-mast-accent" x1="114" y1={GRADE_Y - 32} x2="150" y2={GRADE_Y + 2} />
          </g>

          {/* grade line + entry/exit + phase chip */}
          <line className="bore-grade-line" x1="120" y1={GRADE_Y} x2="1320" y2={GRADE_Y} />
          <g className="bore-ticks">
            {[150, 1290].map((x) => (
              <g key={x}>
                <line className="bore-tick" x1={x} y1={GRADE_Y - 9} x2={x} y2={GRADE_Y + 9} />
                <rect className="bore-tick-cap" x={x - 4} y={GRADE_Y - 8} width="8" height="8" />
              </g>
            ))}
            <text className="bore-mono bore-dim" x="150" y={GRADE_Y - 50} textAnchor="middle">
              ENTRY
            </text>
            <text className="bore-mono bore-dim" x="1290" y={GRADE_Y - 22} textAnchor="middle">
              EXIT
            </text>
            <text className="bore-mono bore-dim" x="1320" y={GRADE_Y + 34} textAnchor="end">
              SECTION A–A′
            </text>
          </g>
          <g className="bore-phase">
            <text className="bore-mono bore-phase-1" x="1320" y={GRADE_Y + 60} textAnchor="end">
              PASS 1 — PILOT BORE
            </text>
            <text className="bore-mono bore-phase-2" x="1320" y={GRADE_Y + 60} textAnchor="end">
              PASS 2 — REAM + PULLBACK
            </text>
            <text className="bore-mono bore-phase-3" x="1320" y={GRADE_Y + 60} textAnchor="end">
              AS-BUILT ✓
            </text>
          </g>

          {/* located utilities + their surface paint marks */}
          {UTILITIES.map(([x, y, r, color, label], index) => (
            <g key={label}>
              <g className="bore-mark">
                <line x1={x - 10} y1={GRADE_Y - 4} x2={x - 2} y2={GRADE_Y - 16} style={{ stroke: color }} />
                <line x1={x + 2} y1={GRADE_Y - 4} x2={x + 10} y2={GRADE_Y - 16} style={{ stroke: color }} />
              </g>
              <g className="bore-utility">
                <circle className={`bore-ring bore-ring-${index}`} cx={x} cy={y} r={r + 14} style={{ stroke: color }} />
                <circle className="bore-utility-halo" cx={x} cy={y} r={r + 14} style={{ stroke: color }} />
                <circle className="bore-utility-pipe" cx={x} cy={y} r={r} style={{ stroke: color }} filter="url(#bore-glow)" />
                <text className="bore-mono bore-utility-label" x={x} y={y - r - 24} textAnchor="middle" style={{ fill: color }}>
                  {label}
                </text>
              </g>
              <text className={`bore-mono bore-cleared bore-cleared-${index}`} x={x} y={y + r + 38} textAnchor="middle">
                CLEARED ✓
              </text>
            </g>
          ))}

          {/* pass 1: pilot string · pass 2: product path + core + current */}
          <path className="bore-pilot" d={BORE_D} />
          <path className="bore-line bore-line-glow" d={BORE_D} />
          <path className="bore-line" d={BORE_D} />
          <path className="bore-core" d={BORE_D} />
          <path className="bore-current" d={BORE_D} />
          <g className="bore-head">
            <path d="M 13 0 L -8 -8 L -4 0 L -8 8 Z" />
          </g>
          <g className="bore-reamer">
            <g className="bore-reamer-teeth">
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <line
                  key={deg}
                  x1={Math.cos((deg * Math.PI) / 180) * 9}
                  y1={Math.sin((deg * Math.PI) / 180) * 9}
                  x2={Math.cos((deg * Math.PI) / 180) * 15}
                  y2={Math.sin((deg * Math.PI) / 180) * 15}
                />
              ))}
              <circle className="bore-reamer-body" cx="0" cy="0" r="9" />
            </g>
            <circle className="bore-reamer-eye" cx="0" cy="0" r="2.4" />
          </g>

          <g className="bore-stamp">
            <rect x="600" y="700" width="240" height="54" />
            <text className="bore-mono" x="720" y="733" textAnchor="middle">
              LINE INSTALLED
            </text>
          </g>
        </svg>

        <div className="bore-overlay container">
          <h2 id="bore-title">Below grade, by design.</h2>
          <p className="bore-copy">
            Here&apos;s how your project happens: we find everything already buried, steer beneath
            it, and pull your new line into place — while the street above stays open for
            business.
          </p>
        </div>
      </div>
    </section>
  )
}

export default BoreChapter
