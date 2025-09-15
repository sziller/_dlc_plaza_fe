// src/api/axiosSetup.ts
import axios from 'axios'
import { getToken } from './token'

// attach token on every request
axios.interceptors.request.use((cfg) => {
  const t = getToken()
  if (t) {
    cfg.headers = cfg.headers || {}
    cfg.headers.Authorization = `Bearer ${t}`
  }
  return cfg
})

// on any 401/403, broadcast an auth-invalid signal
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const s = err?.response?.status
    if (s === 401 || s === 403) {
      window.dispatchEvent(new Event('auth-invalid'))
    }
    return Promise.reject(err)
  }
)
