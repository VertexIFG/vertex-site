import { motion } from 'motion/react'
import {
  ArrowUpRight,
  Cable,
  Check,
  CircleGauge,
  Droplets,
  Flame,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import './TestPage.css'

const sectors = [
  { label: 'Fiber optic', icon: Cable },
  { label: 'Gas', icon: Flame },
  { label: 'Electric', icon: Zap },
  { label: 'Water', icon: Droplets },
]

const metrics = [
  ['04', 'utility sectors'],
  ['HDD', 'trenchless install'],
  ['IL', 'Morrison operations'],
]

const operatingStandard = [
  'Route review before equipment moves',
  'Utility-aware field communication',
  'Controlled site presentation',
  'Clean restoration and closeout',
]

const proof = [
  {
    icon: CircleGauge,
    title: 'Planned before the bore',
    body: 'Access, crossings, surface conditions, and client constraints are translated into a field plan before crews arrive.',
  },
  {
    icon: ShieldCheck,
    title: 'Composed around active sites',
    body: 'The brand system is being shaped around the same expectation as the work: controlled, visible, and precise.',
  },
  {
    icon: MapPin,
    title: 'Regional response posture',
    body: 'Morrison-based operations give Vertex a practical launch point for utility work across the surrounding market.',
  },
]

const reveal = {
  initial: false,
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
}

function TestPage() {
  return (
    <main className="test-page">
      <header className="test-topbar" aria-label="Test page navigation">
        <a className="test-brand" href="/test" aria-label="Vertex test page">
          <img src="/assets/vertex-logo-wordmark.png" alt="Vertex" />
        </a>
        <nav aria-label="Test page sections">
          <a href="#standard">Standard</a>
          <a href="#fleet">Fleet</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="test-topbar-action" href="mailto:support@vertexifg.com">
          <Mail aria-hidden="true" />
          <span>Start</span>
        </a>
      </header>

      <section className="test-hero" aria-labelledby="test-title">
        <div className="test-hero-grid" aria-hidden="true">
          <div className="test-field-mark">V</div>
          <div className="test-red-vector" />
          <div className="test-plot test-plot-a" />
          <div className="test-plot test-plot-b" />
          <div className="test-plot test-plot-c" />
        </div>

        <motion.div
          className="test-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="test-kicker">Vertex Infrastructure Group</p>
          <h1 id="test-title">Underground work with surface-level precision.</h1>
          <p>
            A sharper direction for Vertex: industrial, exact, red and white, built around route
            discipline instead of generic contractor imagery.
          </p>
          <div className="test-actions">
            <a className="test-button test-button-red" href="#contact">
              Send project scope
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="test-button test-button-plain" href="#standard">
              View operating standard
            </a>
          </div>
        </motion.div>

        <motion.div
          className="test-hero-metrics"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Service overview"
        >
          {metrics.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="test-sector-strip" aria-label="Utility sectors">
        {sectors.map((sector) => {
          const Icon = sector.icon
          return (
            <div key={sector.label}>
              <Icon aria-hidden="true" />
              <span>{sector.label}</span>
            </div>
          )
        })}
      </section>

      <motion.section id="standard" className="test-section test-standard" {...reveal}>
        <div>
          <p className="test-kicker">Operating Standard</p>
          <h2>Fewer claims. Stronger signals. Clearer proof of control.</h2>
        </div>
        <div className="test-standard-panel">
          {operatingStandard.map((item) => (
            <div key={item}>
              <Check aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section className="test-route-system" {...reveal}>
        <div className="test-route-copy">
          <p className="test-kicker">Route Logic</p>
          <h2>Make the site feel engineered before it says a word about equipment.</h2>
          <p>
            The hero moves away from literal trucks and into the language of infrastructure:
            alignment, route marks, control points, and confident scale.
          </p>
        </div>
        <div className="test-route-diagram" aria-label="Route planning diagram">
          <span>Locate</span>
          <span>Cross</span>
          <span>Install</span>
          <span>Close</span>
        </div>
      </motion.section>

      <motion.section id="fleet" className="test-fleet" {...reveal}>
        <div className="test-fleet-copy">
          <p className="test-kicker">Field Presence</p>
          <h2>Fleet imagery supports the brand after the identity has already landed.</h2>
          <p>
            Trucks still matter, but they should validate the operation instead of doing all the
            design work. Here they sit lower in the system as evidence.
          </p>
        </div>
        <div className="test-fleet-grid">
          <img src="/assets/vertex-truck-2.webp" alt="Vertex branded SUV at night" />
          <img src="/assets/vertex-truck-3.webp" alt="Vertex branded utility support truck" />
          <img src="/assets/vertex-truck-4.webp" alt="Vertex branded crew vehicle" />
        </div>
      </motion.section>

      <motion.section className="test-section test-proof" {...reveal} aria-label="Positioning proof points">
        {proof.map((point) => {
          const Icon = point.icon
          return (
            <article key={point.title}>
              <Icon aria-hidden="true" />
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </article>
          )
        })}
      </motion.section>

      <section id="contact" className="test-contact">
        <motion.div {...reveal}>
          <p className="test-kicker">Project Intake</p>
          <h2>Send the route, utility scope, access constraints, and timing.</h2>
        </motion.div>
        <motion.div className="test-contact-actions" {...reveal}>
          <a className="test-button test-button-white" href="mailto:support@vertexifg.com">
            <Mail aria-hidden="true" />
            support@vertexifg.com
          </a>
          <a className="test-button test-button-outline" href="tel:+12245315731">
            <Phone aria-hidden="true" />
            (224) 531-5731
          </a>
          <span>
            <MapPin aria-hidden="true" />
            Morrison, IL
          </span>
        </motion.div>
      </section>
    </main>
  )
}

export default TestPage
