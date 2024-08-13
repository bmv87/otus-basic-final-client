<template>
  <dialog-switcher
      :show="dialogProp.show"
      :title="$t('Добавить комментарий')"
      max-width="500"
      @close="close">
    <template v-slot:card>
      <v-row>
        <v-col>
          <custom-textarea
              v-model="fieldContent.value.value"
              :errors="errors.content"
              required
              :label="titles.content" />
        </v-col>
      </v-row>
    </template>
    <template v-slot:buttons>
      <VBtnPrimary
          id="saveBtn"
          :disabled="isLoading"
          :text="$t('Отправить')"
          @click.stop="save" />
    </template>
  </dialog-switcher>
</template>

<script lang="ts" setup>
import CustomTextarea from '@/components/reused/ui/CustomTextarea.vue'
import { NoteCreateModel } from '@/interfaces/notes'
import { useField, useForm } from 'vee-validate'
import { reactive, ref, Ref, toRefs } from 'vue'
import * as yup from 'yup'
import { useErrorsStore } from '@/store/errors'
import { t } from '@/plugins/i18n'
import { ValidationError } from '@/plugins/custom-errors'

const emits = defineEmits(['close'])

export type AddNoteCallback = (model: NoteCreateModel) => Promise<void>

export interface DialogProp {
  show: boolean
  callback: AddNoteCallback | null
}

interface Props {
  dialogProp: DialogProp
}

const props = defineProps<Props>()
const { dialogProp } = toRefs(props)
const errorsStore = useErrorsStore()

// validation
const titles = reactive({
  content: t('Комментарий')
})

const schema = yup.object({
  content: yup.string().required().max(2000).label(titles.content)
})

const { errors, validate, values } = useForm<NoteCreateModel>({
  validationSchema: schema
})

const fieldContent = useField('content')

const isLoading: Ref<boolean> = ref(false)

const save = async function () {
  try {
    let result = await validate()
    if (!result.valid) {
      throw new ValidationError()
    }
    isLoading.value = true
    if (dialogProp.value.callback) {
      await dialogProp.value.callback(values)
    }
    isLoading.value = false
    close()
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfUnknownError(error)
  }
}

const close = function () {
  emits('close')
}

</script>
