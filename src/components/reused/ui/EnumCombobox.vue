<template>
  <v-combobox
      :model-value="current"
      item-value="key"
      item-title="value"
      :items="items"
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
      return-object
      eager
      :density="density"
      :variant="variant"
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
import {
  Ref, computed, ref, toRefs, watch, withDefaults
} from 'vue'
import { t } from '@/plugins/i18n'

type Density = null | 'default' | 'comfortable' | 'compact'

export interface Props {
  modelValue?: string | number | null | any
  valuesEnum: Record<string, any>
  errors?: string[] | string,
  prependIcon?: string | null
  appendIcon?: string | null
  required?: boolean
  requiredColor?: string
  label?: string | undefined
  readonly?: boolean
  clearable?: boolean
  singleLine?: boolean
  hideDetails?: boolean | 'auto' | undefined
  persistentHint?: boolean
  hint?: string | undefined
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  density?: Density
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  valuesEnum: () => ({}),
  required: false,
  requiredColor: 'requiredfield',
  readonly: false,
  clearable: false,
  singleLine: false,
  hideDetails: false,
  persistentHint: false
})

const {
  modelValue,
  valuesEnum,
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
  density
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

const items = computed(() => {
  return Object.keys(valuesEnum.value)
    .map(key => ({
      key,
      value: t(valuesEnum.value[key])
    }))
})

const current = computed(() => {
  if (modelValue.value) {
    return items.value.find(i => i.key === modelValue.value) || null
  }
  return null
})

const emits = defineEmits(['update:modelValue', 'change'])

const change = (item: any) => {
  emits('update:modelValue', item && item.key
    ? item.key
    : null)
  emits('change', item && item.key
    ? item.key
    : null)
}
</script>
