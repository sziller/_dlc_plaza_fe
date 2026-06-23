import { ref, computed } from 'vue'

const priceSymbol = ref<'BTCUSD' | 'BTCEUR'>('BTCUSD')

const priceCurrencySign = computed(() => priceSymbol.value === 'BTCEUR' ? '€' : '$')
const priceFlagCode = computed(() => priceSymbol.value === 'BTCEUR' ? 'eu' : 'us')
const priceFlagAlt = computed(() => priceSymbol.value === 'BTCEUR' ? 'EU Flag' : 'US Flag')

export function usePriceSymbol() {
  return { priceSymbol, priceCurrencySign, priceFlagCode, priceFlagAlt }
}
