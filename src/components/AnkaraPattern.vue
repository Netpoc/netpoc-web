<script setup lang="ts">
/**
 * Ankara-inspired geometric band: concentric diamonds, dotted rows and
 * radiating accents in the brand's wax-print palette. Used as a saturated
 * counterpoint behind / beside frosted glass surfaces.
 */
withDefaults(
  defineProps<{
    opacity?: number
    scale?: number
  }>(),
  { opacity: 1, scale: 120 },
)
</script>

<template>
  <svg class="ankara-field" :style="{ opacity }" aria-hidden="true" focusable="false">
    <defs>
      <pattern
        id="ankara-tile"
        :width="scale"
        :height="scale"
        patternUnits="userSpaceOnUse"
      >
        <rect :width="scale" :height="scale" fill="transparent" />
        <!-- concentric diamonds -->
        <g stroke-width="3" fill="none">
          <rect
            x="20"
            y="20"
            width="80"
            height="80"
            transform="rotate(45 60 60)"
            stroke="var(--color-saffron)"
          />
          <rect
            x="36"
            y="36"
            width="48"
            height="48"
            transform="rotate(45 60 60)"
            stroke="var(--color-coral)"
          />
        </g>
        <circle cx="60" cy="60" r="7" fill="var(--color-violet)" />
        <!-- corner suns -->
        <g fill="var(--color-emerald)">
          <circle cx="0" cy="0" r="5" />
          <circle cx="120" cy="0" r="5" />
          <circle cx="0" cy="120" r="5" />
          <circle cx="120" cy="120" r="5" />
        </g>
        <!-- radiating dashes -->
        <g stroke="var(--color-saffron)" stroke-width="3" stroke-linecap="round">
          <line x1="60" y1="6" x2="60" y2="20" />
          <line x1="60" y1="100" x2="60" y2="114" />
          <line x1="6" y1="60" x2="20" y2="60" />
          <line x1="100" y1="60" x2="114" y2="60" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ankara-tile)" />
  </svg>
</template>

<style scoped>
.ankara-field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
