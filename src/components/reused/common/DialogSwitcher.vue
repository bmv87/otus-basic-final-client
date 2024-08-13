<template>
  <v-dialog :model-value="show" persistent :max-width="maxWidth">
    <v-card class="elevation-12">
      <v-toolbar :color="color">
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>
        <template v-slot:append>
          <btn-icon-tip
              icon="mdi-close-box-outline"
              :disabled="loading"
              icon-color="secondaryiconbtn"
              :tip="$t('Закрыть')"
              @click="close" />
        </template>
      </v-toolbar>

      <v-row v-if="(!!error || loading) && !loadingBottom" class="my-0 py-0 mx-1">
        <v-col v-if="loading" cols="12">
          <v-progress-linear :active="loading" />
        </v-col>
        <v-col v-if="!!error" class="mx-1">
          <general-error v-if="!!error" />
        </v-col>
      </v-row>
      <v-card-text class="pa-3">
        <slot name="card" />
        <v-row v-if="(!!error || loading) && loadingBottom" class="my-0 py-0 mx-1">
          <v-col v-if="loading" cols="12">
            <v-progress-linear :active="loading" />
          </v-col>
          <v-col v-if="!!error" class="mx-1">
            <general-error v-if="!!error" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <slot name="buttons" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import GeneralError from '@/components/reused/common/GeneralError.vue'
import { useErrorsStore } from '@/store/errors'
import { useInterfaceStore } from '@/store/interface'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, toRefs, withDefaults } from 'vue'

const emits = defineEmits<{
  (e: 'close'): void,
}>()

export interface Props {
  show: boolean
  loading?: boolean
  loadingBottom?: boolean
  title: string
  color?: string | undefined
  maxWidth?: string | number | undefined
}
const props = withDefaults(defineProps<Props>(), {
  show: false,
  loading: false,
  loadingBottom: false,
  title: '',
  color: 'primary',
  maxWidth: '600'
})
const {
  show,
  loading,
  loadingBottom,
  maxWidth,
  title,
  color
} = toRefs(props)

const errorsStore = useErrorsStore()
const { error } = storeToRefs(errorsStore)
const interfaceStore = useInterfaceStore()
const close = function () {
  emits('close')
}
onMounted(() => {
  errorsStore.hideError()
  interfaceStore.setDialogVisible(true)
})

onBeforeUnmount(() => {
  errorsStore.hideError()
  interfaceStore.setDialogVisible(false)
})
</script>
