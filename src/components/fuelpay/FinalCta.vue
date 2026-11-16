<script setup lang="ts">
import AnkaraPattern from '@/components/AnkaraPattern.vue'
import CultureFigure from '@/components/CultureFigure.vue'
import CtaPair from './CtaPair.vue'
import TbcCopy from './TbcCopy.vue'
import { CONTACT, FINAL_CTA, isPlaceholder } from '@/content/fuelpay'
</script>

<template>
  <section id="contact" class="section">
    <div class="final reveal">
      <AnkaraPattern :scale="130" :opacity="0.16" />
      <CultureFigure class="final__figure" name="family" palette="ankara" :ground="false" height="400px" />
      <div class="final__inner glass-strong">
        <h2 class="final__title">{{ FINAL_CTA.title }}</h2>
        <p class="final__sub">{{ FINAL_CTA.sub }}</p>
        <CtaPair class="final__ctas" location="final" />
        <p class="final__contact">
          Prefer to talk? Call
          <a v-if="!isPlaceholder(CONTACT.phone)" :href="`tel:${CONTACT.phone}`">{{ CONTACT.phone }}</a>
          <TbcCopy v-else :text="CONTACT.phone" />
          or email
          <a v-if="!isPlaceholder(CONTACT.email)" :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</a>
          <TbcCopy v-else :text="CONTACT.email" />.
          WhatsApp:
          <a
            v-if="!isPlaceholder(CONTACT.whatsapp)"
            :href="`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`"
            target="_blank"
            rel="noopener"
          >{{ CONTACT.whatsapp }}</a>
          <TbcCopy v-else :text="CONTACT.whatsapp" />
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.final {
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
}
.final__figure {
  position: absolute;
  right: 3%;
  bottom: -22%;
  z-index: 1;
}
@media (max-width: 1100px) {
  .final__figure {
    display: none;
  }
}
.final__inner {
  position: relative;
  border-radius: 2rem;
  padding: clamp(2.5rem, 7vw, 5.5rem) clamp(1.5rem, 5vw, 4rem);
  text-align: center;
}
.final__title {
  font-size: clamp(1.9rem, 4.6vw, 3.2rem);
  max-width: 20ch;
  margin: 0 auto 1rem;
  text-wrap: balance;
}
.final__sub {
  color: var(--color-mist);
  font-size: 1.1rem;
  max-width: 48ch;
  margin: 0 auto 2rem;
  line-height: 1.6;
}
.final__ctas {
  justify-content: center;
}
.final__contact {
  margin: 2rem 0 0;
  color: var(--color-mist);
  font-size: 0.92rem;
  line-height: 2;
}
.final__contact a {
  color: var(--color-saffron);
  font-family: var(--font-mono);
}
</style>
