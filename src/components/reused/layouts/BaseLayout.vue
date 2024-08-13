<template>
  <v-app>
    <v-app-bar app clipped-left color="primary" prominent>
      <template v-slot:prepend>
        <v-app-bar-nav-icon
            color="secondaryiconbtn"
            @click.stop="setLeftMenuVisible(!leftMenuVisible)" />
      </template>

      <!-- <a :href="'/'" class="main-link">
        <img
            :height="smAndDown ? 30 : 35"
            class="ml-2 clickable"
            :src="'/public/logo.png'">
      </a> -->

      <v-app-bar-title :style="smAndUp ? '' : 'min-width: 72px'" class="ml-0 pl-3">
        <a v-if="!smAndDown" :href="'/'" class="ml-4 main-link">
          {{ segmentName }}
        </a>
      </v-app-bar-title>
      <!-- <v-spacer /> -->
      <template v-slot:append>
        <header-actions />
      </template>
    </v-app-bar>

    <v-navigation-drawer
        :model-value="leftMenuVisible"
        location="left"
        permanent
        @input="setLeftMenuVisible">
      <v-list v-model="data.selection" density="compact" nav>
        <template v-for="(group, ndx) in menuItems" :key="ndx">
          <v-list-item
              v-if="group.heading && group.show"
              :subtitle="group.heading && group.show ? group.heading : undefined" />
          <v-list-item
              v-for="(item, ind) in group.list.filter((i) => i.show)"
              :key="ind + item.text"
              link
              v-bind="item.route ? { to: { path: item.route } } : {}"
              :title="item.text"
              :prepend-icon="item.icon"
              :value="item.text"
              v-on="item.method ? { click: item.method } : {}" />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main app class="pt-4 mt-15">
      <v-container fluid fill-height class="mb-4 pt-0">
        <settings-loader />
        <router-view />
      </v-container>
    </v-main>
    <v-footer v-if="footerVisible" absolute app>
      <footer-content />
    </v-footer>
  </v-app>
</template>

<style scoped>
:deep(.main-link) {
  color: rgb(var(--v-theme-textwithbackground));
  text-decoration: none;
}
/*
:deep(.nav-drawer) {
  max-height: 100% !important;
} */

:deep(.v-list-item-title) {
  white-space: pre-wrap !important;
}
</style>

<script lang="ts" setup>
import SettingsLoader from '@/components/reused/layouts/SettingsLoader.vue'
import { computed, reactive, toRefs, watchEffect } from 'vue'
import HeaderActions from '@/components/reused/layouts/HeaderActions.vue'
import FooterContent from '@/components/reused/layouts/FooterContent.vue'
import { useDisplay } from 'vuetify'
import { useInterfaceStore } from '@/store/interface'
import { storeToRefs } from 'pinia'
type Callback = (emails: string[]) => Promise<void> | void

interface LinkItem {
  id: string;
  icon: string;
  text: string;
  route?: string;
  method?: Callback;
  show: boolean;
}

export interface MenuItem {
  heading?: string | number;
  show: boolean;
  list: Array<LinkItem>;
}
interface Props {
  menuItems: Array<MenuItem>;
}
const props = defineProps<Props>()
const { menuItems } = toRefs(props)
const { smAndUp, smAndDown } = useDisplay()
const interfaceStore = useInterfaceStore()
const { footerVisible, leftMenuVisible } = storeToRefs(interfaceStore)

const setLeftMenuVisible = interfaceStore.setLeftMenuVisible

const data = reactive({
  selection: null
})

const segmentName = computed(() => {
  return 'Блог.ру'
})

const segmentShortName = computed(() => {
  return 'Блог.ру'
})

watchEffect(() => (document.title = segmentShortName.value || ''))
</script>
