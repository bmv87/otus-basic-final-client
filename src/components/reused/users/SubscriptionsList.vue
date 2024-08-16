<template>

  <v-data-iterator
      :items="userSubscriptions"
      :loading="isLoading"
      item-value="blogOwnerId"
      :items-per-page="-1">

    <template v-slot="{ items }">
      <v-row justify="center">
        <v-col
            v-for="(subscription, i) in items"
            :key="i"
            cols="12">
          <v-card
              class="mx-auto"
              :title="subscription.raw.blogOwnerName">

            <template v-slot:prepend>
              <v-avatar color="primary">
                <v-icon icon="mdi-account" />
              </v-avatar>
            </template>
            <template v-slot:append>
              <btn-icon-tip
                  icon="mdi-eye"
                  :tip="$t('Посмотреть')"
                  icon-color="primary"
                  :disabled="isLoading"
                  @click="goTo(subscription.raw.blogOwnerId)" />
              <btn-icon-tip
                  v-if="userId === currentUserId"
                  icon="mdi-minus-box-outline"
                  :tip="$t('Отменить подписку')"
                  :disabled="isLoading"
                  @click="deleteSubscription(subscription.raw.blogOwnerId)" />
            </template>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>

</template>

<style scoped>

</style>

<script lang="ts" setup>
import {
  withDefaults, onBeforeUnmount, Ref, onMounted, ref, toRefs, watch
} from 'vue'
import { useErrorsStore } from '@/store/errors'
import { useUsersStore } from '@/store/users'
import { useCurrentUserStore } from '@/store/current-user'
import { storeToRefs } from 'pinia'
import useRouterHelpers from '@/composable/useRouterHelpers'

const { urlRootPath, goToRoute } = useRouterHelpers()
export interface Props {
  userId: string
}
const props = withDefaults(defineProps<Props>(), {})
const { userId } = toRefs(props)
const errorsStore = useErrorsStore()
const usersStore = useUsersStore()
const currentUserStore = useCurrentUserStore()
const { userSubscriptions } = storeToRefs(usersStore)
const { currentUserId } = storeToRefs(currentUserStore)
const isLoading: Ref<boolean> = ref(false)

const getUserSubscriptions = async () => {
  try {
    isLoading.value = true
    await usersStore.getUserSubscriptions(userId.value)
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
    getUserSubscriptions()
  }
  catch (error) {
    isLoading.value = false
    await errorsStore.throwIfNotServerError(error)
  }
}
const clearStore = async function () {
  await Promise.all(
    [
      usersStore.clearUserSubscriptions()
    ])
}
const goTo = async function (blogOwnerId: string) {
  await goToRoute(`${urlRootPath.value}/users/${blogOwnerId}/profile`)
  // window.location.reload()
}

onMounted(() => {
  errorsStore.hideError()
    .then(clearStore)
    .then(getUserSubscriptions)
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
      getUserSubscriptions()
    }
  }
)
</script>
