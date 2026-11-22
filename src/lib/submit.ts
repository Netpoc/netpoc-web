/**
 * Form delivery. Every lead form POSTs JSON to `VITE_FORM_ENDPOINT`
 * (Formspree, a Google Apps Script web app, or our own API all accept this).
 * The `form` field tells the receiver which form sent it.
 *
 * If the endpoint is not configured we throw rather than pretend: a visible
 * error with an email fallback beats a lead silently thrown away.
 */
export type FormName = 'poc' | 'contact'

export class FormNotConfiguredError extends Error {
  constructor() {
    super('VITE_FORM_ENDPOINT is not set')
  }
}

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined

async function post(body: string) {
  const res = await fetch(ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body,
  })
  if (!res.ok) throw new Error(`Form submit failed: ${res.status}`)
}

/** POST with one retry on network failure (not on HTTP errors). */
export async function submitForm(form: FormName, payload: Record<string, unknown>) {
  if (!ENDPOINT) {
    if (import.meta.env.DEV) console.warn(`[form:${form}] no VITE_FORM_ENDPOINT; payload`, payload)
    throw new FormNotConfiguredError()
  }
  const body = JSON.stringify({ form, page: window.location.pathname, ...payload })
  try {
    await post(body)
  } catch (err) {
    if (!(err instanceof TypeError)) throw err // HTTP error: don't double-submit
    await post(body)
  }
}
