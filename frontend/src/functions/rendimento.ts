export function calcularRendimento(
  currentTimestamp: string,
  valorCentavos: number,
  taxaCDI: number,
  diasLimite: number
): {
  rendimentoAtual: number;
  rendimentoFinal: number;
  valorMaisRendimento: number;
  valorMaisRendimentoFinal: number;
} {
  const dataAtual = new Date(currentTimestamp);
  const dataHoje = new Date();
  const diasPassados = Math.floor(
    (dataHoje.getTime() - dataAtual.getTime()) / (1000 * 60 * 60 * 24)
  );

  const cdiDiario = Math.pow(1 + taxaCDI / 100, 1 / 252) - 1;

  const rendimentoAtual =
    valorCentavos * Math.pow(1 + cdiDiario, diasPassados) - valorCentavos;
  const rendimentoFinal =
    valorCentavos * Math.pow(1 + cdiDiario, diasLimite) - valorCentavos;

  return {
    rendimentoAtual,
    rendimentoFinal,
    valorMaisRendimento: valorCentavos + rendimentoAtual,
    valorMaisRendimentoFinal: valorCentavos + rendimentoFinal,
  };
}
