<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>
        {{ $t('Поиск друзей') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row class="px-2 pt-2">
        <v-col>
          <search-filters-block
              :ref="toRef('searchBlock')"
              :loading="isLoading"
              @search="search">
            <template v-slot:params>
              <v-col
                  cols="12"
                  sm="10"
                  md="5"
                  lg="4">
                <custom-input
                    v-model="filterParams.username"
                    clearable
                    :label="$t('Имя пользователя')"
                    hide-details
                    @keyup:enter="focusOnSearchBtn" />
              </v-col>
              <v-col
                  cols="12"
                  sm="10"
                  md="5"
                  lg="4">
                <enum-combobox
                    v-model="filterParams.gender"
                    :values-enum="GENDER_ENUM"
                    clearable
                    :label="$t('Пол')"
                    hide-details
                    @keyup:enter="focusOnSearchBtn" />
              </v-col>
              <v-col
                  cols="12"
                  sm="10"
                  md="5"
                  lg="4">
                <custom-input
                    v-model="filterParams.age"
                    clearable
                    :label="$t('Возраст')"
                    hide-details
                    data-type="int"
                    @keyup:enter="focusOnSearchBtn" />
              </v-col>
            </template>
          </search-filters-block>
        </v-col>
      </v-row>
      <v-data-iterator
          :items="users"
          :loading="isLoading"
          item-value="userId"
          :items-per-page="itemsPerPage"
          :page="page">

        <template v-slot="{ items }">
          <v-row justify="center">
            <v-col
                v-for="(user, i) in items"
                :key="i"
                cols="12">
              <v-card
                  class="mx-auto"
                  :title="user.raw.username"
                  :subtitle="$t(user.raw.subscribed?'Вы подписаны':'')">
                <template v-slot:prepend>
                  <v-avatar color="primary">
                    <v-icon icon="mdi-account" />
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <btn-icon-tip
                      v-if="!user.raw.subscribed && !user.raw.locked"
                      icon="mdi-plus-box-outline"
                      :tip="$t('Подписаться')"
                      icon-color="primary"
                      :disabled="isLoading"
                      @click="addSubscription(user.raw.userId)" />
                  <route-btn-tip
                      v-if="user.raw.subscribed"
                      icon="mdi-eye"
                      :tip="$t('Посмотреть')"
                      icon-color="primary"
                      :disabled="isLoading"
                      :to="{ path: `${urlRootPath}/users/${user.raw.userId}/profile` }" />
                  <btn-icon-tip
                      v-if="user.raw.subscribed"
                      icon="mdi-minus-box-outline"
                      :tip="$t('Отменить подписку')"
                      :disabled="isLoading"
                      @click="deleteSubscription(user.raw.userId)" />
                  <btn-icon-tip
                      v-if="isAdmin"
                      :icon="user.raw.locked
                        ? 'mdi-lock'
                        : 'mdi-lock-open'"
                      :icon-color="user.raw.locked
                        ? 'error'
                        : 'success'"
                      :tip="$t('Изменить статус. Текущий: {0}', [ $t(user.raw.locked
                        ? 'Заблокирован'
                        : 'Активный') ] )"
                      :disabled="isLoading"
                      @click="openLockStatusDialog(user.raw.userId,
                                                   user.raw.locked)" />

                </template>
              </v-card>
            </v-col>
          </v-row>
        </template>
        <template v-slot:footer>
          <v-pagination v-model="page" :length="pages" />
        </template>
      </v-data-iterator>
      <locking-dialog
          v-if="lockingDialogProps.show"
          :dialog-prop="lockingDialogProps"
          @close="closeDialog(lockingDialogProps)" />
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>

<script lang="ts" setup>
import {
  onBeforeUnmount, Ref, onMounted, ref, reactive, computed, watch
} from 'vue'
import { useErrorsStore } from '@/store/errors'
import { useUsersStore } from '@/store/users'
import { useCurrentUserStore } from '@/store/current-user'
import { useAccountStore } from '@/store/account'
import { storeToRefs } from 'pinia'
import useRouterHelpers from '@/composable/useRouterHelpers'
import LockingDialog, { DialogProp as LockingDialogProps } from '@/components/reused/common/LockingDialog.vue'
import SearchFiltersBlock from '@/components/reused/common/SearchFiltersBlock.vue'

import useCloseDialog from '@/composable/useCloseDialog'
import { LockStatusModel, UserListRequestParams, UserShortInfo } from '@/interfaces/users'
import { GENDER_ENUM } from '@/constants/enums'
import { useRefs } from '@/composable/useRefs'

import { t } from '@/plugins/i18n'

const closeDialog = useCloseDialog()
const { urlRootPath } = useRouterHelpers()
const { refs, toRef } = useRefs<{
  searchBlock: InstanceType<typeof SearchFiltersBlock>
}>()

const accountStore = useAccountStore()
const errorsStore = useErrorsStore()
const usersStore = useUsersStore()
const currentUserStore = useCurrentUserStore()
const { isAdmin } = storeToRefs(accountStore)
const { usersList } = storeToRefs(usersStore)
const isLoading: Ref<boolean> = ref(false)
const itemsPerPage: Ref<number> = ref(5)
const page: Ref<number> = ref(1)

const filterParams = reactive<UserListRequestParams>({
  username: null,
  gender: null,
  age: null
})
const lockingDialogProps = reactive<LockingDialogProps>({
  show: false,
  id: null,
  locked: null,
  callback: null,
  title: null
})
const pages = computed((): number => {
  if (!totalCount.value) {
    return 0
  }
  if (itemsPerPage.value === -1 ||
          itemsPerPage.value >= totalCount.value) {
    return 1
  }
  return Math.ceil(
    totalCount.value / itemsPerPage.value
  )
})
const totalCount = computed((): number => {
  return usersList.value.totalCount
})
const users = computed((): Array<UserShortInfo> => {
  return usersList.value.items || []
})
const getUsers = async () => {
  try {
    isLoading.value = true
    let params = {
      ...filterParams,
      page: page.value,
      limit: itemsPerPage.value
    }
    await usersStore.getUsers(params)
    isLoading.value = false
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
const deleteSubscription = async (blogOwnerId: string) => {
  try {
    isLoading.value = true
    await currentUserStore.deleteSubscription(blogOwnerId)
    isLoading.value = false
    getUsers()
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
const addSubscription = async (blogOwnerId: string) => {
  try {
    isLoading.value = true
    await currentUserStore.addSubscription(blogOwnerId)
    isLoading.value = false
    getUsers()
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
const openLockStatusDialog = function (userId: string, locked: boolean) {
  lockingDialogProps.id = userId
  lockingDialogProps.locked = !locked
  lockingDialogProps.title = t('Блокировка Пользователя')
  lockingDialogProps.callback = editUserLockStatus
  lockingDialogProps.show = true
}
const editUserLockStatus = async function (userId: string, status: LockStatusModel) {
  try {
    isLoading.value = true
    await usersStore.editUserLockStatus(userId, status)
    isLoading.value = false
    getUsers()
  }
  finally {
    isLoading.value = false
  }
}
const clearStore = async function () {
  await Promise.all(
    [
      usersStore.clearUserSubscriptions()
    ])
}
const search = async function () {
  page.value = 1
  await getUsers()
}
const focusOnSearchBtn = async function () {
  await refs.searchBlock?.focusOnSearchBtn()
}
onMounted(() => {
  errorsStore.hideError()
    .then(clearStore)
    .then(getUsers)
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
  () => page.value,
  // callback
  (newVal: number, oldVal: number) => {
    if (newVal !== oldVal) {
      getUsers()
    }
  }
)
</script>
