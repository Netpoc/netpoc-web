import { ref } from 'vue'
import { GA_ID, loadAnalytics } from '@/lib/track'

/** `null` = not asked yet. Stored on this device only. */
export type Consent = 'granted' | 'denied' | null

const KEY = 'netpoc-analytics-consent'

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

/** There is only something to consent to when a GA4 ID is configured. */
export const analyticsEnabled = Boolean(GA_ID)

export const consent = ref<Consent>(read())
/** Whether the banner is showing: first visit, or reopened from the footer. */
export const consentOpen = ref(analyticsEnabled && consent.value === null)

export function openConsent() {
  consentOpen.value = true
}

export function setConsent(value: 'granted' | 'denied') {
  consent.value = value
  consentOpen.value = false
  try {
    localStorage.setItem(KEY, value)
  } catch {
    /* storage blocked: the choice holds for this visit only */
  }
  if (value === 'granted') loadAnalytics({ sendPageView: true })
  // Withdrawn after loading: tell GA4 to stop storing and sending identifiers.
  else window.gtag('consent', 'update', { analytics_storage: 'denied' })
}

/** Call once at startup: returning visitors who already agreed get analytics. */
export function initConsent() {
  if (consent.value === 'granted') loadAnalytics({ sendPageView: false })
}
