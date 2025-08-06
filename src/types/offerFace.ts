export interface Offer {
  dlc_id: string;
  temporary_contract_id: string;
  ini_role: string;
  oracle_id: string;
  status: string;
  interest: number;
  created_at: number;
  updated_at: number;
  timeout_at: number | null;
  ini_email: string | null;
}

export interface OffersResponse {
  timestamp: number;
  payload: OfferData[];
  message: string;
}

export interface OfferData {
  product_id: string;
  dlc_id: string;
  tmp_cntr_id: string;
  duration: number; // Duration in days
  ini_role: string;
  interest: number;
  interest_ear: number;
  status: string;
  ini_email: string | null;
  acc_collateral_sats: number; // New field: Accepted collateral in satoshis
  chain_hash: string; // New field: Chain hash
  cntr_flags: number; // New field: Counter flags
  created_at: number; // Timestamp when the offer was created
  expiry_offer: number; // New field: Expiry timestamp of the offer
  ini_collateral_sats: number; // New field: Initial collateral in satoshis
  offered_at: number; // New field: Timestamp when the offer was made
  orcl_id: string; // New field: Oracle ID
  protocol_version: number; // New field: Protocol version
  updated_at: number; // Timestamp when the offer was last updated
}

export interface OfferResponse {
  payload: OfferData;
  message: string;
}

export interface OfferProps {
  title: string;
  offers: OfferData[];
  textColor: string;
  offerClass: string;
}

export interface OfferPostFace {
  ini_role: string;
  interest: number;
  // tmp_cntr_id?: string;
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
  ini_role?: string;
  interest?: number;
}


export interface OfferPostFormProps {
  role: 'lend' | 'borrow';
  title?: string;
  onClose: () => void; // Add onClose prop to handle closing the form
  onClick?: () => void; // Optional onClick prop for additional functionality
}
