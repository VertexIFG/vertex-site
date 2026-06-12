import { Mail, MapPin, Phone } from 'lucide-react'
import { useEffect, useRef, useSyncExternalStore } from 'react'
import MagneticButton from './ui/MagneticButton'
import './Contact.css'

const EMAIL = 'inquiries@vertexifg.com'

// Form delivery via FormSubmit using a native top-level POST — the most
// reliable path through their Cloudflare protection (XHR gets challenged).
// After processing, FormSubmit redirects back to `?sent=1#contact`, which
// renders the inline confirmation below.
//
// NOTE FOR CLIENT: the first-ever submission emails a one-time activation
// link to inquiries@vertexifg.com — click it once and every subsequent
// inquiry arrives normally (and the redirect kicks in).
const ACTION = `https://formsubmit.co/${EMAIL}`

// browser-only value, read hydration-safely (server snapshot: false)
const noopSubscribe = () => () => {}
const readSent = () => new URLSearchParams(window.location.search).has('sent')

function Contact() {
  const sent = useSyncExternalStore(noopSubscribe, readSent, () => false)
  const nextRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // _next must be an absolute URL; resolve it for whatever host serves the site
    if (nextRef.current) {
      nextRef.current.value = `${window.location.origin}${window.location.pathname}?sent=1#contact`
    }
    if (sent) {
      history.replaceState(null, '', `${window.location.pathname}#contact`)
    }
  }, [sent])

  return (
    <section id="contact" className="contact theme-dark" aria-labelledby="contact-title">
      <div className="container contact-inner">
        <div className="contact-copy">
          <h2 id="contact-title">Tell us about your project.</h2>
          <p className="contact-body">
            Share the location, the utility, and your timeline. We&apos;ll come back with a clear
            plan and an honest quote — usually within one business day.
          </p>
          <div className="contact-rows">
            <a className="contact-row" href={`mailto:${EMAIL}`}>
              <Mail aria-hidden="true" />
              <span>{EMAIL}</span>
            </a>
            <a className="contact-row" href="tel:+12245315731">
              <Phone aria-hidden="true" />
              <span>(224) 531-5731</span>
            </a>
            <span className="contact-row">
              <MapPin aria-hidden="true" />
              <span>14729 Spring Valley Road, Morrison IL 61270</span>
            </span>
          </div>
        </div>

        <form className="contact-form" action={ACTION} method="POST" aria-label="Project inquiry">
          {/* FormSubmit config */}
          <input type="hidden" name="_subject" value="New project inquiry — vertexifg.com" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" ref={nextRef} value="" />
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            className="visually-hidden"
            aria-hidden="true"
          />

          <div className="form-grid">
            <label className="form-field">
              <span className="mono">Name</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label className="form-field">
              <span className="mono">Company</span>
              <input name="company" type="text" autoComplete="organization" />
            </label>
            <label className="form-field">
              <span className="mono">Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="form-field">
              <span className="mono">Phone</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label className="form-field">
              <span className="mono">Utility type</span>
              <select name="utility" defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                <option>Fiber optic</option>
                <option>Gas</option>
                <option>Electric</option>
                <option>Water</option>
                <option>Multiple / other</option>
              </select>
            </label>
            <label className="form-field">
              <span className="mono">Project location</span>
              <input name="location" type="text" placeholder="City, state" />
            </label>
            <label className="form-field form-field-wide">
              <span className="mono">Tell us about the work</span>
              <textarea
                name="details"
                rows={4}
                placeholder="What needs to go in the ground, roughly how far, and when you'd like it done."
              />
            </label>
          </div>

          {sent ? (
            <p className="form-success" role="status">
              <span className="form-success-mark" aria-hidden="true" />
              Request received. We&apos;ll get back to you within one business day.
            </p>
          ) : (
            <MagneticButton>
              <button className="button button-red contact-submit" type="submit">
                <span>Send Inquiry</span>
              </button>
            </MagneticButton>
          )}
        </form>
      </div>
    </section>
  )
}

export default Contact
