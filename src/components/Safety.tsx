import './Safety.css'

const pillars = [
  {
    index: '01',
    title: 'No open trench',
    body: 'Crews, traffic, and neighbors never share the street with an excavation. The work happens below grade, through two small pits.',
  },
  {
    index: '02',
    title: 'Everything located first',
    body: '811 locates verified and critical crossings potholed by vacuum — before the drill ever turns. That discipline is the whole job.',
  },
  {
    index: '03',
    title: 'A fraction of the footprint',
    body: 'Lawns, pavement, tree roots, and waterways stay intact above the bore. Restoration is measured in hours, not weeks.',
  },
  {
    index: '04',
    title: 'Fluids stay contained',
    body: 'Drilling fluid is managed, recycled, and vacuumed on site. When we leave, the only thing left behind is the line underground.',
  },
]

function ComparePanel({ kind }: { kind: 'cut' | 'bore' }) {
  return (
    <svg viewBox="0 0 360 150" aria-hidden="true">
      {kind === 'cut' ? (
        <>
          {/* broken surface: trench notch + spoil piles */}
          <path className="cmp-grade" d="M 16 60 H 130" />
          <path className="cmp-grade" d="M 230 60 H 344" />
          <path className="cmp-trench" d="M 130 60 L 138 118 L 222 118 L 230 60" />
          <path className="cmp-spoil" d="M 96 60 Q 113 42 130 60" />
          <path className="cmp-spoil" d="M 230 60 Q 247 42 264 60" />
          <line className="cmp-pipe-cut" x1="138" y1="112" x2="222" y2="112" />
          {[58, 84, 110, 250, 276, 302].map((x) => (
            <line key={x} className="cmp-scar" x1={x} y1="52" x2={x + 12} y2="44" />
          ))}
        </>
      ) : (
        <>
          {/* intact surface, shallow controlled bore beneath */}
          <path className="cmp-grade" d="M 16 60 H 344" />
          <path className="cmp-bore" d="M 30 62 C 75 88 110 96 180 96 C 250 96 285 88 330 62" />
          {[40, 320].map((x) => (
            <rect key={x} className="cmp-pit" x={x - 4} y="54" width="8" height="8" />
          ))}
        </>
      )}
      <text className="cmp-label mono" x="18" y="142">
        {kind === 'cut' ? 'OPEN CUT — SURFACE DESTROYED' : 'VERTEX BORE — SURFACE INTACT'}
      </text>
      <text className={`cmp-verdict mono ${kind}`} x="344" y="142" textAnchor="end">
        {kind === 'cut' ? '✕' : '✓'}
      </text>
    </svg>
  )
}

function Safety() {
  return (
    <section id="environment" className="safety theme-dark" aria-labelledby="safety-title">
      <div className="container">
        <div className="safety-head">
          <h2 id="safety-title">The safest dig is the one that never happens.</h2>
          <div className="safety-compare" data-reveal>
            <div className="safety-panel">
              <ComparePanel kind="cut" />
            </div>
            <div className="safety-panel">
              <ComparePanel kind="bore" />
            </div>
          </div>
        </div>
        <div className="safety-grid">
          {pillars.map((item) => (
            <article className="safety-cell" data-reveal key={item.index}>
              <span className="mono safety-index">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Safety
