export function gerarNumeroAleatorio(): string {
  const timestamp = Date.now().toString();

  const numeroAleatorio =
    parseInt(timestamp.slice(-8)) + Math.floor(Math.random() * 100000000);

  return numeroAleatorio.toString().slice(-8);
}
