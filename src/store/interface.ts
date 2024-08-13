import { defineStore } from 'pinia'

interface IState {
  leftMenuVisible: boolean
  footerVisible: boolean
  dialogVisible: boolean

}

export const useInterfaceStore = defineStore('interface', {
  // convert to a function
  state: (): IState => {
    return {
      leftMenuVisible: true,
      footerVisible: false,
      dialogVisible: false
    }
  },
  actions: {
    // no context as first argument, use `this` instead
    async setLeftMenuVisible (enabled: boolean) {
      this.leftMenuVisible = enabled
    },
    async setFooterVisible (enabled: boolean) {
      this.footerVisible = enabled
    },
    async setDialogVisible (enabled: boolean) {
      this.dialogVisible = enabled
    },
    // easily reset state using `$reset`
    reset () {
      this.$reset()
    }
  }
})