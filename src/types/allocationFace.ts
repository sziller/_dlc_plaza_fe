// /types/allocationFace.ts

export interface LiquidityAllocationRequest {
  ini_role: 'lend' | 'borrow'
  interest: number
  foreign_collateral: number
  oracle: string
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

// ---- v1 real allocation (locks liquidity) ----

export interface LiquidityAllocationV1Request {
  ini_role: 'lend' | 'borrow'
  interest: number
  oracle?: string[]
  base_product?: string
  liquidity_sat: number
}

export interface LiquidityAllocationV1Payload {
  id: number
  uuid: string
  service_type: string
  oracle_hash: string
  oracle_serialized: string
  interest_bp: number
  ini_role: string
  ltv_percent: number
  duration_days: number
  liquidity_sat: number
  timestamp: number
}

export interface LiquidityAllocationV1Response {
  payload: LiquidityAllocationV1Payload
  message: string
  timestamp: number
}

// ---- v1 user liquidity query ----

export interface LiquidityAllocationQueryRequest {
  fields?: string[] | null
}

export interface UserLiquidityAllocation {
  id: number
  uuid: string
  service_type: string
  oracle_hash: string
  oracle_serialized: string
  interest_bp: number
  ini_role: string
  ltv_percent: number
  duration_days: number
  liquidity_sat: number
  timestamp: number
  // Structured Product parameters — the Source of Truth for Product semantics
  // (financial reference symbol, product function). Not to be reconstructed
  // by parsing service_type / product_id.
  symbol: string
  product_function: string
}

export interface UserLiquidityQueryResponse {
  payload: { allocations: UserLiquidityAllocation[] }
  message: string
  timestamp: number
}

// ---- v1 liquidity market ----

export interface LiquidityMarketResponse {
  payload: {
    lend: Record<string, number>
    borrow: Record<string, number>
  }
  message: string
  timestamp: number
}

// ---- v1 liquidity withdrawal ----

export interface LiquidityWithdrawalV1Response {
  payload: { removed_sat: number; remaining_sat: number }
  message: string
  timestamp: number
}

// ---- v1 liquidity allocation delete ----

export interface LiquidityAllocationDeleteRequest {
  ini_role: 'lend' | 'borrow'
  interest: number
  oracle?: string[]
  base_product?: string
}
