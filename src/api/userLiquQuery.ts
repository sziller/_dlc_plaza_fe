import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from './token';
import {
  LiquidityAllocationQueryRequest,
  UserLiquidityQueryResponse,
} from '../types/allocationFace';

export const postUserLiquQuery = async (
  params?: LiquidityAllocationQueryRequest
): Promise<UserLiquidityQueryResponse> => {
  const token = getToken();
  if (!token) throw new Error('Authentication required.');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(
      `${API_URL}/app/dlcp/v1/user-liqu-query`,
      params ?? {},
      { headers }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        const errorDetail = error.response.data.detail;
        if (Array.isArray(errorDetail)) {
          throw new Error(errorDetail[0].msg);
        } else {
          throw new Error(`Bad Request: ${errorDetail}`);
        }
      } else if (error.response?.status === 422) {
        const errorDetail = error.response.data?.detail;
        if (Array.isArray(errorDetail)) {
          throw new Error(errorDetail[0].msg);
        } else {
          throw new Error(`Validation Error: ${errorDetail}`);
        }
      } else if (error.response?.status === 500) {
        const detail = error.response.data?.detail;
        throw new Error(detail || 'Internal Server Error');
      }
    }
    console.error('Error:', error);
    throw error;
  }
};
