import { Suspense, lazy, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ScrollTrigger, gsap, useGSAP } from '../lib/gsapSetup'
import type { SceneDriver } from './scene/RouteScene3D'
import RouteSceneStatic from './scene/RouteSceneStatic'
import './RouteChapter.css'

// three.js lives exclusively in this lazy chunk — it must never reach the
// initial bundle (guarded by tests/webgl.spec.ts).
const RouteScene3D = lazy(() => import('./scene/RouteScene3D'))

// Browser capability, probed once and read hydration-safely (the server
// snapshot is false, so prerendered HTML always carries the poster variant).
let webglCapable: boolean | null = null
const noopSubscribe = () => () => {}
function readSceneCapability() {
  if (webglCapable === null) {
    try {
      const wantsMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
      const wide = window.matchMedia('(min-width: 761px)').matches
      const probe = document.createElement('canvas')
      webglCapable =
        wantsMotion && wide && Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'))
    } catch {
      webglCapable = false
    }
  }
  return webglCapable
}

const headingBlock = (
  <>
    <h2 id="route-title">Engineered before we ever arrive.</h2>
    <p className="route-copy">
      Road crossings, existing utilities, and surface constraints are all mapped before any
      equipment shows up — so the drill follows a plan, not a guess.
    </p>
  </>
)

function RouteChapter() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const capable = useSyncExternalStore(noopSubscribe, readSceneCapability, () => false)
  const [forcedPoster, setForcedPoster] = useState(false)
  const mode: 'poster' | 'webgl' = capable && !forcedPoster ? 'webgl' : 'poster'
  const [near, setNear] = useState(false)
  const driver = useRef<SceneDriver>({ target: 0, invalidate: () => {} })

  useEffect(() => {
    if (mode !== 'webgl' || near) return undefined
    const section = sectionRef.current
    if (!section) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true)
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [mode, near])

  useGSAP(
    () => {
      if (mode !== 'webgl') return
      const section = sectionRef.current
      if (!section) return

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        // this pin is created after hydration (poster -> webgl upgrade), so
        // later-created is refresh-ordered AFTER the bore pin below unless
        // prioritized — downstream triggers need this pin's distance applied
        // before they measure
        refreshPriority: 1,
        onUpdate: (self) => {
          driver.current.target = self.progress
          driver.current.invalidate()
        },
      })

      gsap.fromTo(
        '.route-overlay',
        { autoAlpha: 1, y: 0 },
        {
          autoAlpha: 0,
          y: -40,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: '+=45%', scrub: true },
        },
      )

      // the dissolve: as the chapter unpins and scrolls away, the 3D world
      // fades down to the bare survey grid — which the section view below
      // shares, so the two animations melt into one another
      gsap.fromTo(
        '.route-scene-fade',
        { autoAlpha: 1 },
        {
          autoAlpha: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'bottom 98%', end: 'bottom 32%', scrub: true },
        },
      )
    },
    { scope: sectionRef, dependencies: [mode], revertOnUpdate: true },
  )

  // the poster->webgl swap after hydration changes this section's height
  // (pin spacer); downstream chapters must re-measure their triggers
  useEffect(() => {
    if (mode === 'webgl') ScrollTrigger.refresh()
  }, [mode])

  if (mode === 'webgl') {
    return (
      <section
        id="route"
        ref={sectionRef}
        className="route-chapter theme-dark"
        aria-labelledby="route-title"
        data-scene-mode="webgl"
      >
        <div className="route-sticky">
          <div className="route-scene-fade">
            {near && (
              <Suspense fallback={null}>
                <RouteScene3D driver={driver} onContextLost={() => setForcedPoster(true)} />
              </Suspense>
            )}
          </div>
          <div className="route-overlay container">{headingBlock}</div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="route"
      ref={sectionRef}
      className="route-chapter theme-dark"
      aria-labelledby="route-title"
      data-scene-mode="poster"
    >
      <div className="container route-inner">
        <div className="route-heading">{headingBlock}</div>
        <RouteSceneStatic />
      </div>
    </section>
  )
}

export default RouteChapter
