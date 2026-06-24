import { getReferralCookie } from '../lib/referral'

const IS_LOCAL = typeof location !== 'undefined'
  && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')

const WEBHOOK_URL = import.meta.env.VITE_SLACK_COLLATERAL_WEBHOOK_URL as string | undefined
const BOOK_API = import.meta.env.VITE_BOOK_API as string | undefined

let hasFiredThisSession = false

export function notifySlackCollateralShortfall(
  email: string,
  loanUsd: number,
  availableSats: number,
  requiredSats: number,
) {
  if (IS_LOCAL) return
  if (hasFiredThisSession) return
  if (!email || email === 'unknown') return

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

  if (WEBHOOK_URL) {
    // Use text/plain to avoid CORS preflight — Slack webhooks accept JSON with this content type
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ text }),
    }).catch(() => {})
  }

  if (BOOK_API) {
    fetch(`${BOOK_API}/api/send-collateral-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, loanUsd, availableSats, requiredSats }),
    }).catch(() => {})
  }
}

export function notifySlackNewBtcusdUser(email: string) {
  if (IS_LOCAL) return
  if (localStorage.getItem('cadena:allocate_liquidity-visited')) return
  if (!WEBHOOK_URL) return
  if (!email || email === 'unknown') return

  localStorage.setItem('cadena:allocate_liquidity-visited', Date.now().toString())

  const referral = getReferralCookie() || 'none'

  const params = new URLSearchParams(window.location.search)
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
  const utmParts = utmKeys
    .map((k) => [k.replace('utm_', ''), params.get(k)] as const)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
  const utmStr = utmParts.length ? utmParts.join(', ') : 'none'

  const text = [
    ':wave: *New User on /allocate_liquidity*',
    '',
    `*User:* ${email}`,
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
