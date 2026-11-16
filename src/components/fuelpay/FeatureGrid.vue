<script setup lang="ts">
import SectionHead from './SectionHead.vue'
import FpIcon from './FpIcon.vue'
import GlassCard from '@/components/GlassCard.vue'
import { FEATURES } from '@/content/fuelpay'
</script>

<template>
  <section id="features" class="section">
    <SectionHead index="04" eyebrow="Platform" :title="FEATURES.title" />

    <ul class="features">
      <li
        v-for="(f, i) in FEATURES.items"
        :key="f.name"
        class="reveal"
        :style="{ transitionDelay: `${(i % 3) * 70}ms` }"
      >
        <GlassCard interactive class="feature">
          <span class="feature__icon" :class="{ 'feature__icon--alert': f.icon === 'alert' }">
            <FpIcon :name="f.icon" :size="22" />
          </span>
          <h3 class="feature__name">
            {{ f.name }}
            <span v-if="f.note" class="feature__note">{{ f.note }}</span>
          </h3>
          <p class="feature__text">{{ f.text }}</p>
        </GlassCard>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.1rem;
}
.features li {
  display: flex;
}
.feature {
  flex: 1;
  padding: 1.5rem;
}
.feature__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 0.8rem;
  color: var(--color-saffron);
  background: color-mix(in srgb, var(--color-saffron) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-saffron) 25%, transparent);
}
.feature__icon--alert {
  color: var(--color-coral);
  background: color-mix(in srgb, var(--color-coral) 12%, transparent);
  border-color: color-mix(in srgb, var(--color-coral) 30%, transparent);
}
.feature__name {
  font-size: 1.15rem;
  margin: 1.1rem 0 0.45rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.feature__note {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  color: var(--color-mist);
  border: 1px solid color-mix(in srgb, var(--color-ivory) 18%, transparent);
}
.feature__text {
  margin: 0;
  color: var(--color-mist);
  line-height: 1.6;
  font-size: 0.95rem;
}
</style>
