import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload // usar string e ser opicional tem a ver com preparar para todos os possiveis casos, de tokens simples que voltm stirng ou nao voltar o token
}
const privateRoute = async (
  req: AuthenticatedRequest, // requpesolnalizado pela inteface acima, ela permite atribuir o pyaload a um usuario. assim é posssivel dizer qual usuario esta logado
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization // pega o heders.authorizaion do cabeçalho

  //verifica se o cabeçalho da aut esta presente
  if (!authHeader) {
    return res.status(401).json({ error: 'invalid token' })
  }
  // split é necesario porque o token volta uma string "Bearer numerodotoken"  o split com espaço consigo pegar apenas numero

  const token = authHeader.split(' ')[1]

  //verifica se o token esta presente
  if (!token) {
    return res.status(401).json({ error: 'token is required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded as JwtPayload
    next()
  } catch (error) {
    return res.status(403).json({ error: 'invalid token' })
  }
}

export default privateRoute
