import { BENCHMARKS } from './benchmarkData'

export default function BenchmarkDisplay({ industry, myBusiness }) {
  const bench = BENCHMARKS[industry]
  if (!bench) return null

  const myReviews = parseFloat(myBusiness.googleReviewCount) || 0
  const myRating = parseFloat(myBusiness.googleRating) || 0
  const myPhotos = parseFloat(myBusiness.gbpPhotoCount) || 0

  const metrics = [
    {
      label: 'Google Reviews',
      yours: myReviews,
      competitive: bench.reviewCount,
      strong: bench.reviewCountStrong,
      format: v => v.toString(),
    },
    {
      label: 'Google Rating',
      yours: myRating,
      competitive: bench.rating,
      strong: bench.ratingStrong,
      format: v => v.toFixed(1),
    },
    {
      label: 'GBP Photos',
      yours: myPhotos,
      competitive: bench.gbpPhotos,
      strong: bench.gbpPhotosStrong,
      format: v => v.toString(),
    },
  ]

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-lg mb-1">Industry Benchmarks</h3>
      <p className="text-galactic text-sm mb-5">
        What "competitive" looks like for a {bench.label}
      </p>

      <div className="space-y-5">
        {metrics.map(metric => {
          const maxVal = metric.strong * 1.2
          const yoursPercent = Math.min(100, (metric.yours / maxVal) * 100)
          const compPercent = Math.min(100, (metric.competitive / maxVal) * 100)
          const strongPercent = Math.min(100, (metric.strong / maxVal) * 100)

          let status = 'below'
          if (metric.yours >= metric.strong) status = 'strong'
          else if (metric.yours >= metric.competitive) status = 'competitive'

          const statusLabel = {
            below: { text: 'Below Benchmark', color: 'text-coral' },
            competitive: { text: 'Competitive', color: 'text-tangerine' },
            strong: { text: 'Strong', color: 'text-turtle' },
          }

          return (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-cloudy font-medium">{metric.label}</span>
                <span className={`text-xs font-medium ${statusLabel[status].color}`}>
                  {statusLabel[status].text}
                </span>
              </div>

              {/* Progress bar with benchmarks */}
              <div className="relative h-6 bg-metal/20 rounded-full overflow-visible">
                {/* Your bar */}
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                    status === 'strong' ? 'bg-turtle/60' : status === 'competitive' ? 'bg-tangerine/60' : 'bg-coral/60'
                  }`}
                  style={{ width: `${yoursPercent}%` }}
                />

                {/* Competitive benchmark marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-tangerine/80"
                  style={{ left: `${compPercent}%` }}
                  title={`Competitive: ${metric.format(metric.competitive)}`}
                />

                {/* Strong benchmark marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-turtle/80"
                  style={{ left: `${strongPercent}%` }}
                  title={`Strong: ${metric.format(metric.strong)}`}
                />

                {/* Your value label */}
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                  You: {metric.format(metric.yours)}
                </span>
              </div>

              {/* Benchmark labels */}
              <div className="flex justify-between mt-1 text-[11px] sm:text-xs">
                <span className="text-galactic">0</span>
                <div className="flex gap-2 sm:gap-3">
                  <span className="text-tangerine">
                    Competitive: {metric.format(metric.competitive)}
                  </span>
                  <span className="text-turtle">
                    Strong: {metric.format(metric.strong)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
