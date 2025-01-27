export function validarCpf(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11) {
    return false;
  }
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }
  var soma = 0;
  for (var i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  var resto = soma % 11;
  var digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
  if (parseInt(cpf.charAt(9)) !== digitoVerificador1) {
    return false;
  }
  soma = 0;
  for (var i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  var digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
  return parseInt(cpf.charAt(10)) === digitoVerificador2;
}

export function validarCnpj(cnpj: string) {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj.length !== 14) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (caso contrário, um CNPJ inválido passaria na validação)
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Calcula o primeiro dígito verificador
  var tamanho = cnpj.length - 2;
  var numeros = cnpj.substring(0, tamanho);
  var digitos = cnpj.substring(tamanho);
  var soma = 0;
  var pos = tamanho - 7;

  for (var i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  var resultado = (soma % 11 < 2 ? 0 : 11 - (soma % 11)).toString();

  if (resultado != digitos.charAt(0)) {
    return false;
  }

  // Calcula o segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (var i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = (soma % 11 < 2 ? 0 : 11 - (soma % 11)).toString();

  return resultado == digitos.charAt(1);
}
