// /types/allocationFace.ts

export interface LiquidityAllocationRequest {
  ini_role: 'lend' | 'borrow'
  interest: number
  foreign_collateral: number
  oracle: 'oracle_dlcp' | 'oracle_dfx'
  base_product: string
  margin_percent: number
}

export interface AllocationTier {
  notional_foreign: number
  required_foreign_net_collateral: number
  required_foreign_gross_collateral: number
  required_btc_sats_per_contract: number
  quantity: number
  allocated_foreign_collateral: number
  btc_liquidity_for_tier: number
}

export interface AllocationPayload {
  ini_role: string
  interest: number
  foreign_collateral: number
  oracle: string
  base_product: string
  margin_percent: number
  total_foreign_collateral: number
  allocated_foreign_collateral: number
  unallocated_foreign_collateral: number
  allocation: AllocationTier[]
  required_btc_liquidity: number
  available_btc_liquidity: number
  is_covered: boolean
}

export interface AllocationRawResponse {
  contract_details?: {
    total_foreign_collateral?: number
    allocated_foreign_collateral?: number
    unallocated_foreign_collateral?: number
    required_btc_liquidity?: number
    allocation?: AllocationTier[]
    [key: string]: unknown
  }
  available_btc_liquidity?: number
  is_covered?: boolean
  [key: string]: unknown
}

export interface LiquidityAllocationResponse {
  timestamp: number
  payload: AllocationRawResponse
  message: string
}
