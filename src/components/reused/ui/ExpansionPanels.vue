<template>
  <v-expansion-panels
      v-model="panel"
      :multiple="multiple">
    <template v-for="item, index in items" :key="index">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-row align-content="center">
            <v-col v-if="item.icon" cols="1" class="d-flex justify-start">
              <v-icon :icon="item.icon" />
            </v-col>
            <v-col cols="9" class="d-flex justify-start">
              {{ item.title }}
            </v-col>
            <v-col v-if="!item.valid" cols="2" class="d-flex justify-start">
              <v-icon color="error" icon="mdi-alert-circle" />
            </v-col>
            <slot name="additional" v-bind="item" />
          </v-row>

        </v-expansion-panel-title>
        <v-expansion-panel-text eager>
          <slot :name="item.slot" v-bind="item" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </template>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import { Ref, ref, toRefs, withDefaults } from 'vue'

export interface PanelItem {
  icon: string
  title: string
  slot: string
  valid: boolean
}

export interface Props {
  items: PanelItem[]
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false
})

const { items, multiple } = toRefs(props)

const panel: Ref<any> = ref([])

</script>