
export interface IHostConfig {
  server: string,
  current: string
}

export const config = (): IHostConfig => {
  const {
    VITE_APP_HOST,
    VITE_APP_PROTOCOL,
    VITE_APP_HOST_SERVER,
    VITE_APP_HOST_CURRENT
  } = import.meta.env
  // console.log(import.meta.env)
  return {
    server: `${VITE_APP_PROTOCOL}://${VITE_APP_HOST}${VITE_APP_HOST_SERVER}`,
    current: `${VITE_APP_PROTOCOL}://${VITE_APP_HOST}${VITE_APP_HOST_CURRENT}`
  } as IHostConfig
}
