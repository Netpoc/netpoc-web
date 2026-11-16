<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import TbcCopy from './TbcCopy.vue'
import FpIcon from './FpIcon.vue'
import { usePocForm, type PocField } from '@/composables/usePocForm'
import type { Attribution, CalcValues } from '@/composables/useFuelPay'
import {
  FORM_SEGMENTS, FUELPAY_LINKS, GENERATOR_SIZES, HEARD_FROM, INTERESTS, NIGERIAN_STATES,
  PROBLEMS, SITE_BANDS, START_OPTIONS, TRACKERS_FITTED, TRACTOR_BANDS, isPlaceholder,
  type FormSegment,
} from '@/content/fuelpay'

const props = defineProps<{
  segment?: FormSegment | null
  calc?: CalcValues | null
  attribution: Attribution
  demoHref: string
}>()

const {
  model, errors, submitting, submitted, failed, showSites, showTractors, showTrackerMake,
  emailWarning, firstName, markStarted, submit,
} = usePocForm({ segment: props.segment, calc: props.calc, attribution: props.attribution })

const form = ref<HTMLFormElement | null>(null)
const summary = ref('')

/* States multi-select */
const statesOpen = ref(false)
const statesQuery = ref('')
const statesBox = ref<HTMLElement | null>(null)
onClickOutside(statesBox, () => (statesOpen.value = false))
const filteredStates = computed(() =>
  NIGERIAN_STATES.filter((s) => s.toLowerCase().includes(statesQuery.value.trim().toLowerCase())),
)
function removeState(s: string) {
  model.states = model.states.filter((x) => x !== s)
}

