import { Request, Response, NextFunction } from 'express'
import ClienteService from '../services/clientes.service.js'
import {
  clientesInput,
  clientUpdates,
  filterType
} from '../definitions/clientes.def/clientes.types.js'
import Cliente from '../models/Cliente.js'

class ClienteControler {
  private clienteService: ClienteService

  constructor(clienteService: ClienteService) {
    this.clienteService = clienteService
  }

  public async createClientes(
    req: Request,

    res: Response,

    next: NextFunction
  ): Promise<Response | void> {
    try {
      const clientesData: clientesInput = req.body

      const resp = await this.clienteService.registerClientes(clientesData)

      return res

        .status(201)

        .json({ msg: 'cliente registrado com sucesso', id: resp!.id })
    } catch (error) {
      next(error)
    }
  }

  public async readClientes(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    let dataFilter: filterType = {
      nome: req.query.nomeCompleto as string,
      dataNascimento: req.query.dataNascimento
        ? new Date(req.query.dataNascimento as string)
        : undefined,
      cpf: req.query.cpf as string,
      email: req.query.email as string,
      telefone: req.query.telefone as string,
      dataCadastro: req.query.dataCadastro
        ? new Date(req.query.dataCadastro as string)
        : undefined,
      dataExclusao: req.query.dataExclusao
        ? new Date(req.query.dataExclusao as string)
        : undefined,
      excluido: req.query.excluido as string
    }
    const orderBy = (req.query.orderBy as string) || 'nome'
    const orderDirection = (req.query.orderDirection as string) || 'ASC'
    const limit = parseInt(req.query.limit as string) || 5
    const page = parseInt(req.query.page as string) || 1
    try {
      const filteredList = await this.clienteService.filterClientes(
        dataFilter,
        limit,
        page,
        orderBy,
        orderDirection
      )
      return res.status(200).json(filteredList)
    } catch (error) {
      next(error)
    }
  }

  public async updateCliente(
    req: Request,

    res: Response,

    next: NextFunction
  ): Promise<Response | void> {
    try {
      const clienteId: string = req.params.id

      const updates: clientUpdates = req.body

      const updated = await this.clienteService.redefineClientes(
        updates,

        clienteId
      )

      return res.status(200).json({
        Id: clienteId,

        nomeCompleto: updated!.nome,

        dataDeNascimento: updated!.dataNascimento,

        CPF: updated!.cpf,

        email: updated!.email,

        telefone: updated!.telefone
      })
    } catch (error) {
      next(error)
    }
  }

  public async getCliente(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const id = req.params.id

      const cliente = await this.clienteService.getClienteById(id)

      return res.status(200).json(cliente)
    } catch (error) {
      next(error)
    }
  }

  public async deleteCliente(
    req: Request,

    res: Response,

    next: NextFunction
  ): Promise<Response | void> {
    const { id } = req.params

    try {
      await this.clienteService.softDeleteCliente(id)

      return res.status(204).json({ message: 'Cliente excluído com sucesso' })
    } catch (error) {
      next(error)
    }
  }
}

export default ClienteControler
