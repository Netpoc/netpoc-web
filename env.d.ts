/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_FORM_ENDPOINT?: string
  readonly VITE_GA_ID?: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    description?: string
    ogImage?: string
    /** Keep out of search results (404). */
    noindex?: boolean
    /** Nsibidi glyph set for the page's pattern fields and footer glossary. */
    nsibidi?: import('@/content/nsibidi').NsibidiSet
  }
}
