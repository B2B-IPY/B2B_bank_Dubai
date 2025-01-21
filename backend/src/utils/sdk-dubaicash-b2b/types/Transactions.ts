import { z } from "zod";

export interface CreateTransfer {
  keyType: string;
  key: string;
  amount: number;
}

export const CreateTransferZod = z.object({
  keyType: z.enum(["CPF", "CNPJ", "EVP", "EMAIL", "PHONE"], {
    message: "keyType inválido",
  }),
  key: z.string({ message: "key inválido" }),
  amount: z.number({ message: "amount inválido" }),
});
