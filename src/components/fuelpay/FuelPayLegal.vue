<script setup lang="ts">
import TbcCopy from './TbcCopy.vue'
import { CONTACT, FUELPAY_LINKS, isPlaceholder } from '@/content/fuelpay'
import { COMPANY } from '@/content/company'

const links = [
  { label: 'Privacy Policy', href: FUELPAY_LINKS.privacy },
  { label: 'Terms of Service', href: FUELPAY_LINKS.terms },
  { label: 'Data Protection (NDPA)', href: FUELPAY_LINKS.dataProtection },
]
</script>

<template>
  <div class="legal">
    <p>
      {{ COMPANY.legalName }} · <TbcCopy :text="CONTACT.address" /> · RC <TbcCopy :text="CONTACT.rc" />
    </p>
    <ul>
      <li v-for="l in links" :key="l.label">
        <a v-if="!isPlaceholder(l.href)" :href="l.href">{{ l.label }}</a>
        <span v-else>{{ l.label }} <TbcCopy :text="l.href" /></span>
      </li>
      <li><RouterLink to="/contact">Contact</RouterLink></li>
    </ul>
    <p class="legal__note">FuelPay is a product of {{ COMPANY.legalName }}.</p>
  </div>
</template>

<style scoped>
.legal {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 2rem;
  font-size: 0.8rem;
  color: var(--color-muted);
  border-top: 1px solid color-mix(in srgb, var(--color-ivory) 8%, transparent);
}
.legal p {
  margin: 0;
}
.legal ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
}
.legal a {
  color: var(--color-mist);
}
.legal a:hover {
  color: var(--color-saffron);
}
</style>
