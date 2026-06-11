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

function App() {
  const path = window.location.pathname.replace(/\/$/, '')
  const onSafetyPage = path === '/safety'
  const onEnvironmentPage = path === '/environment'
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
