<template>
  <dialog-switcher
      :show="dialogProp.show"
      :max-width="maxWidth"
      :loading="isLoading"
      :title="(dialogProp.title as string)"
      color="warning"
      @close="close">
    <template v-slot:card>
      <v-row class="pa-3">
        <v-col cols="12">
          <custom-checkbox
              v-model="fieldLocked.value.value"
              required
              :readonly="isLoading"
              :errors="errors.locked"
              :label="titles.locked"
              density="compact" />
        </v-col>
      </v-row>
    </template>
    <template v-slot:buttons>
      <VBtnPrimary
          id="continueBtn"
          :text="$t('Продолжить')"
          color="warning"
          :disabled="isLoading"
          @click.stop="continueOperation" />
    </template>
  </dialog-switcher>
</template>

<script lang="ts" setup>
import DialogSwitcher from '@/components/reused/common/DialogSwitcher.vue'
import CustomCheckbox from '@/components/reused/ui/CustomCheckbox.vue'
import {
  computed, toRefs, withDefaults,
  onMounted, Ref, ref, reactive
} from 'vue'
import { FieldContext, useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { t } from '@/plugins/i18n'
import { ValidationError } from '@/plugins/custom-errors'
import { useErrorsStore } from '@/store/errors'
import { LockStatusModel } from '@/interfaces/users'

const emits = defineEmits(['close'])

type Callback = (id: string, model: LockStatusModel) => Promise<void> | void
export interface DialogProp {
  id: string | null
  title: string | null
  locked: boolean | null
  show: boolean
  callback?: Callback | null
}

interface Props {
  dialogProp: DialogProp
  maxWidth?: string | number
}

const prop = withDefaults(defineProps<Props>(), {
  dialogProp: () => ({
    show: false,
    locked: null,
    id: null,
    title: null
  }),
  maxWidth: '600'
})

const { dialogProp } = toRefs(prop)
const errorsStore = useErrorsStore()
const isLoading: Ref<boolean> = ref(false)

const titles = reactive({
  locked: t('Заблокировать'),
  comment: t('Комментарий')
})

//#region form

const schema = computed(() => {
  return yup.object<LockStatusModel>({
    locked: yup.boolean().required().label(titles.locked)
  })
})
const { errors, validate, values } = useForm<LockStatusModel>({
  validationSchema: schema
})
const fieldLocked: FieldContext<any> = useField('locked')

//#endregion

const continueOperation = async function () {
  try {
    await errorsStore.hideError()
    const result = await validate()
    if (!result.valid) {
      throw new ValidationError()
    }

    if (dialogProp.value.callback) {
      isLoading.value = true
      await dialogProp.value.callback(dialogProp.value.id as string, values)
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

onMounted(() => {
  errorsStore.hideError()
  fieldLocked.setValue(dialogProp.value.locked)
})
</script>
