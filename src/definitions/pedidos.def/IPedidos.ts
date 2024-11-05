import { UUID } from 'crypto'
import EStatusPedido from './EPedido.js'

interface IPedido {
  id?: UUID
  clienteId: UUID
  carroId: UUID
  dataPedido?: Date
  statusPedido?: EStatusPedido
  cep?: string | null
  cidade?: string | null
  uf?: string | null
  taxaLocacao?: number | null
  valorTotal?: number
  dataHoraInicial?: Date
  dataHoraFinal?: Date
  dataCancelamento?: Date | null
  dataFechamento?: Date | null
  valorMulta?: number | null
}

export default IPedido
