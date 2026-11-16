<script setup lang="ts">
import SectionHead from './SectionHead.vue'
import TbcCopy from './TbcCopy.vue'
import FpIcon from './FpIcon.vue'
import { track } from '@/lib/track'
import { FAQ } from '@/content/fuelpay'

function onToggle(e: Event, id: string) {
  if ((e.target as HTMLDetailsElement).open) track('faq_open', { question_id: id })
}
</script>

<template>
  <section id="faq" class="section">
    <SectionHead index="08" eyebrow="FAQ" :title="FAQ.title" />

    <div class="faq">
      <details
        v-for="item in FAQ.items"
        :key="item.id"
        class="faq__item reveal"
        @toggle="onToggle($event, item.id)"
      >
        <summary class="faq__q">
          <span>{{ item.q }}</span>
          <span class="faq__icon" aria-hidden="true"><FpIcon name="plus" :size="18" /></span>
        </summary>
        <div class="faq__a">
          <p><TbcCopy :text="item.a" /></p>
        </div>
      </details>
    </div>
  </section>
</template>

<style scoped>
.faq {
  max-width: 52rem;
  border-top: 1px solid color-mix(in srgb, var(--color-ivory) 12%, transparent);
}
.faq__item {
  border-bottom: 1px solid color-mix(in srgb, var(--color-ivory) 12%, transparent);
  interpolate-size: allow-keywords;
}
.faq__item::details-content {
  block-size: 0;
  overflow: hidden;
  transition:
    block-size 0.45s var(--ease-out-expo),
    content-visibility 0.45s allow-discrete;
}
.faq__item[open]::details-content {
  block-size: auto;
}
.faq__q {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  min-height: 44px;
  padding: 1.25rem 0;
  cursor: pointer;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.02rem, 2vw, 1.2rem);
  transition: color 0.3s ease;
}
.faq__q::-webkit-details-marker {
  display: none;
}
.faq__q:hover {
  color: var(--color-saffron);
}
.faq__q:focus-visible {
  outline: 2px solid var(--color-saffron);
  outline-offset: 4px;
  border-radius: 0.4rem;
}
.faq__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--color-ivory) 20%, transparent);
  transition: transform 0.4s var(--ease-out-expo), background 0.3s ease, color 0.3s ease;
}
.faq__item[open] .faq__icon {
  transform: rotate(45deg);
  color: var(--color-void);
  background: var(--color-saffron);
  border-color: var(--color-saffron);
}
.faq__a p {
  margin: 0;
  padding: 0 3.5rem 1.5rem 0;
  color: var(--color-mist);
  line-height: 1.7;
}
@media (max-width: 640px) {
  .faq__a p {
    padding-right: 0;
  }
}
</style>
