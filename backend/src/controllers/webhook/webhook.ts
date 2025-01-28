import { Request, Response } from "express";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function webhook(req: Request, res: Response) {
   const webhook_respose = req.body;
   console.log(webhook_respose);

   const id = webhook_respose.transaction.externalId;
   const externalId = id.split("/")[0];
   const amount = webhook_respose.transaction.amount;
   console.log(webhook_respose.event);

   const SDK = new SDK_DubaiCash_B2B();

   if (webhook_respose.event === "PIX_PAY_IN") {
      const setarSaldo = await SDK.SubContas.addSaldo(externalId, amount);
      console.log(setarSaldo);
      if (!setarSaldo) {
         return res.status(200).json({
            error: "Erro ao adicionar saldo",
         });
      }
   }
   if (webhook_respose.event === "PIX_PAY_OUT") {
      const rmSaldo = await SDK.SubContas.rmSaldo(externalId, amount);
      console.log(rmSaldo);
      if (!rmSaldo) {
         return res.status(200).json({
            error: "Erro ao remover saldo",
         });
      }
   }

   return res.status(200).json({
      isLogged: true,
   });
}

export default webhook;
