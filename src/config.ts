const host = window.location.hostname.replace(/^www\./, '')

let API_URL = ''
if (host === 'cadenabitcoin.com' || host === 'purabitcoin.com') {
  API_URL = 'https://cadenabitcoin.com' // prod
} else if (host === 'staging.purabitcoin.com') {
    API_URL = 'https://staging.purabitcoin.com'
  //API_URL = import.meta.env.VITE_STAGING_API_URL
} else {
    API_URL = 'https://staging.purabitcoin.com'
  //API_URL = import.meta.env.VITE_STAGING_API_URL // default to staging for unknown hosts
}
export{ API_URL };
const CLIENT_ID = 'string';
export { CLIENT_ID };
const CLIENT_SECRET = 'string';
export { CLIENT_SECRET };