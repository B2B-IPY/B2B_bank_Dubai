export interface Taxas {
   bank: bank;
}

interface bank {
   cashin: { fixo: string; porcentagem: string };
   cashout: { fixo: string; porcentagem: string };
}

export interface Taxas_representante {
   id: number;
   user: string;
   user_id: string;
   uuid: number;
   taxas: Taxas;
}
