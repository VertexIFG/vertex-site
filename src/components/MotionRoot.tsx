import { useEffect } from 'react'
import { useAnchorScroll } from '../hooks/useAnchorScroll'
import { MM, ScrollTrigger, SplitText, gsap, useGSAP } from '../lib/gsapSetup'
import { initSmoothScroll } from '../lib/smoothScroll'

/**
 * Page-wide scroll choreography. Owns: Lenis lifecycle, anchor routing,
 * chapter-heading line reveals, generic [data-reveal] batches, count-ups,
 * the records chain scrub, hero parallax, marquee velocity skew, footer
 * stamp rise, and the scroll-progress hairline.
 *
 * Component-specific entrances (hero load timeline) live in their components.
 */
function MotionRoot() {
  useAnchorScroll()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    return initSmoothScroll()
  }, [])

  useGSAP((_, contextSafe) => {
    const setup = contextSafe!(() => {
      const mm = gsap.matchMedia()

      mm.add({ full: MM.full, lite: MM.lite }, (ctx) => {
        const { full } = ctx.conditions as { full: boolean; lite: boolean }

        // Chapter headings: masked line reveals; masks are reverted after
        // completion so later resizes re-wrap text naturally.
        gsap.utils.toArray<HTMLElement>('main h2').forEach((heading) => {
          const split = SplitText.create(heading, { type: 'lines', mask: 'lines' })
          gsap.set(split.lines, { yPercent: 110 })
          gsap.to(split.lines, {
            yPercent: 0,
            duration: 1.05,
            ease: 'power4.out',
            stagger: 0.09,
            scrollTrigger: { trigger: heading, start: 'top 82%', once: true },
            onComplete: () => split.revert(),
          })
        })

        // Generic item reveals
        const revealItems = gsap.utils.toArray<HTMLElement>('[data-reveal]')
        gsap.set(revealItems, { y: 26, autoAlpha: 0 })
        ScrollTrigger.batch(revealItems, {
          start: 'top 88%',
          once: true,
          onEnter: (elements) =>
            gsap.to(elements, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, overwrite: true }),
        })

        // Records chain-of-custody line draws downward with scroll
        gsap.fromTo(
          '.records-chain-line',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: '.records-chain',
              start: 'top 80%',
              end: 'bottom 65%',
              scrub: 0.4,
            },
          },
        )

        // Scroll-progress hairline
        gsap.to('.scroll-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: true },
        })

        if (full) {
          // Hero parallax on scroll-away: the line field sinks slower than the type
          gsap.to('.hero-field', {
            yPercent: 14,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          })
          gsap.to('.hero-top', {
            yPercent: -18,
            autoAlpha: 0.3,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          })

          // Footer stamp rises as the sheet ends
          gsap.from('.footer-stamp span', {
            yPercent: 36,
            ease: 'none',
            scrollTrigger: {
              trigger: '.site-footer',
              start: 'top bottom',
              end: 'top 30%',
              scrub: true,
            },
          })
        }
      })

      ScrollTrigger.refresh()
    })

    // Wait for fonts so SplitText masks and pin distances are final.
    document.fonts.ready.then(setup)
  })

  return <div className="scroll-progress" aria-hidden="true" />
}

export default MotionRoot
