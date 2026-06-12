import { useEffect } from 'react'
import MotionRoot from './components/MotionRoot'
import SiteHeader from './components/SiteHeader'
import Hero from './components/Hero'
import Capabilities from './components/Capabilities'
import RouteChapter from './components/RouteChapter'
import BoreChapter from './components/BoreChapter'
import EquipmentCarousel from './components/EquipmentCarousel'
import Fleet from './components/Fleet'
import Records from './components/Records'
import Safety from './components/Safety'
import Contact from './components/Contact'
import SiteFooter from './components/SiteFooter'
import SafetyPage from './components/SafetyPage'
import EnvironmentPage from './components/EnvironmentPage'

const ROUTE_HEAD: Record<string, { title: string; description: string }> = {
  '/safety': {
    title: 'Safety Program | Vertex Infrastructure Group',
    description:
      'How Vertex Infrastructure Group runs HDD jobsites: PPE standards, utility verification, excavation controls, traffic plans, and zero tolerance for negligence.',
  },
  '/environment': {
    title: 'Environmental Practices | Vertex Infrastructure Group',
    description:
      'Trenchless installation with full fluid containment, spill prevention, stormwater protection, and EPA-compliant disposal on every Vertex HDD project.',
  },
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '')
  const onSafetyPage = path === '/safety'
  const onEnvironmentPage = path === '/environment'

  useEffect(() => {
    const head = ROUTE_HEAD[path]
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) canonical.href = `https://vertexifg.com${path}` + (path ? '' : '/')
    if (!head) return
    document.title = head.title
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) description.content = head.description
  }, [path])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <MotionRoot />
      <main id="main" tabIndex={-1}>
        {onSafetyPage ? (
          <SafetyPage />
        ) : onEnvironmentPage ? (
          <EnvironmentPage />
        ) : (
          <>
        <Hero />
        <Capabilities />
        <RouteChapter />
        <BoreChapter />
        <EquipmentCarousel />
        <Fleet />
        <Records />
        <Safety />
        <Contact />
          </>
        )}
      </main>
      <SiteFooter />
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export default App
