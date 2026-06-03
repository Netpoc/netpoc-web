<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useReveal } from '@/composables/useReveal'
import NsibidiPattern from '@/components/NsibidiPattern.vue'
import AnkaraPattern from '@/components/AnkaraPattern.vue'
import GlassCard from '@/components/GlassCard.vue'

const root = ref<HTMLElement | null>(null)
useReveal(root)

const services = [
  { tag: 'Silicon', title: 'System on Chip', desc: 'Custom SoC architecture and verification for power-efficient African hardware.' },
  { tag: 'Connected', title: 'IoT & Telematics', desc: 'Fleet, asset and sensor networks built for low-bandwidth, high-reliability conditions.' },
  { tag: 'Access', title: 'USSD Solutions', desc: 'Feature-phone-first services that reach every customer, no smartphone required.' },
  { tag: 'Build', title: 'Software Development', desc: 'Web, mobile and platform engineering with a product mindset.' },
  { tag: 'Design', title: 'System Design', desc: 'End-to-end architecture from requirements to resilient, scalable systems.' },
  { tag: 'Grow', title: 'Agric Tech', desc: 'Data-driven tools that lift yields and connect farmers to markets.' },
]

const stats = [
  { value: '6+', label: 'Practice areas' },
  { value: '100%', label: 'African-engineered' },
  { value: '24/7', label: 'Connected systems' },
]
</script>

<template>
  <div ref="root" class="home">
    <!-- ============ HERO ============ -->
    <section class="hero">
      <NsibidiPattern class="hero__nsibidi" :opacity="0.07" color="var(--color-ivory)" />

      <div class="hero__content">
        <span class="pill glass reveal">
          <span class="pill__dot" /> Value-Driven Innovation
        </span>

        <h1 class="hero__title reveal">
          African innovation,
          <span class="text-ankara">engineered</span>
          from silicon to software.
        </h1>

        <p class="hero__lede reveal">
          We design systems on chip, connect the physical world through IoT and
          telematics, reach every customer with USSD, and grow the future with
          Agric Tech — value-driven technology, built on the continent.
        </p>

        <div class="hero__actions reveal">
          <RouterLink to="/contact" class="btn btn--primary">Start a project</RouterLink>
          <RouterLink to="/services" class="btn btn--ghost">Explore our work →</RouterLink>
        </div>

        <ul class="hero__stats reveal">
          <li v-for="s in stats" :key="s.label">
            <strong>{{ s.value }}</strong>
            <span>{{ s.label }}</span>
          </li>
        </ul>
      </div>

      <div class="hero__ankara" aria-hidden="true">
        <AnkaraPattern :scale="110" :opacity="0.9" />
      </div>
    </section>

    <!-- ============ SERVICES ============ -->
    <section class="section">
      <div class="section__head reveal">
        <span class="pill">What we do</span>
        <h2>Deep capability across the stack</h2>
        <p>One team, from the transistor to the touchscreen.</p>
      </div>

      <div class="grid">
        <GlassCard
          v-for="(svc, i) in services"
          :key="svc.title"
          interactive
          class="reveal"
          :style="{ transitionDelay: `${i * 60}ms` }"
        >
          <span class="card__tag">{{ svc.tag }}</span>
          <h3 class="card__title">{{ svc.title }}</h3>
          <p class="card__desc">{{ svc.desc }}</p>
        </GlassCard>
      </div>
    </section>

    <!-- ============ CTA ============ -->
    <section class="section">
      <div class="cta reveal">
        <AnkaraPattern class="cta__pattern" :scale="130" :opacity="0.12" />
        <div class="cta__inner glass-strong">
          <h2>Let's build something the continent is proud of.</h2>
          <p>Tell us about your idea — hardware, software, or both.</p>
          <RouterLink to="/contact" class="btn btn--primary">Get in touch</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding-top: 5rem;
}

/* Hero */
.hero {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 1.5rem 4rem;
  overflow: hidden;
}
.hero__nsibidi {
  mask-image: radial-gradient(circle at 30% 30%, black, transparent 75%);
}
.hero__content {
  position: relative;
  max-width: 60ch;
}
.pill__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-emerald);
  box-shadow: 0 0 12px var(--color-emerald);
}
.hero__title {
  font-size: clamp(2.6rem, 7vw, 5rem);
  margin: 1.5rem 0;
}
.hero__lede {
  font-size: clamp(1.05rem, 2vw, 1.3rem);
  line-height: 1.6;
  color: var(--color-mist);
  max-width: 54ch;
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2.25rem 0;
}
.hero__stats {
  display: flex;
  gap: 2.5rem;
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
  flex-wrap: wrap;
}
.hero__stats li {
  display: flex;
  flex-direction: column;
}
.hero__stats strong {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-saffron);
}
.hero__stats span {
  font-size: 0.85rem;
  color: var(--color-muted);
  font-family: var(--font-mono);
}
.hero__ankara {
  position: absolute;
  top: -10%;
  right: -18%;
  width: 48%;
  height: 120%;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0.5;
  mask-image: radial-gradient(circle, black 40%, transparent 70%);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s var(--ease-out-expo), filter 0.3s ease, background 0.3s ease;
}
.btn--primary {
  background: linear-gradient(100deg, var(--color-saffron), var(--color-coral));
  color: var(--color-void);
}
.btn--primary:hover {
  transform: translateY(-3px);
  filter: brightness(1.08);
}
.btn--ghost {
  color: var(--color-ivory);
  border: 1px solid color-mix(in srgb, var(--color-ivory) 22%, transparent);
}
.btn--ghost:hover {
  transform: translateY(-3px);
  background: color-mix(in srgb, var(--color-ivory) 6%, transparent);
}

/* Sections */
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}
.section__head {
  text-align: center;
  max-width: 48ch;
  margin: 0 auto 3rem;
}
.section__head h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 1rem 0 0.75rem;
}
.section__head p {
  color: var(--color-mist);
}

/* Grid + cards */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.card__tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-saffron);
}
.card__title {
  font-size: 1.4rem;
  margin: 0.6rem 0 0.75rem;
}
.card__desc {
  color: var(--color-mist);
  line-height: 1.6;
}

/* CTA */
.cta {
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
}
.cta__pattern {
  inset: 0;
}
.cta__inner {
  position: relative;
  border-radius: 2rem;
  padding: clamp(2.5rem, 6vw, 5rem);
  text-align: center;
}
.cta__inner h2 {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  max-width: 22ch;
  margin: 0 auto 1rem;
}
.cta__inner p {
  color: var(--color-mist);
  margin-bottom: 2rem;
}
</style>
