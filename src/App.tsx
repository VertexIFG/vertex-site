import {
  ArrowUpRight,
  Cable,
  Check,
  Droplets,
  Flame,
  Gauge,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import './App.css'

const sectors = [
  { label: 'Fiber optic', icon: Cable },
  { label: 'Gas', icon: Flame },
  { label: 'Electric', icon: Zap },
  { label: 'Water', icon: Droplets },
]

const standards = [
  'Pre-construction route review',
  'Utility-aware field execution',
  'Clean work zones and restoration',
  'Photo-ready fleet presentation',
]

const process = [
  ['01', 'Plan', 'Route, access, crossings, and surface conditions are reviewed before equipment moves.'],
  ['02', 'Locate', 'Existing utilities and site constraints are mapped into the field plan.'],
  ['03', 'Install', 'Crews execute controlled trenchless utility paths with tight communication.'],
  ['04', 'Close', 'The site is cleaned, documented, and turned over without loose ends.'],
]

const gallery = [
  {
    image: '/assets/vertex-truck-2.webp',
    title: 'Night-ready fleet presence',
  },
  {
    image: '/assets/vertex-truck-3.webp',
    title: 'Branded utility support vehicles',
  },
  {
    image: '/assets/vertex-truck-4.webp',
    title: 'Field-ready crew mobility',
  },
]

function App() {
  return (
    <main>
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Vertex Infrastructure Group home">
          <img src="/assets/vertex-logo-wide.png" alt="Vertex Infrastructure Group" />
        </a>
        <nav>
          <a href="#capabilities">Capabilities</a>
          <a href="#fleet">Fleet</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-action" href="mailto:support@vertexifg.com">
          <Mail aria-hidden="true" />
          Support
        </a>
      </header>

      <section id="top" className="hero">
        <img className="hero-image" src="/assets/vertex-truck-1.webp" alt="" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Fiber optic · Gas · Electric · Water</p>
          <h1>Vertex Infrastructure Group</h1>
          <p className="hero-copy">
            Trenchless utility installation with polished field operations, modern equipment, and a
            fleet built to represent the job before a crew ever steps out.
          </p>
          <div className="hero-actions">
            <a className="button button-red" href="#contact">
              Start a project
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="button button-glass" href="#fleet">
              View fleet
            </a>
          </div>
        </div>
        <div className="hero-metrics" aria-label="Service overview">
          <div>
            <strong>4</strong>
            <span>Core utility sectors</span>
          </div>
          <div>
            <strong>HDD</strong>
            <span>Trenchless install capability</span>
          </div>
          <div>
            <strong>IL</strong>
            <span>Morrison-based operations</span>
          </div>
        </div>
      </section>

      <section id="capabilities" className="capability-strip" aria-label="Utility sectors">
        {sectors.map((sector) => {
          const Icon = sector.icon
          return (
            <div className="sector" key={sector.label}>
              <Icon aria-hidden="true" />
              <span>{sector.label}</span>
            </div>
          )
        })}
      </section>

      <section className="section intro">
        <div>
          <p className="section-label">What Vertex Does</p>
          <h2>Utility paths installed cleanly, planned tightly, and delivered with less surface disruption.</h2>
        </div>
        <div className="intro-copy">
          <p>
            Vertex supports underground infrastructure work where the route matters, the surface
            matters, and the operator needs a crew that looks as buttoned-up as it works.
          </p>
          <div className="standard-list">
            {standards.map((standard) => (
              <div key={standard}>
                <Check aria-hidden="true" />
                {standard}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fleet" className="fleet-showcase">
        <div className="fleet-copy">
          <p className="section-label">Fleet</p>
          <h2>Branded vehicles that make the operation feel intentional before the work starts.</h2>
          <p>
            The refreshed Vertex presence is clean, recognizable, and built for utility clients who
            need confidence in both the field crew and the finished result.
          </p>
        </div>
        <div className="fleet-main">
          <img src="/assets/vertex-truck-2.webp" alt="Vertex Infrastructure Group branded SUV" />
        </div>
      </section>

      <section className="section proof">
        <article>
          <Gauge aria-hidden="true" />
          <h3>Precise field planning</h3>
          <p>Routes are reviewed around access, crossings, site constraints, and restoration needs.</p>
        </article>
        <article>
          <ShieldCheck aria-hidden="true" />
          <h3>Controlled worksites</h3>
          <p>Crews operate with the discipline expected around public, commercial, and utility assets.</p>
        </article>
        <article>
          <MapPin aria-hidden="true" />
          <h3>Regional response</h3>
          <p>Morrison-based operations give Vertex a practical launch point for Midwest projects.</p>
        </article>
      </section>

      <section className="gallery" aria-label="Vertex fleet gallery">
        {gallery.map((item) => (
          <figure key={item.image}>
            <img src={item.image} alt={item.title} />
            <figcaption>{item.title}</figcaption>
          </figure>
        ))}
      </section>

      <section id="process" className="section process">
        <div className="process-heading">
          <p className="section-label">Process</p>
          <h2>A tighter path from first call to completed utility route.</h2>
        </div>
        <div className="process-grid">
          {process.map(([number, title, body]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="contact-panel">
          <p className="section-label">Start Here</p>
          <h2>Send the route, timeline, and utility scope. Vertex will take it from there.</h2>
          <div className="contact-actions">
            <a className="button button-white" href="mailto:support@vertexifg.com">
              <Mail aria-hidden="true" />
              support@vertexifg.com
            </a>
            <a className="button button-outline" href="tel:+12245315731">
              <Phone aria-hidden="true" />
              (224) 531-5731
            </a>
          </div>
        </div>
        <div className="contact-meta">
          <span>14729 Spring Valley Road</span>
          <span>Morrison, IL 61270</span>
          <span>Fiber · Gas · Electric · Water</span>
        </div>
      </section>

      <footer className="footer">
        <img src="/assets/vertex-logo-wide.png" alt="Vertex Infrastructure Group" />
        <span>Trenchless utility infrastructure</span>
      </footer>
    </main>
  )
}

export default App
