import './assets/main.css'
import 'reset-css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 引入 Tailwind CSS
import './index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
