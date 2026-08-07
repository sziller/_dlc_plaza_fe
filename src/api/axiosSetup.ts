// src/api/axiosSetup.ts
import axios from 'axios'
import { getToken } from './token'
import { API_URL } from '../config'
import { serverStatusSignals } from '../composables/useServerStatus'

// True only for requests actually going to our own backend. Every other
// axios call in the app (book checkout, third-party APIs, etc.) shares this
// same default axios instance, so without this check the session token
// would ride along to whatever host those calls happen to target.
function isOwnApiRequest(cfg: { url?: string; baseURL?: string }) {
  const url = cfg.url || ''
  const full = /^https?:\/\//i.test(url) ? url : `${cfg.baseURL || ''}${url}`
  if (/^https?:\/\//i.test(full)) {
    return API_URL !== '' && full.startsWith(API_URL)
  }
  // relative URL with no scheme — only "ours" in dev, where API_URL is ''
  // and requests go through the Vite proxy to our own backend.
  return API_URL === ''
}

// attach token only on requests to our own API
axios.interceptors.request.use((cfg) => {
  if (isOwnApiRequest(cfg)) {
    const t = getToken()
    if (t) {
      cfg.headers = cfg.headers || {}
      cfg.headers.Authorization = `Bearer ${t}`
    }
  }
  return cfg
})

// on responses from our own API: report reachability, and on 401/403 broadcast auth-invalid
axios.interceptors.response.use(
  (res) => {
    if (isOwnApiRequest(res.config || {})) {
      serverStatusSignals.markUp()
    }
    return res
  },
  (err) => {
    const cfg = err?.config || {}
    if (isOwnApiRequest(cfg)) {
      const s = err?.response?.status
      if (s === 401 || s === 403) {
        window.dispatchEvent(new Event('auth-invalid'))
      } else if (!err?.response || s >= 500) {
        // No response at all (network/timeout/CORS) or a server-side failure —
        // our own backend is unreachable, not just this one request failing.
        serverStatusSignals.markDown()
      }
    }
    return Promise.reject(err)
  }
)
