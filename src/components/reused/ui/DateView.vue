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
            :icon="icon"
            :color="iconColor"
            :size="iconSize" />
        <label v-if="label" :class="labelClass">
          {{ `${label}${separator} ` }}
        </label>
      </v-col>
      <v-col :class="multiline? 'mt-0 pt-0': ''">
        <date-span
            :value-class="`${valueClass} ${icon ? 'ml-7' : ''}`"
            :value="display"
            :date-format="dateFormat"
            :no-data="noData" />
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts" setup>
import DateSpan from '@/components/reused/ui/DateSpan.vue'
import { toRefs, withDefaults } from 'vue'
import { t } from '@/plugins/i18n'
import { DATE_ONLY_VIEW_FORMAT } from '@/constants/settings'

export interface Props {
  display?: string | null
  dateFormat?: string
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
  multiline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dateFormat: DATE_ONLY_VIEW_FORMAT,
  separator: ': ',
  flexClass: 'py-1 my-1 flex-md-nowrap',
  labelClass: 'v-label v-label--active flex-md-nowrap font-weight-bold text-textcolor text-wrap mr-1',
  valueClass: 'v-label v-label--active text-textcolor text-wrap',
  iconColor: '',
  noData: t('Не указано'),
  cols: 12,
  multiline: false
})
const {
  display,
  dateFormat,
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
  xxl,
  multiline
} = toRefs(props)

</script>
