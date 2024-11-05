import EStatusCarro from './ECarro.js'

interface ICarro {
  id: string
  marca: string
  modelo: string
  ano: number
  km: number
  items: Record<string, string>
  placa: string
  valorDiaria: number
  dataCadastro: Date
  status: EStatusCarro
}

export default ICarro
