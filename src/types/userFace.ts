export interface UserFace {
  email_address: string;
  password: string;
}

export interface UserProfilePayload {
  auth_code: number;
  pubkey: string;
  email: string;
  timestamp: number;
  xpub: string;
  psswd_hsh: string;
  uuid: string;
  disabled: boolean;
  balance_derived: number;
  balance_onchain: number;
}

export interface UserProfileResponse {
  timestamp: number;
  payload: UserProfilePayload;
  message: string;
}
export interface UserOwnDerivedBalance {
  timestamp: number;
  payload: number;
  message: string;
}