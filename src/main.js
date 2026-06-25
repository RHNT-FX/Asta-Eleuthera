import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

// Scroll animation directive
const animateDirective = {
  mounted: (el) => {
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
  },
}

app.directive('animate', animateDirective)

app.use(pinia)
app.use(router)

// Initialize auth before mounting
const authStore = useAuthStore()
authStore.initialize().then(() => {
  app.mount('#app')
})