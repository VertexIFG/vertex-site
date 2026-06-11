import { ArrowUpRight } from 'lucide-react'
import './SiteFooter.css'

const base = () => (window.location.pathname.replace(/\/$/, '') === '' ? '' : '/')
const explore = [
  ['#capabilities', 'Services'],
  ['#equipment', 'Equipment'],
  ['/safety', 'Safety'],
  ['/environment', 'Environment'],
] as const
const resolve = (href: string) => (href.startsWith('#') ? `${base()}${href}` : href)

function SiteFooter() {
  return (
    <footer className="site-footer theme-black">
      <div className="container footer-cta">
        <h2 className="footer-cta-title">Ready when your route is.</h2>
        <a className="button button-red footer-cta-button" href={resolve('#contact')}>
          <span>Start a Project</span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>

      <div className="footer-stamp" aria-hidden="true">
        <span>Vertex</span>
      </div>

      <div className="container footer-grid">
        <div className="footer-brand">
          <p>Vertex Infrastructure Group, LLC</p>
          <p className="footer-muted">
            Drilled underground pathways for fiber, gas, electric, and water.
          </p>
        </div>
        <nav className="footer-col" aria-label="Footer sections">
          <span className="footer-col-title mono">Explore</span>
          {explore.map(([href, label]) => (
            <a key={href} className="link-wipe" href={resolve(href)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="footer-col">
          <span className="footer-col-title mono">Contact</span>
          <a className="link-wipe" href="mailto:inquiries@vertexifg.com">
            inquiries@vertexifg.com
          </a>
          <a className="link-wipe" href="tel:+12245315731">
            (224) 531-5731
          </a>
          <span className="footer-muted">14729 Spring Valley Road, Morrison IL 61270</span>
        </div>
      </div>

      <div className="container footer-bottom">
        <span className="footer-muted">© 2026 Vertex Infrastructure Group, LLC</span>
        <span className="footer-muted">Fiber · Gas · Electric · Water</span>
      </div>

      <div className="footer-endline" aria-hidden="true">
        <span className="footer-endline-rule" />
        <span className="footer-endline-cap" />
      </div>
    </footer>
  )
}

export default SiteFooter
