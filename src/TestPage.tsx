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

const services = [
  { label: 'Fiber optic', icon: Cable },
  { label: 'Gas', icon: Flame },
  { label: 'Electric', icon: Zap },
  { label: 'Water', icon: Droplets },
]

const commandMetrics = [
  ['7+', 'years in the field'],
  ['4', 'utility categories'],
  ['HDD', 'low-disruption installs'],
]

const routeSteps = ['Route review', 'Utility locates', 'Bore execution', 'Clean closeout']

const equipment = [
  {
    title: 'Vermeer D24x40 S3 Drill',
    body: 'High-power, compact footprint for urban and rural bores with strong thrust and pullback force.',
    image: '/assets/dbc-vermeer-drill.png',
  },
  {
    title: 'Vermeer MX150 Mixing System',
    body: 'Consistent drilling fluid support that stabilizes boreholes and keeps production moving.',
    image: '/assets/dbc-mixing-system.png',
  },
  {
    title: 'Vermeer VX50 Vacuum Excavator',
    body: 'Potholing, spoil removal, and cleanup support for safer, cleaner job sites.',
    image: '/assets/dbc-vac-excavator.png',
  },
]

const standards = [
  'OSHA-trained crews and daily safety briefings',
  'Utility locates before work proceeds',
  'Emergency and spill response planning',
  'Trenchless methods that avoid unnecessary surface damage',
  'Proper drilling-fluid management and spoil handling',
  'Photo-ready restoration and documented closeout',
]

const proof = [
  {
    icon: CircleGauge,
    title: 'Accuracy',
    body: 'Routes are reviewed around access, crossings, surface conditions, and client constraints before equipment moves.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety',
    body: 'Crews operate with PPE discipline, site-specific plans, and utility-aware communication on active work zones.',
  },
  {
    icon: MapPin,
    title: 'Regional reach',
    body: 'Morrison-based operations support fiber, electric, gas, and water infrastructure across the surrounding market.',
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
          <a href="#operations">Operations</a>
          <a href="#equipment">Equipment</a>
          <a href="#standards">Standards</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="test-topbar-action" href="mailto:support@vertexifg.com">
          <Mail aria-hidden="true" />
          Start
        </a>
      </header>

      <section className="test-hero" aria-labelledby="test-title">
        <div className="test-hero-visual" aria-hidden="true">
          <div className="test-grid-plane" />
          <div className="test-route-line" />
          <div className="test-vector-mark">V</div>
          <div className="test-orbit test-orbit-one" />
          <div className="test-orbit test-orbit-two" />
        </div>

        <motion.div
          className="test-hero-copy"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 id="test-title">Utility installs with command-center precision.</h1>
          <p>
            Vertex brings directional drilling, clean field execution, and disciplined closeout into
            one sharper operating presence for fiber, gas, electric, and water work.
          </p>
          <div className="test-actions">
            <a className="test-button test-button-red" href="#contact">
              Send project scope
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="test-button test-button-white" href="#operations">
              See field proof
            </a>
          </div>
        </motion.div>

        <motion.div
          className="test-command-panel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Vertex command overview"
        >
          <div className="test-panel-header">
            <span>Route Control</span>
            <strong>Active</strong>
          </div>
          <div className="test-route-map" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="test-step-list">
            {routeSteps.map((step) => (
              <div key={step}>
                <Check aria-hidden="true" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="test-hero-metrics" aria-label="Operational metrics">
          {commandMetrics.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="test-service-bar" aria-label="Utility sectors">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <div key={service.label}>
              <Icon aria-hidden="true" />
              <span>{service.label}</span>
            </div>
          )
        })}
      </section>

      <motion.section id="operations" className="test-operations" {...reveal}>
        <div className="test-section-copy">
          <h2>Real crews. Real equipment. Less surface disruption.</h2>
          <p>
            Directional drilling is the cleaner alternative to open trenching: install utility
            paths while preserving roads, topsoil, trees, and sensitive ground conditions.
          </p>
        </div>
        <div className="test-photo-system">
          <figure className="test-photo-large">
            <img src="/assets/dbc-field-truck.jpg" alt="Directional boring crew operating in the field" />
            <figcaption>Field crew managing conduit installation</figcaption>
          </figure>
          <figure>
            <img src="/assets/dbc-service-truck.jpeg" alt="Directional Boring Company service truck" />
            <figcaption>Heavy-duty service support</figcaption>
          </figure>
        </div>
      </motion.section>

      <motion.section id="equipment" className="test-equipment" {...reveal}>
        <div className="test-equipment-heading">
          <h2>The tools that drive performance.</h2>
          <p>
            The original operation invested in job-ready Vermeer equipment for faster, cleaner,
            lower-impact horizontal directional drilling.
          </p>
        </div>
        <div className="test-equipment-grid">
          {equipment.map((item) => (
            <article key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section id="standards" className="test-standards" {...reveal}>
        <div className="test-standard-copy">
          <h2>Do it right. Do it safely. Leave no trace.</h2>
          <p>
            Safety and environmental responsibility are not support copy. They are the operating
            system for how Vertex should show up on every project.
          </p>
        </div>
        <div className="test-standard-list">
          {standards.map((standard) => (
            <div key={standard}>
              <Check aria-hidden="true" />
              <span>{standard}</span>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section className="test-proof" {...reveal} aria-label="Vertex proof points">
        {proof.map((item) => {
          const Icon = item.icon
          return (
            <article key={item.title}>
              <Icon aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          )
        })}
      </motion.section>

      <section id="contact" className="test-contact">
        <div>
          <h2>Ready for route review, utility scope, and field planning.</h2>
        </div>
        <div className="test-contact-actions">
          <a className="test-button test-button-black" href="mailto:support@vertexifg.com">
            <Mail aria-hidden="true" />
            support@vertexifg.com
          </a>
          <a className="test-button test-button-red-outline" href="tel:+12245315731">
            <Phone aria-hidden="true" />
            (224) 531-5731
          </a>
          <span>
            <MapPin aria-hidden="true" />
            14729 Spring Valley Road, Morrison IL
          </span>
        </div>
      </section>
    </main>
  )
}

export default TestPage
