import { BENCHMARKS } from './benchmarkData'

// Scoring weights for local SEO ranking factors
const WEIGHTS = {
  googleReviewCount: 10,
  googleRating: 9,
  respondsToReviews: 7,
  gbpPhotoCount: 6,
  gbpPostsRecent: 5,
  hasWebsite: 8,
  hasHttps: 4,
  onYelp: 3,
  yelpRating: 2,
  yelpReviewCount: 2,
  onFacebook: 3,
  facebookRating: 2,
  facebookReviewCount: 2,
  socialMediaPresence: 4,
  yearsInBusiness: 3,
  servicesListed: 4,
  onlineBooking: 5,
  teamPhotos: 3,
}

// Convert form values to normalized 0-100 scores for radar chart
export function computeRadarScores(business, industry) {
  const bench = BENCHMARKS[industry]
  if (!bench) return { reviews: 0, rating: 0, onlinePresence: 0, contentActivity: 0, websiteQuality: 0, businessMaturity: 0 }

  const rc = parseFloat(business.googleReviewCount) || 0
  const rat = parseFloat(business.googleRating) || 0
  const photos = parseFloat(business.gbpPhotoCount) || 0

  // Reviews: Google review count normalized against strong benchmark
  const reviews = Math.min(100, (rc / bench.reviewCountStrong) * 100)

  // Rating: map 1-5 to 0-100, weighted toward the benchmark
  const rating = rat > 0 ? Math.min(100, ((rat - 1) / (5 - 1)) * 100) : 0

  // Online Presence: composite of Yelp, Facebook, social media
  let onlineScore = 0
  if (business.onYelp === 'yes') onlineScore += 25
  if (business.onFacebook === 'yes') onlineScore += 25
  const socialMap = { 'none': 0, '1': 15, '2-3': 35, '4+': 50 }
  onlineScore += socialMap[business.socialMediaPresence] || 0
  const onlinePresence = Math.min(100, onlineScore)

  // Content Activity: GBP photos + posts + review responses
  let contentScore = 0
  contentScore += Math.min(40, (photos / bench.gbpPhotosStrong) * 40)
  if (business.gbpPostsRecent === 'yes') contentScore += 30
  if (business.respondsToReviews === 'yes') contentScore += 30
  else if (business.respondsToReviews === 'sometimes') contentScore += 15
  const contentActivity = Math.min(100, contentScore)

  // Website Quality: has website + HTTPS + online booking + team photos
  let webScore = 0
  if (business.hasWebsite === 'yes') webScore += 35
  if (business.hasHttps === 'yes') webScore += 20
  if (business.onlineBooking === 'yes') webScore += 25
  if (business.teamPhotos === 'yes') webScore += 20
  const websiteQuality = Math.min(100, webScore)

  // Business Maturity: years in business + services listed
  const years = parseFloat(business.yearsInBusiness) || 0
  const services = parseFloat(business.servicesListed) || 0
  let maturityScore = 0
  maturityScore += Math.min(50, (years / 10) * 50) // 10+ years = max
  maturityScore += Math.min(50, (services / 15) * 50) // 15+ services = max
  const businessMaturity = Math.min(100, maturityScore)

  return { reviews, rating, onlinePresence, contentActivity, websiteQuality, businessMaturity }
}

