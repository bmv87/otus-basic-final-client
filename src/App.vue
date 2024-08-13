<template>
  <div>
    <router-view />
  </div>
</template>

<style scoped>
:deep(.v-label) {
  opacity: 100 !important
}
:deep(a.router-link-active), :deep(a.text-link), :deep(.static-page a) {
  color: rgb(var(--v-theme-anchor)) !important;
}
/* :deep(a:visited.router-link-active) {
  color: rgba(var(--v-theme-anchor),0.2) !important;
} */
</style>

<script lang="ts" setup>

import { useErrorsStore } from '@/store/errors'
import { useInterfaceStore } from '@/store/interface'
import { onBeforeUnmount, onMounted } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndDown } = useDisplay()
const interfaceStore = useInterfaceStore()
const errorsStore = useErrorsStore()

onMounted(() => {
  if (mdAndDown.value) {
    interfaceStore.setLeftMenuVisible(false)
  }
  errorsStore.hideError()

})
onBeforeUnmount(() => {
  errorsStore.hideError()
})
</script>
