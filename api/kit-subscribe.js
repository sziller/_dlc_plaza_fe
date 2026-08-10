const allowed = [
  'https://cadenabitcoin.com',
  'https://www.cadenabitcoin.com',
  'https://staging.purabitcoin.com',
]

// Kit ("Newly added subscriber" tag) — not a secret, just an account-specific
// ID pulled from the Kit dashboard's Tags section.
const NEWLY_ADDED_SUBSCRIBER_TAG_ID = '19736230'

export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  const allowedOrigin = allowed.includes(origin) || origin.startsWith('http://localhost')
    ? origin : allowed[0]
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body || {}
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Missing email' })

  const apiKey = process.env.KIT_API_KEY
  if (!apiKey) {
    console.error('kit-subscribe: KIT_API_KEY is not set')
    return res.status(500).json({ error: 'Kit is not configured' })
  }

  const kitHeaders = {
    'Content-Type': 'application/json',
    'X-Kit-Api-Key': apiKey,
  }

  try {
    // Kit's single-call "tag a subscriber by email" endpoint
    // (POST /v4/tags/{tag_id}/subscribers) 404s on Kit's own infrastructure
    // regardless of request shape — confirmed by testing the exact documented
    // request directly against api.kit.com, bypassing this function entirely.
    // Two-step create-or-find-by-email + tag-by-id works reliably instead.
    const subRes = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: kitHeaders,
      body: JSON.stringify({ email_address: email }),
    })

    if (!subRes.ok) {
      const detail = await subRes.text().catch(() => '')
      console.error('kit-subscribe: create subscriber failed', subRes.status, detail)
      return res.status(502).json({ error: 'Kit subscribe failed' })
    }

    const { subscriber } = await subRes.json()
    const subscriberId = subscriber?.id
    if (!subscriberId) {
      console.error('kit-subscribe: no subscriber id in response', subscriber)
      return res.status(502).json({ error: 'Kit subscribe failed' })
    }

    const tagRes = await fetch(
      `https://api.kit.com/v4/tags/${NEWLY_ADDED_SUBSCRIBER_TAG_ID}/subscribers/${subscriberId}`,
      { method: 'POST', headers: kitHeaders, body: '{}' }
    )

    if (!tagRes.ok) {
      const detail = await tagRes.text().catch(() => '')
      console.error('kit-subscribe: tag subscriber failed', tagRes.status, detail)
      return res.status(502).json({ error: 'Kit subscribe failed' })
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('kit-subscribe:', err.message)
    res.status(500).json({ error: 'Kit subscribe failed' })
  }
}
