<template>
  <span :class="valueClass">
    {{ $t(displayValue) }}
  </span>
</template>

<script lang="ts" setup>
import { computed, toRefs, withDefaults } from 'vue'
type Enum = Record<string, string>
export interface Props {
  value?: string | null
  enumObject: Enum
  valueClass?: string
  noData?: string
}

const props = withDefaults(defineProps<Props>(), {
  noData: '',
  enumObject: () => ({})
})
const {
  value,
  enumObject,
  valueClass,
  noData
} = toRefs(props)

const displayValue = computed(() => {
  let e = enumObject.value
  return value.value
    ? e[value.value as keyof typeof e]
    : noData.value
})
</script>
