import { createSSRApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import '@/utils/utils'

export function createApp() {
  const app = createSSRApp(App)

  app.use(pinia)
  return {
    app,
  }
}
