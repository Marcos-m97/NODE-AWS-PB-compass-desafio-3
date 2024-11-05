import { User } from '../../models/usermodel.js'

export type userInput = {
  fullName: string
  email: string
  password: string
}

export type userCreation = {
  fullName: string
  email: string
  password: string
}

export type UserfilteredResponse = {
  orderedBy: string
  isExcluded: string
  orderDirection: string
  totalUsersFound: number
  totalPages: number
  currentPage: number
  Users: User[]
}

export type UserfilterType = {
  fullName?: string
  email?: string
  createdAt?: Date
  deletedAt?: Date
  excluded?: string
}

export type userUpdates = {
  fullName?: string
  email?: string
  password?: string
}


