<template>
  <v-text-field
      v-model="formattedData"
      :error="hasErrors"
      :prepend-inner-icon="prependIcon"
      :error-messages="errors"
      readonly
      :label="label"
      :clearable="clearable && !readonly && !!modelValue && !menuDataPicker"
      :single-line="singleLine"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
      :hint="hint"
      :density="density"
      :variant="variant"
      @click:clear="clear">
    <template
        v-if="required"
        v-slot:prepend-inner>
      <span :class="`text-${requiredColor}`">
        {{ '*' }}
      </span>
    </template>
    <v-menu
        v-model="menuDataPicker"
        :readonly="readonly"
        min-width="290px"
        activator="parent">
      <v-card>
        <v-card-text>
          <v-date-picker
              v-model="date"
              show-adjacent-months
              :allowed-dates="checkDate"
              :readonly="readonly"
              :disabled="readonly"
              :min="minDate"
              :max="maxDate" />

          <v-text-field
              v-model="time"
              :readonly="readonly"
              :single-line="singleLine"
              :hide-details="hideDetails"
              :density="density"
              :variant="variant"
              :persistent-hint="!!formattedInnerDate"
              :hint="formattedInnerDate || ''"
              type="time"
              max-width="200px" />

        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <VBtnSecondary
              id="cancelDateBtn"
              :text="$t('Отмена')"
              @click.stop="closeMenu" />
          <VBtnPrimary
              v-if="!readonly"
              id="selectDateBtn"
              :text="$t('Выбрать')"
              :disabled="!date"
              @click.stop="updateValue" />
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-text-field>
</template>

<style scoped>
</style>

<script lang="ts" setup>
import {
  Ref, computed, nextTick, ref, toRefs, watch, withDefaults
} from 'vue'
import { t } from '@/plugins/i18n'
import { moment } from '@/plugins/moment'
import {
  DATE_ONLY_FORMAT,
  DATE_ONLY_VIEW_FORMAT,
  DATE_TIME_HM_VIEW_FORMAT,
  DATE_TIME_HMS_FORMAT
} from '@/constants/settings'

const emits = defineEmits([
  'update:modelValue',
  'change'])
type Density = null | 'default' | 'comfortable' | 'compact'

export interface Props {
  modelValue?: string | null
  dayOffDates?: string[] | null
  minSelectedDate?: string | null
  maxSelectedDate?: string | null
  errors?: string[] | string
  prependIcon?: string | null
  required?: boolean
  clearable?: boolean
  requiredColor?: string
  label?: string | undefined
  readonly?: boolean
  singleLine?: boolean
  hideDetails?: boolean | 'auto' | undefined
  persistentHint?: boolean
  hint?: string | undefined
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  density?: Density
}
const props = withDefaults(defineProps<Props>(), {
  required: false,
  requiredColor: 'requiredfield',
  prependIcon: 'mdi-calendar',
  readonly: false,
  clearable: false,
  label: t('Дата'),
  minSelectedDate: '1991-01-01',
  maxSelectedDate: moment(moment().add(10, 'years')).format(DATE_ONLY_FORMAT),
  singleLine: false,
  hideDetails: false,
  persistentHint: false
})
const {
  modelValue,
  dayOffDates,
  minSelectedDate,
  maxSelectedDate,
  errors,
  prependIcon,
  required,
  requiredColor,
  label,
  readonly,
  singleLine,
  hideDetails,
  persistentHint,
  hint,
  variant,
  density
} = toRefs<Props>(props)

const menuDataPicker = ref(false)
const menuTimePicker = ref(false)
const time: Ref<string | undefined | null> = ref('00:00')
const date: Ref<Date | undefined | null> = ref(null)

const hasErrors = computed((): boolean => {
  return !!errors?.value?.length
})

const formattedData = computed((): string | null => {
  return modelValue?.value
    ? moment(modelValue.value).format(DATE_TIME_HM_VIEW_FORMAT)
    : null
})
const formattedInnerDate = computed((): string | null => {
  return date?.value
    ? getInnerDateTimeString(DATE_ONLY_VIEW_FORMAT)
    : null
})

const minDate = computed((): string | null => {
  return minSelectedDate?.value
    ? moment(minSelectedDate?.value).format(DATE_ONLY_FORMAT)
    : null
})

const maxDate = computed((): string | null => {
  return maxSelectedDate?.value
    ? moment(maxSelectedDate?.value).format(DATE_ONLY_FORMAT)
    : null
})
const initDateTime = function (value: string | null | undefined) {
  if (!value || value === 'Invalid date') {
    return
  }
  let d = moment(value)
  date.value = d.toDate()
  time.value = d.format('HH:mm')
}

// const checkDate = function (val: unknown) {
//   (val as Date).setHours(23)
//   return (
//     !dayOffDates?.value ||
//         !dayOffDates?.value.length ||
//     !dayOffDates?.value?.includes((val as Date).toISOString().substring(0, 10))
//   )
// }
const checkDate = function (val: unknown) {
  let d = moment(val as Date).format(DATE_ONLY_FORMAT)
  return (
    !dayOffDates?.value ||
        !dayOffDates?.value.length ||
    !dayOffDates?.value?.includes(d)
  )
}

const updateValue = async function () {
  if (!date.value) {
    return
  }
  // let newDateTime = $moment(date, DATE_ONLY_FORMAT).format(DATE_ONLY_FORMAT)
  // изменение поля (привязанного через дерективу v-model) в родительском компоненте

  let newDate = getInnerDateTimeString(DATE_ONLY_VIEW_FORMAT)
  const dateString = moment(newDate, DATE_TIME_HM_VIEW_FORMAT).format(DATE_TIME_HMS_FORMAT)
  emits('update:modelValue', dateString)
  // информируем родительский компонент, что дата поменялась, для запуска самописной обработки
  if (modelValue?.value !== dateString) {
    emits('change', dateString)
  }
  await nextTick()
  menuDataPicker.value = false
}

const getInnerDateTimeString = function (dateFormat: string): string {
  let d = moment(date.value).format(dateFormat)

  return time.value
    ? `${d} ${time.value}`
    : `${d} '00:00'`
}

const clear = function () {
  date.value = null
  time.value = '00:00'
  emits('update:modelValue', null)
}

const closeMenu = function () {
  if (!readonly?.value) {
    initDateTime(modelValue?.value)
  }
  menuDataPicker.value = false
  menuTimePicker.value = false
}

watch(// getter
  () => modelValue?.value,
  // callback
  (newValue: string | null | undefined) => {
    initDateTime(newValue)
  },
  // watch Options
  {
    immediate: true
  }
)
</script>
