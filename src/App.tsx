import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Drill,
  Flame,
  Leaf,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Signal,
  UtilityPole,
  Waves,
  Zap,
} from 'lucide-react'
import './App.css'

const services = [
  {
    icon: Signal,
    title: 'Fiber Optic',
    body: 'Trenchless conduit paths for backbone, last-mile, and municipal fiber expansions.',
  },
  {
    icon: Flame,
    title: 'Gas',
    body: 'Controlled underground installations planned around existing utilities and site constraints.',
  },
  {
    icon: Zap,
    title: 'Electric',
    body: 'Precise bores for electrical conduit, utility crossings, and service upgrades.',
  },
  {
    icon: Waves,
    title: 'Water',
    body: 'Low-disturbance utility routes that protect surface conditions and reduce restoration work.',
  },
]

const equipment = [
  {
    image: '/assets/vermeer-drill.webp',
    title: 'Vermeer D24x40 S3 Drill',
    detail: 'Compact power for urban and rural bores with strong thrust, pullback, and jobsite control.',
  },
  {
    image: '/assets/vac-excavator.webp',
    title: 'Vermeer VX50 Vacuum Excavator',
    detail: 'Clean potholing, efficient spoil removal, and safer exposure of underground utilities.',
  },
  {
    image: '/assets/mixing-system.webp',
    title: 'Vermeer Mixing System',
    detail: 'Consistent drilling fluid management for borehole stability and productive field operations.',
  },
]

const safetyPractices = [
  'OSHA-trained crews and daily briefings',
  'Site-specific utility locates and hazard plans',
  'PPE compliance, traffic control, and work-zone discipline',
  'Spill response planning and responsible fluid handling',
]

const process = [
  'Scope the route',
  'Locate utilities',
  'Drill with precision',
  'Restore cleanly',
]

function App() {
  return (
    <main>
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand-mark" href="#top" aria-label="Vertex Infrastructure Group home">
          <img src="/assets/vertex-logo-wide.png" alt="Vertex Infrastructure Group" />
        </a>
        <nav>
          <a href="#services">Services</a>
          <a href="#equipment">Equipment</a>
          <a href="#safety">Safety</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="tel:+12245315731">
          <Phone aria-hidden="true" />
          Call
        </a>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-media" aria-hidden="true">
          <img src="/assets/field-crew.webp" alt="" />
        </div>
        <div className="hero-content">
          <p className="eyebrow">Fiber Optic · Gas · Electric · Water</p>
          <h1>Precision underground infrastructure with a cleaner surface finish.</h1>
          <p className="hero-copy">
            Vertex Infrastructure Group delivers horizontal directional drilling for utility
            projects that need accuracy, speed, and disciplined jobsite execution.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#contact">
              Request a project review
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="button secondary" href="#services">
              Explore capabilities
            </a>
          </div>
        </div>
        <aside className="hero-panel" aria-label="Vertex operating metrics">
          <div>
            <span>7+</span>
            <p>Years in the field</p>
          </div>
          <div>
            <span>4</span>
            <p>Utility sectors served</p>
          </div>
          <div>
            <span>HDD</span>
            <p>Low-impact installation</p>
          </div>
        </aside>
      </section>

      <section className="intro-band" aria-label="Company summary">
        <div>
          <p className="section-kicker">Vertex Infrastructure Group</p>
          <h2>Built for utility work where accuracy, safety, and surface protection matter.</h2>
        </div>
        <p>
          Vertex sharpens the focus around utility infrastructure: dependable trenchless drilling,
          carefully maintained equipment, and crews trained to leave every jobsite controlled,
          clean, and ready for the next phase.
        </p>
      </section>

      <section id="services" className="section service-section">
        <div className="section-heading">
          <p className="section-kicker">Capabilities</p>
          <h2>Utility sectors supported by one disciplined HDD platform.</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <article className="service-card" key={service.title}>
                <Icon aria-hidden="true" />
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="split-section">
        <div className="split-copy">
          <p className="section-kicker">Approach</p>
          <h2>Trenchless installation designed around fewer surprises.</h2>
          <p>
            Vertex plans each bore around site access, existing utilities, soil conditions, traffic
            control, and restoration needs. The result is a tighter field operation with less open
            excavation and a smaller impact on the surrounding property.
          </p>
          <ul className="check-list">
            <li>
              <CheckCircle2 aria-hidden="true" />
              Non-invasive alternative to trenching
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" />
              Accurate utility paths across constrained sites
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" />
              Cleaner restoration for public and private work
            </li>
          </ul>
        </div>
        <div className="split-image">
          <img src="/assets/worksite.webp" alt="Directional drilling worksite and utility crew" />
        </div>
      </section>

      <section id="equipment" className="section equipment-section">
        <div className="section-heading">
          <p className="section-kicker">Equipment</p>
          <h2>Modern Vermeer equipment for precise, low-impact production.</h2>
        </div>
        <div className="equipment-grid">
          {equipment.map((item) => (
            <article className="equipment-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="safety" className="safety-section">
        <div className="safety-image">
          <img src="/assets/field-crew.webp" alt="Utility infrastructure crew at a field worksite" />
        </div>
        <div className="safety-copy">
          <p className="section-kicker">Safety + Environment</p>
          <h2>Do it right. Do it safely. Leave no trace.</h2>
          <p>
            Safety and environmental control are built into the work: briefings, locates, PPE, fluid
            management, spoil handling, and site restoration policies that protect crews, clients,
            and communities.
          </p>
          <div className="practice-list">
            {safetyPractices.map((practice) => (
              <div key={practice}>
                <ShieldCheck aria-hidden="true" />
                <span>{practice}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section" aria-label="Project process">
        <div className="process-heading">
          <p className="section-kicker">Project Flow</p>
          <h2>A clean path from quote to restoration.</h2>
        </div>
        <div className="process-rail">
          {process.map((step, index) => (
            <div className="process-step" key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-content">
          <p className="section-kicker">Start a Project</p>
          <h2>Bring Vertex in early for route planning, utility installs, and project scopes.</h2>
          <p>
            Share the location, utility type, approximate bore length, site constraints, and target
            schedule. The team will respond with next steps.
          </p>
          <div className="contact-actions">
            <a className="button primary" href="mailto:inquiries@directionalboring.org">
              <Mail aria-hidden="true" />
              Email Vertex
            </a>
            <a className="button secondary light" href="tel:+12245315731">
              <Phone aria-hidden="true" />
              (224) 531-5731
            </a>
          </div>
        </div>
        <div className="contact-details" aria-label="Contact details">
          <div>
            <Mail aria-hidden="true" />
            <a href="mailto:inquiries@directionalboring.org">inquiries@directionalboring.org</a>
          </div>
          <div>
            <Phone aria-hidden="true" />
            <a href="tel:+12245315731">(224) 531-5731</a>
          </div>
          <div>
            <MapPin aria-hidden="true" />
            <span>14729 Spring Valley Road, Morrison IL, 61270</span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <img src="/assets/vertex-logo-wide.png" alt="Vertex Infrastructure Group" />
        <div className="footer-links">
          <a href="#services">
            <UtilityPole aria-hidden="true" />
            Services
          </a>
          <a href="#equipment">
            <Drill aria-hidden="true" />
            Equipment
          </a>
          <a href="#safety">
            <Leaf aria-hidden="true" />
            Safety
          </a>
          <a href="#contact">
            <Clock3 aria-hidden="true" />
            Contact
          </a>
        </div>
      </footer>
    </main>
  )
}

export default App
