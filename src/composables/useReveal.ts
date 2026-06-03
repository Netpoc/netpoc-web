import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * Adds `.is-visible` to elements carrying the `.reveal` class once they
 * scroll into view, driving the CSS scroll-reveal transition. Falls back
 * to immediate reveal when IntersectionObserver is unavailable.
 */
export function useReveal(root: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const host = root.value
    if (!host) return

    const targets = Array.from(host.querySelectorAll<HTMLElement>('.reveal'))

    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'))
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

    targets.forEach((el) => observer?.observe(el))
  })

  onBeforeUnmount(() => observer?.disconnect())
}
