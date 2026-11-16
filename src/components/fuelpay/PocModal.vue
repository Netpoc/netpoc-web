<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import PocForm from './PocForm.vue'
import FpIcon from './FpIcon.vue'
import { useFuelPay } from '@/composables/useFuelPay'

const { pocOpen, segment, calc, attribution, demoHref } = useFuelPay()
const dialog = ref<HTMLDialogElement | null>(null)
let opener: HTMLElement | null = null

watch(pocOpen, async (open) => {
  const el = dialog.value
  if (!el) return
  if (open) {
    opener = document.activeElement as HTMLElement | null
    await nextTick()
    el.showModal()
    document.documentElement.style.overflow = 'hidden'
  } else if (el.open) {
    el.close()
  }
})

function onClose() {
  pocOpen.value = false
  document.documentElement.style.overflow = ''
  opener?.focus()
}

function onBackdrop(e: MouseEvent) {
  if (e.target === dialog.value) pocOpen.value = false
}
</script>

<template>
  <dialog ref="dialog" class="modal" aria-labelledby="poc-modal-title" @close="onClose" @click="onBackdrop">
    <div v-if="pocOpen" class="modal__panel glass-strong">
      <header class="modal__head">
        <div>
          <p class="modal__kicker">60-day paid pilot · fee credited on rollout</p>
          <h2 id="poc-modal-title" class="modal__title">Book a FuelPay PoC</h2>
        </div>
        <button type="button" class="modal__close" aria-label="Close" @click="pocOpen = false">
          <FpIcon name="x" :size="20" />
        </button>
      </header>
      <PocForm :segment="segment" :calc="calc" :attribution="attribution" :demo-href="demoHref('poc')" />
    </div>
  </dialog>
</template>

<style scoped>
.modal {
  /* Tailwind preflight zeroes margins; restore the UA centring for modal dialogs */
  position: fixed;
  inset: 0;
  margin: auto;
  width: min(760px, calc(100vw - 2rem));
  height: fit-content;
  max-height: calc(100dvh - 2rem);
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  overflow: visible;
}
.modal::backdrop {
  background: color-mix(in srgb, var(--color-void) 70%, transparent);
  backdrop-filter: blur(6px);
}
.modal[open] {
  animation: modal-in 0.45s var(--ease-out-expo);
}
@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
}
.modal__panel {
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  border-radius: 1.75rem;
  padding: clamp(1.4rem, 4vw, 2.25rem);
  background: color-mix(in srgb, var(--color-night-2) 94%, transparent);
}
.modal__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.modal__kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-saffron);
}
.modal__title {
  margin: 0.5rem 0 0;
  font-size: clamp(1.6rem, 3.5vw, 2.1rem);
}
.modal__close {
  flex: none;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--color-ivory) 18%, transparent);
  background: none;
  color: var(--color-ivory);
  cursor: pointer;
}
.modal__close:hover {
  background: color-mix(in srgb, var(--color-ivory) 8%, transparent);
}
.modal__close:focus-visible {
  outline: 2px solid var(--color-saffron);
  outline-offset: 2px;
}
</style>
