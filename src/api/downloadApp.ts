// src/api/downloadApp.ts
import axios, { AxiosError } from 'axios'
import { API_URL } from '../config'
import { getToken } from './token'

export class HttpError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/**
 * Download latest APK (or a specific one if filename is provided).
 * Backend endpoint:
 *   GET /app/dlcp/v0/download-app
 *   optional query: ?filename=<name.apk>
 *
 * We request it as blob and then trigger a browser download.
 */
export const downloadApp = async (opts?: { filename?: string }) => {
  const token = getToken()
  const headers: Record<string, string> = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const params: Record<string, string> = {}
  if (opts?.filename) {
    params.filename = opts.filename
  }

  try {
    const res = await axios.get(`${API_URL}/app/dlcp/v0/download-app`, {
      headers,
      params,
      responseType: 'blob',
      // we want 200 only
      validateStatus: (s) => s >= 200 && s < 300,
    })

    // Try to read filename from Content-Disposition, else fallback
    const disp = res.headers['content-disposition'] || res.headers['Content-Disposition']
    let downloadName = opts?.filename || 'CadenaSigner-latest.apk'
    if (disp && typeof disp === 'string') {
      const m = disp.match(/filename="?([^"]+)"?/)
      if (m?.[1]) {
        downloadName = m[1]
      }
    }

    const blob = new Blob([res.data], { type: 'application/vnd.android.package-archive' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = downloadName
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    const ax = err as AxiosError<any>
    if (ax.response) {
      const status = ax.response.status
      const detail = (ax.response.data && (ax.response.data.detail || ax.response.data.message)) || ''
      if (status === 401) throw new HttpError('401 Unauthorized: cannot download APK.', 401)
      throw new HttpError(`HTTP ${status}: ${detail || 'Download failed.'}`, status)
    }
    throw new HttpError('Network error: could not download APK.')
  }
}
