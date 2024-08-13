declare module 'vue-router-ext' {
  declare interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[] | undefined
  }
}
