<template>
  <div>
    <div />
  </div>
</template>

<script lang="ts" setup>
import { useAccountStore } from '@/store/account'
import { watch } from 'vue'
import useCurrentUserHelpers from '@/composable/useCurrentUserHelpers'
import { storeToRefs } from 'pinia'

const { getCurrentUserInfo } = useCurrentUserHelpers()
const accountStore = useAccountStore()
const { token } = storeToRefs(accountStore)

watch(
  // getter
  () => token.value,
  // callback
  (newVal: string | null) => {
    if (newVal) {
      getCurrentUserInfo()
    }
  },
  // watch Options
  {
    immediate: true
  }
)

</script>
