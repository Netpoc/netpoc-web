<script setup lang="ts">
import SectionHead from './SectionHead.vue'
import TbcCopy from './TbcCopy.vue'
import FpIcon from './FpIcon.vue'
import GlassCard from '@/components/GlassCard.vue'
import { HOW } from '@/content/fuelpay'
</script>

<template>
  <section id="how-it-works" class="section">
    <SectionHead index="03" eyebrow="How it works" :title="HOW.title" />

    <ol class="steps">
      <li
        v-for="(step, i) in HOW.steps"
        :key="step.name"
        class="step reveal"
        :style="{ transitionDelay: `${i * 110}ms` }"
      >
        <div class="step__node">
          <FpIcon :name="step.icon" :size="22" />
          <span class="step__num">0{{ i + 1 }}</span>
        </div>
        <h3 class="step__name">{{ step.name }}</h3>
        <p class="step__text"><TbcCopy :text="step.text" /></p>
      </li>
    </ol>

    <p class="dnd reveal"><TbcCopy :text="HOW.dnd" /></p>

    <h3 class="offers__title reveal">{{ HOW.offersTitle }}</h3>
    <div class="offers">
      <GlassCard
        v-for="(offer, i) in HOW.offers"
        :key="offer.name"
        interactive
        class="offer reveal"
        :style="{ transitionDelay: `${i * 90}ms` }"
      >
        <p class="offer__kicker">{{ i === 0 ? 'Hardware + platform' : 'Platform on your devices' }}</p>
        <h4 class="offer__name">{{ offer.name }}</h4>
        <p class="offer__tagline">{{ offer.tagline }}</p>
        <p class="offer__text">{{ offer.text }}</p>
        <p class="offer__best">{{ offer.best }}</p>
      </GlassCard>
    </div>
    <p class="offers__note reveal"><TbcCopy :text="HOW.offerNamesNote" /></p>
  </section>
</template>

<style scoped>
.steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  position: relative;
}
/* Signal line connecting the four nodes */
.steps::before {
  content: '';
  position: absolute;
  top: 28px;
  left: 28px;
  right: 12%;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-saffron) 70%, transparent) 0 8px,
    transparent 8px 14px
  );
  background-size: 28px 2px;
  animation: flow 1.6s linear infinite;
}
@keyframes flow {
  to {
    background-position: 28px 0;
  }
}
.step__node {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  display: grid;
  place-items: center;
  color: var(--color-saffron);
  background: var(--color-night-2);
  border: 1px solid color-mix(in srgb, var(--color-saffron) 45%, transparent);
  box-shadow: 0 0 28px -8px color-mix(in srgb, var(--color-saffron) 55%, transparent);
}
.step__num {
  position: absolute;
  top: -9px;
  right: -12px;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  color: var(--color-void);
  background: var(--color-saffron);
}
.step__name {
  font-size: 1.35rem;
  margin: 1.25rem 0 0.5rem;
}
.step__text {
  margin: 0;
  color: var(--color-mist);
  line-height: 1.6;
}
.dnd {
  margin: 2rem 0 0;
  font-size: 0.9rem;
  color: var(--color-mist);
}
.offers__title {
  font-size: 1.5rem;
  margin: 3.5rem 0 1.25rem;
}
.offers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.offer__kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-saffron);
}
.offer__name {
  font-size: 1.6rem;
  margin: 0.6rem 0 0.25rem;
}
.offer__tagline {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-style: italic;
  color: var(--color-ivory);
}
.offer__text {
  margin: 0;
  color: var(--color-mist);
  line-height: 1.6;
}
.offer__best {
  margin: 1.25rem 0 0;
  padding-top: 1rem;
  border-top: 1px dashed color-mix(in srgb, var(--color-ivory) 16%, transparent);
  font-size: 0.9rem;
  color: var(--color-emerald);
}
.offers__note {
  margin: 1rem 0 0;
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .steps {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-left: 76px;
  }
  .steps::before {
    top: 28px;
    bottom: 28px;
    left: 27px;
    right: auto;
    width: 2px;
    height: auto;
    background: repeating-linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-saffron) 70%, transparent) 0 8px,
      transparent 8px 14px
    );
    animation: none;
  }
  .step {
    position: relative;
  }
  .step__node {
    position: absolute;
    left: -76px;
    top: 0;
  }
  .step__name {
    margin-top: 0.6rem;
  }
  .offers {
    grid-template-columns: 1fr;
  }
}
</style>
