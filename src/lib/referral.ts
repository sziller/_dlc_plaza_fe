// src/lib/referral.ts
/**
 * Referral cookie utilities.
 * - Cookie name: referral_code
 * - Sent via Cookie header only (do NOT add to JSON payload)
 * - Works on localhost and on *.purabitcoin.com / *.cadenabitcoin.com
 */

export const REFERRAL_COOKIE = 'referral_code';
const KNOWN_ROOTS = ['purabitcoin.com', 'cadenabitcoin.com'];
const DEFAULT_TTL_DAYS = Number(import.meta.env.VITE_REF_TTL_DAYS ?? 90);

/** true for localhost / 127.0.0.1 / ::1 / raw IPs */
function isLocalHostLike(host: string): boolean {
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]' ||
    /^\d+\.\d+\.\d+\.\d+$/.test(host)
  );
}

/** registrable root from host (best-effort) */
function registrableRoot(host: string): string {
  const parts = host.split('.');
  return parts.length >= 2 ? parts.slice(-2).join('.') : host;
}

/** Decide cookie Domain attribute.
 * Priority:
 * 1) VITE_COOKIE_DOMAIN (e.g. ".purabitcoin.com") if set and not localhost
 * 2) Auto: .purabitcoin.com / .cadenabitcoin.com when on those roots
 * 3) Omit Domain on localhost/dev
 */
function cookieDomainAttr(): string {
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  if (!host) return '';

  // respect explicit override
  const cfg = (import.meta.env.VITE_COOKIE_DOMAIN || '').trim();
  if (cfg && !isLocalHostLike(host)) {
    const dom = cfg.startsWith('.') ? cfg : `.${cfg}`;
    return `; Domain=${dom}`;
  }

  // auto for known roots
  const root = registrableRoot(host);
  if (!isLocalHostLike(host) && KNOWN_ROOTS.includes(root)) {
    return `; Domain=.${root}`;
  }

  // host-only (localhost)
  return '';
}

/** Compose cookie attributes based on environment */
function cookieAttrs(ttlDays = DEFAULT_TTL_DAYS): string {
  const exp = new Date(Date.now() + ttlDays * 864e5).toUTCString();
  const isHttps =
    typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secure = isHttps ? '; Secure' : '';
  // Lax is fine for same-site (subdomains count as same-site)
  return `; Path=/; Expires=${exp}; SameSite=Lax${secure}${cookieDomainAttr()}`;
}

/** Low-level write */
function writeCookie(name: string, value: string, ttlDays?: number): void {
  document.cookie = `${name}=${value}${cookieAttrs(ttlDays)}`;
}

/** Low-level delete (attempts multiple domains to be safe) */
function deleteCookieAllScopes(name: string): void {
  const base = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
  const isHttps =
    typeof window !== 'undefined' && window.location.protocol === 'https:';
  const sec = isHttps ? '; Secure' : '';
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const root = registrableRoot(host);

  // host-only
  document.cookie = `${base}; SameSite=Lax${sec}`;
  // known roots
  KNOWN_ROOTS.forEach((r) => {
    document.cookie = `${base}; SameSite=Lax; Domain=.${r}${sec}`;
  });
  // current root guess
  if (root && KNOWN_ROOTS.includes(root)) {
    document.cookie = `${base}; SameSite=Lax; Domain=.${root}${sec}`;
  }
}

/** Public API **/

export function setReferralCookie(code: string, ttlDays?: number): void {
  // light sanity-check; tweak if your codes differ
  if (!/^[A-Za-z0-9_-]{4,128}$/.test(code)) return;
  writeCookie(REFERRAL_COOKIE, encodeURIComponent(code), ttlDays);
}

export function getReferralCookie(): string | null {
  const m = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${REFERRAL_COOKIE}=([^;]+)`)
  );
  return m ? decodeURIComponent(m[1]) : null;
}

export function clearReferralCookie(): void {
  deleteCookieAllScopes(REFERRAL_COOKIE);
}

/** Capture ?ref=... (or ?r=... / ?referral=...) and store as cookie. */
export function captureReferralFromURL(opts?: {
  keys?: string[]; // default ['ref','r','referral']
  cleanURL?: boolean; // default true
  ttlDays?: number;
}): void {
  const keys = opts?.keys ?? ['ref', 'r', 'referral'];
  const params = new URLSearchParams(window.location.search);
  let code: string | null = null;
  for (const k of keys) {
    const v = params.get(k);
    if (v?.trim()) {
      code = v.trim();
      break;
    }
  }
  if (!code) return;

  setReferralCookie(code, opts?.ttlDays);

  if (opts?.cleanURL !== false && window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
  }
}

/** Clean up legacy/bad cookies so only referral_code remains. */
export function purgeLegacyReferralCookies(): void {
  // Nukes: cb_ref (JSON) and misspelled refferal_code
  deleteCookieAllScopes('cb_ref');
  deleteCookieAllScopes('refferal_code');
}
