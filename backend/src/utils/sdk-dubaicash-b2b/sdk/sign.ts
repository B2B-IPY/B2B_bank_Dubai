import dotenv from "dotenv";
import { Connection } from "mysql2/typings/mysql/lib/Connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import axios from "axios";
import { SubConta } from "../types/SubContas";
dotenv.config();

export class sign {
   constructor() {}
   async header() {
      const response = await axios.post(
         process.env.URL_API + "/v1/customers/auth/sign-in",
         {
            username: process.env.API_USER,
            password: process.env.API_PASSWORD,
         }
      );

      if (response.data.statusCode != 200)
         throw new Error("Error on get header");
      const access_token = response.data.access_token as string;
      const header = {
         headers: {
            "User-Agent": process.env.APP as string,
            Authorization: "Bearer " + access_token,
         },
      };
      return header;
   }
   private Query(
      sql: string,
      params: any[],
      connection: Connection
   ): Promise<any> {
      return new Promise((resolve, reject) => {
         connection.query<RowDataPacket[]>(sql, params, (error, results) => {
            if (error) {
               return reject(error);
            }
            resolve(results);
         });
      });
   }
   async getLoginInfoByUser(
      user: string,
      connection: Connection
   ): Promise<SubConta[]> {
      try {
         const sql = await this.Query(
            "SELECT * FROM logins WHERE user = ?",
            [user],
            connection
         );
         const data = sql;

         return data;
      } catch (error) {
         throw error;
      }
   }
   async getLoginInfoByUserID(
      id_logins: string,
      connection: Connection
   ): Promise<SubConta> {
      try {
         const sql = await this.Query(
            "SELECT * FROM logins WHERE id_logins = ?",
            [id_logins],
            connection
         );
         const data = sql[0];

         return data;
      } catch (error) {
         throw error;
      }
   }
   async bcrypt(hashedPassword: string, password: string): Promise<boolean> {
      return await bcrypt.compare(password, hashedPassword);
   }

   jwt(
      user: string,
      email: string,
      id_logins: number,
      role: string,
      cashin_fixo: number,
      cashin_porcent: number,
      cashout_fixo: number,
      cashout_porcent: number,
      valor: number,
      cpfCnpj: string,
      nome: string
   ): string {
      const token: string = jwt.sign(
         {
            user,
            email,
            id_logins,
            role,
            cashin_fixo,
            cashin_porcent,
            cashout_fixo,
            cashout_porcent,
            valor,
            cpfCnpj,
            nome,
         },
         process.env.ACCESS_TOKEN_SECRET as string,
         {
            expiresIn: 8000,
         }
      );
      return token;
   }
}