const describedBy = (f: PocField, extra?: string) =>
  [errors[f] ? `poc-${f}-err` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

async function onSubmit() {
  const invalid = await submit()
  if (invalid.length) {
    summary.value = `${invalid.length} ${invalid.length === 1 ? 'field needs' : 'fields need'} attention.`
    await nextTick()
    const first = form.value?.querySelector<HTMLElement>(`[data-field="${invalid[0]}"]`)
    first?.focus()
    return
  }
  summary.value = ''
}
</script>

<template>
  <div v-if="submitted" class="done" role="status">
    <span class="done__icon"><FpIcon name="check" :size="28" /></span>
    <h2 class="done__title">Thank you, {{ firstName || 'there' }}. Your PoC request is in.</h2>
    <p class="done__text">
      We'll contact you within one business day. Want to skip the wait? Pick a time for a 30-minute
      scoping call below.
    </p>
    <div class="done__calendar">
      <a v-if="!isPlaceholder(FUELPAY_LINKS.calendar)" :href="FUELPAY_LINKS.calendar" target="_blank" rel="noopener" class="btn btn--primary">
        Book a scoping call
      </a>
      <p v-else>Embedded calendar: <TbcCopy :text="FUELPAY_LINKS.calendar" /></p>
    </div>
    <a :href="demoHref" class="done__demo">Meanwhile, explore the demo <FpIcon name="arrow" :size="16" /></a>
  </div>

  <form v-else ref="form" class="poc-form" novalidate @submit.prevent="onSubmit" @focusin="markStarted">
    <p class="sr-only" role="alert" aria-live="assertive">{{ summary }}</p>
    <p v-if="summary" class="form-summary" aria-hidden="true">{{ summary }}</p>

    <div class="grid">
      <div class="f">
        <label for="poc-name">Full name <span class="req" aria-hidden="true">*</span></label>
        <input id="poc-name" v-model="model.name" data-field="name" class="field" type="text" autocomplete="name"
          maxlength="80" required :aria-invalid="!!errors.name" :aria-describedby="describedBy('name')" />
        <p v-if="errors.name" id="poc-name-err" class="err">{{ errors.name }}</p>
      </div>

      <div class="f">
        <label for="poc-email">Work email <span class="req" aria-hidden="true">*</span></label>
        <input id="poc-email" v-model="model.email" data-field="email" class="field" type="email" autocomplete="email"
          required :aria-invalid="!!errors.email" :aria-describedby="describedBy('email', emailWarning ? 'poc-email-warn' : '')" />
        <p v-if="errors.email" id="poc-email-err" class="err">{{ errors.email }}</p>
        <p v-else-if="emailWarning" id="poc-email-warn" class="warn">{{ emailWarning }}</p>
      </div>

      <div class="f">
        <label for="poc-phone">Phone <span class="req" aria-hidden="true">*</span></label>
        <div class="phone">
          <span class="phone__cc" aria-hidden="true">+234</span>
          <input id="poc-phone" v-model="model.phone" data-field="phone" class="field" type="tel" autocomplete="tel"
            inputmode="tel" placeholder="0803 123 4567" required :aria-invalid="!!errors.phone"
            :aria-describedby="describedBy('phone')" />
        </div>
        <p v-if="errors.phone" id="poc-phone-err" class="err">{{ errors.phone }}</p>
      </div>

      <div class="f">
        <label for="poc-company">Company / organisation <span class="req" aria-hidden="true">*</span></label>
        <input id="poc-company" v-model="model.company" data-field="company" class="field" type="text"
          autocomplete="organization" maxlength="120" required :aria-invalid="!!errors.company"
          :aria-describedby="describedBy('company')" />
        <p v-if="errors.company" id="poc-company-err" class="err">{{ errors.company }}</p>
      </div>

      <div class="f">
        <label for="poc-title">Job title <span class="req" aria-hidden="true">*</span></label>
        <input id="poc-title" v-model="model.jobTitle" data-field="jobTitle" class="field" type="text"
          autocomplete="organization-title" required :aria-invalid="!!errors.jobTitle"
          :aria-describedby="describedBy('jobTitle')" />
        <p v-if="errors.jobTitle" id="poc-jobTitle-err" class="err">{{ errors.jobTitle }}</p>
      </div>

      <div class="f">
        <label for="poc-segment">Segment <span class="req" aria-hidden="true">*</span></label>
        <select id="poc-segment" v-model="model.segment" data-field="segment" class="field" required
          :aria-invalid="!!errors.segment" :aria-describedby="describedBy('segment')">
          <option value="" disabled>Choose one</option>
          <option v-for="s in FORM_SEGMENTS" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
        <p v-if="errors.segment" id="poc-segment-err" class="err">{{ errors.segment }}</p>
      </div>

      <!-- States multi-select -->
      <div ref="statesBox" class="f f--wide">
        <span id="poc-states-label" class="label">State(s) of operation <span class="req" aria-hidden="true">*</span></span>
        <button type="button" data-field="states" class="field states__toggle" aria-labelledby="poc-states-label"
          :aria-expanded="statesOpen" aria-controls="poc-states-panel" :aria-invalid="!!errors.states"
          :aria-describedby="describedBy('states')" @click="statesOpen = !statesOpen">
          <span>{{ model.states.length ? `${model.states.length} selected` : 'Choose states' }}</span>
          <FpIcon name="chevron" :size="16" />
        </button>
        <ul v-if="model.states.length" class="chips">
          <li v-for="s in model.states" :key="s">
            {{ s }}
            <button type="button" :aria-label="`Remove ${s}`" @click="removeState(s)"><FpIcon name="x" :size="12" /></button>
          </li>
        </ul>
        <div v-show="statesOpen" id="poc-states-panel" class="states__panel glass-strong" @keydown.esc.stop="statesOpen = false">
          <input v-model="statesQuery" class="field" type="search" placeholder="Search states" aria-label="Search states" />
          <fieldset class="states__list">
            <legend class="sr-only">States</legend>
            <label v-for="s in filteredStates" :key="s" class="check">
              <input v-model="model.states" type="checkbox" :value="s" />
              <span>{{ s }}</span>
            </label>
          </fieldset>
        </div>
        <p v-if="errors.states" id="poc-states-err" class="err">{{ errors.states }}</p>
      </div>
    </div>

    <!-- Sites (towers / enterprise / other) -->
    <fieldset v-if="showSites" class="group">
      <legend>Your sites</legend>
      <div class="grid">
        <div class="f">
          <label for="poc-sites">Number of sites <span class="req" aria-hidden="true">*</span></label>
          <select id="poc-sites" v-model="model.sites" data-field="sites" class="field" :aria-invalid="!!errors.sites"
            :aria-describedby="describedBy('sites')">
            <option value="" disabled>Choose a range</option>
            <option v-for="b in SITE_BANDS" :key="b">{{ b }}</option>
          </select>
          <p v-if="errors.sites" id="poc-sites-err" class="err">{{ errors.sites }}</p>
        </div>
        <div class="f">
          <label for="poc-gen">Typical generator size</label>
          <select id="poc-gen" v-model="model.generator" class="field">
            <option value="">Not sure</option>
            <option v-for="g in GENERATOR_SIZES" :key="g">{{ g }}</option>
          </select>
        </div>
        <fieldset class="f f--wide checks">
          <legend class="label">Interested in</legend>
          <label v-for="i in INTERESTS" :key="i" class="check check--pill">
            <input v-model="model.interests" type="checkbox" :value="i" /><span>{{ i }}</span>
          </label>
        </fieldset>
      </div>
    </fieldset>

    <!-- Tractors (tractors / other) -->
    <fieldset v-if="showTractors" class="group">
      <legend>Your tractors</legend>
      <div class="grid">
        <div class="f">
          <label for="poc-tractors">Number of tractors <span class="req" aria-hidden="true">*</span></label>
          <select id="poc-tractors" v-model="model.tractors" data-field="tractors" class="field"
            :aria-invalid="!!errors.tractors" :aria-describedby="describedBy('tractors')">
            <option value="" disabled>Choose a range</option>
            <option v-for="b in TRACTOR_BANDS" :key="b">{{ b }}</option>
          </select>
          <p v-if="errors.tractors" id="poc-tractors-err" class="err">{{ errors.tractors }}</p>
        </div>
        <fieldset class="f checks" :aria-describedby="describedBy('trackersFitted')">
          <legend class="label">Are trackers already fitted? <span class="req" aria-hidden="true">*</span></legend>
          <label v-for="(t, i) in TRACKERS_FITTED" :key="t" class="check check--pill">
            <input v-model="model.trackersFitted" type="radio" name="poc-fitted" :value="t"
              :data-field="i === 0 ? 'trackersFitted' : undefined" /><span>{{ t }}</span>
          </label>
          <p v-if="errors.trackersFitted" id="poc-trackersFitted-err" class="err">{{ errors.trackersFitted }}</p>
        </fieldset>
        <div v-if="showTrackerMake" class="f f--wide">
          <label for="poc-make">Tracker make or platform</label>
          <input id="poc-make" v-model="model.trackerMake" class="field" type="text"
            placeholder="e.g. Hello Tractor, JDLink, Teltonika" />
        </div>
      </div>
    </fieldset>

    <div class="grid">
      <fieldset class="f f--wide checks">
        <legend class="label">Main problem to solve</legend>
        <label v-for="p in PROBLEMS" :key="p" class="check check--pill">
          <input v-model="model.problems" type="checkbox" :value="p" /><span>{{ p }}</span>
        </label>
      </fieldset>

      <div class="f">
        <label for="poc-start">Preferred PoC start</label>
        <select id="poc-start" v-model="model.start" class="field">
          <option value="">Choose one</option>
          <option v-for="s in START_OPTIONS" :key="s">{{ s }}</option>
        </select>
      </div>
      <div class="f">
        <label for="poc-heard">How did you hear about us?</label>
        <select id="poc-heard" v-model="model.heard" class="field">
          <option value="">Choose one</option>
          <option v-for="h in HEARD_FROM" :key="h">{{ h }}</option>
        </select>
      </div>

      <div class="f f--wide">
        <label for="poc-message">Message</label>
        <textarea id="poc-message" v-model="model.message" data-field="message" class="field" rows="4" maxlength="1000"
          :aria-invalid="!!errors.message" :aria-describedby="describedBy('message', 'poc-message-count')" />
        <p id="poc-message-count" class="count">{{ model.message.length }} / 1,000</p>
        <p v-if="errors.message" id="poc-message-err" class="err">{{ errors.message }}</p>
      </div>
    </div>

    <!-- Honeypot -->
    <div class="hp" aria-hidden="true">
      <label for="poc-website">Website</label>
      <input id="poc-website" v-model="model.website" type="text" tabindex="-1" autocomplete="off" />
    </div>

    <div class="consent">
      <label class="check">
        <input v-model="model.consent" data-field="consent" type="checkbox" :aria-invalid="!!errors.consent"
          :aria-describedby="describedBy('consent')" />
        <span>
          I agree that Netpoc may contact me about FuelPay and process my details in line with the
          <a v-if="!isPlaceholder(FUELPAY_LINKS.privacy)" :href="FUELPAY_LINKS.privacy" target="_blank" rel="noopener">Privacy Policy</a>
          <template v-else>Privacy Policy <TbcCopy :text="FUELPAY_LINKS.privacy" /></template>.
          <span class="req" aria-hidden="true">*</span>
        </span>
      </label>
      <p v-if="errors.consent" id="poc-consent-err" class="err">{{ errors.consent }}</p>
    </div>

    <p v-if="failed" class="err" role="alert">
      We couldn't send your request. Your answers are saved on this device; please try again.
    </p>

    <button type="submit" class="btn btn--primary submit" :disabled="submitting" :aria-busy="submitting">
      {{ submitting ? 'Sending…' : 'Request my PoC' }}
    </button>
  </form>
</template>

<style scoped>
.poc-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem 1.25rem;
}
.f {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
  position: relative;
}
.f--wide {
  grid-column: 1 / -1;
}
label,
.label {
  font-size: 0.85rem;
  color: var(--color-mist);
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}
legend {
  padding: 0;
}
.req {
  color: var(--color-coral);
}
.err {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-coral);
}
.warn {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-saffron);
}
.count {
  margin: 0;
  align-self: flex-end;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-muted);
}
.form-summary {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  color: var(--color-coral);
  background: color-mix(in srgb, var(--color-coral) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-coral) 35%, transparent);
  font-size: 0.9rem;
}
.phone {
  display: flex;
  align-items: stretch;
}
.phone__cc {
  display: grid;
  place-items: center;
  padding: 0 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-mist);
  border: 1px solid color-mix(in srgb, var(--color-ivory) 14%, transparent);
  border-right: 0;
  border-radius: 0.75rem 0 0 0.75rem;
  background: color-mix(in srgb, var(--color-ivory) 5%, transparent);
}
.phone .field {
  border-radius: 0 0.75rem 0.75rem 0;
}
.group {
  padding: 1.25rem;
  border-radius: 1.1rem;
  border: 1px solid color-mix(in srgb, var(--color-saffron) 22%, transparent);
  background: color-mix(in srgb, var(--color-saffron) 4%, transparent);
}
.group > legend {
  padding: 0 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-saffron);
}

