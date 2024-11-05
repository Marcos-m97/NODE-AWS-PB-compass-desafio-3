const TaxaLocacao = {
  AC: 40.0,
  AL: 30.0,
  AP: 30.0,
  AM: 20.0,
  BA: 50.0,
  CE: 80.0,
  ES: 30.0,
  GO: 80.0,
  MA: 60.0,
  MT: 50.0,
  MS: 50.0,
  MG: 80.0,
  PB: 30.0,
  PR: 40.0,
  PE: 30.0,
  PI: 80.0,
  RJ: 50.0,
  RN: 80.0,
  RS: 80.0,
  RO: 70.0,
  RR: 40.0,
  SC: 50.0,
  SE: 80.0,
  TO: 40.0
} as const //

export function calcularTaxaLocacao(uf: string): number {
  const ufUpper = uf.toUpperCase() as keyof typeof TaxaLocacao

  if (ufUpper in TaxaLocacao) {
    return TaxaLocacao[ufUpper]
  } else {
    return 170.0
  }
}
