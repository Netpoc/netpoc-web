<script setup lang="ts">
import CultureFigure from '@/components/CultureFigure.vue'
import { FIGURES, type FigureName } from '@/components/figures'
import NsibidiPattern from '@/components/NsibidiPattern.vue'
import { GLYPHS, NSIBIDI_SETS, type NsibidiSet } from '@/content/nsibidi'

/** Dev-only contact sheet: every figure × palette × infill, plus the Nsibidi library. Route: /__figures */
const names = Object.keys(FIGURES) as FigureName[]
const variants = [
  { palette: 'heritage', infill: 'none' },
  { palette: 'ankara', infill: 'none' },
  { palette: 'heritage', infill: 'ankara' },
  { palette: 'night', infill: 'none' },
] as const
const sets = Object.keys(NSIBIDI_SETS) as NsibidiSet[]
</script>

<template>
  <div class="lab">
    <h1>Figure lab</h1>
    <table>
      <thead>
        <tr>
          <th />
          <th v-for="v in variants" :key="v.palette + v.infill">{{ v.palette }}{{ v.infill !== 'none' ? ' + infill' : '' }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in names" :key="n">
          <th>{{ n }}</th>
          <td v-for="v in variants" :key="v.palette + v.infill">
            <CultureFigure :name="n" :palette="v.palette" :infill="v.infill" animate height="300px" />
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Nsibidi glyphs</h2>
    <ul class="glyphs">
      <li v-for="(g, key) in GLYPHS" :key="key">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path :d="g.d" />
          <circle v-for="(dot, j) in 'dots' in g ? g.dots : []" :key="j" :cx="dot[0]" :cy="dot[1]" :r="dot[2]" />
        </svg>
        <span>{{ g.entry }} {{ key }}</span>
        <small>{{ g.origin }}</small>
      </li>
    </ul>

    <h2>Nsibidi sets</h2>
    <div class="sets">
      <figure v-for="s in sets" :key="s">
        <div class="swatch"><NsibidiPattern :set="s" :opacity="0.7" color="var(--color-saffron)" /></div>
        <div class="swatch"><NsibidiPattern :set="s" variant="ukara" :scale="200" :opacity="0.7" color="var(--color-saffron)" /></div>
        <figcaption>{{ s }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<style scoped>
.lab {
  padding: 6rem 1.5rem 3rem;
  overflow-x: auto;
}
th {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-mist);
  padding: 0.5rem;
  text-align: center;
}
h2 {
  margin: 3rem 0 1rem;
  font-size: 1.3rem;
}
.glyphs {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 1rem;
}
.glyphs li {
  display: grid;
  justify-items: center;
  gap: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-mist);
}
.glyphs svg {
  width: 64px;
  height: 64px;
  fill: none;
  stroke: var(--color-saffron);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.glyphs circle {
  fill: var(--color-saffron);
  stroke: none;
}
.sets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.sets figure {
  margin: 0;
  display: grid;
  gap: 0.5rem;
}
.swatch {
  position: relative;
  height: 200px;
  border-radius: 1rem;
  overflow: hidden;
  background: var(--color-night-2);
}
.sets figcaption {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-mist);
}
td {
  padding: 1rem;
  text-align: center;
  vertical-align: bottom;
}
</style>
