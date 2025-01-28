import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import {
   CreateQR,
   CreateQRZod,
} from "../../utils/sdk-dubaicash-b2b/types/Transactions";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function CreateQRcode(req: UserRequest, res: Response) {
   const body: CreateQR = req.body;
   const id = req.id_logins;
   const nome = req.nome;
   const document = req.cpfCnpj?.replace(/[^0-9]/g, "");
   console.log(document);

   const valid = CreateQRZod.safeParse(body);
   if (!valid.success) {
      return res.status(400).json({ error: valid.error.issues[0].message });
   }
   const SDK = new SDK_DubaiCash_B2B();

   const QRcode = await SDK.Transactions.CreateQR(body, id, document);

   res.status(QRcode.status || 200).json(QRcode.data);
}

export default CreateQRcode;
