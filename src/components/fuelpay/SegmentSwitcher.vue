<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import SectionHead from './SectionHead.vue'
import TbcCopy from './TbcCopy.vue'
import FpIcon from './FpIcon.vue'
import { useFuelPay } from '@/composables/useFuelPay'
import { FUELPAY_LINKS, SEGMENTS, SEGMENT_CONTENT, SOLUTIONS, type Segment } from '@/content/fuelpay'

const { segment, selectSegment, openPoc, demoHref, onDemoClick } = useFuelPay()

const active = computed<Segment>(() => segment.value ?? 'towers')
const content = computed(() => SEGMENT_CONTENT[active.value])
const tabs = ref<HTMLButtonElement[]>([])
const tablist = ref<HTMLElement | null>(null)

/** Keep the active chip visible in the horizontally scrolling tab bar (mobile). */
function revealActiveTab() {
  const list = tablist.value
  const tab = tabs.value[SEGMENTS.indexOf(active.value)]
  if (!list || !tab || list.scrollWidth <= list.clientWidth) return
  list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
}
onMounted(revealActiveTab)
watch(active, () => nextTick(revealActiveTab))

const ICONS: Record<Segment, string> = { towers: 'radio', enterprise: 'building', tractors: 'map' }

function select(id: Segment, focus = false) {
  selectSegment(id)
  if (focus) nextTick(() => tabs.value[SEGMENTS.indexOf(id)]?.focus())
}

function onKey(e: KeyboardEvent) {
  const i = SEGMENTS.indexOf(active.value)
  const last = SEGMENTS.length - 1
  const next =
    e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
    : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
    : e.key === 'Home' ? 0
    : e.key === 'End' ? last
    : null
  if (next === null) return
  e.preventDefault()
  select(SEGMENTS[next]!, true)
}

function bookPoc() {
  segment.value = active.value
  openPoc('segment')
}
</script>

<template>
  <section id="solutions" class="section solutions">
    <!-- Deep-link targets for /fuelpay#towers etc. -->
    <span v-for="id in SEGMENTS" :id="id" :key="id" class="anchor" aria-hidden="true" />

    <SectionHead index="02" eyebrow="Solutions" :title="SOLUTIONS.title" :intro="SOLUTIONS.intro" />

    <div ref="tablist" class="tabs reveal" role="tablist" aria-label="Choose your operation" @keydown="onKey">
      <button
        v-for="id in SEGMENTS"
        :id="`tab-${id}`"
        :key="id"
        ref="tabs"
        type="button"
        role="tab"
        class="tab"
        :class="{ 'tab--active': active === id }"
        :aria-selected="active === id"
        :aria-controls="`panel-${id}`"
        :tabindex="active === id ? 0 : -1"
        @click="select(id)"
      >
        <FpIcon :name="ICONS[id]" :size="18" />
        {{ SEGMENT_CONTENT[id].label }}
      </button>
    </div>

    <Transition name="swap" mode="out-in">
      <div
        :id="`panel-${active}`"
        :key="active"
        class="panel glass-strong"
        role="tabpanel"
        :aria-labelledby="`tab-${active}`"
        tabindex="0"
      >
        <div class="panel__intro">
          <h3 class="panel__headline">{{ content.headline }}</h3>
          <p class="panel__who"><span>Who it's for</span> {{ content.who }}</p>
        </div>

        <table class="matrix">
          <thead>
            <tr>
              <th v-for="c in SOLUTIONS.columns" :key="c" scope="col">{{ c }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in content.rows" :key="row.feature">
              <td :data-label="SOLUTIONS.columns[0]" class="matrix__problem">{{ row.problem }}</td>
              <td :data-label="SOLUTIONS.columns[1]">
                <strong>{{ row.feature }}</strong><TbcCopy :text="row.detail" />
              </td>
              <td :data-label="SOLUTIONS.columns[2]" class="matrix__outcome">
                <span class="matrix__ok">
                  <FpIcon name="check" :size="16" />
                  <span>{{ row.outcome }}</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="content.connect" class="panel__note">
          <p>
            <strong>Works with your trackers.</strong> {{ content.connect }}
            Supported devices: <TbcCopy :text="FUELPAY_LINKS.supportedDevices" />
          </p>
          <p class="panel__small">{{ content.smallPrint }}</p>
        </div>

        <p v-if="content.proof" class="panel__proof">
          <TbcCopy :text="content.proof" />
          <span class="panel__source">Source: {{ content.proofSource }}</span>
        </p>

        <div class="panel__ctas">
          <button type="button" class="btn btn--primary" @click="bookPoc">{{ content.cta }}</button>
          <a class="panel__demo" :href="demoHref('segment')" @click="onDemoClick('segment')">
            {{ content.demoCta }} <FpIcon name="arrow" :size="16" />
          </a>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.solutions {
  position: relative;
}
.anchor {
  position: absolute;
  top: 0;
}
.tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.4rem;
  margin-bottom: 1.25rem;
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-void) 55%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-ivory) 10%, transparent);
}
.tabs::-webkit-scrollbar {
  display: none;
}
.tab {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 44px;
  padding: 0.6rem 1.15rem;
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-mist);
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.3s ease, background 0.4s var(--ease-out-expo);
}
.tab:hover {
  color: var(--color-ivory);
}
.tab--active {
  color: var(--color-void);
  background: linear-gradient(100deg, var(--color-saffron), var(--color-coral));
}
.tab:focus-visible {
  outline: 2px solid var(--color-saffron);
  outline-offset: 2px;
}

