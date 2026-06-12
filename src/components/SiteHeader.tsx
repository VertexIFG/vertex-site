import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsapSetup'
import { currentPath } from '../lib/currentPath'
import './SiteHeader.css'

// hash links resolve against the home page; /safety is its own page
const base = () => (currentPath() === '' ? '' : '/')
const links = [
  ['#capabilities', 'Services'],
  ['#equipment', 'Equipment'],
  ['/safety', 'Safety'],
  ['/environment', 'Environment'],
] as const
const resolve = (href: string) => (href.startsWith('#') ? `${base()}${href}` : href)

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const pillRef = useRef<HTMLSpanElement | null>(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!reduced) {
        // Entrance: panel drops in, contents follow. Opacity only (never
        // visibility) so keyboard focus works from the first frame.
        gsap.fromTo(
          '.header-bar',
          { y: -14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.15 },
        )
        gsap.fromTo(
          ['.brand', '.header-link', '.header-cta'],
          { y: -8, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.4 },
        )
      }

      // Gliding hover pill behind the nav links
      const nav = navRef.current
      const pill = pillRef.current
      if (!nav || !pill) return

      const moveX = gsap.quickTo(pill, 'x', { duration: 0.35, ease: 'power3.out' })
      const moveW = gsap.quickTo(pill, 'width', { duration: 0.35, ease: 'power3.out' })

      const onEnter = (event: Event) => {
        const link = event.currentTarget as HTMLElement
        const navRect = nav.getBoundingClientRect()
        const rect = link.getBoundingClientRect()
        const pad = 14
        if (Number(gsap.getProperty(pill, 'opacity')) < 0.05) {
          // first hover: appear in place, no cross-bar slide
          gsap.set(pill, { x: rect.left - navRect.left - pad, width: rect.width + pad * 2 })
        } else {
          moveX(rect.left - navRect.left - pad)
          moveW(rect.width + pad * 2)
        }
        gsap.to(pill, { autoAlpha: 1, duration: 0.25, overwrite: 'auto' })
      }
      const onLeave = () => {
        gsap.to(pill, { autoAlpha: 0, duration: 0.3, overwrite: 'auto' })
      }

      const items = nav.querySelectorAll('.header-link')
      items.forEach((item) => item.addEventListener('mouseenter', onEnter))
      nav.addEventListener('mouseleave', onLeave)
      return () => {
        items.forEach((item) => item.removeEventListener('mouseenter', onEnter))
        nav.removeEventListener('mouseleave', onLeave)
      }
    },
    { scope: headerRef },
  )

  return (
    <header ref={headerRef} className="site-header" aria-label="Primary">
      <div className="header-bar">
        <a className="brand" href={resolve('#top')} aria-label="Vertex Infrastructure Group — top of page">
          <img
            src="/assets/vertex-wordmark-480.webp"
            srcSet="/assets/vertex-wordmark-320.webp 320w, /assets/vertex-wordmark-480.webp 480w"
            sizes="148px"
            width={480}
            height={47}
            alt="Vertex"
          />
        </a>
        <nav ref={navRef} className="header-nav" aria-label="Sections">
          <span ref={pillRef} className="header-pill" aria-hidden="true" />
          {links.map(([href, label]) => (
            <a key={href} className="header-link" href={resolve(href)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="button button-red header-cta" href={resolve('#contact')}>
          <span>Start a Project</span>
        </a>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-toggle-box" aria-hidden="true">
            <span />
            <span />
          </span>
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" data-open={menuOpen}>
        <nav aria-label="Sections">
          {links.map(([href, label]) => (
            <a key={href} href={resolve(href)} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a href={resolve('#contact')} onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </nav>
        <div className="mobile-menu-meta">
          <span>Morrison, Illinois</span>
          <a href="mailto:inquiries@vertexifg.com">inquiries@vertexifg.com</a>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
