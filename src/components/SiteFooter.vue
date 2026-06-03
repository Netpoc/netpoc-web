<script setup lang="ts">
import logo from '@/assets/brand/netpoc-white.png'
import NsibidiPattern from './NsibidiPattern.vue'

const year = new Date().getFullYear()

const columns = [
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/services', label: 'Services' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Expertise',
    links: [
      { to: '/services#soc', label: 'System on Chip' },
      { to: '/services#iot', label: 'IoT & Telematics' },
      { to: '/services#ussd', label: 'USSD Solutions' },
      { to: '/services#agric', label: 'Agric Tech' },
    ],
  },
]
</script>

<template>
  <footer class="footer">
    <NsibidiPattern :opacity="0.05" :scale="170" color="var(--color-ivory)" />
    <div class="footer__inner">
      <div class="footer__brand">
        <img :src="logo" alt="Netpoc" class="footer__logo" />
        <p class="footer__motto text-ankara">Value-Driven Innovation</p>
        <p class="footer__tagline">
          African tech engineered from silicon to software.
        </p>
      </div>

      <div v-for="col in columns" :key="col.title" class="footer__col">
        <h4 class="footer__heading">{{ col.title }}</h4>
        <RouterLink
          v-for="link in col.links"
          :key="link.label"
          :to="link.to"
          class="footer__link"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </div>

    <div class="footer__base">
      <span>© {{ year }} Netpoc Inc Limited. All rights reserved.</span>
      <span class="footer__made">
        <svg
          class="footer__flag"
          viewBox="0 0 18 12"
          role="img"
          aria-label="Flag of Nigeria"
        >
          <rect width="18" height="12" fill="#fff" />
          <rect width="6" height="12" fill="#008751" />
          <rect x="12" width="6" height="12" fill="#008751" />
        </svg>
        Made in Nigeria
      </span>
      <span class="footer__mark">ọ̀rụ̀ — work, made well.</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  margin-top: 6rem;
  border-top: 1px solid color-mix(in srgb, var(--color-ivory) 10%, transparent);
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--color-void) 60%, transparent));
  color: var(--color-mist);
}
.footer__inner {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2.5rem;
}
.footer__logo {
  height: 38px;
  margin-bottom: 1rem;
}
.footer__motto {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.01em;
  margin: 0 0 0.5rem;
}
.footer__tagline {
  max-width: 30ch;
  line-height: 1.6;
}
.footer__heading {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-saffron);
  margin-bottom: 1rem;
}
.footer__col {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.footer__link {
  color: var(--color-mist);
  text-decoration: none;
  transition: color 0.3s ease, transform 0.3s ease;
}
.footer__link:hover {
  color: var(--color-ivory);
  transform: translateX(4px);
}
.footer__base {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  border-top: 1px solid color-mix(in srgb, var(--color-ivory) 8%, transparent);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
}
.footer__made {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  color: var(--color-mist);
}
.footer__flag {
  width: 21px;
  height: 14px;
  border-radius: 2px;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-ivory) 14%, transparent);
}
.footer__mark {
  font-family: var(--font-mono);
  color: var(--color-muted);
}
@media (max-width: 760px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
  }
  .footer__brand {
    grid-column: 1 / -1;
  }
}
</style>
