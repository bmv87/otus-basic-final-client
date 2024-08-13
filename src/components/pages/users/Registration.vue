<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col
          cols="12"
          sm="8"
          md="7"
          lg="6"
          class="text-center">
        <form @keydown.enter="focusOnContinueBtn">
          <v-card class="elevation-12" max-width="600">
            <v-toolbar>
              <v-toolbar-title>
                {{ $t('Создание учетной записи') }}
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-row v-if="!!error || isLoading">
                <v-col>
                  <v-progress-linear :active="isLoading" />
                  <general-error-wrapper />
                </v-col>
              </v-row>
              <custom-input
                  v-model="fieldLogin.value.value"
                  required
                  :readonly="isLoading"
                  :errors="errors.login"
                  :label="titles.login"
                  prepend-icon="mdi-account" />
              <custom-input
                  v-model="fieldUsername.value.value"
                  required
                  :readonly="isLoading"
                  :label="titles.username"
                  prepend-icon="mdi-account-box"
                  :errors="fieldUsername.errorMessage.value"
                  type="username" />
              <custom-input
                  v-model="fieldPassword.value.value"
                  required
                  :readonly="isLoading"
                  :errors="errors.password"
                  :label="titles.password"
                  prepend-icon="mdi-lock"
                  type="password" />
              <custom-input
                  v-model="fieldPasswordConfirmation.value.value"
                  required
                  :readonly="isLoading"
                  :label="titles.passwordConfirmation"
                  :errors="errors.passwordConfirmation"
                  prepend-icon="mdi-lock-check"
                  type="password" />

              <v-row class="my-2">
                <v-col cols="12" class="text-left">
                  <!-- focusOnBtn метод из глобального миксина -->
                  <v-checkbox
                      :model-value="approved"
                      :disabled="isLoading"
                      @update:model-value="showPolicyDialog">
                    <template v-slot:label>
                      {{ flag }}
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>
              <privacy-policy-dialog
                  v-if="policyDialog.show"
                  v-model="approved"
                  :show="policyDialog.show"
                  @update:model-value="closePolicyDialog" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <VBtnSecondary id="cancelBtn" :text="$t('Отмена')" :disabled="isLoading" @click.stop="goToLoginForm" />
              <VBtnPrimary
                  id="continueBtn"
                  :ref="toRef('continueBtn')"
                  :disabled="isLoading || !approved"
                  :text="$t('Регистрация')"
                  @click.stop="save" />
            </v-card-actions>
          </v-card>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
:deep(.caption) {
  font-size: 10pc;
}
</style>

<script lang="ts" setup>
import PrivacyPolicyDialog from '@/components/reused/common/PrivacyPolicyDialog.vue'
import CustomInput from '@/components/reused/ui/CustomInput.vue'
import GeneralErrorWrapper from '@/components/reused/common/GeneralErrorWrapper.vue'
import useRouterHelpers from '@/composable/useRouterHelpers'
import { useAccountStore } from '@/store/account'
import { UserCreateModel, UserCreateExtendedModel } from '@/interfaces/users'
import { useErrorsStore } from '@/store/errors'
import { useCurrentUserStore } from '@/store/current-user'
import { computed, onMounted, reactive, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { t } from '@/plugins/i18n'
import * as yup from 'yup'
import { storeToRefs } from 'pinia'
import { useRefs } from '@/composable/useRefs'
import { VBtn } from 'vuetify/components'

const { refs, toRef } = useRefs<{
  continueBtn: InstanceType<typeof VBtn>
}>()

const isLoading = ref(false)
const approved = ref(false)

const focusOnContinueBtn = function () {
  refs.continueBtn.$el.focus()
}
const accountStore = useAccountStore()
const currentUserStore = useCurrentUserStore()
const errorsStore = useErrorsStore()

const { isLoggedIn } = storeToRefs(accountStore)
const { currentUserId } = storeToRefs(currentUserStore)
const { error } = storeToRefs(errorsStore)
const flag = computed(() => t('Даю свое согласие на обработку моих персональных данных.'))

const { urlRootPath, goToRoute } = useRouterHelpers()

const titles = reactive({
  login: t('Логин'),
  password: t('Пароль'),
  passwordConfirmation: t('Подтверждение пароля'),
  username: t('Отображаемое имя')
})

const schema = computed(() => {
  return yup.object({
    login: yup.string().required().min(5).max(25).matches(
      /^([a-zA-Z0-9-._@+]+)$/,
      t('Недопустимые символы')
    ).label(titles.login),
    password: yup.string().min(5).max(100).required().label(titles.password),
    passwordConfirmation: yup.string().required()
      .oneOf([yup.ref('password')], t('Пароли не совпадают')).label(titles.passwordConfirmation),
    username: yup.string().required().min(5).max(50).label(titles.username)
  })
})

const { validate, errors, values } = useForm<UserCreateExtendedModel>({
  validationSchema: schema
})

const fieldLogin = useField('login')
const fieldPassword = useField('password')
const fieldPasswordConfirmation = useField('passwordConfirmation')
const fieldUsername = useField('username')

const policyDialog = reactive({
  show: false
})

const sendRegistrationRequest = async function (model: UserCreateModel) {
  try {
    isLoading.value = true
    await errorsStore.hideError()
    await accountStore.registerUser(model)
    goToLoginForm()
  }
  catch (error) {
    // сброс каптчи, если с сервера пришла ошибка
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}

const goTo = async function () {
  if (!isLoggedIn.value) {
    return
  }
  // если пользователь аутентифицирован, то перенаправляем его

  await goToRoute(`${urlRootPath.value}/users/${currentUserId.value}/profile`)
}

const goToLoginForm = async function () {
  // console.log('Пользователь отказался от регистрации.')
  await goToRoute(`${urlRootPath.value}/login`)
}

const showPolicyDialog = function (show: boolean | null) {
  approved.value = false
  policyDialog.show = !!show

  if (!show && approved.value) {
    focusOnContinueBtn()
  }
}

const closePolicyDialog = function (ok: boolean | null) {
  approved.value = !!ok
  policyDialog.show = false
  if (!ok && approved.value) {
    focusOnContinueBtn()
  }
}

const save = async function () {
  let result = await validate()
  if (!result.valid) {
    return
  }
  await sendRegistrationRequest(values)
}

onMounted(async () => {
  try {
    await errorsStore.hideError()
    await goTo()
  }
  catch (error) {
    isLoading.value = false
    console.error(error)
  }
})
</script>
