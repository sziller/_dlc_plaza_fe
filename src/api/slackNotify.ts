const WEBHOOK_URL = import.meta.env.VITE_SLACK_COLLATERAL_WEBHOOK_URL as string | undefined

let hasFiredThisSession = false

export function notifySlackCollateralShortfall(
  email: string,
  loanUsd: number,
  availableSats: number,
  requiredSats: number,
) {
  if (hasFiredThisSession) return
  if (!WEBHOOK_URL) return

  hasFiredThisSession = true

  const availableBtc = availableSats / 1e8
  const requiredBtc = requiredSats / 1e8
  const shortfallBtc = requiredBtc - availableBtc

  const fmtBtc = (v: number) => v.toFixed(8)
  const fmtSats = (v: number) => v.toLocaleString('en-US')
  const fmtUsd = (v: number) =>
    v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  const text = [
    ':rotating_light: *Insufficient Collateral Alert*',
    '',
    `*User:* ${email}`,
    `*Requested Loan:* ${fmtUsd(loanUsd)}`,
    `*Available BTC:* ${fmtBtc(availableBtc)} BTC (${fmtSats(availableSats)} sats)`,
    `*Required Collateral:* ${fmtBtc(requiredBtc)} BTC (${fmtSats(requiredSats)} sats)`,
    `*Shortfall:* ~${fmtBtc(shortfallBtc)} BTC`,
    '',
    'This user got to the funding screen — they\'re deep in the funnel.',
  ].join('\n')

  // Use text/plain to avoid CORS preflight — Slack webhooks accept JSON with this content type
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ text }),
  }).catch(() => {
    // silent — must never break user flow
  })
}
