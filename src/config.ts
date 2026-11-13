const host = window.location.hostname.replace(/^www\./, '')

let API_URL = ''
if (import.meta.env.DEV) {
  // `vite dev` (any hostname, incl. LAN names): always same-origin, so the Vite proxy
  // decides the backend (vite.config.mjs). Never fall through to a deployed backend.
  API_URL = ''
} else if (host === 'cadenabitcoin.com' || host === 'purabitcoin.com') {
  API_URL = 'https://cadenabitcoin.com' // prod
} else if (host === 'staging.purabitcoin.com') {
  API_URL = 'https://staging.purabitcoin.com'
} else if (host === 'localhost' || host === '127.0.0.1') {
  API_URL = ''  // local dev — Vite proxy forwards /app to localhost:8000
} else {
  API_URL = 'https://staging.purabitcoin.com' // default to staging
}
export { API_URL };
export const DEFAULT_ORACLE = 'oracle_dlcp';
export const DEFAULT_SYMBOL = 'BTCUSD';

export const ORACLE_LABELS = {
  oracle_dlcp: 'DLCP Oracle',
}

export function oracleDisplayName(id) {
  return ORACLE_LABELS[id] || id
}
const CLIENT_ID = 'string';
export { CLIENT_ID };
const CLIENT_SECRET = 'string';
export { CLIENT_SECRET };