// Determine cell status for comparison table: 'winning', 'competitive', 'losing'
export function getCellStatus(metricKey, myValue, competitorValues, _industry) {
  // For boolean/select fields
  const booleanFields = ['respondsToReviews', 'gbpPostsRecent', 'hasWebsite', 'hasHttps', 'onYelp', 'onFacebook', 'onlineBooking', 'teamPhotos']
  const selectFields = ['socialMediaPresence']

  if (booleanFields.includes(metricKey)) {
    const positiveValues = ['yes']
    const myIsPositive = positiveValues.includes(myValue)
    const anyCompPositive = competitorValues.some(v => positiveValues.includes(v))

    if (metricKey === 'respondsToReviews') {
      const order = { 'yes': 3, 'sometimes': 2, 'no': 1, '': 0 }
      const myRank = order[myValue] || 0
      const maxCompRank = Math.max(...competitorValues.map(v => order[v] || 0))
      if (myRank > maxCompRank) return 'winning'
      if (myRank === maxCompRank) return 'competitive'
      return 'losing'
    }

    if (myIsPositive && !anyCompPositive) return 'winning'
    if (myIsPositive && anyCompPositive) return 'competitive'
    if (!myIsPositive && anyCompPositive) return 'losing'
    return 'competitive'
  }

  if (selectFields.includes(metricKey)) {
    const order = { 'none': 0, '1': 1, '2-3': 2, '4+': 3 }
    const myRank = order[myValue] || 0
    const maxCompRank = Math.max(...competitorValues.map(v => order[v] || 0))
    if (myRank > maxCompRank) return 'winning'
    if (myRank === maxCompRank && myRank > 0) return 'competitive'
    if (myRank < maxCompRank) return 'losing'
    return 'competitive'
  }

  // Numeric fields
  const myNum = parseFloat(myValue) || 0
  const compNums = competitorValues.map(v => parseFloat(v) || 0)
  const maxComp = Math.max(...compNums)

  // For ratings, higher is better, but context matters
  if (metricKey === 'googleRating' || metricKey === 'yelpRating' || metricKey === 'facebookRating') {
    if (myNum === 0) return 'losing'
    if (myNum > maxComp + 0.1) return 'winning'
    if (myNum >= maxComp - 0.2) return 'competitive'
    return 'losing'
  }

  // For counts (reviews, photos, etc.)
  if (myNum === 0 && maxComp === 0) return 'competitive'
  if (myNum > maxComp * 1.1) return 'winning'
  if (myNum >= maxComp * 0.7) return 'competitive'
  return 'losing'
}

