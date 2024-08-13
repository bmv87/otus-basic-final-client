<template>
  <base-layout :menu-items="menuItems" />
</template>

<script lang="ts" setup>
import BaseLayout, { MenuItem } from '@/components/reused/layouts/BaseLayout.vue'
import { useAccountStore } from '@/store/account'
import { useCurrentUserStore } from '@/store/current-user'
import useRouterHelpers from '@/composable/useRouterHelpers'
import useCurrentUserHelpers from '@/composable/useCurrentUserHelpers'
import { storeToRefs } from 'pinia'
import { t } from '@/plugins/i18n'
import { computed } from 'vue'

const accountStore = useAccountStore()
const currentUserStore = useCurrentUserStore()

const { isLoggedIn } = storeToRefs(accountStore)
const { currentUserId } = storeToRefs(currentUserStore)

const { urlRootPath } = useRouterHelpers()

const { logOut } = useCurrentUserHelpers()

const menuItems = computed((): Array<MenuItem> => [
  {
    heading: t('Личный кабинет'),
    show: true,
    list: [
      {
        id: 'exit',
        icon: 'mdi-logout-variant',
        text: t('Выйти'),
        route: '',
        method: logOut,
        show: isLoggedIn.value
      },
      {
        id: 'login',
        icon: 'mdi-login-variant',
        text: t('Войти'),
        route: `${urlRootPath.value}/login`,
        show: !isLoggedIn.value
      },
      {
        id: 'profile',
        icon: 'mdi-account-box-outline',
        text: t('Профиль'),
        route: `${urlRootPath.value}/users/${currentUserId.value}/profile`,
        show: isLoggedIn.value
      },
      {
        id: 'notes',
        icon: 'mdi-message-bulleted',
        text: t('Мои заметки'),
        route: `${urlRootPath.value}/users/${currentUserId.value}/notes`,
        show: isLoggedIn.value
      },
      {
        id: 'subscriptions',
        icon: 'mdi-account-multiple-check',
        text: t('Мои подписки'),
        route: `${urlRootPath.value}/users/${currentUserId.value}/subscriptions`,
        show: isLoggedIn.value
      }
    ]
  },
  {
    heading: t('Другие'),
    show: isLoggedIn.value,
    list: [
      {
        id: 'users',
        icon: 'mdi-account-search-outline',
        text: t('Поиск друзей'),
        route: `${urlRootPath.value}/users`,
        show: isLoggedIn.value
      }
    ]
  }
])
</script>
