import axios from 'axios'
import { API_URL } from '../config'
import { getToken } from './token'

export const getUserProfile = async () => {
  const token = getToken()
  try {
    const res = await axios.get(`${API_URL}/app/auth/users-own-profile`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return res.data // { timestamp, payload: {...}, message }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 400) {
        throw new Error(`400 Bad Request: ${err.response.data?.detail ?? 'Malformed request.'}`)
      }
      if (err.response.status === 401) {
        throw new Error('401 Unauthorized Error: Invalid or expired token.')
      }
      if (err.response.status === 403) {
        throw new Error('403 Forbidden: Access denied.')
      }
    }
    throw new Error('500 Internal Server Error: Operation failed due to unforeseen circumstances.')
  }
}
