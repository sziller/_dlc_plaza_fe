const THIN = '\u2009'

/**
 * Format a BTC number to 8 decimals with 2-3-3 fractional digit grouping.
 * @param {number} btc — value in BTC
 * @returns {string} e.g. "0.00 560 710"
 */
export function formatBtcValue(btc) {
  const n = Number(btc)
  if (!Number.isFinite(n)) return '0.00\u2009000\u2009000'

  const sign = n < 0 ? '-' : ''
  const fixed = Math.abs(n).toFixed(8)
  const [intPart, fracPart] = fixed.split('.')

  // Group integer part: every 3 digits from right
  const intGrouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, THIN)

  // Group fractional part as 2-3-3
  const fracGrouped = fracPart.slice(0, 2) + THIN + fracPart.slice(2, 5) + THIN + fracPart.slice(5, 8)

  return sign + intGrouped + '.' + fracGrouped
}

/**
 * Convert satoshis to formatted BTC string.
 * @param {number} sats — value in satoshis
 * @returns {string} e.g. "0.00 560 710"
 */
export function satsForm(sats) {
  const n = Number(sats)
  if (!Number.isFinite(n)) return '—'
  return formatBtcValue(n / 1e8)
}