// Generate prioritized action plan
export function generateActionPlan(myBusiness, competitors, industry) {
  const bench = BENCHMARKS[industry]
  if (!bench) return []

  const actions = []
  const allComps = competitors.filter(c => c && c.name)
  const topCompReviews = Math.max(...allComps.map(c => parseFloat(c.googleReviewCount) || 0), 0)
  const topCompPhotos = Math.max(...allComps.map(c => parseFloat(c.gbpPhotoCount) || 0), 0)

  const myReviews = parseFloat(myBusiness.googleReviewCount) || 0
  const myRating = parseFloat(myBusiness.googleRating) || 0
  const myPhotos = parseFloat(myBusiness.gbpPhotoCount) || 0

  // 1. Google Review Count
  if (myReviews < bench.reviewCount) {
    const compGap = topCompReviews > myReviews ? topCompReviews - myReviews : 0
    actions.push({
      title: 'Get More Google Reviews',
      gap: compGap > 0
        ? `You have ${myReviews} reviews vs. your top competitor's ${topCompReviews}`
        : `You have ${myReviews} reviews, below the competitive benchmark`,
      benchmark: `For a ${bench.label}, ${bench.reviewCount}+ reviews is competitive and ${bench.reviewCountStrong}+ is strong`,
      steps: [
        'Ask every satisfied customer for a review right after service',
        'Send a follow-up text/email with a direct link to your Google review page',
        'Create a short URL or QR code for your review page',
        'Respond to every review (positive and negative) to encourage more',
        'Train your staff to ask for reviews as part of the checkout/follow-up process',
      ],
      impact: 'High',
      difficulty: 'Easy',
      weight: WEIGHTS.googleReviewCount,
      gapSize: Math.max(bench.reviewCount - myReviews, compGap),
    })
  } else if (myReviews < bench.reviewCountStrong) {
    actions.push({
      title: 'Scale Up Your Review Generation',
      gap: `You have ${myReviews} reviews -- competitive, but not yet a leader`,
      benchmark: `For a ${bench.label}, ${bench.reviewCountStrong}+ reviews puts you ahead of most competitors`,
      steps: [
        'Automate review requests with email/text follow-ups after service',
        'Add a review CTA to your email signature and receipts',
        'Consider a review management platform to streamline the process',
      ],
      impact: 'Medium',
      difficulty: 'Easy',
      weight: WEIGHTS.googleReviewCount * 0.6,
      gapSize: bench.reviewCountStrong - myReviews,
    })
  }

  // 2. Google Rating
  if (myRating > 0 && myRating < bench.rating) {
    actions.push({
      title: 'Improve Your Google Rating',
      gap: `Your rating is ${myRating} vs. the competitive benchmark of ${bench.rating}`,
      benchmark: `For a ${bench.label}, a ${bench.rating}+ rating is competitive and ${bench.ratingStrong}+ is strong`,
      steps: [
        'Respond professionally and promptly to all negative reviews',
        'Address recurring complaints mentioned in low-star reviews',
        'Make it easy for happy customers to leave reviews (they often rate higher)',
        'Focus on service quality improvements that address specific feedback',
        'Follow up with unhappy customers to resolve issues (some may update their review)',
      ],
      impact: 'High',
      difficulty: 'Medium',
      weight: WEIGHTS.googleRating,
      gapSize: (bench.rating - myRating) * 20,
    })
  }

  // 3. Review Responses
  if (myBusiness.respondsToReviews !== 'yes') {
    const anyCompResponds = allComps.some(c => c.respondsToReviews === 'yes')
    actions.push({
      title: 'Start Responding to All Google Reviews',
      gap: myBusiness.respondsToReviews === 'sometimes'
        ? 'You respond to some reviews but not consistently'
        : 'You are not responding to Google reviews',
      benchmark: `${anyCompResponds ? 'At least one competitor is actively responding to reviews. ' : ''}Businesses that respond to reviews see 12% more review volume on average`,
      steps: [
        'Set a daily or weekly reminder to check for new reviews',
        'Thank positive reviewers by name and mention their specific feedback',
        'Respond to negative reviews within 24 hours with a professional, empathetic tone',
        'Offer to resolve issues offline (provide a phone number or email)',
        'Keep responses concise but personal -- avoid copy-paste templates',
      ],
      impact: 'High',
      difficulty: 'Easy',
      weight: WEIGHTS.respondsToReviews,
      gapSize: myBusiness.respondsToReviews === 'sometimes' ? 5 : 10,
    })
  }

  // 4. GBP Photos
  if (myPhotos < bench.gbpPhotos) {
    actions.push({
      title: 'Add More Photos to Your Google Business Profile',
      gap: `You have ~${myPhotos} GBP photos${topCompPhotos > myPhotos ? ` vs. your competitor's ~${topCompPhotos}` : ''}`,
      benchmark: `For a ${bench.label}, ${bench.gbpPhotos}+ photos is competitive and ${bench.gbpPhotosStrong}+ is strong`,
      steps: [
        'Upload high-quality photos of your storefront, interior, and team',
        'Add photos of your products, services, or completed work',
        'Include photos with good lighting and professional presentation',
        'Add new photos weekly to keep your profile fresh',
        'Encourage customers to upload their own photos',
      ],
      impact: 'Medium',
      difficulty: 'Easy',
      weight: WEIGHTS.gbpPhotoCount,
      gapSize: bench.gbpPhotos - myPhotos,
    })
  }

  // 5. GBP Posts
  if (myBusiness.gbpPostsRecent !== 'yes') {
    actions.push({
      title: 'Start Posting on Your Google Business Profile',
      gap: 'You have no recent GBP posts in the last 30 days',
      benchmark: 'GBP posts appear in your listing and signal an active business to Google',
      steps: [
        'Post weekly updates about specials, events, or news',
        'Share before/after photos of your work',
        'Promote seasonal offers or limited-time deals',
        'Use GBP posts to highlight positive reviews or testimonials',
        'Include a call-to-action button (Call, Book, Learn More) in every post',
      ],
      impact: 'Medium',
      difficulty: 'Easy',
      weight: WEIGHTS.gbpPostsRecent,
      gapSize: 8,
    })
  }

  // 6. Website
  if (myBusiness.hasWebsite !== 'yes') {
    actions.push({
      title: 'Create a Website for Your Business',
      gap: 'You don\'t have a website listed',
      benchmark: '70% of consumers research a local business online before visiting. A website is essential.',
      steps: [
        'Start with a simple, professional site with your services, contact info, and hours',
        'Include your NAP (Name, Address, Phone) consistently',
        'Add a page for each service you offer for better search visibility',
        'Make sure the site is mobile-friendly -- most local searches happen on phones',
        'Consider a website builder like WordPress, Squarespace, or DreamHost\'s WP Website Builder',
      ],
      impact: 'High',
      difficulty: 'Medium',
      weight: WEIGHTS.hasWebsite,
      gapSize: 15,
    })
  }

  // 7. HTTPS
  if (myBusiness.hasWebsite === 'yes' && myBusiness.hasHttps !== 'yes') {
    actions.push({
      title: 'Enable HTTPS on Your Website',
      gap: 'Your website is not using HTTPS (secure connection)',
      benchmark: 'HTTPS is a Google ranking factor and builds visitor trust. Browsers mark non-HTTPS sites as "Not Secure".',
      steps: [
        'Contact your hosting provider about enabling a free SSL certificate (e.g., Let\'s Encrypt)',
        'Most hosts like DreamHost offer free SSL with one-click activation',
        'After enabling, set up redirects from HTTP to HTTPS',
        'Update your Google Business Profile link to use https://',
      ],
      impact: 'Medium',
      difficulty: 'Easy',
      weight: WEIGHTS.hasHttps,
      gapSize: 6,
    })
  }

  // 8. Yelp Presence
  if (myBusiness.onYelp !== 'yes') {
    const anyCompOnYelp = allComps.some(c => c.onYelp === 'yes')
    if (anyCompOnYelp) {
      actions.push({
        title: 'Claim Your Yelp Business Listing',
        gap: 'You are not listed on Yelp, but at least one competitor is',
        benchmark: 'Yelp is a top-10 local search result for most industries. Not being listed means missing potential customers.',
        steps: [
          'Go to biz.yelp.com and claim or create your free business listing',
          'Complete your profile: hours, services, photos, and description',
          'Don\'t ask for Yelp reviews directly (Yelp penalizes this), but do link to your profile',
          'Respond to any reviews that appear',
        ],
        impact: 'Medium',
        difficulty: 'Easy',
        weight: WEIGHTS.onYelp,
        gapSize: 5,
      })
    }
  }

  // 9. Facebook Presence
  if (myBusiness.onFacebook !== 'yes') {
    const anyCompOnFb = allComps.some(c => c.onFacebook === 'yes')
    if (anyCompOnFb) {
      actions.push({
        title: 'Create a Facebook Business Page',
        gap: 'You are not listed on Facebook, but at least one competitor is',
        benchmark: 'Facebook business pages appear in search results and provide another review platform for customers.',
        steps: [
          'Create a business page on Facebook with complete info',
          'Add your logo, cover photo, and business details',
          'Enable reviews/recommendations on your page',
          'Post updates at least once a week to show you\'re active',
        ],
        impact: 'Low',
        difficulty: 'Easy',
        weight: WEIGHTS.onFacebook,
        gapSize: 4,
      })
    }
  }

  // 10. Social Media
  const socialOrder = { 'none': 0, '1': 1, '2-3': 2, '4+': 3 }
  const mySocial = socialOrder[myBusiness.socialMediaPresence] || 0
  const maxCompSocial = Math.max(...allComps.map(c => socialOrder[c.socialMediaPresence] || 0), 0)
  if (mySocial < maxCompSocial) {
    actions.push({
      title: 'Expand Your Social Media Presence',
      gap: `You have ${myBusiness.socialMediaPresence === 'none' ? 'no active social profiles' : `fewer social profiles (${myBusiness.socialMediaPresence}) than competitors`}`,
      benchmark: 'Active social profiles build brand trust and drive traffic. Focus on 1-2 platforms your audience uses most.',
      steps: [
        'Identify where your target customers spend time (Instagram for visual businesses, Facebook for local, LinkedIn for B2B)',
        'Start with one platform and post consistently (3-5 times per week)',
        'Share behind-the-scenes content, customer wins, and helpful tips',
        'Engage with local community pages and groups',
        'Cross-promote your social profiles on your website and email signature',
      ],
      impact: 'Medium',
      difficulty: 'Medium',
      weight: WEIGHTS.socialMediaPresence,
      gapSize: (maxCompSocial - mySocial) * 3,
    })
  }

  // 11. Online Booking
  if (myBusiness.onlineBooking !== 'yes') {
    const anyCompBooking = allComps.some(c => c.onlineBooking === 'yes')
    if (anyCompBooking) {
      actions.push({
        title: 'Add Online Booking to Your Website',
        gap: 'You don\'t offer online booking, but a competitor does',
        benchmark: '67% of consumers prefer online booking over calling. It reduces friction and captures leads 24/7.',
        steps: [
          'Set up a free booking tool like Calendly, Acuity, or Square Appointments',
          'Add a "Book Now" button prominently on your website and GBP',
          'Enable booking through Google Reserve if available for your industry',
          'Make sure booking is mobile-friendly',
        ],
        impact: 'Medium',
        difficulty: 'Medium',
        weight: WEIGHTS.onlineBooking,
        gapSize: 7,
      })
    }
  }

  // 12. Team Photos
  if (myBusiness.hasWebsite === 'yes' && myBusiness.teamPhotos !== 'yes') {
    actions.push({
      title: 'Add Team Photos to Your Website',
      gap: 'Your website doesn\'t feature photos of your team',
      benchmark: 'Team photos build trust and help customers feel connected before they visit. Especially important for service businesses.',
      steps: [
        'Take professional headshots or casual team photos',
        'Create an "About Us" or "Meet the Team" page',
        'Include names and brief bios for key team members',
        'Keep photos updated as your team changes',
      ],
      impact: 'Low',
      difficulty: 'Easy',
      weight: WEIGHTS.teamPhotos,
      gapSize: 3,
    })
  }

  // 13. Services Listed
  const myServices = parseFloat(myBusiness.servicesListed) || 0
  const maxCompServices = Math.max(...allComps.map(c => parseFloat(c.servicesListed) || 0), 0)
  if (myServices < maxCompServices && myServices < 10) {
    actions.push({
      title: 'List More Services on Your Profile and Website',
      gap: `You list ${myServices} services vs. your competitor's ${maxCompServices}`,
      benchmark: 'More listed services = more keyword opportunities in local search. Each service is a chance to appear in relevant queries.',
      steps: [
        'Add all your services to your Google Business Profile',
        'Create individual pages on your website for each major service',
        'Include relevant keywords naturally in service descriptions',
        'Add pricing information where possible (Google favors complete listings)',
      ],
      impact: 'Medium',
      difficulty: 'Easy',
      weight: WEIGHTS.servicesListed,
      gapSize: maxCompServices - myServices,
    })
  }

  // Sort by priority score: (weight * gapSize) with impact tiebreaker
  const impactMultiplier = { 'High': 3, 'Medium': 2, 'Low': 1 }
  const difficultyBonus = { 'Easy': 1.5, 'Medium': 1, 'Hard': 0.7 }
  actions.sort((a, b) => {
    const scoreA = a.weight * a.gapSize * impactMultiplier[a.impact] * difficultyBonus[a.difficulty]
    const scoreB = b.weight * b.gapSize * impactMultiplier[b.impact] * difficultyBonus[b.difficulty]
    return scoreB - scoreA
  })

  return actions.slice(0, 10)
}

