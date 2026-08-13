// Same host as BookCheckout.vue / slackNotify.ts's collateral-email call —
// kit-subscribe.js lives in this same Vercel project (deployed at
// book-api-cadena-website.vercel.app), so calling it by absolute URL means
// this works identically whether the frontend itself is running on that
// deployment or on localhost during dev — a relative path would only
// resolve correctly in the former case.
const BOOK_API = import.meta.env.VITE_BOOK_API as string | undefined

// Fire-and-forget: adds the user to Kit and applies the "Newly added
// subscriber" tag once registration (signer pairing) completes. Non-critical
// — never blocks or fails the registration flow if Kit is unreachable.
export function notifyKitNewSubscriber(email: string) {
  if (!email || !BOOK_API) return
  fetch(`${BOOK_API}/api/kit-subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).catch(() => {})
}
