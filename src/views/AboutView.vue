<script setup lang="ts">
import { ref } from 'vue'
import { useReveal } from '@/composables/useReveal'
import AnkaraPattern from '@/components/AnkaraPattern.vue'
import GlassCard from '@/components/GlassCard.vue'

const root = ref<HTMLElement | null>(null)
useReveal(root)

const values = [
  { title: 'Innovation', desc: 'We solve African problems with original engineering, not borrowed templates.' },
  { title: 'Value', desc: 'Every project is measured by the real-world value it creates.' },
  { title: 'Craft', desc: 'From RTL to UI, we sweat the details others skip.' },
  { title: 'Reach', desc: 'We build for everyone — smartphone or feature phone, city or field.' },
]
</script>

<template>
  <div ref="root" class="page">
    <section class="intro">
      <div class="intro__text reveal">
        <span class="pill">About Netpoc</span>
        <h1>An African tech company, building from first principles.</h1>
        <p>
          Netpoc Inc Limited is an innovation- and value-driven African
          technology company. We work across System Design, System on Chip,
          IoT, Software Development, USSD Solutions, Telematics and Agric Tech —
          uniting deep hardware expertise with modern software craft.
        </p>
        <p>
          Our name is rooted in the continent we build for. The patterns woven
          through this site draw on <strong>Nsibidi</strong>, an indigenous West
          African writing system, and the geometry of <strong>Ankara</strong>
          wax-print fabric — heritage and engineering, in the same frame.
        </p>
      </div>

      <div class="intro__art reveal" aria-hidden="true">
        <AnkaraPattern :scale="120" :opacity="0.9" />
      </div>
    </section>

    <section class="values">
      <GlassCard
        v-for="(v, i) in values"
        :key="v.title"
        interactive
        class="reveal"
        :style="{ transitionDelay: `${i * 60}ms` }"
      >
        <h3 class="values__title">{{ v.title }}</h3>
        <p class="values__desc">{{ v.desc }}</p>
      </GlassCard>
    </section>
  </div>
</template>

<style scoped>
.page {
  padding-top: 7rem;
  max-width: 1200px;
  margin: 0 auto;
}
.intro {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 2rem 1.5rem 4rem;
}
.intro__text h1 {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  margin: 1rem 0 1.5rem;
}
.intro__text p {
  color: var(--color-mist);
  line-height: 1.7;
  margin-bottom: 1.1rem;
}
.intro__text strong {
  color: var(--color-ivory);
}
.intro__art {
  position: relative;
  aspect-ratio: 1;
  border-radius: 2rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-ivory) 12%, transparent);
  mask-image: radial-gradient(circle, black 55%, transparent 78%);
}
.values {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  padding: 0 1.5rem 2rem;
}
.values__title {
  font-size: 1.3rem;
  color: var(--color-saffron);
  margin-bottom: 0.6rem;
}
.values__desc {
  color: var(--color-mist);
  line-height: 1.6;
}
@media (max-width: 760px) {
  .intro {
    grid-template-columns: 1fr;
  }
  .intro__art {
    max-width: 360px;
  }
}
</style>
