import {
  userCreation,
  userInput,
  UserfilterType,
  UserfilteredResponse,
  userUpdates
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

  public async registerUser(userData: userInput): Promise<User | null | void> {
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

      const usersList = await this.userRepositorie.filterUsers(
        whereClaus,
        order,
        limit,
        offset
      )

      const totalUsers = await this.userRepositorie.countClientes(whereClaus)

      let pagesQty = Math.ceil(totalUsers / limit)

      if (!usersList || usersList.length === 0 || totalUsers === 0) {
        throw new AppErrors('Cliente nao encontrado', 404)
      }

      let resp: UserfilteredResponse = {
        orderedBy: order[0][0],
        isExcluded: excluido,
        orderDirection: orderdir,
        totalUsersFound: totalUsers,
        totalPages: pagesQty,
        currentPage: page,
        Users: usersList
      }

      return resp
    } catch (err) {
      throw err
    }
  }

  public async getUser(id: string): Promise<User | void> {
    const isUser = await this.userRepositorie.findUserById(id)
    if (!isUser) {
      throw new AppErrors('Usuário não encontrado.', 400)
    }
    return isUser!
  }

  public async redefineUsers(
    updates: userUpdates,
    userId: string
  ): Promise<User | null> {
    const existingUser = await this.userRepositorie.findUserById(userId)

    if (!existingUser) {
      throw new AppErrors('Usuário não encontrado', 404)
    }

    if (existingUser.deletedAt) {
      throw new AppErrors('Usuário excluido', 409)
    }

    const up: userUpdates = {}

    if (updates.fullName) {
      if (validarnomeCompleto(updates.fullName) == false) {
        throw new AppErrors('Nome completo inválido', 400)
      }
      up.fullName = updates.fullName
    }

    if (updates.email) {
      if (validarEmail(updates.email) == false) {
        throw new AppErrors('Email inválido', 400)
      }

      if (existingUser.email && existingUser.id !== userId) {
        throw new AppErrors('Já existe um user com este email', 409)
      }
      up.email = updates.email
    }

    if (updates.password) {
      if (updates.password.length < 6) {
        throw new AppErrors(
          'Formato de senha invalido. No minimo uma letra maiuscula e 6 caracteres são necessários.',
          404
        )
      }
      if (validPassword(updates.password) == false) {
        throw new AppErrors(
          'Formato de senha invalido. No minimo uma letra maiuscula e 6 caracteres são necessários.',
          404
        )
      }

      up.password = await bcrypt.hash(updates.password, 10)
    }

    const updatedData = await this.userRepositorie.atualizarUsuarios(up, userId)
    return updatedData
  }

  public async softDeleteUser(id: string): Promise<User> {
    const user = await this.userRepositorie.findUserById(id)

    if (!user) {
      throw new AppErrors('user não encontrado', 404)
    }
    if (user.deletedAt) {
      throw new AppErrors('user já está excluído', 409)
    }

    try {
      const deletedUser = await this.userRepositorie.softDeleteUsers(id)
      return deletedUser
    } catch (error) {
      throw new AppErrors('Falha ao excluir o cliente', 500)
    }
  }
}
export default UserService
