import 'dotenv/config'
import ClientesRepositorie from '../repositories/clientes.repositorie.js'
import Cliente from '../models/Cliente.js'
import {
  clientesInput,
  clientUpdates,
  filterType,
  filteredResponse,
  uptdateInsertType
} from '../definitions/clientes.def/clientes.types.js'
import { AppErrors } from '../middlewares/errorMiddlewere.js'
import { Op } from 'sequelize'
import {
  validarCPF,
  validarEmail,
  validarnomeCompleto,
  validarTelefone
} from '../utilis/functions.js'

class ClienteService {
  private clientesRepositorie: ClientesRepositorie
  constructor(clientesRepositorie: ClientesRepositorie) {
    this.clientesRepositorie = clientesRepositorie
  }

  public async registerClientes(
    clientesData: clientesInput
  ): Promise<Cliente | null | void> {
    if (!clientesData.dataNascimento) {
      throw new AppErrors('Data de Nascimento inválida', 400)
    }

    const parsedDataDeNascimento = new Date(clientesData.dataNascimento)
    if (isNaN(parsedDataDeNascimento.getTime())) {
      throw new AppErrors('Data de nascimento inválida', 400)
    }

    if (!clientesData.cpf) {
      throw new AppErrors('CPF inexistente', 400)
    }

    if (!clientesData.email) {
      throw new AppErrors('Email inválido', 400)
    }

    if (!clientesData.telefone) {
      throw new AppErrors('Telefone ausente', 400)
    }

    const nomeCompletoValido = validarnomeCompleto(clientesData.nome)
    if (!nomeCompletoValido) {
      throw new AppErrors('Nome inválido', 400)
    }

    const cpfValido = validarCPF(clientesData.cpf)
    if (!cpfValido) {
      throw new AppErrors('CPF inválido', 400)
    }

    const emailValido = validarEmail(clientesData.email)
    if (!emailValido) {
      throw new AppErrors('Email inválido', 400)
    }

    const telefoneValido = validarTelefone(clientesData.telefone)
    if (!telefoneValido) {
      throw new AppErrors('Telefone inválido', 400)
    }

    try {
      const existingClientes = await this.clientesRepositorie.findClienteByEmail(
        clientesData.email
      )
      const existbyCPF = await this.clientesRepositorie.findClienteByCPF(
        clientesData.cpf
      )

      if (
        (existingClientes && existingClientes.dataExclusao == null) ||
        (existbyCPF && existbyCPF.dataExclusao == null)
      ) {
        throw new AppErrors('Cliente já cadastrado', 409)
      } else  {
        const newCliente = await this.clientesRepositorie.createCliente({
          nome: clientesData.nome,
          dataNascimento: parsedDataDeNascimento,
          cpf: clientesData.cpf,
          email: clientesData.email,
          telefone: clientesData.telefone
        })

        return newCliente
      }
    } catch (error) {
      throw error
    }
  }

