import { Request, Response, NextFunction } from 'express'
import PedidoService from '../services/PedidoLocacaoService.js'
import Pedido from '../models/Pedido.js'


import PedidoRequestBody, {
  filtertype
} from '../definitions/pedidos.def/IPedidoRequestBody.js'

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
      const id = req.params.id
      const pedido = await this.pedidoService.searchIdPedido(id)
      return res.status(200).json(pedido)
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
      const filter: filtertype = {
        cpf: req.query.cpf as string,
        orderBy: (req.query.orderBy as string) || 'ASC',
        page: parseInt(req.query.page as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 5,
        statusPedido: req.query.statusPedido as string,
        dataHoraInicial: req.query.dataHoraInicial
          ? new Date(req.query.dataHoraInicial as string)
          : undefined,
        dataHoraFinal: req.query.dataHoraFinal
          ? new Date(req.query.dataHoraFinal as string)
          : undefined
      }

      if (filter.statusPedido) {
        const pedidoAllStatusPedido = await this.pedidoService.searchAllPedidos(
          filter.statusPedido
        )
        return res.status(200).json(pedidoAllStatusPedido)
      }

      if (filter.cpf) {
        const pedidoByCpf = await this.pedidoService.searchPedidoForCpf(
          filter.cpf
        )
        return res.status(200).json(pedidoByCpf)
      }

      if (filter.dataHoraInicial || filter.dataHoraFinal || filter.orderBy) {
        const pedidoByRangeData =
          await this.pedidoService.searchPedidoForRangeData(
            filter.dataHoraInicial,
            filter.dataHoraFinal,
            filter.orderBy
          )
        return res.status(200).json(pedidoByRangeData)
      }

      const pedidoAllPageSize = await this.pedidoService.searchAllPedidos(
        null,
        filter.page,
        filter.pageSize
      )
      return res.status(200).json(pedidoAllPageSize)
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
      const id = req.params.id
      const pedidoDelete = await this.pedidoService.deletePedido(id)
      return res.status(204).json(pedidoDelete)
    } catch (error) {
      next(error)
    }
  }
}

export default PedidoController
