export const isSignerAuthCode = (value: unknown): boolean => {
  const code = Number(value)
  if (!Number.isFinite(code)) return false
  // Signer flag is stored in the 2^2 (value 4) bit of auth_code
  return (code & 4) === 4
}

export const isSubscriberAuthCode = (value: unknown): boolean => {
  const code = Number(value)
  if (!Number.isFinite(code)) return false
  // Newsletter subscriber flag is the LSB (bit 0) of auth_code
  return (code & 1) === 1
}
