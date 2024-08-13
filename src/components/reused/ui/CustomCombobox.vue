<template>
  <v-combobox
      v-model:search="search"
      :model-value="current"
      :loading="loading"
      :readonly="readonly"
      :item-value="itemValue"
      :item-title="itemTitle"
      :items="filterItems"
      :label="label"
      :error-messages="errors"
      :clearable="clearable && !readonly"
      :prepend-inner-icon="prependIcon"
      :append-icon="appendIcon"
      :single-line="singleLine"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
      :hint="hint"
      :density="density"
      :variant="variant"
      eager
      return-object
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
  Ref, computed, nextTick, ref, toRefs, withDefaults
} from 'vue'
import { isEqual } from 'lodash'

const emits = defineEmits([
  'update:modelValue',
  'change'])
type Density = null | 'default' | 'comfortable' | 'compact'

export interface Props {
  modelValue?: string | number | null
  itemValue: string
  itemTitle: string
  items: Record<string | number, string | number>[]
  errors?: string[] | string
  prependIcon?: string | null
  appendIcon?: string | null
  required?: boolean
  clearable?: boolean
  requiredColor?: string
  label?: string | undefined
  readonly?: boolean
  loading?: boolean
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
  prependIcon: 'mdi-account',
  itemValue: 'key',
  itemTitle: 'value',
  readonly: false,
  singleLine: false,
  hideDetails: false,
  persistentHint: false,
  clearable: false,
  items: () => ([]),
  loading: false
})
const {
  modelValue,
  itemValue,
  itemTitle,
  errors,
  items,
  prependIcon,
  appendIcon,
  required,
  requiredColor,
  label,
  loading,
  readonly,
  singleLine,
  hideDetails,
  persistentHint,
  hint,
  variant,
  density
} = toRefs<Props>(props)

const search: Ref<string | null> = ref(null)

const current = computed((): Record<string | number, string | number> | null | undefined => {
  return items.value?.find(u => u[itemValue.value] === modelValue?.value)
})

const filterItems = computed(() => {
  let fItems = items.value
  if (search.value && (!current.value || search.value !== current.value.value)) {
    fItems = fItems.filter(p => p[itemTitle.value].toString().includes(search.value as string))
  }
  if (current.value && current.value[itemValue.value]) {
    const currentVal = current.value[itemValue.value] as string
    fItems = fItems.filter(p => currentVal !== p[itemValue.value])
  }
  return fItems
})
const change = function (item: Record<string | number, string | number> | null | undefined) {
  let val = item ? item[itemValue.value] : null
  emits('update:modelValue', val)
  if (!isEqual(val, modelValue?.value)) {
    nextTick(() => {
      emits('change')
    })
  }
}
</script>
