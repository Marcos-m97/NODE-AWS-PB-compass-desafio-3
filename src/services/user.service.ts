import { userCreation, userInput } from '../definitions/users.types.js'
import { AppErrors } from '../middlewares/errorMiddlewere.js'
import UserRepositorie from '../repositories/user.repositorie.js'
import { User } from '../models/usermodel.js'
import {
  validarEmail,
  validarnomeCompleto,
  validPassword
} from '../utilis/functions.js'
import bcrypt from 'bcrypt'

class UserService {
  constructor(private userRepositorie: UserRepositorie) {}

  public async registerUser(userData: userInput): Promise<User> {
    if (!userData.fullName) {
      throw new AppErrors('O campo fullName é obrigatório', 400)
    }
    if (validarnomeCompleto(userData.fullName) == false) {
      throw new AppErrors('Formato de fullName inválido.', 400)
    }
    if (!userData.email) {
      throw new AppErrors('O campo email é obrigatório', 404)
    }
    if (validarEmail(userData.email) == false) {
      throw new AppErrors('Formato de email inválido.', 400)
    }
    if (!userData.password) {
      throw new AppErrors('O campo password é obrigatório.', 400)
    }
    if (userData.password.length < 6) {
      throw new AppErrors(
        'Formato de senha invalido. No minimo uma letra maiuscula e 6 caracteres são necessários.',
        404
      )
    }
    if (validPassword(userData.password) == false) {
      throw new AppErrors(
        'Formato de senha invalido. No minimo uma letra maiuscula e 6 caracteres são necessários.',
        404
      )
    }
    try {
      const isRegisteredUser = await this.userRepositorie.findbyEmail(
        userData.email
      )

      if (isRegisteredUser && isRegisteredUser.deletedAt === null) {
        throw new AppErrors('Usuário já cadastrado.', 400)
      }

         let newUser = {}
        if (!isRegisteredUser || isRegisteredUser.deletedAt !== null) {
            const hashedPassword = await bcrypt.hash(userData.password, 10)

                  newUser = {
                  fullName: userData.fullName,
                  email: userData.email,
                  password: hashedPassword
                }
        }

        const user = await this.userRepositorie.createUser(newUser as userCreation)
        return user
      
    } catch (error) {
      throw error
    }
  }
}
export default UserService
