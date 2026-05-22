import { ref, computed, readonly } from 'vue'
import type { Ref } from 'vue'
import { getOracles } from '../api/oracles'
import type { OracleInfo } from '../api/oracles'
import { DEFAULT_ORACLE, oracleDisplayName } from '../config'

// Module-level state — one instance shared across all components.
const availableOracles: Ref<OracleInfo[]> = ref([])
const selectedOracle: Ref<string> = ref(DEFAULT_ORACLE)
let fetchPromise: Promise<void> | null = null

export function useOracle() {
  const selectedOracleLabel = computed(() => oracleDisplayName(selectedOracle.value))

  function setOracle(id: string): void {
    if (id && id !== selectedOracle.value) {
      selectedOracle.value = id
    }
  }

  // Idempotent — only fetches once regardless of how many components call it.
  function fetchOracles(): Promise<void> {
    if (fetchPromise) return fetchPromise
    fetchPromise = getOracles()
      .then((oracles) => {
        if (oracles.length > 0) {
          availableOracles.value = oracles
          const ids = oracles.map((o) => o.id)
          if (!ids.includes(selectedOracle.value)) {
            selectedOracle.value = ids[0]
          }
        }
      })
      .catch(() => {
        // DEFAULT_ORACLE remains active as fallback
      })
    return fetchPromise
  }

  return {
    availableOracles: readonly(availableOracles),
    selectedOracle: readonly(selectedOracle),
    selectedOracleLabel,
    setOracle,
    fetchOracles,
  }
}
