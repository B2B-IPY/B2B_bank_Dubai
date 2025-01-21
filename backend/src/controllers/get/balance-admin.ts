import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function balanceAdmin(req: UserRequest, res: Response) {
  const SDK = new SDK_DubaiCash_B2B();
  const result = await SDK.Account.balance();
  res.status(result.status || 200).json(result.data);
}

export default balanceAdmin;
