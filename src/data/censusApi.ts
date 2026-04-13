import type { MetroAcsStats, MetroDefinition } from '../types';
import { transformTablesToMetroStats } from '../engine/acsTransforms';

const ACS_YEAR = 2024;
const BASE_URL = `https://api.census.gov/data/${ACS_YEAR}/acs/acs1`;
const CACHE_PREFIX = 'ks-engine:acs:';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

async function fetchJson(url: string): Promise<string[][]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Census API request failed: ${response.status} ${response.statusText}`);
  return (await response.json()) as string[][];
}

function buildUrl(getClause: string, cbsa: string): string {
  const params = new URLSearchParams({ get: getClause, for: `metropolitan statistical area/micropolitan statistical area:${cbsa}` });
  return `${BASE_URL}?${params.toString()}`;
}

function getCached(cbsa: string): MetroAcsStats | null {
  const raw = localStorage.getItem(`${CACHE_PREFIX}${cbsa}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { timestamp: number; data: MetroAcsStats };
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(`${CACHE_PREFIX}${cbsa}`);
      return null;
    }
    return parsed.data;
  } catch {
    localStorage.removeItem(`${CACHE_PREFIX}${cbsa}`);
    return null;
  }
}

function setCached(cbsa: string, data: MetroAcsStats): void {
  localStorage.setItem(`${CACHE_PREFIX}${cbsa}`, JSON.stringify({ timestamp: Date.now(), data }));
}

export async function loadMetroAcsStats(metro: MetroDefinition): Promise<MetroAcsStats> {
  const cached = getCached(metro.cbsa);
  if (cached) return cached;

  const [b01001, b02001, b03003, b12002, b15002, b19013] = await Promise.all([
    fetchJson(buildUrl('NAME,group(B01001)', metro.cbsa)),
    fetchJson(buildUrl('NAME,group(B02001)', metro.cbsa)),
    fetchJson(buildUrl('NAME,group(B03003)', metro.cbsa)),
    fetchJson(buildUrl('NAME,group(B12002)', metro.cbsa)),
    fetchJson(buildUrl('NAME,group(B15002)', metro.cbsa)),
    fetchJson(buildUrl('NAME,B19013_001E', metro.cbsa)),
  ]);

  const data = transformTablesToMetroStats(metro, { b01001, b02001, b03003, b12002, b15002, b19013 });
  setCached(metro.cbsa, data);
  return data;
}
