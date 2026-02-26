import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from './token';
import { LiquidityAllocationRequest, LiquidityAllocationResponse } from '../types/allocationFace';

export const postLiquidityAllocation = async (
  params: LiquidityAllocationRequest
): Promise<LiquidityAllocationResponse> => {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.post(
      `${API_URL}/app/dlcp/v0/liqu_alloc_simulate`,
      params,
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
