<template>
  <v-col
      :class="flexClass"
      :cols="cols"
      :md="md"
      :lg="lg"
      :sm="sm"
      :xl="xl"
      :xxl="xxl">
    <v-row>
      <v-col :cols="multiline? 12: 'auto'" class="d-inline-flex flex-nowrap">
        <v-icon
            v-if="icon"
            class="mr-1"
            :color="iconColor"
            :icon="icon"
            :size="iconSize"
            @click="iconClick" />
        <label v-if="label" :class="labelClass">
          {{ `${label}${separator} ` }}
        </label>
      </v-col>
      <v-col :class="multiline? 'mt-0 pt-0': ''">
        <span
            v-if="!to"
            :class="`${valueClass} ${icon ? 'ml-7' : ''}`"
            @click="click">
          {{ displayValue }}
        </span>
        <router-link
            v-else
            :to="{ path: to }">
          {{ displayValue }}
        </router-link>
      </v-col>
    </v-row>
  </v-col>
</template>

<style scoped>

</style>

<script lang="ts" setup>
import { computed, toRefs, withDefaults } from 'vue'
import { t } from '@/plugins/i18n'

const emits = defineEmits([
  'click',
  'click:prepend-icon'])

export interface Props {
  display?: string | number | null
  icon?: string | null
  to?: string
  label?: string
  separator?: string
  flexClass?: string
  labelClass?: string
  valueClass?: string
  iconColor?: string
  noData?: string
  cols?: string | number
  md?: string | number
  lg?: string | number
  sm?: string | number
  xl?: string | number
  xxl?: string | number
  iconSize?: string
  multiline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  separator: ': ',
  flexClass: 'py-1 my-1',
  labelClass: 'v-label v-label--active font-weight-bold text-textcolor text-wrap mr-1',
  valueClass: 'v-label v-label--active text-textcolor text-wrap',
  iconColor: '',
  noData: t('Не указано'),
  cols: 12,
  multiline: false
})
const {
  display,
  icon,
  to,
  label,
  separator,
  flexClass,
  labelClass,
  valueClass,
  iconColor,
  iconSize,
  noData,
  cols,
  md,
  lg,
  sm,
  xl,
  xxl,
  multiline
} = toRefs(props)

const click = function () {
  emits('click')
}
const iconClick = function () {
  emits('click:prepend-icon')
}
const displayValue = computed(() => {
  return display.value || noData.value
})

</script>
