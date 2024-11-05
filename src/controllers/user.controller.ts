import { Request, Response, NextFunction } from 'express'
import { User } from '../models/usermodel.js'
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'
import UserService from '../services/user.service.js'
import { userInput } from '../definitions/users.types.js'

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
        .json({ msg: 'Usuário registrado com sucesso.', User: newUser!.id})
    } catch (error) {
      next(error)
    }
  }

  public async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const {
        fullName,
        email,
        excluded,
        sortBy,
        order,
        page = 1,
        limit = 10
      } = req.query

      const where: any = {}

      if (fullName) {
        where.fullName = { [Op.like]: `%${fullName}%` }
      }

      if (email) {
        where.email = { [Op.like]: `%${email}%` }
      }

      if (excluded === 'true') {
        where.deletedAt = { [Op.not]: null }
      } else if (excluded === 'false') {
        where.deletedAt = null
      }

      const validSortColumns = ['fullName', 'createdAt', 'deletedAt']
      let orderOption: any = [['createdAt', 'DESC']]

      if (sortBy && validSortColumns.includes(sortBy as string)) {
        const sortOrder = order === 'ASC' || order === 'DESC' ? order : 'ASC'
        orderOption = [[sortBy, sortOrder]]
      }

      const offset = (Number(page) - 1) * Number(limit)

      const { rows: users, count: totalUsers } = await User.findAndCountAll({
        attributes: ['id', 'fullName', 'email', 'createdAt', 'deletedAt'],
        where,
        order: orderOption,
        limit: Number(limit),
        offset
      })

      if (users.length === 0) {
        return res.status(404).json({ message: 'Nenhum usuário encontrado.' })
      }

      return res.status(200).json({
        totalUsers,
        totalPages: Math.ceil(totalUsers / Number(limit)),
        currentPage: Number(page),
        users
      })
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
