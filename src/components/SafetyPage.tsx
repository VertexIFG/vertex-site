import './SafetyPage.css'

// Full jobsite-safety program page (/safety). HDD-specific, plain language.
const sections = [
  {
    index: '01',
    title: 'Standards & compliance',
    intro: 'We operate in full compliance with the rules that govern underground work:',
    items: [
      'OSHA regulations and all applicable federal safety standards',
      'State and local construction and right-of-way codes',
      'Site-specific safety plans coordinated with general contractors and owners',
      'Continuous crew training on current HDD and excavation practices',
    ],
  },
  {
    index: '02',
    title: 'PPE, always on',
    intro: 'Our crews work in active streets and construction zones. Protection is non-negotiable:',
    items: [
      'Hard hats, high-visibility vests, and steel-toed boots at all times',
      'Eye protection and cut-resistant gloves for cutting and pipe handling',
      'Hearing protection around drill rigs, pumps, and vacuum units',
      'Electrically rated gloves and boots when drilling near power',
    ],
  },
  {
    index: '03',
    title: 'Equipment setup & operation',
    intro: 'Every rig is set up deliberately before the first rotation:',
    items: [
      'Rigs anchored and grounded before drilling begins',
      'Strike alert systems active when working near electric utilities',
      'Lockout / tagout procedures for all equipment maintenance',
      'Lift plans for loading, unloading, and positioning heavy tooling',
    ],
  },
  {
    index: '04',
    title: 'Excavation & hazard controls',
    intro: 'Pits, pavement, and the public are managed from the first cone to the last plate:',
    items: [
      'Entry and exit pits barricaded, signed, and plated when unattended',
      'Traffic control plans with cones, signage, and flaggers where required',
      'Spotters posted for equipment moves near traffic and pedestrians',
      'Confined-space procedures for any below-grade entry',
    ],
  },
  {
    index: '05',
    title: 'Meetings & incident reporting',
    intro: 'Safety is talked about constantly — and documented when it counts:',
    items: [
      'Weekly tailgate meetings on site-specific hazards',
      'All injuries and near misses reported within 24 hours, no exceptions',
      'Emergency contacts and first-aid resources posted and accessible on site',
    ],
  },
  {
    index: '06',
    title: 'A drug-free, accountable crew',
    intro: 'Focus is a safety device. We protect it:',
    items: [
      'Zero-tolerance drug and alcohol policy, with post-incident and reasonable-cause testing',
      'Every crew member and subcontractor held to the same protocols',
      'Violations mean immediate removal from the jobsite',
      'Issued safety equipment tracked, maintained, and inspected',
    ],
  },
]

function SafetyPage() {
  return (
    <>
      <section className="safetypage-hero theme-dark" aria-labelledby="safetypage-title">
        <div className="container">
          <h1 id="safetypage-title">Safety is the job.</h1>
          <p className="safetypage-lead">
            At Vertex, safety isn&apos;t a policy binder — it&apos;s how the work gets done. Every
            crew member, partner, and visitor goes home the way they arrived, and every site is
            run so the public never has to think about us at all.
          </p>
          <p className="mono safetypage-chip">
            <span aria-hidden="true" />
            OSHA-aligned · Trained · Documented
          </p>
        </div>
      </section>

      <section className="safetypage-body theme-paper" aria-label="Safety program">
        <div className="container">
          <div className="safetypage-rows">
            {sections.map((section) => (
              <article className="safetypage-row" data-reveal key={section.index}>
                <span className="mono safetypage-index">{section.index}</span>
                <div className="safetypage-rowhead">
                  <h2>{section.title}</h2>
                  <p>{section.intro}</p>
                </div>
                <ul className="safetypage-list">
                  {section.items.map((item) => (
                    <li key={item}>
                      <span className="safetypage-tick" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="safetypage-cta" data-reveal>
            <p>Questions about our safety program, EMR, or site-specific plans?</p>
            <a className="button button-red" href="/#contact">
              <span>Talk to Vertex</span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default SafetyPage
