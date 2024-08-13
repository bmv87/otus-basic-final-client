<template>
  <v-checkbox
      v-model="innerValue"
      :readonly="readonly"
      :prepend-inner-icon="prependIcon"
      :error-messages="errors"
      :label="label"
      :single-line="singleLine"
      :hide-details="hideDetails"
      :persistent-hint="persistentHint"
      :hint="hint"
      :density="density"
      :variant="variant" />
</template>

<script lang="ts" setup>
import {
  Ref, ref, toRefs, watch, withDefaults
} from 'vue'
const emits = defineEmits([
  'update:modelValue',
  'change'])
type Density = null | 'default' | 'comfortable' | 'compact'

export interface Props {
  modelValue?: string | number | null | any
  errors?: string[] | string,
  prependIcon?: string | null
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
  modelValue: null,
  readonly: false,
  singleLine: false,
  hideDetails: false,
  persistentHint: false,
  density: 'compact'
})
const {
  modelValue,
  errors,
  prependIcon,
  label,
  readonly,
  singleLine,
  hideDetails,
  persistentHint,
  hint,
  variant,
  density
} = toRefs(props)

const innerValue: Ref<boolean | null | undefined> = ref(null)

watch(// getter
  () => modelValue.value,
  // callback
  (newVal) => {
    if (newVal !== innerValue.value) {
      innerValue.value = newVal
    }
  },
  // watch Options
  {
    immediate: true
  })

watch(// getter
  () => innerValue.value,
  // callback
  (newVal) => {
    emits('update:modelValue', newVal)
    if (newVal !== modelValue.value) {
      emits('change', newVal)
    }
  },
  // watch Options
  {
    immediate: true
  })

</script>
