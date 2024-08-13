<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>
        {{ $t('Заметки') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <general-error-wrapper />
        </v-col>
      </v-row>
      <notes-list :user-id="userId" />
    </v-card-text>
  </v-card>

</template>

<style scoped>

</style>

<script lang="ts" setup>
import { withDefaults, toRefs } from 'vue'
import NotesList from '@/components/reused/notes/NotesList.vue'

export interface Props {
  userId: string
}
const props = withDefaults(defineProps<Props>(), {})
const { userId } = toRefs(props)

</script>
