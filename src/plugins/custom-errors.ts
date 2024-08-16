
import { t } from '@/plugins/i18n'
import {
  ERROR_CODE_NETWORK,
  ERROR_CODE_SERVER,
  ERROR_CODE_VALIDATION,
  ERROR_MESSAGE_SERVER,
  ERROR_MESSAGE_VALIDATION,
  ERROR_NAME_CUSTOM,
  ERROR_NAME_NETWORK,
  ERROR_NAME_SERVER,
  ERROR_NAME_VALIDATION
} from '@/constants/settings'
import { AxiosError } from 'axios'
import { MYME_TYPES } from '@/constants/settings'

import { env } from '@/plugins/environment-helper'

const $env = env()

export class CustomError extends Error {
  protected code: any

  constructor (code: any, message: string) {
    super(message)
    Object.setPrototypeOf(this, CustomError.prototype)
    this.name = ERROR_NAME_CUSTOM
    this.code = code
    this.message = message

    if ($env.isDevEnv()) {
      // eslint-disable-next-line no-console
      console.error(this.message)
    }
  }
}

export class ServerError extends CustomError {
  constructor (message: string = t(ERROR_MESSAGE_SERVER)) {
    super(ERROR_CODE_SERVER, message)
    this.name = ERROR_NAME_SERVER
  }
}

export class ValidationError extends CustomError {
  constructor (message: string = t(ERROR_MESSAGE_VALIDATION)) {
    super(ERROR_CODE_VALIDATION, message)
    this.code = ERROR_CODE_VALIDATION
    this.name = ERROR_NAME_VALIDATION
  }
}

export class NetworkError extends CustomError {
  constructor (error: any) {
    super(ERROR_CODE_VALIDATION, t(error.message))
    this.code = ERROR_CODE_NETWORK
    this.name = ERROR_NAME_NETWORK
    this.stack = error.stack
  }
}

export interface IError {
  code?: string | null,
  message: string | null,
  description?: string | null,
}

export const getErrorDescription = (error: any | AxiosError<any, any>): IError => {
  if (!error.response) {
    return {
      message: error.message
        ? t(error.message)
        : t('Непредвиденная ошибка, обратитесь к администратору')
    }
  }
  const status = parseInt(error.response.status)
  let response
  if (error.request.responseType === MYME_TYPES.ARRAYBUFFER && error?.response?.data) {
    response = JSON.parse(new TextDecoder().decode(error.response.data as ArrayBuffer))
  }
  else if (error?.response?.data) {
    response = error.response.data
  }
  let description = null
  if (response?.description) {
    description = error.response.data.description
    if (description && $env.isDevEnv()) {
      // eslint-disable-next-line no-console
      console.error(description)
    }
  }
  if (response?.message) {
    const errorInfo = {
      ...response,
      description: status === 422 || status === 500
        ? null
        : description
    }
    return errorInfo
  }

  switch (status) {
    case 422:
    case 500:
      error = {
        message: error.message
          ? error.message
          : t('Непредвиденная ошибка на сервере'),
        description
      }
      break
    case 403:
      error = {
        message: t('У клиента нет прав доступа к содержимому, поэтому сервер отказывается дать надлежащий ответ.'),
        description
      }
      break
    case 400 :
      error = {
        message: t('Сервер не понимает запрос из-за неверного синтаксиса'),
        description
      }
      break
    case 401 :
      error = {
        message: t('Для получения запрашиваемого ответа нужна аутентификация'),
        description
      }
      break
    case 404 :
      error = {
        message: t('Сервер не может найти запрашиваемый ресурс.'),
        description
      }
      break
    case 406 :
      error = {
        message: t('Тип данных не поддерживается.'),
        description
      }
      break
    default:
      error = {
        message: error.message
          ? error.message
          : t('Непредвиденная ошибка, обратитесь к администратору'),
        description
      }
  }
  return error
}

export const resolveErrorMessage = (err: string | any, defaultMessage: string): IError => {
  const error: IError = {
    message: ''
  }
  if (typeof (err) === 'string') {
    error.message = err
  }
  else if (typeof (err) === 'object' && err.message) {
    error.message = err.message
  }
  else {
    error.message = defaultMessage
  }
  return error
}
