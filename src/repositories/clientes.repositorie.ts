import Cliente from '../models/Cliente.js'
import {
  clientesInput,
  clientUpdates,
  filterType
} from '../definitions/clientes.def/clientes.types.js'


class ClientesRepositorie {
  public async createCliente(newCliente: clientesInput): Promise<Cliente> {
    try {
      const clientes = await Cliente.create(newCliente)
      return clientes
    } catch (err) {
      throw err
    }
  }

  public async filterClientes(
    whereClaus: filterType,
    order: any,
    limit: number,
    offset: number
  ): Promise<Cliente[] | null> {
    try {
      const clientes = await Cliente.findAll({
        where: whereClaus,
        order: order,
        limit: limit,
        offset: offset,
        attributes: { exclude: ['dataCadastro', 'dataExclusao'] }
      })

      return clientes
    } catch (err) {
      throw err
    }
  }

  public async countClientes(whereClaus: filterType): Promise<number> {
    try {
      const count = await Cliente.count({ where: whereClaus })
      return count
    } catch (err) {
      throw err
    }
  }

  public async atualizarClientes(
    updates: clientUpdates,
    id: string
  ): Promise<Cliente | null> {
    try {
      await Cliente.update(updates, { where: { id: id } })
      const patch = await Cliente.findByPk(id)
      return patch
    } catch (err) {
      throw err
    }
  }

  public async findClienteByCPF(cpf: string): Promise<Cliente | null> {
    try {
      const cliente = await Cliente.findOne({where: {cpf: cpf}})
      return cliente
    } catch (err) {
      throw err
    }
  }

  public async findClienteByEmail(email: string): Promise<Cliente | null> {
    try {
      const cliente = await Cliente.findOne({
        where: {
          email: email
        }
      })
      return cliente
    } catch (err) {
      throw err
    }
  }

  public async findClienteById(clienteId: string): Promise<Cliente | null> {
    try {
      const cliente = await Cliente.findByPk(clienteId)
      return cliente
    } catch (err) {
      throw err
    }
  }

  public async softDeleteCliente(id: string): Promise<Cliente> {
    try {
      await Cliente.update(
        { dataExclusao: new Date() },
        { where: { id, dataExclusao: null } }
      )
      const deleted = await Cliente.findByPk(id)
      return deleted!
    } catch (err) {
      throw err
    }
  }
}

export default ClientesRepositorie
