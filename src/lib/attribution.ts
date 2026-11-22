/**
 * First-touch attribution for the visit. A visitor who lands on `/` from a
 * LinkedIn post and then clicks through to `/fuelpay` or `/contact` keeps the
 * UTMs, landing page and referrer they arrived with.
 *
 * Stored in sessionStorage (this tab, this visit). No personal data.
 * UTM convention for campaigns: docs/marketing/utm.md.
 */
import type { LocationQuery } from 'vue-router'

const KEY = 'netpoc-first-touch'

export type Attribution = Record<string, string>

/** Pull `utm_*` params out of a route query (first value wins). */
export function utmFromQuery(query: LocationQuery): Attribution {
  const out: Attribution = {}
  for (const [k, v] of Object.entries(query)) {
    const value = Array.isArray(v) ? v[0] : v
    if (k.startsWith('utm_') && typeof value === 'string') out[k] = value.slice(0, 100)
  }
  return out
}

let memory: Attribution | null = null

function read(): Attribution | null {
  if (memory) return memory
  try {
    const raw = sessionStorage.getItem(KEY)
    memory = raw ? (JSON.parse(raw) as Attribution) : null
  } catch {
    /* storage blocked: fall back to this page load only */
  }
  return memory
}

/** Call on every navigation; only the first one in a visit is recorded. */
export function captureFirstTouch(path: string, query: LocationQuery) {
  if (read()) return
  memory = {
    ...utmFromQuery(query),
    landing_page: path,
    referrer: document.referrer.slice(0, 300),
  }
  try {
    sessionStorage.setItem(KEY, JSON.stringify(memory))
  } catch {
    /* kept in memory for this page load */
  }
}

/**
 * Attribution fields to send with a lead. UTMs on the current URL win over
 * first-touch ones (e.g. a fresh campaign link opened in the same tab).
 */
export function leadAttribution(query: LocationQuery, pagePath: string): Attribution {
  const current = utmFromQuery(query)
  const first = read() ?? {}
  const utms = Object.keys(current).length ? current : utmFromQuery(first as LocationQuery)
  return {
    ...utms,
    landing_page: first.landing_page ?? pagePath,
    referrer: first.referrer ?? document.referrer,
    page_url: window.location.origin + pagePath,
  }
}

/** Just the UTMs, for forwarding to the demo app or the mobile PoC page. */
export function currentUtms(query: LocationQuery): Attribution {
  const current = utmFromQuery(query)
  return Object.keys(current).length ? current : utmFromQuery((read() ?? {}) as LocationQuery)
}
