<template>
  <general-error v-if="!!error && !dialogVisible" />
</template>

<script lang="ts" setup>
import GeneralError from '@/components/reused/common/GeneralError.vue'
import { useErrorsStore } from '@/store/errors'
import { useInterfaceStore } from '@/store/interface'
import { storeToRefs } from 'pinia'

const errorsStore = useErrorsStore()
const { error } = storeToRefs(errorsStore)
const interfaceStore = useInterfaceStore()
const { dialogVisible } = storeToRefs(interfaceStore)

</script>
