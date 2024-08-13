<template>
  <v-textarea
      v-model="innerValue"
      :label="label"
      :error-messages="errors"
      :readonly="readonly"
      :prepend-inner-icon="prependIcon"
      :append-icon="appendIcon"
      :single-line="singleLine"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
      :hint="hint"
      :rows="rows"
      :variant="variant"
      :density="density">
    <template
        v-if="required"
        v-slot:prepend-inner>
      <span :class="`text-${requiredColor}`">
        {{ '*' }}
      </span>
    </template>
  </v-textarea>
</template>

<script lang="ts" setup>
import {
  Ref, ref, toRefs, watch, withDefaults
} from 'vue'
type Density = null | 'default' | 'comfortable' | 'compact'

export interface Props {
  modelValue?: string | number | null | any
  errors?: string[] | string,
  prependIcon?: string | null
  appendIcon?: string | null
  required?: boolean
  requiredColor?: string
  label?: string
  readonly?: boolean
  singleLine?: boolean
  hideDetails?: boolean | 'auto'
  persistentHint?: boolean
  hint?: string
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  density?: Density
  rows?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  required: false,
  requiredColor: 'requiredfield',
  readonly: false,
  singleLine: false,
  hideDetails: false,
  persistentHint: false,
  rows: 1
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
  rows
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
const emits = defineEmits([
  'update:modelValue',
  'change'
])
watch(
  // getter
  () => innerValue.value,
  // callback
  (newVal: any) => {
    if (newVal !== modelValue.value) {
      emits('update:modelValue', newVal)
      if (newVal !== modelValue.value) {
        emits('change', newVal)
      }
    }
  }
)

</script>
