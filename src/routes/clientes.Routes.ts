import { Router } from 'express'
import ClienteControler from '../controllers/client.controllers.js'
import ClienteService from '../services/clientes.service.js'
import ClientesRepositorie from '../repositories/clientes.repositorie.js'
import privateRoute from '../middlewares/auth.middlewere.js'

const clienteRouter = Router()

const cientesRepositorie = new ClientesRepositorie()
const clienteService = new ClienteService(cientesRepositorie)
const clienteControler = new ClienteControler(clienteService)

/**
 * @swagger
 * /api/v1/clientes/cadastro:
 *   post:
 *     summary: Cria um novo cliente
 *     tags:
 *       - Clientes
 *     description: >
 *       Endpoint protegido para cadastrar um novo cliente no sistema.
 *       É necessário um token JWT para acessar essa rota.
 *     security:
 *       - bearerAuth: []  #  Rota está protegida pelo JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomeCompleto
 *               - dataDeNascimento
 *               - cpf
 *               - email
 *               - telefone
 *             properties:
 *               nomeCompleto:
 *                 type: string
 *                 example: "Kelly Slater"
 *               dataDeNascimento:
 *                 type: string
 *                 format: date
 *                 example: "1997-11-11"
 *               cpf:
 *                 type: string
 *                 example: "321.654.987-22"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "example.test95@yahoo.com"
 *               telefone:
 *                 type: string
 *                 example: "11987654321"
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "e7d66f9d-3c10-4e9e-b939-8a3a19159b6d"
 *                 nomeCompleto:
 *                   type: string
 *                   example: "Kelly Slater"
 *                 dataDeNascimento:
 *                   type: string
 *                   format: date
 *                   example: "1997-11-11"
 *                 cpf:
 *                   type: string
 *                   example: "321.654.987-22"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "example.test95@yahoo.com"
 *                 telefone:
 *                   type: string
 *                   example: "11987654321"
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-12T19:34:42.000Z"
 *       400:
 *         description: Requisição inválida (dados incorretos ou ausentes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dados inválidos: Data de Nascimento inválida"
 *       401:
 *         description: Falha na autenticação JWT (Token ausente ou inválido)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido ou ausente"
 *       500:
 *         description: Erro interno no servidor
 */

