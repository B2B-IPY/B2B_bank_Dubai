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
   cpf?: string;
   nome?: string;
}

export const CreateQRZod = z.object({
   amount: z.number({ message: "amount inválido" }),
   cpf: z.string({ message: "cpfCnpj inválido" }).optional(),
   nome: z.string({ message: "nome inválido" }).optional(),
});

export interface Taxas {
   bank: bank;
}

interface bank {
   cashin: { fixo: string; porcentagem: string };
   cashout: { fixo: string; porcentagem: string };
}

export interface taxaRepresentante {
   id: number;
   user: string;
   user_id: string;
   uuid: number;
   taxas: Taxas;
}

// [{uuid: 87517671,id: 1,user: "adm",user_id: "1",taxas: {bank: {cashin: { fixo: "1", porcentagem: "2" },cashout: { fixo: "1", porcentagem: "2" }}}}]
