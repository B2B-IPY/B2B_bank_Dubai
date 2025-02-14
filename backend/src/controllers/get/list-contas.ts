import { Response } from "express";
import axios from "axios";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function listContas(req: UserRequest, res: Response) {
  const SDK = new SDK_DubaiCash_B2B();

  const contas = await SDK.SubContas.ListContas();

  return res.status(200).json(contas);
}

export default listContas;
