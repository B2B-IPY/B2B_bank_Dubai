export interface Extrato {
   pagination: Pagination;
   data: DataExtrato[];
}

export interface DataExtrato {
   transactionId: string;
   parentId: null;
   data: Data;
}

export interface Data {
   uuid: string;
   invoiceId: number | string;
   partnersId: number;
   transactionId: string;
   chargerBackId: string;
   externalId: string;
   name: string;
   email: string;
   documentNumber: string;
   description: string;
   phone: string;
   amount: string;
   isbp: string;
   bankName: string;
   branch: string;
   account: string;
   endtoendId: string;
   typeKey: string;
   key: string;
   type: string;
   subType: string;
   remittanceInformation: string;
   status: string;
   msgError: string;
   telegramNotification: boolean;
   tryCount: number;
   createdAt: string;
}

export interface Pagination {
   count: number;
   page: number;
   perPage: number;
}
