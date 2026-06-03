<script setup lang="ts">
/**
 * Tiled field of Nsibidi-evoking line ideographs, rendered as a faint
 * decorative background motif.
 *
 * NOTE: these are stylised, geometry-driven glyphs inspired by the form
 * language of Nsibidi (loops, crossed strokes, dotted accents). For
 * production, the design team should substitute authentic ideographs from
 * `/Resource/nsibidi dictionary.pdf`, respecting each symbol's meaning.
 */
withDefaults(
  defineProps<{
    /** Stroke opacity of the motif (0–1). */
    opacity?: number
    /** Tile size in px. */
    scale?: number
    color?: string
  }>(),
  { opacity: 0.06, scale: 150, color: 'currentColor' },
)
</script>

<template>
  <svg
    class="nsibidi-field"
    :style="{ color, opacity }"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <pattern
        id="nsibidi-tile"
        :width="scale"
        :height="scale"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(8)"
      >
        <g
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <!-- union / bond: two crossed loops -->
          <path d="M22 30 q14 -18 28 0 q-14 18 -28 0 Z" />
          <path d="M50 30 q-14 -18 -28 0" transform="translate(28 0)" />
          <!-- journey: a forked path with a terminal dot -->
          <path d="M30 95 l20 -22 l20 22 M50 73 l0 26" />
          <circle cx="50" cy="105" r="2.4" fill="currentColor" stroke="none" />
          <!-- gathering: nested chevrons -->
          <path d="M96 60 l16 16 l16 -16 M100 50 l12 12 l12 -12" />
          <!-- speech / word: a coil -->
          <path d="M104 112 q10 -10 0 -18 q-12 -10 -2 -22" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#nsibidi-tile)" />
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
