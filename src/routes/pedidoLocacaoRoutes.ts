import { Router } from 'express'
import PedidoController from '../controllers/PedidoLocacaoController.js'
import PedidoRepository from '../repositories/PedidoLocacaoRepository.js'
import PedidoService from '../services/PedidoLocacaoService.js'
import privateRoute from '../middlewares/auth.middlewere.js'

const pedidoRouter = Router()

// import dep.
const pedidoRepository = new PedidoRepository()
const pedidoService = new PedidoService(pedidoRepository)
const pedidoController = new PedidoController(pedidoService)

// Swagger Create
/**
 * @swagger
 * /api/v1/pedidos/create:
 *   post:
 *     summary: Realiza a criação de pedidos no sistema.
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: number
 *                 description: O Id do Usuário.
 *                 example: 1
 *               carroId:
 *                 type: number
 *                 description: O Id do Carro.
 *                 example: 2
 *     responses:
 *       201:
 *         description: Retorna um JSON do Pedido criado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do pedido criado.
 *                   example: "649350eb-2e93-44d2-b0cf-b1713a8..."
 *                 dataPedido:
 *                   type: date
 *                   description: Data de criação do pedido.
 *                   example: "2024-10-15T12:06:45.857Z"
 *                 statusPedido:
 *                   type: enum
 *                   description: Status atual do pedido.
 *                   example: "Aberto"
 *                 cep:
 *                   type: string or null
 *                   description: CEP do endereço do cliente.
 *                   example: "null"
 *                 cidade:
 *                   type: string or null
 *                   description: Cidade encontrada na busca pelo ViaCep.
 *                   example: "null"
 *                 uf:
 *                   type: string or null
 *                   description: UF encontrada na busca pelo ViaCep.
 *                   example: "null"
 *                 taxaLocacao:
 *                   type: number
 *                   description: Valor da Taxa de locação por UF.
 *                   example: 0
 *                 valorTotal:
 *                   type: number
 *                   description: Valor Total da Locação + Diárias.
 *                   example: 0
 *                 dataHoraInicial:
 *                   type: date or null
 *                   description: Data e Hora inicial da Locação.
 *                   example: null
 *                 dataHoraFinal:
 *                   type: date or null
 *                   description: Data e Hora final da Locação.
 *                   example: null
 *                 dataCancelamento:
 *                   type: date or null
 *                   description: Data do cancelamento do pedido.
 *                   example: null
 *                 dataFechamento:
 *                   type: date or null
 *                   description: Data do fechamento do pedido.
 *                   example: null
 *                 valorMulta:
 *                   type: number or null
 *                   description: Valor de multa gerado por atraso.
 *                   example: null
 *                 clienteId:
 *                   type: number
 *                   description: Id do cliente associado ao Pedido.
 *                   example: 10
 *                 carroId:
 *                   type: number
 *                   description: Id do carro associado ao Pedido.
 *                   example: 2
 *       404:
 *         description: "Carro ou Cliente não encontrados"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Mensagem de erro"
 *                   example: "Cliente não encontrado"
 *
 */

pedidoRouter.post('/create', privateRoute, async (req, res, next) => {
  try {
    await pedidoController.pedidoCreate(req, res, next)
  } catch (error) {
    next(error)
  }
})

