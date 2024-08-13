/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_HOST: string
  readonly VITE_APP_PROTOCOL: string
  readonly VITE_APP_HOST_SERVER: string
  readonly VITE_APP_HOST_CURRENT: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// declare global {
//     interface Navigator {
//         msSaveBlob?: (blob: any, defaultName?: string) => boolean
//     }
// }
