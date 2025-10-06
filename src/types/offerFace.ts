// /types/offerFace.ts
export interface OffersResponse {
  timestamp: number;
  payload: OfferData[];
  message: string;
}

export interface OfferData {
  product_id: string;
  dlc_id: string;
  tmp_cntr_id: string;
  /** Duration may come as days or a fraction of a year; we parse days from product_id anyway */
  duration: number;
  ini_role: 'lend' | 'borrow';
  interest: number;
  interest_ear: number;
  status: string;

  // --- The rest are not guaranteed by GET_offers_for_user; mark optional ---
  ini_email?: string | null;
  acc_collateral_sats?: number;
  chain_hash?: string;
  cntr_flags?: number;
  created_at?: number;
  expiry_offer?: number;
  ini_collateral_sats?: number;
  offered_at?: number;
  orcl_id?: string;
  protocol_version?: number;
  updated_at?: number;
}

export interface OfferResponse {
  payload: OfferData;
  message: string;
}

export interface OfferPostFace {
  ini_role: 'lend' | 'borrow';
  interest: number;
}

export interface PostOfferParams {
  product_id: string;
  tmp_cntr_id: string;
  ini_role: 'lend' | 'borrow';
  interest: number;
}

export interface AcceptOfferParams {
  dlc_id: string;
  status?: string;
  ini_email?: string;
  tmp_cntr_id?: string;
  ini_role?: 'lend' | 'borrow';
  interest?: number;
}
