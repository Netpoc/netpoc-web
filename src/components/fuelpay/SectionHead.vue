<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    intro?: string
    /** Section index shown as a telemetry-style channel number, e.g. "03". */
    index?: string
    align?: 'left' | 'center'
  }>(),
  { align: 'left' },
)
</script>

<template>
  <header class="head reveal" :class="`head--${align}`">
    <p class="head__eyebrow">
      <span v-if="index" class="head__index">CH·{{ index }}</span>
      <span>{{ eyebrow }}</span>
    </p>
    <h2 class="head__title">{{ title }}</h2>
    <p v-if="intro" class="head__intro">{{ intro }}</p>
  </header>
</template>

<style scoped>
.head {
  max-width: 46rem;
  margin-bottom: clamp(2rem, 5vw, 3.25rem);
}
.head--center {
  margin-inline: auto;
  text-align: center;
}
.head__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-mist);
}
.head__index {
  color: var(--color-saffron);
  padding-right: 0.75rem;
  border-right: 1px solid color-mix(in srgb, var(--color-ivory) 20%, transparent);
}
.head__title {
  font-size: clamp(1.9rem, 4.2vw, 3rem);
  margin: 1rem 0 0.9rem;
  text-wrap: balance;
}
.head__intro {
  color: var(--color-mist);
  font-size: 1.05rem;
  line-height: 1.65;
  margin: 0;
}
</style>
