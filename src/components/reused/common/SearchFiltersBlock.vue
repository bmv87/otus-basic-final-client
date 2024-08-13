<template>
  <expansion-panels
      :items="panelItems"
      multiple>
    <template v-slot:params>
      <v-row class="px-3 py-0 my-0">
        <slot name="params" />
        <v-col
            class="text-left pr-2"
            align-self="center">
          <btn-icon-tip
              id="search"
              :ref="toRef('searchBtn')"
              icon="mdi-search-web"
              icon-color="primary"
              :disabled="loading"
              :tip="$t('Поиск')"
              @click="search" />
        </v-col>
        <slot name="buttons" />
      </v-row>
    </template>
  </expansion-panels>
</template>

<!-- <style scoped>
:deep(td.otc-table-cell) {
  /* padding-top: 10px; */
  vertical-align: top !important;
  background-color: rgb(240, 240, 240);
}
</style> -->

<script lang="ts" setup>

import { t } from '@/plugins/i18n'
import {
  computed, defineEmits, defineProps, withDefaults, toRefs
} from 'vue'
import ExpansionPanels, { PanelItem } from '@/components/reused/ui/ExpansionPanels.vue'

import { useRefs } from '@/composable/useRefs'
import BtnIconTip from '@/components/reused/ui/BtnIconTip.vue'

interface Props {
  loading?: boolean
}

const prop = withDefaults(defineProps<Props>(), {
  loading: false
})

const { loading } = toRefs(prop)

const emits = defineEmits(['search'])

const { refs, toRef } = useRefs<{
  searchBtn: InstanceType<typeof BtnIconTip>
}>()
const panelItems = computed((): PanelItem[] => {
  let items = [
    {
      icon: 'mdi-search-web',
      slot: 'params',
      title: t('Фильтры'),
      valid: true
    }
  ]

  return items
})

const search = async function () {
  emits('search')
}

const focusOnSearchBtn = async function () {
  refs.searchBtn?.focus()
}

defineExpose({
  focusOnSearchBtn
})
</script>
