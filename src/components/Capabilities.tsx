import './Capabilities.css'

// Vertex is the boring contractor: we drill the path and place the conduit,
// casing, or carrier pipe — the utility owner's line runs through it.
const rows = [
  {
    index: '01',
    title: 'Fiber Optic Conduit',
    body: 'Drilled conduit paths for fiber routes — long pulls, road crossings, and a clean pathway ready for cable.',
  },
  {
    index: '02',
    title: 'Gas Line Crossings',
    body: 'Bored crossings and carrier-pipe paths for gas mains and services, locate-verified around live utilities.',
  },
  {
    index: '03',
    title: 'Electric Duct Runs',
    body: 'Conduit and duct corridors drilled beneath roads, parking lots, and finished surfaces for power.',
  },
  {
    index: '04',
    title: 'Water & Sewer Bores',
    body: 'Cased bores for water and sewer lines where opening up the surface isn’t an option.',
  },
]

function Capabilities() {
  return (
    <section id="capabilities" className="capabilities theme-paper" aria-labelledby="capabilities-title">
      <div className="container">
        <div className="capabilities-head">
          <h2 id="capabilities-title">Every line needs a path. We drill it.</h2>
        </div>
        <div className="capability-rows">
          {rows.map((row) => (
            <article className="capability-row" data-reveal key={row.index}>
              <span className="capability-index mono">{row.index}</span>
              <h3>{row.title}</h3>
              <p>{row.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Capabilities
