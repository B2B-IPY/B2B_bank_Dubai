export function BRLtoNumber(brl: string): number {
  return parseFloat(brl.replace(".", "").replace(",", "."));
}
export function formatarNumeroParaBRL(numero: number): string {
  const formatoMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return formatoMoeda.format(numero).replace("R$", "").trim();
}
