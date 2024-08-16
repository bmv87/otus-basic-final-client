<template>
  <v-row>
    <v-col cols="12" class="text-right">
      <v-spacer />
      <file-input
          :disabled="isLoading"
          @change="uploadSingleFile" />
    </v-col>
    <v-col v-if="isLoading" cols="12">
      <v-progress-linear :active="isLoading" />
    </v-col>
    <v-col>

      <v-data-iterator
          :items="files"
          :loading="isLoading"
          item-value="fileId"
          :items-per-page="-1">

        <template v-slot="{ items }">
          <v-row justify="center">
            <v-col
                v-for="(file, i) in items"
                :key="i"
                cols="12">
              <v-card
                  class="mx-auto"
                  :title="file.raw.fileName">
                <template v-slot:prepend>
                  <v-icon color="primary" :icon="getIcon(file.raw.extension)" />
                </template>
                <template v-slot:append>
                  <btn-icon-tip
                      v-if="userId === currentUserId"
                      icon="mdi-download-box-outline"
                      :tip="$t('Скачать')"
                      icon-color="primary"
                      :disabled="isLoading"
                      @click="downloadFile(file.raw.fileId)" />
                  <btn-icon-tip
                      v-if="userId === currentUserId"
                      icon="mdi-close-box-outline"
                      :tip="$t('Удалить')"
                      :disabled="isLoading"
                      @click="deleteFile(file.raw.fileId)" />
                </template>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>

    </v-col>
  </v-row>

</template>

<style scoped>

</style>

<script lang="ts" setup>
import {
  withDefaults, onBeforeUnmount, Ref, onMounted, reactive, ref, toRefs, watch
} from 'vue'

import { useErrorsStore } from '@/store/errors'
import { useCurrentUserStore } from '@/store/current-user'
import { useFilesStore } from '@/store/files'
import { storeToRefs } from 'pinia'

import { FileItem } from '@/interfaces/files'

export interface Props {
  userId: string
}
const props = withDefaults(defineProps<Props>(), {})
const { userId } = toRefs(props)
const currentUserStore = useCurrentUserStore()
const filesStore = useFilesStore()
const errorsStore = useErrorsStore()
const { files } = storeToRefs(filesStore)
const { currentUserId } = storeToRefs(currentUserStore)
const isLoading: Ref<boolean> = ref(false)
const fileIcons = reactive<Record<string, string>>({
  html: 'mdi-language-html5',
  js: 'mdi-nodejs',
  json: 'mdi-code-json',
  md: 'mdi-language-markdown',
  pdf: 'mdi-file-pdf-box',
  png: 'mdi-file-image',
  ico: 'mdi-file-image',
  jpg: 'mdi-file-image',
  jpeg: 'mdi-file-image',
  txt: 'mdi-file-document-outline',
  xls: 'mdi-file-excel',
  xlsx: 'mdi-file-excel',
  docx: 'mdi-file-word',
  doc: 'mdi-file-word',
  none: 'mdi-file-question'
})
const getIcon = (extension: string) => {
  return extension
    ? fileIcons[extension.toLowerCase()] || fileIcons['none']
    : fileIcons['none']
}
const getUserFiles = async () => {
  try {
    isLoading.value = true
    await filesStore.getUserFiles(userId.value)
    isLoading.value = false
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
const uploadSingleFile = async function (file: FileItem) {
  if (!file) {
    return
  }
  try {
    isLoading.value = true
    await filesStore.uploadSingleFile2(file)
    isLoading.value = false
    getUserFiles()
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
const deleteFile = async function (fileId: string) {
  try {
    isLoading.value = true
    await filesStore.deleteFile(fileId)
    isLoading.value = false
    getUserFiles()
  }
  catch (error) {
    await errorsStore.throwIfNotServerError(error)
  }
  finally {
    isLoading.value = false
  }
}
const downloadFile = async function (fileId: string) {
  try {
    isLoading.value = true
    await filesStore.downloadFile(fileId)
  }
  catch (error) {
    await errorsStore.throwIfNotServerError(error)
  }
  finally {
    isLoading.value = false
  }
}
const clearStore = async function () {
  await Promise.all(
    [
      filesStore.clearSingleFile(),
      filesStore.clearUserFiles()
    ])
}

onMounted(() => {
  errorsStore.hideError()
    .then(clearStore)
    .then(getUserFiles)
    .catch((error: Error) => {
      isLoading.value = false
      // eslint-disable-next-line no-console
      console.error(error)
    })
})
onBeforeUnmount(() => {
  clearStore()
})

watch(
  // getter
  () => userId.value,
  // callback
  (newVal: string | null) => {
    if (newVal) {
      getUserFiles()
    }
  }
)
</script>
