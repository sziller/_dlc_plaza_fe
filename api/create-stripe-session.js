import Stripe from 'stripe'
import { getShippingCost } from './_shipping.js'

const BASE_PRICE_CARD = 34.99

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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const REDIRECT_URL = process.env.REDIRECT_URL || 'https://cadenabitcoin.com'

  try {
    const { shippingCost } = await getShippingCost(shipping, quantity)
    const shippingCents = Math.round(shippingCost * 100)
    const bookCents = BASE_PRICE_CARD * quantity * 100

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Endgame — Kevin Bell' },
            unit_amount: BASE_PRICE_CARD * 100,
          },
          quantity,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Shipping' },
            unit_amount: shippingCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${REDIRECT_URL}/order-confirmed`,
      cancel_url: `${REDIRECT_URL}/endgame`,
      customer_email: contact_email,
      metadata: {
        name: shipping.name,
        street1: shipping.street1,
        street2: shipping.street2 || '',
        city: shipping.city,
        state_code: shipping.state_code || '',
        country_code: shipping.country_code,
        postcode: shipping.postcode,
        phone_number: shipping.phone_number,
        contact_email,
        quantity: String(quantity),
      },
    })

    res.json({ checkoutUrl: session.url })
  } catch (err) {
    console.error('create-stripe-session:', JSON.stringify(err.response?.data, null, 2) || err.message)
    res.status(500).json({ error: 'Failed to create checkout session. Please try again.' })
  }
}
