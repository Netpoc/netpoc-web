<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside, onKeyStroke, useWindowScroll } from '@vueuse/core'
import CtaPair from './CtaPair.vue'
import FpIcon from './FpIcon.vue'
import { useFuelPay } from '@/composables/useFuelPay'
import { FUELPAY_LINKS, SEGMENTS, SEGMENT_CONTENT, isPlaceholder, type Segment } from '@/content/fuelpay'

const { selectSegment, scrollToSection } = useFuelPay()
const { y } = useWindowScroll()
const visible = computed(() => y.value > 100)

const menuOpen = ref(false)
const menu = ref<HTMLElement | null>(null)
onClickOutside(menu, () => (menuOpen.value = false))
onKeyStroke('Escape', () => (menuOpen.value = false))

const loginHref = isPlaceholder(FUELPAY_LINKS.appLogin) ? undefined : FUELPAY_LINKS.appLogin

function goSegment(id: Segment) {
  menuOpen.value = false
  selectSegment(id)
  scrollToSection('solutions')
}
</script>

<template>
  <!-- Desktop: product strip under the global nav -->
  <div class="bar" :class="{ 'bar--on': visible }" :inert="!visible || undefined">
    <div class="bar__inner glass-strong">
      <button type="button" class="bar__brand" @click="scrollToSection('top')">
        <span class="bar__mark" aria-hidden="true" />
        FuelPay
        <span class="bar__tag">Fuel &amp; Energy Monitoring</span>
      </button>

      <nav class="bar__links" aria-label="FuelPay">
        <div ref="menu" class="bar__menu">
          <button
            type="button"
            class="bar__link"
            aria-haspopup="true"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            Solutions <FpIcon name="chevron" :size="14" />
          </button>
          <Transition name="drop">
            <ul v-if="menuOpen" class="bar__drop glass-strong">
              <li v-for="id in SEGMENTS" :key="id">
                <button type="button" @click="goSegment(id)">{{ SEGMENT_CONTENT[id].label }}</button>
              </li>
            </ul>
          </Transition>
        </div>
        <button type="button" class="bar__link" @click="scrollToSection('how-it-works')">How it works</button>
        <button type="button" class="bar__link" @click="scrollToSection('faq')">FAQ</button>
        <a
          class="bar__link"
          :href="loginHref"
          :aria-disabled="!loginHref || undefined"
          :title="loginHref ? undefined : `Placeholder: ${FUELPAY_LINKS.appLogin}`"
        >Log in</a>
      </nav>

      <CtaPair location="sticky" size="sm" class="bar__ctas" />
    </div>
  </div>

  <!-- Mobile: one sticky bottom bar with both CTAs -->
  <div class="dock" :class="{ 'dock--on': visible }" :inert="!visible || undefined">
    <CtaPair location="sticky" size="sm" class="dock__ctas" />
  </div>
</template>

<style scoped>
.bar {
  position: fixed;
  top: 66px;
  left: 0;
  right: 0;
  z-index: 40;
  padding: 0 1.5rem;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-12px);
  transition: opacity 0.35s ease, transform 0.45s var(--ease-out-expo);
}
.bar--on {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.bar__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.45rem 0.5rem 0.45rem 1.1rem;
  border-radius: 999px;
}
.bar__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: var(--color-ivory);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  min-height: 40px;
}
.bar__mark {
  width: 10px;
  height: 18px;
  border-radius: 3px;
  background: linear-gradient(
    to top,
    var(--color-saffron) 0 62%,
    color-mix(in srgb, var(--color-ivory) 18%, transparent) 62%
  );
  box-shadow: 0 0 10px -2px var(--color-saffron);
}
.bar__tag {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
}
.bar__links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
}
.bar__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 40px;
  padding: 0 0.75rem;
  border: 0;
  border-radius: 999px;
  background: none;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--color-mist);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease, background 0.3s ease;
}
.bar__link:hover {
  color: var(--color-ivory);
  background: color-mix(in srgb, var(--color-ivory) 6%, transparent);
}
.bar__link[aria-disabled='true'] {
  cursor: help;
  text-decoration: underline dashed color-mix(in srgb, var(--color-coral) 70%, transparent);
  text-underline-offset: 4px;
}
.bar__link:focus-visible,
.bar__brand:focus-visible,
.bar__drop button:focus-visible {
  outline: 2px solid var(--color-saffron);
  outline-offset: 2px;
}
.bar__menu {
  position: relative;
}
.bar__drop {
  position: absolute;
  top: calc(100% + 0.6rem);
  left: 0;
  min-width: 14rem;
  list-style: none;
  margin: 0;
  padding: 0.4rem;
  border-radius: 1rem;
}
.bar__drop button {
  width: 100%;
  min-height: 44px;
  text-align: left;
  padding: 0 0.85rem;
  border: 0;
  border-radius: 0.65rem;
  background: none;
  font: inherit;
  font-size: 0.92rem;
  color: var(--color-ivory);
  cursor: pointer;
}
.bar__drop button:hover {
  background: color-mix(in srgb, var(--color-saffron) 14%, transparent);
}
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.2s ease, transform 0.3s var(--ease-out-expo);
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.bar__ctas {
  flex-wrap: nowrap;
  gap: 0.5rem;
}

.dock {
  display: none;
}

@media (max-width: 1020px) {
  .bar__tag {
    display: none;
  }
}
@media (max-width: 860px) {
  .bar__links {
    display: none;
  }
  .bar__ctas {
    margin-left: auto;
  }
}
@media (max-width: 760px) {
  .bar {
    display: none;
  }
  .dock {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 45;
    padding: 0.65rem 1rem calc(0.65rem + env(safe-area-inset-bottom));
    background: color-mix(in srgb, var(--color-night) 82%, transparent);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-top: 1px solid color-mix(in srgb, var(--color-ivory) 10%, transparent);
    transform: translateY(110%);
    transition: transform 0.45s var(--ease-out-expo);
  }
  .dock--on {
    transform: none;
  }
  .dock__ctas {
    flex-wrap: nowrap;
    gap: 0.6rem;
  }
  .dock__ctas :deep(.btn) {
    flex: 1;
    min-height: 46px;
  }
}
</style>
