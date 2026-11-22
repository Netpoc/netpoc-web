<script setup lang="ts">
import { useRoute } from 'vue-router'
import NsibidiPattern from '@/components/NsibidiPattern.vue'

const route = useRoute()
</script>

<template>
  <div class="page">
    <NsibidiPattern variant="ukara" :scale="220" :opacity="0.07" color="var(--color-ivory)" />

    <section class="lost glass-strong" aria-labelledby="lost-title">
      <span class="pill">404</span>
      <h1 id="lost-title">This page doesn't exist.</h1>
      <p>
        Nothing lives at <code>{{ route.fullPath }}</code>. The link may be old or mistyped.
        These will get you back on track:
      </p>
      <div class="lost__actions">
        <RouterLink to="/" class="btn btn--primary">Go to the homepage</RouterLink>
        <RouterLink to="/fuelpay" class="btn btn--outline">See FuelPay</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  overflow: hidden;
  min-height: 80vh;
  display: grid;
  place-items: center;
  padding: 9rem 1.5rem 4rem;
}
.lost {
  position: relative;
  max-width: 36rem;
  padding: 2.5rem;
  border-radius: 1.5rem;
}
.lost h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.1;
  margin: 1rem 0;
}
.lost p {
  color: var(--color-mist);
  line-height: 1.7;
}
.lost code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  color: var(--color-saffron);
  word-break: break-all;
}
.lost__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}
</style>
