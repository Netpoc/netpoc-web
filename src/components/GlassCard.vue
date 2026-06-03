<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Adds a hover lift + glow interaction. */
    interactive?: boolean
  }>(),
  { interactive: false },
)
</script>

<template>
  <div class="glass glass-card" :class="{ 'glass-card--interactive': interactive }">
    <slot />
  </div>
</template>

<style scoped>
.glass-card {
  border-radius: 1.5rem;
  padding: 1.75rem;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.5s var(--ease-out-expo),
    box-shadow 0.5s var(--ease-out-expo),
    border-color 0.5s var(--ease-out-expo);
}

.glass-card--interactive:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--color-saffron) 45%, transparent);
  box-shadow:
    0 20px 50px -12px rgba(0, 0, 0, 0.6),
    0 0 30px -6px color-mix(in srgb, var(--color-saffron) 30%, transparent);
}
</style>
