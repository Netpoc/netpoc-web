/**
 * Minimal analytics shim. Pushes events onto `window.dataLayer` (GA4 / GTM
 * pick them up once loaded behind cookie consent) and logs them in dev.
 * Never pass PII (names, emails, phone numbers) as params.
 */
type Params = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function track(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer?.push({ event, ...params })
  if (import.meta.env.DEV) console.debug('[track]', event, params)
}
