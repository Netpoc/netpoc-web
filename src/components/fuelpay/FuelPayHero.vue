<script setup lang="ts">
import NsibidiPattern from '@/components/NsibidiPattern.vue'
import AnkaraPattern from '@/components/AnkaraPattern.vue'
import CtaPair from './CtaPair.vue'
import FpIcon from './FpIcon.vue'
import { HERO } from '@/content/fuelpay'

/*
 * Mock tank trace: 14 days at 3-hour resolution for a 1,000 L tank.
 * Deterministic — burn with mild noise, refuel below 25%, and one
 * night-time siphoning drop on day 10 (the alert in the card).
 */
const W = 560
const H = 200
const PAD = 8
const CAP = 1000
const STEPS = 14 * 8
const THEFT_DROP = 112

const levels: number[] = []
let level = 880
let THEFT_STEP = -1
for (let i = 0; i <= STEPS; i++) {
  const hour = (i % 8) * 3
  const running = hour >= 6 && hour < 21 ? 1 : 0.35 // generator mostly daytime
  level -= (24 + ((i * 37) % 11)) * running
  // One siphoning event: the first night slot after day 9 with a healthy tank (02:14 in the card)
  if (THEFT_STEP < 0 && i > 9 * 8 && hour === 0 && level > CAP * 0.55) {
    level -= THEFT_DROP
    THEFT_STEP = i
  }
  if (level < CAP * 0.25) level = 900 + ((i * 13) % 40)
  levels.push(Math.max(level, 40))
}

const x = (i: number) => PAD + (i / STEPS) * (W - PAD * 2)
const y = (l: number) => PAD + (1 - l / CAP) * (H - PAD * 2)

