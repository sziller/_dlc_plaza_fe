// /api/offers.ts
import axios from 'axios';
import { API_URL } from '../config';
import { OffersResponse } from '../types/offerFace';
import { getToken } from './token';

// Public: fetches best available offers without user context
export const getOffers = async (ini_role: 'lend' | 'borrow' | 'both' = 'both'): Promise<OffersResponse> => {
  const response = await axios.get(`${API_URL}/app/dlcp/v0/offers`, {
    params: { ini_role },
    headers: { Accept: 'application/json' },
  });
  if (response.data && Array.isArray(response.data.payload)) return response.data;
  throw new Error('Invalid response format');
};

// Authenticated: offers available to current user
export const getUserOffers = async (
  ini_role: 'lend' | 'borrow' | 'both' = 'both',
  exclude_own: boolean = true
): Promise<OffersResponse> => {
  const token = getToken();
  if (!token) throw new Error('Missing token for authenticated offers');

  const response = await axios.get(`${API_URL}/app/dlcp/v0/offers-for-user`, {
    params: { ini_role, exclude_own },
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data && Array.isArray(response.data.payload)) return response.data;
  throw new Error('Invalid response format');
};
