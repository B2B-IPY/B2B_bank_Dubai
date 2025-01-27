export function calcularDiasRestantes(
  currentTimestamp: string,
  totalDias: number
): number {
  const dataAtual = new Date(currentTimestamp);
  const dataFutura = new Date(dataAtual);
  dataFutura.setDate(dataAtual.getDate() + totalDias);
  const diferencaEmMilissegundos = dataFutura.getTime() - Date.now();
  const diasRestantes = Math.ceil(
    diferencaEmMilissegundos / (1000 * 60 * 60 * 24)
  );
  return diasRestantes > 0 ? diasRestantes : 0;
}
