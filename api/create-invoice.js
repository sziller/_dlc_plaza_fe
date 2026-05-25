import axios from 'axios'
import { getShippingCost } from './_shipping.js'

const BASE_PRICE_BTC = 15

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

  const { quantity = 1, shipping, contact_email } = req.body

  if (!shipping || !contact_email) {
    return res.status(400).json({ error: 'Missing shipping or contact_email' })
  }

  const BASE_URL = process.env.BASE_URL
  const REDIRECT_URL = process.env.REDIRECT_URL || 'https://cadenabitcoin.com'

  try {
    const { shippingCost } = await getShippingCost(shipping, quantity)
    const amount = Math.round((BASE_PRICE_BTC * quantity + shippingCost) * 100) / 100

    const sbpRes = await axios.post(
      'https://api.swiss-bitcoin-pay.ch/checkout',
      {
        amount,
        title: 'Endgame — Kevin Bell',
        unit: 'USD',
        onChain: true,
        redirectAfterPaid: `${REDIRECT_URL}/order-confirmed`,
        webhook: { url: `${BASE_URL}/api/webhook/sbp` },
        extra: { quantity, shipping, contact_email },
      },
      { headers: { 'api-key': process.env.SBP_API_KEY } }
    )

    res.json({ checkoutUrl: sbpRes.data.checkoutUrl })
  } catch (err) {
    console.error('create-invoice:', err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to create invoice. Please try again.' })
  }
}
