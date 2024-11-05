import { Request, Response, NextFunction } from 'express'
import { AppErrors } from './appErrors.js'

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  if (err instanceof AppErrors) {
    statusCode = err.statusCode
    message = err.message
  }

  res.status(statusCode).json({
    status: 'error',
    message: message
  })

  next()
}
