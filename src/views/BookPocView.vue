<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NsibidiPattern from '@/components/NsibidiPattern.vue'
import PocForm from '@/components/fuelpay/PocForm.vue'
import { utmFromQuery } from '@/composables/useFuelPay'
import { FUELPAY_LINKS, isPlaceholder, isSegment } from '@/content/fuelpay'

/** Full-page PoC form — used on narrow screens instead of the modal. */
const route = useRoute()
const q = route.query

const segment = isSegment(q.segment) ? q.segment : null
const num = (v: unknown) => (typeof v === 'string' && v !== '' && Number.isFinite(+v) ? +v : null)
const calc =
  num(q.calc_sites) !== null && num(q.calc_loss_naira) !== null
    ? { sites: num(q.calc_sites)!, litres: num(q.calc_litres) ?? 0, lossNaira: num(q.calc_loss_naira)! }
    : null
const attribution = {
  ...utmFromQuery(q),
  referrer: document.referrer,
  page_url: window.location.origin + '/fuelpay',
}

const demoHref = computed(() => {
  if (isPlaceholder(FUELPAY_LINKS.demoSignup)) return '/fuelpay#demo'
  const url = new URL(FUELPAY_LINKS.demoSignup)
  if (segment) url.searchParams.set('segment', segment)
  return url.toString()
})
</script>

<template>
  <div class="page">
    <NsibidiPattern :opacity="0.05" color="var(--color-ivory)" />
    <div class="wrap">
      <RouterLink :to="{ path: '/fuelpay', hash: segment ? `#${segment}` : '' }" class="back">← Back to FuelPay</RouterLink>
      <p class="kicker">60-day paid pilot · fee credited on rollout</p>
      <h1>Book a FuelPay PoC</h1>
      <div class="card glass-strong">
        <PocForm :segment="segment" :calc="calc" :attribution="attribution" :demo-href="demoHref" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  overflow: hidden;
  padding: 7rem 1rem 3rem;
}
.wrap {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
}
.back {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--color-mist);
  text-decoration: none;
  font-size: 0.9rem;
}
.kicker {
  margin: 1rem 0 0;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-saffron);
}
h1 {
  font-size: clamp(2rem, 7vw, 2.8rem);
  margin: 0.5rem 0 1.5rem;
}
.card {
  border-radius: 1.5rem;
  padding: clamp(1.25rem, 4vw, 2rem);
}
</style>
