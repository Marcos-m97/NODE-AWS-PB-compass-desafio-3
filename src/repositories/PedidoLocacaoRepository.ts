import Pedido from '../models/Pedido.js'
import Carro from '../models/Carro.js'
import Cliente from '../models/Cliente.js'
import { Op, WhereOptions, Optional, Sequelize } from 'sequelize'
import IPedido from '../interfaces/IPedidos.js'
import { UUID } from 'crypto'
import { AppErrors } from '../middlewers/errorMiddlewere.js'
import EStatusPedido from '../enums/EPedido.js'

class PedidoRepository {
  public async findCarro(id: UUID): Promise<Carro | null> {
    try {
      const carro = await Carro.findOne({ where: { id } })
      return carro
    } catch (error) {
      throw error
    }
  }

  public async findValorDiariaCarro(
    pedidoId: UUID
  ): Promise<{ carro: { valorDiaria: number } }> {
    try {
      const pedidoValorDiariaCarro = await Pedido.findOne({
        where: { id: pedidoId },
        include: [
          {
            model: Carro,
            as: 'carro',
            attributes: ['valorDiaria']
          }
        ]
      })

      if (!pedidoValorDiariaCarro) {
        throw new Error('Pedido ou carro não encontrado')
      }

      const carro = pedidoValorDiariaCarro.get('carro') as Carro

      return {
        carro: {
          valorDiaria: carro.valorDiaria
        }
      }
    } catch (error) {
      throw error
    }
  }

  public async findCliente(id: UUID): Promise<Cliente | null> {
    try {
      const cliente = await Cliente.findOne({ where: { id } })
      return cliente
    } catch (error) {
      throw error
    }
  }

  public async findPedidoEmAberto(id: UUID): Promise<Pedido | null> {
    try {
      const pedidoEmAberto = await Pedido.findOne({
        where: {
          clienteId: id,
          statusPedido: 'Aberto'
        }
      })
      return pedidoEmAberto
    } catch (error) {
      throw error
    }
  }

  public async createPedido(
    newPedidoData: Optional<IPedido, 'id'>
  ): Promise<Pedido> {
    try {
      const pedido = await Pedido.create(newPedidoData)
      return pedido
    } catch (error) {
      throw error
    }
  }

  public async findDataFinal(id: UUID): Promise<Pedido | null> {
    try {
      const dataFinalId = await Pedido.findOne({
        where: {
          id: id
        },
        attributes: ['dataHoraFinal']
      })

      return dataFinalId
    } catch (error) {
      throw error
    }
  }

