export function gerarSenha(tamanho = 12): string {
   const caracteresMinusc = "abcdefghijklmnopqrstuvwxyz";
   const caracteresMaiusc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   const numeros = "0123456789";
   const caracteresEspeciais = "!@#$%^&*()_+-=[]{}|;:,.<>?";

   // Garantir pelo menos um de cada tipo de caractere
   const senha = [
      caracteresMinusc[Math.floor(Math.random() * caracteresMinusc.length)],
      caracteresMaiusc[Math.floor(Math.random() * caracteresMaiusc.length)],
      numeros[Math.floor(Math.random() * numeros.length)],
      caracteresEspeciais[
         Math.floor(Math.random() * caracteresEspeciais.length)
      ],
   ];

   // Preencher o restante da senha
   const todosOsCaracteres =
      caracteresMinusc + caracteresMaiusc + numeros + caracteresEspeciais;
   for (let i = senha.length; i < tamanho; i++) {
      senha.push(
         todosOsCaracteres[Math.floor(Math.random() * todosOsCaracteres.length)]
      );
   }

   // Embaralhar a senha
   return senha.sort(() => Math.random() - 0.5).join("");
}
