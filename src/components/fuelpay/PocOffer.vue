<script setup lang="ts">
import { computed } from 'vue'
import SectionHead from './SectionHead.vue'
import TbcCopy from './TbcCopy.vue'
import FpIcon from './FpIcon.vue'
import { useFuelPay } from '@/composables/useFuelPay'
import { POC } from '@/content/fuelpay'

const { segment, openPoc } = useFuelPay()

/** Show the column that matches the chosen segment; both when none is chosen. */
const columns = computed(() => {
  if (segment.value === 'tractors') return [POC.tractors]
  if (segment.value) return [POC.sites]
  return [POC.sites, POC.tractors]
})
</script>

<template>
  <section id="poc" class="section">
    <SectionHead index="06" eyebrow="Proof of Concept" :title="POC.title" :intro="POC.intro" />

    <div class="poc">
      <div class="poc__included" :class="{ 'poc__included--single': columns.length === 1 }">
        <article
          v-for="(col, i) in columns"
          :key="col.title"
          class="poc__card glass reveal"
          :style="{ transitionDelay: `${i * 90}ms` }"
        >
          <p class="poc__kicker">What's included</p>
          <h3 class="poc__title">{{ col.title }}</h3>
          <ul class="poc__list">
            <li v-for="item in col.items" :key="item">
              <FpIcon name="check" :size="16" />
              <span>{{ item }}</span>
            </li>
          </ul>
          <p class="poc__fee"><TbcCopy :text="col.fee" /></p>
        </article>
      </div>

      <aside class="poc__needs glass-strong reveal">
        <h3 class="poc__title">{{ POC.needsTitle }}</h3>
        <ol class="poc__steps">
          <li v-for="need in POC.needs" :key="need">{{ need }}</li>
        </ol>
        <button type="button" class="btn btn--primary" @click="openPoc('poc')">Book a PoC</button>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.poc {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 1.25rem;
  align-items: start;
}
.poc__included {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.poc__included--single {
  grid-template-columns: 1fr;
}
.poc__card,
.poc__needs {
  border-radius: 1.5rem;
  padding: clamp(1.4rem, 3vw, 1.9rem);
  display: flex;
  flex-direction: column;
}
.poc__card {
  height: 100%;
}
.poc__kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-saffron);
}
.poc__title {
  font-size: 1.35rem;
  margin: 0.5rem 0 1.1rem;
}
.poc__list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  display: grid;
  gap: 0.75rem;
  flex: 1;
}
.poc__list li {
  display: flex;
  gap: 0.6rem;
  line-height: 1.5;
  color: var(--color-mist);
}
.poc__list svg {
  flex: none;
  margin-top: 0.2rem;
  color: var(--color-emerald);
}
.poc__fee {
  margin: 0;
  padding-top: 1rem;
  border-top: 1px dashed color-mix(in srgb, var(--color-ivory) 16%, transparent);
  font-weight: 600;
  line-height: 1.6;
}
.poc__steps {
  margin: 0 0 1.75rem;
  padding: 0;
  list-style: none;
  counter-reset: need;
  display: grid;
  gap: 1rem;
}
.poc__steps li {
  counter-increment: need;
  position: relative;
  padding-left: 2.6rem;
  line-height: 1.55;
  color: var(--color-mist);
}
.poc__steps li::before {
  content: counter(need, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-saffron);
  padding: 0.15rem 0.4rem;
  border-radius: 0.4rem;
  border: 1px solid color-mix(in srgb, var(--color-saffron) 35%, transparent);
}
.poc__needs .btn {
  align-self: flex-start;
}
@media (max-width: 960px) {
  .poc {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .poc__included {
    grid-template-columns: 1fr;
  }
}
</style>
