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
              :allowed-dates="checkDate"
              :readonly="readonly"
              :disabled="readonly"
              :min="minDate"
              :max="maxDate" />
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
              :disabled="!date"
              :text="$t('Выбрать')"
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
  DATE_TIME_HMS_FORMAT
} from '@/constants/settings'

const emits = defineEmits([
  'update:modelValue',
  'change'])

type Density = null | 'default' | 'comfortable' | 'compact'

export interface Props {
  modelValue?: string | null
  dayOffDates?: string[]
  minSelectedDate?: string | null
  maxSelectedDate?: string | null
  errors?: string[] | string
  prependIcon?: string | null
  required?: boolean
  clearable?: boolean
  dateOnly?: boolean
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
  label: t('Дата'),
  minSelectedDate: '1991-01-01',
  maxSelectedDate: moment(moment().add(10, 'years')).format(DATE_ONLY_FORMAT),
  clearable: false,
  dateOnly: false,
  singleLine: false,
  hideDetails: false,
  persistentHint: false
})
const {
  modelValue,
  dayOffDates,
  minSelectedDate,
  maxSelectedDate,
  dateOnly,
  clearable,
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

const menuDataPicker: Ref<boolean> = ref(false)
const date: Ref<Date | undefined | null> = ref(null)

const modelFormat = computed((): string => {
  return dateOnly?.value
    ? DATE_ONLY_FORMAT
    : DATE_TIME_HMS_FORMAT
})

const hasErrors = computed((): boolean => {
  return !!errors?.value?.length
})

const formattedData = computed((): string | null => {
  return modelValue?.value
    ? moment(modelValue?.value).format(DATE_ONLY_VIEW_FORMAT)
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

watch(// getter
  () => modelValue?.value,
  // callback
  (newValue: string | null | undefined) => {
    if (newValue && newValue !== 'Invalid date') {
      date.value = moment(newValue, modelFormat.value).toDate()
    }
  },
  // watch Options
  {
    immediate: true
  })

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
  const dateString = moment(date.value).format(modelFormat.value)
  emits('update:modelValue', dateString)
  // информируем родительский компонент, что дата поменялась, для запуска самописной обработки
  if (modelValue?.value !== dateString) {
    emits('change', dateString)
  }
  await nextTick()
  menuDataPicker.value = false
}

const clear = function () {
  date.value = null
  emits('update:modelValue', null)
}

const closeMenu = function () {
  if (!readonly?.value) {
    date.value = modelValue?.value
      ? moment(date.value).toDate()
      : null
  }
  menuDataPicker.value = false
}
</script>
