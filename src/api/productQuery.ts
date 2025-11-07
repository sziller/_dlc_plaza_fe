// src/api/productQuery.v0.ts
import axios, { AxiosError } from 'axios';
import { API_URL } from '../config';

export interface ApiEnvelope<T> {
  timestamp: number;
  payload: T;
  message: string;
}

export interface ProductLendBorrowDtoLtd {
  product_id: string;
  ltv: number;
  duration: number;
  orcl_id: string[];
  expiry_offer_default_hours: number;
  expiry_deal_acc_minutes: number;
  expiry_deal_ini_minutes: number;
  refund_delay_days: number;
  contract_value: number;
  service_fee_percent: number;
  service_fee_split_percent: number;
  payout_boost_sats: number;
  num_digits: number;
  [k: string]: unknown;
}

/**
 * POST /app/dlcp/v0/product-query
 * Body is a raw array of product_ids. Empty array => “all products”.
 */
export async function postProductQueryV0(
  productIds: string[] = []
): Promise<ApiEnvelope<ProductLendBorrowDtoLtd[]>> {
  const url = `${API_URL}/app/dlcp/v0/product-query`;
  try {
    const res = await axios.post<ApiEnvelope<ProductLendBorrowDtoLtd[]>>(
      url,
      productIds, // raw array body, e.g. []
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (err) {
    const e = err as AxiosError<any>;
    if (e.response) {
      if (e.response.status === 500) throw new Error('Internal Server Error');
      const detail =
        e.response.data?.detail ?? e.response.data?.message ?? e.message;
      throw new Error(`Request failed: ${detail}`);
    }
    throw new Error(e.message || 'Network error');
  }
}