  public async filterClientes(
    filter: filterType,
    limit: number,
    page: number,
    orderBy: string,
    orderDirection: string
  ): Promise<filteredResponse | null> {
    if (limit > 10) {
      limit == 10
    }
    if (limit < 5) {
      limit == 5
    }

    let whereClaus: any = {}

    try {
      if (filter.nome) {
        whereClaus.nome = {
          [Op.like]: `%${filter.nome}%`
        }
      }

      if (filter.dataNascimento) {
        whereClaus.dataNascimento = { dataNascimento: filter.dataNascimento }
      }

      if (filter.cpf) {
        whereClaus.cpf = { [Op.like]: `%${filter.cpf}%` }
      }

      if (filter.email) {
        whereClaus.email = {
          [Op.like]: `%${filter.email}%`
        }
      }

      if (filter.telefone) {
        whereClaus.telefone = {
          [Op.like]: `%${filter.telefone}%`
        }
      }

      if (filter.dataCadastro) {
        const startDate = new Date(filter.dataCadastro)
        const endDate = new Date(filter.dataCadastro)
        endDate.setHours(23, 59, 59, 999)

        whereClaus.dataCadastro = {
          [Op.between]: [startDate, endDate]
        }
      }

      if (filter.dataExclusao) {
        const startDate = new Date(filter.dataExclusao)
        const endDate = new Date(filter.dataExclusao)
        endDate.setHours(23, 59, 59, 999)

        whereClaus.dataExclusao = {
          [Op.between]: [startDate, endDate]
        }
      }

      const excluido = filter.excluido || 'não'
      if (excluido === 'não') {
        whereClaus.dataExclusao = null
      } else if (excluido === 'sim') {
        whereClaus.dataExclusao = { [Op.not]: null }
      }

      const order = [[orderBy, orderDirection]]

      let orderdir: string = ''
      if (order[0][1] === 'desc') {
        orderdir = 'Descendente'
      } else {
        orderdir = 'Ascendente'
      }

      const offset = (page - 1) * limit

      const clientesList = await this.clientesRepositorie.filterClientes(
        whereClaus,
        order,
        limit,
        offset
      )

      const totalClientes = await this.clientesRepositorie.countClientes(
        whereClaus
      )

      let pagesQty = Math.ceil(totalClientes / limit)

      if (!clientesList || clientesList.length === 0 || totalClientes === 0) {
        throw new AppErrors('Cliente nao encontrado', 404)
      }

      let resp: filteredResponse = {
        orderedBy: order[0][0],
        isExcluded: excluido,
        orderDirection: orderdir,
        totalClientsFound: totalClientes,
        totalPages: pagesQty,
        currentPage: page,
        clients: clientesList
      }

      return resp
    } catch (err) {
      throw err
    }
  }

  public async redefineClientes(
    updates: clientUpdates,
    clienteId: string
  ): Promise<Cliente | null> {
    const existCliente = await this.clientesRepositorie.findClienteById(
      clienteId
    )

    if (!existCliente) {
      throw new AppErrors('Cliente não encontrado', 404)
    }

    if (existCliente.dataExclusao) {
      throw new AppErrors('Cliente excluido', 409)
    }

    const up: uptdateInsertType = {}

    if (updates.nome) {
      if (validarnomeCompleto(updates.nome) == false) {
        throw new AppErrors('Nome completo inválido', 400)
      }
      up.nome = updates.nome
    }

    if (updates.dataNascimento) {
      const parsedDataDeNascimento = new Date(updates.dataNascimento)
      if (isNaN(parsedDataDeNascimento.getTime())) {
        throw new AppErrors('Data de nascimento inválida', 400)
      }
      up.dataNascimento = updates.dataNascimento
    }

    if (updates.cpf) {
      if (validarCPF(updates.cpf) == false) {
        throw new AppErrors('CPF inválido', 400)
      }
      const cpfExists = await this.clientesRepositorie.findClienteByCPF(
        updates.cpf
      )
      if (cpfExists && cpfExists.id !== clienteId) {
        throw new AppErrors('Já existe um cliente com este CPF', 409)
      }
      up.cpf = updates.cpf
    }

    if (updates.email) {
      if (validarEmail(updates.email) == false) {
        throw new AppErrors('Email inválido', 400)
      }
      const emailExists = await this.clientesRepositorie.findClienteByEmail(
        updates.email
      )
      if (emailExists && emailExists.id !== clienteId) {
        throw new AppErrors('Já existe um cliente com este email', 409)
      }
      up.email = updates.email
    }

    if (updates.telefone) {
      if (validarTelefone(updates.telefone) == false) {
        throw new AppErrors('Telefone inválido', 400)
      }
      up.telefone = updates.telefone
    }

    const updatedData = await this.clientesRepositorie.atualizarClientes(
      up,
      clienteId
    )
    return updatedData
  }

  public async getClienteById(clienteId: string): Promise<Cliente | null> {
    const cliente = await this.clientesRepositorie.findClienteById(clienteId)

    if (!cliente) {
      throw new AppErrors('Cliente não encontrado', 404)
    }

    return cliente
  }

  public async softDeleteCliente(id: string): Promise<Cliente> {
    const cliente = await this.clientesRepositorie.findClienteById(id)

    if (!cliente) {
      throw new AppErrors('Cliente não encontrado', 404)
    }

    if (cliente.dataExclusao) {
      throw new AppErrors('Cliente já está excluído', 409)
    }

    const result = await this.clientesRepositorie.softDeleteCliente(id)
    if (!result) {
      throw new AppErrors('Falha ao excluir o cliente', 500)
    }
    return result
  }
}

export default ClienteService
