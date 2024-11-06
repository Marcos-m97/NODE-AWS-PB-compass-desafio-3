import { Router } from 'express'
import CarroRepository from '../repositories/carros.repositorie.js'
import CarroService from '../services/carros.service.js'
import CarroController from '../controllers/carro.controller.js'
import privateRoute from '../middlewares/auth.middlewere.js'

const carroRouter = Router()

const carroRepositorie = new CarroRepository()
const carroService = new CarroService(carroRepositorie)
const carroController = new CarroController(carroService)


/**
 * @swagger
 * /api/v1/carros:
 *   post:
 *     summary: Criação de um novo carro
 *     tags:
 *       - Carros
 *     description: >
 *       Endpoint protegido para cadastrar um novo carro no sistema.
 *       É necessário um token JWT para acessar essa rota.
 *     security:
 *       - bearerAuth: []  # Rota protegida pelo JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placa:
 *                 type: string
 *                 description: Placa do carro
 *                 example: "ABC-1234"
 *               marca:
 *                 type: string
 *                 description: Marca do carro
 *                 example: "Ford"
 *               modelo:
 *                 type: string
 *                 description: Modelo do carro
 *                 example: "Fiesta"
 *               ano:
 *                 type: integer
 *                 description: Ano de fabricação do carro
 *                 example: 2020
 *               km:
 *                 type: integer
 *                 description: Quilometragem do carro
 *                 example: 15000
 *                 default: 0
 *               items:
 *                 type: object
 *                 description: Itens adicionais do carro, como ar-condicionado ou direção hidráulica.
 *                 additionalProperties:
 *                   type: string
 *                 example: { "ar-condicionado": "sim", "direção hidráulica": "sim" }
 *               valorDiaria:
 *                 type: number
 *                 format: float
 *                 description: Valor da diária para aluguel do carro
 *                 example: 150.0
 *     responses:
 *       '201':
 *         description: Carro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: ID do carro criado
 *                   example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                 placa:
 *                   type: string
 *                   description: Placa do carro
 *                   example: "ABC-1234"
 *                 marca:
 *                   type: string
 *                   description: Marca do carro
 *                   example: "Ford"
 *                 modelo:
 *                   type: string
 *                   description: Modelo do carro
 *                   example: "Fiesta"
 *                 ano:
 *                   type: integer
 *                   description: Ano de fabricação do carro
 *                   example: 2020
 *                 km:
 *                   type: integer
 *                   description: Quilometragem do carro
 *                   example: 15000
 *                 items:
 *                   type: object
 *                   description: Itens adicionais do carro
 *                   additionalProperties:
 *                     type: string
 *                   example: { "ar-condicionado": "sim", "direção hidráulica": "sim" }
 *                 valorDiaria:
 *                   type: number
 *                   format: float
 *                   description: Valor da diária para aluguel do carro
 *                   example: 150.0
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   description: Data de cadastro do carro
 *                   example: "2023-07-15T08:30:00Z"
 *                 dataDeExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: Data de exclusão do carro, se aplicável
 *                   example: null
 *       '400':
 *         description: Requisição inválida (dados incorretos ou ausentes)
 *       '401':
 *         description: Não autorizado (falha na autenticação)
 *       '500':
 *         description: Erro interno no servidor
 */
