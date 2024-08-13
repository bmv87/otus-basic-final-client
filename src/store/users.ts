import { defineStore } from 'pinia'
import { hosts as $h } from '@/plugins/host-configurator'
import { URL_USERS } from '@/constants/urls'
import { useAxiosStore } from '@/store/axios'
import { useErrorsStore } from '@/store/errors'
import {
  UserInfo, UserShortInfo, SubscriptionInfo, LockStatusModel, UserListRequestParams
} from '@/interfaces/users'
import { Pagination } from '@/interfaces/common'

export interface IState {
  usersList: Pagination<UserShortInfo>
  currentUser: UserInfo | null
  userSubscriptions: Array<SubscriptionInfo>
}

const initUserList = () => ({
  items: [],
  totalCount: 0
})

export const useUsersStore = defineStore('users', {
  // convert to a function
  state: (): IState => {
    return {
      usersList: initUserList(),
      currentUser: null,
      userSubscriptions: []
    }
  },
  actions: {
    // mutations can now become actions, instead of `state` as first argument use `this`
    async getUserSubscriptions (userId: string) {
      const requestParams = {
        url: `${$h().getServer()}${URL_USERS}/${userId}/subscriptions`
      }
      const axiosStore = useAxiosStore()

      const resp = await axiosStore.getAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
      const data = resp?.data as Array<SubscriptionInfo>
      this.userSubscriptions = data
    },
    async getUsers (params: UserListRequestParams) {
      const requestParams = {
        url: `${$h().getServer()}${URL_USERS}`,
        params
      }
      const axiosStore = useAxiosStore()

      const resp = await axiosStore.getAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
      const data = resp?.data as Pagination<UserShortInfo>
      this.usersList = data
    },
    async getUserById (userId: string) {
      const requestParams = {
        url: `${$h().getServer()}${URL_USERS}/${userId}`
      }
      const axiosStore = useAxiosStore()

      const resp = await axiosStore.getAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
      const data = resp?.data as UserInfo
      this.currentUser = data
    },
    async editUserLockStatus (userId: string, model: LockStatusModel) {
      const requestParams = {
        url: `${$h().getServer()}${URL_USERS}/${userId}/status`,
        model
      }
      const axiosStore = useAxiosStore()

      await axiosStore.putAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
    },
    async clearUserSubscriptions () {
      this.userSubscriptions = []
    },
    async clearUsers () {
      this.usersList = initUserList()
    },
    async clearUserInfo () {
      this.currentUser = null
    }
  }
})