const line = levels.map((l, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(l).toFixed(1)}`).join(' ')
const area = `${line} L${x(STEPS)},${H} L${x(0)},${H} Z`
const theft = {
  x1: x(THEFT_STEP - 1),
  y1: y(levels[THEFT_STEP - 1]!),
  x2: x(THEFT_STEP),
  y2: y(levels[THEFT_STEP]!),
}
const nowLitres = Math.round(levels[STEPS]!)
</script>

<template>
  <section id="top" class="hero">
    <NsibidiPattern class="hero__nsibidi" :opacity="0.07" color="var(--color-ivory)" />
    <div class="hero__ankara" aria-hidden="true">
      <AnkaraPattern :scale="110" :opacity="0.85" />
    </div>

    <div class="hero__grid">
      <div class="hero__copy">
        <p class="pill glass reveal">
          <span class="pulse" aria-hidden="true" />
          {{ HERO.eyebrow }} <span class="hero__tag">· Fuel &amp; Energy Monitoring</span>
        </p>

        <h1 class="hero__title reveal" style="transition-delay: 60ms">
          <span>{{ HERO.title[0] }}</span>
          <span>{{ HERO.title[1] }}</span>
          <span class="text-ankara">{{ HERO.title[2] }}</span>
        </h1>

        <p class="hero__sub reveal" style="transition-delay: 120ms">{{ HERO.sub }}</p>

        <CtaPair
          class="reveal"
          style="transition-delay: 180ms"
          location="hero"
          :poc-label="HERO.primary"
          :demo-label="HERO.secondary"
        />

        <ul class="hero__trust reveal" style="transition-delay: 240ms">
          <li v-for="t in HERO.trust" :key="t">
            <FpIcon name="check" :size="16" />
            {{ t }}
          </li>
        </ul>
      </div>

      <!-- Dashboard mock-up -->
      <figure class="dash reveal" style="transition-delay: 160ms">
        <div class="dash__panel glass">
          <header class="dash__head">
            <div>
              <p class="dash__site">Ikeja Tower 04</p>
              <p class="dash__meta">Tank A · 1,000 L · calibrated</p>
            </div>
            <span class="dash__live"><span class="pulse pulse--sm" aria-hidden="true" /> LIVE</span>
          </header>

          <div class="dash__plot">
          <svg
            class="dash__chart"
            :viewBox="`0 0 ${W} ${H}`"
            preserveAspectRatio="none"
            role="img"
            aria-label="Tank level over 14 days, with a sudden 112 litre drop at night while the generator was off."
          >
            <defs>
              <linearGradient id="fp-tank-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-saffron)" stop-opacity="0.35" />
                <stop offset="100%" stop-color="var(--color-saffron)" stop-opacity="0" />
              </linearGradient>
            </defs>
            <g class="dash__grid">
              <line v-for="g in 4" :key="g" :x1="0" :x2="W" :y1="(H / 4) * g" :y2="(H / 4) * g" />
            </g>
            <line class="dash__threshold" :x1="0" :x2="W" :y1="y(CAP * 0.25)" :y2="y(CAP * 0.25)" />
            <path class="dash__area" :d="area" />
            <path class="dash__line" :d="line" pathLength="1" />
            <line class="dash__theft-guide" :x1="theft.x2" :x2="theft.x2" :y1="0" :y2="H" />
            <line class="dash__theft" :x1="theft.x1" :y1="theft.y1" :x2="theft.x2" :y2="theft.y2" />
            <circle class="dash__theft-dot" :cx="theft.x2" :cy="theft.y2" r="5" />
          </svg>
          <span
            class="dash__tag"
            aria-hidden="true"
            :style="{ left: `${(theft.x2 / W) * 100}%`, top: `${(theft.y2 / H) * 100}%` }"
          >−{{ THEFT_DROP }} L · 02:14</span>
          </div>

          <dl class="dash__readouts">
            <div>
              <dt>Litres now</dt>
              <dd>{{ nowLitres }} L</dd>
            </div>
            <div>
              <dt>Days to empty</dt>
              <dd>3.4</dd>
            </div>
            <div>
              <dt>L / kWh</dt>
              <dd>0.31</dd>
            </div>
            <div>
              <dt>Gen today</dt>
              <dd>9.5 h</dd>
            </div>
          </dl>
        </div>

        <div class="alert glass-strong" role="presentation">
          <span class="alert__icon"><FpIcon name="alert" :size="18" /></span>
          <div>
            <p class="alert__title">{{ HERO.alert.title }}</p>
            <p class="alert__body">{{ HERO.alert.body }}</p>
            <p class="alert__meta">{{ HERO.alert.meta }}</p>
          </div>
        </div>
        <figcaption class="sr-only">
          Illustrative FuelPay dashboard. Simulated data.
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: clamp(7rem, 14vw, 9.5rem) 1.5rem clamp(3rem, 7vw, 5rem);
}
.hero__nsibidi {
  mask-image: radial-gradient(ellipse at 25% 35%, black, transparent 70%);
}
.hero__ankara {
  position: absolute;
  top: 6%;
  right: -14%;
  width: 46%;
  height: 90%;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0.4;
  mask-image: radial-gradient(circle, black 35%, transparent 70%);
}
.hero__grid {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: clamp(2.5rem, 5vw, 4.5rem);
  align-items: center;
}
.pill {
  margin: 0;
}
.hero__tag {
  color: var(--color-muted);
}
.pulse {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-emerald);
  box-shadow: 0 0 12px var(--color-emerald);
}
.pulse::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--color-emerald);
  animation: ping 2s var(--ease-out-expo) infinite;
}
.pulse--sm {
  width: 6px;
  height: 6px;
}
@keyframes ping {
  from {
    transform: scale(0.6);
    opacity: 1;
  }
  to {
    transform: scale(2.2);
    opacity: 0;
  }
}
.hero__title {
  font-size: clamp(2.1rem, 5.4vw, 4rem);
  margin: 1.5rem 0 1.4rem;
  display: flex;
  flex-direction: column;
}
.hero__sub {
  font-size: clamp(1.02rem, 1.7vw, 1.2rem);
  line-height: 1.65;
  color: var(--color-mist);
  max-width: 54ch;
  margin: 0 0 2.1rem;
}
.hero__trust {
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1.4rem;
  font-size: 0.88rem;
  color: var(--color-mist);
}
.hero__trust li {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}
.hero__trust svg {
  color: var(--color-emerald);
  flex: none;
}

/* Dashboard mock */
.dash {
  position: relative;
  margin: 0;
  padding-bottom: 5.5rem;
}
.dash__panel {
  border-radius: 1.5rem;
  padding: 1.25rem 1.25rem 1rem;
  transform: perspective(1400px) rotateY(-6deg) rotateX(2deg);
  transform-origin: left center;
}
.dash__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.dash__site {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
}
.dash__meta {
  margin: 0.2rem 0 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-muted);
}
.dash__live {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  color: var(--color-emerald);
}
.dash__chart {
  width: 100%;
  height: clamp(150px, 22vw, 210px);
  display: block;
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--color-void) 45%, transparent);
}
.dash__grid line {
  stroke: color-mix(in srgb, var(--color-ivory) 8%, transparent);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
.dash__threshold {
  stroke: color-mix(in srgb, var(--color-saffron) 45%, transparent);
  stroke-dasharray: 4 5;
  vector-effect: non-scaling-stroke;
}
.dash__area {
  fill: url(#fp-tank-fill);
}
.dash__line {
  fill: none;
  stroke: var(--color-saffron);
  stroke-width: 2;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 2.4s 0.4s var(--ease-out-expo) forwards;
}
.dash__theft {
  stroke: var(--color-coral);
  stroke-width: 3.5;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
.dash__theft-guide {
  stroke: color-mix(in srgb, var(--color-coral) 55%, transparent);
  stroke-dasharray: 3 4;
  vector-effect: non-scaling-stroke;
}
.dash__plot {
  position: relative;
}
.dash__tag {
  position: absolute;
  transform: translate(-50%, calc(-100% - 12px));
  white-space: nowrap;
  padding: 0.2rem 0.45rem;
  border-radius: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--color-void);
  background: var(--color-coral);
  box-shadow: 0 0 18px -2px color-mix(in srgb, var(--color-coral) 70%, transparent);
  animation: alert-in 0.6s 2s var(--ease-out-expo) both;
}
.dash__theft-dot {
  fill: var(--color-coral);
  stroke: var(--color-void);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
.dash__readouts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin: 1rem 0 0;
}
.dash__readouts div {
  padding: 0.55rem 0.65rem;
  border-radius: 0.65rem;
  background: color-mix(in srgb, var(--color-ivory) 4%, transparent);
}
.dash__readouts dt {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
}
.dash__readouts dd {
  margin: 0.2rem 0 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
}

.alert {
  position: absolute;
  left: -1.5rem;
  bottom: 0;
  max-width: 19rem;
  display: flex;
  gap: 0.8rem;
  padding: 0.95rem 1.1rem;
  border-radius: 1rem;
  border-color: color-mix(in srgb, var(--color-coral) 55%, transparent);
  box-shadow:
    0 18px 40px -12px rgba(0, 0, 0, 0.7),
    0 0 32px -8px color-mix(in srgb, var(--color-coral) 45%, transparent);
  animation: alert-in 0.7s 2.2s var(--ease-out-expo) both;
}
.alert__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 0.6rem;
  color: var(--color-void);
  background: var(--color-coral);
}
.alert p {
  margin: 0;
}
.alert__title {
  font-weight: 700;
  color: var(--color-coral);
  font-size: 0.92rem;
}
.alert__body {
  font-size: 0.88rem;
  margin-top: 0.15rem !important;
}
.alert__meta {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-muted);
  margin-top: 0.25rem !important;
}
@keyframes alert-in {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.96);
  }
}

@media (max-width: 960px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }
  .dash__panel {
    transform: none;
  }
  .alert {
    left: 0.75rem;
  }
}
@media (max-width: 520px) {
  .dash__readouts {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (prefers-reduced-motion: reduce) {
  .dash__line {
    stroke-dashoffset: 0;
  }
}
</style>
