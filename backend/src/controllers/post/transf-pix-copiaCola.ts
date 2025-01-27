import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import {
   CreateTransfer,
   CreateTransferZod,
} from "../../utils/sdk-dubaicash-b2b/types/Transactions";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function transferirPixCopiaCola(req: UserRequest, res: Response) {
   const emv: string = req.body.emv;
   if (!emv) {
      return res
         .status(400)
         .json({ message: "Informe a chave pix copia e cola" });
   }
   console.log(emv);

   const SDK = new SDK_DubaiCash_B2B();

   const pixCopiaCola = await SDK.Transactions.pixCopiaCola(emv);

   res.status(pixCopiaCola.status || 200).json(pixCopiaCola.data);
}

export default transferirPixCopiaCola;
