// src/services/auth.ts
import axios from 'axios';
import { API_URL } from '../config';
import type { UserFace } from '../types/userFace';

// Backend reads referral_code from the Cookie header only.
// Do NOT include referral_code in the JSON body.

export const registerUser = async (user: UserFace): Promise<void> => {
  try {
    await axios.post(`${API_URL}/app/auth/new-user`, user, {
      // Required if your API lives on a different subdomain (e.g., api.purabitcoin.com)
      // so the browser attaches cookies cross-subdomain.
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const detail = (error.response.data as any)?.detail;
        throw new Error(Array.isArray(detail) ? detail[0]?.msg : detail || 'Request failed.');
      }
      throw new Error('Network error.');
    }
    throw new Error('Unexpected error.');
  }
};
