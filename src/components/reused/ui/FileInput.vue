<template>
  <div>
    <btn-icon-tip
        :id="id1"
        :icon="icon"
        :icon-color="color"
        :btn-color="disabled? '0': 'transparent'"
        :disabled="disabled"
        :tip="displayTip"
        @click="onIconClick" />
    <div class="hiddenFileInput">
      <input
          :id="id2"
          ref="input"
          :multiple="multiple"
          :accept="accept"
          type="file"
          @change="onFileChange">
    </div>
  </div>
</template>

<style scoped>
  .hiddenFileInput {
    display: none;
  }
</style>

<script lang="ts" setup>
import BtnIconTip from '@/components/reused/ui/BtnIconTip.vue'
import {
  Ref, computed, ref, toRefs, withDefaults
} from 'vue'
import { t } from '@/plugins/i18n'
import { useErrorsStore } from '@/store/errors'
import { FileItem } from '@/interfaces/files'
const errorsStore = useErrorsStore()

const emits = defineEmits([
  'update:modelValue',
  'update:fileNames',
  'change'])

export interface Props {
  modelValue?: string[] | string | null
  fileNames?: string[] | string | null
  maxFileSize?: number
  accept?: string
  color?: string
  icon?: string
  tip?: string
  disabled?: boolean
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  accept: '.xls,.xlt,.xla,.xlsx,.xltx,.xlsm,.xltm,.xlam,.xlsb,.doc,.dot,.docx,.dotx,.docm,.dotm,.pdf,.tif,.tiff,.jpeg,.jpg,.bmp,.png,.csv,.sig,.xml,.rar,.zip,.7z,.txt',
  color: 'addbtn',
  icon: 'mdi-paperclip-plus',
  disabled: false,
  multiple: false,
  maxFileSize: 52428800
})

const {
  accept,
  color,
  icon,
  tip,
  disabled,
  multiple,
  maxFileSize
} = toRefs(props)

const input: Ref<HTMLInputElement | null> = ref(null)
const id1 = ref(`selectFileBtn_${Math.ceil(Math.random() * 1000000)}`)
const id2 = ref(`input_${Math.ceil(Math.random() * 1000000)}`)
const maxFileSizeError = computed((): string => {
  return t('Максимальный размер загружаемых файлов {0} Мб', [(maxFileSize.value / (1048576)).toString()])
})
const displayTip = computed((): string => {
  return tip.value
    ? tip.value
    : multiple.value
      ? t('Выбрать файлы')
      : t('Выбрать файл')
})

const validateAndGet = async function (files: FileList | null): Promise<Array<FileItem>> {
  const forms = new Array<FileItem>()
  if (!files) {
    return forms
  }
  for (const file of Array.from(files)) {
    if (file.size >= maxFileSize.value) {
      await errorsStore.showError({
        message: maxFileSizeError.value
      })
    }
    if (file.size > 0) {
      forms.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type
      })
    }
  }
  return forms
}
const onIconClick = function () {
  if (!disabled.value) {
    clear()
    if (input.value) {
      input.value.click()
    }
  }
}
const clear = function () {
  // для очистки файлового инпута перед выбором нового файла (если не чистить то не срабатывает событие change для повторного выбора того же файла)
  if (input.value) {
    (input.value as any).value = null
  }
}

const clearEmits = (): void => {
  emits('change', null)
  emits('update:modelValue', null)
  emits('update:fileNames', null)
}
const updateEmits = (files: Array<FileItem>): void => {
  const vals = multiple.value ? files : files[0]
  const names = multiple.value ? files.map(f => f.name) : files[0].name
  emits('change', vals)
  emits('update:modelValue', vals)
  emits('update:fileNames', names)
}

const onFileChange = async ($event: Event): Promise<void> => {
  const target = $event.target as HTMLInputElement
  const files = await validateAndGet(target.files)

  if (!files.length) {
    clearEmits()
  }
  else {
    updateEmits(files)
  }
}

defineExpose({
  clear
})
</script>
