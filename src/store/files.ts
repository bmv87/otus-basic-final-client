import { defineStore } from 'pinia'
import { IRequestParams, useAxiosStore } from '@/store/axios'
import { useErrorsStore } from '@/store/errors'
import { NetworkError, ServerError } from '@/plugins/custom-errors'
import { downloadFile, getFileName, getContentDispositionHeaderValue } from '@/plugins/custom-helper'
import { AxiosResponse, ResponseType } from 'axios'
import { FileItem, FileUploadingResponse, FileListItem } from '@/interfaces/files'
import { MYME_TYPES } from '@/constants/settings'
import { URL_FILES, URL_USERS } from '@/constants/urls'
import { hosts as $h } from '@/plugins/host-configurator'
import { Buffer } from 'buffer'

interface RequestModel extends IRequestParams {
  fileName?: string
}
interface IState {
  currentFile: FileUploadingResponse | null
  files: Array<FileListItem>
}

export const useFilesStore = defineStore('files', {
  state: (): IState => {
    return {
      currentFile: null,
      files: []
    }
  },
  actions: {
    async downloadFile (fileId: string) {
      const url = `${$h().getServer()}${URL_FILES}/${fileId}`

      await this.downloadFileWithSettings({
        url
      })
    },
    async getUserFiles (userId: string) {
      const requestParams = {
        url: `${$h().getServer()}${URL_USERS}/${userId}/files`
      }
      const axiosStore = useAxiosStore()

      const resp = await axiosStore.getAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
      const data = resp?.data as Array<FileListItem>
      this.files = data
    },
    async uploadSingleFile (file: FormData): Promise<FileUploadingResponse> {
      const requestParams = {
        url: `${$h().getServer()}${URL_FILES}`,
        model: file,
        settings: {
          headers: {
            'content-type': MYME_TYPES.FORM_DATA
          }
        }
      }
      const axiosStore = useAxiosStore()

      const resp = await axiosStore.postAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
      const data = resp?.data as FileUploadingResponse
      this.currentFile = data
      return data
    },
    async uploadSingleFile2 (file: FileItem) {
      const arrayBuffer = await file.file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      //       const fileData = Buffer.from(await file.file.arrayBuffer())
      // const reader = new FileReader()
      const vm = this
      // reader.readAsArrayBuffer(file.file)
      console.log(arrayBuffer)
      // console.log(fileData)

      // const rawLog = reader.result
      // console.log(rawLog)
      const requestParams = {
        url: `${$h().getServer()}${URL_FILES}`,
        model: buffer,
        settings: {
          headers: {
            'content-type': file.type,
            // 'Content-Length': file.size,
            'content-disposition': getContentDispositionHeaderValue(file.name)
          }
        }
      }
      const axiosStore = useAxiosStore()

      const resp = await axiosStore.postAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
      const data = resp?.data as FileUploadingResponse
      vm.currentFile = data
      return data

    },
    async deleteFile (fileId: string) {
      const requestParams = {
        url: `${$h().getServer()}${URL_FILES}/${fileId}`
      }
      const axiosStore = useAxiosStore()
      await axiosStore.deleteAxiosRequest(requestParams)
      this.clearSingleFile()
    },
    // mutations can now become actions, instead of `state` as first argument use `this`
    async downloadFileWithSettings (params: IRequestParams) {
      const model: RequestModel = {
        url: params.url,
        settings: params.settings
          ? params.settings
          : {
            responseType: MYME_TYPES.ARRAYBUFFER as ResponseType,
            headers: {
              Accept: '*'
            }
          },
        params: params.params || null
      }
      await this.download(model)
    },
    async download (model: RequestModel) {
      const errorsStore = useErrorsStore()
      let resp: AxiosResponse<any, any> | undefined
      try {
        const axiosStore = useAxiosStore()
        resp = await axiosStore.getAxiosRequest(model)
        await errorsStore.hideError()
      }
      catch (error) {
        if (!(error instanceof ServerError) &&
             !(error instanceof NetworkError)) {
          throw error
        }
        // если файл не скачивается, просто отображаем ошибку с сервера
        return
      }
      try {
        const contentType = resp?.headers['content-type']
        const filename = getFileName(resp) || model.fileName as string
        downloadFile(resp?.data, filename, contentType)
      }
      catch (error) {
        errorsStore.showAndThrowError(error)
      }
    },
    async clearSingleFile () {
      this.currentFile = null
    },
    async clearUserFiles () {
      this.files = []
    }
  }
})
