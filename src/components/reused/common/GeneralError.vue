<template>
  <v-alert
      v-if="!!error"
      type="error">
    <p>
      {{ error?.message }}
    </p>
    <div v-if="!!error?.description">
      <p>
        {{ error?.description }}
      </p>
    </div>
  </v-alert>
</template>

<style scoped>
  ul {
    list-style-type: none;
  }
</style>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import { useErrorsStore } from '@/store/errors'
import { storeToRefs } from 'pinia'

const errorsStore = useErrorsStore()
const { error } = storeToRefs(errorsStore)

onBeforeUnmount(() => {
  errorsStore.hideError()
})

</script>
