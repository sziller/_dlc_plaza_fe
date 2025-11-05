// src/api/deleteSelf.ts
import axios from 'axios'
import { API_URL } from '../config'
import { getToken } from './token'

/**
 * Permanently delete the authenticated user.
 * Endpoint: DELETE /app/auth/self
 * Now requires the user's email as a parameter.
 */
export const deleteSelf = async (email: string): Promise<void> => {
  const token = getToken()

  try {
    await axios.delete(`${API_URL}/app/auth/self`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      // axios allows a request body on DELETE via the `data` option
      data: { email },
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('[deleteSelf] User account deleted for', email)
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const detail =
        error.response?.data?.message ??
        error.response?.data?.detail ??
        'Unknown error occurred.'

      if (status === 400) throw new Error(`400 Bad Request: ${detail}`)
      if (status === 401) throw new Error('401 Unauthorized Error: Invalid or expired token.')
      if (status) throw new Error(`${status} Error: ${detail}`)

      throw new Error('Network error: request failed.')
    }
    throw new Error('Unexpected error occurred.')
  }
}
