import { Response, NextFunction } from "express";
import SDK_DubaiCash_B2B from "../utils/sdk-dubaicash-b2b";
import mysql from "mysql2";
import config from "../DB/config";
import { UserRequest } from "../interfaces/UserRequest";
import { taxaRepresentante } from "../utils/sdk-dubaicash-b2b/types/Transactions";
export const verifySaldo = async (
   req: UserRequest,
   res: Response,
   next: NextFunction
) => {
   const user = req.user;
   const transactionAmount = req.body.amount;

   if (!user || !transactionAmount) {
      return res.status(400).json({
         message: "ID do usuário e valor da transação são obrigatórios",
      });
   }

   try {
      const conn = mysql.createConnection(config);
      const auth = new SDK_DubaiCash_B2B();
      const data = await auth.sign.getLoginInfoByUser(user, conn);
      conn.end();
      if (!data[0])
         return res.status(404).json({ status: "usuario nao encontrado" });

      const tarifa =
         data[0].cashout_fixo +
         (data[0].cashout_porcent * transactionAmount) / 100;

      const taxas_representante: taxaRepresentante[] = JSON.parse(
         data[0].taxas_representante
      );

      if (!Array.isArray(taxas_representante)) {
         console.log("taxas_representante não é um array");
         return res
            .status(200)
            .json({ error: "Formato inválido para taxas_representante" });
      }

      let tarifa_representante = 0;
      for (const taxa of taxas_representante) {
         const user_id = taxa.id;
         const taxas = taxa.taxas;
         tarifa_representante =
            parseFloat(taxas.bank.cashout.fixo) +
            (parseFloat(taxas.bank.cashout.porcentagem) * transactionAmount) /
               100;
         if (!tarifa) {
            console.log(data[0].user + "| Tarifas de representante zeradas");
            return res.status(200).json({ error: "Tarifas zeradas" });
         }
      }

      const tarifaFinal = tarifa + tarifa_representante + 0.15;
      const valorFinal = transactionAmount + tarifaFinal;
      console.log(valorFinal);

      if (data[0].valor <= valorFinal) {
         return res.status(400).json({ message: "Saldo insuficiente" });
      }

      next();
   } catch (error) {
      return res
         .status(500)
         .json({ message: "Erro interno do servidor", error });
   }
};
