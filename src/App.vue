<script setup lang="ts">
import SiteNav from '@/components/SiteNav.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <div class="app">
    <!-- Ambient glow field behind everything -->
    <div class="aurora" aria-hidden="true">
      <span class="aurora__blob aurora__blob--saffron" />
      <span class="aurora__blob aurora__blob--violet" />
      <span class="aurora__blob aurora__blob--emerald" />
    </div>

    <SiteNav />

    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.app {
  position: relative;
  min-height: 100vh;
  isolation: isolate;
}

.aurora {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}
.aurora__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.5;
  will-change: transform;
}
.aurora__blob--saffron {
  width: 42vw;
  height: 42vw;
  top: -8vw;
  left: -6vw;
  background: radial-gradient(circle, var(--color-saffron), transparent 70%);
  animation: drift1 22s var(--ease-out-expo) infinite alternate;
}
.aurora__blob--violet {
  width: 46vw;
  height: 46vw;
  top: 30vh;
  right: -12vw;
  background: radial-gradient(circle, var(--color-violet), transparent 70%);
  animation: drift2 26s var(--ease-out-expo) infinite alternate;
}
.aurora__blob--emerald {
  width: 36vw;
  height: 36vw;
  bottom: -10vw;
  left: 25vw;
  background: radial-gradient(circle, var(--color-emerald), transparent 70%);
  opacity: 0.35;
  animation: drift3 30s var(--ease-out-expo) infinite alternate;
}

@keyframes drift1 {
  to {
    transform: translate(8vw, 6vh) scale(1.1);
  }
}
@keyframes drift2 {
  to {
    transform: translate(-6vw, -8vh) scale(1.05);
  }
}
@keyframes drift3 {
  to {
    transform: translate(4vw, -5vh) scale(1.15);
  }
}

/* Route transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s var(--ease-out-expo), transform 0.4s var(--ease-out-expo);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .aurora__blob {
    animation: none;
  }
}
</style>
