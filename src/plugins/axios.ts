//
import axios from 'axios'
// import { getLocale } from '@/plugins/i18n'
import { ERROR_CODE_NETWORK } from '@/constants/settings'

const http = axios.create({})

http.interceptors.request.use(function (config) {
  // config.headers['x-locale'] = getLocale()
  return config
})

http.interceptors.response.use(response => response,
  error => {
    const response = error?.response
    if (!response) {
      error.status = ERROR_CODE_NETWORK
    }
    throw error
  })

export default http
