<template>
  <v-card density="compact" class="ma-2 pa-0" color="transparent" :title="note.username">
    <template v-slot:prepend>
      <v-icon icon="mdi-account" />
    </template>
    <template v-slot:subtitle>
      <date-span :value="note.created" :date-format="DATE_TIME_HM_VIEW_FORMAT" />
    </template>
    <v-card-text class="ma-0 py-0 px-2">
      <v-row class="ma-0 pa-0">
        <v-col v-if="isLoading" />
        <v-progress-linear :active="isLoading" />
        <custom-textarea
            v-if="!isLoading"
            :model-value="note.content"
            readonly
            :label="''"
            density="compact"
            variant="outlined" />
      </v-row>
      <v-card-actions class="ma-0 pa-0">
        <btn-icon-tip
            icon="mdi-message-plus-outline"
            :tip="$t('Оставить комментарий')"
            :disabled="isLoading"
            density="compact"
            size="small"
            icon-color="primary"
            @click="openCommentDialog" />
        <span>
          {{ `(${commentsCount})` }}
        </span>
        <btn-icon-tip
            v-if="note.userId === currentUserId"
            icon="mdi-forum-remove-outline"
            :tip="$t('Удалить')"
            :disabled="isLoading"
            density="compact"
            size="small"
            @click="deleteNote" />

        <v-spacer />
        <btn-icon-tip
            icon="mdi-thumb-up-outline"
            :tip="$t('Нравится ' + likeCount)"
            :disabled="isLoading || note.userId === currentUserId"
            density="compact"
            size="small"
            icon-color="primary"
            @click="like" />
        <span>
          {{ `(${likeCount})` }}
        </span>
        <btn-icon-tip
            icon="mdi-thumb-down-outline"
            :tip="$t('Не нравится ' + dislikeCount)"
            :disabled="isLoading || note.userId === currentUserId"
            density="compact"
            size="small"
            @click="dislike" />
        <span>
          {{ `(${dislikeCount})` }}
        </span>
        <note-dialog
            v-if="noteDialogProps.show"
            :dialog-prop="noteDialogProps"
            @close="closeDialog(noteDialogProps)" />
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>

<script lang="ts" setup>
import { GradeEnum } from '@/constants/enums'

import {
  computed, ref, withDefaults, toRefs, reactive, Ref
} from 'vue'
import BtnIconTip from '@/components/reused/ui/BtnIconTip.vue'
import DateSpan from '@/components/reused/ui/DateSpan.vue'
import CustomTextarea from '@/components/reused/ui/CustomTextarea.vue'
import NoteDialog, { DialogProp as NoteDialogProps } from '@/components/reused/notes/NoteDialog.vue'
import { DATE_TIME_HM_VIEW_FORMAT } from '@/constants/settings'

import { useErrorsStore } from '@/store/errors'
import { useNotesStore } from '@/store/notes'
import { useCurrentUserStore } from '@/store/current-user'
import { GradeCreateModel, NoteCreateModel, NoteInfo } from '@/interfaces/notes'
import { storeToRefs } from 'pinia'
import useCloseDialog from '@/composable/useCloseDialog'

const closeDialog = useCloseDialog()
const emits = defineEmits(['edited'])

export interface Props {
  note: NoteInfo;
}
const props = withDefaults(defineProps<Props>(), {})
const { note } = toRefs(props)

const currentUserStore = useCurrentUserStore()
const errorsStore = useErrorsStore()
const notesStore = useNotesStore()
const { currentUserId } = storeToRefs(currentUserStore)

const isLoading: Ref<boolean> = ref(false)

const noteDialogProps = reactive<NoteDialogProps>({
  show: false,
  callback: null
})
const likeCount = computed((): number => {
  if (!note.value.grades.length) {
    return 0
  }
  return note.value.grades.filter(g => g.gradeType === GradeEnum.LIKE).length
})

const dislikeCount = computed((): number => {
  if (!note.value.grades.length) {
    return 0
  }

  return note.value.grades.filter(g => g.gradeType === GradeEnum.DISLIKE).length
})
const commentsCount = computed((): number => {
  return note.value.notes.length || 0
})

const openCommentDialog = function () {
  noteDialogProps.callback = addCommentForNote
  noteDialogProps.show = true
}
const edited = function () {
  emits('edited')
}

const like = async () => {
  await addGrade(GradeEnum.LIKE)
}
const dislike = async () => {
  await addGrade(GradeEnum.DISLIKE)
}
const addGrade = async (gradeType: GradeEnum) => {
  try {
    isLoading.value = true
    let grade = {
      gradeType
    } as GradeCreateModel
    await notesStore.addGrade(note.value.noteId, grade)
    isLoading.value = false
    edited()
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
const deleteNote = async () => {
  try {
    isLoading.value = true

    await notesStore.deleteNote(note.value.noteId)
    isLoading.value = false
    edited()
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
const addCommentForNote = async function (model: NoteCreateModel) {
  try {
    isLoading.value = true
    await notesStore.addCommentForNote(note.value.noteId, model)
    isLoading.value = false
    edited()
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
</script>
