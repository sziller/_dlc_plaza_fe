import axios from 'axios'
import { API_URL } from '../config'

type ServerStatusPayload = {
  ok: boolean
  status: string
  client_ip?: string
}

export type ServerStatusResponse = {
  payload: ServerStatusPayload
  message: string
  timestamp: number
}

export const getServerStatus = async (): Promise<ServerStatusResponse> => {
  const response = await axios.get<ServerStatusResponse>(
    `${API_URL}/app/dlcp/v0/server-status`,
    { timeout: 5000, headers: { Accept: 'application/json' } }
  )
  return response.data
}
