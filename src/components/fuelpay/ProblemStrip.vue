<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useIntersectionObserver, usePreferredReducedMotion } from '@vueuse/core'
import SectionHead from './SectionHead.vue'
import { PROBLEM } from '@/content/fuelpay'

const grid = ref<HTMLElement | null>(null)
const reduced = usePreferredReducedMotion()
const shown = ref(PROBLEM.stats.map(() => 0))
let frame = 0

const fmt = new Intl.NumberFormat('en-NG')

function run() {
  if (reduced.value === 'reduce') {
    shown.value = PROBLEM.stats.map((s) => s.value)
    return
  }
  const start = performance.now()
  const duration = 1600
  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - t, 4)
    shown.value = PROBLEM.stats.map((s) => Math.round(s.value * eased))
    if (t < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}

const { stop } = useIntersectionObserver(
  grid,
  ([entry]) => {
    if (entry?.isIntersecting) {
      run()
      stop()
    }
  },
  { threshold: 0.3 },
)

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <section id="problem" class="section">
    <SectionHead index="01" eyebrow="The problem" :title="PROBLEM.title" />

    <ul ref="grid" class="stats">
      <li
        v-for="(s, i) in PROBLEM.stats"
        :key="s.line"
        class="stat glass reveal"
        :style="{ transitionDelay: `${i * 90}ms` }"
      >
        <p class="stat__value">
          <!-- Screen readers get the final figure, not the animation -->
          <span aria-hidden="true">{{ s.prefix }}{{ fmt.format(shown[i] ?? 0) }}{{ s.suffix }}</span>
          <span class="sr-only">{{ s.prefix }}{{ fmt.format(s.value) }}{{ s.suffix }}</span>
          <span v-if="s.unit" class="stat__unit">{{ s.unit }}</span>
        </p>
        <p class="stat__line">{{ s.line }}</p>
        <p class="stat__source">Source: {{ s.source }}</p>
        <span class="stat__bar" aria-hidden="true" />
      </li>
    </ul>

    <p class="footnote reveal">{{ PROBLEM.footnote }}</p>
  </section>
</template>

<style scoped>
.stats {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
.stat {
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  padding: 1.75rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
}
.stat__value {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.4rem, 5vw, 3.4rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--color-saffron);
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.15em 0.4em;
}
.stat__unit {
  font-size: 0.42em;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--color-ivory);
}
.stat__line {
  margin: 0.9rem 0 1.25rem;
  color: var(--color-ivory);
  line-height: 1.55;
  flex: 1;
}
.stat__source {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-muted);
}
/* Gauge-tick strip along the bottom edge */
.stat__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    var(--color-saffron) 0 6px,
    transparent 6px 10px
  );
  opacity: 0.45;
}
.footnote {
  max-width: 62ch;
  margin: 2.25rem 0 0;
  color: var(--color-mist);
  line-height: 1.7;
  font-size: 1.05rem;
  padding-left: 1.1rem;
  border-left: 2px solid var(--color-coral);
}
@media (max-width: 860px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
