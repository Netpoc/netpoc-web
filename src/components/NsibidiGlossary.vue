<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { GLYPHS, NSIBIDI_SETS, type NsibidiSet } from '@/content/nsibidi'

/**
 * Names the Nsibidi glyphs woven into the current page's pattern, so the
 * background reads as writing, not decoration. Modern compounds are marked.
 */
const route = useRoute()
const glyphs = computed(() => {
  const name = (route.meta.nsibidi as NsibidiSet | undefined) ?? 'welcome'
  return NSIBIDI_SETS[name].glyphs.map((key) => ({ key, ...GLYPHS[key] }))
})
const hasCompound = computed(() => glyphs.value.some((g) => g.origin === 'compound'))
</script>

<template>
  <section class="glossary" aria-labelledby="glossary-title">
    <div class="glossary__intro">
      <h2 id="glossary-title" class="glossary__title">Written into this page</h2>
      <p class="glossary__note">
        The pattern behind these sections is Nsibidi, the ideographic script of the Cross River
        region. It reads:
      </p>
    </div>
    <ul class="glossary__list">
      <li v-for="g in glyphs" :key="g.key" :title="`Nsibidi dictionary entry ${g.entry}`">
        <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <path :d="g.d" />
          <circle v-for="(dot, j) in 'dots' in g ? g.dots : []" :key="j" :cx="dot[0]" :cy="dot[1]" :r="dot[2]" />
        </svg>
        <span class="glossary__meaning">
          {{ g.meaning }}
          <span v-if="g.origin === 'compound'" class="glossary__neo">neo</span>
        </span>
      </li>
    </ul>
    <div class="glossary__key">
      <p v-if="hasCompound">
        <span class="glossary__neo">neo</span> marks a modern compound built from the original symbols.
      </p>
      <p>Symbols and meanings after the Nsịbịrị (neo-Nsibidi) dictionary, revision 23, 2015.</p>
    </div>
  </section>
</template>

<style scoped>
.glossary {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.75rem 1.5rem;
  border-top: 1px solid color-mix(in srgb, var(--color-ivory) 8%, transparent);
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) 2.6fr;
  gap: 1rem 2.5rem;
  align-items: start;
}
.glossary__title {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0;
  color: var(--color-ivory);
}
.glossary__note {
  margin: 0.4rem 0 0;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--color-muted);
}
.glossary__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 0.75rem 1.25rem;
}
.glossary__list li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.glossary__list svg {
  flex: none;
  width: 30px;
  height: 30px;
  fill: none;
  stroke: var(--color-saffron);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.glossary__list circle {
  fill: var(--color-saffron);
  stroke: none;
}
.glossary__meaning {
  font-size: 0.85rem;
  line-height: 1.3;
  color: var(--color-mist);
}
.glossary__neo {
  display: inline-block;
  margin-left: 0.2rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  font-size: 0.68rem;
  line-height: 1.5;
  color: var(--color-muted);
  border: 1px solid color-mix(in srgb, var(--color-ivory) 18%, transparent);
  vertical-align: 1px;
}
.glossary__key {
  grid-column: 2;
  display: grid;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: var(--color-muted);
}
.glossary__key p {
  margin: 0;
}
.glossary__key .glossary__neo {
  margin: 0 0.25rem 0 0;
}
@media (max-width: 760px) {
  .glossary {
    grid-template-columns: 1fr;
  }
  .glossary__key {
    grid-column: 1;
  }
}
</style>
