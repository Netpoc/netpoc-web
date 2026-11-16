<script setup lang="ts">
import { ref } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import logo from '@/assets/brand/netpoc-white.png'

const { y } = useWindowScroll()
const open = ref(false)

const links = [
  { to: '/services', label: 'Services' },
  { to: '/fuelpay', label: 'FuelPay' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <header class="nav" :class="{ 'nav--solid': y > 24 }">
    <div class="nav__inner">
      <RouterLink to="/" class="nav__brand" @click="open = false">
        <img :src="logo" alt="Πέτρος" class="nav__logo" />
      </RouterLink>

      <nav class="nav__links" :class="{ 'nav__links--open': open }">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav__link"
          @click="open = false"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/contact" class="nav__cta" @click="open = false">
          Start a project
        </RouterLink>
      </nav>

      <button
        class="nav__toggle"
        :aria-expanded="open"
        aria-label="Toggle navigation"
        @click="open = !open"
      >
        <span :class="{ 'is-open': open }" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  transition: background 0.4s var(--ease-out-expo), border-color 0.4s ease;
  border-bottom: 1px solid transparent;
}
.nav--solid {
  background: color-mix(in srgb, var(--color-night) 72%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom-color: color-mix(in srgb, var(--color-ivory) 10%, transparent);
}
.nav__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.9rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav__logo {
  height: 34px;
  width: auto;
  display: block;
}
.nav__links {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.nav__link {
  color: var(--color-mist);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  transition: color 0.3s ease;
}
.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, var(--color-saffron), var(--color-coral));
  transition: width 0.35s var(--ease-out-expo);
}
.nav__link:hover,
.nav__link.router-link-active {
  color: var(--color-ivory);
}
.nav__link:hover::after,
.nav__link.router-link-active::after {
  width: 100%;
}
.nav__cta {
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-void);
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  background: linear-gradient(100deg, var(--color-saffron), var(--color-coral));
  transition: transform 0.3s var(--ease-out-expo), filter 0.3s ease;
}
.nav__cta:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
}
.nav__toggle {
  display: none;
  background: none;
  border: 0;
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: relative;
}
.nav__toggle span,
.nav__toggle span::before,
.nav__toggle span::after {
  content: '';
  position: absolute;
  left: 8px;
  height: 2px;
  width: 24px;
  background: var(--color-ivory);
  transition: transform 0.3s var(--ease-out-expo), opacity 0.3s ease;
}
.nav__toggle span {
  top: 19px;
}
.nav__toggle span::before {
  top: -7px;
}
.nav__toggle span::after {
  top: 7px;
}
.nav__toggle span.is-open {
  background: transparent;
}
.nav__toggle span.is-open::before {
  transform: translateY(7px) rotate(45deg);
}
.nav__toggle span.is-open::after {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 760px) {
  .nav__toggle {
    display: block;
  }
  .nav__links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem;
    background: color-mix(in srgb, var(--color-night-2) 92%, transparent);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid color-mix(in srgb, var(--color-ivory) 10%, transparent);
    clip-path: inset(0 0 100% 0);
    opacity: 0;
    transition: clip-path 0.4s var(--ease-out-expo), opacity 0.3s ease;
  }
  .nav__links--open {
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}
</style>
