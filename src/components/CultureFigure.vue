<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { FIGURES, type FigureName } from '@/components/figures'

/**
 * Brand illustration primitive. Renders one of the generated, part-aware
 * figures (see docs/brand/illustrations.md) and restyles its parts:
 *
 * - palette `heritage` — the artwork's own colours
 * - palette `ankara`   — cloth recoloured into the site's Ankara accents,
 *                        keeping each fold's relative shade
 * - palette `night`    — dusk silhouette with a saffron rim light, for
 *                        quiet accents near text
 * - infill `ankara`    — cloth filled with a wax-print tile
 * - animate            — the figure's own gesture (wave, feather sway),
 *                        only while on screen; off under reduced motion
 */
const props = withDefaults(
  defineProps<{
    name: FigureName
    palette?: 'heritage' | 'ankara' | 'night'
    infill?: 'none' | 'ankara'
    animate?: boolean
    /** CSS height; width follows the artwork's aspect ratio. */
    height?: string
    mirror?: boolean
    /** Soft contact shadow under the feet. */
    ground?: boolean
  }>(),
  { palette: 'heritage', infill: 'none', animate: false, height: '420px', mirror: false, ground: true },
)

const fig = computed(() => FIGURES[props.name])
const patternId = `fig-infill-${useId()}`

// Only run gestures while the figure is visible (battery on low-end phones).
const el = ref<HTMLElement | null>(null)
const inView = ref(false)
useIntersectionObserver(el, ([entry]) => (inView.value = !!entry?.isIntersecting), { threshold: 0.1 })
</script>

<template>
  <div
    ref="el"
    class="fig"
    :class="[
      `fig--${palette}`,
      {
        'fig--infill': infill === 'ankara',
        'fig--animate': animate,
        'fig--paused': !inView,
        'fig--mirror': mirror,
        'fig--ground': ground,
      },
    ]"
    :style="{
      height,
      aspectRatio: `${fig.width} / ${fig.height}`,
      '--fig-infill': `url(#${patternId})`,
    }"
    aria-hidden="true"
  >
    <svg v-if="infill === 'ankara'" class="fig__defs" width="0" height="0" focusable="false">
      <defs>
        <!-- Wax-print tile, same motif as AnkaraPattern.vue, scaled for cloth -->
        <pattern :id="patternId" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
          <rect width="40" height="40" fill="var(--color-terracotta)" />
          <rect x="8" y="8" width="24" height="24" transform="rotate(45 20 20)" fill="none" stroke="var(--color-saffron)" stroke-width="2.5" />
          <rect x="14" y="14" width="12" height="12" transform="rotate(45 20 20)" fill="var(--color-violet)" />
          <circle cx="20" cy="20" r="2.5" fill="var(--color-ivory)" />
          <g fill="var(--color-emerald)">
            <circle cx="0" cy="0" r="3" />
            <circle cx="40" cy="0" r="3" />
            <circle cx="0" cy="40" r="3" />
            <circle cx="40" cy="40" r="3" />
          </g>
        </pattern>
      </defs>
    </svg>
    <component :is="fig.component" />
  </div>
</template>

<style scoped>
.fig {
  position: relative;
  display: inline-block;
  max-width: 100%;
  pointer-events: none;
  user-select: none;
}
.fig :deep(.fig-svg) {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.fig__defs {
  position: absolute;
}
.fig--mirror :deep(.fig-svg) {
  transform: scaleX(-1);
}
.fig--ground::after {
  content: '';
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: -2.5%;
  height: 7%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.55), transparent);
}

/* ---- Palette: ankara — recolour cloth, keep each fold's shade (--k) ---- */
.fig--ankara {
  --fig-cloth-a: var(--color-emerald);
  --fig-cloth-b: var(--color-saffron);
  --fig-accent: var(--color-violet);
  --fig-gold: color-mix(in oklab, var(--color-saffron) 55%, var(--color-ivory));
}
.fig--ankara :deep(.fp-cloth-a) {
  fill: oklch(from var(--fig-cloth-a) calc(l * var(--k)) c h);
}
.fig--ankara :deep(.fp-cloth-b) {
  fill: oklch(from var(--fig-cloth-b) calc(l * var(--k)) c h);
}
.fig--ankara :deep(.fp-accent) {
  fill: oklch(from var(--fig-accent) calc(l * var(--k)) c h);
}
.fig--ankara :deep(.fp-gold) {
  fill: oklch(from var(--fig-gold) calc(l * var(--k)) c h);
}

/* ---- Palette: night — dusk silhouette, saffron rim light ---- */
.fig--night :deep(path) {
  fill: oklch(from var(--color-night-3) calc(l * var(--k, 1)) c h);
}
.fig--night :deep(.fig-svg) {
  filter: drop-shadow(0 0 1px color-mix(in srgb, var(--color-saffron) 80%, transparent))
    drop-shadow(0 0 22px color-mix(in srgb, var(--color-saffron) 30%, transparent));
}

/* ---- Infill: wax-print cloth ---- */
.fig--infill :deep(.fp-cloth-a),
.fig--infill :deep(.fp-cloth-b) {
  fill: var(--fig-infill);
}

/* ---- Gestures ---- */
.fig--animate :deep(.part-wave) {
  transform-box: view-box;
  transform-origin: var(--wave-origin);
  animation: fig-wave 4.5s var(--ease-out-expo) infinite;
}
.fig--animate :deep(.part-feathers) {
  transform-box: view-box;
  transform-origin: var(--feathers-origin);
  animation: fig-sway 6s ease-in-out infinite alternate;
}
.fig--paused :deep(.part-wave),
.fig--paused :deep(.part-feathers) {
  animation-play-state: paused;
}
@keyframes fig-wave {
  0%,
  55%,
  100% {
    transform: rotate(0);
  }
  64% {
    transform: rotate(-9deg);
  }
  73% {
    transform: rotate(5deg);
  }
  82% {
    transform: rotate(-6deg);
  }
  91% {
    transform: rotate(2deg);
  }
}
@keyframes fig-sway {
  from {
    transform: rotate(-1.8deg);
  }
  to {
    transform: rotate(1.8deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .fig :deep(.part-wave),
  .fig :deep(.part-feathers) {
    animation: none;
  }
}
</style>
