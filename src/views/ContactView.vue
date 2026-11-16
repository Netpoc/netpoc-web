<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useReveal } from '@/composables/useReveal'
import NsibidiPattern from '@/components/NsibidiPattern.vue'
import CultureFigure from '@/components/CultureFigure.vue'

const root = ref<HTMLElement | null>(null)
useReveal(root)

const form = reactive({ name: '', email: '', interest: 'System Design', message: '' })
const submitted = ref(false)

const interests = [
  'System Design',
  'System on Chip',
  'IoT & Telematics',
  'USSD Solutions',
  'Software Development',
  'Agric Tech',
]

function submit() {
  // Front-end stub: wire this to a backend / email service when available.
  submitted.value = true
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
        <button type="submit" class="btn btn--primary">Send message</button>
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
