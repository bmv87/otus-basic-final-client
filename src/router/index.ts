/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {
  NavigationGuardNext, RouteLocationNormalized,
  RouteRecordRaw, createRouter,
  createWebHashHistory
} from 'vue-router'
import { RouteMeta } from 'vue-router-ext'
import { useAccountStore } from '@/store/account'
import { RoleEnum } from '@/constants/enums'

const UserLayout = () => import(/* webpackChunkName: "layout" */'@/components/reused/layouts/UserLayout.vue')
const Main = () => import(/* webpackChunkName: "main" */'@/components/pages/Main.vue')
const Login = () => import(/* webpackChunkName: "account" */'@/components/pages/users/Login.vue')
const Registration = () => import('@/components/pages/users/Registration.vue')
const Profile = () => import('@/components/pages/users/Profile.vue')
const Users = () => import('@/components/pages/users/Users.vue')
const Notes = () => import('@/components/pages/notes/Notes.vue')
const Subscriptions = () => import('@/components/pages/subscriptions/Subscriptions.vue')

// только администратор
// const adminRouteMeta = {
//   requiresAuth: true,
//   roles: [RoleEnum.ADMIN]
// }

// любой пользователь, кроме админа, в том числе неаутентифицированный и не прошедший регистрацию УП
// const notAdminUserRouteMeta = {
//   requiresAuth: true,
//   roles: [
//     RoleEnum.USER
//   ]
// }

// любой пользователь
const anyUsersRouteMeta = {
  requiresAuth: false,
  roles: []
}

// любой аутентифицированный пользователь, кроме админа, в том числе не прошедший регистрацию УП
const anyAuthUsersRouteMeta = {
  requiresAuth: true,
  roles: [
    RoleEnum.ADMIN,
    RoleEnum.USER
  ]
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: UserLayout,
    meta: anyUsersRouteMeta,
    children: [
      {
        path: '',
        name: 'Main',
        component: Main,
        meta: anyUsersRouteMeta
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: anyUsersRouteMeta
      },
      {
        path: 'registration',
        name: 'Registration',
        component: Registration,
        meta: anyUsersRouteMeta
      },
      {
        path: 'users/:userId/notes',
        name: 'Notes',
        component: Notes,
        props: true,
        meta: anyAuthUsersRouteMeta
      },
      {
        path: 'users/:userId/profile',
        name: 'Profile',
        component: Profile,
        props: true,
        meta: anyAuthUsersRouteMeta
      },
      {
        path: 'users/:userId/subscriptions',
        name: 'Subscriptions',
        component: Subscriptions,
        props: true,
        meta: anyAuthUsersRouteMeta
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: anyAuthUsersRouteMeta
      },
      {
        path: '*',
        redirect: {
          name: 'Main'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const beforEachHeandler = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {

  const accountStore = useAccountStore()

  const role = accountStore.role
  const isLoggedIn = accountStore.isLoggedIn
  // язык по умолчанию или из локальных настроек пользователя

  const meta = to.meta as RouteMeta
  // язык из параметров url
  const roles: string[] = meta.roles || []

  if (meta.requiresAuth && !isLoggedIn) {
    console.log('meta.requiresAuth && !isLoggedIn')

    // если требуется аутентификация для текущего маршрута и она не пройдена
    next({
      name: 'Login',
      params: {
        ...to.params
      }
    })
    return
  }
  else if (roles.length > 0 &&
   (!role || !roles.includes(role.toString()))) {
    console.log('roles.length > 0 && !roles.includes(participant)')
    // если требуется проверка ролей и она не пройдена
    next({
      name: 'Main',
      params: {
        ...to.params
      }
    })
    return
  }
  else {
    // если выше не перенаправлено, то идем дальше
    next() // make sure to always call next()!
    return
  }
}

// настраиваем доступность маршрутов и перенаправления (для администратора и пользователей)
router.beforeEach(async (to, from, next) => {
  await beforEachHeandler(to, from, next)
})

export default router
