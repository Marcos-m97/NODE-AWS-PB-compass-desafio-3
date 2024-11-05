import PedidoRepository from '../repositories/PedidoLocacaoRepository.js'
import Pedido from '../models/Pedido.js'
import IPedido from '../definitions/pedidos.def/IPedidos.js'
import { AppErrors } from '../middlewares/errorMiddlewere.js'
import { calcularTaxaLocacao } from '../services/TaxaLocacaoService.js'
import axios from 'axios'
import https from 'https'
import EStatusPedido from '../definitions/pedidos.def/EPedido.js'

class PedidoService {
  private pedidoRepository: PedidoRepository
  constructor(pedidoRepository: PedidoRepository) {
    this.pedidoRepository = pedidoRepository
  }

  public async createPedido(pedidoData: Pedido): Promise<Pedido | null> {
    try {
      // validation carExisting & validation clientExisting
      const carExisting = await this.pedidoRepository.findCarro(
        pedidoData.carroId
      )
      const clientExisting = await this.pedidoRepository.findCliente(
        pedidoData.clienteId
      )
      const isPedidoEmAberto = await this.pedidoRepository.findPedidoEmAberto(
        pedidoData.clienteId
      )
      if (!carExisting && !clientExisting) {
        throw new AppErrors('Carro e cliente informados não existem.', 404)
      }
      if (!carExisting) {
        throw new AppErrors('Esse carro não existe.', 404)
      }
      if (!clientExisting) {
        throw new AppErrors('Esse cliente não existe.', 404)
      }
      if (isPedidoEmAberto) {
        throw new AppErrors('Esse cliente tem um pedido em Aberto.', 400)
      }

      if (clientExisting.dataExclusao) {
        throw new AppErrors('Esse cliente está excluído do sistema.', 400)
      }

      const newPedido: IPedido = {
        clienteId: pedidoData.clienteId,
        carroId: pedidoData.carroId
      }

      // convert the date for actual date
      const createdPedido = await this.pedidoRepository.createPedido(newPedido)
      const dataPedido = new Date(createdPedido.dataPedido)
      createdPedido.dataPedido = dataPedido

      return createdPedido
    } catch (error) {
      throw error
    }
  }

  public async searchIdPedido(pedidoData: Pedido): Promise<Pedido | null> {
    try {
      // validation this Id Pedido existing
      const pedidoIdExisting = await this.pedidoRepository.findPedidoId(
        pedidoData.id
      )

      if (!pedidoIdExisting) {
        throw new AppErrors('Esse pedido não existe.', 404)
      }

      return pedidoIdExisting
    } catch (error) {
      throw error
    }
  }

  public async searchAllPedidos(
    statusPedido?: string | null,
    page?: number,
    pageSize?: number
  ): Promise<
    { total: number; totalPages: number; pedidos: Pedido[] } | Pedido[] | null
  > {
    try {
      const pedidoAll = await this.pedidoRepository.findPedidoAll()

      if (page && pageSize) {
        const pedidoAllPages = await this.pedidoRepository.findPedidoAll(
          page,
          pageSize
        )
        return pedidoAllPages
      }

      if (statusPedido !== '') {
        const pedidoAllStatusPedido =
          await this.pedidoRepository.findPedidoAllStatusPedido(statusPedido)
        return pedidoAllStatusPedido
      }

      if (pedidoAll !== null) {
        throw new AppErrors('Você não tem pedidos.', 404)
      }

      return pedidoAll
    } catch (error) {
      throw error
    }
  }

  public async searchPedidoForCpf(
    cpfCliente?: string | null
  ): Promise<Pedido[] | null> {
    try {
      const pedidosForCpf = await this.pedidoRepository.findPedidoForCpf(
        cpfCliente
      )

      if (
        !pedidosForCpf ||
        (Array.isArray(pedidosForCpf) && pedidosForCpf.length === 0)
      ) {
        throw new AppErrors('CPF não existe', 404)
      }

      return pedidosForCpf
    } catch (error) {
      throw error
    }
  }

  public async searchPedidoForRangeData(
    dataInicial?: Date | null,
    dataFinal?: Date | null,
    orderDirection?: 'ASC' | 'DESC'
  ): Promise<Pedido[] | null> {
    try {
      const pedidoForRangeData =
        await this.pedidoRepository.findPedidoForRangeData(
          dataInicial,
          dataFinal,
          orderDirection
        )

      return pedidoForRangeData
    } catch (error) {
      throw error
    }
  }

