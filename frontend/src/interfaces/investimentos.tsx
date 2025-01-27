export default interface Investimentos {
  id: number;
  nome: string;
  valor: number;
  id_workspace: string;
  id_user: number;
  user: string;
  status:
    | "pendente"
    | "aprovado"
    | "recusado"
    | "expirado"
    | "pago"
    | "solicitacao de retirada";
  data: string;
}
