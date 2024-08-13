import { configure, defineRule } from 'vee-validate'
import veeValidateRules from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import { getLocale } from '@/plugins/i18n'
import { getPropertyValue } from '@/plugins/custom-helper'
import cmessages from '@intlify/unplugin-vue-i18n/messages'

const locale = getLocale()
const cRu = (cmessages as any)[locale].$yup as Record<string, string | Record<string, Record<string, string>>>
const veeValidateMessages = require(`@vee-validate/i18n/dist/locale/${locale}.json`)

Object.keys(veeValidateRules).forEach(rule => {
  const r = rule as keyof typeof veeValidateRules
  defineRule(rule, getPropertyValue(veeValidateRules, r) as any)
})

const m = {
  [locale]: {
    messages: {
      ...veeValidateMessages.messages,
      ...cRu
    }
  }
} as any

configure({
  generateMessage: localize(locale, m)
})
