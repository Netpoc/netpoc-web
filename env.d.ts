/// <reference types="vite/client" />

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
    /** Nsibidi glyph set for the page's pattern fields and footer glossary. */
    nsibidi?: import('@/content/nsibidi').NsibidiSet
  }
}
