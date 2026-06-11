import './Fleet.css'

const standards = [
  {
    index: '01',
    title: 'Utilities verified first',
    body: 'Every existing utility is located and verified before we drill near it — vacuum-potholed where the crossing is tight.',
  },
  {
    index: '02',
    title: 'Traffic kept moving',
    body: 'Work zones are planned before we mobilize, so lanes, driveways, and walkways stay usable while we work.',
  },
  {
    index: '03',
    title: 'A weekly report',
    body: 'Photos and a plain-language status each week — what got done, what comes next, and anything that needs your attention.',
  },
  {
    index: '04',
    title: 'Restored and cleared',
    body: 'Spoil hauled, surfaces restored, and the site cleared promptly after the work is complete.',
  },
]

// Simple top-down site layout: street, work zone, equipment in place.
function StagingPlan() {
  return (
    <svg viewBox="0 0 620 400" aria-hidden="true">
      <rect className="plan-frame" x="6" y="6" width="608" height="388" />
      <text className="plan-mono plan-dim" x="24" y="34">
        SITE LAYOUT — TYPICAL
      </text>

      {/* street */}
      <line className="plan-street" x1="24" y1="140" x2="596" y2="140" />
      <line className="plan-street" x1="24" y1="236" x2="596" y2="236" />
      <line className="plan-dashes" x1="36" y1="188" x2="584" y2="188" />
      <text className="plan-mono plan-dim" x="312" y="128" textAnchor="middle">
        TRAFFIC MAINTAINED
      </text>

      {/* marked work zone */}
      <rect className="plan-zone" x="40" y="200" width="270" height="30" />
      <text className="plan-mono plan-dim" x="52" y="221">
        WORK ZONE
      </text>

      {/* entry pit */}
      <rect className="plan-pit" x="296" y="228" width="16" height="16" />
      <line className="plan-leader" x1="312" y1="236" x2="370" y2="264" />
      <text className="plan-mono plan-dim" x="376" y="268">
        ENTRY PIT
      </text>

      {/* equipment staged off the street */}
      <g className="plan-machine">
        <rect x="60" y="282" width="86" height="38" />
        <text className="plan-mono" x="103" y="305" textAnchor="middle">
          RIG
        </text>
      </g>
      <g className="plan-machine">
        <rect x="166" y="282" width="72" height="38" />
        <text className="plan-mono" x="202" y="305" textAnchor="middle">
          MIX
        </text>
      </g>
      <g className="plan-machine">
        <rect x="258" y="282" width="72" height="38" />
        <text className="plan-mono" x="294" y="305" textAnchor="middle">
          VAC
        </text>
      </g>
      <text className="plan-mono plan-dim" x="60" y="350">
        EQUIPMENT STAGED OFF STREET
      </text>

      {/* driveway access preserved */}
      <rect className="plan-driveway" x="478" y="236" width="58" height="52" />
      <text className="plan-mono plan-dim" x="507" y="312" textAnchor="middle">
        ACCESS KEPT OPEN
      </text>
    </svg>
  )
}

function Fleet() {
  return (
    <section id="fleet" className="fleet theme-dark" aria-labelledby="fleet-title">
      <div className="container">
        <div className="fleet-head">
          <div className="fleet-copy">
            <h2 id="fleet-title">We show up organized.</h2>
            <p className="fleet-sub">
              The site is planned before the first truck arrives — equipment staged, access
              maintained, and the work zone clearly marked.
            </p>
          </div>
          <div className="fleet-plan" data-reveal>
            <StagingPlan />
          </div>
        </div>
        <div className="fleet-rows">
          {standards.map((item) => (
            <article className="fleet-row" data-reveal key={item.index}>
              <span className="mono fleet-index">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Fleet
