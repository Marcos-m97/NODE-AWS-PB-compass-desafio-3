import { Request, Response, NextFunction } from 'express'
import { User } from '../models/usermodel.js'
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'
import UserService from '../services/user.service.js'
import {
  UserfilterType,
  userInput
} from '../definitions/users.def/users.types.js'
import { filteredResponse } from '../definitions/clientes.def/clientes.types.js'

class UserController {
  constructor(private userService: UserService) {}

  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userData: userInput = req.body
      const newUser = await this.userService.registerUser(userData)

      return res
        .status(201)
        .json({ msg: 'Usuário registrado com sucesso.', UserID: newUser!.id })
    } catch (error) {
      next(error)
    }
  }

  public async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    let dataFilter: UserfilterType = {
      fullName: req.query.fullName as string,
      email: req.query.email as string,
      createdAt: req.query.createdAt
        ? new Date(req.query.dataCadastro as string)
        : undefined,
      deletedAt: req.query.dataExclusao
        ? new Date(req.query.dataExclusao as string)
        : undefined,
      excluded: req.query.excluido as string
    }
    const orderBy = (req.query.orderBy as string) || 'createdAt'
    const orderDirection = (req.query.orderDirection as string) || 'ASC'
    const limit = parseInt(req.query.limit as string) || 5
    const page = parseInt(req.query.page as string) || 1
    try {
      const filteredList = await this.userService.filterUsers(
        dataFilter,
        limit,
        page,
        orderBy,
        orderDirection
      )
      return res.status(200).json(filteredList)
    } catch (error) {
      next(error)
    }
  }

  public async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params

      const user = await User.findOne({
        where: { id, deletedAt: null },
        attributes: ['id', 'fullName', 'email', 'createdAt']
      })

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  public async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params
      const { fullName, email, password } = req.body

      const user = await User.findOne({ where: { id, deletedAt: null } })

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      if (email && email !== user.email) {
        const emailExists = await User.findOne({
          where: { email, deletedAt: null }
        })
        if (emailExists) {
          return res
            .status(400)
            .json({ message: 'Email já em uso por outro usuário.' })
        }
      }

      if (fullName) user.fullName = fullName
      if (email) user.email = email
      if (password) user.password = await bcrypt.hash(password, 10)

      await user.save()

      return res.status(200).json({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt
      })
    } catch (error) {
      next(error)
    }
  }

  public async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params

      const user = await User.findOne({ where: { id, deletedAt: null } })

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      user.deletedAt = new Date()

      await user.save()

      return res.status(200).json({ message: 'Usuário excluído com sucesso.' })
    } catch (error) {
      next(error)
    }
  }
}

export default UserController
