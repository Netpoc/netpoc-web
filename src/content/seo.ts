/**
 * Per-route SEO + social preview metadata. One source for two consumers:
 * - the router (`afterEach`) updates tags during in-app navigation;
 * - the build (`vite.config.ts` → `seoPages`) writes them as static HTML
 *   into `dist/<route>/index.html`, because LinkedIn, X and WhatsApp
 *   scrapers do not run JavaScript.
 *
 * Keep this file free of Vue/browser imports — the build imports it in Node.
 */
import { SEO as FUELPAY_SEO } from './fuelpay'

export interface PageSeo {
  title: string
  description: string
  /** Path under /public, 1200×630. */
  ogImage?: string
}

export const DEFAULT_OG_IMAGE = '/og-image.png'
export const SITE_NAME = 'Netpoc Inc.'

export const ROUTE_SEO = {
  '/': {
    title: 'Netpoc Inc. — African Innovation, Engineered.',
    description:
      'Netpoc Inc Limited is a Nigerian tech company: system design, IoT and telematics, USSD solutions, software development and agric tech, and FuelPay diesel, power and tractor monitoring.',
  },
  '/services': {
    title: 'Services — Netpoc Inc.',
    description:
      'Engineering services from Netpoc: system design, IoT and telematics, USSD solutions, software development and agric tech for businesses in Nigeria and across Africa.',
  },
  '/fuelpay': {
    title: FUELPAY_SEO.title,
    description: FUELPAY_SEO.description,
    ogImage: FUELPAY_SEO.ogImage,
  },
  '/fuelpay/book-poc': {
    title: 'Book a FuelPay PoC · Netpoc',
    description:
      'Request a paid FuelPay proof of concept for your towers, generators or tractors. Tell us about your sites and we will scope it with you.',
    ogImage: FUELPAY_SEO.ogImage,
  },
  '/about': {
    title: 'About — Netpoc Inc.',
    description:
      'Netpoc Inc Limited builds connected hardware and software in Nigeria, shaped by West African design heritage.',
  },
  '/contact': {
    title: 'Contact — Netpoc Inc.',
    description:
      'Talk to Netpoc about FuelPay or an engineering project. Send a message and our team will reply by email.',
  },
} satisfies Record<string, PageSeo>

export type SeoPath = keyof typeof ROUTE_SEO

export const NOT_FOUND_SEO: PageSeo = {
  title: 'Page not found — Netpoc Inc.',
  description: ROUTE_SEO['/'].description,
}
