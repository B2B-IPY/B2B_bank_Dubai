import axios from "axios";
import { sign } from "./sign";
import config from "../../../DB/config";
import mysql from "mysql2";
import { CreateTransfer } from "../types/Transactions";

export class Transactions {
   private sign: sign;

   constructor(sign: sign) {
      this.sign = sign;
   }

   async pix(body: CreateTransfer): Promise<{ status: number; data: any }> {
      const header = await this.sign.header();
      const url: string = process.env.URL_API as string;

      try {
         const result = await axios.post(
            url + "/v1/customers/pix/withdraw",
            {
               key: body.key,
               documentNumber: body.documentNumber,
               amount: body.amount,
               memo: body.memo,
            },
            header
         );
         return result;
      } catch (error) {
         const err = error as any;
         console.log(err.response.data);

         return {
            status: err.response.status || 400,
            data: err.response.data
               ? err.response.data
               : { status: "ocorreu um erro" },
         };
      }
   }

   async ConsultarChave(chave: string): Promise<{ status: number; data: any }> {
      const header = await this.sign.header();
      const url: string = process.env.URL_API as string;
      try {
         const result = await axios.get(
            url + `/v1/customers/pix/pix-search?dict=${chave}`,
            header
         );

         return result;
      } catch (error) {
         const err = error as any;
         console.log(err);

         return {
            status: err.response.status || 400,
            data: err.response.data
               ? err.response.data
               : { status: "ocorreu um erro" },
         };
      }
   }

   async CreateQR(body: string): Promise<{ status: number; data: any }> {
      const header = await this.sign.header();
      const url: string = process.env.URL_API as string;
      try {
         const result = await axios.post(
            url + `/v1/customers/pix/create-immediate-qrcode`,
            {},
            header
         );

         return result;
      } catch (error) {
         const err = error as any;
         console.log(err);

         return {
            status: err.response.status || 400,
            data: err.response.data
               ? err.response.data
               : { status: "ocorreu um erro" },
         };
      }
   }
}
