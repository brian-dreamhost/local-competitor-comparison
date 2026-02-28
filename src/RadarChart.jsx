import { computeRadarScores } from './scoringEngine'

const AXES = [
  { key: 'reviews', label: 'Reviews' },
  { key: 'rating', label: 'Rating' },
  { key: 'onlinePresence', label: 'Online Presence' },
  { key: 'contentActivity', label: 'Content Activity' },
  { key: 'websiteQuality', label: 'Website Quality' },
  { key: 'businessMaturity', label: 'Business Maturity' },
]

const COLORS = [
  { stroke: '#0073EC', fill: 'rgba(0, 115, 236, 0.15)', name: 'azure' },
  { stroke: '#FF4A48', fill: 'rgba(255, 74, 72, 0.15)', name: 'coral' },
  { stroke: '#F59D00', fill: 'rgba(245, 157, 0, 0.15)', name: 'tangerine' },
]

function polarToCart(angle, radius, cx, cy) {
  const rad = (angle - 90) * (Math.PI / 180)
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

export default function RadarChart({ businesses, industry }) {
  const cx = 150
  const cy = 150
  const maxR = 110
  const levels = 4
  const angleStep = 360 / AXES.length

  // Compute scores for all businesses
  const allScores = businesses.filter(b => b && b.name).map(b => computeRadarScores(b, industry))

  // Generate concentric polygon rings
  const rings = []
  for (let i = 1; i <= levels; i++) {
    const r = (maxR / levels) * i
    const points = AXES.map((_, j) => {
      const pt = polarToCart(j * angleStep, r, cx, cy)
      return `${pt.x},${pt.y}`
    }).join(' ')
    rings.push(
      <polygon
        key={`ring-${i}`}
        points={points}
        fill="none"
        stroke="rgba(67, 79, 88, 0.3)"
        strokeWidth="1"
      />
    )
  }

  // Generate axis lines and labels
  const axisLines = AXES.map((axis, i) => {
    const angle = i * angleStep
    const end = polarToCart(angle, maxR, cx, cy)
    const labelPt = polarToCart(angle, maxR + 18, cx, cy)

    return (
      <g key={`axis-${i}`}>
        <line
          x1={cx}
          y1={cy}
          x2={end.x}
          y2={end.y}
          stroke="rgba(67, 79, 88, 0.3)"
          strokeWidth="1"
        />
        <text
          x={labelPt.x}
          y={labelPt.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-galactic"
          fontSize="9"
          fontWeight="500"
        >
          {axis.label}
        </text>
      </g>
    )
  })

  // Generate data polygons
  const dataPolygons = allScores.map((scores, bIdx) => {
    const color = COLORS[bIdx] || COLORS[0]
    const points = AXES.map((axis, i) => {
      const val = scores[axis.key] || 0
      const r = (val / 100) * maxR
      const pt = polarToCart(i * angleStep, r, cx, cy)
      return `${pt.x},${pt.y}`
    }).join(' ')

    const dots = AXES.map((axis, i) => {
      const val = scores[axis.key] || 0
      const r = (val / 100) * maxR
      const pt = polarToCart(i * angleStep, r, cx, cy)
      return (
        <circle
          key={`dot-${bIdx}-${i}`}
          cx={pt.x}
          cy={pt.y}
          r="3"
          fill={color.stroke}
          stroke="white"
          strokeWidth="1"
        />
      )
    })

    return (
      <g key={`data-${bIdx}`}>
        <polygon
          points={points}
          fill={color.fill}
          stroke={color.stroke}
          strokeWidth="2"
        />
        {dots}
      </g>
    )
  })

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-lg mb-4">Competitive Radar</h3>

      <div className="flex justify-center">
        <svg
          viewBox="0 0 300 300"
          className="w-full max-w-[320px]"
          aria-label="Radar chart comparing businesses across 6 dimensions"
        >
          {rings}
          {axisLines}
          {dataPolygons}

          {/* Level labels */}
          {[1, 2, 3, 4].map(i => {
            const r = (maxR / levels) * i
            const val = Math.round((i / levels) * 100)
            return (
              <text
                key={`level-${i}`}
                x={cx + 4}
                y={cy - r + 3}
                fontSize="7"
                className="fill-galactic"
              >
                {val}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {businesses.filter(b => b && b.name).map((b, i) => {
          const color = COLORS[i] || COLORS[0]
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color.stroke }}
              />
              <span className="text-cloudy">{b.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
