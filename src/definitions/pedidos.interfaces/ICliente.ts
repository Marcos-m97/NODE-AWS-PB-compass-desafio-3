import { UUID } from 'crypto'

interface ICliente {
  id?: UUID
  nome: string
  dataNascimento: Date
  cpf: string
  email: string
  telefone: string
  dataCadastro?: Date
  dataExclusao?: Date | null
}

export default ICliente
