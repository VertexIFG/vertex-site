import { motion } from 'motion/react'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import './TestPage.css'

const utilityLines = [
  ['Fiber optic conduit', 'Long pulls, road crossings, and low-disruption pathway installation.'],
  ['Gas utility support', 'Locate-aware boring, controlled access, and careful closeout around active assets.'],
  ['Electric underground pathways', 'Planned utility corridors for service upgrades, extensions, and site work.'],
  ['Water infrastructure support', 'Trenchless paths for waterline work where surface protection matters.'],
]

const fieldCapabilities = [
  'Directional drilling and trenchless installation',
  'Crew and equipment mobilization',
  'Utility locate coordination',
  'Daily field records and photo documentation',
  'Bore logs, production notes, and closeout support',
]

const equipment = [
  {
    title: 'Vermeer D24x40 S3 Drill',
    role: 'Bore production',
    body: 'Compact drilling power for urban and rural routes where thrust, pullback, and site footprint all matter.',
    image: '/assets/dbc-vermeer-drill.png',
  },
  {
    title: 'Vermeer MX150 Mixing System',
    role: 'Fluid control',
    body: 'Consistent drilling-fluid support for cleaner boreholes, better production rhythm, and fewer field stalls.',
    image: '/assets/dbc-mixing-system.png',
  },
  {
    title: 'Vermeer VX50 Vacuum Excavator',
    role: 'Locate and cleanup',
    body: 'Vacuum excavation support for potholing, spoil handling, restoration, and controlled site turnover.',
    image: '/assets/dbc-vac-excavator.png',
  },
]

const documentation = [
  'Utility locate records before field work proceeds',
  'Photos before, during, and after installation',
  'Daily production notes and bore documentation',
  'Issue tracking for access, crossings, restoration, and delays',
  'Closeout packages that support billing and handoff',
]

const scopeFields = [
  'Name',
  'Company',
  'Email',
  'Phone',
  'Utility type',
  'Project location',
  'Scope, plans, timing, and notes',
]

const reveal = {
  initial: false,
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
}

function TestPage() {
  return (
    <main className="vertex-page">
      <header className="vertex-nav" aria-label="Test page navigation">
        <a className="vertex-mark" href="/test" aria-label="Vertex test page">
          <img src="/assets/vertex-logo-wordmark.png" alt="Vertex" />
        </a>
        <nav aria-label="Page sections">
          <a href="#capabilities">Capabilities</a>
          <a href="#field">Field execution</a>
          <a href="#equipment">Equipment</a>
          <a href="#contact">Project scope</a>
        </nav>
        <a className="nav-action" href="mailto:support@vertexifg.com">
          <Mail aria-hidden="true" />
          Send scope
        </a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-photo" aria-hidden="true">
          <img src="/assets/dbc-field-truck.jpg" alt="" />
        </div>
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-route" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 id="hero-title">Utility infrastructure, installed with field precision.</h1>
          <p>
            Vertex IFG supports fiber, gas, electric, and water projects with directional drilling,
            utility coordination, field documentation, and closeout discipline.
          </p>
          <div className="hero-actions">
            <a className="button button-red" href="#contact">
              Send project scope
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="button button-dark" href="#capabilities">
              View capabilities
            </a>
          </div>
        </motion.div>
        <motion.aside
          className="hero-proof"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>Field-proven operation</span>
          <strong>Directional drilling, support vehicles, vacuum excavation, and closeout records.</strong>
        </motion.aside>
      </section>

      <section id="capabilities" className="capability-band" aria-label="Utility capabilities">
        {utilityLines.map(([title, body]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <motion.section id="field" className="field-section" {...reveal}>
        <div className="field-image">
          <img src="/assets/dbc-service-truck.jpeg" alt="Directional Boring Company service truck" />
          <div className="image-station" aria-hidden="true">
            <span>STA 04</span>
            <span>Support vehicle</span>
          </div>
        </div>
        <div className="field-copy">
          <h2>Underground utility work is won before the first cut.</h2>
          <p>
            Vertex plans access, crews, equipment, locates, documentation, and closeout so field
            work moves with fewer surprises and less surface disruption.
          </p>
          <div className="capability-list">
            {fieldCapabilities.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="equipment" className="equipment-section" {...reveal}>
        <div className="equipment-heading">
          <h2>Equipment depth for utility work that cannot stall.</h2>
          <p>
            The equipment story should not feel like a catalog. It should prove that Vertex can
            move from route plan to installation, restoration, documentation, and closeout without
            losing control between crews and assets.
          </p>
        </div>
        <div className="equipment-runway">
          {equipment.map((item, index) => (
            <article key={item.title}>
              <div className="equipment-index">0{index + 1}</div>
              <img src={item.image} alt={item.title} />
              <div className="equipment-copy">
                <span>{item.role}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section className="documentation-section" {...reveal}>
        <div className="documentation-copy">
          <h2>Field work is only as good as the record behind it.</h2>
          <p>
            Infrastructure buyers care about risk reduction. Vertex should show the record chain:
            locates, photos, production notes, issue tracking, restoration, invoice support, and
            closeout.
          </p>
        </div>
        <div className="record-chain" aria-label="Documentation workflow">
          {documentation.map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section className="visibility-section" {...reveal}>
        <div className="visibility-media">
          <img src="/assets/dbc-field-truck.jpg" alt="Field crew installing underground utility conduit" />
        </div>
        <div className="visibility-copy">
          <h2>The field-to-office layer for modern utility work.</h2>
          <p>
            Vertex is building the operating rhythm contractors need: crew updates, field photos,
            production notes, invoice packet support, and closeout records connected to the job
            instead of scattered across calls and texts.
          </p>
        </div>
      </motion.section>

      <section id="contact" className="scope-section">
        <div className="scope-copy">
          <h2>Send the route. We&apos;ll review the scope.</h2>
          <p>
            Share project location, utility type, plans, access constraints, and timing. Vertex IFG
            will review the work and respond with the next step.
          </p>
          <div className="scope-contact">
            <a href="mailto:support@vertexifg.com">
              <Mail aria-hidden="true" />
              support@vertexifg.com
            </a>
            <a href="tel:+12245315731">
              <Phone aria-hidden="true" />
              (224) 531-5731
            </a>
            <span>
              <MapPin aria-hidden="true" />
              14729 Spring Valley Road, Morrison IL
            </span>
          </div>
        </div>
        <div className="scope-form" aria-label="Project scope fields">
          {scopeFields.map((field) => (
            <div key={field}>{field}</div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default TestPage
