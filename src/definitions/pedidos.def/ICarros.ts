interface ICarro {
  id?: string
  marca: string
  modelo: string
  ano: number
  km: number
  items: Record<string, string>
  placa: string
  valorDiaria: number
  dataCadastro?: Date
  dataDeExclusao?: Date
}

export default ICarro
