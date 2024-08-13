<template>
  <v-radio-group
      :model-value="innerValue"
      :readonly="readonly"
      :error-messages="errors"
      @update:model-value="change">
    <template v-slot:label>
      <!-- <label class="v-label my-1"> -->
      <v-icon v-if="prependIcon" :icon="prependIcon" size="small" class="ml-0" />
      <span v-if="required" :class="`text-${requiredColor} mr-1`">
        {{ '* ' }}
      </span>
      <span class=" text-wrap">
        {{ label }}
      </span>

      <!-- </label> -->

    </template>
    <v-radio
        v-for="(item, key) in items"
        :id="`radio-${key}`"
        :key="key"
        :value="key"
        :label="$t(item)">
      <v-tooltip
          v-if="itemsTips[key]"
          activator="parent"
          :text="itemsTips[key] || ''" />
    </v-radio>
  </v-radio-group>

</template>

<script lang="ts" setup>
import { ref, toRefs, watch, withDefaults } from 'vue'

export interface Props {
  modelValue?: string
  required?: boolean
  items?: Record<string, any>
  itemsTips?: Record<string, any>
  label?: string
  prependIcon?: string
  readonly?: boolean
  requiredColor?: string
  errors?: string | null
}

const props = withDefaults (defineProps<Props>(), {
  required: false,
  itemsTips: () => {
    return {}
  },
  readonly: false,
  requiredColor: 'requiredfield'
})
const {
  modelValue,
  required,
  items,
  itemsTips,
  label,
  readonly,
  requiredColor,
  prependIcon,
  errors
} = toRefs(props)

const innerValue = ref(null)

watch(// getter
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
  })

const emits = defineEmits(['update:modelValue', 'change'])

const change = (value: any) => {
  emits('update:modelValue', value)
  if (modelValue.value !== value) {
    emits('change', value)
  }
}
</script>
