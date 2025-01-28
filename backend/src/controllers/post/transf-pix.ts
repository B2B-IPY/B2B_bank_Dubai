import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import {
   CreateTransfer,
   CreateTransferZod,
} from "../../utils/sdk-dubaicash-b2b/types/Transactions";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function transferirPix(req: UserRequest, res: Response) {
   const body: CreateTransfer = req.body;

   const document = req.cpfCnpj?.replace(/[^0-9]/g, "");
   const id = req.id_logins;
   if (!id) return res.status(401).json({ error: "Informe o ID " });

   const valid = CreateTransferZod.safeParse(body);
   if (!valid.success) {
      return res.status(400).json({ error: valid.error.issues[0].message });
   }
   const SDK = new SDK_DubaiCash_B2B();

   const pix = await SDK.Transactions.pix(body, id, document);

   res.status(pix.status || 200).json(pix.data);
}

export default transferirPix;
