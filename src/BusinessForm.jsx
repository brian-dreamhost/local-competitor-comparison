import { useState } from 'react'
import { FIELD_TOOLTIPS } from './benchmarkData'

function Tooltip({ text }) {
  const [show, setShow] = useState(false)

  return (
    <span className="relative inline-block ml-1.5">
      <button
        type="button"
        className="w-5 h-5 rounded-full bg-metal/30 text-galactic text-xs font-bold hover:bg-metal/50 hover:text-cloudy transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-1 focus:ring-offset-abyss inline-flex items-center justify-center"
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        aria-label="More info"
      >
        ?
      </button>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-[calc(100vw-3rem)] p-3 bg-midnight border border-metal/30 rounded-lg text-xs text-cloudy shadow-lg">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-midnight border-r border-b border-metal/30 transform rotate-45 -mt-1" />
        </div>
      )}
    </span>
  )
}

function FormField({ label, tooltipKey, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-cloudy mb-1.5">
        {label}
        {tooltipKey && FIELD_TOOLTIPS[tooltipKey] && (
          <Tooltip text={FIELD_TOOLTIPS[tooltipKey]} />
        )}
      </label>
      {children}
    </div>
  )
}

const inputClasses = 'w-full bg-abyss border border-metal/30 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors'
const selectClasses = 'w-full bg-abyss border border-metal/30 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors appearance-none cursor-pointer'

export default function BusinessForm({ business, onChange, isYourBusiness, industry }) {
  const update = (key, value) => {
    onChange({ ...business, [key]: value })
  }

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Business Name */}
      <FormField label={isYourBusiness ? 'Your Business Name' : 'Competitor Business Name'}>
        <input
          type="text"
          className={inputClasses}
          placeholder={isYourBusiness ? 'e.g., Joe\'s Plumbing' : 'e.g., City Plumbing Pros'}
          value={business.name}
          onChange={e => update('name', e.target.value)}
        />
      </FormField>

      {/* Google Presence Section */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          Google Presence
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Google Review Count" tooltipKey="googleReviewCount">
            <input
              type="number"
              min="0"
              className={inputClasses}
              placeholder="e.g., 47"
              value={business.googleReviewCount}
              onChange={e => update('googleReviewCount', e.target.value)}
            />
          </FormField>

          <FormField label="Google Average Rating" tooltipKey="googleRating">
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              className={inputClasses}
              placeholder="e.g., 4.5"
              value={business.googleRating}
              onChange={e => update('googleRating', e.target.value)}
            />
          </FormField>

          <FormField label="Responds to Reviews?" tooltipKey="respondsToReviews">
            <select
              className={selectClasses}
              value={business.respondsToReviews}
              onChange={e => update('respondsToReviews', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="sometimes">Sometimes</option>
              <option value="no">No</option>
            </select>
          </FormField>

          <FormField label="Number of GBP Photos" tooltipKey="gbpPhotoCount">
            <input
              type="number"
              min="0"
              className={inputClasses}
              placeholder="e.g., 25"
              value={business.gbpPhotoCount}
              onChange={e => update('gbpPhotoCount', e.target.value)}
            />
          </FormField>

          <FormField label="GBP Posts in Last 30 Days?" tooltipKey="gbpPostsRecent">
            <select
              className={selectClasses}
              value={business.gbpPostsRecent}
              onChange={e => update('gbpPostsRecent', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FormField>

          <FormField label="Primary Business Category" tooltipKey="primaryCategory">
            <input
              type="text"
              className={inputClasses}
              placeholder={`e.g., ${industry || 'Plumber'}`}
              value={business.primaryCategory}
              onChange={e => update('primaryCategory', e.target.value)}
            />
          </FormField>

          <FormField label="Has Website?" tooltipKey="hasWebsite">
            <select
              className={selectClasses}
              value={business.hasWebsite}
              onChange={e => update('hasWebsite', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Online Presence Section */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          Online Presence
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {business.hasWebsite === 'yes' && (
            <FormField label="Website Uses HTTPS?" tooltipKey="hasHttps">
              <select
                className={selectClasses}
                value={business.hasHttps}
                onChange={e => update('hasHttps', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </FormField>
          )}

          <FormField label="Listed on Yelp?" tooltipKey="onYelp">
            <select
              className={selectClasses}
              value={business.onYelp}
              onChange={e => update('onYelp', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FormField>

          {business.onYelp === 'yes' && (
            <>
              <FormField label="Yelp Rating" tooltipKey="yelpRating">
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  className={inputClasses}
                  placeholder="e.g., 4.0"
                  value={business.yelpRating}
                  onChange={e => update('yelpRating', e.target.value)}
                />
              </FormField>
              <FormField label="Yelp Review Count" tooltipKey="yelpReviewCount">
                <input
                  type="number"
                  min="0"
                  className={inputClasses}
                  placeholder="e.g., 23"
                  value={business.yelpReviewCount}
                  onChange={e => update('yelpReviewCount', e.target.value)}
                />
              </FormField>
            </>
          )}

          <FormField label="Listed on Facebook?" tooltipKey="onFacebook">
            <select
              className={selectClasses}
              value={business.onFacebook}
              onChange={e => update('onFacebook', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FormField>

          {business.onFacebook === 'yes' && (
            <>
              <FormField label="Facebook Rating" tooltipKey="facebookRating">
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  className={inputClasses}
                  placeholder="e.g., 4.2"
                  value={business.facebookRating}
                  onChange={e => update('facebookRating', e.target.value)}
                />
              </FormField>
              <FormField label="Facebook Review Count" tooltipKey="facebookReviewCount">
                <input
                  type="number"
                  min="0"
                  className={inputClasses}
                  placeholder="e.g., 15"
                  value={business.facebookReviewCount}
                  onChange={e => update('facebookReviewCount', e.target.value)}
                />
              </FormField>
            </>
          )}

          <FormField label="Active Social Media Profiles" tooltipKey="socialMediaPresence">
            <select
              className={selectClasses}
              value={business.socialMediaPresence}
              onChange={e => update('socialMediaPresence', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="none">None</option>
              <option value="1">1 Platform</option>
              <option value="2-3">2-3 Platforms</option>
              <option value="4+">4+ Platforms</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Business Details Section */}
      <div>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
          </svg>
          Business Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Years in Business" tooltipKey="yearsInBusiness">
            <input
              type="number"
              min="0"
              className={inputClasses}
              placeholder="e.g., 5"
              value={business.yearsInBusiness}
              onChange={e => update('yearsInBusiness', e.target.value)}
            />
          </FormField>

          <FormField label="Number of Services Listed" tooltipKey="servicesListed">
            <input
              type="number"
              min="0"
              className={inputClasses}
              placeholder="e.g., 8"
              value={business.servicesListed}
              onChange={e => update('servicesListed', e.target.value)}
            />
          </FormField>

          <FormField label="Offers Online Booking?" tooltipKey="onlineBooking">
            <select
              className={selectClasses}
              value={business.onlineBooking}
              onChange={e => update('onlineBooking', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </FormField>

          {business.hasWebsite === 'yes' && (
            <FormField label="Team Photos on Website?" tooltipKey="teamPhotos">
              <select
                className={selectClasses}
                value={business.teamPhotos}
                onChange={e => update('teamPhotos', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </FormField>
          )}
        </div>
      </div>
    </div>
  )
}
