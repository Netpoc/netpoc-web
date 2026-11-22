<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import SectionHead from './SectionHead.vue'
import { useFuelPay } from '@/composables/useFuelPay'
import { track } from '@/lib/track'
import { CALCULATOR, formatNaira, monthlyLoss, roundToThousand } from '@/content/fuelpay'

const { segment, calc, openPoc } = useFuelPay()

const input = reactive({ ...CALCULATOR.defaults })

const safe = (n: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.min(Math.max(n, min), max) : min

const raw = computed(() =>
  monthlyLoss(
    safe(input.sites, 0, 100000),
    safe(input.litres, 0, 1000000),
    safe(input.price, 0, 100000),
    safe(input.lossPct, 5, 30),
  ),
)
const monthly = computed(() => roundToThousand(raw.value))
const yearly = computed(() => roundToThousand(raw.value * 12))
/** Fill for the custom range track. */
const sliderFill = computed(() => `${((input.lossPct - 5) / 25) * 100}%`)

watch(
  raw,
  (value) => {
    calc.value = { sites: input.sites, litres: input.litres, lossNaira: Math.round(value) }
  },
  { immediate: true },
)

watchDebounced(
  () => ({ ...input }),
  () => track('calculator_used', { sites: input.sites, loss_naira: monthly.value }),
  { debounce: 1200 },
)
</script>

<template>
  <section id="calculator" class="section">
    <SectionHead index="05" eyebrow="Loss calculator" :title="CALCULATOR.title" />

    <div v-if="segment === 'tractors'" class="calc calc--tractor glass-strong reveal">
      <p class="calc__tractor">{{ CALCULATOR.tractorLine }}</p>
      <button type="button" class="btn btn--primary" @click="openPoc('calculator')">Book a PoC</button>
    </div>

    <div v-else class="calc reveal">
      <form class="calc__inputs glass" @submit.prevent>
        <label class="calc__field">
          <span>Number of sites</span>
          <input v-model.number="input.sites" class="field" type="number" inputmode="numeric" min="1" max="100000" />
        </label>
        <label class="calc__field">
          <span>Average litres per site per month</span>
          <input v-model.number="input.litres" class="field" type="number" inputmode="numeric" min="0" step="50" />
        </label>
        <label class="calc__field">
          <span>Diesel price, ₦ per litre ({{ CALCULATOR.priceNote }})</span>
          <input v-model.number="input.price" class="field" type="number" inputmode="numeric" min="0" step="1" />
        </label>
        <label class="calc__field">
          <span class="calc__range-label">
            Estimated loss
            <output class="calc__pct">{{ input.lossPct }}%</output>
          </span>
          <input
            v-model.number="input.lossPct"
            class="calc__range"
            type="range"
            min="5"
            max="30"
            step="1"
            :style="{ '--fill': sliderFill }"
            :aria-valuetext="`${input.lossPct} percent`"
          />
          <span class="calc__ticks" aria-hidden="true"><span>5%</span><span>30%</span></span>
        </label>
      </form>

      <div class="calc__result glass-strong">
        <p class="calc__kicker">Estimated diesel loss</p>
        <p class="calc__lead" aria-live="polite">
          You may be losing
          <strong class="calc__monthly">{{ formatNaira(monthly) }}</strong>
          <span class="calc__per">per month</span>
          <span class="calc__yearly">({{ formatNaira(yearly) }} per year)</span>
        </p>
        <p class="calc__line">{{ CALCULATOR.line }}</p>
        <button type="button" class="btn btn--primary" @click="openPoc('calculator')">Book a PoC</button>
        <p class="calc__disclaimer">{{ CALCULATOR.disclaimer }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.calc {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.calc__inputs {
  border-radius: 1.5rem;
  padding: clamp(1.4rem, 3vw, 2rem);
  display: grid;
  gap: 1.25rem;
}
.calc__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.88rem;
  color: var(--color-mist);
}
.calc__field .field {
  font-family: var(--font-mono);
  font-size: 1.05rem;
}
.calc__range-label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.calc__pct {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--color-coral);
}
.calc__range {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 44px;
  background: transparent;
  cursor: pointer;
}
.calc__range::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--color-saffron),
    var(--color-coral) var(--fill),
    color-mix(in srgb, var(--color-ivory) 14%, transparent) var(--fill)
  );
}
.calc__range::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--color-saffron),
    var(--color-coral) var(--fill),
    color-mix(in srgb, var(--color-ivory) 14%, transparent) var(--fill)
  );
}
.calc__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  margin-top: -9px;
  border-radius: 50%;
  background: var(--color-ivory);
  border: 4px solid var(--color-coral);
  box-shadow: 0 0 16px -2px color-mix(in srgb, var(--color-coral) 70%, transparent);
}
.calc__range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-ivory);
  border: 4px solid var(--color-coral);
}
.calc__range:focus-visible {
  outline: 2px solid var(--color-saffron);
  outline-offset: 2px;
  border-radius: 0.5rem;
}
.calc__ticks {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-muted);
  margin-top: -0.4rem;
}

.calc__result {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: clamp(1.6rem, 3.5vw, 2.5rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-color: color-mix(in srgb, var(--color-coral) 30%, transparent);
}
.calc__result::before {
  content: '';
  position: absolute;
  inset: auto -20% -40% auto;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--color-coral) 30%, transparent), transparent 70%);
  pointer-events: none;
}
.calc__kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-muted);
}
.calc__lead {
  position: relative;
  margin: 0.9rem 0 1.25rem;
  font-size: 1.1rem;
  color: var(--color-mist);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.calc__monthly {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.3rem, 5.5vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--color-coral);
  font-variant-numeric: tabular-nums;
}
.calc__per {
  color: var(--color-ivory);
}
.calc__yearly {
  font-family: var(--font-mono);
  font-size: 0.9rem;
}
.calc__line {
  position: relative;
  margin: 0 0 1.5rem;
  line-height: 1.6;
}
.calc__disclaimer {
  margin: 1rem 0 0;
  font-size: 0.75rem;
  color: var(--color-muted);
}
.calc--tractor {
  grid-template-columns: 1fr auto;
  align-items: center;
  border-radius: 1.5rem;
  padding: clamp(1.4rem, 3vw, 2rem);
}
.calc__tractor {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.5;
}
@media (max-width: 860px) {
  .calc,
  .calc--tractor {
    grid-template-columns: 1fr;
  }
}
</style>