  public async findPedidoId(id: UUID): Promise<Pedido | null> {
    try {
      const existingPedidoId = await Pedido.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: Cliente,
            as: 'cliente'
          },
          {
            model: Carro,
            as: 'carro'
          }
        ],
        attributes: [
          'id',
          'statusPedido',
          'dataPedido',
          'dataHoraInicial',
          'dataHoraFinal',
          'taxaLocacao',
          'valorTotal',
          'cep',
          'cidade',
          'uf'
        ]
      })
      return existingPedidoId
    } catch (error) {
      throw error
    }
  }

  public async findPedidoAll(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ total: number; totalPages: number; pedidos: Pedido[] }> {
    try {
      const { count, rows } = await Pedido.findAndCountAll({
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nome', 'cpf']
          }
        ],
        attributes: [
          'id',
          'statusPedido',
          'dataPedido',
          'dataHoraInicial',
          'dataHoraFinal',
          'taxaLocacao',
          'valorTotal',
          'cep',
          'cidade',
          'uf'
        ],
        limit: pageSize,
        offset: (page - 1) * pageSize
      })

      const totalPages = Math.ceil(count / pageSize)

      return {
        total: count,
        totalPages: totalPages,
        pedidos: rows
      }
    } catch (error) {
      throw error
    }
  }

  public async findPedidoAllStatusPedido(
    statusPedido?: string | null
  ): Promise<Pedido[] | null> {
    try {
      const whereIsNull = statusPedido ? { statusPedido: statusPedido } : {}

      const pedidosWithStatusPedido = await Pedido.findAll({
        where: whereIsNull,
        include: [
          {
            model: Cliente,
            as: 'cliente'
          }
        ],
        attributes: [
          'id',
          'statusPedido',
          'dataPedido',
          'dataHoraInicial',
          'dataHoraFinal',
          'taxaLocacao',
          'valorTotal',
          'cep',
          'cidade',
          'uf'
        ]
      })
      return pedidosWithStatusPedido
    } catch (error) {
      throw error
    }
  }

  public async findPedidoForCpf(
    cpfCliente?: string | null
  ): Promise<Pedido[] | null> {
    try {
      if (!cpfCliente) {
        throw new AppErrors('CPF não fornecido.', 404)
      }

      const pedidosWithCpf = await Pedido.findAll({
        include: [
          {
            model: Cliente,
            as: 'cliente',
            where: {
              cpf: cpfCliente
            }
          }
        ],
        attributes: [
          'id',
          'statusPedido',
          'dataPedido',
          'dataHoraInicial',
          'dataHoraFinal',
          'taxaLocacao',
          'valorTotal',
          'cep',
          'cidade',
          'uf'
        ]
      })

      return pedidosWithCpf
    } catch (error) {
      throw error
    }
  }

  public async findPedidoForRangeData(
    dataInicial?: Date | null,
    dataFinal?: Date | null,
    orderDirection: 'ASC' | 'DESC' = 'ASC'
  ): Promise<Pedido[] | null> {
    try {
      const where: WhereOptions<IPedido> = {}

      // Condição para dataInicial e dataFinal
      if (dataInicial && dataFinal) {
        where.dataHoraInicial = {
          [Op.between]: [
            Sequelize.fn('DATE', dataInicial),
            Sequelize.fn('DATE', dataFinal)
          ]
        }
        where.dataHoraFinal = {
          [Op.lte]: Sequelize.fn('DATE', dataFinal)
        }
      } else if (dataInicial) {
        where.dataHoraInicial = {
          [Op.gte]: Sequelize.fn('DATE', dataInicial)
        }
      } else if (dataFinal) {
        where.dataHoraInicial = {
          [Op.lte]: Sequelize.fn('DATE', dataFinal)
        }
      }

      const pedidos = await Pedido.findAll({
        where,
        include: [
          {
            model: Cliente,
            as: 'cliente'
          }
        ],
        attributes: [
          'id',
          'statusPedido',
          'dataHoraInicial',
          'dataHoraFinal',
          'taxaLocacao',
          'valorTotal',
          'cep',
          'cidade',
          'uf'
        ],
        order: [['dataHoraInicial', orderDirection]]
      })

      return pedidos
    } catch (error) {
      throw error
    }
  }

  public async findStatusPedidoId(id: UUID): Promise<Pedido> {
    try {
      const statusPedido = await Pedido.findOne({
        where: {
          id: id
        },
        attributes: ['statusPedido']
      })

      if (!statusPedido) {
        return {} as Pedido
      }

      return statusPedido
    } catch (error) {
      throw error
    }
  }

  public async updatePedidoId(
    id: UUID,
    dadosAtualizados: Partial<{
      statusPedido?: EStatusPedido
      dataCancelamento?: Date
      dataFechamento?: Date
      dataHoraInicial?: Date
      dataHoraFinal?: Date
      taxaLocacao?: number | null
      valorTotal: number
      valorMulta?: number
      cep: string | null
      cidade?: string | null
      uf?: string | null
    }>
  ): Promise<Pedido | null> {
    try {
      const [affectedRows] = await Pedido.update(dadosAtualizados, {
        where: { id },
        returning: true
      })

      if (affectedRows === 0) {
        return null
      }

      const pedidoAtualizado = await Pedido.findOne({ where: { id } })

      return pedidoAtualizado
    } catch (error) {
      throw error
    }
  }
}
export default PedidoRepository
