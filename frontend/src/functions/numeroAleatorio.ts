export function gerarNumeroAleatorio(): string {
  // Pega o timestamp atual
  const timestamp = Date.now().toString();

  // Gera um número baseado no timestamp
  const numeroAleatorio =
    parseInt(timestamp.slice(-8)) + Math.floor(Math.random() * 100000000);

  // Retorna os últimos 8 caracteres do número gerado
  return numeroAleatorio.toString().slice(-8);
}
