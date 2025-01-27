export interface Taxas {
   bank: bank;
   sistema: sistema;
}
interface bank {
   PIX: {
      PAYMENT_RECEIVED: { fixo: string; porcentagem: string };
      TRANSFER_DONE: { fixo: string; porcentagem: string };
   };
   bill: {
      BILL_PAID: { fixo: string; porcentagem: string };
      BILL_APPROVED: { fixo: string; porcentagem: string };
      BILL_CREATED: { fixo: string; porcentagem: string };
   };
   mobilePhoneRecharge: {
      PHONE_RECHARGE_CONFIRMED: { fixo: string; porcentagem: string };
   };
   BANK_ACCOUNT: {
      PAYMENT_RECEIVED: { fixo: string; porcentagem: string };
      TRANSFER_DONE: { fixo: string; porcentagem: string };
   };
}
interface sistema {
   mensalidade: {
      fixo: string;
   };
   criar_conta: {
      fixo: string;
   };
}
export interface Taxas_representante {
   id: number;
   user: string;
   user_id: string;
   uuid: number;
   taxas: Taxas;
}
