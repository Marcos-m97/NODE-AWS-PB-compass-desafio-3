import { Request, Response, NextFunction } from 'express'
import PedidoService from '../services/PedidoLocacaoService.js'
import Pedido from '../models/Pedido.js'

// import Intefaces
import PedidoRequestBody from '../interfaces/IPedidoRequestBody.js'

class PedidoController {
  private pedidoService: PedidoService
  constructor(pedidoService: PedidoService) {
    this.pedidoService = pedidoService
  }

  public async pedidoCreate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const pedidoData: Pedido = req.body
      const pedido = await this.pedidoService.createPedido(pedidoData)
      return res.status(201).json(pedido)
    } catch (error) {
      next(error)
    }
  }

  public async searchPedido(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const pedidoIdData: Pedido = req.body
      const pedidoId = await this.pedidoService.searchIdPedido(pedidoIdData)
      return res.status(200).json(pedidoId)
    } catch (error) {
      next(error)
    }
  }

  public async searchPedidoAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const pedidoAllData: PedidoRequestBody = req.body

      if (pedidoAllData.statusPedido) {
        const pedidoAllStatusPedido = await this.pedidoService.searchAllPedidos(
          pedidoAllData.statusPedido
        )
        return res.status(201).json(pedidoAllStatusPedido)
      }

      if (pedidoAllData.cpf || pedidoAllData.cpf === '') {
        const pedidoByCpf = await this.pedidoService.searchPedidoForCpf(
          pedidoAllData.cpf
        )
        return res.status(201).json(pedidoByCpf)
      }

      if (
        pedidoAllData.dataHoraInicial ||
        pedidoAllData.dataHoraFinal ||
        pedidoAllData.orderBy
      ) {
        const { dataHoraInicial, dataHoraFinal, orderBy } = req.body

        const pedidoByRangeData =
          await this.pedidoService.searchPedidoForRangeData(
            dataHoraInicial,
            dataHoraFinal,
            orderBy
          )

        return res.status(200).json(pedidoByRangeData)
      }

      if (pedidoAllData.page || pedidoAllData.pageSize) {
        const pedidoAllPageSize = await this.pedidoService.searchAllPedidos(
          null,
          pedidoAllData.page,
          pedidoAllData.pageSize
        )
        return res.status(201).json(pedidoAllPageSize)
      }
    } catch (error) {
      next(error)
    }
  }

  public async updateId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const pedidoUpdateData: PedidoRequestBody = req.body
      const pedidoUpdateId = await this.pedidoService.updatePedido(
        pedidoUpdateData
      )

      return res.status(204).json(pedidoUpdateId)
    } catch (error) {
      next(error)
    }
  }

  public async deletePedido(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const pedidoDeleteData: PedidoRequestBody = req.body
      const pedidoDelete = await this.pedidoService.deletePedido(
        pedidoDeleteData
      )

      return res.status(204).json(pedidoDelete)
    } catch (error) {
      next(error)
    }
  }
}

export default PedidoController
