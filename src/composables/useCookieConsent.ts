import { computed, ref } from 'vue'

export type CookieCategory = 'necessary' | 'analytics' | 'marketing'

export type CookiePreferences = Record<CookieCategory, boolean>

type CookieConsentState = {
  version: number
  updatedAt: number
  consented: boolean
  preferences: CookiePreferences
}

export const COOKIE_CONSENT_EVENT = 'cookie-consent-changed'
const STORAGE_KEY = 'cookie-consent'
const CONSENT_COOKIE = 'cookie_consent'
const CURRENT_VERSION = 1

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
}

const defaultState: CookieConsentState = {
  version: CURRENT_VERSION,
  updatedAt: 0,
  consented: false,
  preferences: { ...defaultPreferences },
}

const canUseStorage = () => typeof window !== 'undefined'

const readState = (): CookieConsentState => {
  if (!canUseStorage()) return { ...defaultState }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState }
    const parsed = JSON.parse(raw) as CookieConsentState
    if (parsed.version !== CURRENT_VERSION) return { ...defaultState }
    return {
      ...defaultState,
      ...parsed,
      preferences: { ...defaultPreferences, ...parsed.preferences },
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to parse cookie consent state', error)
    }
    return { ...defaultState }
  }
}

const state = ref<CookieConsentState>(readState())

const persist = () => {
  if (!canUseStorage()) return
  try {
    const payload = JSON.stringify(state.value)
    window.localStorage.setItem(STORAGE_KEY, payload)
    document.cookie = `${CONSENT_COOKIE}=${state.value.consented ? 'accepted' : 'pending'}; Path=/; SameSite=Lax`
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: state.value }))
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to persist cookie consent state', error)
    }
  }
}

const setState = (next: CookieConsentState) => {
  state.value = { ...next, preferences: { ...next.preferences } }
  persist()
}

const updatePreferences = (prefs: Partial<CookiePreferences>, markConsented = true) => {
  setState({
    ...state.value,
    updatedAt: Date.now(),
    consented: markConsented ? true : state.value.consented,
    preferences: { ...state.value.preferences, ...prefs, necessary: true },
  })
}

export const useCookieConsent = () => {
  const preferences = computed(() => state.value.preferences)
  const consented = computed(() => state.value.consented)
  const lastUpdated = computed(() => state.value.updatedAt)
  const shouldShowBanner = computed(() => !state.value.consented)

  const acceptAll = () => {
    updatePreferences(
      {
        analytics: true,
        marketing: true,
      },
      true
    )
  }

  const rejectNonEssential = () => {
    updatePreferences(
      {
        analytics: false,
        marketing: false,
      },
      true
    )
  }

  const saveCustomPreferences = (prefs: Partial<CookiePreferences>) => {
    updatePreferences(prefs, true)
  }

  const resetConsent = () => {
    setState({ ...defaultState })
  }

  return {
    preferences,
    consented,
    lastUpdated,
    shouldShowBanner,
    acceptAll,
    rejectNonEssential,
    saveCustomPreferences,
    resetConsent,
  }
}

export const getCookieConsentSnapshot = (): CookieConsentState => ({
  ...state.value,
  preferences: { ...state.value.preferences },
})

export const onCookieConsentChange = (
  callback: (next: CookieConsentState) => void
) => {
  if (!canUseStorage()) return () => {}
  const handler = (event: Event) => {
    const detail =
      (event as CustomEvent<CookieConsentState>).detail || getCookieConsentSnapshot()
    callback(detail)
  }
  window.addEventListener(COOKIE_CONSENT_EVENT, handler)
  return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handler)
}
