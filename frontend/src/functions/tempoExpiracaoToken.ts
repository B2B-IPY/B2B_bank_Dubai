export default function tempoExpiracaoToken(tokenJWT: string) {
  if (!tokenJWT) {
    return 0;
  }
  const tokenSplit = tokenJWT.split(".");
  if (tokenSplit.length !== 3) {
    return 0;
  }
  const payloadBase64 = tokenSplit[1];
  const payloadDecoded = atob(payloadBase64);
  const payload = JSON.parse(payloadDecoded);
  if (!payload.exp) {
    return 0;
  }
  const expTimestamp = parseInt(payload.exp, 10);
  const expData = new Date(expTimestamp * 1000);
  const agora = new Date();
  const tempoRestante = expData.getTime() - agora.getTime();
 

  return tempoRestante > 0 ? tempoRestante : 0;
}
