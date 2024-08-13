/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import '@/utils/baseUrlFixer'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from '@/App.vue'
import { createApp } from 'vue'
import { Field, Form } from 'vee-validate'

console.log(`APP_ENV: ${import.meta.env.VITE_APP_ENV}`)
console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
const app = createApp(App)

registerPlugins(app)
app.component('VVField', Field)
app.component('VVForm', Form)
app.mount('#app')
