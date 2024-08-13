<template>
  <dialog-switcher
      :show="dialogProp.show"
      :max-width="maxWidth"
      :color="color"
      :title="$t('Подтверждение операции')"
      @close="close">
    <template v-slot:card>
      <v-row v-if="dialogProp.text">
        <v-col class="v-label v-label--active text-textcolor font-weight-bold text-wrap">
          {{ dialogProp.text }}
        </v-col>
      </v-row>
      <slot
          name="additional"
          :model="dialogProp.additional" />
    </template>
    <template v-slot:buttons>
      <VBtnPrimary
          id="continueBtn"
          :color="color"
          :text="$t('Продолжить')"
          @click.stop="continueOperation" />
    </template>
  </dialog-switcher>
</template>

<script lang="ts" setup>
import DialogSwitcher from '@/components/reused/common/DialogSwitcher.vue'
import { computed, toRefs, withDefaults } from 'vue'

const emits = defineEmits(['close'])
type Callback = (args: any | null | undefined) => Promise<void>
export interface DialogProp {
  text?: string | null
  warning?: boolean
  additional?: Record<string, any> | string | number | null,
  show: boolean
  callback?: Callback | null
}
interface Props {
  dialogProp: DialogProp
  maxWidth?: string | number
}

const prop = withDefaults(defineProps<Props>(), {
  dialogProp: () => ({
    text: null,
    warning: false,
    additional: null,
    show: false
  }),
  maxWidth: '600'
})

const { dialogProp } = toRefs(prop)
const color = computed(() => {
  return dialogProp.value.warning
    ? 'warning'
    : 'primary'
})
const continueOperation = function () {
  if (dialogProp.value.callback) {
    dialogProp.value.callback(dialogProp.value.additional)
  }
  close()
}
const close = function () {
  emits('close')
}

</script>
