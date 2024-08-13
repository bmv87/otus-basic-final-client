import { defineStore } from 'pinia'
import { IError, NetworkError, ServerError, getErrorDescription } from '@/plugins/custom-errors'
import { env } from '@/plugins/environment-helper'
import { t } from '@/plugins/i18n'
import {
  ERROR_CODE_NETWORK,
  ERROR_NAME_NETWORK,
  ERROR_NAME_SERVER,
  ERROR_NAME_VALIDATION
} from '@/constants/settings'

const $env = env()
interface IState {
  error?: Partial<IError> | null
}

export const useErrorsStore = defineStore('errors', {
  // convert to a function
  state: (): IState => {
    return {
      error: null
    }
  },
  actions: {
    // no context as first argument, use `this` instead
    async showError (error: IError) {
      this.error = error
    },
    // mutations can now become actions, instead of `state` as first argument use `this`
    async showAndThrowError (error: any) {
      const errorModel = getErrorDescription(error)
      if ($env.isDevEnv()) {
        // eslint-disable-next-line no-console
        console.log(errorModel)
      }
      await this.showError(errorModel)

      if (error?.status === ERROR_CODE_NETWORK) {
        throw new NetworkError(error)
      }
      throw new ServerError()
    },
    async hideError () {
      this.error = null
    },
    // easily reset state using `$reset`
    reset () {
      this.$reset()
    },
    async throwIfUnknownError (error: any): Promise<void> {
      if (error.name !== ERROR_NAME_VALIDATION &&
          error.name !== ERROR_NAME_SERVER &&
          error.name !== ERROR_NAME_NETWORK) {
        throw error
      }
      if (error.name === ERROR_NAME_VALIDATION) {
        // отображаем ошибку
        await this.showError({
          message: t(error.message)
        })
      }
    },
    async throwIfNotValidationError (error: any): Promise<void> {
      // если не ошибка валидации, то пробрасываем
      if (error.name !== ERROR_NAME_VALIDATION) {
        throw error
      }
      // отображаем ошибку
      await this.showError({
        message: t(error.message)
      })
    },
    async throwIfNotServerError (error: any): Promise<void> {
      if (error.name !== ERROR_NAME_SERVER &&
          error.name !== ERROR_NAME_NETWORK) {
        throw error
      }
    }
  }
})
