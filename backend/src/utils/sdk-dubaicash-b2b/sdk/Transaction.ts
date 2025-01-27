import axios from "axios";
import { sign } from "./sign";
import config from "../../../DB/config";
import mysql from "mysql2";
import { CreateQR, CreateTransfer } from "../types/Transactions";
import { UserRequest } from "../../../interfaces/UserRequest";
import { gerarNumeroAleatorio } from "../../gerarNumeroAleatorio";

export class Transactions {
   private sign: sign;

   constructor(sign: sign) {
      this.sign = sign;
   }

   async pix(
      body: CreateTransfer,
      cpfCnpj?: string
   ): Promise<{ status: number; data: any }> {
      const header = await this.sign.header();
      const url: string = process.env.URL_API as string;
      const document = cpfCnpj;
      try {
         const result = await axios.post(
            url + "/v1/customers/pix/withdraw",
            {
               key: body.key,
               documentNumber: document || "",
               amount: body.amount,
               memo: "Transferência PIX",
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

   async pixCopiaCola(emv: string): Promise<{ status: number; data: any }> {
      const header = await this.sign.header();
      const url: string = process.env.URL_API as string;

      try {
         const result = await axios.post(
            url + "/v1/customers/pix/decode-brcode",
            {
               emv: emv,
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
         console.log(err.response.data);

         return {
            status: err.response.status || 400,
            data: err.response.data
               ? err.response.data
               : { status: "ocorreu um erro" },
         };
      }
   }

   async CreateQR(
      body: CreateQR,
      id?: number,
      cpfCnpj?: string
   ): Promise<{ status: number; data: any }> {
      const header = await this.sign.header();
      const url: string = process.env.URL_API as string;
      const randomNumber = gerarNumeroAleatorio();
      const externalId = id + "/" + randomNumber;
      const document = cpfCnpj;

      try {
         const result = await axios.post(
            url + `/v1/customers/pix/create-immediate-qrcode`,
            {
               externalId: externalId,
               amount: body.amount,
               document: document,
               expire: 3600,
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
   async Extrato(page?: number): Promise<{ status: number; data: any }> {
      const header = await this.sign.header();
      const url: string = process.env.URL_API as string;
      const today = new Date();
      const dateTo = today.toISOString().split("T")[0];

      try {
         const result = await axios.post(
            url + `/v1/customers/account/extract`,
            {
               dateFrom: "2022-01-27",
               dateTo: dateTo,
               limitPerPage: 50,
               page: page || 1,
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
}
