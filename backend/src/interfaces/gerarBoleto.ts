import { z } from "zod";

const CustomerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  email: z.string().email("E-mail inválido.").optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Telefone deve conter 10 dígitos.")
    .optional(),
  mobilePhone: z
    .string()
    .regex(/^\d{10,11}$/, "Celular deve conter 10 ou 11 dígitos.")
    .optional(),
  cpfCnpj: z.string().regex(/^\d{11}$/, "CPF/CNPJ deve conter 11 dígitos."),
  postalCode: z
    .string()
    .regex(/^\d{5}-\d{3}$/, "CEP deve estar no formato 00000-000.")
    .optional(),
  address: z.string().min(1, "Endereço é obrigatório.").optional(),
  addressNumber: z
    .string()
    .min(1, "Número do endereço é obrigatório.")
    .optional(),
  complement: z.string().optional(),
  province: z.string().min(1, "Bairro é obrigatório.").optional(),
  externalReference: z.string().optional(),
  notificationDisabled: z.boolean().optional(),
  additionalEmails: z
    .string()
    .regex(
      /^([\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,},?)+$/,
      "E-mails adicionais devem ser válidos e separados por vírgulas."
    )
    .optional(),
  municipalInscription: z.string().optional(),
  stateInscription: z.string().optional(),
  observations: z.string().optional(),
});

export const schemaBoleto = z.object({
  customer: CustomerSchema,
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD."),
  value: z.number().positive("O valor deve ser positivo."),
  description: z.string().optional(),
  externalReference: z.string().optional(),
});
interface Customer {
  name: string;
  email: string;
  phone: string; // Deve conter 10 dígitos
  mobilePhone: string; // Deve conter 10 ou 11 dígitos
  cpfCnpj: string; // Deve conter 11 dígitos
  postalCode: string; // Deve estar no formato 00000-000
  address: string;
  addressNumber: string;
  province: string;
  notificationDisabled: boolean;
}

export interface GerarBoleto {
  customer: Customer;
  billingType: "BOLETO"; // Tipos possíveis de cobrança
  dueDate: string; // Deve estar no formato YYYY-MM-DD
  value: number; // Deve ser positivo
  description: string;
  externalReference?: string;
}
