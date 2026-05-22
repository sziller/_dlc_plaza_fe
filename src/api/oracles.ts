import axios from 'axios'
import { API_URL } from '../config'

export interface OracleInfo {
  id: string
  label?: string
  symbol?: string
  [key: string]: unknown
}

function normalizeOracle(raw: Record<string, unknown>): OracleInfo {
  const id =
    (raw.oracle_id as string) ||
    (raw.id as string) ||
    (raw.oracle as string) ||
    ''
  return {
    ...raw,
    id,
    label: (raw.label as string) || (raw.name as string) || id,
  }
}

export async function getOracles(): Promise<OracleInfo[]> {
  const response = await axios.get(`${API_URL}/app/dlcp/v1/oracles`)
  const payload = response.data?.payload ?? response.data
  const items: Record<string, unknown>[] = Array.isArray(payload) ? payload : []
  return items.map(normalizeOracle).filter(o => o.id)
}
