// api/userDlcs.ts
import axios from 'axios';
import { getToken } from './token';
import { API_URL } from '../config';
import { UserDlcsResponse } from '../types/dlcFace';

export const getUserDlcs = async (
  status_list: string[] = ['offer','accepted','signed']
): Promise<UserDlcsResponse> => {
  const token = getToken();

  const headers: Record<string,string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axios.get(`${API_URL}/app/dlcp/v0/user-dlcs`, {
    params: { status_list },
    headers,
    timeout: 10000,                 // don’t hang forever
    signal: getDlcsAbortSignal(),   // cancel if a new call starts
    // See B for paramsSerializer
  });

  if (Array.isArray(response.data?.payload)) return response.data;
  throw new Error('Invalid response from server');
};

// optional: keep 1 inflight, cancel old
let dlcsAbort: AbortController | null = null;
function getDlcsAbortSignal() {
  if (dlcsAbort) dlcsAbort.abort();
  dlcsAbort = new AbortController();
  return dlcsAbort.signal;
}
