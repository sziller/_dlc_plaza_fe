import { getShippingCost } from './_shipping.js'

const allowed = [
  'https://cadenabitcoin.com',
  'https://www.cadenabitcoin.com',
  'https://staging.purabitcoin.com',
]

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

  const { shipping, quantity = 1 } = req.body
  if (!shipping?.country_code && !shipping?.country) {
    return res.status(400).json({ error: 'Missing shipping address' })
  }

  try {
    const { shippingCost } = await getShippingCost(shipping, quantity)
    res.json({ shippingCost })
  } catch (err) {
    console.error('get-shipping-cost:', JSON.stringify(err.response?.data, null, 2) || err.message)
    res.status(500).json({ error: 'Could not calculate shipping cost.' })
  }
}
