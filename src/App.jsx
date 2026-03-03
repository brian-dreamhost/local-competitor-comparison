import { useState, useEffect, useCallback } from 'react'
import WizardProgress from './WizardProgress'
import BusinessForm from './BusinessForm'
import ComparisonDashboard from './ComparisonDashboard'
import { INDUSTRIES, EMPTY_BUSINESS } from './benchmarkData'

const STORAGE_KEY = 'local-competitor-comparison-data'

function loadSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // Ignore parse errors
  }
  return null
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}

export default function App() {
  const saved = loadSavedData()

  const [step, setStep] = useState(saved ? saved.step : 0)
  const [industry, setIndustry] = useState(saved?.industry || '')
  const [location, setLocation] = useState(saved?.location || '')
  const [myBusiness, setMyBusiness] = useState(saved?.myBusiness || { ...EMPTY_BUSINESS })
  const [competitor1, setCompetitor1] = useState(saved?.competitor1 || { ...EMPTY_BUSINESS })
  const [competitor2, setCompetitor2] = useState(saved?.competitor2 || null)
  const [showComp2, setShowComp2] = useState(saved?.showComp2 || false)
  const [showDashboard, setShowDashboard] = useState(saved?.showDashboard || false)

  // Auto-save on changes
  useEffect(() => {
    saveData({ step, industry, location, myBusiness, competitor1, competitor2, showComp2, showDashboard })
  }, [step, industry, location, myBusiness, competitor1, competitor2, showComp2, showDashboard])

  const stepLabels = showComp2
    ? ['Your Business', 'Competitor 1', 'Competitor 2', 'View Analysis']
    : ['Your Business', 'Competitor 1', 'View Analysis']

  const totalSteps = showComp2 ? 4 : 3

  const canProceed = useCallback(() => {
    if (step === 0) {
      return myBusiness.name.trim() && industry && location.trim()
    }
    if (step === 1) {
      return competitor1.name.trim()
    }
    if (step === 2 && showComp2) {
      return !competitor2 || competitor2.name.trim()
    }
    return true
  }, [step, myBusiness.name, industry, location, competitor1.name, showComp2, competitor2])

  const handleNext = () => {
    if (!canProceed()) return

    const lastInputStep = showComp2 ? 2 : 1
    if (step === lastInputStep) {
      setShowDashboard(true)
      setStep(step + 1)
    } else {
      setStep(step + 1)
    }
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    if (step > 0) {
      if (showDashboard) setShowDashboard(false)
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const fillTestData = () => {
    setIndustry('Plumber')
    setLocation('Portland, OR')
    setMyBusiness({
      name: 'Evergreen Plumbing & Heating',
      googleReviewCount: '127',
      googleRating: '4.7',
      respondsToReviews: 'yes',
      gbpPhotoCount: '24',
      gbpPostsRecent: 'yes',
      primaryCategory: 'Plumber',
      hasWebsite: 'yes',
      hasHttps: 'yes',
      onYelp: 'yes',
      yelpRating: '4.5',
      yelpReviewCount: '43',
      onFacebook: 'yes',
      facebookRating: '4.8',
      facebookReviewCount: '31',
      socialMediaPresence: '3',
      yearsInBusiness: '16',
      servicesListed: '12',
      onlineBooking: 'yes',
      teamPhotos: 'yes',
    })
    setCompetitor1({
      name: 'Rose City Plumbing',
      googleReviewCount: '89',
      googleRating: '4.4',
      respondsToReviews: 'some',
      gbpPhotoCount: '11',
      gbpPostsRecent: 'no',
      primaryCategory: 'Plumber',
      hasWebsite: 'yes',
      hasHttps: 'yes',
      onYelp: 'yes',
      yelpRating: '4.0',
      yelpReviewCount: '28',
      onFacebook: 'yes',
      facebookRating: '4.2',
      facebookReviewCount: '15',
      socialMediaPresence: '2',
      yearsInBusiness: '8',
      servicesListed: '7',
      onlineBooking: 'no',
      teamPhotos: 'no',
    })
    setCompetitor2(null)
    setShowComp2(false)
    setShowDashboard(false)
    setStep(0)
  }

  const handleStartOver = () => {
    setStep(0)
    setIndustry('')
    setLocation('')
    setMyBusiness({ ...EMPTY_BUSINESS })
    setCompetitor1({ ...EMPTY_BUSINESS })
    setCompetitor2(null)
    setShowComp2(false)
    setShowDashboard(false)
    localStorage.removeItem(STORAGE_KEY)
    window.scrollTo(0, 0)
  }

  const handleEditStep = (targetStep) => {
    setShowDashboard(false)
    setStep(targetStep)
    window.scrollTo(0, 0)
  }

  const addCompetitor2 = () => {
    setShowComp2(true)
    setCompetitor2({ ...EMPTY_BUSINESS })
  }

  const removeCompetitor2 = () => {
    setShowComp2(false)
    setCompetitor2(null)
    // If we were on comp2 step, go back
    if (step === 2) setStep(1)
  }

  const renderStepContent = () => {
    // Dashboard view
    if (showDashboard) {
      const comps = [competitor1]
      if (showComp2 && competitor2) comps.push(competitor2)
      return (
        <ComparisonDashboard
          myBusiness={myBusiness}
          competitors={comps}
          industry={industry}
          location={location}
          onStartOver={handleStartOver}
          onEditStep={handleEditStep}
        />
      )
    }

    // Step 0: Your Business
    if (step === 0) {
      return (
        <div className="animate-fadeIn">
          <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-bold text-white mb-1">Your Business</h2>
            <p className="text-galactic text-sm mb-6">
              Start by telling us about your business and filling in the metrics you can find on Google.
            </p>

            {/* Industry + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-cloudy mb-1.5">
                  Industry <span className="text-coral">*</span>
                </label>
                <select
                  className="w-full bg-abyss border border-metal/30 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors appearance-none cursor-pointer"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                >
                  <option value="">Select your industry...</option>
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-cloudy mb-1.5">
                  City / Location <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-abyss border border-metal/30 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors"
                  placeholder="e.g., Austin, TX"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>

            <BusinessForm
              business={myBusiness}
              onChange={setMyBusiness}
              isYourBusiness={true}
              industry={industry}
            />
          </div>
        </div>
      )
    }

    // Step 1: Competitor 1
    if (step === 1) {
      return (
        <div className="animate-fadeIn">
          <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-bold text-white mb-1">Competitor 1</h2>
            <p className="text-galactic text-sm mb-6">
              Search for this competitor on Google Maps and their website to fill in the details below.
              Look for the <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-metal/30 text-galactic text-[10px] font-bold mx-0.5">?</span> tooltips for tips on finding each metric.
            </p>

            <BusinessForm
              business={competitor1}
              onChange={setCompetitor1}
              isYourBusiness={false}
              industry={industry}
            />
          </div>
        </div>
      )
    }

    // Step 2: Competitor 2 (only if showComp2)
    if (step === 2 && showComp2) {
      return (
        <div className="animate-fadeIn">
          <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-white">Competitor 2</h2>
              <button
                onClick={removeCompetitor2}
                className="text-sm text-coral hover:text-white transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Remove
              </button>
            </div>
            <p className="text-galactic text-sm mb-6">
              Add a second competitor for a more complete comparison.
            </p>

            <BusinessForm
              business={competitor2 || { ...EMPTY_BUSINESS }}
              onChange={setCompetitor2}
              isYourBusiness={false}
              industry={industry}
            />
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="bg-abyss min-h-screen bg-glow bg-grid">
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-galactic">
          <a href="https://seo-tools-tau.vercel.app/" className="text-azure hover:text-white transition-colors">Free Tools</a>
          <span className="mx-2 text-metal">/</span>
          <a href="https://seo-tools-tau.vercel.app/local-business/" className="text-azure hover:text-white transition-colors">Local Business Tools</a>
          <span className="mx-2 text-metal">/</span>
          <span className="text-cloudy">Local Competitor Comparison</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-azure/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Local Competitor Comparison</h1>
          </div>
          <p className="text-cloudy text-sm sm:text-base max-w-2xl">
            Compare your local business against competitors with a guided analysis. Get industry benchmarks, a scored comparison, and a prioritized action plan to close competitive gaps.
          </p>
        </div>

        {/* Fill Test Data */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={fillTestData}
            className="px-3 py-1.5 text-xs font-mono bg-prince/20 text-prince border border-prince/30 rounded hover:bg-prince/30 transition-colors focus:outline-none focus:ring-2 focus:ring-prince focus:ring-offset-2 focus:ring-offset-abyss"
          >
            Fill Test Data
          </button>
        </div>

        {/* Wizard Progress */}
        {!showDashboard && (
          <WizardProgress
            currentStep={step}
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />
        )}

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        {!showDashboard && (
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 border border-metal/30 text-cloudy rounded-lg px-5 py-2.5 text-sm font-medium hover:border-metal/50 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Back
                </button>
              )}

              {step === 0 && saved && (
                <button
                  onClick={handleStartOver}
                  className="text-sm text-galactic hover:text-white transition-colors px-3 py-2.5"
                >
                  Clear Saved Data
                </button>
              )}
            </div>

            <div className="flex gap-3 sm:ml-auto">
              {/* Add Competitor 2 button (on step 1, when comp2 not yet added) */}
              {step === 1 && !showComp2 && competitor1.name.trim() && (
                <button
                  onClick={addCompetitor2}
                  className="inline-flex items-center gap-2 border border-metal/30 text-cloudy rounded-lg px-4 py-2.5 text-sm font-medium hover:border-metal/50 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Another Competitor
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss ${
                  canProceed()
                    ? 'bg-azure text-white hover:bg-azure-hover'
                    : 'bg-metal/30 text-galactic cursor-not-allowed'
                }`}
              >
                {(step === 1 && !showComp2) || (step === 2 && showComp2) ? (
                  <>
                    View Analysis
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </>
                ) : (
                  <>
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-metal/30 text-center">
          <p className="text-galactic text-sm">
            Built by{' '}
            <a href="https://www.dreamhost.com" className="text-azure hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              DreamHost
            </a>
            . Data entered stays in your browser and is never sent to any server.
          </p>
        </footer>
      </div>
    </div>
  )
}
