<script setup lang="ts">
import { SOCIAL_LIVE } from '@/content/company'
import { track } from '@/lib/track'

/** Icon links to Netpoc's social profiles. Renders nothing until a URL is real. */
defineProps<{ location: 'footer' | 'contact' }>()
</script>

<template>
  <ul v-if="SOCIAL_LIVE.length" class="social">
    <li v-for="s in SOCIAL_LIVE" :key="s.id">
      <a
        :href="s.url"
        target="_blank"
        rel="noopener"
        class="social__link"
        :aria-label="`Netpoc on ${s.label} (opens in a new tab)`"
        @click="track('social_click', { network: s.id, location })"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <template v-if="s.id === 'linkedin'">
            <circle cx="5.5" cy="5.5" r="2" fill="currentColor" />
            <rect x="3.75" y="9" width="3.5" height="11" rx="0.5" fill="currentColor" />
            <path
              fill="currentColor"
              d="M10 9h3.3v1.6c.6-1 1.8-1.8 3.5-1.8 2.7 0 4.2 1.7 4.2 4.8V20h-3.5v-5.7c0-1.5-.6-2.4-1.9-2.4s-2.1.9-2.1 2.4V20H10z"
            />
          </template>
          <path
            v-else-if="s.id === 'x'"
            fill="currentColor"
            d="M3.5 3.5h5.2l4.3 5.9 5-5.9h2.2l-6.2 7.2 6.9 9.8h-5.2l-4.7-6.4-5.5 6.4H3.3l6.6-7.6z"
          />
          <template v-else>
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2" />
            <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
          </template>
        </svg>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.social {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.social__link {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: var(--color-mist);
  border: 1px solid color-mix(in srgb, var(--color-ivory) 14%, transparent);
  background: color-mix(in srgb, var(--color-ivory) 4%, transparent);
  transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}
.social__link:hover {
  color: var(--color-saffron);
  border-color: color-mix(in srgb, var(--color-saffron) 50%, transparent);
  background: color-mix(in srgb, var(--color-saffron) 8%, transparent);
}
.social__link:focus-visible {
  outline: 2px solid var(--color-saffron);
  outline-offset: 2px;
}
</style>
