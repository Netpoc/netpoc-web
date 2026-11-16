import { computed, reactive, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { track } from '@/lib/track'
import type { FormSegment } from '@/content/fuelpay'
import type { Attribution, CalcValues } from '@/composables/useFuelPay'

export interface PocModel {
  name: string
  email: string
  phone: string
  company: string
  jobTitle: string
  segment: FormSegment | ''
  states: string[]
  sites: string
  generator: string
  interests: string[]
  tractors: string
  trackersFitted: string
  trackerMake: string
  problems: string[]
  start: string
  message: string
  heard: string
  consent: boolean
  /** Honeypot — real people never see or fill this. */
  website: string
}

export type PocField = keyof PocModel

const DRAFT_KEY = 'fuelpay-poc-draft'
const FREE_MAIL = /@(gmail|yahoo|ymail|hotmail|outlook|live|icloud|aol)\./i

function blank(): PocModel {
  return {
    name: '', email: '', phone: '', company: '', jobTitle: '', segment: '', states: [],
    sites: '', generator: '', interests: [], tractors: '', trackersFitted: '', trackerMake: '',
    problems: [], start: '', message: '', heard: '', consent: false, website: '',
  }
}

/** Accepts `0803 123 4567`, `803…`, `234803…`, `+234803…` → `+2348031234567`. */
export function normalisePhone(raw: string): string | null {
  const s = raw.replace(/[\s\-().]/g, '')
  if (/^\+\d{8,15}$/.test(s)) {
    if (s.startsWith('+234')) return /^\+234[789]\d{9}$/.test(s) ? s : null
    return s
  }
  if (/^234[789]\d{9}$/.test(s)) return '+' + s
  if (/^0[789]\d{9}$/.test(s)) return '+234' + s.slice(1)
  if (/^[789]\d{9}$/.test(s)) return '+234' + s
  return null
}

function readDraft(): Partial<PocModel> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as Partial<PocModel>) : null
  } catch {
    return null
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* storage unavailable — nothing to clear */
  }
}

/** POST with one retry on network failure. */
async function send(payload: Record<string, unknown>) {
  // TODO: POST to the PoC API once it is available, e.g.
  //   const res = await fetch(import.meta.env.VITE_POC_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  //   if (!res.ok) throw new Error(`PoC submit failed: ${res.status}`)
  const attempt = () => new Promise<void>((resolve) => setTimeout(resolve, 700))
  try {
    await attempt()
  } catch {
    await attempt()
  }
  if (import.meta.env.DEV) console.debug('[poc] payload', payload)
}