.states__toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
}
.states__panel {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 5;
  padding: 0.75rem;
  border-radius: 1rem;
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.7);
}
.states__list {
  margin-top: 0.6rem;
  max-height: 15rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 0.15rem 0.5rem;
}
.chips {
  list-style: none;
  padding: 0;
  margin: 0.2rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.chips li {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.3rem 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  background: color-mix(in srgb, var(--color-saffron) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-saffron) 35%, transparent);
}
.chips button {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--color-ivory);
  cursor: pointer;
}
.chips button:hover {
  background: color-mix(in srgb, var(--color-ivory) 12%, transparent);
}

.check {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  min-height: 36px;
  padding: 0.35rem 0;
  cursor: pointer;
  color: var(--color-ivory);
  font-size: 0.9rem;
  line-height: 1.5;
}
.check input {
  flex: none;
  width: 18px;
  height: 18px;
  margin: 0.15rem 0 0;
  accent-color: var(--color-saffron);
}
.checks {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.checks > legend {
  margin-bottom: 0.5rem;
}
.check--pill {
  align-items: center;
  min-height: 40px;
  padding: 0.35rem 0.9rem 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-ivory) 14%, transparent);
  transition: border-color 0.3s ease, background 0.3s ease;
}
.check--pill input {
  margin: 0;
}
.check--pill:has(input:checked) {
  border-color: var(--color-saffron);
  background: color-mix(in srgb, var(--color-saffron) 10%, transparent);
}
.check--pill:has(input:focus-visible) {
  outline: 2px solid var(--color-saffron);
  outline-offset: 2px;
}
.checks .err {
  flex-basis: 100%;
}
.consent a {
  color: var(--color-saffron);
}
.hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.submit {
  align-self: flex-start;
  min-width: 14rem;
}
.submit:disabled {
  opacity: 0.7;
  cursor: progress;
  transform: none;
}

.done {
  text-align: center;
  padding: 2rem 0.5rem;
}
.done__icon {
  display: inline-grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: var(--color-void);
  background: var(--color-emerald);
  box-shadow: 0 0 40px -6px var(--color-emerald);
}
.done__title {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  margin: 1.25rem auto 0.75rem;
  max-width: 24ch;
}
.done__text {
  color: var(--color-mist);
  line-height: 1.65;
  max-width: 48ch;
  margin: 0 auto 1.5rem;
}
.done__calendar {
  margin-bottom: 1.5rem;
}
.done__demo {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  color: var(--color-saffron);
  font-weight: 600;
  text-decoration: none;
}
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .submit {
    align-self: stretch;
  }
}
</style>
