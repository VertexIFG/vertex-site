import './EquipmentCarousel.css'

const units = [
  {
    index: '01',
    model: 'Vermeer D24x40 S3',
    role: 'Route Production',
    body: 'Compact drilling power for urban and rural routes where thrust, pullback, and site footprint all matter.',
    image: 'dbc-vermeer-drill',
    width: 670,
    height: 450,
    specs: [
      ['Model', 'D24x40 S3'],
      ['Thrust / Pullback', '24,000 lb'],
      ['Role', 'Pilot bore + pullback'],
    ],
  },
  {
    // Image shows the MX300 nameplate; prior site copy said MX150 — confirm with client.
    index: '02',
    model: 'Vermeer MX300 Mixing System',
    role: 'Fluid Control',
    body: 'Consistent drilling-fluid support for cleaner boreholes, better production rhythm, and fewer field stalls.',
    image: 'dbc-mixing-system',
    width: 525,
    height: 350,
    specs: [
      ['Model', 'MX300'],
      ['Function', 'Drilling fluid mixing'],
      ['Role', 'Bore stability'],
    ],
  },
  {
    index: '03',
    model: 'Vermeer VX50 Vacuum Excavator',
    role: 'Locate + Cleanup',
    body: 'Vacuum excavation support for potholing, spoil handling, restoration, and controlled site turnover.',
    image: 'dbc-vac-excavator',
    width: 525,
    height: 350,
    specs: [
      ['Model', 'VX50'],
      ['Function', 'Soft excavation'],
      ['Role', 'Potholing + restoration'],
    ],
  },
]

function EquipmentCarousel() {
  return (
    <section id="equipment" className="equipment theme-white" aria-labelledby="equipment-title">
      <div className="container">
        <header className="equipment-heading">
          <h2 id="equipment-title">Machines that don&apos;t stall.</h2>
        </header>

        <div className="equipment-ledger">
          {units.map((unit) => (
            <article className="equipment-row" data-reveal key={unit.index}>
              <div className="equipment-id">
                <span className="mono">{unit.index}</span>
                <span className="mono equipment-role">{unit.role}</span>
              </div>
              <div className="equipment-media">
                <img
                  src={`/assets/${unit.image}.webp`}
                  width={unit.width}
                  height={unit.height}
                  alt={unit.model}
                  decoding="async"
                />
              </div>
              <div className="equipment-meta">
                <h3>{unit.model}</h3>
                <p>{unit.body}</p>
                <dl className="equipment-specs">
                  {unit.specs.map(([key, value]) => (
                    <div key={key}>
                      <dt className="mono">{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EquipmentCarousel