export function usePocForm(opts: {
  segment?: FormSegment | null
  calc?: CalcValues | null
  attribution: Attribution
}) {
  const draft = readDraft()
  const model = reactive<PocModel>({ ...blank(), ...draft, consent: false, website: '' })
  // A deep-linked segment beats whatever was in the draft.
  if (opts.segment) model.segment = opts.segment

  const errors = reactive<Partial<Record<PocField, string>>>({})
  const submitting = ref(false)
  const submitted = ref(false)
  const failed = ref(false)
  const started = ref(false)

  const showSites = computed(
    () => model.segment === 'towers' || model.segment === 'enterprise' || model.segment === 'other',
  )
  const showTractors = computed(() => model.segment === 'tractors' || model.segment === 'other')
  const showTrackerMake = computed(
    () => showTractors.value && (model.trackersFitted === 'Yes' || model.trackersFitted === 'Some'),
  )
  const emailWarning = computed(() =>
    model.email && FREE_MAIL.test(model.email) ? 'A work email helps us respond faster.' : '',
  )
  const firstName = computed(() => model.name.trim().split(/\s+/)[0] ?? '')

  const priority = computed<'A' | 'B' | 'C'>(() => {
    if (['21–100', '101–500', '500+'].includes(model.sites)) return 'A'
    if (['200–999', '1,000+'].includes(model.tractors)) return 'A'
    if (model.start === 'This month') return 'A'
    if (model.sites === '6–20' || model.tractors === '50–199') return 'B'
    return 'C'
  })

  watchDebounced(
    model,
    () => {
      if (submitted.value) return
      try {
        // Consent must be given fresh each time; the honeypot is never stored.
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...model, consent: false, website: '' }))
      } catch {
        /* private mode / blocked storage — drafts are a convenience only */
      }
    },
    { debounce: 500, deep: true },
  )

  // Clear a field's error as soon as the visitor edits it.
  watch(
    () => JSON.stringify(model),
    (now, before) => {
      const a = JSON.parse(now) as PocModel
      const b = JSON.parse(before) as PocModel
      for (const key of Object.keys(a) as PocField[]) {
        if (errors[key] && JSON.stringify(a[key]) !== JSON.stringify(b[key])) delete errors[key]
      }
    },
  )

  function markStarted() {
    if (started.value) return
    started.value = true
    track('poc_form_start', { segment: model.segment || 'none' })
  }

  function validate(): PocField[] {
    for (const key of Object.keys(errors) as PocField[]) delete errors[key]
    const req = (f: PocField, msg: string) => (errors[f] = msg)
    const name = model.name.trim()
    if (name.length < 2 || name.length > 80) req('name', 'Enter your full name (2–80 characters).')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(model.email.trim())) req('email', 'Enter a valid email address.')
    if (!normalisePhone(model.phone)) req('phone', 'Enter a valid phone number, e.g. 0803 123 4567.')
    const company = model.company.trim()
    if (company.length < 2 || company.length > 120) req('company', 'Enter your company or organisation (2–120 characters).')
    if (!model.jobTitle.trim()) req('jobTitle', 'Enter your job title.')
    if (!model.segment) req('segment', 'Choose the option that best describes you.')
    if (!model.states.length) req('states', 'Choose at least one state.')
    if (showSites.value && !model.sites) req('sites', 'Choose how many sites you run.')
    if (showTractors.value && !model.tractors) req('tractors', 'Choose how many tractors you run.')
    if (showTractors.value && !model.trackersFitted) req('trackersFitted', 'Tell us whether trackers are fitted.')
    if (model.message.length > 1000) req('message', 'Keep your message under 1,000 characters.')
    if (!model.consent) req('consent', 'Please agree so we can contact you about FuelPay.')
    return Object.keys(errors) as PocField[]
  }

  async function submit(): Promise<PocField[]> {
    failed.value = false
    const invalid = validate()
    if (invalid.length) return invalid

    // Bots fill the honeypot; pretend success, send nothing.
    if (model.website) {
      submitted.value = true
      return []
    }

    submitting.value = true
    const payload = {
      name: model.name.trim(),
      email: model.email.trim(),
      phone: normalisePhone(model.phone),
      company: model.company.trim(),
      job_title: model.jobTitle.trim(),
      segment: model.segment,
      states: model.states,
      ...(showSites.value && { sites: model.sites, generator_size: model.generator, interested_in: model.interests }),
      ...(showTractors.value && {
        tractors: model.tractors,
        trackers_fitted: model.trackersFitted,
        tracker_make: showTrackerMake.value ? model.trackerMake.trim() : '',
      }),
      problems: model.problems,
      preferred_start: model.start,
      message: model.message.trim(),
      heard_from: model.heard,
      consent: true,
      consent_at: new Date().toISOString(),
      priority: priority.value,
      calc_sites: opts.calc?.sites ?? '',
      calc_litres: opts.calc?.litres ?? '',
      calc_loss_naira: opts.calc?.lossNaira ?? '',
      ...opts.attribution,
    }

    try {
      await send(payload)
      submitted.value = true
      clearDraft()
      track('poc_form_submit', {
        segment: model.segment,
        size_band: model.sites || model.tractors || 'unknown',
        priority: priority.value,
      })
    } catch {
      failed.value = true
    } finally {
      submitting.value = false
    }
    return []
  }

  return {
    model,
    errors,
    submitting,
    submitted,
    failed,
    showSites,
    showTractors,
    showTrackerMake,
    emailWarning,
    firstName,
    priority,
    markStarted,
    submit,
  }
}
