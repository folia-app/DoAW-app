import './style/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createHead } from '@unhead/vue'
// import vClickOutside from "click-outside-vue3"

const app = createApp(App)

window.prerenderReady = false

const head = createHead()


app
  .use(router)
  .use(store)
  .use(head)
  .mount('#app')
