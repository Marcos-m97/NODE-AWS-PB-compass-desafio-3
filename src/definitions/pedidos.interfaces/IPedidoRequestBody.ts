import Pedido from '../../models/Pedido.js'

interface PedidoRequestBody extends Pedido {
  cpf?: string
  orderBy?: 'ASC' | 'DESC'
  page?: number
  pageSize?: number
}

export default PedidoRequestBody
