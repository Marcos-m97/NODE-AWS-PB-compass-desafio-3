import {
  userCreation,
  userInput,
  UserfilterType,
  UserfilteredResponse
} from '../definitions/users.def/users.types.js'
import { AppErrors } from '../middlewares/errorMiddlewere.js'
import UserRepositorie from '../repositories/user.repositorie.js'
import { User } from '../models/usermodel.js'
import { Op } from 'sequelize'
import {
  validarEmail,
  validarnomeCompleto,
  validPassword
} from '../utilis/functions.js'
import bcrypt from 'bcrypt'

class UserService {
  constructor(private userRepositorie: UserRepositorie) {}

  public async registerUser(userData: userInput): Promise<User | void> {
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

      if (!isRegisteredUser || isRegisteredUser.deletedAt !== null) {
        const hashedPassword = await bcrypt.hash(userData.password, 10)

        const newUser: userCreation = {
          fullName: userData.fullName,
          email: userData.email,
          password: hashedPassword
        }
        const user = await this.userRepositorie.createUser(newUser)
        return user
      }
    } catch (error) {
      throw error
    }
  }

  public async filterUsers(
    filter: UserfilterType,
    limit: number,
    page: number,
    orderBy: string,
    orderDirection: string
  ): Promise<UserfilteredResponse | null> {
    if (limit > 10) {
      limit == 10
    }
    if (limit < 5) {
      limit == 5
    }

    let whereClaus: any = {}

    try {
      if (filter.fullName) {
        whereClaus.fullName = {
          [Op.like]: `%${filter.fullName}%`
        }
      }

      if (filter.email) {
        whereClaus.email = {
          [Op.like]: `%${filter.email}%`
        }
      }

      if (filter.createdAt) {
        const startDate = new Date(filter.createdAt)
        const endDate = new Date(filter.createdAt)
        endDate.setHours(23, 59, 59, 999)

        whereClaus.createdAt = {
          [Op.between]: [startDate, endDate]
        }
      }

      if (filter.deletedAt) {
        const startDate = new Date(filter.deletedAt)
        const endDate = new Date(filter.deletedAt)
        endDate.setHours(23, 59, 59, 999)

        whereClaus.deletedAt = {
          [Op.between]: [startDate, endDate]
        }
      }

      const excluido = filter.excluded || 'não'
      if (excluido === 'não') {
        whereClaus.deletedAt = null
      } else if (excluido === 'sim') {
        whereClaus.deletedAt = { [Op.not]: null }
      }

      const order = [[orderBy, orderDirection]]

      let orderdir: string = ''
      if (order[0][1] === 'desc') {
        orderdir = 'Descendente'
      } else {
        orderdir = 'Ascendente'
      }

      const offset = (page - 1) * limit

      const clientesList = await this.userRepositorie.filterUsers(
        whereClaus,
        order,
        limit,
        offset
      )

      const totalUsers = await this.userRepositorie.countClientes(whereClaus)

      let pagesQty = Math.ceil(totalUsers / limit)

      if (!clientesList || clientesList.length === 0 || totalUsers === 0) {
        throw new AppErrors('Cliente nao encontrado', 404)
      }

      let resp: UserfilteredResponse = {
        orderedBy: order[0][0],
        isExcluded: excluido,
        orderDirection: orderdir,
        totalUsersFound: totalUsers,
        totalPages: pagesQty,
        currentPage: page,
        Users: clientesList
      }

      return resp
    } catch (err) {
      throw err
    }
  }
}
export default UserService
