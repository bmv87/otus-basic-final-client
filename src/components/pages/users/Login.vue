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
          <v-card class="elevation-12" max-width="400">
            <v-toolbar>
              <v-toolbar-title>
                {{ $t('Войти по логину') }}
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-row v-if="!!error || isLoading">
                <v-col>
                  <v-progress-linear :active="isLoading" />
                  <general-error-wrapper />
                </v-col>
              </v-row>

              <v-row>
                <v-col class="text-right">
                  <route-link-with-tip
                      :text="$t('Регистрация')"
                      :tip="$t('Регистрация')"
                      :to="{ path: `${urlRootPath}/registration` }" />
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
                  v-model="fieldPassword.value.value"
                  required
                  :readonly="isLoading"
                  :errors="errors.password"
                  :label="titles.password"
                  prepend-icon="mdi-lock"
                  type="password" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <VBtnPrimary
                  id="continueBtn"
                  :ref="toRef('continueBtn')"
                  :disabled="isLoading"
                  :text="$t('Войти')"
                  @click.stop="save" />
            </v-card-actions>
          </v-card>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
// ! компонент для входа в систему всех пользователей, кроме админов

import CustomInput from '@/components/reused/ui/CustomInput.vue'
import RouteLinkWithTip from '@/components/reused/ui/RouteLinkWithTip.vue'
import GeneralErrorWrapper from '@/components/reused/common/GeneralErrorWrapper.vue'
import useRouterHelpers from '@/composable/useRouterHelpers'
import { useAccountStore } from '@/store/account'
import { LoginRequestModel } from '@/interfaces/users'
import { useErrorsStore } from '@/store/errors'
import { useCurrentUserStore } from '@/store/current-user'
import {
  computed, onMounted, reactive, ref, watch
} from 'vue'
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

const focusOnContinueBtn = function () {
  refs.continueBtn.$el.focus()
}
const accountStore = useAccountStore()
const errorsStore = useErrorsStore()
const currentUserStore = useCurrentUserStore()

const { isLoggedIn } = storeToRefs(accountStore)
const { currentUserId } = storeToRefs(currentUserStore)
const { error } = storeToRefs(errorsStore)

const { urlRootPath, goToRoute } = useRouterHelpers()

const titles = reactive({
  login: t('Логин'),
  password: t('Пароль')
})

const schema = computed(() => {
  var r = {
    login: yup.string().required().min(4).label(titles.login),
    password: yup.string().min(4).required().label(titles.password)
  }

  return yup.object(r)
})

const { validate, errors, values } = useForm<LoginRequestModel>({
  validationSchema: schema.value
})

const fieldLogin = useField('login')
const fieldPassword = useField('password')

const logInUser = async (account: LoginRequestModel) => {
  try {
    isLoading.value = true
    await errorsStore.hideError()
    await accountStore.logInUser(account)
  }
  catch (error) {
    fieldPassword.resetField({
      value: null
    })
    await errorsStore.throwIfNotServerError(error)
  }
  finally {
    isLoading.value = false
  }
}

const routingAuthorizedUser = async () => {
  // не перенаправляем никуда, если пользователь не аутентифицирован
  if (!isLoggedIn.value || !currentUserId.value) {
    return
  }

  await goToRoute(`${urlRootPath.value}/users/${currentUserId.value}/profile`)
}

onMounted(async () => {
  try {
    await errorsStore.hideError()
    await routingAuthorizedUser()
  }
  catch (error) {
    isLoading.value = false
    console.error(error)
  }
})

const save = async function () {
  let result = await validate()
  if (!result.valid) {
    return
  }
  await logInUser(values)
}

watch(
  // getter
  () => currentUserId.value,
  // callback
  (newVal: string | null) => {
    if (newVal) {
      routingAuthorizedUser()
    }
  },
  // watch Options
  {
    immediate: true
  }
)
</script>
