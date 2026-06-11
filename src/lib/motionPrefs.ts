import { useEffect, useState } from 'react'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}

export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 760px)')
}

export function useFinePointer() {
  return useMediaQuery('(pointer: fine)')
}
