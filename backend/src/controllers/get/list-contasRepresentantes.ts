import { Response } from "express";
import axios from "axios";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function listContasRep(req: UserRequest, res: Response) {
  const SDK = new SDK_DubaiCash_B2B();
  const id = req.id_logins?.toString() || "";

  const contas = await SDK.SubContas.ListContasRep(id);

  return res.status(200).json(contas);
}

export default listContasRep;
