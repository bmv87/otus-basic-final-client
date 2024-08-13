<template>
  <v-btn
      :id="id"
      :ref="toRef('btnIconTip')"
      icon
      :color="disabled? '0': btnColor"
      :elevation="elevation"
      :density="density"
      :disabled="disabled"
      :class="bClass"
      @click.stop="click">
    <v-icon
        :color="iconColor"
        :icon="icon"
        :size="size" />
    <v-tooltip
        activator="parent"
        :text="tip" />
  </v-btn>

</template>

<script lang="ts" setup>
import { toRefs, withDefaults } from 'vue'
import { useRefs } from '@/composable/useRefs'
import { VBtn } from 'vuetify/components'

const { refs, toRef } = useRefs<{
  btnIconTip: InstanceType<typeof VBtn>
}>()

const emits = defineEmits([ 'click'])
type Density = null | 'default' | 'comfortable' | 'compact'
export interface Props {
  id?: string
  icon?: string
  tip: string
  bClass?: string
  density?: Density
  iconColor?: string
  btnColor?: string
  elevation?: string | number
  size?: string
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  btnColor: 'transparent',
  iconColor: 'primaryiconbtn',
  elevation: '0',
  density: 'default',
  size: 'default',
  bClass: 'mr-1'
})
const {
  id,
  icon,
  tip,
  bClass,
  iconColor,
  btnColor,
  density,
  size,
  disabled
} = toRefs(props)
const click = function () {
  emits('click')
}

const focus = function () {
  refs.btnIconTip.$el.focus()
}
defineExpose({
  focus
})
</script>
