<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useReveal } from '@/composables/useReveal'
import { submitForm } from '@/lib/submit'
import { track } from '@/lib/track'
import { leadAttribution } from '@/lib/attribution'
import NsibidiPattern from '@/components/NsibidiPattern.vue'
import CultureFigure from '@/components/CultureFigure.vue'
import SocialLinks from '@/components/SocialLinks.vue'
import { ADDRESS_LINE, COMPANY } from '@/content/company'

const root = ref<HTMLElement | null>(null)
useReveal(root)

const interests = [
  'FuelPay (diesel, power & tractor monitoring)',
  'System Design',
  'System on Chip',
  'IoT & Telematics',
  'USSD Solutions',
  'Software Development',
  'Agric Tech',
]

// `/contact?interest=fuelpay` preselects FuelPay.
const route = useRoute()
const preset = route.query.interest === 'fuelpay' ? interests[0]! : 'System Design'

const form = reactive({ name: '', email: '', interest: preset, message: '', website: '' })
const submitted = ref(false)
const submitting = ref(false)
const failed = ref(false)

async function submit() {
  failed.value = false
  // Honeypot: bots fill the hidden field; pretend success, send nothing.
  if (form.website) {
    submitted.value = true
    return
  }
  submitting.value = true
  try {
    await submitForm('contact', {
      name: form.name.trim(),
      email: form.email.trim(),
      interest: form.interest,
      message: form.message.trim(),
      ...leadAttribution(route.query, route.path),
    })
    submitted.value = true
    track('contact_form_submit', { interest: form.interest })
  } catch {
    failed.value = true
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div ref="root" class="page">
    <NsibidiPattern variant="ukara" :scale="200" :opacity="0.05" color="var(--color-ivory)" />

    <div class="contact reveal">
      <div class="contact__intro">
        <span class="pill">Contact</span>
        <h1>Let's build it together.</h1>
        <p>
          Tell us about your project — hardware, software, or the bit in
          between. We'll get back to you quickly.
        </p>
        <a class="contact__email" href="mailto:hello@netpoc.com">hello@netpoc.com</a>
        <dl class="contact__details">
          <div>
            <dt>Phone</dt>
            <dd><a :href="`tel:${COMPANY.phoneIntl}`">{{ COMPANY.phone }}</a></dd>
          </div>
          <div>
            <dt>Office</dt>
            <dd>{{ ADDRESS_LINE }}</dd>
          </div>
        </dl>
        <SocialLinks location="contact" class="contact__social" />
        <CultureFigure class="contact__figure" name="couple-with-pots" height="340px" />
      </div>

      <form v-if="!submitted" class="contact__form glass-strong" @submit.prevent="submit">
        <label>
          <span>Name</span>
          <input v-model="form.name" class="field" type="text" required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input v-model="form.email" class="field" type="email" required placeholder="you@company.com" />
        </label>
        <label>
          <span>Interested in</span>
          <select v-model="form.interest" class="field">
            <option v-for="i in interests" :key="i">{{ i }}</option>
          </select>
        </label>
        <label>
          <span>Project details</span>
          <textarea v-model="form.message" class="field" rows="4" required placeholder="What are you building?" />
        </label>
        <!-- Honeypot: hidden from people and assistive tech -->
        <input
          v-model="form.website"
          class="hp"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
        />
        <p v-if="failed" class="contact__err" role="alert">
          We couldn't send your message. Please try again, or email us at
          <a href="mailto:hello@netpoc.com">hello@netpoc.com</a>.
        </p>
        <button type="submit" class="btn btn--primary" :disabled="submitting" :aria-busy="submitting">
          {{ submitting ? 'Sending…' : 'Send message' }}
        </button>
      </form>

      <div v-else class="contact__form glass-strong contact__thanks">
        <h2>Thank you, {{ form.name || 'friend' }}.</h2>
        <p>Your message is noted. Our team will reach out at {{ form.email }} shortly.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  overflow: hidden;
  padding: 9rem 1.5rem 2rem;
  min-height: 80vh;
}
.contact {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 3rem;
  align-items: start;
}
.contact__intro h1 {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  margin: 1rem 0 1rem;
}
.contact__intro p {
  color: var(--color-mist);
  line-height: 1.7;
  max-width: 40ch;
}
.contact__figure {
  display: block;
  margin-top: 3rem;
}
@media (max-width: 760px) {
  .contact__figure {
    display: none;
  }
}
.contact__details {
  margin: 1.25rem 0 0;
  display: grid;
  gap: 0.6rem;
}
.contact__details div {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 0.75rem;
}
.contact__details dt {
  color: var(--color-muted);
  font-size: 0.85rem;
}
.contact__details dd {
  margin: 0;
  color: var(--color-mist);
}
.contact__details a {
  color: var(--color-ivory);
  text-underline-offset: 3px;
}
.contact__social {
  margin-top: 1.25rem;
}
.contact__email {
  display: inline-block;
  margin-top: 1.5rem;
  font-family: var(--font-mono);
  color: var(--color-saffron);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--color-saffron) 40%, transparent);
}
.contact__form {
  border-radius: 1.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.85rem;
  color: var(--color-mist);
}
.hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.contact__err {
  color: var(--color-coral);
  font-size: 0.9rem;
  line-height: 1.5;
}
.contact__err a {
  color: inherit;
}
.contact__thanks {
  justify-content: center;
  text-align: center;
}
.contact__thanks h2 {
  font-size: 1.8rem;
  margin-bottom: 0.75rem;
}
.contact__thanks p {
  color: var(--color-mist);
}
@media (max-width: 760px) {
  .contact {
    grid-template-columns: 1fr;
  }
}
</style>
