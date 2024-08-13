import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createI18n, useI18n } from 'vue-i18n'
import { ru } from 'vuetify/locale'
// initialization current localization
import messages from '@intlify/unplugin-vue-i18n/messages'
export type AcceptableLocale = 'ru'
const cRu = (messages as any).ru as Record<string, string | Record<string, Record<string, string>> >

const localeMessages = {
  ru: {
    ...cRu,
    $vuetify: {
      ...(cRu.$vuetify as Record<string, Record<string, string>> || {}),
      ...ru
    }
  }
}
const opt = {
  locale: 'ru',
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  fallbackLocale: process.env.VITE_APP_I18N_FALLBACK_LOCALE as string || 'ru',
  warnHtmlMessage: false, //disable [intlify] Not found '' key in '' locale messages.
  messages: localeMessages,
  silentTranslationWarn: true,
  fallbackWarn: false,
  missingWarn: false
}
const i18n = createI18n(opt)
const adapter = createVueI18nAdapter({
  i18n: i18n as any,
  useI18n
})
const getLocale = (): AcceptableLocale => {
  return (i18n.global.locale as any).value
}

const t = i18n.global.t
export
{
  i18n,
  adapter,
  getLocale,
  t
}
