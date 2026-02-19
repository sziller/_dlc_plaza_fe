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
  notional: number
  required_collateral: number
  quantity: number
  allocated_collateral: number
}

export interface AllocationPayload {
  ini_role: string
  interest: number
  foreign_collateral: number
  oracle: string
  base_product: string
  margin_percent: number
  total_foreign_collateral: number
  total_allocated_collateral: number
  unallocated_collateral: number
  allocation: AllocationTier[]
}

export interface LiquidityAllocationResponse {
  timestamp: number
  payload: AllocationPayload
  message: string
}
