import { Router } from 'express'
import userController from '../controllers/user.controller.js'
import privateRoute from '../middlewares/auth.middlewere.js'

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
 *     summary: Lista todos os usuários.
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Parte do nome para filtro.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Parte do e-mail para filtro.
 *       - in: query
 *         name: excluded
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrar usuários excluídos ou não.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [fullName, createdAt, deletedAt]
 *         description: Campo para ordenar a listagem.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Ordem de ordenação (ascendente ou descendente).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de resultados por página.
 *     responses:
 *       200:
 *         description: Listagem de usuários.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   description: Número total de usuários encontrados.
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas.
 *                 currentPage:
 *                   type: integer
 *                   description: Página atual.
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       fullName:
 *                         type: string
 *                         example: "Fulano de Tal"
 *                       email:
 *                         type: string
 *                         example: "fulano@example.com"
 *                       createdAt:
 *                         type: string
 *                         example: "2024-10-11T10:00:00.000Z"
 *                       deletedAt:
 *                         type: string
 *                         example: null
 *       404:
 *         description: Nenhum usuário encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhum usuário encontrado."
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
 *   put:
 *     summary: Atualiza as informações de um usuário.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Novo Nome"
 *               email:
 *                 type: string
 *                 example: "novoemail@example.com"
 *               password:
 *                 type: string
 *                 example: "novaSenhaSegura"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
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
 *                   example: "Novo Nome"
 *                 email:
 *                   type: string
 *                   example: "novoemail@example.com"
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
router.put('/:id', privateRoute, async (req, res, next) => {
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
