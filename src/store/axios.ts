import { defineStore } from 'pinia'

import { getQueryParamsString, getEncodedUrl } from '@/plugins/custom-helper'
import { useErrorsStore } from '@/store/errors'
import { useAccountStore } from '@/store/account'
import { AxiosRequestConfig } from 'axios'
import http from '@/plugins/axios'

export interface IRequestParams {
  url: string,
  headers?: any | null,
  settings?: AxiosRequestConfig<any> | null,
  model?: any | null,
  params?: unknown | null
}
export const useAxiosStore = defineStore('axios', {

  actions: {
    // no context as first argument, use `this` instead
    async addAdditionalRequestSettings (model: IRequestParams) {
      // если было открыто несколько вкладок и в одной из вкладок
      // пользователь вошел/вышел из системы
      // делаем для соседних вкладок актуальное состояние пользователя

      const accountStore = useAccountStore()
      accountStore.reloadLoginStatusFromLocalStorage()
      const settings = model.settings || {}
      const headers = settings.headers || {}
      if (accountStore?.token) {
        headers.token = accountStore.token
      }

      if (headers) {
        settings.headers = headers
      }
      return settings
    },
    async getAxiosRequest (model: IRequestParams) {
      try {
        const settings = await this.addAdditionalRequestSettings(model)

        model.url = `${model.url}${!model.url.includes('?') ? '?' : ''}${getQueryParamsString(model.params)}`

        return await http.get(getEncodedUrl(model.url), settings)
      }
      catch (error) {
        const errorsStore = useErrorsStore()
        await errorsStore.showAndThrowError(error)
      }
    },
    async putAxiosRequest (model: IRequestParams) {
      try {
        const settings = await this.addAdditionalRequestSettings(model)
        if (model.params)
          model.url = `${model.url}${!model.url.includes('?') ? '?' : ''}${getQueryParamsString(model.params)}`

        return await http.put(getEncodedUrl(model.url), model.model, settings)
      }
      catch (error) {
        const errorsStore = useErrorsStore()
        await errorsStore.showAndThrowError(error)
      }
    },
    async postAxiosRequest (model: IRequestParams) {
      try {
        const settings = await this.addAdditionalRequestSettings(model)
        return await http.post(getEncodedUrl(model.url), model.model, settings)
      }
      catch (error) {
        const errorsStore = useErrorsStore()
        await errorsStore.showAndThrowError(error)
      }
    },
    async deleteAxiosRequest (model: IRequestParams) {
      try {
        const settings = await this.addAdditionalRequestSettings(model)
        await http.delete(getEncodedUrl(model.url), settings)
      }
      catch (error) {
        const errorsStore = useErrorsStore()
        await errorsStore.showAndThrowError(error)
      }
    }
  }
})