import { ref } from 'vue'

export type ProfilePayload = {
  email: string
  uuid: string
  auth_code: number
  xpub: string
  balance_onchain: number
  balance_derived: number
  timestamp: number
  disabled: boolean
  uuid_parent: string | null
  referral_code: string | null
  par_referral_code: string | null
  referral_first_touch_ts: number | null
}

type CacheShape = { payload: ProfilePayload; fetchedAt: number }

const KEY = 'userProfile'
const inMemory = ref<ProfilePayload | null>(null)
const fetchedAt = ref<number | null>(null)

// read from sessionStorage once (on first import)
try {
  const raw = sessionStorage.getItem(KEY)
  if (raw) {
    const obj = JSON.parse(raw) as CacheShape
    inMemory.value = obj.payload
    fetchedAt.value = obj.fetchedAt
  }
} catch {}

export function getCachedProfile() {
  return inMemory.value
}

export function getCachedAgeMs() {
  return fetchedAt.value ? Date.now() - fetchedAt.value : Number.POSITIVE_INFINITY
}

export function setCachedProfile(payload: ProfilePayload | null) {
  inMemory.value = payload
  fetchedAt.value = payload ? Date.now() : null
  if (payload) {
    sessionStorage.setItem(KEY, JSON.stringify({ payload, fetchedAt: Date.now() }))
  } else {
    sessionStorage.removeItem(KEY)
  }
}
