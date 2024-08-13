<template>
  <router-link
      :to="to"
      v-slot="{ href, navigate, isActive, isExactActive }">
    <a
        :id="id"
        :class="[ !isActive && 'router-link-active', !isExactActive && 'router-link-exact-active', 'text-wrap' ]"
        :style="{ cursor: 'pointer' }"
        :href="href"
        @click.stop="navigate">
      {{ text }}
      <v-tooltip :text="tip" activator="parent" />
    </a>
  </router-link>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export interface Props {
  id?: string
  tip: string
  to: RouteLocationRaw
  text?: string
}
const props = defineProps<Props>()
const { id, tip, to, text } = toRefs(props)

</script>
