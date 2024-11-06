import EStatusCarro from "../pedidos.def/ECarro"

export type carUpdateType = {
  marca?: string
  modelo?: string
  ano?: number
  km?: number
  items?: Record<string, string>
  placa?: string
  valorDiaria?: number
  status?: EStatusCarro
}