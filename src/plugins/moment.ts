import moment, { Moment } from 'moment-timezone'
import { App } from 'vue'
import 'moment/locale/ru'
import { getLocale } from '@/plugins/i18n'
const locale = getLocale()
moment.tz.setDefault('Europe/Moscow')
moment.locale(locale)
const registerMoment = (app: App<any>): void => {
  if (!app.config.globalProperties.$moment) {
    app.config.globalProperties.$moment = moment
  }
}

export {
  registerMoment,
  moment
}

export type M = Moment