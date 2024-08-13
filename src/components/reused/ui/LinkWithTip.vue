<template>
  <a
      :id="id"
      :href="href"
      :target="target"
      class="wb text-wrap text-link">
    {{ text }}
    <v-tooltip activator="parent" :text="tip" />
  </a>
</template>

<style scoped>
.wb {
  word-break: break-word !important;
}
a.text-link {
  color: rgb(var(--v-theme-anchor)) !important;
}
</style>

<script lang="ts" setup>
import { toRefs, withDefaults } from 'vue'

export interface Props {
  id?: string
  tip: string
  href?: string
  target?: string
  text?: string
}
const props = withDefaults(defineProps<Props>(), {
  target: '_blank'
})
const { tip, id, target, text, href } = toRefs(props)

</script>
