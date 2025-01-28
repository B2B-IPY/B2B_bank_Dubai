import { z } from "zod";

// export interface CreateTransfer {
//   keyType: string;
//   key: string;
//   amount: number;
// }

// export const CreateTransferZod = z.object({
//   keyType: z.enum(["CPF", "CNPJ", "EVP", "EMAIL", "PHONE"], {
//     message: "keyType inválido",
//   }),
//   key: z.string({ message: "key inválido" }),
//   amount: z.number({ message: "amount inválido" }),
// });

export interface CreateTransfer {
   key: string;
   amount: number;
}

export const CreateTransferZod = z.object({
   key: z.string({ message: "key inválido" }),
   amount: z.number({ message: "amount inválido" }),
});

export interface CreateQR {
   amount: number;
   cpf: string;
   nome: string;
}

export const CreateQRZod = z.object({
   amount: z.number({ message: "amount inválido" }),
   cpf: z.string({ message: "cpfCnpj inválido" }),
   nome: z.string({ message: "nome inválido" }),
});
