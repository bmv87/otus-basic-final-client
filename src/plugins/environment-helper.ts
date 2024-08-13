

export const DEVELOPMENT = 'dev'
export const PRODUCTION = 'prod'

export type AcceptableMode = 'dev' | 'prod'
const getDefaultTestMode = (env: AcceptableMode | undefined): boolean => {
  switch (env) {
    case DEVELOPMENT:
      return true
    case PRODUCTION:
      return false
    default:
      return false
  }
}

class EnvConfig {
  public current: AcceptableMode | undefined

  private isTest: boolean

  constructor (env: AcceptableMode | undefined) {

    this.current = env
    this.isTest = getDefaultTestMode(env)
  }

  public isTestMode (): boolean {
    return this.isTest
  }

  public isDevEnv (): boolean {
    return this.current === DEVELOPMENT
  }

  public changeTestMode (isTest: boolean): void {
    this.isTest = isTest
  }
}

// const environmentHelperConfigurator = (app: App<any>):void => {
//   if (!app.config.globalProperties.$env) {
//     app.config.globalProperties.$env = {}
//   }
//   app.config.globalProperties.$env = new EnvConfig(process.env.NODE_ENV)
// }

const env = (): EnvConfig => {
  return new EnvConfig(import.meta.env.VITE_APP_ENV as AcceptableMode)
}

export {
  // environmentHelperConfigurator,
  env
}
