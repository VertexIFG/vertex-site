import { useEffect } from 'react'
import { getLenis } from '../lib/smoothScroll'

/**
 * Route all in-page anchor clicks through Lenis (when active) and keep the
 * URL hash in sync. Falls back to native scrolling when Lenis is absent
 * (reduced motion). Focus moves to the target so skip links stay accessible.
 */
// Header is non-sticky, so the offset is just breathing room above sections.
export function useAnchorScroll(headerOffset = 24) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return
      const anchor = (event.target as Element).closest?.('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute('href') ?? ''
      if (hash.length < 2) return
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return

      event.preventDefault()
      const lenis = getLenis()
      const offset = hash === '#main' || hash === '#top' ? 0 : -headerOffset
      if (lenis) {
        lenis.scrollTo(target, { offset })
      } else {
        target.scrollIntoView()
      }
      history.pushState(null, '', hash)
      if (hash === '#main') target.focus({ preventScroll: true })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [headerOffset])
}
