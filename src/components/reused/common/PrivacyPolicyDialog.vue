<template>
  <v-dialog :model-value="show" absolute max-width="700" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-3">
        {{ $t('Политика безопасности персональных данных') }}
      </v-card-title>
      <v-card-text class="caption text-justify">
        <p>
          {{ $t('Я подтверждаю, что на все согласен.') }}
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
            :text="$t('Нет')"
            color="warning"
            variant="text"
            @click.stop="select(false)" />

        <v-spacer />
        <v-btn
            color="primary"
            variant="text"
            :text="$t('Да')"
            @click.stop="select(true)" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .v-card__text {
    padding-top: 20px !important;
    color: black !important;
  }
</style>

<script lang="ts" setup>
import { ref, toRefs, watch, withDefaults } from 'vue'
interface Props {
  modelValue: boolean
  show: boolean
}
//#region  PROPS
const prop = withDefaults(defineProps<Props>(), {
  modelValue: false,
  show: false
})
const { modelValue, show } = toRefs(prop)

//#endregion

//#region DATA
const agreement = ref(false)

//#endregion

const emits = defineEmits([
  'update:modelValue',
  'close'])
const select = function (agreement: boolean) {
  // console.log(agreement)
  emits('update:modelValue', agreement)
  emits('close')
}

//#region  WATCHERS

watch(
  // getter
  () => modelValue.value,
  // callback
  (newValue: boolean) => {
    agreement.value = newValue
  },
  // watch Options
  {
    immediate: true
  }
)
//#endregion

</script>
