import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from './token';
import { LiquidityAllocationRequest, LiquidityAllocationResponse } from '../types/allocationFace';

export const postLiquidityAllocation = async (
  params: LiquidityAllocationRequest
): Promise<LiquidityAllocationResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await axios.post(
      `${API_URL}/app/dlcp/v0/liqu_alloc_reqest`,
      params,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
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
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized');
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
