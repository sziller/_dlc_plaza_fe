import axios from 'axios';
import { API_URL, DEFAULT_ORACLE } from '../config';
import { getToken } from './token';
import {
  LiquidityAllocationRequest,
  LiquidityAllocationResponse,
  LiquidityAllocationV1Request,
  LiquidityAllocationV1Response,
  LiquidityMarketResponse,
  LiquidityWithdrawalV1Response,
} from '../types/allocationFace';

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

export const postLiquidityAllocationV1 = async (
  params: LiquidityAllocationV1Request
): Promise<LiquidityAllocationV1Response> => {
  const token = getToken();
  if (!token) throw new Error('Authentication required for liquidity allocation.');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(
      `${API_URL}/app/dlcp/v1/liqu-allocation-requ`,
      params,
      { headers }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        const data = error.response.data;
        const errorDetail = data?.detail;
        if (Array.isArray(errorDetail)) {
          throw new Error(errorDetail[0].msg);
        } else if (errorDetail) {
          throw new Error(`Bad Request: ${errorDetail}`);
        } else if (data?.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Bad Request');
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

export const getLiquidityMarket = async (
  productId: string,
  oracle: string = DEFAULT_ORACLE,
  depth: number = 1,
  role?: 'lend' | 'borrow'
): Promise<LiquidityMarketResponse> => {
  const params: Record<string, string | number> = { product_id: productId, oracle, depth };
  if (role) params.role = role;
  const response = await axios.get(`${API_URL}/app/dlcp/v1/liquidity-market`, { params });
  return response.data;
};

export const postLiquidityWithdrawalV1 = async (
  params: LiquidityAllocationV1Request
): Promise<LiquidityWithdrawalV1Response> => {
  const token = getToken();
  if (!token) throw new Error('Authentication required for liquidity withdrawal.');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(
      `${API_URL}/app/dlcp/v1/liqu-withdrawal-requ`,
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
