export const isSignerAuthCode = (value: unknown): boolean => {
  const code = Number(value)
  if (!Number.isFinite(code)) return false
  // Signer flag is stored in the 2^2 (value 4) bit of auth_code
  return (code & 4) === 4
}
