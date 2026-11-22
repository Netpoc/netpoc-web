import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { DEFAULT_OG_IMAGE, NOT_FOUND_SEO, ROUTE_SEO } from '@/content/seo'
import { trackPageView } from '@/lib/track'
import { captureFirstTouch } from '@/lib/attribution'

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '')

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
    { path: '/', name: 'home', component: HomeView, meta: { ...ROUTE_SEO['/'], nsibidi: 'welcome' } },
    {
      path: '/services',
      name: 'services',
      component: () => import('@/views/ServicesView.vue'),
      meta: { ...ROUTE_SEO['/services'], nsibidi: 'craft' },
    },
    {
      path: '/fuelpay',
      name: 'fuelpay',
      component: () => import('@/views/FuelPayView.vue'),
      meta: { ...ROUTE_SEO['/fuelpay'], nsibidi: 'value' },
    },
    {
      path: '/fuelpay/book-poc',
      name: 'fuelpay-book-poc',
      component: () => import('@/views/BookPocView.vue'),
      meta: { ...ROUTE_SEO['/fuelpay/book-poc'], nsibidi: 'value' },
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
      meta: { ...ROUTE_SEO['/about'], nsibidi: 'people' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: { ...ROUTE_SEO['/contact'], nsibidi: 'dialogue' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { ...NOT_FOUND_SEO, noindex: true, nsibidi: 'welcome' },
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
  captureFirstTouch(to.path, to.query)
  const origin = SITE_URL ?? window.location.origin
  const title = to.meta.title ?? document.title
  const description = to.meta.description ?? ROUTE_SEO['/'].description
  const url = origin + to.path
  document.title = title
  setMeta('name', 'description', description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', origin + (to.meta.ogImage ?? DEFAULT_OG_IMAGE))
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', origin + (to.meta.ogImage ?? DEFAULT_OG_IMAGE))
  setMeta('name', 'robots', to.meta.noindex ? 'noindex' : 'index, follow')

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url

  trackPageView()
})

export default router
