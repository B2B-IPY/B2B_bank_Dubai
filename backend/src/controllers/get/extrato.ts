import { Response } from "express";
import axios from "axios";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function extrato(req: UserRequest, res: Response) {
   const SDK = new SDK_DubaiCash_B2B();
   const page = parseInt(req.params.page);
   const extrato = await SDK.Transactions.Extrato(page);
   const extratoFiltered = extrato.data.extract.filter((transaction: any) => {
      if (!transaction.data.externalId) return;
      return transaction.data.externalId.split("/")[0] == req.id_logins;
   });
   const extratoPages = extratoFiltered.length;

   return res.status(extratoFiltered.status || 200).json({
      pagination: {
         count: extratoPages,
         page: page,
         perPage: 50,
      },
      data: extratoFiltered,
   });
}

export default extrato;
