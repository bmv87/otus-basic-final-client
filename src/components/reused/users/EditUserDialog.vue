<template>
  <dialog-switcher
      :show="dialogProp.show"
      :title="$t('Редактирование профиля пользователя')"
      max-width="500"
      @close="close">
    <template v-slot:card>
      <v-row>
        <v-col>
          <custom-input
              v-model="fieldUsername.value.value"
              :errors="errors.username"
              required
              :label="titles.username" />
          <custom-input
              v-model="fieldAge.value.value"
              :errors="errors.age"
              :label="titles.age"
              data-type="int" />
          <enum-combobox
              v-model="fieldGender.value.value"
              :values-enum="GENDER_ENUM"
              :errors="errors.gender"
              :label="titles.gender" />
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
import CustomInput from '@/components/reused/ui/CustomInput.vue'
import EnumCombobox from '@/components/reused/ui/EnumCombobox.vue'
import { UserEditModel, UserInfo } from '@/interfaces/users'
import { GenderEnum, GENDER_ENUM } from '@/constants/enums'
import { useField, useForm } from 'vee-validate'
import {
  Ref, watch, toRefs, reactive, ref
} from 'vue'
import * as yup from 'yup'
import { useErrorsStore } from '@/store/errors'
import { t } from '@/plugins/i18n'
import { ValidationError } from '@/plugins/custom-errors'

const emits = defineEmits(['close'])

export type EditUserCallback = (model: UserEditModel) => Promise<void>

export interface DialogProp {
  show: boolean
  user: UserInfo | null
  callback: EditUserCallback | null
}

interface Props {
  dialogProp: DialogProp
}

const props = defineProps<Props>()
const { dialogProp } = toRefs(props)
const errorsStore = useErrorsStore()

// validation
const titles = reactive({
  username: t('Отображаемое имя'),
  gender: t('Пол'),
  age: t('Возраст')
})

const schema = yup.object({
  username: yup.string().required().min(5).max(50).label(titles.username),
  gender: yup.string().nullable().oneOf([GenderEnum.FEMALE, GenderEnum.MALE]).label(titles.gender),
  age: yup.number().nullable().min(10).max(150).label(titles.age)
})

const { errors, validate, values } = useForm<UserEditModel>({
  validationSchema: schema
})

const fieldUsername = useField('username')
const fieldGender = useField('gender')
const fieldAge = useField('age')

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

watch(
  // getter
  () => dialogProp.value.user,
  // callback
  (newVal: UserInfo | null) => {
    if (newVal) {
      fieldUsername.setValue(newVal.username)
      fieldGender.setValue(newVal.gender)
      fieldAge.setValue(newVal.age)
    }
  },
  {
    immediate: true
  }
)
</script>