// Swagger SearchId
/**
 * @swagger
 * /api/v1/pedidos/searchId:
 *   get:
 *     summary: Retorna os detalhes de um pedido específico.
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: UUID
 *                 description: ID do Pedido.
 *                 example: "5e07e29e-a3d8-440b-8991-7703773b6..."
 *
 *     responses:
 *       200:
 *         description: Detalhes do Pedido retornado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do pedido.
 *                   example: "5e07e29e-a3d8-440b-8991-7703773b6199"
 *                 statusPedido:
 *                   type: string
 *                   description: Status atual do pedido.
 *                   example: "Cancelado"
 *                 dataPedido:
 *                   type: string
 *                   format: date-time
 *                   description: Data de criação do pedido.
 *                   example: "2024-10-13T02:26:49.000Z"
 *                 dataHoraInicial:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora de início da locação.
 *                   example: "2024-10-14T18:00:00.000Z"
 *                 dataHoraFinal:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora de término da locação.
 *                   example: "2024-10-15T03:00:00.000Z"
 *                 taxaLocacao:
 *                   type: number
 *                   description: Valor da taxa de locação.
 *                   example: 170
 *                 valorTotal:
 *                   type: number
 *                   description: Valor total da locação.
 *                   example: 0
 *                 cep:
 *                   type: string
 *                   description: CEP do cliente.
 *                   example: "13486-470"
 *                 cidade:
 *                   type: string
 *                   description: Cidade do cliente.
 *                   example: "Limeira"
 *                 uf:
 *                   type: string
 *                   description: Estado (UF) do cliente.
 *                   example: "SP"
 *                 cliente:
 *                   type: object
 *                   description: Informações do cliente.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID do cliente.
 *                       example: "6"
 *                     nome:
 *                       type: string
 *                       description: Nome do cliente.
 *                       example: "Pedro Fernandes"
 *                     dataNascimento:
 *                       type: string
 *                       format: date
 *                       description: Data de nascimento do cliente.
 *                       example: "1993-12-10T00:00:00.000Z"
 *                     cpf:
 *                       type: string
 *                       description: CPF do cliente.
 *                       example: "666.777.888-99"
 *                     email:
 *                       type: string
 *                       description: E-mail do cliente.
 *                       example: "pedro.fernandes@email.com"
 *                     telefone:
 *                       type: string
 *                       description: Telefone do cliente.
 *                       example: "(81) 99876-5432"
 *                     dataCadastro:
 *                       type: string
 *                       format: date
 *                       description: Data de cadastro do cliente.
 *                       example: "2024-10-11"
 *                     dataExclusao:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                       description: Data de exclusão do cliente, se aplicável.
 *                       example: null
 *                 carro:
 *                   type: object
 *                   description: Informações do carro.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID do carro.
 *                       example: "2"
 *                     marca:
 *                       type: string
 *                       description: Marca do carro.
 *                       example: "Toyota"
 *                     modelo:
 *                       type: string
 *                       description: Modelo do carro.
 *                       example: "Corolla"
 *                     ano:
 *                       type: number
 *                       description: Ano de fabricação do carro.
 *                       example: 2015
 *                     km:
 *                       type: number
 *                       description: Quilometragem do carro.
 *                       example: 60500
 *                     items:
 *                       type: array
 *                       description: Itens disponíveis no carro.
 *                       items:
 *                         type: string
 *                       example:
 *                         - "Ar-Condicionado"
 *                         - "Air-bags"
 *                         - "Freios ABS"
 *                     placa:
 *                       type: string
 *                       description: Placa do carro.
 *                       example: "DEF-5678"
 *                     valorDiaria:
 *                       type: number
 *                       description: Valor da diária do carro.
 *                       example: 150
 *       404:
 *         description: Pedido não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro.
 *                   example: "Pedido não encontrado."
 */

pedidoRouter.get('/searchId', privateRoute, async (req, res, next) => {
  try {
    await pedidoController.searchPedido(req, res, next)
  } catch (error) {
    next(error)
  }
})

// Swagger SearchAll
/**
 * @swagger
 * /api/v1/pedidos:
 *   get:
 *     summary: Retorna uma lista de pedidos paginados.
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: number
 *                 description: Página selecionado dos Pedidos.
 *                 example: 1
 *               pageSize:
 *                 type: number
 *                 description: Quantidade de pedidos que aparecem por página.
 *                 example: 5
 *     responses:
 *       200:
 *         description: Retorna uma lista de pedidos com paginação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número total de pedidos.
 *                   example: 8
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas.
 *                   example: 2
 *                 pedidos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID do pedido.
 *                         example: "5e07e29e-a3d8-440b-8991-7703773b6199"
 *                       statusPedido:
 *                         type: string
 *                         description: Status do pedido.
 *                         example: "Cancelado"
 *                       dataPedido:
 *                         type: string
 *                         format: date-time
 *                         description: Data de criação do pedido.
 *                         example: "2024-10-13T02:26:49.000Z"
 *                       dataHoraInicial:
 *                         type: string
 *                         format: date-time
 *                         description: Data e hora inicial da locação.
 *                         example: "2024-10-14T18:00:00.000Z"
 *                       dataHoraFinal:
 *                         type: string
 *                         format: date-time
 *                         description: Data e hora final da locação.
 *                         example: "2024-10-15T03:00:00.000Z"
 *                       taxaLocacao:
 *                         type: number
 *                         description: Taxa de locação aplicada.
 *                         example: 170
 *                       valorTotal:
 *                         type: number
 *                         description: Valor total da locação.
 *                         example: 0
 *                       cep:
 *                         type: string
 *                         description: CEP do endereço do cliente.
 *                         example: "13486-470"
 *                       cidade:
 *                         type: string
 *                         description: Cidade do cliente.
 *                         example: "Limeira"
 *                       uf:
 *                         type: string
 *                         description: Estado do cliente.
 *                         example: "SP"
 *                       cliente:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: ID do cliente.
 *                             example: "6"
 *                           nome:
 *                             type: string
 *                             description: Nome do cliente.
 *                             example: "Pedro Fernandes"
 *                           cpf:
 *                             type: string
 *                             description: CPF do cliente.
 *                             example: "666.777.888-99"
 *                       exemplosPedidos:
 *                         type: array
 *                         description: Exemplo de mais pedidos.
 *                         example:
 *                           - id: "60f02aab-1539-445e-949b-d2c73d180f47"
 *                             statusPedido: "Fechado"
 *                             dataPedido: "2024-10-14T02:26:41.000Z"
 *                             dataHoraInicial: "2024-10-14T23:00:00.000Z"
 *                             dataHoraFinal: "2024-10-13T03:00:00.000Z"
 *                             taxaLocacao: 170
 *                             valorTotal: 1570
 *                             cep: "13482-792"
 *                             cidade: "Limeira"
 *                             uf: "SP"
 *                             cliente:
 *                               id: "1"
 *                               nome: "Ana Oliveira"
 *                               cpf: "111.222.333-44"
 *                           - id: "649350eb-2e93-44d2-b0cf-b1713a86a081"
 *                             statusPedido: "Aberto"
 *                             dataPedido: "2024-10-15T12:06:45.000Z"
 *                             dataHoraInicial: null
 *                             dataHoraFinal: null
 *                             taxaLocacao: 0
 *                             valorTotal: 0
 *                             cep: null
 *                             cidade: null
 *                             uf: null
 *                             cliente:
 *                               id: "10"
 *                               nome: "Gustavo Lima"
 *                               cpf: "000.111.222-33"
 *       400:
 *         description: Requisição inválida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada.
 *                   example: "Requisição inválida."
 *       404:
 *         description: Nenhum pedido encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada.
 *                   example: "Nenhum pedido encontrado."
 */
