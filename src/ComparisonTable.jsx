import { getComparisonMetrics, getCellStatus, formatDisplayValue } from './scoringEngine'

export default function ComparisonTable({ myBusiness, competitors, industry }) {
  const metrics = getComparisonMetrics()
  const compsList = competitors.filter(c => c && c.name)

  // Group metrics
  const groups = {}
  metrics.forEach(m => {
    if (!groups[m.group]) groups[m.group] = []
    groups[m.group].push(m)
  })

  const statusColors = {
    winning: 'border-l-turtle bg-turtle/5',
    competitive: 'border-l-tangerine/50 bg-tangerine/5',
    losing: 'border-l-coral bg-coral/5',
  }

  const statusIcons = {
    winning: (
      <svg className="w-4 h-4 text-turtle inline-block" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
    losing: (
      <svg className="w-4 h-4 text-coral inline-block" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    competitive: (
      <svg className="w-4 h-4 text-tangerine inline-block" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
    ),
  }

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-lg mb-4">Side-by-Side Comparison</h3>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-cloudy">
        <span className="flex items-center gap-1.5">
          {statusIcons.winning} <span>Winning</span>
        </span>
        <span className="flex items-center gap-1.5">
          {statusIcons.competitive} <span>Competitive</span>
        </span>
        <span className="flex items-center gap-1.5">
          {statusIcons.losing} <span>Needs Work</span>
        </span>
      </div>

      <p className="text-xs text-galactic mb-2 sm:hidden">Scroll sideways to see all columns</p>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[500px] px-4 sm:px-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-metal/30">
                <th className="text-left text-galactic font-medium py-3 pr-3 w-[180px]">Metric</th>
                <th className="text-center text-azure font-semibold py-3 px-2">
                  {myBusiness.name || 'Your Business'}
                </th>
                {compsList.map((comp, i) => (
                  <th key={i} className="text-center text-cloudy font-medium py-3 px-2">
                    {comp.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(groups).map(([groupName, groupMetrics]) => (
                <GroupSection
                  key={groupName}
                  groupName={groupName}
                  metrics={groupMetrics}
                  myBusiness={myBusiness}
                  competitors={compsList}
                  industry={industry}
                  statusColors={statusColors}
                  statusIcons={statusIcons}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function GroupSection({ groupName, metrics, myBusiness, competitors, industry, statusColors, statusIcons }) {
  return (
    <>
      <tr>
        <td colSpan={2 + competitors.length} className="pt-4 pb-2">
          <span className="text-xs font-semibold text-galactic uppercase tracking-wider">
            {groupName}
          </span>
        </td>
      </tr>
      {metrics.map(metric => {
        const myVal = myBusiness[metric.key]
        const compVals = competitors.map(c => c[metric.key])
        const myStatus = getCellStatus(metric.key, myVal, compVals, industry)

        // Skip conditional fields that don't apply
        if (metric.key === 'hasHttps' && myBusiness.hasWebsite !== 'yes' && !competitors.some(c => c.hasWebsite === 'yes')) return null
        if (metric.key === 'yelpRating' && myBusiness.onYelp !== 'yes' && !competitors.some(c => c.onYelp === 'yes')) return null
        if (metric.key === 'yelpReviewCount' && myBusiness.onYelp !== 'yes' && !competitors.some(c => c.onYelp === 'yes')) return null
        if (metric.key === 'facebookRating' && myBusiness.onFacebook !== 'yes' && !competitors.some(c => c.onFacebook === 'yes')) return null
        if (metric.key === 'facebookReviewCount' && myBusiness.onFacebook !== 'yes' && !competitors.some(c => c.onFacebook === 'yes')) return null
        if (metric.key === 'teamPhotos' && myBusiness.hasWebsite !== 'yes' && !competitors.some(c => c.hasWebsite === 'yes')) return null

        return (
          <tr key={metric.key} className="border-b border-metal/10">
            <td className="text-cloudy py-2.5 pr-3">{metric.label}</td>
            <td className={`text-center py-2.5 px-2 border-l-2 ${statusColors[myStatus]}`}>
              <span className="flex items-center justify-center gap-1.5">
                {statusIcons[myStatus]}
                <span className="text-white">{formatDisplayValue(metric.key, myVal)}</span>
              </span>
            </td>
            {competitors.map((comp, i) => {
              const compVal = comp[metric.key]
              return (
                <td key={i} className="text-center text-cloudy py-2.5 px-2">
                  {formatDisplayValue(metric.key, compVal)}
                </td>
              )
            })}
          </tr>
        )
      })}
    </>
  )
}
