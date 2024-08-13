import { ERROR_NAME_NETWORK } from '@/constants/settings'
import { useAccountStore } from '@/store/account'
import { useErrorsStore } from '@/store/errors'
import { useCurrentUserStore } from '@/store/current-user'
import useRouterHelpers from '@/composable/useRouterHelpers'

const useCurrentUserHelpers = () => {

  const { goToRoute, urlRootPath } = useRouterHelpers()
  const getCurrentUserInfo = async () => {
    const accountStore = useAccountStore()
    const errorsStore = useErrorsStore()
    // проверка доступа на случай, если сохранен токен, но учетные данные поменялись или пользователь заблокирован
    try {
      const currentUserStore = useCurrentUserStore()
      await currentUserStore.getCurrentUserInfo()
    }
    catch (error: any) {
      if (error &&
            error.name !== ERROR_NAME_NETWORK) {
        await accountStore.logOut()
      }

      await errorsStore.throwIfNotServerError(error)
      goToRoute(`${urlRootPath.value}/login`)
    }
  }
  const logOut = async () => {
    const accountStore = useAccountStore()
    await accountStore.logOut()
    goToRoute(`${urlRootPath.value}/`)
  }

  return {
    getCurrentUserInfo,
    logOut
  }
}

export default useCurrentUserHelpers