pedidoRouter.get('/searchAll', privateRoute, async (req, res, next) => {
  try {
    await pedidoController.searchPedidoAll(req, res, next)
  } catch (error) {
    next(error)
  }
})

// Swagger UpdatePedido
/**
 * @swagger
 * /api/v1/pedidos/updatePedido:
 *   patch:
 *     summary: Atualiza os detalhes de um pedido específico.
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido a ser atualizado.
 *         example: "71ad2628-b67a-4e90-beac-8a76b2e8..."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: UUID
 *                 description: ID do Pedido.
 *                 example: "71ad2628-b67a-4e90-beac-8a76b2e8..."
 *               cep:
 *                 type: string
 *                 description: Novo CEP do pedido.
 *                 example: "47270000"
 *               dataHoraInicial:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data e hora de início da locação.
 *                 example: "2024-10-15T12:26:46"
 *               dataHoraFinal:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data e hora de término da locação.
 *                 example: "2024-10-20T02:26:49"
 *     responses:
 *       204:
 *         description: Pedido atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do pedido atualizado.
 *                   example: "71ad2628-b67a-4e90-beac-8a76b2e85307"
 *                 clienteId:
 *                   type: string
 *                   description: ID do cliente associado ao pedido.
 *                   example: "8"
 *                 carroId:
 *                   type: string
 *                   description: ID do carro associado ao pedido.
 *                   example: "2"
 *                 dataPedido:
 *                   type: string
 *                   format: date-time
 *                   description: Data de criação do pedido.
 *                   example: "2024-10-14T22:48:09.000Z"
 *                 statusPedido:
 *                   type: string
 *                   description: Status atual do pedido.
 *                   example: "Aprovado"
 *                 cep:
 *                   type: string
 *                   description: CEP atualizado do cliente.
 *                   example: "47270000"
 *                 cidade:
 *                   type: string
 *                   description: Cidade atualizada do cliente.
 *                   example: "Pilão Arcado"
 *                 uf:
 *                   type: string
 *                   description: Estado atualizado do cliente.
 *                   example: "BA"
 *                 taxaLocacao:
 *                   type: number
 *                   description: Taxa de locação aplicada.
 *                   example: 50
 *                 valorTotal:
 *                   type: number
 *                   description: Valor total da locação.
 *                   example: 800
 *                 dataHoraInicial:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora inicial da locação atualizada.
 *                   example: "2024-10-15T12:26:46"
 *                 dataHoraFinal:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora final da locação atualizada.
 *                   example: "2024-10-20T02:26:49"
 *                 dataCancelamento:
 *                   type: string
 *                   format: date-time
 *                   description: Data de cancelamento do pedido (se aplicável).
 *                   example: null
 *                 dataFechamento:
 *                   type: string
 *                   format: date-time
 *                   description: Data de fechamento do pedido (se aplicável).
 *                   example: null
 *                 valorMulta:
 *                   type: number
 *                   description: Valor da multa aplicada (se aplicável).
 *                   example: null
 *       400:
 *         description: Requisição inválida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Detalhes do erro.
 *                   example: "Requisição inválida."
 *       404:
 *         description: Pedido não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro.
 *                   example: "Pedido não encontrado."
 */
pedidoRouter.patch('/updatePedido', privateRoute, async (req, res, next) => {
  try {
    await pedidoController.updateId(req, res, next)
  } catch (error) {
    next(error)
  }
})

// Swagger deletePedido
/**
 * @swagger
 * /api/v1/pedidos/deletePedido:
 *   delete:
 *     summary: Cancela um pedido específico.
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido a ser Cancelado.
 *         example: "649350eb-2e93-44d2-b0cf-b1713a86a081"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID do pedido que será Cancelado.
 *                 example: "649350eb-2e93-44d2-b0cf-b1713a86a081"
 *     responses:
 *       204:
 *         description: Pedido cancelado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *                   example: "Pedido cancelado com sucesso."
 *       400:
 *         description: Requisição inválida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Detalhes do erro.
 *                   example: "Requisição inválida."
 *       404:
 *         description: Pedido não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro.
 *                   example: "Pedido não encontrado."
 */
pedidoRouter.delete('/deletePedido', privateRoute, async (req, res, next) => {
  try {
    await pedidoController.deletePedido(req, res, next)
  } catch (error) {
    next(error)
  }
})

export default pedidoRouter
