<script setup lang="ts">
import { computed } from 'vue'

/**
 * Renders a copy string, turning any [PLACEHOLDER] into a visible dashed
 * "to confirm" chip so reviewers can spot unconfirmed claims before go-live.
 */
const props = defineProps<{ text: string }>()

const parts = computed(() =>
  props.text
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map((value) => ({ value, tbc: /^\[[^\]]+\]$/.test(value) })),
)
</script>

<template>
  <template v-for="(part, i) in parts" :key="i">
    <mark v-if="part.tbc" class="tbc" title="Placeholder — confirm before go-live">{{ part.value }}</mark>
    <template v-else>{{ part.value }}</template>
  </template>
</template>

<style scoped>
.tbc {
  display: inline;
  font-family: var(--font-mono);
  font-size: 0.78em;
  letter-spacing: 0.01em;
  color: var(--color-coral);
  background: color-mix(in srgb, var(--color-coral) 10%, transparent);
  outline: 1px dashed color-mix(in srgb, var(--color-coral) 70%, transparent);
  outline-offset: 1px;
  border-radius: 0.3rem;
  padding: 0.05em 0.35em;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
</style>
