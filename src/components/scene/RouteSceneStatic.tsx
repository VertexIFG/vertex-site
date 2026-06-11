import { STATIONS } from './stations'
import './RouteSceneStatic.css'

// Plan-view survey drawing of a bore route crossing a road. Serves as the
// poster fallback for the WebGL scene and the reduced-motion/mobile terminal state.
function RouteSceneStatic() {
  return (
    <div className="route-static">
      <svg
        className="route-static-svg"
        viewBox="0 0 1200 560"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* survey grid */}
        {Array.from({ length: 19 }, (_, i) => (
          <line key={`v${i}`} x1={i * 64 + 32} y1="0" x2={i * 64 + 32} y2="560" stroke="rgba(255,255,255,0.05)" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 64 + 24} x2="1200" y2={i * 64 + 24} stroke="rgba(255,255,255,0.05)" />
        ))}

        {/* contour hints */}
        <path d="M40 120 Q 320 70 560 130 T 1160 100" fill="none" stroke="rgba(255,255,255,0.08)" />
        <path d="M20 430 Q 360 480 640 430 T 1180 470" fill="none" stroke="rgba(255,255,255,0.08)" />
        <path d="M80 280 Q 300 250 480 290" fill="none" stroke="rgba(255,255,255,0.06)" />

        {/* the road (obstacle) */}
        <g>
          <rect x="640" y="0" width="120" height="560" fill="#101216" />
          <line x1="644" y1="0" x2="644" y2="560" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <line x1="756" y1="0" x2="756" y2="560" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <line x1="700" y1="0" x2="700" y2="560" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="22 18" />
        </g>

        {/* bore route: solid on approach, dashed where it runs under the road */}
        <path
          className="route-static-path"
          d="M60 470 C 240 430 380 380 520 330 L 628 296"
          fill="none"
          stroke="var(--red)"
          strokeWidth="3"
        />
        <path
          d="M628 296 L 772 252"
          fill="none"
          stroke="var(--red)"
          strokeWidth="3"
          strokeDasharray="10 8"
        />
        <path
          className="route-static-path"
          d="M772 252 C 900 214 1020 170 1130 120"
          fill="none"
          stroke="var(--red)"
          strokeWidth="3"
        />

        {/* station ticks */}
        {[
          [60, 470],
          [380, 380],
          [700, 274],
          [950, 199],
          [1130, 120],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 4} y={y - 4} width="8" height="8" fill={i === 0 || i === 4 ? 'var(--red)' : '#0a0b0d'} stroke="var(--red)" strokeWidth="1.5" />
          </g>
        ))}

        {/* entry / exit labels */}
        <text x="76" y="500" className="route-static-text">ENTRY 00+00</text>
        <text x="980" y="106" className="route-static-text">EXIT 18+00</text>
        <text x="652" y="540" className="route-static-text">ROAD XING — 6 FT COVER</text>
      </svg>

      <ol className="route-static-stations">
        {STATIONS.map(([sta, label]) => (
          <li key={sta}>
            <span className="mono mono-red">{sta}</span>
            <span className="mono">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default RouteSceneStatic
