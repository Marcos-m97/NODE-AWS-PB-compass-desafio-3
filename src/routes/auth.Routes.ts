import { Router } from 'express'
import AuthControler from '../controllers/auth.controllers.js'
import AuthService from '../services/auth.service.js'
import AuthRepositorie from '../repositories/auth.repositorie.js'

const authRouter = Router()

const authRepositorie = new AuthRepositorie()
const authService = new AuthService(authRepositorie)
const authControler = new AuthControler(authService)

// Anotaçoes do swagger
/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Realiza o login de um usuário e retorna um token JWT.
 *     tags:
 *       - Login (Autenticação)
 *     description: >
 *       Esta rota permite que um usuário autenticado no sistema obtenha um token de acesso JWT.
 *       O token deve ser utilizado para autenticação em rotas protegidas. Após o login bem-sucedido, o token é retornado junto com o tempo de expiração.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: O email do usuário.
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 description: A senha do usuário.
 *                 example: "senhaSegura"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: >
 *                     Token de acesso JWT que deve ser usado nas próximas requisições protegidas.
 *                     O token deve ser enviado no cabeçalho da requisição como:
 *                     'Authorization: Bearer {token}'.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 expiresIn:
 *                   type: integer
 *                   description: >
 *                     Tempo, em segundos, até o token expirar. Após esse período, o usuário precisará fazer login novamente.
 *                   example: 600
 *       400:
 *         description: Requisição inválida (formato incorreto ou dados ausentes).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dados inválidos. Verifique o formato do e-mail e senha."
 *       401:
 *         description: E-mail ou senha inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "E-mail ou senha incorretos."
 *       500:
 *         description: Erro interno no servidor.
 */

authRouter.post('/', async (req, res, next) => {
  try {
    await authControler.loginAuth(req, res, next)
  } catch (error) {
    next(error)
  }
})
export default authRouter