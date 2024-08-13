<template>
  <span :class="valueClass">
    {{ displayValue }}
  </span>
</template>

<script lang="ts" setup>
import { computed, toRefs, withDefaults } from 'vue'
import { moment } from '@/plugins/moment'
import { DATE_ONLY_VIEW_FORMAT } from '@/constants/settings'

export interface Props {
  value?: string | null
  dateFormat?: string
  valueClass?: string
  noData?: string
}

const props = withDefaults(defineProps<Props>(), {
  dateFormat: DATE_ONLY_VIEW_FORMAT,
  noData: ''
})
const {
  value,
  dateFormat,
  valueClass,
  noData
} = toRefs(props)

const displayValue = computed(() => {
  return value.value
    ? moment(value.value).format(dateFormat.value)
    : noData.value
})
</script>
