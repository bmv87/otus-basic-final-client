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
      <v-col cols="12" class="d-inline-flex flex-nowrap">
        <v-icon
            v-if="icon"
            class="mr-1"
            :icon="icon"
            :color="iconColor"
            :size="iconSize" />
        <label v-if="!!label" :class="labelClass">
          {{ label + separator }}
        </label>
      </v-col>
      <v-col class="mt-0 pt-0">
        <ul class="items-list">
          <li
              v-for="(item, index) in displayValue"
              :key="index"
              :class="`${valueClass} ${icon ? 'ml-7' : ''}`">
            {{ item }}
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-col>
</template>

<style scoped>
  .items-list {
     list-style-type: none;
      margin-left: 0;
      padding-left: 0;
  }
  .value-text {
    font-size: 1rem;
  }
</style>

<script lang="ts" setup>
import { computed, toRefs, withDefaults } from 'vue'
import { t } from '@/plugins/i18n'

export interface Props {
  display?: string[]
  icon?: string
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
}
const props = withDefaults(defineProps<Props>(), {
  display: () => ([]),
  separator: ': ',
  flexClass: '',
  labelClass: 'v-label v-label--active font-weight-bold text-textcolor',
  valueClass: 'value-text text-textcolor',
  iconColor: '',
  noData: t('Не указано'),
  cols: 12
})
const {
  display,
  icon,
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
  xxl
} = toRefs(props)

const displayValue = computed(() => {
  return display.value && display.value.length
    ? display.value
    : [noData.value]
})

</script>
