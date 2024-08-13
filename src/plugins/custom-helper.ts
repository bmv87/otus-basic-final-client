import { MYME_TYPES } from '@/constants/settings'
import { env } from '@/plugins/environment-helper'
import { AxiosResponse } from 'axios'

const $env = env()

export const getPropertyValue = <T, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key]
}
export const setPropertyValue = <T, K extends keyof T>(obj: T, key: K, value: any): void => {
  obj[key] = value
}

export const downloadFile = (data: BlobPart, filename: string, mime?: string) => {
  const blob = new Blob([data], {
    type: mime || MYME_TYPES.OCTET_STREAM
  })
  const navigator = (window.navigator as any)
  if (typeof navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    navigator.msSaveBlob(blob, filename)
  }
  else {
    const blobURL = window.URL.createObjectURL(blob)
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }

    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }
}

export const getFileName = (resp?: AxiosResponse<any, any>): string => {
  const disposition = resp?.headers['content-disposition']
  const regex = /filename[*=]*UTF-8[']*(.*)[;]?/
  const matches = regex.exec(disposition)
  let filename = ''

  if (matches != null && matches[1]) {
    filename = matches[1].replace(/['"]/g, '')
  }

  return decodeURI(filename)
}

export const excludeObjectProps = (obj: any, excludePropsArray: string[] = []) => {
  const result = {
    ...obj
  }
  excludePropsArray.forEach(element => {
    // eslint-disable-next-line no-prototype-builtins
    if (result.hasOwnProperty(element)) {
      delete result[element]
    }
  })
  return result
}

export const getUrlString = (params: any, keys: string[] = [], isArray = false) => {
  const p: string = Object.keys(params).map(key => {
    let val = params[key]

    if (Object.prototype.toString.call(val) === '[object Object]' || Array.isArray(val)) {
      keys.push(Array.isArray(params) ? '' : key)

      return getUrlString(val, keys, Array.isArray(val))
    }
    else {
      let tKey = key

      if (keys.length > 0) {
        const tKeys = isArray
          ? keys
          : [...keys, key]
        tKey = tKeys.reduce((str, k) => {
          return str === ''
            ? k
            : `${str}[${k}]`
        },
        '')
      }
      val = typeof val === 'undefined' || val === null || val === 'null'
        ? ''
        : val
      return isArray
        ? `${tKey}[]=${val}`
        : `${tKey}=${val}`
    }
  }).filter(s => !!s).join('&')

  keys.pop()
  return p
}

export const getQueryParamsString = (params?: any, keys?: string[], isArray = false) => {
  const str = params
    ? `${getUrlString(params, keys, isArray)}`
    : ''
  return `${str}${str ? '&' : ''}timestamp=${new Date().getTime()}`
}

export const getEncodedUrl = (url: string): string => {
  return encodeURI(url).replace(/#/g, '%23').replace(/[+]/g, '%2B')
}

export const saveToLocalStorage = (storageName: string, state: any) => {
  localStorage[storageName] = JSON.stringify(state)
  if ($env.isDevEnv()) {
    // eslint-disable-next-line no-console
    console.log(`Local Storage ${storageName}:`, localStorage[storageName])
  }
}

export const getFromLocalStorage = (storageName: string) => {
  let retrievedState: any
  try {
    retrievedState = localStorage.getItem(storageName)
    retrievedState = JSON.parse(retrievedState)
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
  return retrievedState
}

// const globalHelpersConfigurator = (app) => {
//   if (!app.config.globalProperties.$helpers) {
//     app.config.globalProperties.$helpers = {}
//   }
//   app.config.globalProperties.$helpers = {
//     ...app.config.globalProperties.$helpers,
//     ...helpers
//   }
// }
