<script setup lang="ts">
import { useFuelPay, type CtaLocation } from '@/composables/useFuelPay'

/** The two FuelPay CTAs: Book a PoC (primary) + Try the Demo (outline). */
withDefaults(
  defineProps<{
    location: CtaLocation
    pocLabel?: string
    demoLabel?: string
    size?: 'md' | 'sm'
  }>(),
  { pocLabel: 'Book a PoC', demoLabel: 'Try the Demo', size: 'md' },
)

const { openPoc, demoHref, onDemoClick } = useFuelPay()
</script>

<template>
  <div class="ctas">
    <button
      type="button"
      class="btn btn--primary"
      :class="{ 'btn--sm': size === 'sm' }"
      @click="openPoc(location)"
    >
      {{ pocLabel }}
    </button>
    <a
      :href="demoHref(location)"
      class="btn btn--outline"
      :class="{ 'btn--sm': size === 'sm' }"
      @click="onDemoClick(location)"
    >
      {{ demoLabel }}
    </a>
  </div>
</template>

<style scoped>
.ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}
</style>
