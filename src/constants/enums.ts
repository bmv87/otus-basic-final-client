
export enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export const ROLE_ENUM = Object.freeze({
  [RoleEnum.USER]: 'Пользователь',
  [RoleEnum.ADMIN]: 'Администратор'
})

export enum GradeEnum {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE'
}

export const GRADE_ENUM = Object.freeze({
  [GradeEnum.LIKE]: 'Нравится',
  [GradeEnum.DISLIKE]: 'Не нравится'
})

export enum UserTabsEnum {
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  NOTES = 'NOTES'
}
export const USER_TABS_ENUM = Object.freeze({
  [UserTabsEnum.NOTES]: 'Публикации',
  [UserTabsEnum.SUBSCRIPTIONS]: 'Подписки'
})
export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export const GENDER_ENUM = Object.freeze({
  [GenderEnum.MALE]: 'М',
  [GenderEnum.FEMALE]: 'Ж'
})
