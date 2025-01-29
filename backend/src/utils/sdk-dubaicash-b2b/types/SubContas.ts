import { z } from "zod";

export interface SubConta {
   user: string;
   email: string;
   cpfCnpj: string;
   password: string;
   cashin_fixo: number;
   cashin_porcent: number;
   cashout_fixo: number;
   cashout_porcent: number;
   id_logins: number;
   role: string;
   valor: number;
   created_at: string;
   nome: string;
   taxas_representante: string;
}
export interface CriarSubcontaRequest {
   name: string;
   user: string;
   email: string;
   cpfCnpj: string;
   taxas_representante: string;
}

// export const criarSubContaZod = z.object({
//    user: z.string({ message: "user inválido" }).regex(/^[a-z]+$/, {
//       message:
//          "O usuário deve conter apenas letras minúsculas, sem números, espaços ou caracteres especiais",
//    }),
//    email: z
//       .string({ message: "email inválido" })
//       .email("Informe um email válido"),
//    cpfCnpj: z.string({ message: "cpfCnpj inválido" }),
//    password: z
//       .string({ message: "password inválido" })
//       .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
//       .regex(/[A-Z]/, {
//          message: "A senha deve conter pelo menos uma letra maiúscula",
//       })
//       .regex(/[a-z]/, {
//          message: "A senha deve conter pelo menos uma letra minúscula",
//       })
//       .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número" })
//       .regex(/[@$!%*?&#]/, {
//          message:
//             "A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &, #, etc.)",
//       }),
// });
