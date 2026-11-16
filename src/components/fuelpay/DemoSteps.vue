<script setup lang="ts">
import SectionHead from './SectionHead.vue'
import TbcCopy from './TbcCopy.vue'
import { useFuelPay } from '@/composables/useFuelPay'
import { DEMO, FUELPAY_LINKS, isPlaceholder } from '@/content/fuelpay'

const { demoHref, onDemoClick } = useFuelPay()
</script>

<template>
  <section id="demo" class="section">
    <div class="demo glass-strong">
      <SectionHead index="07" eyebrow="Demo account" :title="DEMO.title" :intro="DEMO.intro" />

      <ol class="demo__steps">
        <li
          v-for="(step, i) in DEMO.steps"
          :key="step.name"
          class="demo__step reveal"
          :style="{ transitionDelay: `${i * 100}ms` }"
        >
          <span class="demo__num">{{ i + 1 }}</span>
          <h3>{{ step.name }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>

      <div class="demo__cta reveal">
        <a :href="demoHref('demo')" class="btn btn--primary" @click="onDemoClick('demo')">{{ DEMO.cta }}</a>
        <p class="demo__small">
          {{ DEMO.smallPrint }}
          <template v-if="isPlaceholder(FUELPAY_LINKS.demoSignup)">
            <br /><TbcCopy :text="FUELPAY_LINKS.demoSignup" />
          </template>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  padding: clamp(1.75rem, 5vw, 3.5rem);
}
/* Faint dashboard grid behind the panel */
.demo::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--color-ivory) 5%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-ivory) 5%, transparent) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(135deg, black, transparent 60%);
  pointer-events: none;
}
.demo > * {
  position: relative;
}
.demo__steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
.demo__step {
  padding: 1.4rem;
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--color-void) 45%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-ivory) 10%, transparent);
}
.demo__num {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--color-void);
  background: var(--color-emerald);
}
.demo__step h3 {
  font-size: 1.2rem;
  margin: 1rem 0 0.45rem;
}
.demo__step p {
  margin: 0;
  color: var(--color-mist);
  line-height: 1.6;
}
.demo__cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 2.25rem;
}
.demo__small {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-mist);
  line-height: 1.7;
}
@media (max-width: 860px) {
  .demo__steps {
    grid-template-columns: 1fr;
  }
}
</style>
