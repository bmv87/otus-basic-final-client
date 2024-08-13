<template>
  <v-text-field
      v-model.trim="innerValue"
      :prepend-inner-icon="prependIcon"
      :append-icon="appendIcon"
      :label="label"
      :type="type"
      :error-messages="errors"
      :readonly="readonly"
      :clearable="!readonly"
      :single-line="singleLine"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
      :hint="hint"
      :density="density"
      :variant="variant"
      @click:append="clickAppend"
      @update:model-value="change"
      @keyup="keyup"
      @keyup.enter="onEnter">
    <template
        v-if="required"
        v-slot:prepend-inner>
      <span :class="`text-${requiredColor}`">
        {{ '*' }}
      </span>
    </template>
  </v-text-field>
</template>

<script lang="ts" setup>
import {
  Ref, ref, toRefs, watch, withDefaults
} from 'vue'
const emits = defineEmits([
  'update:modelValue',
  'change',
  'keyup',
  'click:append',
  'keyup:enter'
])
type Density = null | 'default' | 'comfortable' | 'compact'

export interface Props {
  modelValue?: string | number | null | any
  errors?: string[] | string
  prependIcon?: string | null
  appendIcon?: string | null
  required?: boolean
  requiredColor?: string
  label?: string | undefined
  readonly?: boolean
  singleLine?: boolean
  hideDetails?: boolean | 'auto' | undefined
  persistentHint?: boolean
  hint?: string | undefined
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  density?: Density
  type?: string
  dataType?: 'text' | 'int' | 'float'
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  required: false,
  requiredColor: 'requiredfield',
  readonly: false,
  singleLine: false,
  hideDetails: false,
  persistentHint: false,
  type: 'text',
  dataType: 'text'
})
const {
  modelValue,
  errors,
  prependIcon,
  appendIcon,
  required,
  requiredColor,
  label,
  readonly,
  singleLine,
  hideDetails,
  persistentHint,
  hint,
  variant,
  density,
  type,
  dataType
} = toRefs(props)

const innerValue: Ref<string | number | null> = ref(null)
watch(
  // getter
  () => modelValue.value,
  // callback
  (newVal: any) => {
    if (newVal !== innerValue.value) {
      innerValue.value = newVal
    }
  },
  // watch Options
  {
    immediate: true
  }
)

const parseValue = (value: any) => {
  switch (dataType.value) {
    case 'int':
      if (!value && value !== '0' && value !== 0) {
        return null
      }
      return !isInt(value)
        ? value
        : Number.parseInt(value)
    case 'float':
      if (!value && value !== '0' && value !== 0) {
        return null
      }
      return isNaN(value)
        ? value
        : Number.parseFloat(value)

    default:
      return value
  }
}
const isInt = function (value: any): boolean {
  return !isNaN(value) &&
         parseInt(value) == value &&
         !isNaN(parseInt(value, 10))
}
const change = (value: string | number | null) => {
  emits('update:modelValue', parseValue(value))
  emits('change', parseValue(value))
}
const keyup = () => {
  emits('keyup')
}
const onEnter = () => {
  emits('keyup:enter')
}
const clickAppend = () => {
  emits('click:append')
}
</script>
