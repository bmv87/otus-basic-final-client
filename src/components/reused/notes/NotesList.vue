<template>
  <v-row>
    <v-col cols="12" class="text-right">
      <v-spacer />
      <btn-icon-tip
          v-if="userId === currentUserId"
          icon="mdi-message-plus-outline"
          :tip="$t('Добавить заметку')"
          :disabled="isLoading"
          density="compact"
          size="small"
          @click="openNoteDialog" />
      <note-dialog
          v-if="noteDialogProps.show"
          :dialog-prop="noteDialogProps"
          @close="closeDialog(noteDialogProps)" />
    </v-col>
    <v-col v-if="isLoading" cols="12">
      <v-progress-linear :active="isLoading" />
    </v-col>
    <v-col>
      <v-treeview
          :loading="isLoading"
          :items="notes"
          color="primary"
          density="compact"
          item-value="noteId"
          item-title="content"
          item-children="notes"
          expand-icon="mdi-message-processing-outline"
          collapse-icon="mdi-chevron-up"
          activatable
          item-props
          return-object
          open-on-click
          transition>
        <template v-slot:title="{ item }">
          <note-info-view :note="item" @edited="getUserNotes" />
        </template>
      </v-treeview>
    </v-col>
  </v-row>

</template>

<style scoped>

</style>

<script lang="ts" setup>
import {
  withDefaults, onBeforeUnmount, Ref, onMounted, ref, toRefs, reactive, watch
} from 'vue'
import NoteInfoView from '@/components/reused/notes/NoteInfoView.vue'
import NoteDialog, { DialogProp as NoteDialogProps } from '@/components/reused/notes/NoteDialog.vue'
import { NoteCreateModel } from '@/interfaces/notes'

import { useErrorsStore } from '@/store/errors'
import { useCurrentUserStore } from '@/store/current-user'
import { useNotesStore } from '@/store/notes'
import { storeToRefs } from 'pinia'

import useCloseDialog from '@/composable/useCloseDialog'
const closeDialog = useCloseDialog()

export interface Props {
  userId: string
}
const props = withDefaults(defineProps<Props>(), {})
const { userId } = toRefs(props)
const currentUserStore = useCurrentUserStore()
const notesStore = useNotesStore()
const errorsStore = useErrorsStore()
const { notes } = storeToRefs(notesStore)
const { currentUserId } = storeToRefs(currentUserStore)
const isLoading: Ref<boolean> = ref(false)
const noteDialogProps = reactive<NoteDialogProps>({
  show: false,
  callback: null
})
const getUserNotes = async () => {
  try {
    isLoading.value = true
    await notesStore.getUserNotes(userId.value)
    isLoading.value = false
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}

const openNoteDialog = function () {
  noteDialogProps.callback = addNote
  noteDialogProps.show = true
}

const addNote = async function (model: NoteCreateModel) {
  try {
    isLoading.value = true
    await notesStore.addNote(model)
    isLoading.value = false
    getUserNotes()
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
const clearStore = async function () {
  await Promise.all(
    [
      notesStore.clearUserNotes()
    ])
}

onMounted(() => {
  errorsStore.hideError()
    .then(clearStore)
    .then(getUserNotes)
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
      getUserNotes()
    }
  }
)
</script>
