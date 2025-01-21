export interface FinancialTransactionData {
  object: string;
  id: string;
  value: number;
  balance: number;
  type: string;
  date: string;
  description: string;
  paymentId: string;
  splitId: string;
  transferId: string;
  anticipationId: string;
  billId: string;
  invoiceId: string;
  paymentDunningId: string;
  creditBureauReportId: string;
  pixTransactionId: string;
}
