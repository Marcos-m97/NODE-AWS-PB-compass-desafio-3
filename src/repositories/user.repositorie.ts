import { userCreation, userInput } from '../definitions/users.types.js'
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
}
export default UserRepositorie
