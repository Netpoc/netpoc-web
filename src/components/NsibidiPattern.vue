<script setup lang="ts">
import { computed, useId } from 'vue'
import { useRoute } from 'vue-router'
import { GLYPHS, NSIBIDI_SETS, type NsibidiSet } from '@/content/nsibidi'

/**
 * Background field of authentic Nsibidi ideographs, in one of two layouts:
 *
 * - `print` — a printed cloth: two staggered rows of upright glyphs with
 *   cowrie-dot spacers.
 * - `ukara` — after ukara, the indigo Ekpe-society cloth where Nsibidi sits
 *   in a grid of squares, alternating with hatched and dotted squares.
 *
 * The glyphs come from a themed set (src/content/nsibidi.ts), so each page's
 * pattern carries a message — by default the set named in the route's
 * `meta.nsibidi`, which the footer glossary also reads. Glyphs are writing,
 * so they are never rotated or mirrored.
 */
const props = withDefaults(
  defineProps<{
    /** Stroke opacity of the motif (0–1). */
    opacity?: number
    /** Tile height in px (two rows of glyphs). */
    scale?: number
    color?: string
    /** Glyph set; defaults to the current route's `meta.nsibidi`. */
    set?: NsibidiSet
    variant?: 'print' | 'ukara'
  }>(),
  { opacity: 0.06, scale: 150, color: 'currentColor', set: undefined, variant: 'print' },
)

const route = useRoute()
const id = `nsibidi-${useId()}`

const glyphs = computed(() => {
  const name = props.set ?? (route.meta.nsibidi as NsibidiSet | undefined) ?? 'welcome'
  return (NSIBIDI_SETS[name] ?? NSIBIDI_SETS.welcome).glyphs.map((g) => GLYPHS[g])
})

/** Cell = half the tile height; glyph fills ~half a cell (more in ukara squares). */
const cell = computed(() => props.scale / 2)
const k = computed(() => (cell.value * (props.variant === 'ukara' ? 0.62 : 0.5)) / 48)
const perRow = computed(() => Math.ceil(glyphs.value.length / 2))
const tileW = computed(() => perRow.value * cell.value * (props.variant === 'ukara' ? 2 : 1))

/**
 * Ukara grid: row 0 = glyph, motif, glyph, motif…; row 1 offset by one square,
 * so glyphs sit on a checkerboard. Motif squares alternate hatching and dots.
 */
const ukara = computed(() => {
  const c = cell.value
  const inset = (c - c * 0.62) / 2
  const glyphCells: { g: (typeof glyphs.value)[number]; transform: string }[] = []
  const motifs: { x: number; y: number; kind: 'hatch' | 'dots' }[] = []
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < perRow.value * 2; col++) {
      const x = col * c
      const y = row * c
      if ((col + row) % 2 === 0) {
        const g = glyphs.value[row * perRow.value + Math.floor(col / 2)]
        if (g) glyphCells.push({ g, transform: `translate(${x + inset} ${y + inset}) scale(${k.value})` })
      } else {
        motifs.push({ x, y, kind: (col + row * 3) % 4 < 2 ? 'hatch' : 'dots' })
      }
    }
  }
  return { glyphCells, motifs }
})

const placed = computed(() =>
  props.variant === 'ukara' ? ukara.value.glyphCells : glyphs.value.flatMap((g, i) => {
    const row = i < perRow.value ? 0 : 1
    const col = row === 0 ? i : i - perRow.value
    // Second row is offset half a cell, like a half-drop print.
    const x = col * cell.value + (row ? cell.value / 2 : 0) + cell.value / 4
    const y = row * cell.value + cell.value / 4
    const at = (px: number) => ({ g, transform: `translate(${px} ${y}) scale(${k.value})` })
    // A glyph crossing the tile's right edge is drawn again on the left so it tiles whole.
    return x + cell.value / 2 > tileW.value ? [at(x), at(x - tileW.value)] : [at(x)]
  }),
)
</script>

<template>
  <svg class="nsibidi-field" :style="{ color, opacity }" aria-hidden="true" focusable="false">
    <defs>
      <pattern :id="id" :width="tileW" :height="scale" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <g v-for="(p, i) in placed" :key="i" :transform="p.transform">
            <path :d="p.g.d" />
            <circle v-for="(dot, j) in 'dots' in p.g ? p.g.dots : []" :key="j" :cx="dot[0]" :cy="dot[1]" :r="dot[2]" fill="currentColor" stroke="none" />
          </g>
        </g>
        <!-- print: cowrie-dot spacers between glyphs -->
        <g v-if="variant === 'print'" fill="currentColor">
          <circle v-for="c in perRow" :key="`a${c}`" :cx="(c - 1) * cell + cell / 2 + cell / 2" :cy="cell / 2" r="1.6" />
          <circle v-for="c in perRow" :key="`b${c}`" :cx="(c - 1) * cell + cell / 2" :cy="cell * 1.5" r="1.6" />
        </g>
        <!-- ukara: square grid with hatched / dotted motif squares -->
        <g v-else stroke="currentColor" fill="currentColor">
          <path :d="`M0 0.5 H${tileW} M0 ${cell} H${tileW}`" stroke-width="1" fill="none" />
          <path
            :d="Array.from({ length: perRow * 2 }, (_, i) => `M${i * cell + 0.5} 0 V${scale}`).join(' ')"
            stroke-width="1"
            fill="none"
          />
          <g v-for="(m, i) in ukara.motifs" :key="`m${i}`" :transform="`translate(${m.x} ${m.y})`">
            <path
              v-if="m.kind === 'hatch'"
              :d="[0.25, 0.42, 0.58, 0.75].map((t) => `M${cell * 0.2} ${cell * t} H${cell * 0.8}`).join(' ')"
              stroke-width="2"
              stroke-linecap="round"
              fill="none"
            />
            <g v-else stroke="none">
              <circle :cx="cell * 0.35" :cy="cell * 0.35" r="2.4" />
              <circle :cx="cell * 0.65" :cy="cell * 0.35" r="2.4" />
              <circle :cx="cell * 0.35" :cy="cell * 0.65" r="2.4" />
              <circle :cx="cell * 0.65" :cy="cell * 0.65" r="2.4" />
            </g>
          </g>
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${id})`" />
  </svg>
</template>

<style scoped>
.nsibidi-field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
