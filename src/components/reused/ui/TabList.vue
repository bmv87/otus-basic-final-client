<template>
  <v-row justify="center" class="fill-height mx-2 my-2">
    <v-col>
      <v-card>
        <v-toolbar
            :density="density"
            tabs>
          <v-toolbar-title>
            {{ title }}
          </v-toolbar-title>
          <v-spacer />
          <template v-slot:extension>
            <v-tabs
                :model-value="modelValue"
                :loading="loading"
                :density="density"
                @update:model-value="change">
              <v-tab
                  v-for="prop in keys"
                  :key="prop"
                  :value="prop"
                  :text="$t(tabsEnum[prop])"
                  :density="density"
                  :class="getTabClass(prop)" />
            </v-tabs>
          </template>
        </v-toolbar>
        <!-- для включения поддержки перелистывания на мобильных устройствах убрать touchless и сделать обработку reverse и touch -->
        <v-card-text>
          <v-window :model-value="modelValue">
            <template v-for="prop in keys" :key="prop">
              <v-window-item
                  v-if="prop===modelValue"
                  :disabled="prop===modelValue"
                  :value="prop"
                  :transition="false"
                  :reverse-transition="false">
                <v-row class="pa-2">
                  <v-col>
                    <general-error-wrapper />
                    <v-progress-linear :active="loading" />
                    <slot
                        :name="`tab-${prop}`"
                        :current="prop" />
                  </v-col>
                </v-row>
              </v-window-item>
            </template>
          </v-window>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
  .tab-header  {
    max-width: 280px;
  }
</style>

<script lang="ts" setup>
import GeneralErrorWrapper from '@/components/reused/common/GeneralErrorWrapper.vue'
import {
  computed, onMounted,
  toRefs,
  watch,
  withDefaults
} from 'vue'
import { t } from '@/plugins/i18n'
import { RouteLocationNamedRaw, RouteRecordName, useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const emits = defineEmits([
  'update:modelValue',
  'change'
])
type Density = null | 'default' | 'comfortable' | 'compact'

export interface Props {
  modelValue?: string | number | null | any
  tabsEnum: Record<string, string>
  defaultTab: string
  title: string
  loading?: boolean
  waitLoading?: boolean
  density?: Density
}
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  waitLoading: false,
  density: 'compact'
})
const {
  modelValue,
  tabsEnum,
  defaultTab,
  title,
  loading,
  waitLoading,
  density
} = toRefs(props)

const keys = computed(() => {
  return tabsEnum.value && !waitLoading.value
    ? Object.keys(tabsEnum.value) || []
    : []
})

const hasTab = computed(() => {
  return !!modelValue.value &&
          !!keys.value.includes(modelValue.value)
})

const change = async function (tab: any) {
  // console.log(tab)
  if (modelValue.value !== tab && waitLoading.value) {
    return
  }
  emits('update:modelValue', tab)
  emits('change', tab)
  // await nextTick()

  // console.log('change')
  // console.log(waitLoading.value)
  // console.log(`tab: ${tab}`)
  // let oldVal = modelValue.value
  // console.log(`modelValue: ${oldVal}`)

  await replaceRoute(tab)

}
const getTabClass = function (tab: string) {
  const classLength = t(tabsEnum.value[tab]).length > 40 ? 'tab-header' : ''
  const activeClass = tab === modelValue.value ? 'text-textwithbackground' : ''
  return `${classLength} ${activeClass}`.trim()
}

const replaceRoute = async function (tab: string) {
  let newRoute: RouteLocationNamedRaw = {
    name: route.name as RouteRecordName,
    replace: true,
    params: {
      ...route.params,
      tab: tab
    }
  }
  await router.replace(newRoute)
}

watch(
  // getter
  () => hasTab.value,
  // callback
  (newVal) => {
    if (!newVal) {
      if (defaultTab.value &&
          !waitLoading.value &&
          !hasTab.value) {
        // console.log('watch hasTab.value')
        // console.log(waitLoading.value)
        // console.log(newVal)
        replaceRoute(defaultTab.value)
      }
    }
  }
)
watch(
  // getter
  () => modelValue.value,
  // callback
  (newVal: string | number | null | any | undefined) => {
    if (newVal && hasTab.value && !route.params?.tab) {
      // console.log('watch props.modelValue')
      // console.log(waitLoading.value)
      replaceRoute(newVal)
    }
  }
)
onMounted(() => {
  if (defaultTab.value &&
          !waitLoading.value &&
          !hasTab.value) {
    // console.log('onMounted')
    // console.log(loading.value)
    // console.log(defaultTab.value)
    replaceRoute(defaultTab.value)
  }
})

</script>
