import { User } from '../models/usermodel.js'

class AuthRepositorie {
  public async findUser(email: string): Promise<User | null> {
    try {
      const user = await User.findOne({ where: { email } })
      return user
    } catch (err) {
      throw err
    }
  }
}

export default AuthRepositorie
