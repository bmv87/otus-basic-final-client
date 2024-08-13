import { reactive } from 'vue'

export const useRefs = <T extends object>() => {
  const refs = reactive<T>({} as T)
  const toRef = (refName: keyof T) => (el: any) => ((refs as T)[refName as keyof T] = el)

  return {
    refs,
    toRef
  }
}

// usage
// <template>
//   <input :ref="toRef('input')" />
// </template>

// <script lang="ts" setup>
// import { onMounted } from 'vue'
// import { useRefs } from '@common/utils/useRefs'

// const { refs, toRef } = useRefs<{
//   input: InstanceType<typeof HTMLInputElement>
// }>()

// onMounted(() => {
//   refs.input.focus()
// })
// </script>