<template>
  <router-link
      :id="id"
      :to="to"
      class="route-link v-btn--icon">
    <v-btn
        icon
        :color="disabled? '0': btnColor"
        :elevation="elevation"
        :density="density"
        :disabled="disabled"
        class="mr-1">
      <v-icon
          :color="iconColor"
          :icon="icon"
          :size="size" />
      <v-tooltip
          activator="parent"
          :text="tip" />
    </v-btn>
  </router-link>
</template>

<style scoped>
.route-link {
  text-decoration:none;
}
</style>

<script lang="ts" setup>
import { toRefs, withDefaults } from 'vue'
import { RouteLocationRaw } from 'vue-router'

type Density = null | 'default' | 'comfortable' | 'compact'

export interface Props {
  id?: string | null
  icon?: string
  tip: string
  to: RouteLocationRaw,
  density?: Density,
  elevation?: string | number,
  iconColor?: string
  btnColor?: string
  size?: string
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  iconColor: 'primaryiconbtn',
  btnColor: 'transparent',
  size: 'default',
  elevation: '0',
  density: 'default'
})
const { icon, tip, iconColor, size, btnColor, disabled } = toRefs(props)

</script>
