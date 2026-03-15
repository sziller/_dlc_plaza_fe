import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from './token';
import {
  LiquidityAllocationRequest,
  LiquidityAllocationAuthRequest,
  LiquidityAllocationResponse,
  LiquidityAllocationV1Request,
  LiquidityAllocationV1Response,
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

export const postLiquidityAllocationAuth = async (
  params: LiquidityAllocationAuthRequest
): Promise<LiquidityAllocationResponse> => {
  const token = getToken();
  if (!token) throw new Error('Authentication required for allocation simulation.');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  console.debug('[postLiquidityAllocationAuth] payload:', JSON.stringify(params));

  try {
    const response = await axios.post(
      `${API_URL}/app/dlcp/v0/liqu-alloc-request`,
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
        console.debug('[postLiquidityAllocationAuth] 422 detail:', JSON.stringify(errorDetail));
        if (Array.isArray(errorDetail)) {
          const loc = errorDetail[0].loc?.join('.') || '';
          const msg = errorDetail[0].msg;
          throw new Error(loc ? `${loc}: ${msg}` : msg);
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
