/**
 * Company facts used across the site and in structured data.
 * Keep free of Vue/browser imports — the build (vite.config.ts) reads it too.
 *
 * Social URLs: replace each [PLACEHOLDER] with the real profile URL. Icons only
 * render (footer, Contact) and only enter JSON-LD `sameAs` once the value is real.
 */
export const COMPANY = {
  /** Confirmed legal name. Change it here only. */
  legalName: 'Netpoc Inc Limited',
  name: 'Netpoc',
  email: 'hello@netpoc.com',
  /** As displayed. */
  phone: '0806 857 1524',
  /** For tel: links and structured data. */
  phoneIntl: '+2348068571524',
  address: {
    street: 'Mope, Olopade St',
    locality: 'Iddo',
    city: 'Ibadan',
    region: 'Oyo',
    country: 'NG',
  },
}

/** One-line address for display. */
export const ADDRESS_LINE = [
  COMPANY.address.street,
  COMPANY.address.locality,
  COMPANY.address.city,
  COMPANY.address.region,
].join(', ')

export type SocialId = 'linkedin' | 'x' | 'instagram'

export const SOCIAL: { id: SocialId; label: string; url: string }[] = [
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/netpocinc' },
  { id: 'x', label: 'X', url: 'https://x.com/NetpocInc' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/netpocinc/' },
]

const isReal = (url: string) => /^https?:\/\//.test(url)

/** Profiles with a real URL, in display order. */
export const SOCIAL_LIVE = SOCIAL.filter((s) => isReal(s.url))

/** schema.org Organization, written into every page's static HTML at build time. */
export function organizationLd(site: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: site + '/',
    logo: site + '/icon.png',
    email: COMPANY.email,
    telephone: COMPANY.phoneIntl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${COMPANY.address.street}, ${COMPANY.address.locality}`,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.region,
      addressCountry: COMPANY.address.country,
    },
    ...(SOCIAL_LIVE.length && { sameAs: SOCIAL_LIVE.map((s) => s.url) }),
  }
}
