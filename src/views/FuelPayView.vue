<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useReveal } from '@/composables/useReveal'
import { provideFuelPay, segmentFromRoute } from '@/composables/useFuelPay'
import { FAQ, SEO } from '@/content/fuelpay'
import { COMPANY } from '@/content/company'
import FuelPayBar from '@/components/fuelpay/FuelPayBar.vue'
import FuelPayHero from '@/components/fuelpay/FuelPayHero.vue'
import ProblemStrip from '@/components/fuelpay/ProblemStrip.vue'
import SegmentSwitcher from '@/components/fuelpay/SegmentSwitcher.vue'
import HowItWorks from '@/components/fuelpay/HowItWorks.vue'
import FeatureGrid from '@/components/fuelpay/FeatureGrid.vue'
import LossCalculator from '@/components/fuelpay/LossCalculator.vue'
import PocOffer from '@/components/fuelpay/PocOffer.vue'
import DemoSteps from '@/components/fuelpay/DemoSteps.vue'
import FuelPayFaq from '@/components/fuelpay/FuelPayFaq.vue'
import FinalCta from '@/components/fuelpay/FinalCta.vue'
import FuelPayLegal from '@/components/fuelpay/FuelPayLegal.vue'
import PocModal from '@/components/fuelpay/PocModal.vue'

const root = ref<HTMLElement | null>(null)
useReveal(root)

const route = useRoute()
const { segment } = provideFuelPay()

// Deep links (/fuelpay#tractors) and in-page hash changes select the tab.
watch(
  () => route.hash,
  (hash) => {
    const next = segmentFromRoute(hash, route.query)
    if (next) segment.value = next
  },
)

/* Structured data (§8): SoftwareApplication, Organization, FAQPage */
let ld: HTMLScriptElement | null = null
onMounted(() => {
  ld = document.createElement('script')
  ld.type = 'application/ld+json'
  ld.textContent = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'FuelPay',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: SEO.description,
      url: (import.meta.env.VITE_SITE_URL ?? window.location.origin).replace(/\/$/, '') + '/fuelpay',
      offers: { '@type': 'Offer', description: 'Contact for price' },
      publisher: { '@type': 'Organization', name: COMPANY.legalName },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.items.map((i) => ({
        '@type': 'Question',
        name: i.q,
        acceptedAnswer: { '@type': 'Answer', text: i.a },
      })),
    },
  ])
  document.head.appendChild(ld)
})
onBeforeUnmount(() => ld?.remove())
</script>

<template>
  <div ref="root" class="fuelpay">
    <FuelPayBar />
    <FuelPayHero />
    <ProblemStrip />
    <SegmentSwitcher />
    <HowItWorks />
    <FeatureGrid />
    <LossCalculator />
    <PocOffer />
    <DemoSteps />
    <FuelPayFaq />
    <FinalCta />
    <FuelPayLegal />
    <PocModal />
  </div>
</template>

<style scoped>
.fuelpay {
  position: relative;
}
.fuelpay :deep(.section) {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 4.5rem) 1.5rem;
  scroll-margin-top: 140px;
}
@media (max-width: 760px) {
  /* Room for the sticky CTA dock */
  .fuelpay {
    padding-bottom: 4.5rem;
  }
}
</style>
