// src/api/downloadApp.ts
import axios, { AxiosError } from 'axios'
import { API_URL } from '../config'
import { getToken } from './token'

export type DownloadAppResult = {
  filename: string
  versionLabel: string | null
}

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
const extractFilename = (headers: Record<string, string | string[] | undefined>, fallback = 'CadenaSigner-latest.apk') => {
  const disp = headers['content-disposition'] || headers['Content-Disposition']
  if (disp && typeof disp === 'string') {
    const m = disp.match(/filename="?([^"]+)"?/)
    if (m?.[1]) return m[1]
  }
  return fallback
}

const extractVersionLabel = (filename: string) => {
  const m = filename.match(/v(\d+(?:\.\d+)*)/i)
  return m?.[1] ? `v${m[1]}` : null
}

const buildHeaders = () => {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export const downloadApp = async (opts?: { filename?: string }): Promise<DownloadAppResult> => {
  const headers = buildHeaders()

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
    const downloadName = extractFilename(res.headers, opts?.filename || 'CadenaSigner-latest.apk')
    const versionLabel = extractVersionLabel(downloadName)

    const blob = new Blob([res.data], { type: 'application/vnd.android.package-archive' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = downloadName
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)

    return { filename: downloadName, versionLabel }
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

export const fetchLatestAppInfo = async (): Promise<DownloadAppResult> => {
  const headers = buildHeaders()
  headers.Range = 'bytes=0-0' // ask for first byte only so we get headers without full download
  try {
    const res = await axios.get(`${API_URL}/app/dlcp/v0/download-app`, {
      headers,
      responseType: 'blob',
      // allow 206 Partial Content if Range is honored
      validateStatus: (s) => (s >= 200 && s < 300) || s === 206,
    })

    const filename = extractFilename(res.headers, 'CadenaSigner-latest.apk')
    const versionLabel = extractVersionLabel(filename)
    // dispose tiny blob if created
    try {
      if (res.data && typeof URL !== 'undefined') {
        const u = URL.createObjectURL(res.data)
        URL.revokeObjectURL(u)
      }
    } catch {}
    return { filename, versionLabel }
  } catch (err) {
    const ax = err as AxiosError<any>
    if (ax?.response) {
      const status = ax.response.status
      throw new HttpError(`HTTP ${status}: Could not fetch app metadata.`, status)
    }
    throw new HttpError('Network error: could not fetch app metadata.')
  }
}
