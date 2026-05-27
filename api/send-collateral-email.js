import { Resend } from 'resend'

const allowed = [
  'https://cadenabitcoin.com',
  'https://www.cadenabitcoin.com',
  'https://staging.purabitcoin.com',
]

const CALENDLY = 'https://calendly.com/cadenabitcoin-info/30min'

function buildHtml({ name, loanUsd, requiredBtc, availableBtc, shortfallBtc }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Cadena loan — completing the collateral step</title>
</head>
<body style="margin:0;padding:0;background:#060e1a;font-family:system-ui,-apple-system,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060e1a;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="width:100%;max-width:520px;background:#0c1829;border-radius:10px;overflow:hidden;color:#ffffff;">

        <!-- Header -->
        <tr>
          <td align="center" style="padding:32px 24px 28px;border-bottom:1px solid #1b2d47;">
            <span style="font-size:20px;font-weight:800;letter-spacing:2px;color:#ffffff;text-transform:uppercase;">CADENA </span><span style="font-size:20px;font-weight:800;letter-spacing:2px;color:#6738e3;text-transform:uppercase;">BITCOIN</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 36px 0;">
            <h1 style="margin:0 0 18px;font-size:20px;font-weight:700;color:#ffffff;">Hi ${name},</h1>
            <p style="margin:0 0 14px;font-size:14px;line-height:1.75;color:#a8b4cc;">
              You recently reached the funding screen for a Bitcoin-backed loan with Cadena — one step from done. That last step is committing the Bitcoin collateral the contract is built on, and your wallet came up short. Here's exactly what that step is and how to finish it.
            </p>

            <!-- Where your request stands -->
            <h2 style="margin:24px 0 12px;font-size:16px;font-weight:700;color:#ffffff;">Where your request stands</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#081020;border:1px solid #1b2d47;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #1b2d47;font-size:13px;color:#6b7a96;">Requested loan</td>
                <td style="padding:14px 18px;border-bottom:1px solid #1b2d47;font-size:13px;font-weight:600;color:#ffffff;text-align:right;">${loanUsd}</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #1b2d47;font-size:13px;color:#6b7a96;">Collateral the contract needs</td>
                <td style="padding:14px 18px;border-bottom:1px solid #1b2d47;font-size:13px;font-weight:600;color:#ffffff;text-align:right;">${requiredBtc} BTC</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #1b2d47;font-size:13px;color:#6b7a96;">Currently in your Cadena wallet</td>
                <td style="padding:14px 18px;border-bottom:1px solid #1b2d47;font-size:13px;font-weight:600;color:#ffffff;text-align:right;">${availableBtc} BTC</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;font-size:13px;color:#6b7a96;">Shortfall</td>
                <td style="padding:14px 18px;font-size:13px;font-weight:700;color:#6738e3;text-align:right;">${shortfallBtc} BTC</td>
              </tr>
            </table>

            <!-- What adding collateral means -->
            <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#ffffff;">What "adding collateral" means</h2>
            <p style="margin:0 0 14px;font-size:14px;line-height:1.75;color:#a8b4cc;">
              A Cadena loan is collateralized by Bitcoin you already hold. To open the loan, that Bitcoin is committed into the loan contract — locked on Bitcoin's base layer for the term, alongside the lender's capital. It is never handed to a custodian, and nothing moves at all until both you and the lender have signed. At maturity, the collateral returns to your keys.
            </p>
            <p style="margin:0 0 24px;font-size:14px;line-height:1.75;color:#a8b4cc;">
              Two things tend to surprise people, and both are deliberate. First, the contract asks for more Bitcoin, in dollar terms, than the loan itself — that over-collateralization is what lets a Cadena loan run with no margin calls and no liquidations during the term, so your position can't be force-sold on a price swing. Second, committing Bitcoin as collateral is not selling it: the Bitcoin is locked in the contract, not spent, and your position is held through the full term.
            </p>

            <!-- How to complete it -->
            <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#ffffff;">How to complete it</h2>
            <p style="margin:0 0 12px;font-size:14px;line-height:1.75;color:#a8b4cc;">
              If your Bitcoin is held elsewhere — an exchange or another wallet — it needs to be moved into your Cadena wallet before the contract can fund:
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#081020;border:1px solid #1b2d47;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:12px 18px;border-bottom:1px solid #1b2d47;font-size:13px;color:#a8b4cc;"><span style="color:#6738e3;font-weight:700;margin-right:10px;">1.</span> Move your Bitcoin into your Cadena wallet from wherever it's currently held.</td>
              </tr>
              <tr>
                <td style="padding:12px 18px;border-bottom:1px solid #1b2d47;font-size:13px;color:#a8b4cc;"><span style="color:#6738e3;font-weight:700;margin-right:10px;">2.</span> Confirm the balance covers <strong style="color:#ffffff;">${requiredBtc} BTC</strong>.</td>
              </tr>
              <tr>
                <td style="padding:12px 18px;font-size:13px;color:#a8b4cc;"><span style="color:#6738e3;font-weight:700;margin-right:10px;">3.</span> Return to the funding screen — the loan will be ready to fund.</td>
              </tr>
            </table>

            <!-- Let's finish this together -->
            <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#ffffff;">Let's finish this together</h2>
            <p style="margin:0 0 20px;font-size:14px;line-height:1.75;color:#a8b4cc;">
              A ${loanUsd} loan is worth getting right. On a short call we can confirm the numbers, answer anything about how the structure works — or whether it fits your situation — and fund the contract with you live.
            </p>

            <!-- CTA Button -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
              <tr>
                <td>
                  <a href="${CALENDLY}" target="_blank"
                     style="display:inline-block;background:#6738e3;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                    Book a time to finish this
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 32px;font-size:14px;line-height:1.75;color:#a8b4cc;">
              Prefer to finish on your own? Just reply to this email and we'll help by message.
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 36px;"><hr style="border:none;border-top:1px solid #1b2d47;margin:0;"></td></tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding:28px 24px;">
            <p style="margin:0 0 10px;font-size:13px;color:#8b96aa;">— Kevin Bell, Cadena Bitcoin</p>
            <p style="margin:0 0 12px;font-size:12px;">
              <a href="https://cadenabitcoin.com" style="color:#6738e3;text-decoration:none;">cadenabitcoin.com</a>
              <span style="color:#2d3f5a;margin:0 6px;">·</span>
              <a href="https://cadenabitcoin.com/privacy" style="color:#6738e3;text-decoration:none;">Privacy</a>
              <span style="color:#2d3f5a;margin:0 6px;">·</span>
              <a href="https://cadenabitcoin.com/terms" style="color:#6738e3;text-decoration:none;">Terms</a>
            </p>
            <p style="margin:0;font-size:11px;color:#3a4f6a;line-height:1.6;">You are receiving this email because you signed up at cadenabitcoin.com.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  const allowedOrigin = allowed.includes(origin) || origin.startsWith('http://localhost')
    ? origin : allowed[0]
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { email, firstName, loanUsd, availableSats, requiredSats } = req.body
  if (!email) return res.status(400).json({ error: 'Missing email' })

  const fmtUsd = (v) =>
    Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const fmtBtc = (sats) => (sats / 1e8).toFixed(8)

  const availableBtc = fmtBtc(availableSats)
  const requiredBtc = fmtBtc(requiredSats)
  const shortfallBtc = fmtBtc(Math.max(0, requiredSats - availableSats))

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'Kevin Bell — Cadena Bitcoin <hello@cadenabitcoin.com>',
      to: email,
      subject: 'Your Cadena loan — completing the collateral step',
      html: buildHtml({
        name: firstName || 'there',
        loanUsd: fmtUsd(loanUsd),
        requiredBtc,
        availableBtc,
        shortfallBtc,
      }),
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('send-collateral-email:', err.message)
    res.status(500).json({ error: 'Failed to send email' })
  }
}
