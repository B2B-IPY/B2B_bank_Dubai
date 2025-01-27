import { Response } from "express";
import axios from "axios";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function extrato(req: UserRequest, res: Response) {
   const SDK = new SDK_DubaiCash_B2B();
   const page = parseInt(req.params.page);
   const extrato = await SDK.Transactions.Extrato(page);
   console.log(extrato);

   return res.status(extrato.status || 200).json(extrato.data);
}

export default extrato;
