import { Request, Response, NextFunction } from 'express'
import AuthService from '../services/auth.service.js'
import { AuthInput } from '../definitions/auth.def/auth.types.js'

class AuthControler {
  private authService: AuthService
  constructor(authService: AuthService) {
    this.authService = authService
  }

  public async loginAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const AuthData: AuthInput = req.body

      const payLoad = await this.authService.authenticateUser(AuthData)

      return res.status(200).json(payLoad)
    } catch (error) {
      next(error)
    }
  }
}

export default AuthControler
