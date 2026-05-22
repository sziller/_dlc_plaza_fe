import axios from 'axios'

const BOOK_PRICE = 29.99

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { quantity = 1, shipping, contact_email } = req.body

  if (!shipping || !contact_email) {
    return res.status(400).json({ error: 'Missing shipping or contact_email' })
  }

  const amount = Math.round(quantity * BOOK_PRICE * 100) / 100
  const BASE_URL = process.env.BASE_URL
  const REDIRECT_URL = process.env.REDIRECT_URL || 'https://cadenabitcoin.com'

  try {
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
