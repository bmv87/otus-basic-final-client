<template>
  <div class="d-flex align-center" style="margin-left: auto">
    <span class="text-textwithbackground">
      {{ currentUserName }}
    </span>
    <v-menu
        open-on-hover
        right
        offset-y
        close-on-content-click
        close-on-click
        nudge-width="200">
      <template v-slot:activator="{ props }">
        <v-btn
            icon="mdi-account-circle"
            size="large"
            variant="text"
            v-bind="props"
            color="secondaryiconbtn"
            density="comfortable" />
      </template>
      <!-- loggen in user's menu -->
      <v-list density="compact">
        <v-list-item
            v-for="(item, ind) in displayItems"
            :key="ind"
            link
            v-bind="item.route ? { to: item.route } : {}"
            :title="item.text"
            :prepend-icon="item.icon"
            :value="item.text"
            v-on="item.method ? { click: item.method } : {}" />
      </v-list>
    </v-menu>

  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { t } from '@/plugins/i18n'
import useCurrentUserHelpers from '@/composable/useCurrentUserHelpers'
import { useAccountStore } from '@/store/account'
import useRouterHelpers from '@/composable/useRouterHelpers'
import { storeToRefs } from 'pinia'

const accountStore = useAccountStore()

const { isLoggedIn, currentUserName } = storeToRefs(accountStore)

const { urlRootPath } = useRouterHelpers()

const { logOut } = useCurrentUserHelpers()

const items = computed(() =>
  [
    {
      id: 'exit',
      icon: 'mdi-logout-variant',
      text: t('Выйти'),
      route: null,
      method: logOut,
      show: isLoggedIn.value
    },
    {
      id: 'login',
      icon: 'mdi-login-variant',
      text: t('Войти'),
      route: {
        path: `${urlRootPath.value}/login`
      },
      method: null,
      show: !isLoggedIn.value
    },
    {
      id: 'registration',
      icon: 'mdi-account-plus',
      text: t('Регистрация'),
      route: {
        path: `${urlRootPath.value}/registration`
      },
      method: null,
      show: !isLoggedIn.value
    }
  ]
)

const displayItems = computed(() => items.value.filter(item => item.show))

</script>
