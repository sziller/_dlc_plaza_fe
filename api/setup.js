import { getLuluToken } from './_lulu.js'
import axios from 'axios'

// Call this endpoint once after deployment to register the Lulu webhook.
// GET /api/setup
export default async function handler(req, res) {
  try {
    const token = await getLuluToken()
    await axios.post(
      'https://api.lulu.com/webhooks/',
      {
        url: `${process.env.BASE_URL}/api/webhook/lulu`,
        topics: ['PRINT_JOB_STATUS_CHANGED'],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    res.json({ ok: true, message: 'Lulu webhook registered' })
  } catch (err) {
    if (err.response?.status === 400) {
      return res.json({ ok: true, message: 'Lulu webhook already registered' })
    }
    console.error(err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to register Lulu webhook' })
  }
}
