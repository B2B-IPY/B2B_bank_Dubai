import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function balance(req: UserRequest, res: Response) {
  const SDK = new SDK_DubaiCash_B2B();
  const result = await SDK.Account.balance();
  res.status(200).json(result);
}

export default balance;
