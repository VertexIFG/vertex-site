import './SafetyPage.css'

// Environmental responsibility page (/environment) — HDD-specific practices.
const sections = [
  {
    index: '01',
    title: 'Drilling fluid, managed',
    intro: 'HDD runs on bentonite and polymer fluids. Ours never become someone else’s problem:',
    items: [
      'Fluids mixed, contained, and recycled on site through our mixing and vacuum systems',
      'Spent fluid and spoil hauled to approved disposal sites — never into ditches or drains',
      'Bore pressures monitored to prevent inadvertent returns, with a response plan on site',
      'Containment mats and berms under mixing and pumping equipment',
    ],
  },
  {
    index: '02',
    title: 'Spill prevention & response',
    intro: 'Every truck and rig carries what it takes to stop a problem in its first minute:',
    items: [
      'Spill containment kits on all service trucks and drill units',
      'Drip pans and secondary containment under hydraulic, fuel, and coolant connections',
      'Crews trained in hazardous-material handling and immediate spill response',
      'All incidents documented and reported — same standard as our safety program',
    ],
  },
  {
    index: '03',
    title: 'Stormwater & waterway protection',
    intro: 'We work near creeks, wetlands, and storm systems — and treat them like they matter:',
    items: [
      'Equipment is never washed or fueled near storm drains or water channels',
      'Ground barriers and containment used for any fluid exchange in the field',
      'Crossings near waterways planned with extra depth and monitoring',
      'Safeguards tailored to each site in coordination with owners and contractors',
    ],
  },
  {
    index: '04',
    title: 'Emissions & air quality',
    intro: 'Heavy equipment doesn’t have to mean careless equipment:',
    items: [
      'Idle time minimized across the fleet to cut fuel burn and emissions',
      'Equipment maintained to peak mechanical efficiency',
      'Dust controlled at pits and spoil handling points',
      'Route and logistics planning that shortens travel between sites',
    ],
  },
  {
    index: '05',
    title: 'A smaller footprint by design',
    intro: 'The method itself is the biggest environmental decision we make:',
    items: [
      'Boring instead of trenching leaves lawns, pavement, and root systems intact',
      'Two small pits replace an open cut across the whole route',
      'Less excavation means fewer haul trucks and far less restoration material',
      'Sites are returned to their original condition — quickly',
    ],
  },
  {
    index: '06',
    title: 'Accountability, always',
    intro: 'Environmental care is enforced like safety — because it is safety:',
    items: [
      'Environmental awareness training at onboarding and throughout the year',
      'Full compliance with EPA guidelines, local regulations, and client requirements',
      'Zero tolerance for negligence — for our crews and our subcontractors alike',
      'Field practices reviewed and improved season over season',
    ],
  },
]

function EnvironmentPage() {
  return (
    <>
      <section className="safetypage-hero theme-dark" aria-labelledby="envpage-title">
        <div className="container">
          <h1 id="envpage-title">Light on the land. By design.</h1>
          <p className="safetypage-lead">
            Trenchless work exists because tearing up the surface is the worst way to put
            something under it. Vertex takes that logic all the way down: contained fluids,
            protected waterways, and jobsites returned the way we found them.
          </p>
          <p className="mono safetypage-chip">
            <span aria-hidden="true" />
            Contained · Compliant · Restored
          </p>
        </div>
      </section>

      <section className="safetypage-body theme-paper" aria-label="Environmental program">
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
            <p>Need environmental documentation or a site-specific plan for your project?</p>
            <a className="button button-red" href="/#contact">
              <span>Talk to Vertex</span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default EnvironmentPage
