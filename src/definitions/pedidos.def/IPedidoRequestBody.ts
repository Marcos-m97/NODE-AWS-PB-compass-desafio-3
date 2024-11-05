import Pedido from '../../models/Pedido.js'

interface PedidoRequestBody extends Pedido {
  cpf?: string
  orderBy?: string
  page?: number
  pageSize?: number
}

export type filtertype = {
  cpf?: string
  orderBy?: string
  page?: number
  pageSize?: number
  statusPedido?: string
  dataHoraFinal?: Date
  dataHoraInicial?:Date
}

export default PedidoRequestBody
