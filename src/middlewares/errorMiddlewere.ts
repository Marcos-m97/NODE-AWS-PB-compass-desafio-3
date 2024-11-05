import { Request, Response, NextFunction } from 'express'

export class AppErrors {
  public message: string
  public code: number

  constructor(message: string, code: number) {
    ;(this.message = message), (this.code = code)
  }
}

let errorMiddlewere = function (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppErrors) {
    console.log(error)
    res.status(error.code).json({ error: error.message })
    return
  } else {
    console.log(error)
    res.status(500).json({ error: 'internal server error' })
  }
}

export default errorMiddlewere
