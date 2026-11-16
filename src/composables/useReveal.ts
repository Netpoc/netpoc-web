import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * Adds `.is-visible` to elements carrying the `.reveal` class once they
 * scroll into view, driving the CSS scroll-reveal transition. Elements
 * rendered later (v-if / v-for / keyed transitions inside `root`) are picked
 * up too, so conditional content never stays invisible. Falls back to
 * immediate reveal when IntersectionObserver is unavailable.
 */
export function useReveal(root: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null
  let mutations: MutationObserver | null = null

  onMounted(() => {
    const host = root.value
    if (!host) return

    const collect = (node: Element) => [
      ...(node.matches('.reveal') ? [node] : []),
      ...node.querySelectorAll<HTMLElement>('.reveal'),
    ]

    if (typeof IntersectionObserver === 'undefined') {
      collect(host).forEach((el) => el.classList.add('is-visible'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
    )

    const watch = (el: Element) => {
      if (!el.classList.contains('is-visible')) observer?.observe(el)
    }
    collect(host).forEach(watch)

    // Content swapped in after mount (e.g. a segment change) gets observed too.
    mutations = new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes) if (node instanceof Element) collect(node).forEach(watch)
    })
    mutations.observe(host, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    mutations?.disconnect()
  })
}
