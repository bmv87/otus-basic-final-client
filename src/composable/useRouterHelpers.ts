
// import { useStore } from 'vuex'
import { computed } from 'vue'

import {
  NavigationFailureType, isNavigationFailure,
  RouteRecordName, useRoute, useRouter
} from 'vue-router'

import { AcceptableLocale } from '@/plugins/i18n'

const useRouterHelpers = () => {
  // const store = useStore()
  const router = useRouter()
  const route = useRoute()

  // const systemLocale = computed(() => store.state[LOCALIZATION.NAMESPACE][LOCALIZATION.STATE.LOCALE])

  const urlRootPath = computed(() => {
    return ''
  })

  const goToRoute = async (routePath: string): Promise<any> => {
    if (route.path !== routePath) {
      try {
        await router.push({
          path: routePath
        })
      }
      catch (error) {
        if (isNavigationFailure(error, NavigationFailureType.duplicated)) {
          console.log(`Message: ${error.message}`)
          console.log(`From: ${error.from.path}`)
          console.log(`To: ${error.to.toString()}`) // '/admin'
          throw error
          // '/'
        }
      }
    }
  }

  const replaceCurrentRoute = async (routePath: string): Promise<any> => {
    if (route.path !== routePath) {
      await router.replace({
        path: routePath
      })
    }
  }

  const fixRoutingForIE = (): void => {
    if ('-ms-scroll-limit' in document.documentElement.style &&
      '-ms-ime-align' in document.documentElement.style) { // detect it's IE11
      window.addEventListener('hashchange', () => {
        const currentPath = window.location.hash.slice(1)
        if (route.path !== currentPath) {
          router.push(currentPath)
        }
      }, false)
    }
  }

  const replaceRouteLocale = async (locale: AcceptableLocale): Promise<any> => {
    await router.replace({
      name: route.name as RouteRecordName,
      replace: true,
      params: {
        ...route.params,
        lang: locale
      }
    })
  }

  return {
    urlRootPath,
    goToRoute,
    replaceCurrentRoute,
    replaceRouteLocale,
    fixRoutingForIE
  }
}

export default useRouterHelpers
