// src/lib/referral.ts
export type RefCookie = {
  code: string;
  setAt: string;                   // ISO timestamp
  source: 'url' | 'manual' | 'default';
};

const REF_COOKIE = 'cb_ref';

const ttlMs = () =>
  Number(import.meta.env.VITE_REF_TTL_DAYS ?? 30) * 24 * 60 * 60 * 1000;

function isLocalhost(host: string) {
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]' ||
    /^\d+\.\d+\.\d+\.\d+$/.test(host)
  );
}

function getCookieDomain(): string | null {
  const configured = (import.meta.env.VITE_COOKIE_DOMAIN || '').trim();
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  if (!configured || isLocalhost(host)) return null; // don’t set Domain= on localhost/IP
  return configured;
}

function writeCookie(name: string, value: string, msToLive: number): void {
  const parts = [
    `${name}=${value}`,
    `Expires=${new Date(Date.now() + msToLive).toUTCString()}`,
    'Path=/',
    'SameSite=Lax',
  ];
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    parts.push('Secure');
  }
  const domain = getCookieDomain();
  if (domain) parts.push(`Domain=${domain}`);
  document.cookie = parts.join('; ');
}

export function getRefCookie(): RefCookie | null {
  const m = document.cookie.split('; ').find(c => c.startsWith(`${REF_COOKIE}=`));
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m.split('=')[1])) as RefCookie;
  } catch {
    return null;
  }
}

export function setRefCookie(
  code: string,
  source: RefCookie['source'] = 'url'
): void {
  const payload: RefCookie = { code, setAt: new Date().toISOString(), source };
  writeCookie(REF_COOKIE, encodeURIComponent(JSON.stringify(payload)), ttlMs());
}

export function clearRefCookie(): void {
  const base =
    `${REF_COOKIE}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
  const sec =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';
  const domain = getCookieDomain();
  document.cookie = domain ? `${base}; Domain=${domain}${sec}` : `${base}${sec}`;
}

function qVal(q: Record<string, any>, k: string): string | undefined {
  const v = q?.[k];
  return typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined;
}

export function maybeCaptureFromQuery(q: Record<string, any>): void {
  const code = (qVal(q, 'r') ?? qVal(q, 'ref') ?? qVal(q, 'referral'))?.trim();
  if (!code) return;
  const force = (qVal(q, 'r_force') ?? '').toLowerCase() === '1';
  const existing = getRefCookie();
  if (existing && !force) return; // first touch wins
  setRefCookie(code, 'url');
}

export function ensureDefaultIfEmpty(): RefCookie | null {
  const existing = getRefCookie();
  if (existing) return existing;
  const def = (import.meta.env.VITE_REF_DEFAULT || '').trim();
  if (!def) return null;
  setRefCookie(def, 'default');
  return getRefCookie();
}
