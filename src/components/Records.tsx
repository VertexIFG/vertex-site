import './Records.css'

// [phase, detail, the artifact you actually receive]
const chain = [
  [
    'Before we drill',
    'Every existing utility on your route is located, marked, and verified — and the bore plan is walked against what’s actually in the ground, not just what’s on the map.',
    'Locate tickets + bore plan',
  ],
  [
    'While we work',
    'Your site is photographed before, during, and after. Depth and steering readings are logged shot by shot, so the path we drilled is the path we planned.',
    'Pilot bore log + photo set',
  ],
  [
    'Every week',
    'A plain-language update: what got done, what happens next, and anything that needs your eyes — sent before you have to ask.',
    'Weekly field report',
  ],
  [
    'If something comes up',
    'Obstructions, conflicts, weather — flagged the moment they appear, with options. Nothing gets discovered at invoice time.',
    'Same-day flag + options',
  ],
  [
    'When we finish',
    'You receive the complete project file: as-built depths and alignment, the full photo record, and restoration sign-off — ready for inspectors, owners, and billing.',
    'As-built closeout package',
  ],
] as const

function Records() {
  return (
    <section id="records" className="records theme-paper" aria-labelledby="records-title">
      <div className="container records-inner">
        <div className="records-copy">
          <h2 id="records-title">You&apos;ll never wonder what happened on your project.</h2>
        </div>
        <ol className="records-chain">
          <span className="records-chain-line" aria-hidden="true" />
          {chain.map(([phase, detail, artifact], index) => (
            <li className="records-step" data-reveal key={phase}>
              <span className="mono records-num">{String(index + 1).padStart(2, '0')}</span>
              <span className="records-phase">{phase}</span>
              <span className="records-text">{detail}</span>
              <span className="mono records-artifact">
                <span className="records-artifact-tick" aria-hidden="true" />
                You get: {artifact}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Records
