import { Router } from 'express'
import privateRoute from '../middlewares/auth.middlewere.js'
import UserController from '../controllers/user.controller.js'
import UserService from '../services/user.service.js'
import UserRepositorie from '../repositories/user.repositorie.js'
const userRepositorie = new UserRepositorie()
const userService = new UserService(userRepositorie)
const userController = new UserController(userService)

const router = Router()

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Cadastra um novo usuário.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: O nome completo do usuário.
 *                 example: "Fulano de Tal"
 *               email:
 *                 type: string
 *                 description: O e-mail do usuário.
 *                 example: "fulano@example.com"
 *               password:
 *                 type: string
 *                 description: A senha do usuário.
 *                 example: "senhaSegura123"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: O ID do usuário criado.
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 fullName:
 *                   type: string
 *                   description: O nome completo do usuário.
 *                   example: "Fulano de Tal"
 *                 email:
 *                   type: string
 *                   description: O e-mail do usuário.
 *                   example: "fulano@example.com"
 *                 createdAt:
 *                   type: string
 *                   description: Data de criação do usuário.
 *                   example: "2024-10-11T10:00:00.000Z"
 *       400:
 *         description: Erro na validação dos dados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Campo 'email' é obrigatório."
 */
router.post('/', privateRoute, async (req, res, next) => {
  try {
    await userController.createUser(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Lista todos os usuários com opções de filtro e paginação
 *     tags: [User]
 *     description: >
 *       Endpoint protegido para listar todos os usuários com possibilidade de aplicar filtros e ordenação.
 *       É necessário um token JWT para acessar essa rota.
 *     security:
 *       - bearerAuth: []  # Rota protegida pelo JWT
 *     parameters:
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Nome completo do usuário para busca por padrão "like"
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: Email do usuário para busca por padrão "like"
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de criação para filtro (no formato AAAA-MM-DD)
 *       - in: query
 *         name: deletedAt
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de exclusão para filtro (no formato AAAA-MM-DD)
 *       - in: query
 *         name: excluded
 *         schema:
 *           type: string
 *           enum: [sim, não]
 *         description: Filtro para usuários excluídos ("sim" para excluídos, "não" para ativos)
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Campo para ordenar a lista de usuários
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Direção de ordenação (ascendente ou descendente)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Número de resultados por página (máximo de 10)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página para paginação
 *     responses:
 *       '200':
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderedBy:
 *                   type: string
 *                   description: Campo pelo qual a lista está ordenada
 *                   example: "createdAt"
 *                 isExcluded:
 *                   type: string
 *                   description: Indicação se está filtrando por excluídos
 *                   example: "não"
 *                 orderDirection:
 *                   type: string
 *                   description: Direção da ordenação
 *                   example: "Ascendente"
 *                 totalUsersFound:
 *                   type: integer
 *                   description: Total de usuários encontrados
 *                   example: 25
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas disponíveis
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   description: Página atual da listagem
 *                   example: 1
 *                 Users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         description: ID do usuário
 *                         example: "b47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                       fullName:
 *                         type: string
 *                         description: Nome completo do usuário
 *                         example: "João Silva"
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: Email do usuário
 *                         example: "joao.silva@example.com"
 *       '400':
 *         description: Requisição inválida (parâmetros incorretos ou faltando)
 *       '401':
 *         description: Não autorizado (falha na autenticação)
 *       '404':
 *         description: Nenhum usuário encontrado
 *       '500':
 *         description: Erro interno no servidor
 */

router.get('/', privateRoute, async (req, res, next) => {
  try {
    await userController.getAllUsers(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Dados do usuário encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 fullName:
 *                   type: string
 *                   example: "Fulano de Tal"
 *                 email:
 *                   type: string
 *                   example: "fulano@example.com"
 *                 createdAt:
 *                   type: string
 *                   example: "2024-10-11T10:00:00.000Z"
 *       404:
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado."
 */
router.get('/:id', privateRoute, async (req, res, next) => {
  try {
    await userController.getUserById(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um usuário por ID
 *     tags:
 *       [User]
 *     description: >
 *       Endpoint protegido para atualizar parcialmente as informações de um usuário específico pelo ID.
 *       É necessário um token JWT para acessar essa rota.
 *     security:
 *       - bearerAuth: []  # Rota protegida pelo JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do usuário
 *         example: "b47ac10b-58cc-4372-a567-0e02b2c3d479"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Nome completo do usuário
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "joao.silva@example.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário (mínimo de 6 caracteres e pelo menos uma letra maiúscula)
 *                 example: "SenhaForte123"
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: ID do usuário
 *                   example: "b47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                 fullName:
 *                   type: string
 *                   description: Nome completo do usuário atualizado
 *                   example: "João Silva"
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email atualizado do usuário
 *                   example: "joao.silva@example.com"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Data de criação do usuário
 *                   example: "2023-01-01T12:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Data da última atualização do usuário
 *                   example: "2023-07-15T08:30:00Z"
 *       '400':
 *         description: Requisição inválida (dados incorretos ou ausentes)
 *       '401':
 *         description: Não autorizado (falha na autenticação)
 *       '404':
 *         description: Usuário não encontrado
 *       '409':
 *         description: Conflito (usuário já excluído ou email duplicado)
 *       '500':
 *         description: Erro interno no servidor
 */
router.patch('/:id', privateRoute, async (req, res, next) => {
  try {
    await userController.updateUser(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Marca o usuário como excluído (soft delete).
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário excluído com sucesso."
 *       404:
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado."
 */
router.delete('/:id', privateRoute, async (req, res, next) => {
  try {
    await userController.deleteUser(req, res, next)
  } catch (error) {
    next(error)
  }
})

export default router
