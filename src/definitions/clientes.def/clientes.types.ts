import Cliente from '../../models/Cliente.js'

export type filteredResponse = {
  orderedBy: string
  isExcluded: string
  orderDirection: string
  totalClientsFound: number
  totalPages: number
  currentPage: number
  clients: Cliente[]
}

export type filterType = {
  nome?: string
  dataNascimento?: Date
  cpf?: string
  email?: string
  telefone?: string
  dataCadastro?: Date
  dataExclusao?: Date
  excluido?: string
}

export type clientesInput = {
  nome: string
  dataNascimento: Date
  cpf: string
  email: string
  telefone: string
}

export type clientUpdates = {
  nome?: string
  dataNascimento?: Date
  cpf?: string
  email?: string
  telefone?: string
}

export type uptdateInsertType = {
  nome?: string
  dataNascimento?: Date
  cpf?: string
  email?: string
  telefone?: string
}
