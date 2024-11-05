import { Request, Response, NextFunction } from 'express'
import { User } from '../models/usermodel.js'
import bcrypt from 'bcrypt'
import UserService from '../services/user.service.js'
import {
  UserfilterType,
  userInput,
  userUpdates
} from '../definitions/users.def/users.types.js'

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
      const user = await this.userService.getUser(id)
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
      const userId: string = req.params.id
      const updates: userUpdates = req.body

      const updatedUser = await this.userService.redefineUsers(updates, userId)

      return res.status(200).json(updatedUser)
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
      const deleted = await this.userService.softDeleteUser(id)
      return res.status(200).json({ message: 'Usuário excluído com sucesso.', data: deleted.deletedAt })
    } catch (error) {
      next(error)
    }
  }
}

export default UserController
