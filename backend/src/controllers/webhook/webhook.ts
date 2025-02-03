import { Request, Response } from "express";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";
import config from "../../DB/config";
import mysql from "mysql2";
import { taxaRepresentante } from "../../utils/sdk-dubaicash-b2b/types/Transactions";

interface webhookResponse {
   uuid: string;
   bankData: {
      documentNumber: string;
      endtoendId: string;
      key: string | null;
      name: string;
   };
   transaction: {
      transactionId: string;
      uuid: string;
      externalId: string;
      amount: number;
      subType: string;
      type: string;
   };
   status: string;
   event: string;
}

async function webhook(req: Request, res: Response) {
   const webhook_respose = req.body;
   console.log(webhook_respose);

   const externalId = webhook_respose.transaction.externalId;
   const id = externalId.split("/")[0];
   const amount = webhook_respose.transaction.amount;
   const object = webhook_respose.event;

   const conn = mysql.createConnection(config);
   const SDK = new SDK_DubaiCash_B2B();
   const user_info = await SDK.sign.getLoginInfoByUserID(id, conn);
   conn.end();
   if (!user_info)
      return res.status(200).json({ error: "Usuário não encontrado" });

   if (object === "PIX_PAY_IN") {
      const setarSaldo = await SDK.SubContas.addSaldo(id, amount);
      if (!setarSaldo) {
         return res.status(200).json({
            error: "Erro ao adicionar saldo",
         });
      }
   }
   if (object === "PIX_PAY_OUT") {
      const rmSaldo = await SDK.SubContas.rmSaldo(id, amount);
      if (!rmSaldo) {
         return res.status(200).json({
            error: "Erro ao remover saldo",
         });
      }
   }

   //taxas base
   const taxas_string = (
      user_info.cashin_fixo && user_info.cashout_fixo
   ).toString();
   console.log(taxas_string);
   if (!taxas_string) {
      console.log(user_info.user + "| Taxas não cadastradas");
      return res.status(200).json({ error: "Taxas não cadastradas" });
   }

   let tarifa = 0;
   if (object === "PIX_PAY_IN") {
      tarifa =
         user_info.cashin_fixo + (user_info.cashin_porcent * amount) / 100;
   }
   if (object === "PIX_PAY_OUT") {
      tarifa =
         user_info.cashout_fixo + (user_info.cashout_porcent * amount) / 100;
   }
   if (!tarifa) {
      console.log(user_info.user + "| Tarifas de representante zeradas");
      return res.status(200).json({ error: "Tarifas zeradas" });
   }

   const tarifar = await SDK.SubContas.tarifar(id, tarifa);
   if (!tarifar) {
      return res.status(200).json({
         error: "Erro na tarifação",
      });
   }
   console.log(
      `${user_info.user} | Transferencia ${object} tarifado com sucesso: ${tarifa} \n`
   );

   const taxas_representante: taxaRepresentante[] = JSON.parse(
      user_info.taxas_representante
   );

   if (!Array.isArray(taxas_representante)) {
      console.log("taxas_representante não é um array");
      return res
         .status(200)
         .json({ error: "Formato inválido para taxas_representante" });
   }

   for (const taxa of taxas_representante) {
      const user_id = taxa.id;
      const taxas = taxa.taxas;
      let tarifa = 0;
      if (object === "PIX_PAY_IN") {
         tarifa =
            parseFloat(taxas.bank.cashin.fixo) +
            (parseFloat(taxas.bank.cashin.porcentagem) * amount) / 100;
      }
      if (object === "PIX_PAY_OUT") {
         tarifa =
            parseFloat(taxas.bank.cashout.fixo) +
            (parseFloat(taxas.bank.cashout.porcentagem) * amount) / 100;
      }
      if (!tarifa) {
         console.log(user_info.user + "| Tarifas de representante zeradas");
         return res.status(200).json({ error: "Tarifas zeradas" });
      }
      const tarifar = await SDK.SubContas.tarifar(id, tarifa);
      if (!tarifar) {
         return res.status(200).json({
            error: "Erro na tarifação",
         });
      }
      const splitRepresentante = await SDK.SubContas.TranfersRep(
         user_id.toString(),
         tarifa
      );
      if (!splitRepresentante) {
         return res.status(200).json({
            error: "Erro ao adicionar saldo para o representante",
         });
      }

      console.log(
         `${user_info.user} | Transferencia ${object} tarifado com sucesso: ${tarifa} para o representante ${user_id}`
      );
   }

   return res.status(200).json({
      isLogged: true,
   });
}

export default webhook;
