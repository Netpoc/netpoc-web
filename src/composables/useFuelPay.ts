import { inject, provide, reactive, ref, type InjectionKey, type Ref } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'
import { currentUtms, leadAttribution, type Attribution } from '@/lib/attribution'
import { useMediaQuery } from '@vueuse/core'
import { track } from '@/lib/track'
import { skipScrollOnce } from '@/router'
import { FUELPAY_LINKS, isPlaceholder, isSegment, type Segment } from '@/content/fuelpay'

export type CtaLocation = 'hero' | 'segment' | 'calculator' | 'poc' | 'demo' | 'final' | 'sticky' | 'faq'

/** Loss-calculator values carried into the PoC form as hidden fields. */
export interface CalcValues {
  sites: number
  litres: number
  lossNaira: number
}

export type { Attribution } from '@/lib/attribution'

interface FuelPayContext {
  segment: Ref<Segment | null>
  calc: Ref<CalcValues | null>
  attribution: Attribution
  pocOpen: Ref<boolean>
  selectSegment: (id: Segment) => void
  scrollToSection: (id: string) => void
  openPoc: (location: CtaLocation) => void
  demoHref: (location: CtaLocation) => string
  onDemoClick: (location: CtaLocation) => void
}

const KEY: InjectionKey<FuelPayContext> = Symbol('fuelpay')

export function segmentFromRoute(hash: string, query: LocationQuery): Segment | null {
  const fromHash = hash.replace('#', '')
  if (isSegment(fromHash)) return fromHash
  return isSegment(query.segment) ? query.segment : null
}

/**
 * Page-level state for the FuelPay view: the active segment, calculator
 * values and attribution, plus the launchers every CTA uses. Call once in
 * the view; children call `useFuelPay()`.
 */
export function provideFuelPay() {
  const route = useRoute()
  const router = useRouter()
  const isWide = useMediaQuery('(min-width: 761px)')

  const segment = ref<Segment | null>(segmentFromRoute(route.hash, route.query))
  const calc = ref<CalcValues | null>(null)
  const pocOpen = ref(false)
  // UTMs, landing page and referrer from this visit's first page (lib/attribution).
  const attribution = reactive<Attribution>(leadAttribution(route.query, route.path))

  /**
   * Switch segment and mirror it in the URL hash (shareable) without the
   * router scrolling to the anchor.
   */
  function selectSegment(id: Segment) {
    if (segment.value !== id) track('segment_tab_view', { segment: id })
    segment.value = id
    if (route.hash === `#${id}`) return
    skipScrollOnce()
    router.replace({ query: route.query, hash: `#${id}` })
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = el.getBoundingClientRect().top + window.scrollY - (isWide.value ? 140 : 84)
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }

  function openPoc(location: CtaLocation) {
    track('cta_book_poc_click', { location, segment: segment.value ?? 'none' })
    if (isWide.value) {
      pocOpen.value = true
      return
    }
    // Low-end Android: a full page beats a modal.
    const query: Record<string, string> = { ...currentUtms(route.query) }
    if (segment.value) query.segment = segment.value
    if (calc.value) {
      query.calc_sites = String(calc.value.sites)
      query.calc_litres = String(calc.value.litres)
      query.calc_loss_naira = String(calc.value.lossNaira)
    }
    router.push({ path: '/fuelpay/book-poc', query })
  }

  function demoHref(location: CtaLocation) {
    // Until the demo URL is supplied, keep visitors on the page.
    if (isPlaceholder(FUELPAY_LINKS.demoSignup)) return '#demo'
    const url = new URL(FUELPAY_LINKS.demoSignup)
    if (segment.value) url.searchParams.set('segment', segment.value)
    for (const [k, v] of Object.entries(currentUtms(route.query))) url.searchParams.set(k, v)
    if (!url.searchParams.has('utm_source')) {
      url.searchParams.set('utm_source', 'website')
      url.searchParams.set('utm_medium', 'fuelpay')
      url.searchParams.set('utm_content', location)
    }
    return url.toString()
  }

  function onDemoClick(location: CtaLocation) {
    track('cta_demo_click', { location, segment: segment.value ?? 'none' })
  }

  const ctx: FuelPayContext = {
    segment,
    calc,
    attribution,
    pocOpen,
    selectSegment,
    scrollToSection,
    openPoc,
    demoHref,
    onDemoClick,
  }
  provide(KEY, ctx)
  return ctx
}

export function useFuelPay() {
  const ctx = inject(KEY)
  if (!ctx) throw new Error('useFuelPay() called outside FuelPayView')
  return ctx
}
