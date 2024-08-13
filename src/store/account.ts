import { defineStore } from 'pinia'
import { hosts as $h } from '@/plugins/host-configurator'
import { getFromLocalStorage, saveToLocalStorage } from '@/plugins/custom-helper'
import { LOCAL_STORE_NAMES } from '@/constants/settings'
import { RoleEnum } from '@/constants/enums'
import { URL_USERS } from '@/constants/urls'
import { UserCreateModel, LoginRequestModel, LoginResponseModel } from '@/interfaces/users'
import { IRequestParams, useAxiosStore } from '@/store/axios'

interface IAuthResponse {
  token: string | null
  role: RoleEnum | null
}

interface IState extends IAuthResponse {
  isLoggedIn: boolean
  username: string | null
}

interface IEditableProp {
  name: 'username' | 'role' | 'token'
  value: any | null
}

export const useAccountStore = defineStore('account', {
  // convert to a function
  state: (): IState => {
    const fromLocalStorage = getFromLocalStorage(LOCAL_STORE_NAMES.USER) || {}
    if (!fromLocalStorage.username && fromLocalStorage.token) {
      console.error('init state: token not empty, but username empty')
    }
    return {
      isLoggedIn: fromLocalStorage.isLoggedIn || false,
      token: fromLocalStorage.token || null,
      role: fromLocalStorage.role || null,
      username: fromLocalStorage.username || null
    }
  },
  getters: {
    // firstName getter removed, no longer needed
    currentUserName: (state): string => state.username?.toUpperCase() || '',
    isRegistered: (state): boolean => !!state.role,
    isAdmin: (state): boolean => state.role === RoleEnum.ADMIN
  },
  actions: {
    // no context as first argument, use `this` instead
    async registerUser (model: UserCreateModel) {
      const requestParams: IRequestParams = {
        url: `${$h().getServer()}${URL_USERS}`,
        model: model
      }
      const axiosStore = useAxiosStore()
      await axiosStore.postAxiosRequest(requestParams)
    },
    // mutations can now become actions, instead of `state` as first argument use `this`
    async logInUser (model: LoginRequestModel) {
      const requestParams = {
        url: `${$h().getServer()}${URL_USERS}/login`,
        model
      }
      try {
        const axiosStore = useAxiosStore()
        const resp = await axiosStore.putAxiosRequest(requestParams)
        this.loginSuccess(resp?.data as LoginResponseModel)
      }
      catch (error) {
        await this.loginError()
        throw error
      }
    },
    async loginSuccess (auth: LoginResponseModel) {
      this.username = auth.username
      this.isLoggedIn = true
      this.token = auth.token
      this.role = auth.role
      if (!auth.username && auth.token) {
        console.error('loginSuccess: token not empty, but username empty')
      }
      saveToLocalStorage(LOCAL_STORE_NAMES.USER, {
        isLoggedIn: true,
        token: this.token,
        role: this.role,
        username: this.username
      })
    },
    async loginError () {
      this.isLoggedIn = false
      this.token = null
      this.role = null
      // saveToLocalStorage(LOCAL_STORE_NAMES.USER, {
      //   isLoggedIn: false,
      //   token: this.token,
      //   participantType: null,
      //   username: null
      // })
    },
    async setUserInfo (prop: IEditableProp) {
      this[prop.name] = prop.value
      if (!this.username && this.token) {
        console.error('setUserInfo: token not empty, but username empty')
      }
      saveToLocalStorage(LOCAL_STORE_NAMES.USER, null)
      saveToLocalStorage(LOCAL_STORE_NAMES.USER, {
        isLoggedIn: true,
        token: this.token,
        role: this.role,
        username: this.username
      })
    },
    async reloadLoginStatusFromLocalStorage () {
      const fromLocalStorage: Partial<IState> = getFromLocalStorage(LOCAL_STORE_NAMES.USER) || {}
      this.isLoggedIn = fromLocalStorage.isLoggedIn || false
      this.token = fromLocalStorage.token || null
      this.role = fromLocalStorage.role || null
      this.username = fromLocalStorage.username || null
      if (!fromLocalStorage.username && fromLocalStorage.token) {
        console.error('reloadLoginStatusFromLocalStorage: token not empty, but username empty')
      }
    },
    async logOut () {
      this.token = null
      this.role = null
      this.isLoggedIn = false
      this.username = null
      saveToLocalStorage(LOCAL_STORE_NAMES.USER, null)
    },
    // easily reset state using `$reset`
    clearUser () {
      this.$reset()
    }
  }
})
