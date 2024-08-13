/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from '@/plugins/vuetify'
import pinia from '@/store'
import router from '@/router'
import { i18n } from '@/plugins/i18n'

import axios from '@/plugins/axios'
import { env } from '@/plugins/environment-helper'
import { hosts } from '@/plugins/host-configurator'
import * as helpers from '@/plugins/custom-helper'
import '@/plugins/yup-validators'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {

  app.config.globalProperties = {
    ...app.config.globalProperties,
    $http: axios,
    $env: env(),
    $hosts: hosts(),
    $helpers: helpers
  }
  app
    .use(i18n)
    .use(vuetify)
    .use(pinia)
    .use(router)
}
