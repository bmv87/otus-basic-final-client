<template>
  <v-row v-if="!user">
    <v-col cols="12">
      <general-error-wrapper />
    </v-col>
  </v-row>
  <v-card
      v-if="!!user"
      class="mx-auto"
      :subtitle="user.login"
      :title="user.username">
    <template v-slot:prepend>
      <v-avatar color="primary">
        <v-icon icon="mdi-account" />
      </v-avatar>
    </template>
    <template v-slot:append>
      <btn-icon-tip
          v-if="userId === currentUserId"
          icon="mdi-account-edit-outline"
          :tip="$t('Редактировать данные профиля')"
          :disabled="isLoading"
          icon-color="primary"
          @click="openEditUserDialog" />
      <icon-tip
          :icon="user.locked
            ? 'mdi-lock'
            : 'mdi-lock-open'"
          :icon-color="user.locked
            ? 'error'
            : 'success'"
          :tip="$t('Текущий статус: {0}', [ $t(user.locked
            ? 'Заблокирован'
            : 'Активный') ] )" />
      <edit-user-dialog
          v-if="editUserDialogProps.show"
          :dialog-prop="editUserDialogProps"
          @close="closeDialog(editUserDialogProps)" />
    </template>
    <v-card-text>
      <v-row>
        <v-col>
          <v-row class="text-left px-4">
            <enum-view
                v-if="user.role"
                :enum-object="ROLE_ENUM"
                :display="user.role"
                md="6"
                lg="4"
                :label="$t('Роль')" />
            <enum-view
                v-if="user.gender"
                :enum-object="GENDER_ENUM"
                :display="user.gender"
                md="6"
                lg="4"
                :label="$t('Пол')" />
            <text-view
                v-if="user.age"
                :display="user.age"
                md="6"
                lg="4"
                :label="$t('Возраст')" />
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>

    <v-row>
      <v-col>
        <tab-list
            v-model="currentTab"
            :tabs-enum="tabs"
            :title="''"
            :loading="isLoading"
            :default-tab="defaultTab">
          <template v-slot:[`tab-${UserTabsEnum.NOTES}`]>
            <notes-list :user-id="userId" />
          </template>
          <template v-slot:[`tab-${UserTabsEnum.SUBSCRIPTIONS}`]>
            <subscriptions-list :user-id="userId" />
          </template>
        </tab-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import {
  withDefaults, reactive, onBeforeUnmount, Ref,
  onMounted, ref, toRefs, computed, watch
} from 'vue'
import IconTip from '@/components/reused/ui/IconTip.vue'
import TabList from '@/components/reused/ui/TabList.vue'
import NotesList from '@/components/reused/notes/NotesList.vue'
import SubscriptionsList from '@/components/reused/users/SubscriptionsList.vue'
import EditUserDialog, { DialogProp as EditUserDialogProps } from '@/components/reused/users/EditUserDialog.vue'
import { ROLE_ENUM, GENDER_ENUM, UserTabsEnum, USER_TABS_ENUM } from '@/constants/enums'
import { useErrorsStore } from '@/store/errors'
import { useCurrentUserStore } from '@/store/current-user'
import { useUsersStore } from '@/store/users'
import { storeToRefs } from 'pinia'
import { UserEditModel } from '@/interfaces/users'
import useCloseDialog from '@/composable/useCloseDialog'

const closeDialog = useCloseDialog()

export interface Props {
  userId: string
}
const props = withDefaults(defineProps<Props>(), {})
const { userId } = toRefs(props)
const errorsStore = useErrorsStore()
const usersStore = useUsersStore()
const currentUserStore = useCurrentUserStore()

const { currentUser: user } = storeToRefs(usersStore)
const { currentUserId } = storeToRefs(currentUserStore)

const editUserDialogProps = reactive<EditUserDialogProps>({
  user: null,
  show: false,
  callback: null
})
const defaultTab: Ref<string> = ref(UserTabsEnum.NOTES)
const currentTab: Ref<string> = ref(defaultTab.value)
const isLoading: Ref<boolean> = ref(false)

const tabs = computed((): Record<string, string> => {
  let tabs = {
    ...USER_TABS_ENUM
  }

  return tabs
})
const openEditUserDialog = function () {
  editUserDialogProps.user = user.value
  editUserDialogProps.callback = editUser
  editUserDialogProps.show = true
}
const getUserById = async () => {
  try {
    isLoading.value = true
    await usersStore.getUserById(userId.value)
    isLoading.value = false
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
//TODO: open dialog
const editUser = async (model: UserEditModel) => {
  try {
    isLoading.value = true
    await currentUserStore.editCurrentUserInfo(model)
    isLoading.value = false
    getUserById()
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
const clearStore = async function () {
  await Promise.all(
    [
      usersStore.clearUserInfo()
    ])
}

onMounted(() => {
  errorsStore.hideError()
    .then(clearStore)
    .then(getUserById)
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
      getUserById()
    }
  }
)
</script>
