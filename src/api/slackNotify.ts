import { getReferralCookie } from '../lib/referral'

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

export function notifySlackNewBtcusdUser() {
  if (localStorage.getItem('cadena:btcusd-visited')) return
  if (!WEBHOOK_URL) return

  localStorage.setItem('cadena:btcusd-visited', Date.now().toString())

  const referral = getReferralCookie() || 'none'

  const params = new URLSearchParams(window.location.search)
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
  const utmParts = utmKeys
    .map((k) => [k.replace('utm_', ''), params.get(k)] as const)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
  const utmStr = utmParts.length ? utmParts.join(', ') : 'none'

  const text = [
    ':wave: *New User on /btcusd*',
    '',
    `*URL:* ${window.location.href}`,
    `*Referral:* ${referral}`,
    `*UTM:* ${utmStr}`,
    `*User Agent:* ${navigator.userAgent}`,
    `*Time:* ${new Date().toISOString()}`,
  ].join('\n')

  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ text }),
  }).catch(() => {})
}
