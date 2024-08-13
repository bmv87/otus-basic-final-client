<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>
        {{ $t('Подписки') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <general-error-wrapper />
        </v-col>
      </v-row>
      <subscriptions-list :user-id="userId" />
    </v-card-text>
  </v-card>

</template>

<style scoped>

</style>

<script lang="ts" setup>
import { withDefaults, toRefs } from 'vue'
import SubscriptionsList from '@/components/reused/users/SubscriptionsList.vue'

export interface Props {
  userId: string
}
const props = withDefaults(defineProps<Props>(), {})
const { userId } = toRefs(props)

</script>