// Generate comparison metrics for the table
export function getComparisonMetrics() {
  return [
    { key: 'googleReviewCount', label: 'Google Review Count', group: 'Google Presence', type: 'number' },
    { key: 'googleRating', label: 'Google Average Rating', group: 'Google Presence', type: 'number' },
    { key: 'respondsToReviews', label: 'Responds to Reviews', group: 'Google Presence', type: 'select' },
    { key: 'gbpPhotoCount', label: 'GBP Photo Count', group: 'Google Presence', type: 'number' },
    { key: 'gbpPostsRecent', label: 'Recent GBP Posts', group: 'Google Presence', type: 'boolean' },
    { key: 'hasWebsite', label: 'Has Website', group: 'Google Presence', type: 'boolean' },
    { key: 'hasHttps', label: 'Website Uses HTTPS', group: 'Online Presence', type: 'boolean' },
    { key: 'onYelp', label: 'Listed on Yelp', group: 'Online Presence', type: 'boolean' },
    { key: 'yelpRating', label: 'Yelp Rating', group: 'Online Presence', type: 'number' },
    { key: 'yelpReviewCount', label: 'Yelp Review Count', group: 'Online Presence', type: 'number' },
    { key: 'onFacebook', label: 'Listed on Facebook', group: 'Online Presence', type: 'boolean' },
    { key: 'facebookRating', label: 'Facebook Rating', group: 'Online Presence', type: 'number' },
    { key: 'facebookReviewCount', label: 'Facebook Review Count', group: 'Online Presence', type: 'number' },
    { key: 'socialMediaPresence', label: 'Active Social Media', group: 'Online Presence', type: 'select' },
    { key: 'yearsInBusiness', label: 'Years in Business', group: 'Business Details', type: 'number' },
    { key: 'servicesListed', label: 'Services Listed', group: 'Business Details', type: 'number' },
    { key: 'onlineBooking', label: 'Online Booking', group: 'Business Details', type: 'boolean' },
    { key: 'teamPhotos', label: 'Team Photos on Website', group: 'Business Details', type: 'boolean' },
  ]
}

