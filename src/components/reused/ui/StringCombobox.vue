<template>
  <v-combobox
      :items="items"
      :model-value="modelValue"
      :error-messages="errors"
      :label="label"
      :readonly="readonly"
      :clearable="clearable && !readonly"
      :prepend-inner-icon="prependIcon"
      :append-icon="appendIcon"
      :single-line="singleLine"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
      :hint="hint"
      eager
      :variant="variant"
      :density="density"
      @update:model-value="change">
    <template
        v-if="required"
        v-slot:prepend-inner>
      <span :class="`text-${requiredColor}`">
        {{ '*' }}
      </span>
    </template>
  </v-combobox>
</template>

<script lang="ts" setup>
import { toRefs, watch, withDefaults } from 'vue'
const emits = defineEmits([
  'update:modelValue',
  'change'
])
type Density = null | 'default' | 'comfortable' | 'compact'

export interface Props {
  modelValue?: string | number | null | any
  items: Array<string>
  errors?: string[] | string
  prependIcon?: string | null
  appendIcon?: string | null
  required?: boolean
  requiredColor?: string
  label?: string
  readonly?: boolean
  singleLine?: boolean
  hideDetails?: boolean | 'auto'
  persistentHint?: boolean
  clearable?: boolean
  hint?: string
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  density?: Density
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  items: () => ([]),
  required: false,
  requiredColor: 'requiredfield',
  readonly: false,
  singleLine: false,
  hideDetails: false,
  persistentHint: false,
  clearable: false
})
const {
  modelValue,
  items,
  errors,
  prependIcon,
  appendIcon,
  required,
  requiredColor,
  label,
  readonly,
  clearable,
  singleLine,
  hideDetails,
  persistentHint,
  hint,
  variant,
  density
} = toRefs(props)

const change = function (item?: string) {
  emits('update:modelValue', item || null)
  if (item !== modelValue.value) {
    emits('change', item)
  }
}

watch(
  // getter
  () => items.value,
  // callback
  (newVal: Array<string>) => {
    if (newVal.length === 1 && !modelValue.value) {
      change(newVal[0])
    }
  },
  // watch Options
  {
    immediate: true
  }
)

</script>
