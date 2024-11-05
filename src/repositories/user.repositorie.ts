import {
  userCreation,
  UserfilterType,
  userInput
} from '../definitions/users.def/users.types.js'
import { User } from '../models/usermodel.js'

class UserRepositorie {
  public async findbyEmail(userEmail: string): Promise<User | null> {
    try {
      const existingUser = await User.findOne({
        where: { email: userEmail }
      })
      return existingUser
    } catch (error) {
      throw error
    }
  }

  public async createUser(newUserData: userCreation): Promise<User> {
    try {
      const newUser = await User.create(newUserData)
      return newUser
    } catch (error) {
      throw error
    }
  }

  public async filterUsers(
    whereClaus: UserfilterType,
    order: any,
    limit: number,
    offset: number
  ): Promise<User[] | null> {
    try {
      const clientes = await User.findAll({
        where: whereClaus,
        order: order,
        limit: limit,
        offset: offset,
        attributes: { exclude: ['createdAt', 'deletedAt'] }
      })

      return clientes
    } catch (err) {
      throw err
    }
  }

  public async countClientes(whereClaus: UserfilterType): Promise<number> {
    try {
      const count = await User.count({ where: whereClaus })
      return count
    } catch (err) {
      throw err
    }
  }
}
export default UserRepositorie
