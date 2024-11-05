import 'dotenv/config'
import AuthRepositorie from '../repositories/auth.repositorie.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AuthInput, AuthResponse } from '../definitions/auth.def/auth.types.js'
import { AppErrors } from '../middlewares/errorMiddlewere.js'

async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

class AuthService {
  private authRepositorie: AuthRepositorie
  constructor(authRepositorie: AuthRepositorie) {
    this.authRepositorie = authRepositorie
  }

  public async authenticateUser(
    authData: AuthInput
  ): Promise<AuthResponse | null> {
    try {
      const registeredUser = await this.authRepositorie.findUser(authData.email)

      if (!registeredUser) {
        throw new AppErrors('error: invalid email or password', 403)
      }

      if (registeredUser.deletedAt) {
        throw new AppErrors('Usuário não autorizado', 403)
      }

      const validPassword = await comparePassword(
        authData.password,
        registeredUser.password
      )

      if (validPassword == false) {
        throw new AppErrors('error: invalid email or password', 403)
      }

      const token = jwt.sign(
        { email: registeredUser.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      )

      const validToken: AuthResponse = {
        accessToken: token,
        expiresIn: 6000
      }

      return validToken
    } catch (err) {
      throw err
    }
  }
}
export default AuthService