carroRouter.post('/', privateRoute, async (req, res, next) => {
  try {
    await carroController.carroCreate(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/carros/{id}:
 *   get:
 *     summary: Obtém detalhes de um carro por ID
 *     tags:
 *       - Carros
 *     description: >
 *       Endpoint protegido para buscar os detalhes de um carro específico pelo seu ID.
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
 *         description: ID único do carro
 *         example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *     responses:
 *       '200':
 *         description: Detalhes do carro retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: ID do carro
 *                   example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                 placa:
 *                   type: string
 *                   description: Placa do carro
 *                   example: "ABC-1234"
 *                 marca:
 *                   type: string
 *                   description: Marca do carro
 *                   example: "Ford"
 *                 modelo:
 *                   type: string
 *                   description: Modelo do carro
 *                   example: "Fiesta"
 *                 ano:
 *                   type: integer
 *                   description: Ano de fabricação do carro
 *                   example: 2020
 *                 km:
 *                   type: integer
 *                   description: Quilometragem do carro
 *                   example: 15000
 *                 items:
 *                   type: object
 *                   description: Itens adicionais do carro
 *                   additionalProperties:
 *                     type: string
 *                   example: { "ar-condicionado": "sim", "direção hidráulica": "sim" }
 *                 valorDiaria:
 *                   type: number
 *                   format: float
 *                   description: Valor da diária para aluguel do carro
 *                   example: 150.0
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   description: Data de cadastro do carro
 *                   example: "2023-07-15T08:30:00Z"
 *                 dataDeExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: Data de exclusão do carro, se aplicável
 *                   example: null
 *       '400':
 *         description: Requisição inválida (ID incorreto)
 *       '401':
 *         description: Não autorizado (falha na autenticação)
 *       '404':
 *         description: Carro não encontrado
 *       '500':
 *         description: Erro interno no servidor
 */
carroRouter.get('/:id', privateRoute, async (req, res, next) => {
  try {
    await carroController.findCarroId(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/carros:
 *   get:
 *     summary: Lista todos os carros
 *     tags:
 *       - Carros
 *     description: >
 *       Endpoint protegido para listar todos os carros cadastrados no sistema.
 *       É necessário um token JWT para acessar essa rota.
 *     security:
 *       - bearerAuth: []  # Rota protegida pelo JWT
 *     responses:
 *       '200':
 *         description: Lista de carros retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: ID do carro
 *                     example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                   placa:
 *                     type: string
 *                     description: Placa do carro
 *                     example: "ABC-1234"
 *                   marca:
 *                     type: string
 *                     description: Marca do carro
 *                     example: "Ford"
 *                   modelo:
 *                     type: string
 *                     description: Modelo do carro
 *                     example: "Fiesta"
 *                   ano:
 *                     type: integer
 *                     description: Ano de fabricação do carro
 *                     example: 2020
 *                   km:
 *                     type: integer
 *                     description: Quilometragem do carro
 *                     example: 15000
 *                   items:
 *                     type: object
 *                     description: Itens adicionais do carro
 *                     additionalProperties:
 *                       type: string
 *                     example: { "ar-condicionado": "sim", "direção hidráulica": "sim" }
 *                   valorDiaria:
 *                     type: number
 *                     format: float
 *                     description: Valor da diária para aluguel do carro
 *                     example: 150.0
 *                   dataCadastro:
 *                     type: string
 *                     format: date-time
 *                     description: Data de cadastro do carro
 *                     example: "2023-07-15T08:30:00Z"
 *                   dataDeExclusao:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     description: Data de exclusão do carro, se aplicável
 *                     example: null
 *       '401':
 *         description: Não autorizado (falha na autenticação)
 *       '500':
 *         description: Erro interno no servidor
 */
carroRouter.get('/', privateRoute, async (req, res, next) => {
  try {
    await carroController.findCarros(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/carros/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um carro por ID
 *     tags:
 *       - Carros
 *     description: >
 *       Endpoint protegido para atualizar parcialmente as informações de um carro específico pelo ID.
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
 *         description: ID único do carro
 *         example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placa:
 *                 type: string
 *                 description: Placa do carro
 *                 example: "XYZ-5678"
 *               marca:
 *                 type: string
 *                 description: Marca do carro
 *                 example: "Toyota"
 *               modelo:
 *                 type: string
 *                 description: Modelo do carro
 *                 example: "Corolla"
 *               ano:
 *                 type: integer
 *                 description: Ano de fabricação do carro
 *                 example: 2018
 *               km:
 *                 type: integer
 *                 description: Quilometragem do carro
 *                 example: 20000
 *               items:
 *                 type: object
 *                 description: Itens adicionais do carro, como ar-condicionado ou direção hidráulica.
 *                 additionalProperties:
 *                   type: string
 *                 example: { "ar-condicionado": "sim", "direção hidráulica": "sim" }
 *               valorDiaria:
 *                 type: number
 *                 format: float
 *                 description: Valor da diária para aluguel do carro
 *                 example: 180.0
 *     responses:
 *       '200':
 *         description: Carro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: ID do carro atualizado
 *                   example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                 placa:
 *                   type: string
 *                   description: Placa do carro
 *                   example: "XYZ-5678"
 *                 marca:
 *                   type: string
 *                   description: Marca do carro
 *                   example: "Toyota"
 *                 modelo:
 *                   type: string
 *                   description: Modelo do carro
 *                   example: "Corolla"
 *                 ano:
 *                   type: integer
 *                   description: Ano de fabricação do carro
 *                   example: 2018
 *                 km:
 *                   type: integer
 *                   description: Quilometragem do carro
 *                   example: 20000
 *                 items:
 *                   type: object
 *                   description: Itens adicionais do carro
 *                   additionalProperties:
 *                     type: string
 *                   example: { "ar-condicionado": "sim", "direção hidráulica": "sim" }
 *                 valorDiaria:
 *                   type: number
 *                   format: float
 *                   description: Valor da diária para aluguel do carro
 *                   example: 180.0
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   description: Data de cadastro do carro
 *                   example: "2023-07-15T08:30:00Z"
 *                 dataDeExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: Data de exclusão do carro, se aplicável
 *                   example: null
 *       '400':
 *         description: Requisição inválida (dados incorretos ou ausentes)
 *       '401':
 *         description: Não autorizado (falha na autenticação)
 *       '404':
 *         description: Carro não encontrado
 *       '500':
 *         description: Erro interno no servidor
 */
carroRouter.patch('/:id', privateRoute, async (req, res, next) => {
  try {
    await carroController.patchCarro(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/carros/{id}:
 *   delete:
 *     summary: Exclui um carro logicamente por ID
 *     tags:
 *       - Carros
 *     description: >
 *       Endpoint protegido para excluir logicamente um carro pelo seu ID.
 *       A exclusão é realizada definindo a data de exclusão (`dataDeExclusao`) ao invés de remover o registro.
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
 *         description: ID único do carro a ser excluído
 *         example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *     responses:
 *       '200':
 *         description: Carro excluído logicamente com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de confirmação
 *                   example: "Carro excluído com sucesso"
 *                 dataDeExclusao:
 *                   type: string
 *                   format: date-time
 *                   description: Data de exclusão lógica do carro
 *                   example: "2023-07-15T08:30:00Z"
 *       '400':
 *         description: Requisição inválida (ID incorreto)
 *       '401':
 *         description: Não autorizado (falha na autenticação)
 *       '404':
 *         description: Carro não encontrado
 *       '500':
 *         description: Erro interno no servidor
 */
carroRouter.delete('/:id', privateRoute, async (req, res, next) => {
  try {
    await carroController.deleteCarro(req, res, next)
  } catch (error) {
    next(error)
  }
})

export default carroRouter