// Format display value for table cells
export function formatDisplayValue(key, value) {
  if (value === '' || value === undefined || value === null) return '--'

  const booleanFields = ['gbpPostsRecent', 'hasWebsite', 'hasHttps', 'onYelp', 'onFacebook', 'onlineBooking', 'teamPhotos']
  if (booleanFields.includes(key)) {
    return value === 'yes' ? 'Yes' : 'No'
  }

  if (key === 'respondsToReviews') {
    const map = { 'yes': 'Yes', 'no': 'No', 'sometimes': 'Sometimes' }
    return map[value] || '--'
  }

  if (key === 'socialMediaPresence') {
    const map = { 'none': 'None', '1': '1 Platform', '2-3': '2-3 Platforms', '4+': '4+ Platforms' }
    return map[value] || '--'
  }

  if (key === 'googleRating' || key === 'yelpRating' || key === 'facebookRating') {
    return value ? `${parseFloat(value).toFixed(1)} / 5.0` : '--'
  }

  return value.toString()
}

// Generate text export of the action plan
export function generateExportText(myBusiness, competitors, industry, location, actions) {
  const bench = BENCHMARKS[industry]
  let text = `LOCAL COMPETITOR COMPARISON REPORT\n`
  text += `${'='.repeat(50)}\n\n`
  text += `Business: ${myBusiness.name}\n`
  text += `Industry: ${industry}\n`
  text += `Location: ${location}\n`
  text += `Date: ${new Date().toLocaleDateString()}\n\n`

  text += `COMPETITORS ANALYZED\n`
  text += `${'-'.repeat(30)}\n`
  competitors.filter(c => c && c.name).forEach((comp, i) => {
    text += `${i + 1}. ${comp.name}\n`
  })

  text += `\nINDUSTRY BENCHMARKS (${bench?.label || industry})\n`
  text += `${'-'.repeat(30)}\n`
  if (bench) {
    text += `Competitive review count: ${bench.reviewCount}+\n`
    text += `Strong review count: ${bench.reviewCountStrong}+\n`
    text += `Competitive rating: ${bench.rating}+\n`
    text += `Strong rating: ${bench.ratingStrong}+\n`
  }

  text += `\nPRIORITIZED ACTION PLAN\n`
  text += `${'='.repeat(50)}\n\n`

  actions.forEach((action, i) => {
    text += `#${i + 1} Priority: ${action.title}\n`
    text += `Gap: ${action.gap}\n`
    text += `Benchmark: ${action.benchmark}\n`
    text += `Impact: ${action.impact} | Difficulty: ${action.difficulty}\n`
    text += `\nAction Steps:\n`
    action.steps.forEach((step, j) => {
      text += `  ${j + 1}. ${step}\n`
    })
    text += `\n${'-'.repeat(40)}\n\n`
  })

  text += `\nGenerated by DreamHost Free Marketing Tools\n`
  text += `https://seo-tools-tau.vercel.app/local-business/\n`

  return text
}