.panel {
  border-radius: 1.75rem;
  padding: clamp(1.4rem, 3.5vw, 2.5rem);
}
.panel:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-saffron) 60%, transparent);
  outline-offset: 4px;
}
.panel__intro {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem 3rem;
  align-items: end;
  margin-bottom: 2rem;
}
.panel__headline {
  font-size: clamp(1.4rem, 2.8vw, 2rem);
  margin: 0;
  text-wrap: balance;
}
.panel__who {
  margin: 0;
  color: var(--color-mist);
  line-height: 1.6;
}
.panel__who span {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-saffron);
  margin-bottom: 0.3rem;
}

.matrix {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  line-height: 1.5;
}
.matrix th {
  text-align: left;
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-muted);
  padding: 0 1rem 0.8rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--color-ivory) 14%, transparent);
}
.matrix td {
  padding: 1rem 1.25rem 1rem 0;
  vertical-align: top;
  border-bottom: 1px solid color-mix(in srgb, var(--color-ivory) 7%, transparent);
}
.matrix tbody tr {
  transition: background 0.3s ease;
}
.matrix tbody tr:hover {
  background: color-mix(in srgb, var(--color-ivory) 3%, transparent);
}
.matrix__problem {
  color: var(--color-mist);
  width: 33%;
}
.matrix strong {
  color: var(--color-ivory);
}
.matrix__outcome {
  width: 30%;
}
.matrix__ok {
  display: flex;
  gap: 0.45rem;
}
.matrix__ok svg {
  flex: none;
  margin-top: 0.2rem;
  color: var(--color-emerald);
}

.panel__note {
  margin-top: 1.75rem;
  padding: 1.1rem 1.25rem;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--color-emerald) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-emerald) 25%, transparent);
  line-height: 1.6;
}
.panel__note p {
  margin: 0;
}
.panel__small {
  margin-top: 0.7rem !important;
  font-size: 0.82rem;
  color: var(--color-mist);
}
.panel__proof {
  margin: 1.75rem 0 0;
  padding-left: 1.1rem;
  border-left: 2px solid var(--color-saffron);
  line-height: 1.65;
  max-width: 70ch;
}
.panel__source {
  display: block;
  margin-top: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-muted);
}
.panel__ctas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.75rem;
  margin-top: 2rem;
}
.panel__demo {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  color: var(--color-saffron);
  font-weight: 600;
  text-decoration: none;
}
.panel__demo svg {
  transition: transform 0.3s var(--ease-out-expo);
}
.panel__demo:hover svg {
  transform: translateX(4px);
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.3s ease, transform 0.4s var(--ease-out-expo);
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.swap-leave-to {
  opacity: 0;
}

@media (max-width: 760px) {
  .tabs {
    width: auto;
    max-width: none;
    margin-inline: -1.5rem;
    padding-inline: 1.5rem;
    border-radius: 0;
    border-inline: 0;
  }
  .panel__intro {
    grid-template-columns: 1fr;
  }
  /* Table → stacked cards */
  .matrix thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
  .matrix,
  .matrix tbody,
  .matrix tr,
  .matrix td {
    display: block;
    width: auto;
  }
  .matrix tr {
    padding: 1rem 0;
    border-bottom: 1px solid color-mix(in srgb, var(--color-ivory) 10%, transparent);
  }
  .matrix td {
    border: 0;
    padding: 0.3rem 0;
  }
  .matrix td::before {
    content: attr(data-label);
    display: block;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-muted);
    margin-bottom: 0.15rem;
  }
}
</style>
