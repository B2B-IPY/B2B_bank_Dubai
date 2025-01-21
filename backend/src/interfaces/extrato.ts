export interface Extrato {
  date: string;
  data: ExtratoData[];
}
export interface ExtratoData {
  id: string;
  description: string;
  value: number;
}
