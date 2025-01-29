import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { performanceMonitor } from './utils/performance';
import './style.css';

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}

// Create app instance
const app = createApp(App);

// Measure component render performance in development
if (import.meta.env.DEV) {
  app.mixin({
    beforeCreate() {
      this.$_renderStart = performanceMonitor.startRenderMeasurement();
    },
    mounted() {
      performanceMonitor.endRenderMeasurement(this.$_renderStart);
    }
  });
}

// Measure page load performance
window.addEventListener('load', () => {
  performanceMonitor.measurePageLoad();
  performanceMonitor.reportMetrics();
});

app.use(createPinia())
   .use(router)
   .use(i18n)
   .mount('#app');
