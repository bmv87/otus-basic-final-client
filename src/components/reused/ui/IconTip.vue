<!-- eslint-disable vue/no-parsing-error -->
<template>
  <v-tooltip :text="tip">
    <template v-slot:activator="{ props: p }">
      <v-icon
          :id="id"
          :color="iconColor"
          :icon="icon"
          :size="size"
          :class="iClass"
          v-bind="p" />
    </template>
  </v-tooltip>
</template>

<script lang="ts" setup>
import { toRefs, withDefaults } from 'vue'

export interface Props {
  id?: string
  icon: string
  tip: string
  iconColor?: string
  iClass?: string
  size?: string | number
}
const props = withDefaults(defineProps<Props>(), {
  iconColor: 'primaryiconbtn',
  size: 'default'
})
const { icon, tip, id, iconColor, size, iClass } = toRefs(props)

</script>
