// Single source of truth for Cadena's fee rate, so the order-flow math
// (OrderModal.vue, MarketOverviewTable.vue) and any place that just displays
// the fee (DLCDetails.vue) can't drift out of sync with each other.
export const FEE_PCT = 0.01
