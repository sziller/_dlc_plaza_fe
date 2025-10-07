// src/api/userProfile.ts
import axios, { AxiosError } from 'axios'
import { API_URL } from '../config'
import { getToken } from './token'

export type UserProfileResponse = {
  timestamp?: number | string
  payload?: any
  message?: string
}

// Simple HTTP error with status for cleaner handling upstream
export class HttpError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

// ---- Micro-cache + single-flight to prevent bursts ----
const CACHE_TTL_MS = 3000
let cacheValue: UserProfileResponse | null = null
let cacheAt = 0
let etag: string | undefined
let inFlight: Promise<UserProfileResponse> | null = null

export const getCachedUserProfile = (): UserProfileResponse | null => cacheValue

export const primeUserProfileCache = (data: UserProfileResponse) => {
  cacheValue = data ?? null
  cacheAt = Date.now()
  // keep etag as-is; you can also pass/track a known etag here if your API returns it elsewhere
}

export const clearUserProfileCache = () => {
  cacheValue = null
  cacheAt = 0
  etag = undefined
}

/**
 * Fetch the current user's profile.
 * - Single-flight: concurrent callers share one network request.
 * - Micro-cache: returns cached value if within TTL.
 * - Sends If-None-Match when available; 304 will return cached.
 */
export const getUserProfile = async (opts?: {
  force?: boolean
  timeoutMs?: number
}): Promise<UserProfileResponse> => {
  const force = !!opts?.force
  const timeoutMs = opts?.timeoutMs ?? 10_000

  // Serve from micro-cache (unless forced)
  if (!force && cacheValue && Date.now() - cacheAt < CACHE_TTL_MS) {
    return cacheValue
  }

  // Share in-flight request (unless forced)
  if (!force && inFlight) {
    return inFlight
  }

  const token = getToken()
  if (!token) {
    // No point calling the server if we have no token
    clearUserProfileCache()
    throw new HttpError('401 Unauthorized Error: No token available.', 401)
  }

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` }
  if (etag) headers['If-None-Match'] = etag

  const req = axios.get<UserProfileResponse>(`${API_URL}/app/auth/users-own-profile`, {
    headers,
    timeout: timeoutMs,
    // Accept 304 so we can return cached data
    validateStatus: (s) => (s >= 200 && s < 300) || s === 304,
  })

  if (!force) inFlight = req.then(r => r.data).finally(() => { inFlight = null })

  try {
    const res = await req

    // 304 Not Modified → return cached if we have it
    if (res.status === 304 && cacheValue) {
      cacheAt = Date.now()
      return cacheValue
    }

    // 200 OK → update cache + etag
    const data = res.data ?? {}
    cacheValue = data
    cacheAt = Date.now()
    const hdr = res.headers as Record<string, string | undefined>
    etag = hdr?.etag || hdr?.ETag || etag

    return data
  } catch (err) {
    const ax = err as AxiosError<any>

    // Clear in-flight on error path too
    inFlight = null

    if (ax.response) {
      const status = ax.response.status
      const detail = (ax.response.data && (ax.response.data.detail || ax.response.data.message)) || undefined

      if (status === 400) throw new HttpError(`400 Bad Request: ${detail ?? 'Malformed request.'}`, 400)
      if (status === 401) {
        clearUserProfileCache()
        throw new HttpError('401 Unauthorized Error: Invalid or expired token.', 401)
      }
      if (status === 403) throw new HttpError('403 Forbidden: Access denied.', 403)

      throw new HttpError(`HTTP ${status}: ${detail ?? 'Request failed.'}`, status)
    }

    // Network / timeout / unknown
    throw new HttpError('500 Internal Server Error: Operation failed due to unforeseen circumstances.')
  }
}
