<template>
  <v-card class="elevation-5">
    <template v-slot:title>
      {{ item.header }}
    </template>
    <template v-slot:append>
      <v-icon :icon="item.icon" />
    </template>
    <v-divider />
    <v-card-text>
      <v-list>
        <v-list-item
            v-for="(link, index) in links"
            :key="index"
            link
            v-bind="link.route
              ? { to: link.route }
              : {}"
            v-on="link.method
              ? { click: link.method }
              : {}">
          <v-row>
            <v-col class="text-left" cols="10">
              <v-list-item-title>
                {{ link.name }}
                <v-tooltip
                    activator="parent"
                    :text="link.name" />
              </v-list-item-title>
            </v-col>
            <v-col class="text-right mr-3 ml-1" sm="1">
              <v-avatar v-if="link.count" color="primary" size="25">
                <span class="text-textwithbackground">
                  {{ link.count }}
                </span>
              </v-avatar>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>
:deep(.v-list-item__title) {
  white-space: pre-wrap !important;
}
</style>

<script lang="ts" setup>
import { computed, toRefs } from 'vue'

export interface Link {
  id: string
  name: string
  route: string
  show: boolean,
  count?: number | undefined
  method?: Function | Promise<void>
}

export interface Item {
  header: string
  icon: string
  links: Link[]
}

export interface Props {
  item: Item
}

const prop = defineProps<Props>()

const { item } = toRefs(prop)
const links = computed(() => item.value.links.filter(l => l.show))

</script>
