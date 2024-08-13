
import { RoleEnum, GenderEnum } from '@/constants/enums'
import { PaginationParams } from '@/interfaces/common'

export interface UserInfo {
  userId: string
  login: string
  username: string
  locked: boolean
  role: RoleEnum
  gender?: GenderEnum | null
  age?: number | null
}
export interface UserShortInfo {
  userId: string
  username: string
  locked: boolean
  subscribed: boolean
}
export interface UserEditModel {
  username: string
  gender?: GenderEnum | null
  age?: number | null
}
export interface SubscriptionInfo {
  blogOwnerId: string
  blogOwnerName: string
}

export interface LockStatusModel {
  locked: boolean
}

export interface LoginRequestModel {
  login: string
  password: string
}

export interface LoginResponseModel {
  username: string
  token: string
  role: RoleEnum
}

export interface UserCreateModel {
  login: string
  username: string
  password: string
}

export interface UserCreateExtendedModel extends UserCreateModel {
  passwordConfirmation: string
}

export interface UserListRequestParams extends PaginationParams {
  username?: string | null
  gender?: GenderEnum | null
  age?: number | null
}
