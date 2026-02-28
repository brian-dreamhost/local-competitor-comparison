export default function WizardProgress({ currentStep, totalSteps, stepLabels }) {
  const percent = ((currentStep) / (totalSteps - 1)) * 100

  return (
    <div className="mb-8">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-3">
        {stepLabels.map((label, i) => {
          const isActive = i === currentStep
          const isCompleted = i < currentStep
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-200
                  ${isCompleted
                    ? 'bg-azure text-white'
                    : isActive
                      ? 'bg-azure text-white ring-2 ring-azure ring-offset-2 ring-offset-abyss'
                      : 'bg-metal/30 text-galactic'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs mt-1.5 text-center hidden sm:block ${isActive ? 'text-white font-medium' : 'text-galactic'}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-metal/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-azure rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Mobile step label */}
      <p className="text-sm text-galactic mt-2 sm:hidden text-center">
        Step {currentStep + 1} of {totalSteps}: {stepLabels[currentStep]}
      </p>
    </div>
  )
}
