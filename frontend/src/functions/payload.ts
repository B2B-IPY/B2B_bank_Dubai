export function codificarPayload(payload: string) {
  const jsonString = JSON.stringify(payload);
  return window.btoa(jsonString);
}

// Decodifica o payload em Base64
export function decodificarPayload(codificado: string) {
  const jsonString = window.atob(codificado);
  return JSON.parse(jsonString);
}
