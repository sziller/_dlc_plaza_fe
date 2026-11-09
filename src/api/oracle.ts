import axios from 'axios';
import { API_URL, DEFAULT_ORACLE } from '../config';

// ---------------------------------------------------------------------------
// Oracle inventory client — the ONE place that reads the backend's oracle list.
//
// GET {API_URL}/app/dlcp/v1/oracles   (public)
//   payload[]: { oracle_name, provider, supported_symbols,
//                homepage_url?, endpoint?, endpoint_price?, active? }
//
// The backend (config_dlc.py / config_dlc_test.py via the `oracles` table) is the
// single source of truth for WHICH oracles exist, their symbols and their public
// URLs; nothing about a particular oracle is hardcoded here. API_URL is chosen at
// runtime from the hostname (config.ts), so one build serves every environment.
// Fields that older backends do not send yet are simply null.
// ---------------------------------------------------------------------------

export interface OracleDirectoryEntry {
  /** Canonical identifier (backend `oracle_name`, e.g. "oracle_dlcp"). */
  id: string;
  /** Human readable provider name (backend `provider`). */
  provider: string;
  symbols: string[];
  /** Public landing page. Never derived from `endpoint`. http(s) only, else null. */
  homepageUrl: string | null;
  /** API base URL of the oracle. http(s) only, else null. */
  endpoint: string | null;
  /** Price endpoint, informational only. "N/A" and other non-URLs become null. */
  endpointPrice: string | null;
  /** true / false as configured; null when the backend did not report it. */
  active: boolean | null;
}

/** Accepts only absolute http(s) URLs (blocks javascript:, data:, etc. in rendered links). */
export function toHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    return u.protocol === 'http:' || u.protocol === 'https:' ? trimmed : null;
  } catch {
    return null;
  }
}

export function normalizeOracleDirectoryEntry(raw: unknown): OracleDirectoryEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  // `oracle_name` is the authoritative identifier of the backend contract.
  const id = typeof r.oracle_name === 'string' ? r.oracle_name.trim() : '';
  if (!id) return null;
  const provider =
    typeof r.provider === 'string' && r.provider.trim() ? r.provider.trim() : id;
  const symbols = Array.isArray(r.supported_symbols)
    ? r.supported_symbols.filter((s): s is string => typeof s === 'string' && s.length > 0)
    : [];
  return {
    id,
    provider,
    symbols,
    homepageUrl: toHttpUrl(r.homepage_url),
    endpoint: toHttpUrl(r.endpoint),
    endpointPrice: toHttpUrl(r.endpoint_price),
    active: typeof r.active === 'boolean' ? r.active : null,
  };
}

/**
 * The backend does not guarantee any row order, so pin the platform default oracle
 * (DEFAULT_ORACLE, the one price/liquidity calls already default to) first and keep the
 * backend order for the rest. Not an inventory: it only orders what the backend sent.
 */
function defaultFirst(entries: OracleDirectoryEntry[]): OracleDirectoryEntry[] {
  return [
    ...entries.filter((e) => e.id === DEFAULT_ORACLE),
    ...entries.filter((e) => e.id !== DEFAULT_ORACLE),
  ];
}

async function fetchOracleDirectory(): Promise<OracleDirectoryEntry[]> {
  const response = await axios.get(`${API_URL}/app/dlcp/v1/oracles`, {
    timeout: 10000,
    headers: { Accept: 'application/json' },
  });
  const payload = response.data?.payload;
  if (!Array.isArray(payload)) {
    throw new Error('Unexpected oracle list response');
  }
  return defaultFirst(
    payload
      .map(normalizeOracleDirectoryEntry)
      .filter((e): e is OracleDirectoryEntry => e !== null),
  );
}

// One request per page session is shared by every consumer (directory, Oracle page,
// oracle selection). Failures are never cached, so the next call retries.
let cached: Promise<OracleDirectoryEntry[]> | null = null;

/**
 * The configured Oracle inventory of the backend this site is talking to.
 * Throws if the request fails or the payload is not a list (the UI shows an error state).
 * An empty list is a valid result (the UI shows an empty state).
 */
export function getOracleDirectory(opts: { force?: boolean } = {}): Promise<OracleDirectoryEntry[]> {
  if (!cached || opts.force) {
    const p = fetchOracleDirectory();
    cached = p;
    p.catch(() => {
      if (cached === p) cached = null;
    });
  }
  return cached;
}

/**
 * API base URL (always ending in "/") of an oracle, taken from the backend's own metadata
 * for the CURRENT environment — never a hardcoded production/staging URL.
 * Returns null when the backend does not (yet) report it; callers must treat that as
 * "unavailable" and not fall back to some other environment's oracle.
 */
export function oracleApiBase(
  entries: OracleDirectoryEntry[],
  oracleId: string = DEFAULT_ORACLE,
): string | null {
  const endpoint = entries.find((e) => e.id === oracleId)?.endpoint;
  if (!endpoint) return null;
  return endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
}
