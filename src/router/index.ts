import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { SEO } from '@/content/fuelpay'

const DEFAULT_DESCRIPTION =
  'Netpoc Inc Limited — an innovation- and value-driven African tech company. System Design, System on Chip, IoT, USSD Solutions, Telematics, and Agric Tech.'

/** Set before an in-page hash update (e.g. FuelPay segment tabs) so the router doesn't scroll. */
let skipNextScroll = false
export function skipScrollOnce() {
  skipNextScroll = true
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (skipNextScroll) {
      skipNextScroll = false
      return false
    }
    if (savedPosition) return savedPosition
    if (to.hash) {
      const target = { el: to.hash, behavior: 'smooth' as const, top: 96 }
      // Wait out the out-in page transition so the target element exists.
      if (from.matched.length && from.path !== to.path)
        return new Promise((resolve) => setTimeout(() => resolve(target), 450))
      return target
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Netpoc — African Innovation, Engineered.', nsibidi: 'welcome' } },
    {
      path: '/services',
      name: 'services',
      component: () => import('@/views/ServicesView.vue'),
      meta: { title: 'Services — Netpoc', nsibidi: 'craft' },
    },
    {
      path: '/fuelpay',
      name: 'fuelpay',
      component: () => import('@/views/FuelPayView.vue'),
      meta: { title: SEO.title, description: SEO.description, ogImage: SEO.ogImage, nsibidi: 'value' },
    },
    {
      path: '/fuelpay/book-poc',
      name: 'fuelpay-book-poc',
      component: () => import('@/views/BookPocView.vue'),
      meta: { title: 'Book a FuelPay PoC · Netpoc', description: SEO.description, nsibidi: 'value' },
    },
    // 301 at the host level too; this keeps client-side links working.
    { path: '/products/fuelpay', redirect: (to) => ({ path: '/fuelpay', query: to.query, hash: to.hash }) },
    // Dev-only illustration lab (tree-shaken from production builds).
    ...(import.meta.env.DEV
      ? [{ path: '/__figures', name: 'figure-lab', component: () => import('@/views/FigureLabView.vue'), meta: { title: 'Figure lab' } }]
      : []),
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'About — Netpoc', nsibidi: 'people' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: { title: 'Contact — Netpoc', nsibidi: 'dialogue' },
    },
  ],
})

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? document.title
  const description = (to.meta.description as string | undefined) ?? DEFAULT_DESCRIPTION
  const url = window.location.origin + to.path
  document.title = title
  setMeta('name', 'description', description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', window.location.origin + ((to.meta.ogImage as string | undefined) ?? '/og-logo.png'))
  setMeta('name', 'twitter:card', 'summary_large_image')

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url
})

export default router
