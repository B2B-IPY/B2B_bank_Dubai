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
   externalId?: string;
   key: string;
   name?: string;
   documentNumber: string;
   description?: string;
   bank?: string;
   branch?: string;
   account?: string;
   amount: number;
   memo: string;
}

export const CreateTransferZod = z.object({
   externalId: z.string({ message: "externalId inválido" }).optional(),
   key: z.string({ message: "key inválido" }),
   name: z.string({ message: "name inválido" }).optional(),
   documentNumber: z.string({ message: "documentNumber inválido" }),
   description: z.string({ message: "description inválido" }).optional(),
   bank: z.string({ message: "bank inválido" }).optional(),
   branch: z.string({ message: "branch inválido" }).optional(),
   account: z.string({ message: "account inválido" }).optional(),
   amount: z.number({ message: "amount inválido" }),
   memo: z.string({ message: "memo inválido" }),
});

export interface CreateQR {
   externalId?: string;
   amount: number;
   document: string;
   name: string;
   identification: string;
   expire: number;
   description: string;
}

export const CreateQRZod = z.object({
   externalId: z.string({ message: "externalId inválido" }),
   amount: z.number({ message: "amount inválido" }),
   document: z.string({ message: "document inválido" }),
   name: z.string({ message: "name inválido" }),
   identification: z.string({ message: "identification inválido" }),
   expire: z.number({ message: "expire inválido" }),
   description: z.string({ message: "description inválido" }),
});
