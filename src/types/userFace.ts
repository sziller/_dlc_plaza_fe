export interface UserFace {
  email_address: string;
  password: string;
}

export interface UserProfilePayload{
  timestamp: number
  payload: {
    email: string
    uuid: string
    auth_code: number
    xpub: string
    balance_onchain: number
    balance_derived: number
    timestamp: number
    disabled: boolean
    uuid_parent: string | null
    referral_code: string | null                 // NEW
    par_referral_code: string | null             // NEW
    referral_first_touch_ts: number | null       // NEW
  }
  message: string
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