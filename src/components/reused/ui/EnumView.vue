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
        <enum-span
            :value-class="`${valueClass} ${icon ? 'ml-7' : ''}`"
            :enum-object="enumObject"
            :value="display"
            :no-data="noData" />
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts" setup>
import EnumSpan from '@/components/reused/ui/EnumSpan.vue'
import { toRefs, withDefaults } from 'vue'
import { t } from '@/plugins/i18n'

export interface Props {
  display?: string | null
  enumObject: Record<string, string>
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
