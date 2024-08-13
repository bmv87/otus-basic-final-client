
// app.ts
import { setLocale } from 'yup'
import { t } from '@/plugins/i18n'

setLocale({
  mixed: {
    required: () => (t('$yup.mixed.required')),
    notType: ({ type }) => (t('$yup.mixed.notType', {
      type: t(type)
    }))
  },
  number: {
    min: ({ min }) => (t('$yup.number.min', {
      min
    })),
    max: ({ max }) => (t('$yup.number.max', {
      max
    })),
    lessThan: ({ less }) => (t('$yup.number.lessThan', {
      less
    })),
    moreThan: ({ more }) => (t('$yup.number.moreThan', {
      more
    })),
    integer: () => (t('$yup.number.integer'))
  },
  string: {
    email: () => (t('$yup.string.email')),
    uuid: () => (t('$yup.string.uuid')),
    min: ({ min }) => (t('$yup.string.min', {
      min
    })),
    max: ({ max }) => (t('$yup.string.max', {
      max
    }))
  }
})
