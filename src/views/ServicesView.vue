<script setup lang="ts">
import { ref } from 'vue'
import { useReveal } from '@/composables/useReveal'
import NsibidiPattern from '@/components/NsibidiPattern.vue'
import GlassCard from '@/components/GlassCard.vue'
import CultureFigure from '@/components/CultureFigure.vue'

const root = ref<HTMLElement | null>(null)
useReveal(root)

const services = [
  {
    id: 'design',
    tag: 'System Design',
    title: 'Architecture that holds under load',
    points: ['Requirements to resilient architecture', 'Scalability & reliability reviews', 'Hardware/software co-design'],
  },
  {
    id: 'soc',
    tag: 'System on Chip',
    title: 'Silicon, designed in Africa',
    points: ['Custom SoC architecture', 'RTL design & verification', 'Power & area optimisation'],
  },
  {
    id: 'iot',
    tag: 'IoT & Telematics',
    title: 'The physical world, online',
    points: ['Fleet & asset tracking', 'Sensor networks', 'Edge-to-cloud pipelines'],
    product: { to: '/fuelpay', label: 'See FuelPay, built by this team' },
  },
  {
    id: 'ussd',
    tag: 'USSD Solutions',
    title: 'Reach every customer',
    points: ['Feature-phone-first journeys', 'Telco & payment integration', 'High-availability menus'],
  },
  {
    id: 'software',
    tag: 'Software Development',
    title: 'Products people rely on',
    points: ['Web & mobile platforms', 'APIs & integrations', 'Product-minded delivery'],
  },
  {
    id: 'agric',
    tag: 'Agric Tech',
    title: 'Technology that grows',
    points: ['Yield & soil intelligence', 'Market connectivity', 'Farmer-facing tooling'],
  },
]
</script>

<template>
  <div ref="root" class="page">
    <header class="page__head">
      <NsibidiPattern :opacity="0.06" color="var(--color-ivory)" />
      <!-- Welcome party: two full figures flank the headline on a shared ground line -->
      <div class="page__party" aria-hidden="true">
        <CultureFigure class="page__figure page__figure--left reveal" name="man-headdress" animate height="100%" />
        <CultureFigure class="page__figure page__figure--right reveal" name="woman-waving" mirror height="100%" />
      </div>
      <div class="page__head-inner reveal">
        <span class="pill">Services</span>
        <h1>From the transistor to the touchscreen</h1>
        <p>Six practice areas, one integrated engineering team.</p>
      </div>
    </header>

    <section class="page__body">
      <GlassCard
        v-for="(svc, i) in services"
        :id="svc.id"
        :key="svc.id"
        class="reveal svc"
        :style="{ transitionDelay: `${i * 50}ms` }"
      >
        <span class="card__tag">{{ svc.tag }}</span>
        <h2 class="svc__title">{{ svc.title }}</h2>
        <ul class="svc__points">
          <li v-for="p in svc.points" :key="p">{{ p }}</li>
        </ul>
        <RouterLink v-if="svc.product" :to="svc.product.to" class="svc__product">
          {{ svc.product.label }}
        </RouterLink>
      </GlassCard>
    </section>
  </div>
</template>

<style scoped>
.page {
  padding-top: 6rem;
}
.page__head {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 4rem 1.5rem 2rem;
  min-height: 380px;
  display: grid;
  align-content: center;
}
.page__party {
  position: absolute;
  inset: auto 0 0;
  max-width: 1240px;
  height: 340px;
  margin: 0 auto;
  pointer-events: none;
}
/* Ground line the figures stand on */
.page__party::after {
  content: '';
  position: absolute;
  left: 2%;
  right: 2%;
  bottom: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--color-saffron) 55%, transparent) 15%,
    transparent 32%,
    transparent 68%,
    color-mix(in srgb, var(--color-coral) 55%, transparent) 85%,
    transparent
  );
}
.page__figure {
  position: absolute;
  bottom: 0;
}
.page__figure--left {
  left: 6%;
}
.page__figure--right {
  right: 6%;
  transition-delay: 120ms;
}
@media (max-width: 1100px) {
  .page__party {
    display: none;
  }
}
.page__head-inner {
  position: relative;
  max-width: 50ch;
  margin: 0 auto;
}
.page__head h1 {
  font-size: clamp(2.4rem, 6vw, 4rem);
  margin: 1rem 0 0.75rem;
}
.page__head p {
  color: var(--color-mist);
}
.page__body {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.svc {
  scroll-margin-top: 7rem;
}
.card__tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-saffron);
}
.svc__title {
  font-size: 1.5rem;
  margin: 0.6rem 0 1rem;
}
.svc__points {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.svc__points li {
  color: var(--color-mist);
  padding-left: 1.4rem;
  position: relative;
}
.svc__product {
  display: inline-block;
  margin-top: 1.25rem;
  color: var(--color-saffron);
  font-weight: 600;
  text-underline-offset: 4px;
}
.svc__product:hover {
  color: var(--color-ivory);
}
.svc__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 7px;
  height: 7px;
  border-radius: 2px;
  transform: rotate(45deg);
  background: linear-gradient(135deg, var(--color-saffron), var(--color-coral));
}
</style>
