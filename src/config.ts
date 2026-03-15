const host = window.location.hostname.replace(/^www\./, '')

let API_URL = ''
if (host === 'cadenabitcoin.com' || host === 'purabitcoin.com') {
  API_URL = 'https://cadenabitcoin.com' // prod
} else if (host === 'staging.purabitcoin.com') {
  API_URL = 'https://staging.purabitcoin.com'
} else if (host === 'localhost' || host === '127.0.0.1') {
  API_URL = ''  // local dev — Vite proxy forwards /app to localhost:8000
} else {
  API_URL = 'https://staging.purabitcoin.com' // default to staging
}
export{ API_URL };
const CLIENT_ID = 'string';
export { CLIENT_ID };
const CLIENT_SECRET = 'string';
export { CLIENT_SECRET };