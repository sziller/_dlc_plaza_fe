// src/api/publicContact.ts
import axios from 'axios'
import { API_URL } from '../config'

type PublicOkStatus = 'created' | 'exists'
export type PublicContactEmailData = { ok: true; status: PublicOkStatus }

/** Basic email sanity check */
export function isValidEmail(e: string | null | undefined): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e || '').toLowerCase())
}

/**
 * Idempotent capture for unauth’d CTA (body: { email })
 * Server responses:
 *  - 201 -> { ok:true, status:"created" }
 *  - 200 -> { ok:true, status:"exists" }
 * Public (no auth).
 */
export const postContactEmail = async (
  email: string,
  timeout = 10000
): Promise<PublicContactEmailData | void> => {
  if (!isValidEmail(email)) return

  try {
    const payload = { email: String(email).toLowerCase() }

    const res = await axios.post(
      `${API_URL}/app/auth/contact-email`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout,
        withCredentials: true,
      }
    )

    const data = res.data as PublicContactEmailData
    if (data?.ok && (data.status === 'created' || data.status === 'exists')) {
      return data
    }
    return { ok: true, status: 'exists' }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('The request took too long - please try again later.')
      } else if (error.response) {
        const detail =
          (error.response.data && (error.response.data.detail as string)) ||
          'An error occurred. Please try again.'
        throw new Error(detail)
      } else {
        throw new Error('No response received. Please try again.')
      }
    } else {
      throw new Error(
        error instanceof Error ? error.message : 'Unexpected error occurred.'
      )
    }
  }
}

export default { postContactEmail, isValidEmail }
