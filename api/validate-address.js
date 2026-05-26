import axios from 'axios'

const allowed = [
  'https://cadenabitcoin.com',
  'https://www.cadenabitcoin.com',
  'https://staging.purabitcoin.com',
]

const GOOGLE_KEY = process.env.GOOGLE_MAPS_KEY

// Granularities that mean Google confirmed a specific, deliverable building.
// Anything coarser (ROUTE = street only, OTHER = couldn't resolve, etc.) means
// the house/unit couldn't be confirmed — almost always a typo or fake address.
const DELIVERABLE = ['PREMISE', 'SUB_PREMISE', 'PREMISE_PROXIMITY']

function evaluate(result) {
  const verdict = result?.verdict || {}
  const granularity = verdict.validationGranularity || 'OTHER'

  const goodGranularity = DELIVERABLE.includes(granularity)
  const googleSaysAccept = verdict.possibleNextAction === 'ACCEPT'
  const unconfirmed = verdict.hasUnconfirmedComponents === true

  // Trust Google's explicit ACCEPT signal over our own unconfirmed check —
  // unconfirmed components can be minor (e.g. apt number) on an otherwise real building.
  if (!goodGranularity || (unconfirmed && !googleSaysAccept)) {
    return { valid: false, granularity }
  }
  return { valid: true, granularity }
}

export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  const allowedOrigin = allowed.includes(origin) || origin.startsWith('http://localhost')
    ? origin
    : allowed[0]
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { shipping } = req.body
  if (!shipping) return res.status(400).json({ error: 'Missing shipping address' })

  // Fail OPEN if the key isn't configured — never block checkout on our own misconfig.
  if (!GOOGLE_KEY) {
    console.warn('validate-address: GOOGLE_MAPS_KEY not set — skipping validation')
    return res.json({ valid: true, skipped: true })
  }

  const regionCode = (shipping.country_code ?? shipping.country ?? '').toUpperCase()
  const addressLines = [shipping.street1, shipping.street2].filter(Boolean)

  if (!regionCode || addressLines.length === 0) {
    return res.status(422).json({
      valid: false,
      error: 'Please enter your street address and country.',
    })
  }

  try {
    const { data } = await axios.post(
      `https://addressvalidation.googleapis.com/v1:validateAddress?key=${GOOGLE_KEY}`,
      {
        address: {
          regionCode,
          addressLines,
          locality: shipping.city || undefined,
          administrativeArea: shipping.state_code ?? shipping.state ?? undefined,
          postalCode: shipping.postcode || undefined,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 6000,
      }
    )

    const result = data?.result
    const { valid, granularity } = evaluate(result)

    if (!valid) {
      console.warn('validate-address: rejected', JSON.stringify({ granularity, verdict: result?.verdict }))
      return res.status(422).json({
        valid: false,
        error: 'We couldn\'t verify this address. Please double-check your street, city, and postal code.',
        // Google's cleaned-up version, in case you want to suggest it to the user:
        suggested: result?.address?.formattedAddress || null,
      })
    }

    // Valid — also return Google's standardized address so the order can use the clean version.
    return res.json({
      valid: true,
      formatted: result?.address?.formattedAddress || null,
    })
  } catch (err) {
    // Google down / quota / network issue: fail OPEN so we don't lose the sale.
    const status = err.response?.status
    const body = err.response?.data
    console.error('validate-address error:', JSON.stringify({ status, body: body || err.message }, null, 2))
    return res.json({ valid: true, skipped: true })
  }
}