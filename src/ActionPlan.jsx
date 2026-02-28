import ActionItem from './ActionItem'

export default function ActionPlan({ actions }) {
  if (!actions || actions.length === 0) {
    return (
      <div className="card-gradient border border-metal/20 rounded-2xl p-6 text-center">
        <div className="text-turtle mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg mb-1">Looking Great!</h3>
        <p className="text-cloudy text-sm">
          No major gaps found. You are competitive or ahead on all measured metrics. Keep up the great work!
        </p>
      </div>
    )
  }

  // Count by impact
  const highCount = actions.filter(a => a.impact === 'High').length
  const medCount = actions.filter(a => a.impact === 'Medium').length
  const lowCount = actions.filter(a => a.impact === 'Low').length

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h3 className="text-white font-bold text-lg">Prioritized Action Plan</h3>
          <p className="text-galactic text-sm">
            {actions.length} action{actions.length !== 1 ? 's' : ''} to close competitive gaps, ranked by impact
          </p>
        </div>

        <div className="flex gap-2">
          {highCount > 0 && (
            <span className="text-xs border border-coral text-coral rounded-full px-2.5 py-1 font-medium">
              {highCount} High Impact
            </span>
          )}
          {medCount > 0 && (
            <span className="text-xs border border-tangerine text-tangerine rounded-full px-2.5 py-1 font-medium">
              {medCount} Medium
            </span>
          )}
          {lowCount > 0 && (
            <span className="text-xs border border-galactic text-galactic rounded-full px-2.5 py-1 font-medium">
              {lowCount} Low
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {actions.map((action, i) => (
          <ActionItem key={i} action={action} index={i} />
        ))}
      </div>
    </div>
  )
}