  public async updatePedido(
    pedidoData: Pedido
  ): Promise<Pedido | null | AppErrors> {
    try {
      const pedidoExisting = await this.pedidoRepository.findPedidoId(
        pedidoData.id
      )

      const statusPedidoData = await this.pedidoRepository.findStatusPedidoId(
        pedidoData.id
      )

      const valorDiaria = await this.pedidoRepository.findValorDiariaCarro(
        pedidoData.id
      )

      if (!pedidoExisting) {
        throw new AppErrors('Esse pedido não existe.', 404)
      }

      const dataHoraInicial = new Date(pedidoData.dataHoraInicial)
      const dataHoraFinal = new Date(pedidoData.dataHoraFinal)
      const dataAtual = new Date()

      const diffTime = Math.abs(
        dataHoraFinal.getTime() - dataHoraInicial.getTime()
      )
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (dataHoraInicial < dataAtual) {
        throw new AppErrors(
          'A data/hora inicial não pode ser anterior a data de hoje.',
          400
        )
      }

      if (dataHoraFinal < dataHoraInicial) {
        throw new AppErrors(
          'A data/hora Final não pode ser menor que a data inicial.',
          400
        )
      }

      if (pedidoData.cep) {
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false
        })

        const request = `https://viacep.com.br/ws/${pedidoData.cep}/json/`
        const response = await axios.get(request, { httpsAgent })

        if (response.data.erro) {
          throw new Error('CEP inválido.')
        }

        if (pedidoData.statusPedido === EStatusPedido.Cancelado) {
          if (statusPedidoData.statusPedido === EStatusPedido.Aberto) {
            const updatePedido = await this.pedidoRepository.updatePedidoId(
              pedidoData.id,
              {
                statusPedido: EStatusPedido.Cancelado,
                dataCancelamento: dataAtual
              }
            )
            return updatePedido
          }
        }

        var { cep, localidade: cidade, uf } = response.data
        const taxaLocacaoCalculada = calcularTaxaLocacao(uf)

        if (
          statusPedidoData.statusPedido == EStatusPedido.Aberto ||
          EStatusPedido.Aprovado
        ) {
          if (pedidoData.cep == null) {
            throw new AppErrors('O CEP enviado não foi encontrado.', 404)
          }

          const valorDiariaCarroUpdate =
            await this.pedidoRepository.findValorDiariaCarro(pedidoData.id)

          if (!valorDiariaCarroUpdate?.carro.valorDiaria) {
            return null
          }

          const valorTotal =
            taxaLocacaoCalculada +
            valorDiariaCarroUpdate.carro.valorDiaria * diffDays

          if (pedidoData.dataHoraInicial && pedidoData.dataHoraFinal) {
            const updatePedido = await this.pedidoRepository.updatePedidoId(
              pedidoData.id,
              {
                dataHoraInicial: pedidoData.dataHoraInicial,
                dataHoraFinal: pedidoData.dataHoraFinal,
                statusPedido: EStatusPedido.Aprovado,
                valorTotal: valorTotal,
                cep: cep,
                cidade: cidade,
                uf: uf,
                taxaLocacao: taxaLocacaoCalculada
              }
            )

            return updatePedido
          } else {
            return new AppErrors(
              'Você não informou Data Inicial e a Data Final do Pedido',
              404
            )
          }
        }
      }

      if (
        pedidoData.id &&
        statusPedidoData.statusPedido == EStatusPedido.Aprovado &&
        pedidoData.statusPedido == 'Fechado'
      ) {
        const dataFinalData = await this.pedidoRepository.findDataFinal(
          pedidoData.id
        )

        let valorMultaCalculado

        if (dataFinalData && dataFinalData.dataHoraFinal) {
          const dataFinal = new Date(dataFinalData.dataHoraFinal).getDate()
          const dataAtual = new Date().getDate()

          if (dataAtual > dataFinal) {
            valorMultaCalculado = dataAtual - dataFinal
            valorMultaCalculado = valorDiaria.carro.valorDiaria * 2
          }
        }

        const updatePedido = await this.pedidoRepository.updatePedidoId(
          pedidoData.id,
          {
            statusPedido: EStatusPedido.Fechado,
            dataFechamento: dataAtual,
            valorMulta: valorMultaCalculado
          }
        )
        return updatePedido
      }

      return new AppErrors(
        'Não foi encontrado nenhum parametro valido para esse update',
        404
      )
    } catch (error) {
      throw error
    }
  }

  public async deletePedido(pedidoData: Pedido): Promise<Pedido | null> {
    try {
      const pedidoExisting = await this.pedidoRepository.findPedidoId(
        pedidoData.id
      )

      const statusPedidoData = await this.pedidoRepository.findStatusPedidoId(
        pedidoData.id
      )

      if (!pedidoExisting) {
        throw new AppErrors('Esse pedido não existe.', 404)
      }

      if (statusPedidoData.statusPedido == EStatusPedido.Cancelado) {
        throw new AppErrors('Esse pedido já está cancelado.', 400)
      }

      if (statusPedidoData.statusPedido != EStatusPedido.Aberto) {
        throw new AppErrors('Esse pedido não pode ser cancelado.', 400)
      }

      if (statusPedidoData.statusPedido === EStatusPedido.Aberto) {
        const deletePedido = await this.pedidoRepository.updatePedidoId(
          pedidoData.id,
          {
            statusPedido: EStatusPedido.Cancelado
          }
        )
        return deletePedido
      }

      return pedidoExisting
    } catch (error) {
      throw error
    }
  }
}

export default PedidoService
