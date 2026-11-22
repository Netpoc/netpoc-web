<script setup lang="ts">
import { consentOpen, setConsent } from '@/lib/consent'
</script>

<template>
  <Transition name="consent">
    <section
      v-if="consentOpen"
      class="consent glass-strong"
      role="region"
      aria-labelledby="consent-title"
    >
      <h2 id="consent-title" class="consent__title">Help us improve this site?</h2>
      <p class="consent__text">
        With your permission we use Google Analytics cookies to see which pages people visit and
        which campaigns brought them here. Nothing is sent unless you allow it, and you can change
        your mind from the footer at any time.
      </p>
      <div class="consent__actions">
        <button type="button" class="btn btn--primary btn--sm" @click="setConsent('granted')">
          Allow analytics
        </button>
        <button type="button" class="btn btn--outline btn--sm" @click="setConsent('denied')">
          No thanks
        </button>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.consent {
  position: fixed;
  left: 1.25rem;
  bottom: 1.25rem;
  z-index: 60;
  width: min(25rem, calc(100vw - 2rem));
  padding: 1.25rem 1.35rem;
  border-radius: 1.25rem;
}
.consent__title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}
.consent__text {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--color-mist);
}
.consent__actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}
.consent__actions .btn {
  flex: 1;
  justify-content: center;
}

/* On mobile, sit above the FuelPay CTA dock and safe area. */
@media (max-width: 760px) {
  .consent {
    left: 1rem;
    right: 1rem;
    width: auto;
    bottom: calc(1rem + env(safe-area-inset-bottom));
  }
}

.consent-enter-active,
.consent-leave-active {
  transition: opacity 0.35s ease, transform 0.45s var(--ease-out-expo);
}
.consent-enter-from,
.consent-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
