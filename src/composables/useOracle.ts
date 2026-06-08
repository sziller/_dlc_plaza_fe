import { ref, computed } from 'vue'
import { DEFAULT_ORACLE, oracleDisplayName } from '../config'
import { getOracles, type OracleInfo } from '../api/oracle'

// Module-scoped refs — shared across all components (singleton pattern)
const selectedOracleId = ref<string>(DEFAULT_ORACLE)
const oracles = ref<OracleInfo[]>([])
let fetched = false

const oracleLabel = computed(() => oracleDisplayName(selectedOracleId.value))

async function fetchOracles(): Promise<void> {
  if (fetched) return
  try {
    const res = await getOracles()
    const list = Array.isArray(res?.payload) ? res.payload : []
    if (list.length > 0) {
      oracles.value = list
      const firstId = list[0].oracle_id
      if (firstId) selectedOracleId.value = firstId
    }
    fetched = true
  } catch (e) {
    console.debug('Oracle list fetch failed (using default):', e)
    // Keep DEFAULT_ORACLE — endpoint may not exist yet
  }
}

function resolveOracleFromProducts(
  products: Array<{ orcl_id?: string[]; [k: string]: unknown }>
): void {
  if (!products || products.length === 0) return
  const first = products[0]
  if (Array.isArray(first.orcl_id) && first.orcl_id.length > 0) {
    const id = first.orcl_id[0]
    if (id) selectedOracleId.value = id
  }
}

function setOracle(id: string): void {
  selectedOracleId.value = id
}

export function useOracle() {
  return {
    selectedOracleId,
    oracleLabel,
    oracles,
    fetchOracles,
    resolveOracleFromProducts,
    setOracle,
  }
}
