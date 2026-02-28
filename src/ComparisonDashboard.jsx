import ComparisonTable from './ComparisonTable'
import RadarChart from './RadarChart'
import BenchmarkDisplay from './BenchmarkDisplay'
import ActionPlan from './ActionPlan'
import ExportButtons from './ExportButtons'
import { generateActionPlan } from './scoringEngine'

export default function ComparisonDashboard({ myBusiness, competitors, industry, location, onStartOver, onEditStep }) {
  const actions = generateActionPlan(myBusiness, competitors, industry)
  const allBusinesses = [myBusiness, ...competitors.filter(c => c && c.name)]

  // Count wins, losses, ties
  const compsList = competitors.filter(c => c && c.name)

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Competitive Analysis
          </h2>
          <p className="text-cloudy mt-1">
            {myBusiness.name} vs. {compsList.map(c => c.name).join(' & ')} in {location}
          </p>
        </div>

        <div className="flex gap-2 no-print">
          <button
            onClick={() => onEditStep(0)}
            className="text-sm text-azure hover:text-white transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit Data
          </button>
          <button
            onClick={onStartOver}
            className="text-sm text-galactic hover:text-white transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Start Over
          </button>
        </div>
      </div>

      {/* Export buttons */}
      <ExportButtons
        myBusiness={myBusiness}
        competitors={competitors}
        industry={industry}
        location={location}
        actions={actions}
      />

      {/* Radar Chart + Benchmarks (2 column on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadarChart businesses={allBusinesses} industry={industry} />
        <BenchmarkDisplay industry={industry} myBusiness={myBusiness} />
      </div>

      {/* Comparison Table */}
      <ComparisonTable
        myBusiness={myBusiness}
        competitors={competitors}
        industry={industry}
      />

      {/* Action Plan */}
      <ActionPlan actions={actions} />

      {/* Bottom export */}
      <div className="pt-4">
        <ExportButtons
          myBusiness={myBusiness}
          competitors={competitors}
          industry={industry}
          location={location}
          actions={actions}
        />
      </div>
    </div>
  )
}
