import { Response } from "express";
import axios from "axios";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function consultarChavePix(req: UserRequest, res: Response) {
   const SDK = new SDK_DubaiCash_B2B();
   const key = req.params.key;

   const chavesPix = await SDK.Transactions.ConsultarChave(key);
   console.log(chavesPix);

   return res.status(chavesPix.status || 200).json(chavesPix.data);
}

export default consultarChavePix;
