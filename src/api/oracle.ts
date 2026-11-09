import axios from 'axios';
import { API_URL } from '../config';

export interface OracleInfo {
  oracle_id: string;
  [k: string]: unknown;
}

interface OraclesResponse {
  timestamp: number;
  payload: OracleInfo[];
  message: string;
}

export async function getOracles(): Promise<OraclesResponse> {
  const response = await axios.get<OraclesResponse>(
    `${API_URL}/app/dlcp/v1/oracles`
  );
  return response.data;
}

// ---------------------------------------------------------------------------
// Oracle Directory (FE issue #2)
//
// Same endpoint as above. The backend (config_dlc.py / config_dlc_test.py via the
// `oracles` table) is the single source of truth for WHICH oracles exist, their
// symbols and their public URLs; nothing about a particular oracle is hardcoded
// here. Fields that older backends do not send yet are simply null.
// ---------------------------------------------------------------------------

export interface OracleDirectoryEntry {
  /** Canonical identifier (backend `oracle_name`, e.g. "oracle_dlcp"). */
  id: string;
  /** Human readable provider name (backend `provider`). */
  provider: string;
  symbols: string[];
  /** Public landing page. Never derived from `endpoint`. http(s) only, else null. */
  homepageUrl: string | null;
  /** API base URL, informational only. http(s) only, else null. */
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
 * Fetch the configured Oracle inventory of the backend this site is talking to.
 * Throws if the request fails or the payload is not a list (the UI shows an error state).
 * An empty list is a valid result (the UI shows an empty state).
 */
export async function getOracleDirectory(): Promise<OracleDirectoryEntry[]> {
  const response = await axios.get(`${API_URL}/app/dlcp/v1/oracles`, {
    timeout: 10000,
    headers: { Accept: 'application/json' },
  });
  const payload = response.data?.payload;
  if (!Array.isArray(payload)) {
    throw new Error('Unexpected oracle list response');
  }
  return payload
    .map(normalizeOracleDirectoryEntry)
    .filter((e): e is OracleDirectoryEntry => e !== null);
}