clienteRouter.post('/cadastro', privateRoute, async (req, res, next) => {
  try {
    await clienteControler.createClientes(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/clientes/visualizar/{id}:
 *   get:
 *     summary: Visualizar um cliente pelo ID
 *     tags:
 *       - Clientes
 *     description: Endpoint para visualizar as informações detalhadas de um cliente específico, utilizando seu ID.
 *     security:
 *       - bearerAuth: []  # Rota protegida por autenticação JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do cliente a ser visualizado
 *     responses:
 *       200:
 *         description: Cliente retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "e7d66f9d-3c10-4e9e-b939-8a3a19159b6d"
 *                 nomeCompleto:
 *                   type: string
 *                   example: "alan Lima pereira"
 *                 dataDeNascimento:
 *                   type: string
 *                   format: date
 *                   example: "1997-11-11"
 *                 cpf:
 *                   type: string
 *                   example: "321.654.987-22"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "marian111.lima95@yahoo.com"
 *                 telefone:
 *                   type: string
 *                   example: "11987654321"
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-13T17:39:38.000Z"
 *                 dataExclusao:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Falha na autenticação JWT (Token inválido ou ausente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido ou ausente"
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente não encontrado"
 *       500:
 *         description: Erro interno no servidor
 */

clienteRouter.get('/visualizar/:id', privateRoute, async (req, res, next) => {
  try {
    await clienteControler.getCliente(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/clientes/list:
 *   get:
 *     summary: Lista todos os clientes cadastrados (incluindo excluídos ou não)
 *     tags:
 *       - Clientes
 *     description: >
 *       Endpoint para listar todos os clientes cadastrados, com a possibilidade de filtrar por nome, email, CPF, telefone e status de exclusão (excluídos ou não).
 *       Esta rota é protegida por autenticação via token JWT.
 *     security:
 *       - bearerAuth: [] # Rota protegida pelo middleware JWT
 *     parameters:
 *       - in: query
 *         name: nomeCompleto
 *         schema:
 *           type: string
 *         description: Parte do nome do cliente
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         description: CPF completo e válido do cliente
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: Parte do email do cliente
 *       - in: query
 *         name: telefone
 *         schema:
 *           type: string
 *         description: Parte do telefone do cliente
 *       - in: query
 *         name: excluido
 *         schema:
 *           type: string
 *           enum: [sim, não]  # Define as opções para o filtro de excluído
 *         description: >
 *           Filtrar clientes excluídos (sim) ou não excluídos (não).
 *           Valor padrão: "não".
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 5
 *           maximum: 10
 *         description: >
 *           Quantidade máxima de clientes por página.
 *           (default: 5, min: 5, max: 10)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: >
 *           Página atual da paginação.
 *           Valor padrão: 1.
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [nomeCompleto, dataCadastro, dataExclusao]
 *         description: >
 *           Campo pelo qual a listagem deve ser ordenada.
 *           Exemplos: nomeCompleto, dataCadastro, dataExclusao.
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Direção da ordenação (ascendente ou descendente)
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalFound:
 *                   type: integer
 *                   example: 20
 *                 totalPages:
 *                   type: integer
 *                   example: 4
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 clients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "e7d66f9d-3c10-4e9e-b939-8a3a19159b6d"
 *                       nomeCompleto:
 *                         type: string
 *                         example: "alan Lima pereira"
 *                       dataDeNascimento:
 *                         type: string
 *                         format: date
 *                         example: "1997-11-11"
 *                       cpf:
 *                         type: string
 *                         example: "321.654.987-22"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "marian111.lima95@yahoo.com"
 *                       telefone:
 *                         type: string
 *                         example: "11987654321"
 *                       dataCadastro:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-10-13T17:39:38.000Z"
 *                       dataExclusao:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: "2024-12-15T12:30:00.000Z"
 *       401:
 *         description: Falha na autenticação JWT (Token inválido ou ausente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido ou ausente"
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Requisição inválida. Verifique os parâmetros de entrada."
 *       500:
 *         description: Erro interno no servidor
 */

clienteRouter.get('/lista', privateRoute, async (req, res, next) => {
  try {
    await clienteControler.readClientes(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/clientes/atualizar/{id}:
 *   patch:
 *     summary: Atualiza um cliente existente
 *     tags:
 *       - Clientes
 *     description: Atualiza os dados de um cliente específico. Apenas os campos enviados serão atualizados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente a ser atualizado.
 *         schema:
 *           type: string
 *           example: "8468959e-9c86-4c47-bf44-c93f8c5e0a75"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeCompleto:
 *                 type: string
 *                 example: "Kelly Slater"
 *               dataDeNascimento:
 *                 type: string
 *                 format: date
 *                 example: "1997-11-11"
 *               cpf:
 *                 type: string
 *                 example: "321.654.987-22"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "WSL.ASP95@yahoo.com"
 *               telefone:
 *                 type: string
 *                 example: "1121964498732"
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do cliente atualizado
 *                   example: "e7d66f9d-3c10-4e9e-b939-8a3a19159b6d"
 *                 nomeCompleto:
 *                   type: string
 *                   example: "Joel Parkingson"
 *                 dataDeNascimento:
 *                   type: string
 *                   format: date
 *                   example: "1997-11-11"
 *                 cpf:
 *                   type: string
 *                   example: "321.654.987-22"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "marian111.lima95@yahoo.com"
 *                 telefone:
 *                   type: string
 *                   example: "1121964498732"
 *                 dataCadastro:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-10-12T19:34:42.000Z"
 *       400:
 *         description: Requisição inválida (dados incorretos, duplicados ou ausentes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CPF ou email já cadastrados, ou dados inválidos fornecidos"
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente não encontrado"
 *       500:
 *         description: Erro interno no servidor
 */

clienteRouter.patch('/atualizar/:id', privateRoute, async (req, res, next) => {
  try {
    await clienteControler.updateCliente(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/v1/clientes/excluir/{id}:
 *   delete:
 *     summary: Excluir cliente (soft delete)
 *     tags:
 *       - Clientes
 *     description: >
 *       Marca um cliente como excluído definindo a data de exclusão, sem remover o registro do banco de dados.
 *       A rota é protegida por autenticação via JWT.
 *     security:
 *       - bearerAuth: []  # Rota protegida por JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do cliente a ser excluído
 *     responses:
 *       200:
 *         description: Cliente excluído com sucesso (soft delete)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente excluído com sucesso"
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente não encontrado"
 *       400:
 *         description: Cliente já está excluído
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cliente já está excluído"
 *       500:
 *         description: Erro interno no servidor
 */

clienteRouter.delete('/excluir/:id', privateRoute, async (req, res, next) => {
  try {
    await clienteControler.deleteCliente(req, res, next)
  } catch (error) {
    next(error)
  }
})

export default clienteRouter
