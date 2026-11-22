<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useReveal } from '@/composables/useReveal'
import NsibidiPattern from '@/components/NsibidiPattern.vue'
import AnkaraPattern from '@/components/AnkaraPattern.vue'
import GlassCard from '@/components/GlassCard.vue'
import CultureFigure from '@/components/CultureFigure.vue'
import { HERO as FP_HERO, PRODUCT_DESCRIPTOR, PROBLEM, SEGMENTS, SEGMENT_CONTENT } from '@/content/fuelpay'
import { track } from '@/lib/track'

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

// Defensible figures only: our own count, plus the cited market numbers from the FuelPay page.
const towerDiesel = PROBLEM.stats[0]!
const tractors = PROBLEM.stats[2]!
const stats = [
  { value: '6', label: 'Practice areas' },
  { value: `${towerDiesel.value}${towerDiesel.suffix} L`, label: 'Tower diesel / month, Nigeria' },
  { value: tractors.value.toLocaleString('en-NG'), label: 'NAMP tractors' },
]
const statSources = `Sources: ${towerDiesel.source}; ${tractors.source}.`
</script>

<template>
  <div ref="root" class="home">
    <!-- ============ HERO ============ -->
    <section class="hero">
      <NsibidiPattern class="hero__nsibidi" variant="ukara" :scale="200" :opacity="0.08" color="var(--color-ivory)" />

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
          <RouterLink to="/fuelpay" class="btn btn--ghost">See FuelPay</RouterLink>
        </div>

        <ul class="hero__stats reveal">
          <li v-for="s in stats" :key="s.label">
            <strong>{{ s.value }}</strong>
            <span>{{ s.label }}</span>
          </li>
        </ul>
        <p class="hero__sources reveal">{{ statSources }}</p>
      </div>

      <div class="hero__ankara" aria-hidden="true">
        <AnkaraPattern :scale="110" :opacity="0.9" />
      </div>

      <!-- Signature figure: stands in front of the Ankara sun and waves -->
      <div class="hero__figure reveal" style="transition-delay: 200ms">
        <CultureFigure name="woman-waving" animate height="100%" />
      </div>
    </section>

    <!-- ============ FUELPAY (the product) ============ -->
    <section class="section" aria-labelledby="fp-title">
      <div class="fp reveal">
        <div class="fp__pattern" aria-hidden="true">
          <AnkaraPattern :scale="120" :opacity="0.9" />
        </div>
        <div class="fp__panel glass-strong">
          <div class="fp__copy">
            <span class="pill">{{ FP_HERO.eyebrow }} · {{ PRODUCT_DESCRIPTOR }}</span>
            <h2 id="fp-title" class="fp__title">
              {{ FP_HERO.title[0] }} {{ FP_HERO.title[1] }}
              <span class="text-ankara">{{ FP_HERO.title[2] }}</span>
            </h2>
            <p class="fp__sub">{{ FP_HERO.sub }}</p>
            <div class="fp__actions">
              <RouterLink to="/fuelpay" class="btn btn--primary" @click="track('home_fuelpay_click', { cta: 'see' })">
                See how FuelPay works
              </RouterLink>
              <RouterLink to="/fuelpay/book-poc" class="btn btn--outline" @click="track('home_fuelpay_click', { cta: 'poc' })">
                {{ FP_HERO.primary }}
              </RouterLink>
            </div>
          </div>

          <ul class="fp__segments" aria-label="Who FuelPay is for">
            <li v-for="id in SEGMENTS" :key="id">
              <RouterLink
                :to="{ path: '/fuelpay', hash: `#${id}` }"
                class="fp__segment"
                @click="track('home_fuelpay_click', { cta: 'segment', segment: id })"
              >
                <span class="fp__segment-label">{{ SEGMENT_CONTENT[id].label }}</span>
                <span class="fp__segment-line">{{ SEGMENT_CONTENT[id].headline }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>
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
        <CultureFigure class="cta__figure" name="man-standing" palette="ankara" mirror :ground="false" height="380px" />
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
.hero__sources {
  margin: 1rem 0 0;
  font-size: 0.75rem;
  color: var(--color-muted);
}
.hero__figure {
  position: absolute;
  right: 6%;
  bottom: 2rem;
  height: min(600px, 78%);
  display: flex;
  align-items: flex-end;
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

/* FuelPay band */
.fp {
  position: relative;
}
.fp__pattern {
  position: absolute;
  inset: -1.5rem -1.5rem -1.5rem 45%;
  border-radius: 2rem;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 35%);
}
.fp__panel {
  position: relative;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: clamp(2rem, 4vw, 3.5rem);
  align-items: center;
  border-radius: 2rem;
  padding: clamp(2rem, 5vw, 3.5rem);
}
.fp__title {
  font-size: clamp(1.9rem, 4vw, 2.9rem);
  line-height: 1.08;
  margin: 1.1rem 0 1rem;
}
.fp__sub {
  color: var(--color-mist);
  line-height: 1.7;
  max-width: 52ch;
}
.fp__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}
.fp__segments {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid color-mix(in srgb, var(--color-ivory) 12%, transparent);
}
.fp__segments li {
  border-bottom: 1px solid color-mix(in srgb, var(--color-ivory) 12%, transparent);
}
.fp__segment {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.1rem 0.25rem;
  text-decoration: none;
  color: inherit;
  transition: padding 0.35s var(--ease-out-expo);
}
.fp__segment:hover {
  padding-left: 0.75rem;
}
.fp__segment:focus-visible {
  outline: 2px solid var(--color-saffron);
  outline-offset: 2px;
  border-radius: 0.5rem;
}
.fp__segment-label {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--color-saffron);
}
.fp__segment-line {
  color: var(--color-mist);
  line-height: 1.5;
  font-size: 0.95rem;
}
@media (max-width: 860px) {
  .fp__panel {
    grid-template-columns: 1fr;
  }
  .fp__pattern {
    inset: -1rem -1rem 55% 30%;
  }
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
.cta__figure {
  position: absolute;
  left: 4%;
  bottom: -26%;
  z-index: 1;
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

<style scoped>
/* Figures: copy always paints above the hero figure; it moves under the copy on small screens; accents hide */
.hero__content {
  z-index: 2;
}
@media (max-width: 1080px) {
  .hero__figure {
    right: 0;
    height: min(480px, 60%);
    opacity: 0.55;
  }
}
@media (max-width: 960px) {
  .hero__figure {
    position: relative;
    right: auto;
    bottom: auto;
    height: 300px;
    opacity: 1;
    justify-content: center;
    margin-top: 2.5rem;
  }
  .cta__figure {
    display: none;
  }
}
</style>
