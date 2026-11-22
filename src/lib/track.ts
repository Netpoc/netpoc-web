/**
 * Analytics. `track()` queues GA4 events on `window.dataLayer` via `gtag()`.
 * The GA4 script itself loads only after the visitor accepts analytics
 * (see `lib/consent.ts`), at which point queued events from this visit are
 * sent. Declined or unanswered = nothing leaves the browser.
 * Never pass PII (names, emails, phone numbers) as params.
 */
type Params = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export const GA_ID = import.meta.env.VITE_GA_ID as string | undefined

if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag() {
      // gtag.js only reads `arguments` objects, not arrays.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments)
    }
  window.gtag('js', new Date())
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}

let loaded = false

/**
 * Inject GA4. Called once consent is granted. `sendPageView` is true when the
 * visitor accepts mid-visit (the router already passed this page); at startup
 * the router's first navigation sends it instead.
 */
export function loadAnalytics({ sendPageView }: { sendPageView: boolean }) {
  if (loaded || !GA_ID || typeof document === 'undefined') return
  loaded = true
  window.gtag('consent', 'update', { analytics_storage: 'granted' })
  // Page views are sent by the router hook, so turn off the automatic one.
  window.gtag('config', GA_ID, { send_page_view: false })
  if (sendPageView) trackPageView()
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(s)
}

export function track(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return
  window.gtag('event', event, params)
  if (import.meta.env.DEV) console.debug('[track]', event, params)
}

/** SPA page view; a no-op until analytics has loaded. */
export function trackPageView() {
  if (!loaded) return
  window.gtag('event', 'page_view', { page_location: location.href, page_title: document.title })
}
