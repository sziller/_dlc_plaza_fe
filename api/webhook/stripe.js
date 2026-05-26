import Stripe from 'stripe'
import { createLuluPrintJob } from '../_lulu.js'

export const config = {
  api: { bodyParser: false },
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = req.headers['stripe-signature']
  const rawBody = await getRawBody(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Stripe webhook signature error:', err.message)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  res.status(200).end()

  if (event.type !== 'checkout.session.completed') return

  const session = event.data.object
  const { metadata } = session

  const order = {
    quantity: parseInt(metadata.quantity, 10),
    shipping: {
      name: metadata.name,
      street1: metadata.street1,
      street2: metadata.street2 || undefined,
      city: metadata.city,
      state_code: metadata.state_code || '',
      postcode: metadata.postcode,
      country_code: metadata.country_code,
      phone_number: metadata.phone_number,
    },
  }

  try {
    const job = await createLuluPrintJob(`stripe-${session.id}`, order)
    console.log(`Lulu print job created: ${job.id} for Stripe session ${session.id}`)
  } catch (err) {
    console.error('Lulu createPrintJob failed:', err.response?.data || err.message)
  }
}
