import axios from 'axios';
import { API_URL } from '../config';

export interface OracleInfo {
  oracle_id: string;
  [k: string]: unknown;
}

interface OraclesResponse {
  timestamp: number;
  payload: OracleInfo[];
  message: string;
}

export async function getOracles(): Promise<OraclesResponse> {
  const response = await axios.get<OraclesResponse>(
    `${API_URL}/app/dlcp/v1/oracles`
  );
  return response.data;
}
