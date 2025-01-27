import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import {
   CreateQR,
   CreateQRZod,
} from "../../utils/sdk-dubaicash-b2b/types/Transactions";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function CreateQRcode(req: UserRequest, res: Response) {
   const body: CreateQR = req.body;
   console.log(body);

   const valid = CreateQRZod.safeParse(body);
   if (!valid.success) {
      return res.status(400).json({ error: valid.error.issues[0].message });
   }
   const SDK = new SDK_DubaiCash_B2B();

   const pix = await SDK.Transactions.CreateQR(body);

   res.status(pix.status || 200).json(pix.data);
}

export default CreateQRcode;
