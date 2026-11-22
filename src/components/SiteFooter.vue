<script setup lang="ts">
import logo from '@/assets/brand/netpoc-white.png'
import NsibidiPattern from './NsibidiPattern.vue'
import CultureFigure from './CultureFigure.vue'
import NsibidiGlossary from './NsibidiGlossary.vue'
import SocialLinks from './SocialLinks.vue'
import { COMPANY } from '@/content/company'
import { analyticsEnabled, openConsent } from '@/lib/consent'

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
      { to: '/fuelpay', label: 'FuelPay' },
    ],
  },
]
</script>

<template>
  <footer class="footer">
    <NsibidiPattern :opacity="0.05" :scale="170" color="var(--color-ivory)" />
    <div class="footer__inner">
      <div class="footer__brand">
        <img :src="logo" alt="Πέτρος" lang="el" class="footer__logo" />
        <p class="footer__motto text-ankara">Value-Driven Innovation</p>
        <p class="footer__tagline">
          African tech engineered from silicon to software.
        </p>
        <SocialLinks location="footer" class="footer__social" />
      </div>

      <div v-for="col in columns" :key="col.title" class="footer__col">
        <h2 class="footer__heading">{{ col.title }}</h2>
        <RouterLink
          v-for="link in col.links"
          :key="link.label"
          :to="link.to"
          class="footer__link"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- Bust rising from the footer: headdress + shoulders, the rest cropped -->
      <div class="footer__figure">
        <CultureFigure name="man-headdress" animate :ground="false" height="460px" />
      </div>
    </div>

    <NsibidiGlossary />

    <div class="footer__base">
      <span>
        © {{ year }} {{ COMPANY.legalName }}. All rights reserved.
        <button v-if="analyticsEnabled" type="button" class="footer__cookies" @click="openConsent">
          Cookie settings
        </button>
      </span>
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
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 2.5rem;
}
.footer__figure {
  align-self: end;
  height: 210px;
  margin-bottom: -2rem;
  overflow: hidden;
}
@media (max-width: 960px) {
  .footer__figure {
    display: none;
  }
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
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 1rem;
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
.footer__social {
  margin-top: 1.25rem;
}
.footer__cookies {
  margin-left: 0.75rem;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: var(--color-mist);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.footer__cookies:hover {
  color: var(--color-ivory);
}
.footer__cookies:focus-visible {
  outline: 2px solid var(--color-saffron);
  outline-offset: 2px;
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
