import { defineStore } from 'pinia'
import { hosts as $h } from '@/plugins/host-configurator'
import { URL_USERS, URL_SUBSCRIPTIONS } from '@/constants/urls'
import { IRequestParams, useAxiosStore } from '@/store/axios'
import { useErrorsStore } from '@/store/errors'
import { useAccountStore } from '@/store/account'
import { UserInfo, UserEditModel } from '@/interfaces/users'

interface IState {
  user?: UserInfo | null
}

export const useCurrentUserStore = defineStore('current-user', {
  // convert to a function
  state: (): IState => {
    return {
      user: null
    }
  },
  getters: {
    // firstName getter removed, no longer needed
    currentUserId: (state): string | null => state.user?.userId || null,
    isLocked: (state): boolean => !!state.user?.locked
  },
  actions: {
    // no context as first argument, use `this` instead
    async getCurrentUserInfo () {
      const requestParams: IRequestParams = {
        url: `${$h().getServer()}${URL_USERS}/current`
      }
      const axiosStore = useAxiosStore()
      const resp = await axiosStore.getAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
      const data = resp?.data as UserInfo
      if (this.user?.role !== data?.role) {
        const accountStore = useAccountStore()
        await accountStore.setUserInfo({
          name: 'role',
          value: data.role
        })
      }
      this.user = data
    },
    async editCurrentUserInfo (model: UserEditModel) {
      const requestParams: IRequestParams = {
        url: `${$h().getServer()}${URL_USERS}/current`,
        model
      }
      const axiosStore = useAxiosStore()
      await axiosStore.putAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
    },
    async addSubscription (blogOwnerId: string) {
      const requestParams = {
        url: `${$h().getServer()}${URL_SUBSCRIPTIONS}`,
        model: {
          userId: blogOwnerId
        }
      }
      const axiosStore = useAxiosStore()

      await axiosStore.postAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
    },
    async deleteSubscription (blogOwnerId: string) {
      const requestParams = {
        url: `${$h().getServer()}${URL_SUBSCRIPTIONS}/${blogOwnerId}`
      }
      const axiosStore = useAxiosStore()

      await axiosStore.deleteAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
    },
    // easily reset state using `$reset`
    clearCurrentUserInfo () {
      this.user = null
    }
  }
})
