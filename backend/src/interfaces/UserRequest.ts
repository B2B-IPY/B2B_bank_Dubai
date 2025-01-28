import { Request } from "express";

export interface UserRequest extends Request {
   user?: string;
   email?: string;
   id_logins?: number;
   role?: string;
   cpfCnpj?: string;
   cashin_fixo?: number;
   cashin_porcent?: number;
   cashout_fixo?: number;
   cashout_porcent?: number;
   valor?: number;
   nome?: string;
}
