export async function generateIdempotencyKey(): Promise<string> {
  const uuid = crypto.randomUUID()
  const encoded = new TextEncoder().encode(uuid)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
