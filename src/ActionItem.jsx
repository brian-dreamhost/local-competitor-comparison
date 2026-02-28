import { useState } from 'react'

const impactColors = {
  High: 'border-coral text-coral',
  Medium: 'border-tangerine text-tangerine',
  Low: 'border-galactic text-galactic',
}

const difficultyColors = {
  Easy: 'text-turtle',
  Medium: 'text-tangerine',
  Hard: 'text-coral',
}

export default function ActionItem({ action, index }) {
  const [expanded, setExpanded] = useState(index < 3)

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden">
      <button
        className="w-full text-left px-4 sm:px-6 py-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-inset"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {/* Priority number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-azure/20 text-azure font-bold text-sm flex items-center justify-center mt-0.5">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="text-white font-semibold text-sm sm:text-base">{action.title}</h4>
            <span className={`text-[10px] font-semibold uppercase tracking-wider border rounded-full px-2 py-0.5 ${impactColors[action.impact]}`}>
              {action.impact} Impact
            </span>
          </div>
          <p className="text-galactic text-xs sm:text-sm">{action.gap}</p>
        </div>

        <svg
          className={`w-5 h-5 text-galactic flex-shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 sm:px-6 pb-5 pt-0 animate-fadeIn">
          <div className="ml-0 sm:ml-11 space-y-3">
            {/* Benchmark */}
            <div className="bg-midnight/50 border border-metal/20 rounded-lg p-3">
              <p className="text-xs text-galactic mb-0.5 font-medium uppercase tracking-wider">Benchmark</p>
              <p className="text-sm text-cloudy">{action.benchmark}</p>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-galactic">Difficulty:</span>
              <span className={`font-medium ${difficultyColors[action.difficulty]}`}>
                {action.difficulty}
              </span>
            </div>

            {/* Steps */}
            <div>
              <p className="text-xs text-galactic mb-2 font-medium uppercase tracking-wider">Action Steps</p>
              <ol className="space-y-1.5">
                {action.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-cloudy">
                    <span className="text-azure font-medium flex-shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
