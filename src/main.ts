import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import './style.css'
import App from './App.vue'
import router from './router'
import { initConsent } from './lib/consent'

initConsent()
createApp(App).use(router).use(MotionPlugin).mount('#app')
